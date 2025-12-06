"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import { useParams } from "next/navigation";
import DataTable from "components/Table/DataTable";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { Loading } from "components/Loading";
import { useGetInterviews } from "@/features/hr/controllers/hrInterviewController";
import { usePatchJobApplicationAccepted, useGetJobApplications } from "@/features/hr/controllers/hrJobApplicationsController";
import { CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import InterviewAnalysisDetailModal from "@/features/hr/components/advertisement/id/InterviewAnalysisDetailModal";
import { useQueryClient } from "@tanstack/react-query";

interface InterviewWithAnalysis {
  id: string;
  candidate_name: string;
  application: any;
  appearance_rating: number;
  communication_rating: number;
  teamwork_rating: number;
  ethics_rating: number;
  analytical_rating: number;
  knowledge_rating: number;
  experience_rating: number;
  average_score: number;
  percentage_score: number;
  total_interviewers: number;
  completed_evaluations: number;
  scores?: any[];
}

const InterviewTable = () => {
  const params = useParams();
  const paramsID = params?.id as string;
  const { data, isLoading } = useGetInterviews({ id: paramsID });

  // Fetch applications to get application IDs
  const { data: applicationsData, isLoading: applicationsLoading } = useGetJobApplications({
    id: paramsID,
    size: 1000,
  });

  const [selectedInterview, setSelectedInterview] = useState<InterviewWithAnalysis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading || applicationsLoading) {
    return <Loading />;
  }

  const allInterviews = (data?.data as any)?.results || [];
  const allApplications = (applicationsData?.data as any)?.results || [];

  // Debug logging (can be removed in production)
  // console.log("🔍 InterviewTable Debug:");
  // console.log("📋 All interviews:", allInterviews);
  // console.log("📋 All applications:", allApplications);
  // console.log("📊 Total interviews count:", allInterviews.length);

  // Create a map of email -> applicationId for quick lookup
  const emailToApplicationId = new Map();
  allApplications.forEach((app: any) => {
    if (app.applicant_email) {
      emailToApplicationId.set(app.applicant_email, app.id);
    }
  });

  // Filter to only show completed interviews (with actual evaluations)
  const conductedInterviews = allInterviews.filter((interview: any) => {
    // Check for multi-scorer interviews
    const hasScores = (interview.scores && interview.scores.length > 0) ||
                     (interview.interviewer_scores && interview.interviewer_scores.length > 0) ||
                     (interview.completed_evaluations && interview.total_interviewers &&
                      interview.completed_evaluations >= interview.total_interviewers);

    // Debug committee evaluation status
    if (interview.completed_evaluations || interview.total_interviewers) {
      console.log("🎯 Committee Evaluation Status:");
      console.log("📊 Interview ID:", interview.id);
      console.log("📈 Completed Evaluations:", interview.completed_evaluations);
      console.log("👥 Total Interviewers:", interview.total_interviewers);
      console.log("✅ Fully Complete:", interview.completed_evaluations >= interview.total_interviewers);
      console.log("🔍 Has Scores (before fix):", interview.completed_evaluations > 0);
      console.log("🔍 Has Scores (after fix):", hasScores);
      console.log("---");
    }

    // Check for legacy single-scorer interviews
    const hasComments = interview.appearance_comments ||
                       interview.communication_comments ||
                       interview.teamwork_comments ||
                       interview.ethics_comments ||
                       interview.analytical_comments ||
                       interview.knowledge_comments ||
                       interview.experience_comments;

    const hasRecommendation = interview.recommendation && interview.recommendation.trim().length > 0;

    return hasScores || hasComments || hasRecommendation;
  });

  const scheduledInterviews = allInterviews.filter((interview: any) => {
    const hasScores = (interview.scores && interview.scores.length > 0) ||
                     (interview.interviewer_scores && interview.interviewer_scores.length > 0) ||
                     (interview.completed_evaluations && interview.total_interviewers &&
                      interview.completed_evaluations >= interview.total_interviewers);

    const hasComments = interview.appearance_comments ||
                       interview.communication_comments ||
                       interview.teamwork_comments ||
                       interview.ethics_comments ||
                       interview.analytical_comments ||
                       interview.knowledge_comments ||
                       interview.experience_comments;

    const hasRecommendation = interview.recommendation && interview.recommendation.trim().length > 0;

    return !(hasScores || hasComments || hasRecommendation);
  });

  const columns: ColumnDef<InterviewWithAnalysis>[] = [
    {
      header: "Candidate Name",
      accessorKey: "candidate_name",
      size: 250,
      cell: ({ row }) => (
        <p className="font-medium">{row.original.candidate_name || "N/A"}</p>
      ),
    },
    {
      header: "Appearance",
      accessorKey: "appearance_rating",
      size: 100,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.appearance_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Communication",
      accessorKey: "communication_rating",
      size: 120,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.communication_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Teamwork",
      accessorKey: "teamwork_rating",
      size: 100,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.teamwork_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Ethics",
      accessorKey: "ethics_rating",
      size: 100,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.ethics_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Analytical",
      accessorKey: "analytical_rating",
      size: 100,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.analytical_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Knowledge",
      accessorKey: "knowledge_rating",
      size: 100,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.knowledge_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Experience",
      accessorKey: "experience_rating",
      size: 100,
      cell: ({ row }) => (
        <Badge variant="outline" className="w-12 justify-center">
          {Number(row.original.experience_rating || 0).toFixed(1)}
        </Badge>
      ),
    },
    {
      header: "Average",
      accessorKey: "average_score",
      size: 100,
      cell: ({ row }) => (
        <Badge className="bg-blue-500 text-white w-12 justify-center">
          {Number(row.original.average_score || 0).toFixed(2)}
        </Badge>
      ),
    },
    {
      header: "Percentage",
      accessorKey: "percentage_score",
      size: 120,
      cell: ({ row }) => {
        const percentage = Number(row.original.percentage_score) || 0;
        return (
          <Badge
            className={`text-white w-16 justify-center ${
              percentage >= 80
                ? "bg-green-500"
                : percentage >= 60
                ? "bg-blue-500"
                : percentage >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {percentage.toFixed(1)}%
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      id: "actions",
      size: 100,
      cell: ({ row }) => (
        <ActionList
          data={row.original}
          emailToApplicationId={emailToApplicationId}
          onViewDetails={() => {
            setSelectedInterview(row.original);
            setIsModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-start gap-2">
        <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
          <SearchIcon />
          <input
            placeholder="Search"
            type="text"
            className="ml-2 h-6 w-full border-none bg-none focus:outline-none outline-none"
          />
        </span>
        <Button className="shadow-sm" variant="ghost">
          <FilterIcon />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">COMPLETED INTERVIEWS - SCORE ANALYSIS</h4>
        <div className="text-sm text-gray-600">
          <span className="mr-4">📅 Scheduled: {scheduledInterviews.length}</span>
          <span>✅ Completed: {conductedInterviews.length}</span>
        </div>
      </div>
      {conductedInterviews.length > 0 ? (
        <DataTable
          // @ts-ignore
          data={conductedInterviews}
          columns={columns}
          isLoading={false}
        />
      ) : (
        <div className="space-y-6">
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500 mb-2">No completed interview evaluations yet</p>
            <p className="text-sm text-gray-400">
              Interviews will appear here after they have been conducted and scored
            </p>
          </div>

          {/* Show scheduled interviews if any exist */}
          {scheduledInterviews.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">SCHEDULED INTERVIEWS - PENDING EVALUATION</h4>
              <div className="border rounded-md">
                {scheduledInterviews.map((interview: any, index: number) => (
                  <div key={interview.id || index} className="p-4 border-b last:border-b-0 bg-yellow-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{interview.candidate_name || "Candidate"}</p>
                        <p className="text-sm text-gray-600">
                          Interview scheduled - Awaiting evaluation
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Pending Evaluation
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedInterview && (
        <InterviewAnalysisDetailModal
          interview={selectedInterview}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};

const ActionList = ({
  data,
  emailToApplicationId,
  onViewDetails,
}: {
  data: InterviewWithAnalysis;
  emailToApplicationId: Map<string, string>;
  onViewDetails: () => void;
}) => {
  const queryClient = useQueryClient();

  // Try to get application ID from multiple sources:
  // 1. Direct ID from application object
  // 2. Email lookup from the map
  let applicationId: string | undefined;

  if (typeof data.application === 'string') {
    applicationId = data.application;
  } else if (data.application?.id) {
    applicationId = data.application.id;
  } else if (data.application?.applicant_email) {
    // Look up application ID by email
    applicationId = emailToApplicationId.get(data.application.applicant_email);
  }

  const { patchJobApplicationAccepted } = usePatchJobApplicationAccepted(applicationId || "");

  const handleSelectCandidate = async () => {
    if (!applicationId) {
      toast.error("Application ID is missing. Cannot select candidate.");
      return;
    }

    try {
      await patchJobApplicationAccepted({ status: "ACCEPTED" });
      toast.success("Candidate selected successfully! They have been moved to the accepted list.");

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      await queryClient.invalidateQueries({ queryKey: ["interviews"] });
      await queryClient.invalidateQueries({ queryKey: ["combined-application-status"] });
    } catch (error: any) {
      console.error("Error selecting candidate:", error);
      const errorMessage = error?.message || "Failed to select candidate";
      toast.error(`Failed to select candidate: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-2 py-6">
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col items-start justify-between gap-1">
            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
              onClick={onViewDetails}
            >
              <EyeIcon />
              View Details
            </Button>

            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
              onClick={handleSelectCandidate}
            >
              <CheckCheckIcon />
              Select Candidate
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InterviewTable;
