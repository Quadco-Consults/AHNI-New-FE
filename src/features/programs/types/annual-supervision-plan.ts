import { z } from "zod";

// ===== ANNUAL SUPERVISION PLAN TYPES =====

export enum AnnualPlanStatus {
  DRAFT = "DRAFT",
  UPLOADED = "UPLOADED",
  UNDER_REVIEW = "UNDER_REVIEW",
  REVIEWED = "REVIEWED",
  UNDER_AUTHORIZATION = "UNDER_AUTHORIZATION",
  AUTHORIZED = "AUTHORIZED",
  UNDER_APPROVAL = "UNDER_APPROVAL",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED"
}

export const AnnualPlanStatusLabels = {
  [AnnualPlanStatus.DRAFT]: "Draft",
  [AnnualPlanStatus.UPLOADED]: "Uploaded",
  [AnnualPlanStatus.UNDER_REVIEW]: "Under Review",
  [AnnualPlanStatus.REVIEWED]: "Reviewed",
  [AnnualPlanStatus.UNDER_AUTHORIZATION]: "Under Authorization",
  [AnnualPlanStatus.AUTHORIZED]: "Authorized",
  [AnnualPlanStatus.UNDER_APPROVAL]: "Under Approval",
  [AnnualPlanStatus.APPROVED]: "Approved",
  [AnnualPlanStatus.ACTIVE]: "Active",
  [AnnualPlanStatus.COMPLETED]: "Completed"
};

export enum PlannedVisitStatus {
  PLANNED = "PLANNED",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export const PlannedVisitStatusLabels = {
  [PlannedVisitStatus.PLANNED]: "Planned",
  [PlannedVisitStatus.SCHEDULED]: "Scheduled",
  [PlannedVisitStatus.IN_PROGRESS]: "In Progress",
  [PlannedVisitStatus.COMPLETED]: "Completed",
  [PlannedVisitStatus.CANCELLED]: "Cancelled"
};

export enum Quarter {
  Q1 = "Q1", // Oct-Dec
  Q2 = "Q2", // Jan-Mar
  Q3 = "Q3", // Apr-Jun
  Q4 = "Q4"  // Jul-Sep
}

export const QuarterLabels = {
  [Quarter.Q1]: "Q1 (Oct-Dec)",
  [Quarter.Q2]: "Q2 (Jan-Mar)",
  [Quarter.Q3]: "Q3 (Apr-Jun)",
  [Quarter.Q4]: "Q4 (Jul-Sep)"
};

// ===== INTERFACES =====

export interface IAnnualSupervisionPlan {
  id: string;
  financial_year_id: string; // Link to system financial year
  financial_year_display?: string; // e.g., "2024-2025"
  title: string;
  description?: string;
  status: AnnualPlanStatus;

  // Upload Information
  uploaded_file_name?: string;
  uploaded_file_url?: string;
  upload_date?: string;
  uploaded_by: string;
  uploaded_by_name?: string;

  // Workflow Assignments
  reviewer_id?: string;
  reviewer_name?: string;
  authorizer_id?: string;
  authorizer_name?: string;
  approver_id?: string;
  approver_name?: string;

  // Auto-generated Statistics
  total_planned_visits: number;
  locations_covered: number;
  facilities_covered: number;
  estimated_total_budget?: number;

  // Progress Tracking
  visits_completed: number;
  visits_in_progress: number;
  visits_cancelled: number;
  completion_percentage: number;

  // Fiscal Year Dates (Auto-populated from financial year)
  start_date: string; // October 1st
  end_date: string;   // September 30th

  // Related Data
  planned_visits: IPlannedVisit[];

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
}

export interface IPlannedVisit {
  id: string;
  annual_plan_id: string;

  // Location Information
  location_id: string;
  location_name?: string;
  location_code?: string;
  facility_id?: string;
  facility_name?: string;

  // Visit Details
  visit_type: 'SUPPORTIVE_SUPERVISION' | 'INTEGRATED_SUPPORTIVE_SUPERVISION' | 'EMERGENCY_SUPPORTIVE_SUPERVISION';

  // Planning Information (from upload)
  planned_quarter?: Quarter;
  estimated_duration_days?: number;
  special_focus_areas?: string;
  comments?: string;

  // Execution Details (populated from Site Visit)
  actual_start_date?: string;
  actual_end_date?: string;
  actual_duration_days?: number;
  assigned_team_members?: string[];
  team_lead_id?: string;
  team_lead_name?: string;

  // Site Visit Link
  site_visit_id?: string;
  site_visit_title?: string;
  site_visit_status?: string;

  // Evaluation Information
  requires_evaluation: boolean;
  evaluation_id?: string;
  evaluation_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  evaluation_completion_date?: string;

  // Status
  status: PlannedVisitStatus;

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
}

// Excel Upload Template Interface
export interface IAnnualPlanUploadRow {
  location_name: string;
  location_code?: string;
  facility_name?: string;
  facility_code?: string;
  visit_type: 'SUPPORTIVE_SUPERVISION' | 'INTEGRATED_SUPPORTIVE_SUPERVISION' | 'EMERGENCY_SUPPORTIVE_SUPERVISION';
  requires_evaluation: 'YES' | 'NO';
  preferred_quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  estimated_duration_days?: number;
  special_focus_areas?: string;
  comments?: string;
}

// Upload Processing Interfaces
export interface IUploadValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validRows: IAnnualPlanUploadRow[];
  invalidRows: Array<{
    row: number;
    data: any;
    errors: string[];
  }>;
  totalRows: number;
  validRowsCount: number;
  message?: string; // Optional message field for validation feedback
}

