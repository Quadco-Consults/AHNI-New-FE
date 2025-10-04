export interface PerformanceAssesmentModel {
  status?: boolean;
  message?: string;
  data?: PerformanceAssesment;
}

// Evaluator type matching OrangeHRM workflow
export type EvaluatorType = 'self' | 'supervisor' | 'peer';

// Assessment status workflow
export type AssessmentStatus =
  | 'draft'              // Employee creating/editing
  | 'pending_self'       // Waiting for self-evaluation
  | 'pending_evaluators' // Waiting for other evaluators
  | 'in_progress'        // Some evaluations submitted
  | 'completed'          // All evaluations done
  | 'approved'           // Final approval by HR/Manager
  | 'cancelled';

export interface PerformanceAssesment {
  id?: string;
  description?: string;
  cycle_name?: string;
  employee?: string | Employee;
  status?: AssessmentStatus;
  start_date?: string | null;
  end_date?: string | null;
  rating?: string | null;
  final_rating?: number | null;  // Calculated average from all evaluators
  time_stamp?: string;
  evaluators?: Evaluator[];
  goals?: Goal[];
  competencies?: Competency[];
  created_by?: string;          // Employee who initiated
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Employee {
  id: string;
  legal_firstname: string;
  legal_lastname: string;
  email?: string;
  job_title?: string;
  department?: string;
}

export interface Evaluator {
  id?: string;
  evaluator: string | User;
  evaluator_type: EvaluatorType;    // Self, Supervisor, or Peer
  status?: 'pending' | 'in_progress' | 'completed';
  submitted_at?: string | null;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Goal ratings - one per evaluator
export interface GoalRating {
  id?: string;
  goal_id: string;
  evaluator_id: string;
  rating: number;           // 1-5 scale
  comments?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Goal {
  id?: string;
  goal: string;
  weight: number;           // Percentage weight
  category?: string;
  ratings?: GoalRating[];   // Ratings from each evaluator
  average_rating?: number;  // Calculated average
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Competency {
  id?: string;
  competency: string;
  evaluation_category: string;
  weight: string;
  rating: string;
  comments: string;
  evaluator?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

// For evaluation submission
export interface EvaluationSubmission {
  assessment_id: string;
  evaluator_id: string;
  goal_ratings: {
    goal_id: string;
    rating: number;
    comments?: string;
  }[];
}
