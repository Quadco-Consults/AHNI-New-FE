import { z } from "zod";

// ===== SUPERVISION EVALUATION TYPES =====

export enum SupervisionEvaluationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export const SupervisionEvaluationStatusLabels = {
  [SupervisionEvaluationStatus.PENDING]: "Pending",
  [SupervisionEvaluationStatus.IN_PROGRESS]: "In Progress",
  [SupervisionEvaluationStatus.COMPLETED]: "Completed",
  [SupervisionEvaluationStatus.CANCELLED]: "Cancelled"
};

export enum EvaluationQuestionType {
  YES_NO = "YES_NO",
  RATING = "RATING",
  TEXT = "TEXT",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
}

export enum EvaluationRatingScale {
  POOR = 1,
  FAIR = 2,
  GOOD = 3,
  VERY_GOOD = 4,
  EXCELLENT = 5
}

export const EvaluationRatingLabels = {
  [EvaluationRatingScale.POOR]: "Poor",
  [EvaluationRatingScale.FAIR]: "Fair",
  [EvaluationRatingScale.GOOD]: "Good",
  [EvaluationRatingScale.VERY_GOOD]: "Very Good",
  [EvaluationRatingScale.EXCELLENT]: "Excellent"
};

// ===== INTERFACES =====

export interface ISupervisionEvaluation {
  id: string;

  // Site Visit Linkage
  site_visit_id: string;
  site_visit_title?: string;
  planned_visit_id?: string;

  // Location Information
  location_id: string;
  location_name?: string;
  facility_id?: string;
  facility_name?: string;

  // Evaluation Details
  title: string;
  description?: string;
  evaluation_date: string;
  evaluator_id: string;
  evaluator_name?: string;

  // Categories and Criteria
  selected_categories: string[]; // Evaluation category IDs
  selected_criteria: string[];   // Supervision criteria IDs

  // Evaluation Responses
  responses: IEvaluationResponse[];

  // Scoring and Analysis
  overall_score?: number;
  category_scores: ICategoryScore[];
  recommendations?: string;
  action_items?: IActionItem[];

  // Follow-up Information
  follow_up_required: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;

  // Status and Workflow
  status: SupervisionEvaluationStatus;
  submitted_date?: string;
  completed_date?: string;

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
}

export interface IEvaluationResponse {
  id: string;
  evaluation_id: string;
  criteria_id: string;
  criteria_name?: string;
  category_id: string;
  category_name?: string;

  // Response Data
  question_type: EvaluationQuestionType;
  response_value?: string | number | boolean;
  rating_value?: EvaluationRatingScale;
  text_response?: string;
  comments?: string;

  // Evidence and Documentation
  evidence_files?: string[];
  photos?: string[];

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
}

export interface ICategoryScore {
  category_id: string;
  category_name: string;
  total_questions: number;
  answered_questions: number;
  total_score: number;
  max_possible_score: number;
  percentage_score: number;
  grade?: string; // A, B, C, D, F
}

export interface IActionItem {
  id: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assigned_to?: string;
  assigned_to_name?: string;
  due_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completion_date?: string;
  completion_notes?: string;
}

export interface IEvaluationSummary {
  total_evaluations: number;
  completed_evaluations: number;
  pending_evaluations: number;
  in_progress_evaluations: number;
  average_score: number;
  common_action_items: string[];
  improvement_areas: string[];
}

// ===== API REQUEST/RESPONSE INTERFACES =====

export interface ICreateSupervisionEvaluationRequest {
  site_visit_id: string;
  planned_visit_id?: string;
  title: string;
  description?: string;
  evaluation_date: string;
  selected_categories: string[];
  selected_criteria: string[];
}

export interface IUpdateEvaluationResponseRequest {
  criteria_id: string;
  response_value?: string | number | boolean;
  rating_value?: EvaluationRatingScale;
  text_response?: string;
  comments?: string;
  evidence_files?: File[];
}

