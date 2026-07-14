/**
 * TypeScript types for Technical Prequalification (National Open Tender RFQs)
 * Matches backend models in modules/procurements/models/cba/rfq_technical_prequalification.py
 */

export interface TechnicalCriteriaLibrary {
  id: string;
  criteria_name: string;
  description: string;
  category: string;
  is_commonly_used: boolean;
  is_active: boolean;
  created_datetime: string;
  modified_datetime: string;
}

export interface TechnicalPrequalificationCriteria {
  id: string;
  cba: string;
  library_criteria: string | null;
  library_criteria_details: TechnicalCriteriaLibrary | null;
  criteria_number: number;
  criteria_name: string;
  description: string;
  is_mandatory: boolean;
  created_datetime: string;
  modified_datetime: string;
}

export interface VendorTechnicalEvaluation {
  id: string;
  bid_submission: string;
  criteria: string;
  criteria_details: TechnicalPrequalificationCriteria;
  passed: boolean;
  evaluator: string;
  evaluator_name: string;
  notes: string;
  evaluated_at: string;
  vendor_name: string;
  created_datetime: string;
  modified_datetime: string;
}

export interface TechnicalPrequalificationSummary {
  id: string;
  cba: string;
  bid_submission: string;
  vendor_id: string;
  vendor_name: string;
  total_criteria: number;
  criteria_passed: number;
  criteria_failed: number;
  mandatory_criteria_count: number;
  mandatory_criteria_passed: number;
  is_shortlisted: boolean;
  shortlisted_at: string | null;
  created_datetime: string;
  modified_datetime: string;
}

export interface VendorMatrixRow {
  sn: number;
  bid_submission_id: string;
  vendor_id: string;
  vendor_name: string;
  evaluations: {
    [key: string]: {
      passed: boolean | null;
      notes: string | null;
      evaluation_id: string | null;
      evaluator: string | null;
    };
  };
  summary: {
    total_criteria: number;
    criteria_passed: number;
    criteria_failed: number;
    mandatory_criteria_count: number;
    mandatory_criteria_passed: number;
    is_shortlisted: boolean;
  } | null;
}

export interface TechnicalEvaluationMatrix {
  cba_id: string;
  criteria: TechnicalPrequalificationCriteria[];
  vendors: VendorMatrixRow[];
  summary: {
    total_vendors: number;
    shortlisted_vendors: number;
    not_shortlisted: number;
    evaluation_complete: boolean;
  };
}

export interface CBAInfo {
  id: string;
  cba_date: string;
  status: string;
  evaluation_stage: string;
  technical_evaluation_completed: boolean;
  shortlisted_vendors_count: number;
  solicitation: {
    id: string;
    rfq_number: string;
    name: string;
    tender_type: string;
  } | null;
}

export interface TechnicalEvaluationMatrixResponse {
  cba: CBAInfo;
  matrix: TechnicalEvaluationMatrix;
}

// Request/Payload types

export interface InitializeCriteriaPayload {
  cba_id: string;
  criteria_ids: string[];
  custom_criteria?: Array<{
    criteria_name: string;
    description: string;
    is_mandatory: boolean;
  }>;
}

export interface BulkEvaluationPayload {
  evaluations: Array<{
    bid_submission_id: string;
    criteria_id: string;
    passed: boolean;
    notes?: string;
  }>;
}

export interface ShortlistResponse {
  summary: {
    total: number;
    shortlisted: number;
    not_shortlisted: number;
  };
  vendors: TechnicalPrequalificationSummary[];
}

export interface CompleteEvaluationResponse {
  message: string;
  shortlisted_count: number;
  total_vendors: number;
  next_stage: string;
}
