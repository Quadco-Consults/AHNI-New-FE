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

// Appraisal type choices (matching backend)
export type AppraisalType =
  | 'Annual performance review'
  | 'Introductory probation review'
  | 'Promotion probation review';

// Cycle period choices (matching backend)
export type CyclePeriod = '3 months' | '12 months';

export interface PerformanceAssesment {
  id?: string;
  description?: string;
  cycle_name?: AppraisalType;  // Changed to use AppraisalType
  cycle_period?: CyclePeriod;   // New field - auto-populated by backend
  employee?: string | Employee;
  employee_name?: string;       // Employee full name from backend
  employee_email?: string;      // Employee email from backend
  employee_job_title?: string;  // Employee job title from backend
  supervisor_name?: string;     // Supervisor name from backend
  supervisor_email?: string;    // Supervisor email from backend
  status?: AssessmentStatus;
  start_date?: string | null;
  end_date?: string | null;
  rating?: string | null;
  final_rating?: number | null;  // Calculated average from all evaluators
  time_stamp?: string;
  evaluators?: Evaluator[];
  goals?: Goal[];
  employee_goals?: Goal[];      // Goals from backend
  competencies?: Competency[];
  created_by?: string;          // Employee who initiated
  created_datetime?: string;
  updated_datetime?: string;
}

export interface Employee {
  id: string;
  legal_firstname?: string;
  legal_lastname?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  job_title?: string;
  job_id?: string;
  department?: string;
  supervisor?: string | User;
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
  title?: string;           // Backend uses 'title'
  description?: string;     // Backend uses 'description'
  status?: string;
  narratives?: Array<{      // Backend uses narratives for sub-goals
    description: string;
    weight: number;
    completed: boolean;
  }>;
  employee?: string;

  // For backward compatibility and display
  goal?: string;            // = title
  competency?: string;      // = description
  weight?: number;          // Percentage weight (calculated from narratives)
  category?: string;

  // For evaluation
  ratings?: GoalRating[];   // Ratings from each evaluator
  average_rating?: number;  // Calculated average

  created_at?: string;
  created_datetime?: string;
  updated_at?: string;
  updated_datetime?: string;
}

export interface Competency {
  id?: string;
  competency: string;
  name?: string; // Alias for competency
  evaluation_category: string;
  category?: string; // Alias for evaluation_category
  weight: string | number;
  rating?: string | number;
  comments?: string;
  description?: string;
  evaluator?: string;
  active?: boolean;
  created_datetime?: string;
  updated_datetime?: string;
}

// Competency ratings - one per evaluator per competency
export interface CompetencyRating {
  id?: string;
  competency_id: string;
  competency_name?: string;
  assessment_id: string;
  evaluator_id: string;
  rating: number; // 1-5 scale
  comments?: string;
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
