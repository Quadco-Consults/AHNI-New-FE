export interface Interview {
  id?: string;
  candidate_name: string;
  position_applied: string;
  date_of_interview: string;
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
}
