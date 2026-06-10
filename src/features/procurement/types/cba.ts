import { SolicitationItems } from "./solicitation";

export type CommitteeMemberData = {
  id: string;
  first_name: string;
  last_name: string;
  designation: string;
};

// Committee Individual Evaluation Types
export interface ICommitteeMemberEvaluation {
  id: string;
  cba: string;  // Backend sends "cba" not "cba_id"
  member: string;  // Backend sends "member" not "member_id"
  member_name: string;
  member_designation: string;
  selected_bid_submission?: string;
  selected_rfp_submission?: string | null;
  selected_vendor_name?: string;
  selected_items?: string[];
  selected_total?: string;
  overall_recommendation: string;
  technical_score?: number;
  commercial_score?: number;
  evaluation_criteria_data?: Array<{  // Backend sends this instead of vendor_evaluations
    vendor_id: string;
    vendor_name: string;
    quality_score?: string;  // e.g., "71-80"
    approved_models?: string;  // e.g., "Dell, HP, Lenovo"
    price_responsiveness?: string;  // e.g., "1st-most-responsive"
    technical_eligibility?: string;  // "YES" or "NO"
    bank_account_evaluation?: string;  // "YES" or "NO"
    experience_evaluation?: string;  // "YES" or "NO"
    delivery_time?: string;
    payment_terms?: string;
    grand_total?: number;
    tin?: string;
    currency?: string;
    warranty?: string;
    validity_period?: string;
  }>;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';  // Backend uses uppercase
  submitted_at?: string | null;  // Backend sends ISO string or null
  created_datetime: string;  // Backend sends "created_datetime" not "created_at"
  updated_datetime: string;  // Backend sends "updated_datetime" not "updated_at"
  bid_item_selections?: any[];
}

export interface IVendorEvaluation {
  vendor_id: string;
  vendor_name: string;
  technical_score: number; // 0-100
  price_score: number; // 0-100
  overall_score: number; // Calculated
  technical_comments: string;
  price_comments: string;
  recommended: boolean;
  item_selections: IItemSelection[];
}

export interface IItemSelection {
  item_id: string;
  selected: boolean;
  justification?: string;
}

export interface IMemberParticipation {
  cba_id: string;
  total_members: number;
  submitted_members: string[];
  pending_members: string[];
  members: Array<{
    id: string;
    name: string;
    email?: string;
    designation?: string;
    submitted: boolean;
    status?: string;
    submitted_at?: string | Date;
  }>;
}

export interface IConsensusResults {
  vendor_scores: IVendorConsensusScore[];
  recommended_vendor: IVendorConsensusScore;
  agreement_percentage: number;
  consensus_reached: boolean;
}

export interface IVendorConsensusScore {
  id: string;
  name: string;
  avg_technical_score: number;
  avg_price_score: number;
  consensus_score: number;
  recommendation_rate: number;
  member_scores: Array<{
    member_id: string;
    member_name: string;
    technical: number;
    price: number;
    recommended: boolean;
  }>;
}

export type AssigneeData = {
  user_id: string;
  name: string;
};
export type SubmissionData = {
  unit_price: number;
  sub_total: number;
  quantity: number;
  vendor: string;
  id: string;
};

export type VendorSubmissionData = {
  item: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    uom: string;
    category: string;
    quantity: number;
  };
  submissions: SubmissionData[];
};

export type SolicitationShortData = {
  id: string;
  rfq_id: string | null;
  title: string;
  status: string;
};

export type CbaResultsData = {
  id: string;
  cba_reference?: string; // Human-readable CBA reference (e.g., CBA-2026-001)
  created_at: string;
  updated_at: string;
  solicitation: SolicitationShortData; // Expanded solicitation object from backend
  cba_type: 'COMMITTEE' | 'NON COMMITTEE';
  lot?: string; // UUID reference
  cba_date: string;
  committee_members: CommitteeMemberData[];
  assignee?: AssigneeData; // Changed to AssigneeData to match backend response
  remarks?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  title?: string;
  vendor_submissions?: VendorSubmissionData[];
  vendor_responses?: {};
  items?: SolicitationItems[];
  // Analysis results fields
  selected_bid_submission?: string; // Changed from selected_vendor_id to match backend
  selected_items?: string[];
  recommendation_note?: string;
  selected_total?: number;
  // 3-Level Approval Workflow - Assignment
  reviewers?: CommitteeMemberData[];
  authorisers?: CommitteeMemberData[];
  approvers?: CommitteeMemberData[];
  // 3-Level Approval Workflow - Tracking
  reviewed_by?: CommitteeMemberData;
  reviewed_date?: string;
  review_comments?: string;
  authorised_by?: CommitteeMemberData;
  authorised_date?: string;
  authorisation_comments?: string;
  approved_by_user?: CommitteeMemberData;
  approved_date?: string;
  approval_comments?: string;
};

