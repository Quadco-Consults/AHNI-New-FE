// Category types
export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormValues {
  name: string;
  description?: string;
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
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialYearFormValues {
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

// Item types
export interface ItemData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemFormValues {
  name: string;
  description?: string;
  category?: string;
  unit?: string;
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