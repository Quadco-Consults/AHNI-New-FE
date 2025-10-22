// Individual interviewer's score for a candidate
export interface InterviewScore {
  id: string;
  interview_id: string;
  interviewer_id: string;
  interviewer_name?: string;
  interviewer_email?: string;

  // Rating scores (1-5 scale)
  appearance_rating: number;
  appearance_comments: string;
  communication_rating: number;
  communication_comments: string;
  teamwork_rating: number;
  teamwork_comments: string;
  ethics_rating: number;
  ethics_comments: string;
  analytical_rating: number;
  analytical_comments: string;
  knowledge_rating: number;
  knowledge_comments: string;
  experience_rating: number;
  experience_comments: string;

  // Overall evaluation
  preferred_candidate: boolean;
  recommendation: string;
  total_score?: number; // Sum of all ratings
  percentage_score?: number; // (total_score / 35) * 100

  // Metadata
  submitted_at?: string;
  status: 'PENDING' | 'SUBMITTED';
}

// Interview schedule with committee members
export interface InterviewSchedule {
  id: string;
  application: string;
  application_details?: {
    id: string;
    applicant_name: string;
    position: string;
    email: string;
  };
  interview_type: 'COMMITTEE' | 'NON_COMMITTEE';
  interviewers: string[]; // Array of user IDs
  interviewer_details?: Array<{
    id: string;
    full_name: string;
    email: string;
  }>;
  start_date: string;
  end_date: string;
  location?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  // Multi-scorer tracking
  total_interviewers: number;
  completed_evaluations: number;
  pending_evaluations: number;
  evaluation_completion_percentage?: number;

  created_at?: string;
  created_by?: string;
}

// Complete interview data with all scores
export interface Interview {
  id?: string;

  // Candidate information
  candidate_name: string;
  position_applied: string;
  date_of_interview: string;

  // Legacy single-interviewer fields (for backward compatibility)
  appearance_rating: number;
  appearance_comments: string;
  communication_rating: number;
  communication_comments: string;
  teamwork_rating: number;
  teamwork_comments: string;
  ethics_rating: number;
  ethics_comments: string;
  analytical_rating: number;
  analytical_comments: string;
  knowledge_rating: number;
  knowledge_comments: string;
  experience_rating: number;
  experience_comments: string;
  preferred_candidate: boolean;
  recommendation: string;
  interviewer: string;

  // Multi-scorer fields
  interview_type?: 'COMMITTEE' | 'NON_COMMITTEE';
  scores?: InterviewScore[]; // All individual scores
  average_scores?: {
    appearance: number;
    communication: number;
    teamwork: number;
    ethics: number;
    analytical: number;
    knowledge: number;
    experience: number;
    total: number;
    percentage: number;
  };
  total_interviewers?: number;
  completed_evaluations?: number;

  // Schedule reference
  schedule_id?: string;
  schedule?: InterviewSchedule;
}

// Notification payload for interview assignment
export interface InterviewNotification {
  type: 'INTERVIEW_ASSIGNED' | 'INTERVIEW_REMINDER' | 'INTERVIEW_COMPLETED';
  interview_id: string;
  candidate_name: string;
  position: string;
  interview_date: string;
  interview_time: string;
  location?: string;
  recipients: string[]; // User IDs
  send_email: boolean;
  send_calendar_invite: boolean;
}