export interface ICompleteEvaluationRequest {
  recommendations?: string;
  action_items?: Omit<IActionItem, 'id'>[];
  follow_up_required: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
}

export interface IEvaluationTemplate {
  id: string;
  name: string;
  description?: string;
  categories: {
    id: string;
    name: string;
    criteria: {
      id: string;
      name: string;
      description?: string;
      question_type: EvaluationQuestionType;
      is_required: boolean;
      weight?: number;
    }[];
  }[];
}

// ===== FORM VALIDATION SCHEMAS =====

export const CreateSupervisionEvaluationSchema = z.object({
  site_visit_id: z.string().min(1, "Site visit is required"),
  planned_visit_id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  evaluation_date: z.string().min(1, "Evaluation date is required"),
  selected_categories: z.array(z.string()).min(1, "At least one category is required"),
  selected_criteria: z.array(z.string()).min(1, "At least one criteria is required")
});

export const UpdateEvaluationResponseSchema = z.object({
  criteria_id: z.string().min(1, "Criteria ID is required"),
  response_value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  rating_value: z.nativeEnum(EvaluationRatingScale).optional(),
  text_response: z.string().optional(),
  comments: z.string().optional()
}).refine((data) => {
  // At least one response field must be provided
  return data.response_value !== undefined ||
         data.rating_value !== undefined ||
         data.text_response !== undefined;
}, {
  message: "At least one response value is required",
  path: ["response_value"]
});

export const CompleteEvaluationSchema = z.object({
  recommendations: z.string().optional(),
  action_items: z.array(z.object({
    description: z.string().min(1, "Action item description is required"),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    assigned_to: z.string().optional(),
    due_date: z.string().optional()
  })).optional(),
  follow_up_required: z.boolean(),
  follow_up_date: z.string().optional(),
  follow_up_notes: z.string().optional()
}).refine((data) => {
  if (data.follow_up_required && !data.follow_up_date) {
    return false;
  }
  return true;
}, {
  message: "Follow-up date is required when follow-up is needed",
  path: ["follow_up_date"]
});

// ===== FILTER AND SEARCH INTERFACES =====

export interface ISupervisionEvaluationListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: SupervisionEvaluationStatus | string;
  location_id?: string;
  facility_id?: string;
  evaluator_id?: string;
  evaluation_date_from?: string;
  evaluation_date_to?: string;
  category_id?: string;
  overall_score_min?: number;
  overall_score_max?: number;
}

// ===== DASHBOARD AND ANALYTICS INTERFACES =====

export interface IEvaluationDashboardData {
  overview: IEvaluationSummary;
  recent_evaluations: ISupervisionEvaluation[];
  pending_evaluations: ISupervisionEvaluation[];
  category_performance: Array<{
    category_id: string;
    category_name: string;
    average_score: number;
    evaluation_count: number;
    improvement_trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  }>;
  location_performance: Array<{
    location_id: string;
    location_name: string;
    average_score: number;
    evaluation_count: number;
    last_evaluation_date?: string;
  }>;
  evaluator_activity: Array<{
    evaluator_id: string;
    evaluator_name: string;
    evaluations_completed: number;
    average_score: number;
    last_evaluation_date?: string;
  }>;
}

// ===== EXPORT TYPES =====

export type CreateSupervisionEvaluationFormData = z.infer<typeof CreateSupervisionEvaluationSchema>;
export type UpdateEvaluationResponseFormData = z.infer<typeof UpdateEvaluationResponseSchema>;
export type CompleteEvaluationFormData = z.infer<typeof CompleteEvaluationSchema>;

export type {
  ISupervisionEvaluation,
  IEvaluationResponse,
  ICategoryScore,
  IActionItem,
  IEvaluationSummary,
  ICreateSupervisionEvaluationRequest,
  IUpdateEvaluationResponseRequest,
  ICompleteEvaluationRequest,
  IEvaluationTemplate,
  ISupervisionEvaluationListParams,
  IEvaluationDashboardData
};