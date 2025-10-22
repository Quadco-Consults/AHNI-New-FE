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
  useGetConsultancyInterviewScores,
  useGetConsultancyInterviewSummary,
} from "@/features/contracts-grants/controllers/consultancyInterviewController";
import { ConsultancyInterviewScore } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ConsultancyScoreSummaryProps {
  interviewId: string;
  candidateName: string;
  position: string;
}

const ConsultancyScoreSummary = ({
  interviewId,
  candidateName,
  position,
}: ConsultancyScoreSummaryProps) => {
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  const { data: scoresData, isLoading: scoresLoading } = useGetConsultancyInterviewScores(
    interviewId
  );
  const { data: summaryData, isLoading: summaryLoading } =
    useGetConsultancyInterviewSummary(interviewId);

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
            <h2 className="text-xl font-semibold">Consultancy Interview Evaluation Summary</h2>
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
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
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
                {summary.average_scores.total?.toFixed(1) || 0} / 50
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {summary.average_scores.percentage?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
              <p className="text-sm text-gray-600">Performance Rating</p>
              <p className="text-2xl font-bold text-pink-600">
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
                        {score.total_score || 0} / 50
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {criteriaList.map((criterion) => {
                              const ratingField =
                                criterion.ratingField as keyof ConsultancyInterviewScore;
                              const rating = score[ratingField] as number;

                              return (
                                <TableRow key={criterion.key}>
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{criterion.label}</p>
                                      <p className="text-xs text-gray-600">
                                        {criterion.description}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      style={{ backgroundColor: getColor(rating) }}
                                      className="text-white"
                                    >
                                      {rating} / 5
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
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
      return "#FECDCA"; // Red - Poor
    case 2:
      return "#F5DEA2"; // Light Orange - Fair
    case 3:
      return "#F2BB31"; // Yellow - Good
    case 4:
      return "#BCFBAE"; // Light Green - Very Good
    case 5:
      return "#8DF384"; // Green - Excellent
    default:
      return "#CCC";
  }
};

const getPerformanceColor = (percentage: number): string => {
  if (percentage >= 90) return "#10B981"; // Excellent - Green
  if (percentage >= 75) return "#8DF384"; // Very Good - Light Green
  if (percentage >= 60) return "#F2BB31"; // Good - Yellow
  if (percentage >= 50) return "#F5DEA2"; // Fair - Light Orange
  return "#FECDCA"; // Poor - Red
};

const getPerformanceLabel = (percentage: number): string => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Very Good";
  if (percentage >= 60) return "Good";
  if (percentage >= 50) return "Fair";
  return "Poor";
};

const criteriaList = [
  {
    key: "relevant_experience",
    label: "1. Relevant Experience",
    shortDesc: "Similar work",
    description: "Has done similar work previously (nature of task)",
    ratingField: "relevant_experience",
  },
  {
    key: "project_management",
    label: "2. Project Management",
    shortDesc: "PM understanding",
    description: "Understands project management and the potential task(s)",
    ratingField: "project_management",
  },
  {
    key: "recent_experience",
    label: "3. Recent Experience",
    shortDesc: "2-3 years",
    description: "Experience is recent (2-3 years)",
    ratingField: "recent_experience",
  },
  {
    key: "comparable_projects",
    label: "4. Comparable Projects",
    shortDesc: "Similar complexity",
    description: "Worked with projects comparable to the AHNI (budget and complexity)",
    ratingField: "comparable_projects",
  },
  {
    key: "communication_skills",
    label: "5. Communication",
    shortDesc: "Verbal skills",
    description: "Excellent Communication Skills",
    ratingField: "communication_skills",
  },
  {
    key: "technical_skill",
    label: "6. Technical Skill",
    shortDesc: "Relevant expertise",
    description: "Relevant Technical Skill",
    ratingField: "technical_skill",
  },
  {
    key: "relevant_qualification",
    label: "7. Qualifications",
    shortDesc: "Relevant degrees",
    description: "Qualifications are relevant to the consultancy",
    ratingField: "relevant_qualification",
  },
  {
    key: "academic_credentials",
    label: "8. Academic Credentials",
    shortDesc: "Strong academics",
    description: "Strong academic credentials",
    ratingField: "academic_credentials",
  },
  {
    key: "timeline_management",
    label: "9. Timeline Management",
    shortDesc: "Meets deadlines",
    description: "Demonstrated ability to manage the project/consultancy timelines",
    ratingField: "timeline_management",
  },
  {
    key: "toolset_framework",
    label: "10. Toolset/Framework",
    shortDesc: "Proven tools",
    description: "Proven toolset and framework",
    ratingField: "toolset_framework",
  },
];

export default ConsultancyScoreSummary;
