// Adhoc Staff Requisition Types
import { z } from "zod";

// Requisition Status
export type RequisitionStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CONVERTED_TO_AD"; // When converted to job advertisement

// Staff Type - Removed (Adhoc Staff is standalone)

// Priority Level
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// ===== SCHEMAS =====

export const AdhocRequisitionSchema = z.object({
  // Basic Information
  position_title: z.string().min(1, "Position title is required"),
  requesting_department: z.string().min(1, "Please select department"),
  number_of_positions: z.string().min(1, "Number of positions is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  // Duration & Budget
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  proposed_salary: z.string().min(1, "Proposed salary is required"),
  currency: z.string().default("NGN"),
  project: z.string().min(1, "Please select project"),
  fco: z.string().min(1, "Please select FCO"),
  budget_line: z.string().min(1, "Budget line is required"),
  total_budget: z.string().optional(),

  // Requirements
  qualifications: z.string().min(10, "Qualifications required (min 10 characters)"),
  skills_required: z.string().min(10, "Skills required (min 10 characters)"),
  experience_years: z.string().min(1, "Years of experience required"),
  education_level: z.string().min(1, "Education level is required"),

  // Job Details
  job_description: z.string().min(20, "Job description required (min 20 characters)"),
  key_responsibilities: z.string().min(20, "Key responsibilities required"),
  reporting_to: z.string().min(1, "Please select reporting manager"),
  location: z.string().min(1, "Please select location"),
  work_arrangement: z.enum(["ON_SITE", "REMOTE", "HYBRID"]).optional(),

  // Justification
  business_justification: z.string().min(20, "Business justification required"),
  urgency_reason: z.string().optional(),
  alternative_considered: z.string().optional(),

  // Approval Fields
  reviewer_id: z.string().min(1, "Please select reviewer"),
  authorizer_id: z.string().min(1, "Please select authorizer"),
  approver_id: z.string().min(1, "Please select approver"),

  // Optional
  additional_notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

export type TAdhocRequisitionFormData = z.infer<typeof AdhocRequisitionSchema>;

// ===== API INTERFACES =====

export interface IAdhocRequisitionPayload extends TAdhocRequisitionFormData {
  status?: RequisitionStatus;
}

export interface IAdhocRequisitionPaginatedData {
  id: string;
  requisition_number: string;
  position_title: string;
  requesting_department: {
    id: string;
    name: string;
  };
  requesting_department_name?: string;
  number_of_positions: number;
  priority: PriorityLevel;
  start_date: string;
  end_date: string;
  proposed_salary: string;
  currency: string;
  project: {
    id: string;
    name: string;
    code?: string;
  };
  fco: {
    id: string;
    name: string;
    code?: string;
  };
  budget_line: string;
  status: RequisitionStatus;
  status_display: string;

  // Approval Info
  reviewer_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  authorizer_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  approver_detail?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };

  reviewed_at?: string;
  authorized_at?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;

  // Tracking
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_datetime: string;
  updated_datetime: string;

  // Conversion
  converted_to_advertisement?: boolean;
  advertisement_id?: string;
}

export interface IAdhocRequisitionSingleData extends Omit<IAdhocRequisitionPaginatedData, 'requesting_department'> {
  requesting_department: {
    id: string;
    name: string;
    code?: string;
  };

  // Full Details
  qualifications: string;
  skills_required: string;
  experience_years: number;
  education_level: string;
  job_description: string;
  key_responsibilities: string;
  reporting_to: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    designation?: string;
  };
  location: {
    id: string;
    name: string;
    state?: string;
  };
  work_arrangement?: "ON_SITE" | "REMOTE" | "HYBRID";

  business_justification: string;
  urgency_reason?: string;
  alternative_considered?: string;
  additional_notes?: string;

  attachments?: {
    id: string;
    file_name: string;
    file_url: string;
    uploaded_at: string;
  }[];

  // Approval History
  approval_history: {
    id: string;
    action: "REVIEWED" | "AUTHORIZED" | "APPROVED" | "REJECTED";
    performed_by: {
      id: string;
      first_name: string;
      last_name: string;
    };
    performed_at: string;
    comments?: string;
  }[];
}

// Approval Action Payload
export interface IRequisitionApprovalPayload {
  action: "review" | "authorize" | "approve" | "reject";
  comments?: string;
}

// Filter Params
export interface IAdhocRequisitionFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: RequisitionStatus;
  priority?: PriorityLevel;
  department?: string;
  date_from?: string;
  date_to?: string;
  enabled?: boolean;
}