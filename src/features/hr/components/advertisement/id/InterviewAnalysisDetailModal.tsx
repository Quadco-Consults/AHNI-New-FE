"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import Card from "components/Card";
import { Loading } from "components/Loading";
import {
  useGetInterview,
  useGetInterviewScores,
} from "@/features/hr/controllers/hrInterviewController";
import { formatDate } from "date-fns";

interface InterviewAnalysisDetailModalProps {
  interview: {
    id: string;
    candidate_name: string;
    position_applied?: string;
    date_of_interview?: string;
    average_score?: number;
    percentage_score?: number;
    total_interviewers?: number;
    completed_evaluations?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const InterviewAnalysisDetailModal = ({
  interview,
  isOpen,
  onClose,
}: InterviewAnalysisDetailModalProps) => {
  const interviewId = interview.id;

  // Fetch interview details
  const { data: interviewData, isLoading: interviewLoading } = useGetInterview(
    interviewId,
    !!interviewId && isOpen
  );

  // Fetch all interview scores
  const { data: scoresData, isLoading: scoresLoading } = useGetInterviewScores(
    interviewId,
    !!interviewId && isOpen
  );

  const interviewDetails = interviewData?.data;
  const scores = scoresData?.data || [];

  // Calculate average scores from all interviewers
  const calculateAverageScores = () => {
    if (!scores || scores.length === 0) return null;

    const categories = [
      { key: "appearance_rating", label: "Appearance/Corporate Poise" },
      { key: "communication_rating", label: "Oral Communication" },
      { key: "teamwork_rating", label: "Supervisory/Teamwork" },
      { key: "ethics_rating", label: "Work Ethics" },
      { key: "analytical_rating", label: "Analytical Thinking" },
      { key: "knowledge_rating", label: "Knowledge of Issues" },
      { key: "experience_rating", label: "Quality/Relevance of Experience" },
    ];

    const averages = categories.map((category) => {
      const sum = scores.reduce(
        (acc: number, score: any) => acc + (score[category.key] || 0),
        0
      );
      const avg = sum / scores.length;
      return {
        label: category.label,
        average: avg,
        key: category.key,
      };
    });

    const totalAverage = averages.reduce((acc, item) => acc + item.average, 0);
    const percentageScore = ((totalAverage / 35) * 100).toFixed(1);

    return {
      categories: averages,
      totalAverage: totalAverage.toFixed(2),
      percentageScore,
    };
  };

  const averageScores = calculateAverageScores();

  const getScoreColor = (score: number): string => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 3.5) return "bg-blue-500";
    if (score >= 2.5) return "bg-yellow-500";
    if (score >= 1.5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPercentageColor = (percentage: number): string => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const isLoading = interviewLoading || scoresLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Analysis - Detailed View</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-6 mt-4">
            {/* Candidate Information */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Candidate Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{interview.candidate_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position Applied</p>
                  <p className="font-medium">
                    {interview.position_applied || interviewDetails?.position_applied || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Interview Date</p>
                  <p className="font-medium">
                    {interview.date_of_interview || interviewDetails?.date_of_interview
                      ? formatDate(
                          new Date(interview.date_of_interview || interviewDetails?.date_of_interview),
                          "dd MMM, yyyy"
                        )
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Evaluation Status</p>
                  <p className="font-medium">
                    {interview.completed_evaluations || scores.length} of{" "}
                    {interview.total_interviewers || scores.length} completed
                  </p>
                </div>
              </div>
            </Card>

            {/* Final Score Summary */}
            {averageScores && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-lg font-semibold mb-4">Final Interview Score</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Total Score</p>
                    <p className="text-5xl font-bold text-blue-600">
                      {averageScores.totalAverage} <span className="text-2xl">/ 35</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Final Percentage</p>
                    <p
                      className={`text-5xl font-bold ${getPercentageColor(
                        parseFloat(averageScores.percentageScore)
                      )}`}
                    >
                      {averageScores.percentageScore}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Number of Evaluators</p>
                    <p className="text-5xl font-bold text-purple-600">{scores.length}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${averageScores.percentageScore}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            )}

            {/* Category-wise Average Scores */}
            {averageScores && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  Average Scores by Category
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {averageScores.categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                    >
                      <span className="text-sm font-medium">{category.label}</span>
                      <Badge
                        className={`${getScoreColor(category.average)} text-white px-4 py-2 text-base`}
                      >
                        {category.average.toFixed(2)} / 5
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Separator />

            {/* Individual Interviewer Comments and Scores */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Interviewer Comments & Evaluations
              </h3>
              {scores.length === 0 ? (
                <Card>
                  <p className="text-center text-gray-500 py-8">
                    No interview scores available yet
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {scores.map((score: any, index: number) => (
                    <Card key={score.id} className="bg-white border-2">
                      <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div>
                          <h4 className="text-lg font-semibold">
                            Interviewer {index + 1}
                            {score.interviewer_name && ` - ${score.interviewer_name}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {score.interviewer_email || "Email not available"}
                          </p>
                          {score.submitted_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Submitted: {formatDate(new Date(score.submitted_at), "dd MMM, yyyy HH:mm")}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Score</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {score.percentage_score || 0}%
                          </p>
                        </div>
                      </div>

                      {/* Score breakdown with comments */}
                      <div className="space-y-4">
                        <CommentSection
                          label="Appearance/Corporate Poise"
                          rating={score.appearance_rating}
                          comment={score.appearance_comments}
                        />
                        <CommentSection
                          label="Oral Communication"
                          rating={score.communication_rating}
                          comment={score.communication_comments}
                        />
                        <CommentSection
                          label="Supervisory/Teamwork"
                          rating={score.teamwork_rating}
                          comment={score.teamwork_comments}
                        />
                        <CommentSection
                          label="Work Ethics"
                          rating={score.ethics_rating}
                          comment={score.ethics_comments}
                        />
                        <CommentSection
                          label="Analytical Thinking"
                          rating={score.analytical_rating}
                          comment={score.analytical_comments}
                        />
                        <CommentSection
                          label="Knowledge of Issues"
                          rating={score.knowledge_rating}
                          comment={score.knowledge_comments}
                        />
                        <CommentSection
                          label="Quality/Relevance of Experience"
                          rating={score.experience_rating}
                          comment={score.experience_comments}
                        />
                      </div>

                      <Separator className="my-6" />

                      {/* Overall recommendation */}
                      <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">Overall Recommendation:</p>
                          {score.preferred_candidate && (
                            <Badge className="bg-purple-500 text-white px-3 py-1">
                              ⭐ Preferred Candidate
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-800 bg-white p-4 rounded border">
                          {score.recommendation || "No recommendation provided"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper component for comment sections
const CommentSection = ({
  label,
  rating,
  comment,
}: {
  label: string;
  rating: number;
  comment: string;
}) => {
  const getColor = (rating: number): string => {
    switch (rating) {
      case 1:
        return "bg-red-100 text-red-700 border-red-200";
      case 2:
        return "bg-orange-100 text-orange-700 border-orange-200";
      case 3:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 4:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 5:
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="border-l-4 border-blue-400 pl-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <Badge className={`${getColor(rating)} px-3 py-1 border`}>
          {rating || 0} / 5
        </Badge>
      </div>
      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
        {comment || "No comments provided"}
      </p>
    </div>
  );
};

export default InterviewAnalysisDetailModal;