export interface ILocationMatchResult {
  matched: boolean;
  location_id?: string;
  location_name?: string;
  facility_id?: string;
  facility_name?: string;
  error?: string;
}

// Template Download Result Interface
export interface ITemplateDownloadResult {
  success: boolean;
  filename: string;
  fallback?: boolean;
  message?: string;
}

export interface IUploadProcessingResult {
  success: boolean;
  annual_plan_id?: string;
  message: string;
  statistics: {
    total_uploads: number;
    successful_matches: number;
    failed_matches: number;
    locations_covered: number;
    facilities_covered: number;
  };
  errors?: string[];
  unmatched_locations?: Array<{
    row: number;
    location_name: string;
    facility_name?: string;
    error: string;
  }>;
}

// API Request/Response Interfaces
export interface ICreateAnnualPlanRequest {
  financial_year_id: string;
  title: string;
  description?: string;
  upload_file: File;
  reviewer_id?: string;
  authorizer_id?: string;
  approver_id?: string;
}

// Manual form submission (JSON data, no file)
export interface ICreateAnnualPlanManualRequest {
  financial_year_id: string;
  title: string;
  description?: string;
  planned_visits: IPlannedVisitCreate[];
  reviewer_id?: string;
  authorizer_id?: string;
  approver_id?: string;
}

export interface IPlannedVisitCreate {
  location_id: string;
  location_name: string;
  location_code?: string;
  facility_id?: string;
  facility_name?: string;
  visit_type: string;
  requires_evaluation: boolean;
  preferred_quarter: string;
  duration_days: number;
}

export interface IUpdatePlannedVisitRequest {
  site_visit_id: string;
  actual_start_date: string;
  actual_end_date: string;
  assigned_team_members: string[];
  team_lead_id: string;
}

export interface IAnnualPlanDashboardData {
  current_plan?: IAnnualSupervisionPlan;
  statistics: {
    total_planned: number;
    completed: number;
    in_progress: number;
    pending: number;
    completion_rate: number;
  };
  quarterly_progress: Array<{
    quarter: Quarter;
    planned: number;
    completed: number;
    in_progress: number;
  }>;
  location_coverage: Array<{
    location_id: string;
    location_name: string;
    total_planned: number;
    completed: number;
    completion_rate: number;
  }>;
  recent_completions: IPlannedVisit[];
  upcoming_visits: IPlannedVisit[];
}

// Form Validation Schemas
export const AnnualPlanUploadSchema = z.object({
  financial_year_id: z.string().min(1, "Financial year is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  reviewer_id: z.string().optional(),
  authorizer_id: z.string().optional(),
  approver_id: z.string().optional(),
  upload_file: z.any().refine((file) => file instanceof File, "Upload file is required")
});

export const PlannedVisitUpdateSchema = z.object({
  site_visit_id: z.string().min(1, "Site visit ID is required"),
  actual_start_date: z.string().min(1, "Start date is required"),
  actual_end_date: z.string().min(1, "End date is required"),
  assigned_team_members: z.array(z.string()).min(1, "At least one team member is required"),
  team_lead_id: z.string().min(1, "Team lead is required")
}).refine((data) => {
  return new Date(data.actual_end_date) >= new Date(data.actual_start_date);
}, {
  message: "End date must be after start date",
  path: ["actual_end_date"]
});

// Excel Template Column Definitions
export const EXCEL_TEMPLATE_COLUMNS = [
  { key: 'location_name', header: 'Location Name*', width: 25, required: true },
  { key: 'location_code', header: 'Location Code', width: 15, required: false },
  { key: 'facility_name', header: 'Facility Name', width: 25, required: false },
  { key: 'facility_code', header: 'Facility Code', width: 15, required: false },
  { key: 'visit_type', header: 'Visit Type*', width: 30, required: true },
  { key: 'requires_evaluation', header: 'Requires Evaluation*', width: 20, required: true },
  { key: 'preferred_quarter', header: 'Preferred Quarter', width: 20, required: false },
  { key: 'estimated_duration_days', header: 'Duration (Days)', width: 15, required: false },
  { key: 'special_focus_areas', header: 'Special Focus Areas', width: 30, required: false },
  { key: 'comments', header: 'Comments', width: 30, required: false }
];

// Validation Rules
export const UPLOAD_VALIDATION_RULES = {
  visit_type: ['SUPPORTIVE_SUPERVISION', 'INTEGRATED_SUPPORTIVE_SUPERVISION', 'EMERGENCY_SUPPORTIVE_SUPERVISION'],
  requires_evaluation: ['YES', 'NO'],
  preferred_quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
  max_duration_days: 30,
  min_duration_days: 1
};

// Export Types for easier usage
export type {
  IAnnualSupervisionPlan,
  IPlannedVisit,
  IAnnualPlanUploadRow,
  IUploadValidationResult,
  ILocationMatchResult,
  IUploadProcessingResult,
  ICreateAnnualPlanRequest,
  ICreateAnnualPlanManualRequest,
  IPlannedVisitCreate,
  IUpdatePlannedVisitRequest,
  IAnnualPlanDashboardData
};

export type AnnualPlanUploadFormData = z.infer<typeof AnnualPlanUploadSchema>;
export type PlannedVisitUpdateFormData = z.infer<typeof PlannedVisitUpdateSchema>;