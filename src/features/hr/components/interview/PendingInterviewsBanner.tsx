"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { formatDate, differenceInDays, isPast, isFuture } from "date-fns";
import { useGetMyPendingInterviews } from "@/features/hr/controllers/hrInterviewController";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { InterviewSchedule } from "@/features/hr/types/interview";

interface PendingInterviewsBannerProps {
  className?: string;
  maxDisplay?: number;
}

const PendingInterviewsBanner = ({
  className = "",
  maxDisplay = 5,
}: PendingInterviewsBannerProps) => {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: pendingData, isLoading } = useGetMyPendingInterviews();
  const pendingInterviews = pendingData?.data || [];

  // Don't show if dismissed or no pending interviews
  if (isDismissed || pendingInterviews.length === 0) {
    return null;
  }

  // Sort interviews by urgency
  const sortedInterviews = [...pendingInterviews].sort((a, b) => {
    const daysA = differenceInDays(new Date(a.start_date), new Date());
    const daysB = differenceInDays(new Date(b.start_date), new Date());
    return daysA - daysB;
  });

  const displayedInterviews = sortedInterviews.slice(0, maxDisplay);
  const remainingCount = pendingInterviews.length - maxDisplay;

  // Check for urgent interviews (within 2 days or overdue)
  const urgentCount = pendingInterviews.filter((interview) => {
    const daysUntil = differenceInDays(new Date(interview.start_date), new Date());
    return daysUntil <= 2 && daysUntil >= 0;
  }).length;

  const overdueCount = pendingInterviews.filter((interview) =>
    isPast(new Date(interview.end_date))
  ).length;

  const handleInterviewClick = (interview: InterviewSchedule) => {
    // Navigate to interview scoring page
    // You'll need to adjust this route based on your app's routing structure
    router.push(`/dashboard/hr/interviews/${interview.id}/score`);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Optionally store dismissal in localStorage
    localStorage.setItem("interviews_banner_dismissed", Date.now().toString());
  };

  const handleViewAll = () => {
    router.push("/dashboard/hr/interviews/my-pending");
  };

  return (
    <Card
      className={`relative border-l-4 ${
        overdueCount > 0
          ? "border-l-red-500 bg-red-50"
          : urgentCount > 0
          ? "border-l-yellow-500 bg-yellow-50"
          : "border-l-blue-500 bg-blue-50"
      } ${className}`}
    >
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`p-3 rounded-lg ${
            overdueCount > 0
              ? "bg-red-100"
              : urgentCount > 0
              ? "bg-yellow-100"
              : "bg-blue-100"
          }`}
        >
          {overdueCount > 0 ? (
            <AlertCircle className="w-6 h-6 text-red-600" />
          ) : urgentCount > 0 ? (
            <Clock className="w-6 h-6 text-yellow-600" />
          ) : (
            <Calendar className="w-6 h-6 text-blue-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            {overdueCount > 0
              ? "Overdue Interview Evaluations"
              : urgentCount > 0
              ? "Urgent Interview Evaluations"
              : "Pending Interview Evaluations"}
          </h3>
          <p className="text-sm text-gray-600">
            You have {pendingInterviews.length} interview{" "}
            {pendingInterviews.length === 1 ? "evaluation" : "evaluations"} awaiting
            your input
            {urgentCount > 0 && (
              <span className="font-medium text-yellow-700">
                {" "}
                ({urgentCount} urgent)
              </span>
            )}
            {overdueCount > 0 && (
              <span className="font-medium text-red-700">
                {" "}
                ({overdueCount} overdue)
              </span>
            )}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Interview List */}
      <div className="space-y-3">
        {displayedInterviews.map((interview) => {
          const daysUntil = differenceInDays(
            new Date(interview.start_date),
            new Date()
          );
          const isOverdue = isPast(new Date(interview.end_date));
          const isUrgent = daysUntil <= 2 && daysUntil >= 0;

          return (
            <div
              key={interview.id}
              className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              onClick={() => handleInterviewClick(interview)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Candidate Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">
                      {interview.application_details?.applicant_name ||
                        "Unknown Candidate"}
                    </h4>
                    {interview.interview_type === "COMMITTEE" && (
                      <Badge className="bg-purple-500 text-white text-xs">
                        Committee
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {interview.application_details?.position || "Unknown Position"}
                  </p>

                  {/* Interview Details */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(new Date(interview.start_date), "dd MMM, yyyy")}
                      </span>
                    </div>

                    {interview.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{interview.location}</span>
                      </div>
                    )}

                    {interview.interview_type === "COMMITTEE" && (
                      <div className="flex items-center gap-1">
                        <span>
                          {interview.completed_evaluations}/{interview.total_interviewers}{" "}
                          evaluations completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col items-end gap-2">
                  {isOverdue ? (
                    <Badge className="bg-red-500 text-white">Overdue</Badge>
                  ) : isUrgent ? (
                    <Badge className="bg-yellow-500 text-white">
                      {daysUntil === 0 ? "Today" : `${daysUntil} days left`}
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500 text-white">
                      {daysUntil} days left
                    </Badge>
                  )}

                  <Button
                    size="sm"
                    className="bg-primary hover:bg-secondary text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInterviewClick(interview);
                    }}
                  >
                    <span className="text-xs">Submit Score</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      {remainingCount > 0 && (
        <>
          <Separator className="my-4" />
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleViewAll}
              className="text-primary hover:bg-primary hover:text-white"
            >
              View All {pendingInterviews.length} Pending Interviews
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}

      {/* Quick Stats Footer */}
      <Separator className="my-4" />
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-white rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {pendingInterviews.length}
          </p>
          <p className="text-xs text-gray-600">Total Pending</p>
        </div>
        <div className="p-2 bg-white rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">{urgentCount}</p>
          <p className="text-xs text-gray-600">Urgent</p>
        </div>
        <div className="p-2 bg-white rounded-lg">
          <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          <p className="text-xs text-gray-600">Overdue</p>
        </div>
      </div>
    </Card>
  );
};

export default PendingInterviewsBanner;
