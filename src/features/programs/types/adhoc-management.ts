import { z } from "zod";

// ============================================
// ADHOC ADVERTISEMENT TYPES
// ============================================

export interface IAdhocAdvertisement {
  id: string;
  advertisement_number: string;
  position_title: string;
  number_of_positions: number;
  grade_level?: string;

  // Project and Department
  project?: {
    id: string;
    title?: string;
    project_id?: string;
    goal?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    location?: any[];
    [key: string]: any;
  };
  department?: {
    id: string;
    name: string;
    description?: string;
  };

  // Location details
  location?: string | {
    id: string;
    name: string;
    city?: string;
    state?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  location_name?: string;
  assignment_location?: string | null;
  health_facility?: string | null;
  spoke_site_name?: string | null;
  lga?: string | null;
  cluster?: string | null;

  // Dates
  start_date: string;
  end_date: string;
  duration_months?: number | null;
  application_deadline?: string | null;
  publication_date?: string;
  closing_date?: string | null;

  // Financial
  proposed_salary: string;
  currency: string;
  budget_line?: string;

  // Requirements and Description
  job_description: string;
  key_responsibilities: string;
  qualifications_required?: string;
  qualifications?: string; // Backward compatibility
  skills_required?: string;
  additional_requirements?: string | null;
  experience_years?: number;
  education_level?: string;

  // Status
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";
  status_display: string;

  // Statistics
  total_applicants?: number;
  shortlisted_applicants?: number;
  shortlisted_count?: number;
  selected_applicants?: number;
  selected_count?: number;
  hired_count?: number;

  // Supervisors and Contact
  supervisor?: string | {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  supervisor_name?: string;
  qmap_backstop?: string | null;
  programs_officer?: string | null;
  stl?: string | null;
  seo?: string | null;

  // Metadata
  created_by?: string | {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_by_name?: string;
  updated_by?: string | null;
  created_datetime: string;
  updated_datetime?: string;
  published_at?: string;
  closed_at?: string;

  // Additional fields
  additional_notes?: string | null;
  is_active?: boolean;

  // Source Requisition
  requisition?: string | {
    id: string;
    requisition_number: string;
    position_title?: string;
  };
  requisition_details?: {
    id: string;
    requisition_number: string;
    position_title: string;
  };
}

export interface IAdhocAdvertisementCreatePayload {
  position_title: string;
  number_of_positions: number;
  project: string;
  location: string;
  health_facility?: string;
  spoke_site_name?: string;
  lga?: string;
  start_date: string;
  end_date: string;
  application_deadline: string;
  proposed_salary: string;
  currency?: string;
  budget_line: string;
  qualifications: string;
  skills_required: string;
  experience_years: number;
  education_level: string;
  job_description: string;
  key_responsibilities: string;
  requisition_id?: string;
}

// ============================================
// ADHOC APPLICANT TYPES
// ============================================

// Individual interviewer's score for an AdHoc applicant
export interface AdhocInterviewScore {
  id: string;
  interview_id: string;
  interviewer_id: string;
  interviewer_name?: string;
  interviewer_email?: string;

  // Rating scores (10 criteria, 1-5 scale - same as consultancy)
  relevant_experience: number;
  project_management: number;
  recent_experience: number;
  comparable_projects: number;
  communication_skills: number;
  technical_skill: number;
  relevant_qualification: number;
  academic_credentials: number;
  timeline_management: number;
  toolset_framework: number;

  // Overall evaluation
  total_score?: number; // Sum of all ratings (max 50)
  percentage_score?: number; // (total_score / 50) * 100

  // Metadata
  submitted_at?: string;
  status: 'PENDING' | 'SUBMITTED';
}

// Interview schedule for AdHoc interviews
export interface AdhocInterviewSchedule {
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
  interview_date: string;
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

export interface IAdhocApplicant {
  id: string;
  application_number: string;
  advertisement: {
    id: string;
    advertisement_number: string;
    position_title: string;
  };

  // Personal Info
  sur_name: string;
  other_names: string;
  name?: string; // Full name for display (computed field)
  email?: string; // Alias for email_address (for compatibility)
  position_under_contract?: string; // Position from advertisement
  type?: "ADHOC" | "CONSULTANT" | "FACILITATOR"; // For filtering compatibility
  contract_request?: any; // For consultancy compatibility
  gender: "MALE" | "FEMALE" | "OTHER";
  date_of_birth: string;
  state_of_origin: string;
  lga_of_origin?: string;
  phone_number: string;
  email_address: string;
  alternative_phone?: string;
  residential_address?: string;

  // Professional Info
  qualifications: string;
  total_experience_years: number;
  current_employer?: string;
  current_position?: string;

  // Assignment Preferences
  preferred_location?: string;
  preferred_health_facility?: string;
  willing_to_relocate: boolean;

  // Application Status
  status: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED" | "CONTRACT_ISSUED" | "APPROVED";
  status_display: string;

  // Legacy Interview (single-interviewer, backward compatibility)
  interview_scheduled_at?: string;
  interview_conducted_at?: string;
  interview_score?: number;
  interview_notes?: string;

  // Multi-scorer Interview Fields
  interview_type?: 'COMMITTEE' | 'NON_COMMITTEE';
  scores?: AdhocInterviewScore[]; // All individual scores
  average_scores?: {
    relevant_experience: number;
    project_management: number;
    recent_experience: number;
    comparable_projects: number;
    communication_skills: number;
    technical_skill: number;
    relevant_qualification: number;
    academic_credentials: number;
    timeline_management: number;
    toolset_framework: number;
    total: number;
    percentage: number;
  };
  total_interviewers?: number;
  completed_evaluations?: number;
  schedule_id?: string;
  schedule?: AdhocInterviewSchedule;

  // Selection
  selected_at?: string;
  selected_by?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  rejection_reason?: string;
  rejected_at?: string;

  // Hiring
  hired_at?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  assigned_health_facility?: string;
  assigned_spoke_site?: string;
  assigned_lga?: string;

  // Contract Acceptance (for contract workflow integration)
  offer_accepted?: boolean;
  offer_acceptance_date?: string;
  contract_issued_at?: string;

  // Documents
  documents: {
    id: string;
    document_type: string;
    file_name: string;
    file_url: string;
    uploaded_at: string;
  }[];

  // Metadata
  applied_at: string;
  updated_at: string;
}

export const AdhocApplicantCreateSchema = z.object({
  advertisement_id: z.string().min(1, "Advertisement is required"),
  sur_name: z.string().min(1, "Surname is required"),
  other_names: z.string().min(1, "Other names are required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  state_of_origin: z.string().min(1, "State of origin is required"),
  lga_of_origin: z.string().optional(),
  phone_number: z.string().min(10, "Valid phone number is required"),
  email_address: z.string().email("Valid email is required"),
  alternative_phone: z.string().optional(),
  residential_address: z.string().optional(),
  qualifications: z.string().min(10, "Qualifications required"),
  total_experience_years: z.number().min(0, "Experience years required"),
  current_employer: z.string().optional(),
  current_position: z.string().optional(),
  preferred_location: z.string().optional(),
  preferred_health_facility: z.string().optional(),
  willing_to_relocate: z.boolean().default(true),
});

export type TAdhocApplicantCreatePayload = z.infer<typeof AdhocApplicantCreateSchema>;

// ============================================
// ADHOC STAFF DATABASE TYPES
// ============================================

export interface IAdhocStaffDatabase {
  id: string;
  staff_number: string;

  // Personal Info
  sur_name: string;
  other_names: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  date_of_birth: string;
  state_of_origin: string;
  lga_of_origin?: string;
  phone_number: string;
  email_address: string;
  alternative_phone?: string;
  residential_address?: string;

  // Professional Info
  designation: string;
  qualifications: string;
  total_experience_years: number;

  // Assignment Details
  project: {
    id: string;
    name: string;
    code?: string;
  };
  health_facility: string;
  spoke_site_name?: string;
  lga: string;
  lga2?: string;
  cluster?: string;

  // Supervisors/Points of Contact
  qmap_backstop?: string;
  programs_officer?: string;
  stl?: string; // State Team Lead
  seo?: string; // State Executing Officer

  // Contract Details
  contract_start_date: string;
  contract_end_date: string;
  contract_type: "FIXED_TERM" | "TEMPORARY" | "PROJECT_BASED";
  salary: string;
  currency: string;
  payment_frequency: "MONTHLY" | "BI_WEEKLY" | "WEEKLY";

  // Bank Details
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  sort_code?: string;

  // Status
  status: "ACTIVE" | "ON_LEAVE" | "SUSPENDED" | "TERMINATED" | "CONTRACT_EXPIRED";
  status_display: string;
  is_active: boolean;

  // Contract Tracking
  contract_expiry_alert: boolean; // True if expiring within 30 days
  days_until_expiry?: number;

  // Payment Tracking
  last_payment_date?: string;
  next_payment_due?: string;
  total_paid?: string;

  // Source Application
  application?: {
    id: string;
    application_number: string;
  };
  advertisement?: {
    id: string;
    advertisement_number: string;
    position_title: string;
  };

  // Metadata
  hired_at: string;
  created_datetime: string;
  updated_datetime: string;
  terminated_at?: string;
  termination_reason?: string;

  // User Account (if created)
  user?: {
    id: string;
    email: string;
    user_type: string;
  };
}

export const AdhocStaffUpdateSchema = z.object({
  phone_number: z.string().optional(),
  email_address: z.string().email().optional(),
  alternative_phone: z.string().optional(),
  residential_address: z.string().optional(),
  health_facility: z.string().optional(),
  spoke_site_name: z.string().optional(),
  lga: z.string().optional(),
  lga2: z.string().optional(),
  cluster: z.string().optional(),
  qmap_backstop: z.string().optional(),
  programs_officer: z.string().optional(),
  stl: z.string().optional(),
  seo: z.string().optional(),
  account_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  sort_code: z.string().optional(),
  status: z.enum(["ACTIVE", "ON_LEAVE", "SUSPENDED", "TERMINATED", "CONTRACT_EXPIRED"]).optional(),
});

export type TAdhocStaffUpdatePayload = z.infer<typeof AdhocStaffUpdateSchema>;

// ============================================
// FILTER PARAMS
// ============================================

export interface IAdhocAdvertisementFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "CLOSED" | "CANCELLED";
  project?: string;
  location?: string;
  is_active?: boolean;
  date_from?: string;
  date_to?: string;
  ordering?: string; // e.g., "-created_datetime" for newest first
  enabled?: boolean;
}

export interface IAdhocApplicantFilterParams {
  page?: number;
  size?: number;
  search?: string;
  advertisement_id?: string;
  status?: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED" | "CONTRACT_ISSUED" | "APPROVED";
  gender?: "MALE" | "FEMALE" | "OTHER";
  state_of_origin?: string;
  date_from?: string;
  date_to?: string;
  enabled?: boolean;
}

export interface IAdhocStaffFilterParams {
  page?: number;
  size?: number;
  search?: string;
  project?: string;
  health_facility?: string;
  lga?: string;
  cluster?: string;
  status?: "ACTIVE" | "ON_LEAVE" | "SUSPENDED" | "TERMINATED" | "CONTRACT_EXPIRED";
  contract_expiring_soon?: boolean; // Within 30 days
  gender?: "MALE" | "FEMALE" | "OTHER";
  state_of_origin?: string;
  enabled?: boolean;
}

// ============================================
// ACTION PAYLOADS
// ============================================

export interface IShortlistApplicantPayload {
  applicant_ids: string[];
  notes?: string;
}

export interface IRejectApplicantPayload {
  applicant_ids: string[];
  rejection_reason: string;
}

export interface IScheduleInterviewPayload {
  applicant_id: string;
  interview_date: string;
  interview_time: string;
  interview_location: string;
  panel_members?: string[];
  notes?: string;
}

export interface IRecordInterviewPayload {
  score: number;
  notes: string;
  recommendation: "HIRE" | "REJECT" | "HOLD";
}

export interface IHireApplicantPayload {
  applicant_id: string;
  contract_start_date: string;
  contract_end_date: string;
  salary: string;
  currency: string;
  payment_frequency: "MONTHLY" | "BI_WEEKLY" | "WEEKLY";
  assigned_health_facility: string;
  assigned_spoke_site?: string;
  assigned_lga: string;
  assigned_lga2?: string;
  assigned_cluster?: string;
  qmap_backstop?: string;
  programs_officer?: string;
  stl?: string;
  seo?: string;
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  sort_code?: string;
}

export interface ITerminateStaffPayload {
  termination_date: string;
  termination_reason: string;
  final_payment_amount?: string;
  notes?: string;
}
