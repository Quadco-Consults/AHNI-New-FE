"use client";

import { useParams } from "next/navigation";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Loading } from "components/Loading";
import {
  useGetInterview,
  useGetInterviewScores,
  useGetInterviews,
} from "@/features/hr/controllers/hrInterviewController";
import { useGetJobApplication } from "@/features/hr/controllers/hrJobApplicationsController";
import { formatDate } from "date-fns";

const InterviewedApplicantDetail = () => {
  const params = useParams();
  const applicantId = params?.applicantId as string;
  const advertisementId = params?.id as string;

  console.log("🔍 URL Params:", { applicantId, advertisementId });

  // Fetch applicant details
  const { data: applicantData, isLoading: applicantLoading, error: applicantError } = useGetJobApplication(
    applicantId
  );

  const applicant = applicantData?.data as any;

  console.log("🔍 Applicant API Response:", applicantData);
  console.log("🔍 Applicant data:", applicant);
  console.log("🔍 Applicant Error:", applicantError);
  console.log("🔍 Applicant Loading:", applicantLoading);

  // The interview might be just an ID string or an object with id property
  // Also check for interviewer field as fallback
  const interviewId = typeof applicant?.interview === 'string'
    ? applicant?.interview
    : applicant?.interview?.id
    ? applicant.interview.id
    : typeof applicant?.interviewer === 'string'
    ? applicant?.interviewer
    : applicant?.interviewer?.id;

  console.log("🔍 Interview ID extracted:", interviewId);
  console.log("🔍 Interview field:", applicant?.interview);
  console.log("🔍 Interviewer field:", applicant?.interviewer);

  // Fetch all interviews for this advertisement as a fallback
  const { data: allInterviewsData, isLoading: allInterviewsLoading } = useGetInterviews({
    id: advertisementId,
    size: 1000,
    enabled: !!advertisementId && !interviewId, // Only fetch if we don't have direct interview ID
  });

  // Find the interview for this specific application from all interviews
  const foundInterview = !interviewId && allInterviewsData
    ? (allInterviewsData as any)?.data?.results?.find((interview: any) => {
        if (typeof interview.application === 'string') {
          return interview.application === applicantId;
        }
        if (typeof interview.application === 'object' && interview.application?.id) {
          return interview.application.id === applicantId;
        }
        return false;
      })
    : null;

  const finalInterviewId = interviewId || foundInterview?.id;

  console.log("🔍 Final Interview ID:", finalInterviewId);
  console.log("🔍 Found Interview from search:", foundInterview);

  // Fetch interview details
  const { data: interviewData, isLoading: interviewLoading } = useGetInterview(
    finalInterviewId,
    !!finalInterviewId
  );

  // Fetch all interview scores
  const { data: scoresData, isLoading: scoresLoading } = useGetInterviewScores(
    finalInterviewId,
    !!finalInterviewId
  );

  const interview = interviewData?.data;
  const scores = scoresData?.data || [];

  console.log("🔍 Interview data:", interview);
  console.log("🔍 Scores data:", scores);
  console.log("🔍 Scores length:", scores.length);

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

  const isLoading = applicantLoading || interviewLoading || scoresLoading || allInterviewsLoading;

  if (isLoading) {
    return <Loading />;
  }

  if (!applicant) {
    return (
      <div className="space-y-6">
        <GoBack />
        <div className="text-center py-8">
          <p className="text-gray-500">Applicant not found</p>
        </div>
      </div>
    );
  }

  if (!finalInterviewId && !isLoading) {
    return (
      <div className="space-y-6">
        <GoBack />
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No interview found for this applicant</p>
          <p className="text-sm text-gray-400">
            This applicant may not have been interviewed yet or the interview data is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBack />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interview Details and Scores</h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete evaluation results for this candidate
          </p>
        </div>
      </div>

      {/* Applicant Information */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">
              {applicant.applicant_first_name || applicant.applicant_last_name
                ? `${applicant.applicant_first_name || ""} ${applicant.applicant_middle_name || ""} ${applicant.applicant_last_name || ""}`.trim()
                : applicant.applicant_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{applicant.applicant_email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Position Applied</p>
            <p className="font-medium">{applicant.position_applied || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Interview Date</p>
            <p className="font-medium">
              {interview?.date_of_interview
                ? formatDate(new Date(interview.date_of_interview), "dd MMM, yyyy")
                : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      {/* Average Score Summary */}
      {averageScores && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold mb-4">Average Interview Score</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Total Score</p>
              <p className="text-4xl font-bold text-blue-600">
                {averageScores.totalAverage} <span className="text-xl">/ 35</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Percentage</p>
              <p
                className={`text-4xl font-bold ${getPercentageColor(
                  parseFloat(averageScores.percentageScore)
                )}`}
              >
                {averageScores.percentageScore}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Evaluators</p>
              <p className="text-4xl font-bold text-purple-600">{scores.length}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
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
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="text-sm font-medium">{category.label}</span>
                <Badge
                  className={`${getScoreColor(category.average)} text-white px-3 py-1`}
                >
                  {category.average.toFixed(2)} / 5
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Separator />

      {/* Individual Interviewer Scores */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Individual Interviewer Evaluations
        </h3>
        {scores.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No interview scores available yet
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {scores.map((score: any, index: number) => (
              <Card key={score.id} className="bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">
                      Interviewer {index + 1}
                      {score.interviewer_name && ` - ${score.interviewer_name}`}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {score.interviewer_email || "Email not available"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {score.percentage_score || 0}%
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Score breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <ScoreItem
                    label="Appearance/Corporate Poise"
                    rating={score.appearance_rating}
                    comment={score.appearance_comments}
                  />
                  <ScoreItem
                    label="Oral Communication"
                    rating={score.communication_rating}
                    comment={score.communication_comments}
                  />
                  <ScoreItem
                    label="Supervisory/Teamwork"
                    rating={score.teamwork_rating}
                    comment={score.teamwork_comments}
                  />
                  <ScoreItem
                    label="Work Ethics"
                    rating={score.ethics_rating}
                    comment={score.ethics_comments}
                  />
                  <ScoreItem
                    label="Analytical Thinking"
                    rating={score.analytical_rating}
                    comment={score.analytical_comments}
                  />
                  <ScoreItem
                    label="Knowledge of Issues"
                    rating={score.knowledge_rating}
                    comment={score.knowledge_comments}
                  />
                  <ScoreItem
                    label="Quality/Relevance of Experience"
                    rating={score.experience_rating}
                    comment={score.experience_comments}
                  />
                </div>

                <Separator className="my-4" />

                {/* Overall recommendation */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Overall Recommendation:</p>
                    {score.preferred_candidate && (
                      <Badge className="bg-purple-500 text-white">
                        Preferred Candidate
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                    {score.recommendation || "No recommendation provided"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for score items
const ScoreItem = ({
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
        return "bg-red-100 text-red-700";
      case 2:
        return "bg-orange-100 text-orange-700";
      case 3:
        return "bg-yellow-100 text-yellow-700";
      case 4:
        return "bg-blue-100 text-blue-700";
      case 5:
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-3 rounded border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <Badge className={`${getColor(rating)} px-2 py-1 text-xs`}>
          {rating || 0} / 5
        </Badge>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">
        {comment || "No comments"}
      </p>
    </div>
  );
};

export default InterviewedApplicantDetail;
