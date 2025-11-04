import { z } from "zod";
import { IUser } from "features/auth/types/user";
import { TFacilityData } from "definations/modules/program/facility";

// Site Visit Types and Categories
export enum SiteVisitType {
  SUPPORTIVE_SUPERVISION = "SUPPORTIVE_SUPERVISION",
  INTEGRATED_SUPPORTIVE_SUPERVISION = "INTEGRATED_SUPPORTIVE_SUPERVISION",
  EMERGENCY_SUPERVISION = "EMERGENCY_SUPERVISION",
  STAKEHOLDER_ENGAGEMENT = "STAKEHOLDER_ENGAGEMENT",
  OTHERS = "OTHERS"
}

export const SiteVisitTypeLabels = {
  [SiteVisitType.SUPPORTIVE_SUPERVISION]: "Supportive Supervision",
  [SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION]: "Integrated Supportive Supervision",
  [SiteVisitType.EMERGENCY_SUPERVISION]: "Emergency Supervision",
  [SiteVisitType.STAKEHOLDER_ENGAGEMENT]: "Stakeholder Engagement",
  [SiteVisitType.OTHERS]: "Others"
};

export enum SiteVisitStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  REVIEWED = "REVIEWED",
  AUTHORIZED = "AUTHORIZED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EA_CREATED = "EA_CREATED"
}

export const SiteVisitStatusLabels = {
  [SiteVisitStatus.DRAFT]: "Draft",
  [SiteVisitStatus.SUBMITTED]: "Submitted",
  [SiteVisitStatus.UNDER_REVIEW]: "Under Review",
  [SiteVisitStatus.REVIEWED]: "Reviewed",
  [SiteVisitStatus.AUTHORIZED]: "Authorized",
  [SiteVisitStatus.APPROVED]: "Approved",
  [SiteVisitStatus.REJECTED]: "Rejected",
  [SiteVisitStatus.EA_CREATED]: "EA Created"
};

// Zod Schema for form validation
export const SiteVisitApplicationSchema = z.object({
  title: z.string().min(1, "Site visit title is required"),
  location: z.string().min(1, "Location is required"),
  facility: z.string().optional(),
  state: z.string().min(1, "State is required"),
  lga: z.string().optional(),
  site_visit_type: z.nativeEnum(SiteVisitType, {
    required_error: "Site visit type is required"
  }),
  other_type_description: z.string().optional(),
  travel_reason: z.string().min(1, "Reason for travel is required"),
  expected_outcome: z.string().min(1, "Expected outcome is required"),
  proposed_start_date: z.string().min(1, "Start date is required"),
  proposed_end_date: z.string().min(1, "End date is required"),
  team_members: z.array(z.string()).min(1, "At least one team member is required"),
  reviewer: z.string().min(1, "Reviewer is required"),
  authorizer: z.string().min(1, "Authorizer is required"),
  approver: z.string().min(1, "Approver is required"),
  additional_comments: z.string().optional(),
  project: z.string().optional(),
}).refine((data) => {
  // If site visit type is "OTHERS", other_type_description is required
  if (data.site_visit_type === SiteVisitType.OTHERS) {
    return data.other_type_description && data.other_type_description.trim().length > 0;
  }
  return true;
}, {
  message: "Description is required when site visit type is 'Others'",
  path: ["other_type_description"]
}).refine((data) => {
  // End date should be after start date
  if (data.proposed_start_date && data.proposed_end_date) {
    return new Date(data.proposed_end_date) >= new Date(data.proposed_start_date);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["proposed_end_date"]
});

export type TSiteVisitApplicationFormValues = z.infer<typeof SiteVisitApplicationSchema>;

// Approval Level Interface
export interface ISiteVisitApprovalLevel {
  id: string;
  level: number;
  approver: IUser;
  role: "REVIEWER" | "AUTHORIZER" | "APPROVER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments?: string;
  approval_date?: string;
  created_datetime: string;
  updated_datetime: string;
}

// Team Member Interface
export interface ISiteVisitTeamMember {
  id: string;
  user: IUser;
  role?: string;
  added_datetime: string;
}

// Main Site Visit Interface
export interface ISiteVisitData {
  id: string;
  title: string;
  location: string;
  facility?: TFacilityData;
  state: string;
  lga?: string;
  site_visit_type: SiteVisitType;
  other_type_description?: string;
  travel_reason: string;
  expected_outcome: string;
  proposed_start_date: string;
  proposed_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  team_members: ISiteVisitTeamMember[];
  reviewer: IUser;
  authorizer: IUser;
  approver: IUser;
  additional_comments?: string;
  status: SiteVisitStatus;
  approvals: ISiteVisitApprovalLevel[];
  current_approval_level?: number;
  ea_reference?: string;
  ea_created_date?: string;
  project?: string;
  created_by: IUser;
  created_datetime: string;
  updated_datetime: string;
  submitted_date?: string;
  final_approval_date?: string;
}

// Paginated Response Interface
export interface TSiteVisitPaginatedData {
  id: string;
  title: string;
  location: string;
  state: string;
  site_visit_type: SiteVisitType;
  proposed_start_date: string;
  proposed_end_date: string;
  status: SiteVisitStatus;
  team_members_count: number;
  created_by: string;
  created_datetime: string;
  updated_datetime: string;
}

// Site Visit Report Interface
export interface ISiteVisitReport {
  id: string;
  site_visit: ISiteVisitData;
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

// Location/Facility Selection Interface
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

// Export commonly used types for easier imports
export type {
  TSiteVisitApplicationFormValues as SiteVisitFormData,
  ISiteVisitData as SiteVisit,
  TSiteVisitPaginatedData as SiteVisitListItem,
  ISiteVisitApprovalLevel as SiteVisitApproval,
  ISiteVisitTeamMember as SiteVisitTeamMember,
  ISiteVisitReport as SiteVisitReport,
  ISiteVisitLocation as SiteVisitLocation
};