import { z } from "zod";

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

// Zod Schema for Form Validation
export const AdhocRequisitionSchema = z.object({
  // Basic Information
  position_title: z.string().min(1, "Position title is required"),
  requesting_department: z.string().min(1, "Department is required"),
  number_of_positions: z.coerce.number().min(1, "Must have at least 1 position"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  // Duration & Budget
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  proposed_salary: z.coerce.number().min(0, "Salary must be positive"),
  currency: z.enum(["NGN", "USD", "EUR"]),
  project: z.string().min(1, "Project is required"),
  fco: z.string().min(1, "FCO is required"),
  budget_line: z.string().min(1, "Budget line is required"),
  total_budget: z.coerce.number().optional(),

  // Requirements
  qualifications: z.string().min(1, "Qualifications are required"),
  skills_required: z.string().min(1, "Skills are required"),
  experience_years: z.coerce.number().min(0, "Experience years must be positive"),
  education_level: z.enum([
    "High School",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Professional Certification"
  ]),

  // Job Details
  job_description: z.string().min(1, "Job description is required"),
  key_responsibilities: z.string().min(1, "Key responsibilities are required"),
  reporting_to: z.string().min(1, "Reporting manager is required"),
  location: z.string().min(1, "Location is required"),
  work_arrangement: z.enum(["ON_SITE", "REMOTE", "HYBRID"]).optional(),

  // Justification & Approval
  business_justification: z.string().min(1, "Business justification is required"),
  urgency_reason: z.string().optional(),
  alternative_considered: z.string().optional(),
  reviewer_id: z.string().min(1, "Reviewer is required"),
  authorizer_id: z.string().min(1, "Authorizer is required"),
  approver_id: z.string().min(1, "Approver is required"),
  additional_notes: z.string().optional(),
});

// Form Data Type
export type TAdhocRequisitionFormData = z.infer<typeof AdhocRequisitionSchema>;