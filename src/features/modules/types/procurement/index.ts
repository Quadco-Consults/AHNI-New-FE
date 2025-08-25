// Lot types
export interface LotData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  procurement_plan?: string;
  estimated_cost?: number;
  currency?: string;
  procurement_method?: string;
  category?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface LotFormValues {
  name: string;
  description?: string;
  code?: string;
  procurement_plan?: string;
  estimated_cost?: number;
  currency?: string;
  procurement_method?: string;
  category?: string;
  status?: string;
}

// Prequalification Category types
export interface PrequalificationCategoryData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  weight?: number;
  is_mandatory?: boolean;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface PrequalificationCategoryFormValues {
  name: string;
  description?: string;
  code?: string;
  weight?: number;
  is_mandatory?: boolean;
  order?: number;
}

// Prequalification Criteria types
export interface PrequalificationCriteriaData {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  criteria_type?: 'document' | 'experience' | 'financial' | 'technical';
  minimum_requirement?: string;
  scoring_method?: 'pass_fail' | 'points' | 'percentage';
  maximum_points?: number;
  weight?: number;
  is_mandatory?: boolean;
  order?: number;
  created_at: string;
  updated_at: string;
}

export interface PrequalificationCriteriaFormValues {
  name: string;
  description?: string;
  category_id?: string;
  criteria_type?: 'document' | 'experience' | 'financial' | 'technical';
  minimum_requirement?: string;
  scoring_method?: 'pass_fail' | 'points' | 'percentage';
  maximum_points?: number;
  weight?: number;
  is_mandatory?: boolean;
  order?: number;
}

// Questionnaire types
export interface QuestionnaireData {
  id: string;
  title: string;
  description?: string;
  questionnaire_type?: 'prequalification' | 'evaluation' | 'survey';
  is_active?: boolean;
  questions?: QuestionnaireQuestionData[];
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireQuestionData {
  id: string;
  question: string;
  question_type: 'text' | 'multiple_choice' | 'yes_no' | 'number' | 'date' | 'file';
  options?: string[];
  is_required: boolean;
  order: number;
}

export interface QuestionnaireFormValues {
  title: string;
  description?: string;
  questionnaire_type?: 'prequalification' | 'evaluation' | 'survey';
  is_active?: boolean;
  questions?: QuestionnaireQuestionFormValues[];
}

export interface QuestionnaireQuestionFormValues {
  question: string;
  question_type: 'text' | 'multiple_choice' | 'yes_no' | 'number' | 'date' | 'file';
  options?: string[];
  is_required: boolean;
  order: number;
}

// Solicitation Evaluation Criteria types
export interface SolicitationEvaluationCriteriaData {
  id: string;
  name: string;
  description?: string;
  criteria_type?: 'technical' | 'financial' | 'commercial' | 'compliance';
  weight?: number;
  maximum_points?: number;
  evaluation_method?: 'points' | 'percentage' | 'pass_fail';
  sub_criteria?: SolicitationSubCriteriaData[];
  order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SolicitationSubCriteriaData {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  maximum_points?: number;
  order?: number;
}

export interface SolicitationEvaluationCriteriaFormValues {
  name: string;
  description?: string;
  criteria_type?: 'technical' | 'financial' | 'commercial' | 'compliance';
  weight?: number;
  maximum_points?: number;
  evaluation_method?: 'points' | 'percentage' | 'pass_fail';
  sub_criteria?: SolicitationSubCriteriaFormValues[];
  order?: number;
  is_active?: boolean;
}

export interface SolicitationSubCriteriaFormValues {
  name: string;
  description?: string;
  weight?: number;
  maximum_points?: number;
  order?: number;
}

// Legacy type exports for backward compatibility
export type TLotData = LotData;
export type TLotFormValues = LotFormValues;
export type TPrequalificationCategoryData = PrequalificationCategoryData;
export type TPrequalificationCategoryFormValues = PrequalificationCategoryFormValues;
export type TPrequalificationCriteriaData = PrequalificationCriteriaData;
export type TPrequalificationCriteriaFormValues = PrequalificationCriteriaFormValues;
export type TQuestionnaireData = QuestionnaireData;
export type TQuestionnaireFormValues = QuestionnaireFormValues;
export type TSolicitationEvaluationCriteriaData = SolicitationEvaluationCriteriaData;
export type TSolicitationEvaluationCriteriaFormValues = SolicitationEvaluationCriteriaFormValues;