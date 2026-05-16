// Financial Classification Types
export interface FCONumber {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  fco_number: string | FCONumber;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostGrouping {
  id: string;
  name: string;
  code: string;
  description?: string;
  cost_category: string | CostCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostInput {
  id: string;
  name: string;
  code: string;
  description?: string;
  cost_grouping: string | CostGrouping;
  unit_of_measure?: string;
  standard_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BudgetLine {
  id: string;
  name: string;
  code: string;
  description?: string;
  cost_input: string | CostInput;
  account_code?: string;
  gl_account?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Related fields from backend
  modules?: string[]; // Array of Module IDs
  intervention_areas?: string[]; // Array of Intervention Area IDs
}

// Form data types for creation/editing
export interface FCONumberFormData {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface CostCategoryFormData {
  name: string;
  code: string;
  description?: string;
  fco_number: string;
  is_active: boolean;
}

export interface CostGroupingFormData {
  name: string;
  code: string;
  description?: string;
  cost_category: string;
  is_active: boolean;
}

export interface CostInputFormData {
  name: string;
  code: string;
  description?: string;
  cost_grouping: string;
  unit_of_measure?: string;
  standard_rate?: number;
  is_active: boolean;
}

export interface BudgetLineFormData {
  name: string;
  code: string;
  description?: string;
  cost_input: string;
  account_code?: string;
  gl_account?: string;
  is_active: boolean;
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Search and filter types
export interface ClassificationFilters {
  search?: string;
  is_active?: boolean;
  fco_number?: string;
  cost_category?: string;
  cost_grouping?: string;
  page?: number;
  page_size?: number;
}