"use client";

import { useState } from "react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { formatDate } from "date-fns";
import { Loading } from "components/Loading";
import {
  useGetInterviewScores,
  useGetInterviewSummary,
} from "@/features/hr/controllers/hrInterviewController";
import { InterviewScore } from "@/features/hr/types/interview";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InterviewScoreSummaryProps {
  interviewId: string;
  candidateName: string;
  position: string;
}

const InterviewScoreSummary = ({
  interviewId,
  candidateName,
  position,
}: InterviewScoreSummaryProps) => {
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  const { data: scoresData, isLoading: scoresLoading } = useGetInterviewScores(
    interviewId
  );
  const { data: summaryData, isLoading: summaryLoading } =
    useGetInterviewSummary(interviewId);

  const scores = scoresData?.data || [];
  const summary = summaryData?.data;

  if (scoresLoading || summaryLoading) {
    return <Loading />;
  }

  const toggleExpanded = (scoreId: string) => {
    setExpandedScoreId(expandedScoreId === scoreId ? null : scoreId);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Interview Evaluation Summary</h2>
            <p className="text-sm text-gray-600 mt-1">
              {candidateName} - {position}
            </p>
          </div>
          <Badge
            className={
              summary?.completion_percentage === 100
                ? "bg-green-500"
                : "bg-yellow-500"
            }
          >
            {summary?.completion_percentage || 0}% Complete
          </Badge>
        </div>
      </Card>

      {/* Progress Card */}
      <Card>
        <h3 className="font-semibold mb-4">Evaluation Progress</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {summary?.total_interviewers || 0}
            </p>
            <p className="text-sm text-gray-600">Total Interviewers</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {summary?.completed_evaluations || 0}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {summary?.pending_evaluations || 0}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${summary?.completion_percentage || 0}%` }}
          ></div>
        </div>
      </Card>

      {/* Average Scores Card */}
      {summary?.average_scores && (
        <Card>
          <h3 className="font-semibold mb-4">Average Scores</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <p className="text-sm text-gray-600">Overall Average</p>
              <p className="text-3xl font-bold text-purple-600">
                {summary.average_scores.total?.toFixed(1) || 0} / 35
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {summary.average_scores.percentage?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <p className="text-sm text-gray-600">Performance Rating</p>
              <p className="text-2xl font-bold text-blue-600">
                {getPerformanceLabel(summary.average_scores.percentage || 0)}
              </p>
              <div className="flex items-center mt-2">
                <Badge
                  style={{
                    backgroundColor: getPerformanceColor(
                      summary.average_scores.percentage || 0
                    ),
                  }}
                  className="text-white"
                >
                  {summary.average_scores.percentage?.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <h4 className="font-semibold mb-3">Average Scores by Criterion</h4>
          <div className="grid grid-cols-2 gap-4">
            {criteriaList.map((criterion) => {
              const score =
                summary.average_scores?.[
                  criterion.key as keyof typeof summary.average_scores
                ] || 0;
              return (
                <div
                  key={criterion.key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{criterion.label}</p>
                    <p className="text-xs text-gray-600">{criterion.shortDesc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{score.toFixed(1)}</span>
                    <Badge
                      style={{ backgroundColor: getColor(Math.round(score)) }}
                      className="text-white"
                    >
                      {Math.round(score)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Individual Scores */}
      <Card>
        <h3 className="font-semibold mb-4">Individual Evaluations</h3>

        {scores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No evaluations submitted yet</p>
            <p className="text-sm mt-2">
              Waiting for interviewers to submit their scores...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scores.map((score) => (
              <Card key={score.id} className="border border-gray-200">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(score.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">
                        {score.interviewer_name || "Unknown Interviewer"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {score.interviewer_email || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {score.total_score || 0} / 35
                      </p>
                      <p className="text-sm text-gray-600">
                        {score.percentage_score || 0}%
                      </p>
                    </div>

                    <Badge
                      className={
                        score.status === "SUBMITTED"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {score.status}
                    </Badge>

                    {score.preferred_candidate && (
                      <Badge className="bg-purple-500">Preferred</Badge>
                    )}

                    <div>
                      {expandedScoreId === score.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedScoreId === score.id && (
                  <>
                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <div className="text-xs text-gray-500">
                        Submitted on{" "}
                        {score.submitted_at
                          ? formatDate(
                              new Date(score.submitted_at),
                              "dd MMM, yyyy HH:mm"
                            )
                          : "Not submitted"}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Detailed Scores</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Criterion</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Comments</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {criteriaList.map((criterion) => {
                              const ratingField =
                                criterion.ratingField as keyof InterviewScore;
                              const commentsField =
                                criterion.commentsField as keyof InterviewScore;
                              const rating = score[ratingField] as number;
                              const comments = score[commentsField] as string;

                              return (
                                <TableRow key={criterion.key}>
                                  <TableCell className="font-medium">
                                    {criterion.label}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      style={{ backgroundColor: getColor(rating) }}
                                      className="text-white"
                                    >
                                      {rating} / 5
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="max-w-md">
                                    {comments || "No comments"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2">Recommendation</h4>
                        <p className="text-gray-700">
                          {score.recommendation || "No recommendation provided"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const getColor = (rating: number): string => {
  switch (rating) {
    case 1:
      return "#FECDCA"; // Red - Below Average
    case 2:
      return "#F5DEA2"; // Light Orange - Average
    case 3:
      return "#F2BB31"; // Yellow - Good
    case 4:
      return "#BCFBAE"; // Light Green - Very Good
    case 5:
      return "#8DF384"; // Green - Outstanding
    default:
      return "#CCC";
  }
};

const getPerformanceColor = (percentage: number): string => {
  if (percentage >= 90) return "#10B981"; // Excellent - Green
  if (percentage >= 75) return "#8DF384"; // Very Good - Light Green
  if (percentage >= 60) return "#F2BB31"; // Good - Yellow
  if (percentage >= 50) return "#F5DEA2"; // Average - Light Orange
  return "#FECDCA"; // Below Average - Red
};

const getPerformanceLabel = (percentage: number): string => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Very Good";
  if (percentage >= 60) return "Good";
  if (percentage >= 50) return "Average";
  return "Below Average";
};

const criteriaList = [
  {
    key: "appearance",
    label: "Appearance/Poise",
    shortDesc: "Professional demeanor",
    ratingField: "appearance_rating",
    commentsField: "appearance_comments",
  },
  {
    key: "communication",
    label: "Communication",
    shortDesc: "Verbal skills",
    ratingField: "communication_rating",
    commentsField: "communication_comments",
  },
  {
    key: "teamwork",
    label: "Teamwork",
    shortDesc: "Collaboration ability",
    ratingField: "teamwork_rating",
    commentsField: "teamwork_comments",
  },
  {
    key: "ethics",
    label: "Work Ethics",
    shortDesc: "Values alignment",
    ratingField: "ethics_rating",
    commentsField: "ethics_comments",
  },
  {
    key: "analytical",
    label: "Analytical Thinking",
    shortDesc: "Problem solving",
    ratingField: "analytical_rating",
    commentsField: "analytical_comments",
  },
  {
    key: "knowledge",
    label: "NGO Knowledge",
    shortDesc: "Industry awareness",
    ratingField: "knowledge_rating",
    commentsField: "knowledge_comments",
  },
  {
    key: "experience",
    label: "Experience Quality",
    shortDesc: "Relevant background",
    ratingField: "experience_rating",
    commentsField: "experience_comments",
  },
];

export default InterviewScoreSummary;
