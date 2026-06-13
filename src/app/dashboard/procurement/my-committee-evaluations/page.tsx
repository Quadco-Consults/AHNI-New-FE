"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import Link from "next/link";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useSession } from "next-auth/react";

interface AssignedRFP {
  id: string;
  cba_id: string;
  solicitation: {
    id: string;
    title: string;
    rfq_id: string;
    closing_date: string;
    tender_type: string;
  };
  total_submissions: number;
  my_evaluations_completed: number;
  evaluation_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

export default function MyCommitteeEvaluationsPage() {
  const { data: session } = useSession();
  const [assignedRFPs, setAssignedRFPs] = useState<AssignedRFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyAssignedRFPs();
  }, [session]);

  const fetchMyAssignedRFPs = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      // Fetch CBAs where current user is a committee member
      const cbaResponse = await AxiosWithToken.get('/procurements/cbas/', {
        params: {
          committee_member: session.user.id,
          cba_type: 'COMMITTEE',
          page: 1,
          size: 100,
        }
      });

      const cbas = cbaResponse.data?.data?.results || [];

      // For each CBA, get the solicitation and submission count
      const rfpsWithDetails = await Promise.all(
        cbas.map(async (cba: any) => {
          if (!cba.solicitation) return null;

          // Get vendor submissions for this solicitation
          const submissionsResponse = await AxiosWithToken.get('/procurements/vendor-bid-submissions/', {
            params: {
              solicitation: cba.solicitation.id,
            }
          });

          const submissions = submissionsResponse.data?.data?.results || [];

          // Get my evaluations for this CBA
          const myEvaluationsResponse = await AxiosWithToken.get('/procurements/committee-member-evaluations/', {
            params: {
              cba: cba.id,
              member: session.user.id,
            }
          });

          const myEvaluations = myEvaluationsResponse.data?.data?.results || [];
          const completedCount = myEvaluations.filter((e: any) => e.status === 'SUBMITTED').length;

          let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" = "NOT_STARTED";
          if (completedCount === submissions.length && submissions.length > 0) {
            status = "COMPLETED";
          } else if (completedCount > 0) {
            status = "IN_PROGRESS";
          }

          return {
            id: cba.solicitation.id,
            cba_id: cba.id,
            solicitation: cba.solicitation,
            total_submissions: submissions.length,
            my_evaluations_completed: completedCount,
            evaluation_status: status,
          };
        })
      );

      setAssignedRFPs(rfpsWithDetails.filter(Boolean) as AssignedRFP[]);
    } catch (error: any) {
      console.error("Error fetching assigned RFPs:", error);
      toast.error("Failed to load assigned RFPs");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "mdi:check-circle";
      case "IN_PROGRESS":
        return "mdi:clock-outline";
      case "NOT_STARTED":
        return "mdi:alert-circle-outline";
      default:
        return "mdi:help-circle-outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Committee Evaluations</h1>
          <p className="text-gray-600 mt-1">RFP proposals assigned to you for evaluation</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Icon icon="mdi:clipboard-list" className="w-5 h-5 mr-2" />
            {assignedRFPs.length} RFPs Assigned
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Assigned</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{assignedRFPs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon icon="mdi:clipboard-list" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">In Progress</p>
              <p className="text-3xl font-bold text-yellow-700 mt-1">
                {assignedRFPs.filter((r: any) => r.evaluation_status === "IN_PROGRESS").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
              <Icon icon="mdi:clock-outline" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {assignedRFPs.filter((r: any) => r.evaluation_status === "COMPLETED").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Icon icon="mdi:check-circle" className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* RFP List */}
      {assignedRFPs.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon icon="mdi:clipboard-alert-outline" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No RFPs Assigned</h3>
          <p className="text-sm text-gray-500">
            You have not been assigned to any RFP evaluation committees yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignedRFPs.map((rfp) => (
            <Card key={rfp.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{rfp.solicitation.title}</h3>
                    <Badge className={getStatusColor(rfp.evaluation_status)}>
                      <Icon icon={getStatusIcon(rfp.evaluation_status)} className="w-4 h-4 mr-1" />
                      {rfp.evaluation_status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="mdi:identifier" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">{rfp.solicitation.rfq_id}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="mdi:briefcase" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{rfp.solicitation.tender_type}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="mdi:file-document-multiple" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Submissions:</span>
                      <span className="font-medium">{rfp.total_submissions}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Closes:</span>
                      <span className="font-medium">
                        {rfp.solicitation.closing_date
                          ? new Date(rfp.solicitation.closing_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Your Progress</span>
                      <span className="font-medium">
                        {rfp.my_evaluations_completed} / {rfp.total_submissions} evaluated
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${rfp.total_submissions > 0
                            ? (rfp.my_evaluations_completed / rfp.total_submissions) * 100
                            : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="ml-6">
                  <Link href={`/dashboard/procurement/committee-member-evaluation/${rfp.cba_id}?solicitation=${rfp.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Icon icon="mdi:pencil" className="w-4 h-4 mr-2" />
                      {rfp.evaluation_status === "COMPLETED" ? "Review Evaluations" : "Start Evaluation"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
