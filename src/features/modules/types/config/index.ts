// Category types
export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  job_category?: string;
  code?: string;
  serial_number?: any;
  parent?: string | CategoryData | null; // Parent category ID or nested object
  children?: CategoryData[]; // Child categories for hierarchical display
}

export interface CategoryFormValues {
  name: string;
  description?: string;
  job_category?: string;
  code?: string;
  serial_number?: any;
  parent?: string; // Parent category ID
}

// Department types  
export interface DepartmentData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentFormValues {
  name: string;
  description?: string;
}

// Financial Year types
export interface FinancialYearData {
  id: string;
  year: string; // e.g., "2024-2025"
  is_current: boolean;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility (may be undefined)
  name?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface FinancialYearFormValues {
  year: string; // e.g., "2024-2025"
  is_current: boolean;
  // Legacy fields for backward compatibility
  name?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// Item types
export interface ItemData {
  id: string;
  name: string;
  description?: string;
  category?: string | CategoryData;
  unit?: string | number;
  created_at: string;
  updated_at: string;
  // Asset-specific fields - support both string IDs and nested objects
  assignee?: string | { id: string; full_name?: string; first_name?: string; last_name?: string };
  asset_code?: string;
  asset_type?: string | { id: string; name?: string; model?: string };
  project?: string | { id: string; title?: string; name?: string };
  donor?: string | { id: string; name?: string };
  depreciation_rate?: string | number;
  acquisition_date?: string;
  state?: string;
  asset_condition?: string | { id: string; name?: string };
  location?: string | LocationData;
  estimated_life_span?: string;
  classification?: string | AssetClassificationData;
  usd_cost?: string;
  ngn_cost?: string;
  implementer?: string | { id: string; full_name?: string; first_name?: string; last_name?: string };
  insurance_duration?: string;
  uom?: string;
  // Vehicle-specific fields
  plate_number?: string;
  chasis_number?: string; // VIN
  engine_number?: string;
  odometer_reading?: string | number;
  make?: string;
  model?: string;
  // IT/Lab equipment fields
  serial_number?: string;
}

export interface ItemFormValues {
  name: string;
  description?: string;
  category?: string;
  unit?: string;

  // Asset-specific fields
  assignee?: string;
  asset_code?: string;
  asset_type?: string;
  project?: string;
  donor?: string;
  depreciation_rate?: string | number;
  acquisition_date?: string;
  state?: string;
  asset_condition?: string;
  location?: string;
  estimated_life_span?: string;
  classification?: string;
  usd_cost?: string;
  ngn_cost?: string;
  implementer?: string;
  insurance_duration?: string;
  uom?: string;

  // Vehicle-specific fields - Basic Info
  plate_number?: string;
  chasis_number?: string; // VIN
  engine_number?: string;
  odometer_reading?: string | number;
  make?: string;
  model?: string;

  // Vehicle-specific fields - Additional Details
  manufacture_year?: string | number;
  vehicle_color?: string;
  fuel_type?: string;
  seating_capacity?: string | number;
  vehicle_type?: string;

  // Vehicle-specific fields - Registration & Insurance
  registration_number?: string;
  registration_expiry_date?: string;
  insurance_policy_number?: string;
  insurance_provider?: string;
  insurance_expiry_date?: string;

  // Vehicle-specific fields - Maintenance
  last_service_date?: string;
  next_service_date?: string;
  service_interval_km?: string | number;

  // IT/Lab equipment fields
  serial_number?: string;
}

// Location types
export interface LocationData {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
}

export interface LocationFormValues {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

// Position types
export interface PositionData {
  id: string;
  title: string;
  description?: string;
  department?: string;
  level?: string;
  created_at: string;
  updated_at: string;
}

export interface PositionFormValues {
  title: string;
  description?: string;
  department?: string;
  level?: string;
}

// Asset Classification types
export interface AssetClassificationData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetClassificationFormValues {
  name: string;
  description?: string;
  code?: string;
}

// Grade types
export interface GradeData {
  id: string;
  name: string;
  level: number;
  description?: string;
  min_salary?: number;
  max_salary?: number;
  created_at: string;
  updated_at: string;
}

export interface GradeFormValues {
  name: string;
  level: number;
  description?: string;
  min_salary?: number;
  max_salary?: number;
}

// Level types
export interface LevelData {
  id: string;
  name: string;
  order: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface LevelFormValues {
  name: string;
  order: number;
  description?: string;
}

// Market Price types
export interface MarketPriceData {
  id: string;
  item_id: string;
  item_name?: string;
  price: number;
  currency?: string;
  effective_date: string;
  vendor?: string;
  created_at: string;
  updated_at: string;
}

export interface MarketPriceFormValues {
  item_id: string;
  price: number;
  currency?: string;
  effective_date: string;
  vendor?: string;
}

// Job Category types
export interface JobCategoryData {
  label: string;
  value: string;
}

export interface JobCategoryResponse {
  status: string;
  message: string;
  data: JobCategoryData[];
}

// Approval Threshold types
export interface ApprovalThresholdData {
  id: string;
  transaction_type: 'PURCHASE_REQUEST' | 'PAYMENT_REQUEST' | 'PURCHASE_ORDER' | 'EXPENSE_AUTHORIZATION' | 'TRAVEL_EXPENSE';
  transaction_type_display: string;
  approval_level: 'STATE_HEAD' | 'DIRECTOR' | 'MD';
  approval_level_display: string;
  position: string;  // UUID
  position_name: string;
  min_amount: string;
  max_amount: string | null;
  location: string | null;  // UUID
  location_name: string | null;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApprovalThresholdDetailData extends ApprovalThresholdData {
  position_detail: PositionData;
  location_detail: LocationData | null;
}

export interface ApprovalThresholdFormValues {
  transaction_type: string;
  approval_level: string;
  position: string;
  min_amount: string;
  max_amount?: string;
  location?: string;
  priority?: number;
  is_active: boolean;
}

export interface ThresholdValidationRequest {
  transaction_type: string;
  location_id?: string;
}

export interface ThresholdInfoRequest {
  transaction_type: string;
  amount: string;
  location_id?: string;
}

// Legacy type exports for backward compatibility
export type TCategoryData = CategoryData;
export type TCategoryFormValues = CategoryFormValues;
export type TDepartmentData = DepartmentData;
export type TDepartmentFormValues = DepartmentFormValues;
export type TFinancialYearData = FinancialYearData;
export type TFinancialYearFormValues = FinancialYearFormValues;
export type TItemData = ItemData;
export type TItemFormValues = ItemFormValues;
export type TLocationData = LocationData;
export type TLocationFormValues = LocationFormValues;
export type TPositionData = PositionData;
export type TPositionFormValues = PositionFormValues;
export type IAssetClassificationData = AssetClassificationData;
export type TAssetClassificationFormValues = AssetClassificationFormValues;
export type TGradeData = GradeData;
export type TGradeFormValues = GradeFormValues;
export type TLevelData = LevelData;
export type TLevelFormValues = LevelFormValues;
export type TMarketPriceData = MarketPriceData;
export type TMarketPriceFormValues = MarketPriceFormValues;
export type TJobCategoryData = JobCategoryData;
export type TJobCategoryResponse = JobCategoryResponse;
export type TApprovalThresholdData = ApprovalThresholdData;
export type TApprovalThresholdFormValues = ApprovalThresholdFormValues;