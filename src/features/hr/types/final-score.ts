/**
 * Final Candidate Score Types
 * Combines Aptitude Test (60%) + Interview (40%) for final evaluation
 */

export type RecommendationType =
  | "RECOMMEND_HIRE"
  | "KIV"
  | "REJECT"
  | "HOLD"
  | "REFER_TO_POSITION"
  | "SCHEDULE_FOLLOW_UP";

export const RECOMMENDATION_LABELS: Record<RecommendationType, string> = {
  RECOMMEND_HIRE: "Recommend for Hire",
  KIV: "Keep in View",
  REJECT: "Reject",
  HOLD: "Hold for End of Interview Process",
  REFER_TO_POSITION: "Refer to Another Position",
  SCHEDULE_FOLLOW_UP: "Schedule Follow-up Interview",
};

export interface FinalCandidateScore {
  id: string;
  application: string;
  applicant_name: string;
  position_applied: string;

  // Test Component (60%)
  aptitude_test_score: number; // Percentage out of 100
  test_weight: number; // Default 60.00
  test_contribution: number; // Calculated: (test_score × test_weight) / 100

  // Interview Component (40%)
  interview_average_score: number; // Average of all interviewers' weighted scores
  interview_weight: number; // Default 40.00
  interview_contribution: number; // Calculated: (interview_avg × interview_weight) / 100

  // Final Score
  final_score: number; // test_contribution + interview_contribution
  passed: boolean; // final_score >= 70%

  // Recommendation
  recommendation?: RecommendationType;
  auto_recommendation?: RecommendationType; // System-generated recommendation
  recommendation_notes?: string;

  // Tracking
  calculated_by?: string;
  calculated_by_details?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  calculated_at?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface InterviewerScoreBreakdown {
  interviewer_name: string;
  interviewer_email: string;
  appearance_rating: number;
  appearance_weight: number;
  communication_rating: number;
  communication_weight: number;
  teamwork_rating: number;
  teamwork_weight: number;
  ethics_rating: number;
  ethics_weight: number;
  analytical_rating: number;
  analytical_weight: number;
  technical_rating: number;
  technical_weight: number;
  knowledge_rating: number;
  knowledge_weight: number;
  experience_rating: number;
  experience_weight: number;
  total_score: number;
  percentage_score: number;
  weighted_score: number;
  preferred_candidate: boolean;
  recommendation?: string;
  submitted_at: string;
}

export interface FinalScoreReport {
  application_id: string;
  applicant_name: string;
  applicant_email: string;
  position_applied: string;
  advertisement_title: string;

  // Test Component
  test_score: number;
  test_weight: number;
  test_contribution: number;

  // Interview Component
  interview_average: number;
  interview_weight: number;
  interview_contribution: number;
  total_interviewers: number;
  individual_interviewer_scores: InterviewerScoreBreakdown[];

  // Final Score
  final_score: number;
  passed: boolean;
  recommendation: string;
  recommendation_notes?: string;
  calculated_by_name: string;
  calculated_at: string;
}

export interface FinalScoreStatistics {
  total_evaluated: number;
  average_final_score: number;
  average_test_score: number;
  average_interview_score: number;
  passed_count: number;
  pass_rate: number; // Percentage
  recommendation_distribution: Array<{
    recommendation: string;
    count: number;
  }>;
  top_performers: Array<{
    applicant_name: string;
    position_applied: string;
    final_score: number;
    test_score: number;
    interview_score: number;
    recommendation: string;
  }>;
}

// Form types
export interface CalculateFinalScoreForm {
  application_id: string;
  test_weight?: number; // Default 60.00
  interview_weight?: number; // Default 40.00
  recommendation?: RecommendationType;
  recommendation_notes?: string;
}

export interface BulkCalculateFinalScoreForm {
  advertisement_id?: string; // Optional: filter by job ad
  application_ids?: string[]; // Optional: specific applications
  test_weight?: number; // Default 60.00
  interview_weight?: number; // Default 40.00
}

export interface UpdateFinalScoreForm {
  recommendation?: RecommendationType;
  recommendation_notes?: string;
}
