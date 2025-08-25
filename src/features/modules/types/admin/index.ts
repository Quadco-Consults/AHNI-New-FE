// Asset Condition types
export interface AssetConditionData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetConditionFormValues {
  name: string;
  description?: string;
  code?: string;
  is_active?: boolean;
}

// Asset Type types
export interface AssetTypeData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  category?: string;
  depreciation_rate?: number;
  useful_life?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetTypeFormValues {
  name: string;
  description?: string;
  code?: string;
  category?: string;
  depreciation_rate?: number;
  useful_life?: number;
  is_active?: boolean;
}

// Legacy type exports for backward compatibility
export type TAssetConditionData = AssetConditionData;
export type TAssetConditionFormValues = AssetConditionFormValues;
export type TAssetTypeData = AssetTypeData;
export type TAssetTypeFormValues = AssetTypeFormValues;