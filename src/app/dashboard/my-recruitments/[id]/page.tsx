"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Loading } from "@/components/Loading";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import { Badge } from "@/components/ui/badge";
import ApplicationsTable from "@/features/hr/components/advertisement/table/ApplicationsTable";

interface JobAdvertisement {
  id: string;
  title?: string;
  position?: { name: string };
  locations?: Array<{ name: string }>;
  application_deadline?: string;
  is_published?: boolean;
}

export default function RecruitmentApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const advertisementId = params?.id as string;

  const { data: adData, isLoading: adLoading } = useQuery({
    queryKey: ["job-advertisement", advertisementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`hr/jobs/advertisements/${advertisementId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!advertisementId,
    refetchOnWindowFocus: false,
  });

  const advertisement = adData?.data;

  const getPositionName = (ad: JobAdvertisement): string => {
    if (ad?.title) return ad.title;
    if (ad?.position) return ad.position.name;
    return "Position";
  };

  if (adLoading) {
    return <Loading />;
  }

  if (!advertisement) {
    return (
      <div className="space-y-6">
        <GoBack />
        <Card className="p-6 text-center">
          <p className="text-gray-500">Advertisement not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBack />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {getPositionName(advertisement)}
            </h1>
            <p className="text-gray-600">
              Review and shortlist applications as hiring manager
            </p>
          </div>
          <Badge
            className={
              advertisement.is_published
                ? "bg-green-50 text-green-600"
                : "bg-gray-50 text-gray-600"
            }
          >
            {advertisement.is_published ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Hiring Manager View - Only Longlisted Candidates */}
        <div className="mt-6">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Your task:</strong> Review longlisted candidates below and select those you want to shortlist for interview.
            </p>
          </div>
          <ApplicationsTable
            id={advertisementId}
            status="LONGLISTED"
            isHiringManagerView={true}
          />
        </div>
      </Card>
    </div>
  );
}
