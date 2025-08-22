// Budget Line types
export interface BudgetLineData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  amount?: number;
  project_id?: string;
  financial_year?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetLineFormValues {
  name: string;
  description?: string;
  code?: string;
  amount?: number;
  project_id?: string;
  financial_year?: string;
}

// Chart Account types
export interface ChartAccountData {
  id: string;
  account_name: string;
  account_code: string;
  account_type: string;
  parent_account?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChartAccountFormValues {
  account_name: string;
  account_code: string;
  account_type: string;
  parent_account?: string;
  description?: string;
  is_active: boolean;
}

// Cost Category types
export interface CostCategoryData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface CostCategoryFormValues {
  name: string;
  description?: string;
  code?: string;
}

// Cost Grouping types
export interface CostGroupingData {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CostGroupingFormValues {
  name: string;
  description?: string;
  category_id?: string;
}

// Cost Input types
export interface CostInputData {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  unit_cost?: number;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CostInputFormValues {
  name: string;
  description?: string;
  unit?: string;
  unit_cost?: number;
  category_id?: string;
}

// FCO Number types
export interface FCONumberData {
  id: string;
  number: string;
  description?: string;
  project_id?: string;
  amount?: number;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface FCONumberFormValues {
  number: string;
  description?: string;
  project_id?: string;
  amount?: number;
  status?: string;
}

// Project Class types
export interface ProjectClassData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectClassFormValues {
  name: string;
  description?: string;
  code?: string;
}

// Legacy type exports for backward compatibility
export type TBudgetLineData = BudgetLineData;
export type TBudgetLineFormValues = BudgetLineFormValues;
export type TChartAccountData = ChartAccountData;
export type TChartAccountFormValues = ChartAccountFormValues;
export type TCostCategoryData = CostCategoryData;
export type TCostCategoryFormValues = CostCategoryFormValues;
export type TCostGroupingData = CostGroupingData;
export type TCostGroupingFormValues = CostGroupingFormValues;
export type TCostInputData = CostInputData;
export type TCostInputFormValues = CostInputFormValues;
export type TFCONumberData = FCONumberData;
export type TFCONumberFormValues = FCONumberFormValues;
export type TProjectClassData = ProjectClassData;
export type TProjectClassFormValues = ProjectClassFormValues;