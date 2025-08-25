// Facility types
export interface FacilityData {
  id: string;
  name: string;
  description?: string;
  facility_type?: 'office' | 'warehouse' | 'clinic' | 'school' | 'community_center' | 'other';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  status?: 'active' | 'inactive' | 'maintenance' | 'closed';
  manager?: string;
  opened_date?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
}

export interface FacilityFormValues {
  name: string;
  description?: string;
  facility_type?: 'office' | 'warehouse' | 'clinic' | 'school' | 'community_center' | 'other';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  status?: 'active' | 'inactive' | 'maintenance' | 'closed';
  manager?: string;
  opened_date?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Intervention Area types
export interface InterventionAreaData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  sector?: string;
  sub_sector?: string;
  focus_area?: string;
  target_beneficiaries?: string[];
  objectives?: string[];
  indicators?: InterventionIndicatorData[];
  budget_allocation?: number;
  currency?: string;
  duration_months?: number;
  status?: 'planning' | 'active' | 'completed' | 'suspended' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface InterventionIndicatorData {
  id: string;
  name: string;
  description?: string;
  target_value?: number;
  unit?: string;
  baseline_value?: number;
  current_value?: number;
}

export interface InterventionAreaFormValues {
  name: string;
  description?: string;
  code?: string;
  sector?: string;
  sub_sector?: string;
  focus_area?: string;
  target_beneficiaries?: string[];
  objectives?: string[];
  indicators?: InterventionIndicatorFormValues[];
  budget_allocation?: number;
  currency?: string;
  duration_months?: number;
  status?: 'planning' | 'active' | 'completed' | 'suspended' | 'cancelled';
  start_date?: string;
  end_date?: string;
}

export interface InterventionIndicatorFormValues {
  name: string;
  description?: string;
  target_value?: number;
  unit?: string;
  baseline_value?: number;
  current_value?: number;
}

// Risk Category types
export interface RiskCategoryData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  category_type?: 'operational' | 'financial' | 'strategic' | 'compliance' | 'reputation';
  impact_areas?: string[];
  mitigation_strategies?: string[];
  monitoring_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  responsible_unit?: string;
  escalation_threshold?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface RiskCategoryFormValues {
  name: string;
  description?: string;
  code?: string;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  category_type?: 'operational' | 'financial' | 'strategic' | 'compliance' | 'reputation';
  impact_areas?: string[];
  mitigation_strategies?: string[];
  monitoring_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  responsible_unit?: string;
  escalation_threshold?: number;
  is_active?: boolean;
}

// Supervision Category types
export interface SupervisionCategoryData {
  id: string;
  name: string;
  description?: string;
  category_type?: 'technical' | 'administrative' | 'financial' | 'programmatic';
  supervision_level?: 'field' | 'regional' | 'national' | 'international';
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'as_needed';
  duration_hours?: number;
  required_qualifications?: string[];
  evaluation_criteria?: SupervisionCriteriaData[];
  reporting_template?: string;
  is_mandatory?: boolean;
  weight?: number;
  order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupervisionCategoryFormValues {
  name: string;
  description?: string;
  category_type?: 'technical' | 'administrative' | 'financial' | 'programmatic';
  supervision_level?: 'field' | 'regional' | 'national' | 'international';
  frequency?: 'weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'as_needed';
  duration_hours?: number;
  required_qualifications?: string[];
  evaluation_criteria?: SupervisionCriteriaFormValues[];
  reporting_template?: string;
  is_mandatory?: boolean;
  weight?: number;
  order?: number;
  is_active?: boolean;
}

// Supervision Criteria types
export interface SupervisionCriteriaData {
  id: string;
  name: string;
  description?: string;
  evaluation_category?: string;
  criteria_type?: 'quantitative' | 'qualitative' | 'binary' | 'scale';
  evaluation_method?: 'observation' | 'interview' | 'document_review' | 'measurement' | 'assessment';
  scoring_scale?: {
    min_value: number;
    max_value: number;
    scale_description: string[];
  };
  weight?: number;
  is_mandatory?: boolean;
  passing_score?: number;
  guidance_notes?: string;
  evidence_required?: string[];
  order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupervisionCriteriaFormValues {
  name: string;
  description?: string;
  evaluation_category?: string;
  criteria_type?: 'quantitative' | 'qualitative' | 'binary' | 'scale';
  evaluation_method?: 'observation' | 'interview' | 'document_review' | 'measurement' | 'assessment';
  scoring_scale?: {
    min_value: number;
    max_value: number;
    scale_description: string[];
  };
  weight?: number;
  is_mandatory?: boolean;
  passing_score?: number;
  guidance_notes?: string;
  evidence_required?: string[];
  order?: number;
  is_active?: boolean;
}

// Legacy type exports for backward compatibility
export type TFacilityData = FacilityData;
export type TFacilityFormValues = FacilityFormValues;
export type TInterventionAreaData = InterventionAreaData;
export type TInterventionAreaFormValues = InterventionAreaFormValues;
export type TRiskCategoryData = RiskCategoryData;
export type TRiskCategoryFormValues = RiskCategoryFormValues;
export type TSupervisionCategoryData = SupervisionCategoryData;
export type TSupervisionCategoryFormValues = SupervisionCategoryFormValues;
export type TSupervisionCriteriaData = SupervisionCriteriaData;
export type TSupervisionCriteriaFormValues = SupervisionCriteriaFormValues;