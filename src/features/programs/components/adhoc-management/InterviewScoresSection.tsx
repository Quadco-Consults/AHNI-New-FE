"use client";

import { useEffect, useState } from "react";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { LoadingSpinner } from "components/Loading";

interface InterviewScore {
  id: string;
  interviewer_name: string;
  relevant_experience: number;
  project_management: number;
  recent_experience: number;
  comparable_projects: number;
  communication_skills: number;
  technical_skill: number;
  relevant_qualification: number;
  academic_credentials: number;
  timeline_management: number;
  toolset_framework: number;
  total_score: number;
  percentage_score: number;
  submitted_at: string;
}

interface Interview {
  id: string;
  applicant: string;
  committee_members: Array<{ id: string; name: string }>;
  interview_date: string;
  status: string;
}

interface InterviewScoresSectionProps {
  applicantId: string;
}

const CRITERIA_LABELS = [
  { key: "appearance_rating", label: "Appearance", commentKey: "appearance_comments" },
  { key: "communication_rating", label: "Communication", commentKey: "communication_comments" },
  { key: "teamwork_rating", label: "Teamwork", commentKey: "teamwork_comments" },
  { key: "ethics_rating", label: "Ethics", commentKey: "ethics_comments" },
  { key: "analytical_rating", label: "Analytical Skills", commentKey: "analytical_comments" },
  { key: "knowledge_rating", label: "Knowledge", commentKey: "knowledge_comments" },
  { key: "experience_rating", label: "Experience", commentKey: "experience_comments" },
];

export default function InterviewScoresSection({ applicantId }: InterviewScoresSectionProps) {
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [scores, setScores] = useState<InterviewScore[]>([]);
  const [averageScores, setAverageScores] = useState<any>(null);

  useEffect(() => {
    fetchInterviewScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]);

  const fetchInterviewScores = async () => {
    try {
      setLoading(true);

      // Fetch all interviews to find the one for this applicant
      const interviewsResponse = await AxiosWithToken.get('/programs/adhoc/interviews/');
      const allInterviews = interviewsResponse.data?.data?.results || interviewsResponse.data?.data || [];

      // Find interview for this applicant
      const applicantInterview = allInterviews.find((int: any) => {
        const intApplicant = int.applicant;
        const appId = typeof intApplicant === 'string' ? intApplicant : intApplicant?.id;
        return appId === applicantId;
      });

      if (!applicantInterview) {
        console.log('No interview found for this applicant');
        setLoading(false);
        return;
      }

      setInterview(applicantInterview);

      // Fetch all scores for this interview
      const scoresResponse = await AxiosWithToken.get('/programs/adhoc/interview-scores/');
      const allScores = scoresResponse.data?.data?.results || scoresResponse.data?.data || [];

      // Filter scores for this interview
      const interviewScores = allScores.filter((score: any) => {
        const scoreIntId = typeof score.interview === 'string' ? score.interview : score.interview?.id;
        return scoreIntId === applicantInterview.id;
      });

      // Debug: Check if scores match expected format
      if (interviewScores.length > 0) {
        const firstScore = interviewScores[0];
        const calculatedFromCriteria = CRITERIA_LABELS.reduce((sum, { key }) => sum + (parseInt(firstScore[key]) || 0), 0);
        console.log('📊 Score check:', {
          totalScoreFromAPI: firstScore.total_score,
          calculatedFromCriteria,
          criteria: CRITERIA_LABELS.map(({ key }) => ({ [key]: firstScore[key] }))
        });
      }

      setScores(interviewScores);

      // Calculate averages
      if (interviewScores.length > 0) {
        const averages: any = {};
        let totalSum = 0;

        CRITERIA_LABELS.forEach(({ key }) => {
          const sum = interviewScores.reduce((acc: number, score: any) => {
            const value = parseInt(score[key]) || 0;
            return acc + value;
          }, 0);
          const avg = sum / interviewScores.length;
          averages[key] = avg;
          totalSum += avg;
        });

        averages.total = totalSum;
        averages.percentage = (totalSum / 35) * 100; // Max score is 35 (7 criteria × 5 points)

        setAverageScores(averages);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview scores:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (!interview || scores.length === 0) {
    return null; // Don't show section if no interview or scores
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg">Interview Scores</h3>
        <p className="text-sm text-gray-500 mt-1">
          {scores.length} of {interview.committee_members?.length || 0} committee members have submitted scores
        </p>
      </div>

      {/* Average Scores Summary */}
      {averageScores && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-md mb-3">Average Score</h4>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {averageScores.total.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {averageScores.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Percentage</div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Interviewer Scores */}
      <div className="space-y-4">
        <h4 className="font-semibold text-md">Individual Scores</h4>
        {scores.map((score, index) => {
          // Calculate total from individual criteria if total_score is not available
          const calculatedTotal = CRITERIA_LABELS.reduce((sum, { key }) => {
            return sum + (parseInt((score as any)[key]) || 0);
          }, 0);
          const totalScore = score.total_score || calculatedTotal;
          const percentage = (totalScore / 35 * 100).toFixed(0);

          return (
            <div key={score.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium">
                  Interviewer {index + 1}: {score.interviewer_name || 'Anonymous'}
                </h5>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {totalScore}/35
                  </div>
                  <div className="text-sm text-gray-500">
                    {percentage}%
                  </div>
                </div>
              </div>

              {/* Criteria Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {CRITERIA_LABELS.map(({ key, label }) => {
                  const value = parseInt((score as any)[key]) || 0;
                  return (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">{label}</span>
                      <span className="font-medium">{value}/5</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Average Criteria Breakdown */}
      {averageScores && scores.length > 1 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-md mb-3">Average by Criteria</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {CRITERIA_LABELS.map(({ key, label }) => (
              <div key={key} className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-gray-700">{label}</span>
                <span className="font-medium text-green-700">
                  {averageScores[key].toFixed(1)}/5
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
