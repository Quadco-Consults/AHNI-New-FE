// Fixed Asset types matching backend API

export interface FixedAsset {
  id: string;
  asset: string;
  asset_details?: {
    id: string;
    name: string;
    asset_code: string;
    asset_type: string | null;
    description: string;
    manufacturer: string | null;
    model: string | null;
  };
  asset_name?: string;
  asset_code?: string;
  asset_type?: string;

  // GL Accounts
  asset_account: string;
  asset_account_details?: {
    id: string;
    account_code: string;
    account_name: string;
    account_type: string;
  };
  accumulated_depreciation_account: string;
  accumulated_depreciation_account_details?: {
    id: string;
    account_code: string;
    account_name: string;
    account_type: string;
  };
  depreciation_expense_account: string;
  depreciation_expense_account_details?: {
    id: string;
    account_code: string;
    account_name: string;
    account_type: string;
  };

  // Financial Information
  acquisition_cost: string;
  currency: "NGN" | "USD";
  salvage_value: string;
  accumulated_depreciation: string;
  net_book_value: string;

  // Depreciation Configuration
  depreciation_method: DepreciationMethod;
  useful_life_years: number;
  useful_life_months: number;
  total_useful_life_months?: number;
  monthly_depreciation?: string;
  depreciable_amount?: string;
  is_fully_depreciated?: boolean;
  depreciation_percentage?: string;

  // Dates
  acquisition_date: string;
  placed_in_service_date: string;
  last_depreciation_date: string | null;

  // Status and Lifecycle
  status: FixedAssetStatus;
  disposal_date: string | null;
  disposal_amount: string | null;
  disposal_notes: string | null;

  // Tracking
  project: string | null;
  project_details?: {
    id: string;
    name: string;
  };
  project_name?: string;
  donor: string | null;
  donor_details?: {
    id: string;
    name: string;
  };
  donor_name?: string;
  location: string | null;
  location_details?: {
    id: string;
    name: string;
  };
  location_name?: string;

  auto_depreciate: boolean;

  // Metadata
  created_datetime: string;
  updated_datetime: string;
  created_by?: string;
  updated_by?: string;
}

export type DepreciationMethod =
  | "STRAIGHT_LINE"
  | "DECLINING_BALANCE"
  | "DOUBLE_DECLINING"
  | "UNITS_OF_PRODUCTION";

export type FixedAssetStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DISPOSED"
  | "UNDER_MAINTENANCE"
  | "RETIRED";

export interface DepreciationSchedule {
  id: string;
  fixed_asset: string;
  asset_name: string;
  asset_code: string;
  period_year: number;
  period_month: number;
  period_date: string;
  depreciation_amount: string;
  accumulated_depreciation: string;
  net_book_value: string;
  journal_entry: string | null;
  journal_entry_number: string | null;
  is_posted: boolean;
  posted_date: string | null;
  created_datetime: string;
}

export interface DepreciationRun {
  id: string;
  run_date: string;
  period_year: number;
  period_month: number;
  total_assets_processed: number;
  total_depreciation_amount: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  error_message: string | null;
  created_by: string | null;
  created_by_name: string | null;
  created_datetime: string;
}

export interface FixedAssetStats {
  total_assets: number;
  total_acquisition_cost: string;
  total_accumulated_depreciation: string;
  total_net_book_value: string;
  active_assets: number;
  disposed_assets: number;
  fully_depreciated_assets: number;
}

export interface FixedAssetFilters {
  search?: string;
  status?: FixedAssetStatus | "all";
  location?: string;
  project?: string;
  donor?: string;
  currency?: "NGN" | "USD" | "all";
  auto_depreciate?: boolean | "all";
  page?: number;
  page_size?: number;
}

export interface FixedAssetCreateInput {
  asset: string;
  asset_account: string;
  accumulated_depreciation_account: string;
  depreciation_expense_account: string;
  acquisition_cost: string;
  currency: "NGN" | "USD";
  salvage_value: string;
  depreciation_method: DepreciationMethod;
  useful_life_years: number;
  useful_life_months: number;
  acquisition_date: string;
  placed_in_service_date: string;
  project?: string;
  donor?: string;
  location?: string;
  auto_depreciate: boolean;
}

export interface FixedAssetUpdateInput {
  salvage_value?: string;
  useful_life_years?: number;
  useful_life_months?: number;
  depreciation_method?: DepreciationMethod;
  location?: string;
  project?: string;
  donor?: string;
  auto_depreciate?: boolean;
  status?: Exclude<FixedAssetStatus, "DISPOSED">;
}

export interface FixedAssetDisposeInput {
  disposal_date: string;
  disposal_amount?: string;
  notes?: string;
}

export interface RunDepreciationInput {
  year?: number;
  month?: number;
  auto_post?: boolean;
}

export interface FixedAssetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FixedAsset[];
}

export interface DepreciationScheduleResponse {
  asset: FixedAsset;
  schedules: DepreciationSchedule[];
  summary: {
    total_periods: number;
    posted_periods: number;
    pending_periods: number;
    total_depreciation: string;
  };
}

export interface RunDepreciationResponse {
  message: string;
  data: DepreciationRun;
  summary: {
    assets_processed: number;
    total_depreciation: string;
    errors_count: number;
    errors: string[] | null;
  };
}
