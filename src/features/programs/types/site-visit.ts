import { z } from "zod";
import { IUser } from "@/features/auth/types/user";
import { TFacilityData } from "definations/modules/program/facility";

// ===== BACKEND-ALIGNED ENUMS AND TYPES =====

// Site Visit Types (Backend Aligned)
export enum SiteVisitType {
  SUPPORTIVE_SUPERVISION = "SUPPORTIVE_SUPERVISION",
  INTEGRATED_SUPPORTIVE_SUPERVISION = "INTEGRATED_SUPPORTIVE_SUPERVISION",
  EMERGENCY_SUPPORTIVE_SUPERVISION = "EMERGENCY_SUPPORTIVE_SUPERVISION",
  STAKEHOLDER_ENGAGEMENT = "STAKEHOLDER_ENGAGEMENT",
  MONITORING_EVALUATION = "MONITORING_EVALUATION",
  TRAINING_WORKSHOP = "TRAINING_WORKSHOP",
  TECHNICAL_ASSISTANCE = "TECHNICAL_ASSISTANCE",
  OTHER = "OTHER"
}

export const SiteVisitTypeLabels = {
  [SiteVisitType.SUPPORTIVE_SUPERVISION]: "Supportive Supervision",
  [SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION]: "Integrated Supportive Supervision",
  [SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION]: "Emergency Supportive Supervision",
  [SiteVisitType.STAKEHOLDER_ENGAGEMENT]: "Stakeholder Engagement",
  [SiteVisitType.MONITORING_EVALUATION]: "Monitoring & Evaluation",
  [SiteVisitType.TRAINING_WORKSHOP]: "Training Workshop",
  [SiteVisitType.TECHNICAL_ASSISTANCE]: "Technical Assistance",
  [SiteVisitType.OTHER]: "Other"
};

// Site Visit Status (Backend Aligned)
export enum SiteVisitStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  REVIEWED = "REVIEWED",
  AUTHORIZED = "AUTHORIZED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EA_GENERATED = "EA_GENERATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export const SiteVisitStatusLabels = {
  [SiteVisitStatus.DRAFT]: "Draft",
  [SiteVisitStatus.SUBMITTED]: "Submitted",
  [SiteVisitStatus.REVIEWED]: "Reviewed",
  [SiteVisitStatus.AUTHORIZED]: "Authorized",
  [SiteVisitStatus.APPROVED]: "Approved",
  [SiteVisitStatus.REJECTED]: "Rejected",
  [SiteVisitStatus.EA_GENERATED]: "EA Generated",
  [SiteVisitStatus.IN_PROGRESS]: "In Progress",
  [SiteVisitStatus.COMPLETED]: "Completed",
  [SiteVisitStatus.CANCELLED]: "Cancelled"
};

// Team Member Roles (Backend Aligned)
export enum TeamMemberRole {
  TEAM_LEAD = "TEAM_LEAD",
  SUPERVISOR = "SUPERVISOR",
  TECHNICAL_EXPERT = "TECHNICAL_EXPERT",
  COORDINATOR = "COORDINATOR",
  OBSERVER = "OBSERVER",
  SUPPORT_STAFF = "SUPPORT_STAFF"
}

export const TeamMemberRoleLabels = {
  [TeamMemberRole.TEAM_LEAD]: "Team Lead",
  [TeamMemberRole.SUPERVISOR]: "Supervisor",
  [TeamMemberRole.TECHNICAL_EXPERT]: "Technical Expert",
  [TeamMemberRole.COORDINATOR]: "Coordinator",
  [TeamMemberRole.OBSERVER]: "Observer",
  [TeamMemberRole.SUPPORT_STAFF]: "Support Staff"
};

// Approval Types (Backend Aligned)
export enum ApprovalType {
  REVIEW = "REVIEW",
  AUTHORIZATION = "AUTHORIZATION",
  APPROVAL = "APPROVAL"
}

export const ApprovalTypeLabels = {
  [ApprovalType.REVIEW]: "Review",
  [ApprovalType.AUTHORIZATION]: "Authorization",
  [ApprovalType.APPROVAL]: "Final Approval"
};

// Approval Status (Backend Aligned)
export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEEDS_REVISION = "NEEDS_REVISION"
}

export const ApprovalStatusLabels = {
  [ApprovalStatus.PENDING]: "Pending",
  [ApprovalStatus.APPROVED]: "Approved",
  [ApprovalStatus.REJECTED]: "Rejected",
  [ApprovalStatus.NEEDS_REVISION]: "Needs Revision"
};

// ===== BACKEND-ALIGNED INTERFACES =====

// Main Site Visit Interface (Backend Aligned)
export interface ISiteVisit {
  // Basic Information
  id: string;
  title: string;
  visit_type: SiteVisitType;
  other_visit_type?: string;
  purpose: string;

  // Location & Address
  location: string;
  location_name?: string;
  specific_address?: string;

  // Timing
  start_date: string;
  end_date: string;
  duration_days?: number;

  // Project & Budget
  project?: string;
  project_title?: string;
  estimated_budget?: number;

