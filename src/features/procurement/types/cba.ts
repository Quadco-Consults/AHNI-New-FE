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
  cba_id: string;
  member_id: string;
  member_name: string;
  member_designation: string;
  vendor_evaluations: IVendorEvaluation[];
  overall_recommendation: string;
  status: 'pending' | 'submitted' | 'approved';
  submitted_at?: Date;
  created_at: Date;
  updated_at: Date;
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
    designation: string;
    submitted: boolean;
    submitted_at?: Date;
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

export type CbaResultsData = {
  id: string;
  created_at: string;
  updated_at: string;
  solicitation: string; // UUID reference
  cba_type: 'COMMITTEE' | 'NON COMMITTEE';
  lot?: string; // UUID reference
  cba_date: string;
  committee_members: CommitteeMemberData[];
  assignee?: AssigneeData; // Changed to AssigneeData to match backend response
  remarks?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  title?: string;
  vendor_submissions?: VendorSubmissionData[];
  vendor_responses?: {};
  items?: SolicitationItems[];
  // Analysis results fields
  selected_bid_submission?: string; // Changed from selected_vendor_id to match backend
  selected_items?: string[];
  recommendation_note?: string;
  selected_total?: number;
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
