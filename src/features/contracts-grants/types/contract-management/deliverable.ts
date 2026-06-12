// Deliverable Types

export interface IDeliverable {
  id: string;
  title: string;
  description: string;
  staff_type: 'consultant' | 'facilitator' | 'adhoc_staff';
  staff_type_display: string;
  consultant: string;
  assigned_to_name: string;
  assigned_to_email: string;
  consultant_name: string;  // Deprecated, use assigned_to_name
  consultant_email: string;  // Deprecated, use assigned_to_email
  supervisor: string;
  supervisor_name: string;
  supervisor_email: string;
  deadline: string;
  status: 'pending' | 'completed';
  comments?: string;
  is_overdue: boolean;
  days_until_due: number | null;
  submission_count: number;
  latest_submission: ILatestSubmission | null;
  created_datetime: string;
  updated_datetime: string;
}

export interface IDeliverableDetailed extends IDeliverable {
  consultant_data: IUserSummary;
  supervisor_data: IUserSummary;
  submissions: IDeliverableSubmission[];
}

export interface ILatestSubmission {
  id: string;
  submitted_at: string;
  review_status: 'pending_review' | 'approved' | 'changes_requested';
  has_attachment: boolean;
}

export interface IDeliverableSubmission {
  id: string;
  deliverable: string;
  submitted_by: string;
  submitted_by_name: string;
  submitted_by_email: string;
  submitted_at: string;
  submission_notes?: string;
  attachment?: string;
  attachment_url?: string;
  attachment_name?: string;
  review_status: 'pending_review' | 'approved' | 'changes_requested';
  reviewed_by?: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  review_feedback?: string;
  created_datetime: string;
  updated_datetime: string;
}

export interface IDeliverableSubmissionDetailed extends IDeliverableSubmission {
  deliverable_data: IDeliverable;
  submitted_by_data: IUserSummary;
  reviewed_by_data?: IUserSummary;
}

export interface IUserSummary {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
}

export interface IConsultant {
  id: number;
  name: string;
  email: string;
  contract_start: string | null;
  contract_end: string | null;
  locations?: Array<{id: string; name: string}>;
  cluster?: {id: string; name: string; code: string} | null;
}

// Form Data Types
export interface TDeliverableFormData {
  title: string;
  description: string;
  staff_type: 'consultant' | 'facilitator' | 'adhoc_staff';
  consultant: string;  // Note: This field is used for all staff types despite the name
  deadline: string;
  comments?: string;
}

export interface TDeliverableSubmissionFormData {
  submission_notes?: string;
  attachment?: File;
}

export interface TDeliverableReviewFormData {
  action: 'approve' | 'request_changes';
  feedback?: string;
}

// API Response Types
export interface IDeliverablesListResponse {
  status: boolean;
  message: string;
  data: {
    deliverables: IDeliverable[];
    statistics: {
      total: number;
      pending: number;
      completed: number;
      overdue: number;
      pending_reviews?: number;
    };
  };
}

export interface IDeliverableOverviewResponse {
  status: boolean;
  message: string;
  data: {
    pending_reviews: IPendingReview[];
    overdue_deliverables: IOverdueDeliverable[];
    statistics: {
      total: number;
      pending: number;
      completed: number;
      overdue: number;
      pending_review_count: number;
    };
  };
}

export interface IPendingReview {
  id: string;
  deliverable_id: string;
  deliverable_title: string;
  consultant_name: string;
  submitted_at: string;
  has_attachment: boolean;
}

export interface IOverdueDeliverable {
  id: string;
  title: string;
  consultant_name: string;
  deadline: string;
  days_overdue: number;
}

export interface ISubmissionsListResponse {
  status: boolean;
  message: string;
  data: IDeliverableSubmissionDetailed[];
}

export interface IConsultantsListResponse {
  status: boolean;
  message: string;
  data: IConsultant[];
}