  // Status & Workflow
  status: SiteVisitStatus;
  submission_date?: string;

  // Visit Numbering (Auto-generated)
  visit_number_prefix?: string;
  visit_number_month?: string;
  visit_number_sequence?: number;
  full_visit_number?: string;

  // Additional
  special_requirements?: string;
  expected_outcomes?: string;
  comments?: string;

  // Computed Fields
  team_members_count?: number;
  is_approved?: boolean;
  can_generate_ea?: boolean;

  // EA (Environmental Assessment) Fields
  ea_reference?: string;
  ea_created_date?: string;
  ea_created?: boolean;

  // Timestamps
  created_datetime: string;
  updated_datetime: string;
  created_by: string;
  updated_by?: string;
}

// Site Visit Team Member Interface (Backend Aligned)
export interface ISiteVisitTeamMember {
  id: string;
  site_visit: string;
  user: string;
  user_name?: string;
  role: TeamMemberRole;
  visit_number?: string;
  expense_authorization?: string;
  ea_number?: string;
  per_day_allowance?: number;
  transport_cost?: number;
  accommodation_cost?: number;
  total_estimated_cost?: number;
  notification_sent: boolean;
  ea_generated: boolean;
  comments?: string;
  created_datetime: string;
  updated_datetime: string;
}

// Site Visit Approval Interface (Backend Aligned)
export interface ISiteVisitApproval {
  id: string;
  site_visit: string;
  approval_type: ApprovalType;
  approver: string;
  approver_name?: string;
  status: ApprovalStatus;
  approval_date?: string;
  comments?: string;
  rejection_reason?: string;
  notification_sent: boolean;
  reminder_sent: boolean;
  is_pending?: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  needs_revision?: boolean;
  days_pending?: number;
  created_datetime: string;
  updated_datetime: string;
}

// Create Site Visit Request Interface
export interface ICreateSiteVisitRequest {
  title: string;
  visit_type: SiteVisitType;
  other_visit_type?: string;
  purpose: string;
  location: string;
  specific_address?: string;
  start_date: string;
  end_date: string;
  project?: string;
  estimated_budget?: number;
  special_requirements?: string;
  expected_outcomes?: string;
  comments?: string;

  // Travel Fees (calculated automatically)
  travel_fees?: {
    lodging_per_night: number;
    meal_allowance_per_day: number;
    interstate_cost: number;
    airport_taxi: number;
    car_hire: number;
    total_per_person: number;
    team_size: number;
    number_of_nights: number;
    total_cost: number;
    location: string;
  };

  // Team Members (nested)
  team_members: Array<{
    user: string;
    role: TeamMemberRole;
    per_day_allowance?: number;
    transport_cost?: number;
    accommodation_cost?: number;
    comments?: string;
  }>;

  // Approval Workflow
  reviewer: string;
  authorizer: string;
  approver: string;
}

// Update Status Request Interface
export interface IUpdateStatusRequest {
  status: SiteVisitStatus;
  comments?: string;
}

// Approval Action Request Interface
export interface IApprovalActionRequest {
  action: 'APPROVE' | 'REJECT' | 'REQUEST_REVISION';
  comments?: string;
  rejection_reason?: string;
}

// Dashboard Statistics Interface
export interface IDashboardResponse {
  data: {
    total_visits: number;
    by_status: { [status: string]: number };
    by_type: { [type: string]: number };
    recent_visits: ISiteVisit[];
    pending_approvals: number;
    my_pending_visits: ISiteVisit[];
  };
  success: boolean;
}

// Query Parameters for List Requests
export interface ISiteVisitListParams {
  page?: number;
  page_size?: number;
  status?: string;
  visit_type?: string;
  location?: string;
  project?: string;
  start_date?: string;
  search?: string;
  ordering?: string;
}

// Error Response Interface
export interface IErrorResponse {
  error: string;
  details?: {
    field_errors?: { [field: string]: string[] };
    non_field_errors?: string[];
  };
  success: false;
}

