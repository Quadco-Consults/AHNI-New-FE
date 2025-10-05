
// Risk rating scale for PAT assessment
export type RiskRating = 0 | 1 | 2; // N/A=0, Low=0, Med=1, High=2

export interface IAssessmentScore {
  id: string;
  criteria: string;
  score: number;
  comments?: string;
}

// Technical Capacity Assessment Types
export interface ITechnicalCapacityScore {
  question: string;
  response: "YES" | "NO" | "N/A";
  findings: string;
}

export interface ITechnicalCapacityAssessment {
  programming_capacity: ITechnicalCapacityScore[];
  monitoring_evaluation: ITechnicalCapacityScore[];
  overall_findings: string;
}

// Financial Pre-Award Assessment (PAT) Types
export interface IPATScore {
  question: string;
  response: string;
  risk_rating: RiskRating;
  comments?: string;
}

export interface IPATSection {
  section_name: string;
  questions: IPATScore[];
  section_rating: number;
  max_rating: number;
}

export interface IFinancialPreAwardAssessment {
  organization_details: {
    legal_name: string;
    principal_1_name: string;
    principal_1_title: string;
    principal_2_name?: string;
    principal_2_title?: string;
    address: string;
    telephone: string;
    fax?: string;
    email: string;
    web_address?: string;
    duns_number?: string;
    has_financial_conflict_policy: boolean;
    organization_type: "NOT_FOR_PROFIT" | "GOVERNMENTAL" | "UNIVERSITY" | "FOR_PROFIT" | "OTHER";
    other_type?: string;
  };
  proposed_subaward_details: {
    project_title: string;
    ahni_project_number: string;
    country_of_performance: string;
    originating_funder: string;
    originating_award_type: string;
    grant_administrator: string;
    program_technical_contact: string;
    start_date: string;
    end_date: string;
    life_of_project_value_usd: number;
    life_of_project_value_local: number;
    subaward_type: "GRANT" | "SUBCONTRACT_COST_REIMBURSABLE" | "SUBCONTRACT_FIXED_PRICE";
    business_unit: string;
  };
  pat_sections: IPATSection[];
  overall_rating: {
    total_score: number;
    maximum_possible_score: number;
    na_adjustments: number;
    adjusted_maximum: number;
    percentage_score: number;
    risk_level: "LOW" | "MEDIUM" | "HIGH" | "EXTREMELY_HIGH";
  };
  recommendation: "PROCEED" | "DO_NOT_PROCEED";
  special_award_conditions: string[];
  sfr_documentation_requirements: string[];
  certifications: {
    conducted_by: {
      name: string;
      title: string;
      signature?: string;
      date: string;
    };
    reviewed_by: {
      name: string;
      title: string;
      signature?: string;
      date: string;
    };
    approved_by: {
      name: string;
      title: string;
      signature?: string;
      date: string;
    };
    managing_director_approval?: {
      signature?: string;
      date?: string;
    };
  };
}

export interface IPreAwardAssessment {
  id: string;
  submission: string;
  assessor: string;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "REJECTED";
  assessment_type: "TECHNICAL_CAPACITY" | "FINANCIAL_PAT" | "COMBINED";
  total_score?: number;
  max_possible_score?: number;
  percentage_score?: number;
  overall_comments?: string;
  recommendation: "APPROVE" | "REJECT" | "CONDITIONALLY_APPROVE" | "NEEDS_REVISION";
  scores: IAssessmentScore[];
  technical_capacity_assessment?: ITechnicalCapacityAssessment;
  financial_pat_assessment?: IFinancialPreAwardAssessment;
  created_datetime: string;
  updated_datetime: string;
}

export interface IAssessmentSummary {
  id: string;
  submission: {
    id: string;
    organization_name: string;
    project_title?: string;
    total_budget_requested?: number;
  };
  assessor_name: string;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "REJECTED";
  total_score?: number;
  max_possible_score?: number;
  percentage_score?: number;
  recommendation: "APPROVE" | "REJECT" | "CONDITIONALLY_APPROVE" | "NEEDS_REVISION";
  created_datetime: string;
  updated_datetime: string;
}

export interface TAssessmentFormData {
  overall_comments?: string;
  recommendation: "APPROVE" | "REJECT" | "CONDITIONALLY_APPROVE" | "NEEDS_REVISION";
  assessment_type: "TECHNICAL_CAPACITY" | "FINANCIAL_PAT" | "COMBINED";
  scores: {
    criteria: string;
    score: number;
    comments?: string;
  }[];
  technical_capacity_assessment?: ITechnicalCapacityAssessment;
  financial_pat_assessment?: IFinancialPreAwardAssessment;
}

export interface TAssessmentCreateUpdateFormData extends TAssessmentFormData {
  submission: string;
}

// Technical Capacity Assessment Form Data
export interface TTechnicalCapacityFormData {
  programming_capacity: {
    question: string;
    response: "YES" | "NO" | "N/A";
    findings: string;
  }[];
  monitoring_evaluation: {
    question: string;
    response: "YES" | "NO" | "N/A";
    findings: string;
  }[];
  overall_findings: string;
}

// Financial PAT Form Data
export interface TFinancialPATFormData {
  organization_details: {
    legal_name: string;
    principal_1_name: string;
    principal_1_title: string;
    principal_2_name?: string;
    principal_2_title?: string;
    address: string;
    telephone: string;
    fax?: string;
    email: string;
    web_address?: string;
    duns_number?: string;
    has_financial_conflict_policy: boolean;
    organization_type: "NOT_FOR_PROFIT" | "GOVERNMENTAL" | "UNIVERSITY" | "FOR_PROFIT" | "OTHER";
    other_type?: string;
  };
  proposed_subaward_details: {
    project_title: string;
    ahni_project_number: string;
    country_of_performance: string;
    originating_funder: string;
    originating_award_type: string;
    grant_administrator: string;
    program_technical_contact: string;
    start_date: string;
    end_date: string;
    life_of_project_value_usd: number;
    life_of_project_value_local: number;
    subaward_type: "GRANT" | "SUBCONTRACT_COST_REIMBURSABLE" | "SUBCONTRACT_FIXED_PRICE";
    business_unit: string;
  };
  pat_sections: {
    section_name: string;
    questions: {
      question: string;
      response: string;
      risk_rating: RiskRating;
      comments?: string;
    }[];
  }[];
  special_award_conditions: string[];
  sfr_documentation_requirements: string[];
  certifications: {
    conducted_by: {
      name: string;
      title: string;
      date: string;
    };
    reviewed_by: {
      name: string;
      title: string;
      date: string;
    };
    approved_by: {
      name: string;
      title: string;
      date: string;
    };
    managing_director_approval?: {
      date?: string;
    };
  };
}

// Workflow Status Types
export interface IAssessmentWorkflowStep {
  step: number;
  name: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
  required: boolean;
  description: string;
}

export interface IAssessmentWorkflow {
  assessment_id: string;
  current_step: number;
  total_steps: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  steps: IAssessmentWorkflowStep[];
  created_by: string;
  assigned_to?: string;
  due_date?: string;
  completed_date?: string;
}