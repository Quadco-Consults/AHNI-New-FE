// Unified Opportunity Types

export type OpportunityType = "HR_JOB" | "CONSULTANT" | "ADHOC" | "FACILITATOR";

export type OpportunityStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ACTIVE"
  | "CLOSED"
  | "CANCELLED";

export interface BaseOpportunity {
  id: string;
  type: OpportunityType;
  title: string;
  status: OpportunityStatus;
  created_datetime: string;
  updated_datetime?: string;
  created_by?: string;

  // Common fields
  grade_level?: string;
  locations?: string | string[];
  commencement_date?: string;
  end_date?: string;
  duration?: string | number;
  background?: string;
  supervisor?: string;
  number_of_positions?: number;

  // Document
  advertisement_document?: string;

  // Application info
  total_applicants?: number;
  application_deadline?: string;

  // Department/Project context
  department?: string;
  project?: string;
}

// HR Job Opportunity (External/Internal Jobs)
export interface HRJobOpportunity extends BaseOpportunity {
  type: "HR_JOB";
  job_type?: "Internal" | "External" | "Both";
  any_other_info?: string;
  advert_document?: string;
  interviewers?: Array<{
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    mobile_number?: string;
  }>;
}

// Consultant Opportunity
export interface ConsultantOpportunity extends BaseOpportunity {
  type: "CONSULTANT";
  consultants_number?: number;
  scope_of_work?: {
    id: string;
    description: string;
    background: string;
    objectives: string;
    deliverables: Array<{
      deliverable: string;
      number_of_days: number;
    }>;
    fee_rate?: number;
    payment_frequency?: string;
  };
  extra_info?: string;
  evaluation_comments?: string;
}

// Adhoc Opportunity (Project-based temporary staff)
export interface AdhocOpportunity extends BaseOpportunity {
  type: "ADHOC";
  advertisement_number: string;
  position_title: string;

  // Project context
  project?: {
    id: string;
    title: string;
    goal?: string;
    location?: string;
  };

  // Location details
  location_name?: string;
  health_facility?: string;
  spoke_site_name?: string;
  lga?: string;
  cluster?: string;

  // Contract details
  start_date: string;
  duration_months?: number;
  proposed_salary: string;
  currency: string;
  budget_line?: string;

  // Requirements
  job_description: string;
  key_responsibilities: string;
  qualifications_required?: string;
  skills_required?: string;
  additional_requirements?: string;
  experience_years?: number;
  education_level?: string;

  // Statistics
  shortlisted_count?: number;
  selected_count?: number;
  hired_count?: number;

  // Supervisors
  qmap_backstop?: string;
  programs_officer?: string;
  stl?: string;
  seo?: string;

  // Source
  requisition?: {
    id: string;
    requisition_number: string;
    position_title: string;
  };
}

// Facilitator Opportunity
export interface FacilitatorOpportunity extends BaseOpportunity {
  type: "FACILITATOR";
  facilitator_number?: number;
  scope_of_work?: {
    id: string;
    description: string;
    background: string;
    objectives: string;
    deliverables: Array<{
      deliverable: string;
      number_of_days: number;
    }>;
    fee_rate?: number;
    payment_frequency?: string;
  };
  extra_info?: string;
  evaluation_comments?: string;
}

// Union type for all opportunities
export type UnifiedOpportunity =
  | HRJobOpportunity
  | ConsultantOpportunity
  | AdhocOpportunity
  | FacilitatorOpportunity;

// Filter parameters for opportunities
export interface OpportunityFilters {
  page?: number;
  size?: number;
  search?: string;
  type?: OpportunityType[];
  status?: OpportunityStatus[];
  location?: string[];
  department?: string[];
  project?: string[];
  date_from?: string;
  date_to?: string;
  grade_level?: string[];
}

// Display configuration for each opportunity type
export interface OpportunityTypeConfig {
  type: OpportunityType;
  label: string;
  color: string;
  icon: string;
  route: string;
  description: string;
}

export const OPPORTUNITY_TYPE_CONFIGS: Record<OpportunityType, OpportunityTypeConfig> = {
  HR_JOB: {
    type: "HR_JOB",
    label: "External Jobs",
    color: "bg-blue-100 text-blue-800",
    icon: "briefcase",
    route: "/dashboard/hr/advertisement",
    description: "Full-time and part-time employment opportunities"
  },
  CONSULTANT: {
    type: "CONSULTANT",
    label: "Consultant Positions",
    color: "bg-purple-100 text-purple-800",
    icon: "user",
    route: "/dashboard/c-and-g/consultancy",
    description: "Expert consulting and advisory roles"
  },
  ADHOC: {
    type: "ADHOC",
    label: "Project-based Roles",
    color: "bg-green-100 text-green-800",
    icon: "clock",
    route: "/dashboard/programs/adhoc-management",
    description: "Temporary project-based positions"
  },
  FACILITATOR: {
    type: "FACILITATOR",
    label: "Facilitator Roles",
    color: "bg-orange-100 text-orange-800",
    icon: "presentation",
    route: "/dashboard/c-and-g/facilitator-management",
    description: "Training and facilitation opportunities"
  }
};

// Status configuration
export const OPPORTUNITY_STATUS_CONFIGS: Record<OpportunityStatus, { label: string; color: string; }> = {
  DRAFT: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800"
  },
  PUBLISHED: {
    label: "Published",
    color: "bg-blue-100 text-blue-800"
  },
  ACTIVE: {
    label: "Active",
    color: "bg-green-100 text-green-800"
  },
  CLOSED: {
    label: "Closed",
    color: "bg-red-100 text-red-800"
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-yellow-100 text-yellow-800"
  }
};