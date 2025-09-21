"use client";

import { useParams } from "next/navigation";
import { useGetJobApplication, usePatchJobApplicationShortlisted } from "@/features/hr/controllers/hrJobApplicationsController";
import { Loading } from "components/Loading";
import GoBack from "components/GoBack";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import PdfContent from "components/PdfContent";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCheckIcon } from "lucide-react";

const ApplicationDetail = () => {
  const params = useParams();
  const applicationId = params?.applicationId as string;
  const [isShortlisting, setIsShortlisting] = useState(false);

  const { data, isLoading, refetch } = useGetJobApplication(applicationId);
  const application = data?.data;
  const { patchJobApplicationShortlisted } = usePatchJobApplicationShortlisted(applicationId);

  const handleShortlist = async () => {
    setIsShortlisting(true);
    try {
      await patchJobApplicationShortlisted({
        status: "SHORTLISTED",
      });
      toast.success("Applicant shortlisted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to shortlist applicant");
    } finally {
      setIsShortlisting(false);
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
              {application.status?.toLowerCase() === "applied" && (
                <Button
                  onClick={handleShortlist}
                  disabled={isShortlisting}
                  className="flex items-center gap-2"
                >
                  <CheckCheckIcon className="w-4 h-4" />
                  {isShortlisting ? "Shortlisting..." : "Shortlist"}
                </Button>
              )}
              <Badge
                className={cn(
                  "p-2 rounded-lg capitalize",
                  application.status?.toLowerCase() === "shortlisted"
                    ? "bg-green-50 text-green-500"
                    : application.status?.toLowerCase() === "applied"
                    ? "bg-yellow-50 text-yellow-500"
                    : application.status?.toLowerCase() === "accepted"
                    ? "bg-black text-white"
                    : "bg-blue-50 text-blue-500"
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
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm">{application.applicant_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{application.applicant_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position Applied</label>
                  <p className="text-sm">{application.position_applied}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="text-sm">{application.employment_type}</p>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">References</h2>
              <div className="space-y-4">
                {application.referee_1_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reference 1</label>
                    <p className="text-sm">{application.referee_1_name}</p>
                    <p className="text-sm text-gray-500">{application.referee_1_email}</p>
                  </div>
                )}
                {application.referee_2_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reference 2</label>
                    <p className="text-sm">{application.referee_2_name}</p>
                    <p className="text-sm text-gray-500">{application.referee_2_email}</p>
                  </div>
                )}
                {application.referee_3_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reference 3</label>
                    <p className="text-sm">{application.referee_3_name}</p>
                    <p className="text-sm text-gray-500">{application.referee_3_email}</p>
                  </div>
                )}
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