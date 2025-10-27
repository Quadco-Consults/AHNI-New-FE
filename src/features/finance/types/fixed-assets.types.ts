import { ItemData } from "@/features/modules/types/config";

// Enhanced Fixed Asset interface with financial calculations
export interface FixedAsset extends ItemData {
  // Financial fields calculated from base asset data
  originalCost: number;
  currentBookValue: number;
  accumulatedDepreciation: number;
  monthlyDepreciation: number;
  yearlyDepreciation: number;

  // Depreciation method and calculations
  depreciationMethod: DepreciationMethod;
  usefulLifeYears: number;
  depreciationRate: number;

  // Asset status for finance
  assetStatus: AssetFinanceStatus;
  isFullyDepreciated: boolean;

  // Financial dates
  acquisitionDate: string;
  lastDepreciationDate?: string;
  nextDepreciationDate?: string;

  // Asset number for accounting
  assetNumber: string;

  // Location and project tracking
  currentLocation?: string;
  assignedProject?: string;
  assignedDepartment?: string;
}

export type DepreciationMethod =
  | "straight_line"
  | "double_declining"
  | "units_of_production"
  | "sum_of_years";

export type AssetFinanceStatus =
  | "active"
  | "fully_depreciated"
  | "disposed"
  | "under_maintenance"
  | "written_off";

// Financial calculations helper
export interface DepreciationCalculation {
  year: number;
  period: string;
  openingBookValue: number;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  closingBookValue: number;
  method: DepreciationMethod;
}

// Asset summary for dashboard
export interface AssetSummary {
  totalAssets: number;
  totalOriginalCost: number;
  totalCurrentBookValue: number;
  totalAccumulatedDepreciation: number;
  monthlyDepreciation: number;
  assetsAdded: number;
  assetsDisposed: number;

  // Breakdown by category
  assetsByCategory: Record<string, {
    count: number;
    originalCost: number;
    bookValue: number;
  }>;

  // Breakdown by project
  assetsByProject: Record<string, {
    count: number;
    originalCost: number;
    bookValue: number;
  }>;
}

// Asset disposal tracking
export interface AssetDisposal {
  id: string;
  assetId: string;
  assetName: string;
  assetNumber: string;
  disposalDate: string;
  disposalMethod: DisposalMethod;
  originalCost: number;
  accumulatedDepreciation: number;
  bookValueAtDisposal: number;
  salePrice?: number;
  gainOrLoss: number;
  reason: string;
  approvedBy?: string;
  disposalNotes?: string;
}

export type DisposalMethod =
  | "sale"
  | "scrap"
  | "donation"
  | "trade_in"
  | "retirement"
  | "write_off";

// Asset filters for finance view
export interface AssetFilters {
  status?: AssetFinanceStatus;
  category?: string;
  project?: string;
  department?: string;
  location?: string;
  depreciationMethod?: DepreciationMethod;
  dateFrom?: string;
  dateTo?: string;
  costRange?: {
    min: number;
    max: number;
  };
  fullyDepreciated?: boolean;
}