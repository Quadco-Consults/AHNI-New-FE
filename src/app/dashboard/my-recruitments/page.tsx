"use client";

import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Loading } from "@/components/Loading";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, MapPin, Calendar, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface JobAdvertisement {
  id: string;
  title?: string;
  position?: { name: string; id: string };
  locations?: Array<{ name: string }>;
  application_deadline?: string;
  status?: string;
  is_published?: boolean;
  total_applications?: number;
  applied_count?: number;
  longlisted_count?: number;
  shortlisted_count?: number;
  interviewed_count?: number;
  accepted_count?: number;
}

export default function MyRecruitmentsPage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-recruitments"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("hr/jobs/advertisements/my-recruitments/");
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });

  const getPositionName = (ad: JobAdvertisement): string => {
    if (ad.title) return ad.title;
    if (ad.position && typeof ad.position === 'object') return ad.position.name;
    return "Position Not Set";
  };

  const getLocationNames = (ad: JobAdvertisement): string => {
    if (ad.locations && ad.locations.length > 0) {
      return ad.locations.map(loc => loc.name).join(", ");
    }
    return "Not specified";
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Recruitments</h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-red-500">Failed to load recruitments</p>
        </Card>
      </div>
    );
  }

  // Ensure recruitments is always an array
  // Handle double-wrapped response: data.data.data
  const recruitments = Array.isArray(data?.data?.data) ? data.data.data :
                       Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Recruitments</h1>
          <p className="text-gray-600 mt-1">
            Manage applications for positions where you are the hiring manager
          </p>
        </div>
      </div>

      {recruitments.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">No Recruitments Assigned</h2>
          <p className="text-gray-500">
            You are not currently assigned as a hiring manager for any recruitment.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recruitments.map((recruitment: JobAdvertisement) => (
            <Card key={recruitment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {getPositionName(recruitment)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      {getLocationNames(recruitment)}
                    </div>
                  </div>
                  <Badge
                    className={
                      recruitment.is_published
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-50 text-gray-600"
                    }
                  >
                    {recruitment.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>

                {/* Deadline */}
                {recruitment.application_deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Deadline: {format(new Date(recruitment.application_deadline), "MMM d, yyyy")}
                  </div>
                )}

                {/* Application Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {recruitment.total_applications || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total Applications</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {recruitment.longlisted_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Longlisted</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {recruitment.shortlisted_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Shortlisted</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {recruitment.interviewed_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Interviewed</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  onClick={() => router.push(`/dashboard/my-recruitments/${recruitment.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