export interface CbaData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: CbaResultsData[];
}

export interface CbaResponse {
  message: string;
  data: CbaResultsData;
}

export interface CbaSubmitPayload {
  submission_ids: string[];
  remarks: string;
}

export interface CbaAnalysisSubmissionPayload {
  cba_id: string;
  solicitation_id: string;
  vendor_id: string;
  recommendation_note?: string;
  selected_items: string[]; // Item IDs to approve
}

export interface CbaEvaluationPayload {
  cba_id: string;
  solicitation_id: string;
  evaluation_criteria: {
    technical_evaluation_percentage: number;
    price_reasonableness_percentage: number;
    approved_models: string[];
  };
  vendor_evaluations: VendorEvaluation[];
}

export interface VendorEvaluation {
  vendor_id: string;
  technical_eligibility: boolean;
  financial_eligibility: boolean;
  delivery_leadtime: string;
  payment_terms: string;
  tax_identification: string;
  validity_period: string;
  bank_account_verified: boolean;
  vendor_experience_verified: boolean;
  currency: string;
  warranty_provision: string;
  technical_score: number;
  price_score: number;
  overall_rank: number;
}

export interface CbaScoreCalculation {
  vendor_id: string;
  vendor_name: string;
  technical_score: number;
  price_score: number;
  combined_score: number;
  rank: number;
  recommended: boolean;
}

// CBA Document Structure (matching the actual document format)
export interface CbaDocument {
  title: string;
  subject: string;
  pageInfo: string;
  rfqReference: string;
  evaluationDate: string;
  vendorComparison: VendorComparison;
  evaluationCriteria: EvaluationCriteria;
  awardRecommendation: string;
  approvalWorkflow: ApprovalWorkflow;
}

export interface VendorComparison {
  vendors: VendorDetails[];
  items: ItemComparison[];
  grandTotals: Record<string, number>;
}

export interface VendorDetails {
  id: string;
  name: string;
  contactInfo?: string;
}

export interface ItemComparison {
  itemNo: number;
  description: string;
  uom: string; // Unit of Measure
  vendors: Record<string, {
    qty: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface EvaluationCriteria {
  technicalEvaluation: number; // percentage
  priceReasonableness: number; // percentage
  approvedModels: string[];
  priceResponsiveness: {
    firstMostResponsive: string;
    secondMostResponsive: string;
    thirdMostResponsive: string;
    noBid?: string;
  };
  technicalEligibility: Record<string, boolean>;
  financialEligibility: Record<string, boolean>;
  deliveryLeadtime: Record<string, string>;
  paymentTerms: Record<string, string>;
  taxIdentification: Record<string, string>;
  validityPeriod: Record<string, string>;
  bankAccount: Record<string, boolean>;
  vendorExperience: Record<string, boolean>;
  currency: Record<string, string>;
  warrantyProvision: Record<string, string>;
}

export interface ApprovalWorkflow {
  preparedBy: SignatureBlock;
  procurementCommittee: SignatureBlock[];
  reviewedBy: SignatureBlock;
  authorizedBy: SignatureBlock;
  approvedBy: SignatureBlock;
}

export interface SignatureBlock {
  title: string;
  name?: string;
  date?: string;
  signature?: string;
  status?: 'pending' | 'signed' | 'rejected';
  signed_at?: string;
  remarks?: string;
}

export interface SignatureSubmissionPayload {
  step: 'prepared' | 'reviewed' | 'authorized' | 'approved' | 'committee';
  signature: string;
  remarks?: string;
}

export interface SignatureWorkflowStatus {
  current_step: 'prepared' | 'committee' | 'reviewed' | 'authorized' | 'approved' | 'completed';
  is_completed: boolean;
  can_sign: boolean;
  pending_signatures: string[];
  completed_signatures: string[];
  next_approver?: {
    id: string;
    name: string;
    title: string;
  };
}