// Zod Schema for form validation (Updated)
export const SiteVisitApplicationSchema = z.object({
  title: z.string().min(1, "Travel request title is required"),
  visit_type: z.nativeEnum(SiteVisitType, {
    required_error: "Travel request type is required"
  }),
  other_visit_type: z.string().optional(),
  purpose: z.string().min(1, "Purpose is required"),
  location: z.string().min(1, "Location is required"),
  facility: z.string().optional(),
  state: z.string().min(1, "State is required"),
  lga: z.string().optional(),
  specific_address: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  project: z.string().optional(),
  estimated_budget: z.number().optional(),
  special_requirements: z.string().optional(),
  expected_outcomes: z.string().optional(),
  comments: z.string().optional(),

  // Team Members
  team_members: z.array(z.object({
    user: z.string().min(1, "User is required"),
    role: z.nativeEnum(TeamMemberRole),
    per_day_allowance: z.number().optional(),
    transport_cost: z.number().optional(),
    accommodation_cost: z.number().optional(),
    comments: z.string().optional(),
  })).min(1, "At least one team member is required"),

  // Travel Fees (REQUIRED for all travel requests)
  travel_fees: z.object({
    lodging_per_night: z.number().min(0, "Lodging per night cannot be negative"),
    meal_allowance_per_day: z.number().min(0, "Meal allowance cannot be negative"),
    interstate_cost: z.number().min(0, "Interstate cost cannot be negative"),
    airport_taxi: z.number().min(0, "Airport taxi cost cannot be negative"),
    car_hire: z.number().min(0, "Car hire cost cannot be negative"),
    total_per_person: z.number().min(0, "Total per person cannot be negative"),
    team_size: z.number().min(1, "Team size must be at least 1"),
    number_of_nights: z.number().min(1, "Number of nights must be at least 1"),
    total_cost: z.number().min(0, "Total cost cannot be negative"),
    location: z.string().min(1, "Location is required for travel fee calculation"),
  }),

  // Approval Workflow
  reviewer: z.string().min(1, "Reviewer is required"),
  authorizer: z.string().min(1, "Authorizer is required"),
  approver: z.string().min(1, "Approver is required"),
}).refine((data) => {
  // If visit type is "OTHER", other_visit_type is required
  if (data.visit_type === SiteVisitType.OTHER) {
    return data.other_visit_type && data.other_visit_type.trim().length > 0;
  }
  return true;
}, {
  message: "Description is required when visit type is 'Other'",
  path: ["other_visit_type"]
}).refine((data) => {
  // For supportive supervision visits, facility is required
  const isSupportiveSupervision = data.visit_type === SiteVisitType.SUPPORTIVE_SUPERVISION ||
                                  data.visit_type === SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION ||
                                  data.visit_type === SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION;

  if (isSupportiveSupervision) {
    return data.facility && data.facility.trim().length > 0 && data.facility !== "no-facility";
  }
  return true;
}, {
  message: "Facility selection is required for supportive supervision visits",
  path: ["facility"]
}).refine((data) => {
  // End date should be after start date
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"]
});

export type TSiteVisitApplicationFormValues = z.infer<typeof SiteVisitApplicationSchema>;

// Site Visit Report Interface (Keeping existing for compatibility)
export interface ISiteVisitReport {
  id: string;
  site_visit: ISiteVisit;
  report_title: string;
  executive_summary: string;
  objectives_met: string;
  challenges_encountered?: string;
  recommendations: string;
  next_steps?: string;
  attachments?: string[];
  submitted_by: IUser;
  submitted_date: string;
  created_datetime: string;
  updated_datetime: string;
}

// Paginated Response Interface (Updated)
export interface TSiteVisitPaginatedData {
  id: string;
  title: string;
  visit_type: SiteVisitType;
  location: string;
  location_name?: string;
  start_date: string;
  end_date: string;
  status: SiteVisitStatus;
  team_members_count: number;
  full_visit_number?: string;
  created_by: string;
  created_datetime: string;
  updated_datetime: string;
}

// Location/Facility Selection Interface (Keeping existing for compatibility)
export interface ISiteVisitLocation {
  id: string;
  name: string;
  state: string;
  lga?: string;
  facility_type?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Status Transition Rules for Frontend Validation
export const allowedTransitions: { [key in SiteVisitStatus]: SiteVisitStatus[] } = {
  [SiteVisitStatus.DRAFT]: [SiteVisitStatus.SUBMITTED, SiteVisitStatus.CANCELLED],
  [SiteVisitStatus.SUBMITTED]: [SiteVisitStatus.IN_PROGRESS, SiteVisitStatus.CANCELLED],
  [SiteVisitStatus.REVIEWED]: [SiteVisitStatus.CANCELLED],
  [SiteVisitStatus.AUTHORIZED]: [SiteVisitStatus.CANCELLED],
  [SiteVisitStatus.APPROVED]: [SiteVisitStatus.IN_PROGRESS],
  [SiteVisitStatus.EA_GENERATED]: [SiteVisitStatus.IN_PROGRESS, SiteVisitStatus.CANCELLED],
  [SiteVisitStatus.IN_PROGRESS]: [SiteVisitStatus.COMPLETED],
  [SiteVisitStatus.COMPLETED]: [],
  [SiteVisitStatus.CANCELLED]: []
};

// Export Legacy Types for Backward Compatibility
export type {
  TSiteVisitApplicationFormValues as SiteVisitFormData,
  ISiteVisit as SiteVisitData,
  ISiteVisit as SiteVisit,
  TSiteVisitPaginatedData as SiteVisitListItem,
  ISiteVisitApproval as SiteVisitApproval,
  ISiteVisitTeamMember as SiteVisitTeamMember,
  ISiteVisitReport as SiteVisitReport,
  ISiteVisitLocation as SiteVisitLocation
};

// New Export Names (Backend Aligned)
export type {
  ISiteVisit,
  ISiteVisitTeamMember,
  ISiteVisitApproval,
  ICreateSiteVisitRequest,
  IUpdateStatusRequest,
  IApprovalActionRequest,
  IDashboardResponse,
  ISiteVisitListParams,
  IErrorResponse
};