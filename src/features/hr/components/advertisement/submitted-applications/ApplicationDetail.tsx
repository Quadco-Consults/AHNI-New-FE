"use client";

import { useParams } from "next/navigation";
import { useGetJobApplication, usePatchJobApplicationShortlisted } from "@/features/hr/controllers/hrJobApplicationsController";
import { Loading } from "@/components/Loading";
import GoBack from "@/components/GoBack";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PdfContent from "@/components/PdfContent";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCheckIcon, ListChecks } from "lucide-react";
import useApiManager from "@/constants/mainController";

const ApplicationDetail = () => {
  const params = useParams();
  const applicationId = params?.applicationId as string;
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading, refetch } = useGetJobApplication(applicationId);
  const application = data?.data;
  const { patchJobApplicationShortlisted } = usePatchJobApplicationShortlisted(applicationId);

  // Longlist hook
  const { callApi: longlistApi } = useApiManager({
    endpoint: `hr/jobs/applications/${applicationId}/longlist/`,
    queryKey: ["job-applications", "job-application"],
    isAuth: true,
    method: "PATCH",
  });

  const handleLonglist = async () => {
    setIsProcessing(true);
    try {
      await longlistApi({});
      toast.success("Applicant longlisted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to longlist applicant");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShortlist = async () => {
    setIsProcessing(true);
    try {
      await patchJobApplicationShortlisted({
        status: "SHORTLISTED",
      });
      toast.success("Applicant shortlisted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to shortlist applicant");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <GoBack />
        <Card className="p-6 text-center">
          <p className="text-gray-500">Application not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBack />

      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Application Details</h1>
            <div className="flex items-center gap-3">
              {/* Longlist button - for APPLIED status */}
              {application.status?.toLowerCase() === "applied" && (
                <Button
                  onClick={handleLonglist}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <ListChecks className="w-4 h-4" />
                  {isProcessing ? "Processing..." : "Longlist"}
                </Button>
              )}

              {/* Shortlist button - for LONGLISTED status */}
              {application.status?.toLowerCase() === "longlisted" && (
                <Button
                  onClick={handleShortlist}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCheckIcon className="w-4 h-4" />
                  {isProcessing ? "Processing..." : "Shortlist"}
                </Button>
              )}

              <Badge
                className={cn(
                  "p-2 rounded-lg capitalize",
                  application.status?.toLowerCase() === "shortlisted"
                    ? "bg-green-50 text-green-500"
                    : application.status?.toLowerCase() === "longlisted"
                    ? "bg-blue-50 text-blue-500"
                    : application.status?.toLowerCase() === "applied"
                    ? "bg-yellow-50 text-yellow-500"
                    : application.status?.toLowerCase() === "accepted"
                    ? "bg-black text-white"
                    : "bg-gray-50 text-gray-500"
                )}
              >
                {application.status}
              </Badge>
            </div>
          </div>

          {/* Applicant Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Applicant Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-sm font-medium">
                    {[application.applicant_first_name, application.applicant_middle_name, application.applicant_last_name]
                      .filter(Boolean)
                      .join(" ") || application.applicant_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{application.applicant_email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{application.phone || application.phone_number || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Home Address</label>
                  <p className="text-sm">{application.home_address || application.address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position Applied</label>
                  <p className="text-sm font-medium">{application.position_applied || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position Location</label>
                  <p className="text-sm">{application.position_location || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="text-sm">
                    <Badge variant="outline" className="capitalize">
                      {application.employment_type || "N/A"}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* Current Employment & References */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Current Employment</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Position</label>
                  <p className="text-sm">{application.current_position || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Employer</label>
                  <p className="text-sm">{application.current_employer || "N/A"}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium mb-3">References</h2>
                <div className="space-y-4">
                  {application.referee_1_name ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">Reference 1</label>
                      <p className="text-sm mt-1">{application.referee_1_name}</p>
                      <p className="text-sm text-gray-500">{application.referee_1_email}</p>
                      {application.referee_1_phone && (
                        <p className="text-sm text-gray-500">{application.referee_1_phone}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No references provided</p>
                  )}
                  {application.referee_2_name && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">Reference 2</label>
                      <p className="text-sm mt-1">{application.referee_2_name}</p>
                      <p className="text-sm text-gray-500">{application.referee_2_email}</p>
                      {application.referee_2_phone && (
                        <p className="text-sm text-gray-500">{application.referee_2_phone}</p>
                      )}
                    </div>
                  )}
                  {application.referee_3_name && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">Reference 3</label>
                      <p className="text-sm mt-1">{application.referee_3_name}</p>
                      <p className="text-sm text-gray-500">{application.referee_3_email}</p>
                      {application.referee_3_phone && (
                        <p className="text-sm text-gray-500">{application.referee_3_phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Cover Letter</h2>
              {application.cover_letter.startsWith('http') ? (
                <PdfContent
                  pdf={{
                    name: "Cover Letter",
                    document: application.cover_letter
                  }}
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{application.cover_letter}</p>
                </div>
              )}
            </div>
          )}

          {/* Resume */}
          {application.resume && (
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Resume</h2>
              <PdfContent
                pdf={{
                  name: "Resume",
                  document: application.resume
                }}
              />
            </div>
          )}

          {/* Application Notes */}
          {application.application_notes && (
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Application Notes</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{application.application_notes}</p>
              </div>
            </div>
          )}

          {/* Interview Information */}
          {(application.interview_date || application.interviewer || application.interview_feedback) && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Interview Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.interview_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Interview Date</label>
                    <p className="text-sm">{new Date(application.interview_date).toLocaleDateString()}</p>
                  </div>
                )}
                {application.interviewer && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Interviewer</label>
                    <p className="text-sm">{application.interviewer}</p>
                  </div>
                )}
              </div>
              {application.interview_feedback && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Interview Feedback</label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-sm whitespace-pre-wrap">{application.interview_feedback}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decision Information */}
          {(application.decision_date || application.decision_made_by) && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Decision Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.decision_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Decision Date</label>
                    <p className="text-sm">{new Date(application.decision_date).toLocaleDateString()}</p>
                  </div>
                )}
                {application.decision_made_by && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Decision Made By</label>
                    <p className="text-sm">{application.decision_made_by}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ApplicationDetail;