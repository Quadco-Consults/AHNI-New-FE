// Adhoc Requisition Types
export type RequisitionStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CONVERTED_TO_AD";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface IAdhocRequisitionPaginatedData {
  id: string;
  requisition_number: string;
  position_title: string;
  requesting_department?: {
    id: string;
    name: string;
  };
  requesting_department_name?: string;
  number_of_positions: number;
  priority: Priority;
  start_date: string;
  status: RequisitionStatus;
  created_datetime: string;
  updated_datetime: string;
}

export interface IAdhocRequisitionSingleData extends IAdhocRequisitionPaginatedData {
  position_description: string;
  justification: string;
  required_skills: string[];
  duration_months: number;
  end_date: string;
  budget_amount?: number;
  currency?: string;
  location?: string;
  reporting_manager?: string;
  employment_type: string;
  education_level: string;
  experience_years: number;
  additional_requirements?: string;
  approval_comments?: string;
  created_by: string;
  updated_by?: string;
}

export interface IAdhocRequisitionCreateData {
  position_title: string;
  position_description: string;
  requesting_department: string;
  number_of_positions: number;
  priority: Priority;
  start_date: string;
  duration_months: number;
  justification: string;
  required_skills: string[];
  budget_amount?: number;
  currency?: string;
  location?: string;
  reporting_manager?: string;
  employment_type: string;
  education_level: string;
  experience_years: number;
  additional_requirements?: string;
}

export interface IAdhocRequisitionUpdateData extends Partial<IAdhocRequisitionCreateData> {
  id: string;
}

export interface IAdhocApprovalData {
  id: string;
  requisition_id: string;
  approver_id: string;
  approval_level: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments?: string;
  approved_at?: string;
  created_datetime: string;
}

export interface IPaginatedResponse<T> {
  data: {
    results: T[];
    paginator: {
      count: number;
      page: number;
      page_size: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

// Additional types needed by the controller
export interface IAdhocRequisitionPayload {
  position_title: string;
  position_description: string;
  requesting_department: string;
  number_of_positions: number;
  priority: Priority;
  start_date: string;
  duration_months: number;
  justification: string;
  required_skills: string[];
  budget_amount?: number;
  currency?: string;
  location?: string;
  reporting_manager?: string;
  employment_type: string;
  education_level: string;
  experience_years: number;
  additional_requirements?: string;
}

export interface IAdhocRequisitionFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: RequisitionStatus;
  priority?: Priority;
  department?: string;
  start_date?: string;
  end_date?: string;
}

export interface IRequisitionApprovalPayload {
  status: "APPROVED" | "REJECTED";
  comments?: string;
}