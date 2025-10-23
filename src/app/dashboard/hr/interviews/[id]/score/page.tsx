"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetInterview } from "@/features/hr/controllers/hrInterviewController";
import { Loading } from "@/components/Loading";
import Card from "@/components/Card";
import GoBack from "@/components/GoBack";
import InterviewScoreCard from "@/features/hr/components/interview/InterviewScoreCard";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "date-fns";
import { User, Briefcase, Calendar, MapPin } from "lucide-react";

export default function InterviewScorePage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params?.id as string;

  const { data: interviewData, isLoading } = useGetInterview(interviewId);
  const interview = interviewData?.data;

  if (isLoading) {
    return <Loading />;
  }

  if (!interview) {
    return (
      <div className="space-y-6">
        <GoBack />
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Interview not found</p>
          </div>
        </Card>
      </div>
    );
  }

  // Extract applicant information
  const applicantName = interview.application?.applicant_first_name && interview.application?.applicant_last_name
    ? `${interview.application.applicant_first_name} ${interview.application.applicant_middle_name || ''} ${interview.application.applicant_last_name}`.trim()
    : interview.application?.applicant_name || "Unknown Candidate";

  const position = interview.application?.position_applied || interview.application?.position?.name || "Unknown Position";
  const interviewDate = interview.start_date;
  const location = interview.location || "Not specified";

  const handleScoreSubmitted = () => {
    // Redirect back to the advertisement page or interviews list
    router.back();
  };

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Interview Details Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Conduct Interview</h2>
            <Badge variant={interview.interview_type === "committee" ? "default" : "secondary"}>
              {interview.interview_type === "committee" ? "Committee Interview" : "Individual Interview"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Candidate</p>
                <p className="font-semibold">{applicantName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-semibold">{position}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Interview Date</p>
                <p className="font-semibold">
                  {interviewDate ? formatDate(new Date(interviewDate), "dd MMM yyyy, hh:mm a") : "Not scheduled"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{location}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Interview Score Card */}
      <InterviewScoreCard
        interviewId={interviewId}
        candidateName={applicantName}
        position={position}
        interviewDate={interviewDate}
        onScoreSubmitted={handleScoreSubmitted}
      />
    </div>
  );
}
