import { DepreciationMethod, DepreciationCalculation, FixedAsset } from "../types/fixed-assets.types";
import { ItemData } from "@/features/modules/types/config";

/**
 * Calculate depreciation for assets using various methods
 */

export function calculateStraightLineDepreciation(
  originalCost: number,
  salvageValue: number = 0,
  usefulLifeYears: number
): number {
  if (usefulLifeYears <= 0) return 0;
  return (originalCost - salvageValue) / usefulLifeYears;
}

export function calculateDoubleDecliningDepreciation(
  originalCost: number,
  currentBookValue: number,
  usefulLifeYears: number
): number {
  if (usefulLifeYears <= 0) return 0;
  const straightLineRate = 1 / usefulLifeYears;
  const doubleDecliningRate = straightLineRate * 2;
  return currentBookValue * doubleDecliningRate;
}

export function calculateUnitsOfProductionDepreciation(
  originalCost: number,
  salvageValue: number = 0,
  totalUnitsExpected: number,
  unitsProducedThisPeriod: number
): number {
  if (totalUnitsExpected <= 0) return 0;
  const depreciationPerUnit = (originalCost - salvageValue) / totalUnitsExpected;
  return depreciationPerUnit * unitsProducedThisPeriod;
}

export function calculateSumOfYearsDigitsDepreciation(
  originalCost: number,
  salvageValue: number = 0,
  usefulLifeYears: number,
  currentYear: number
): number {
  if (usefulLifeYears <= 0 || currentYear > usefulLifeYears) return 0;

  const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
  const remainingYears = usefulLifeYears - currentYear + 1;
  const depreciationFactor = remainingYears / sumOfYears;

  return (originalCost - salvageValue) * depreciationFactor;
}

/**
 * Convert admin ItemData to FixedAsset with financial calculations
 */
export function convertItemToFixedAsset(item: ItemData, assetNumber?: string): FixedAsset {
  // Extract financial values
  const usdCost = parseFloat(item.usd_cost || "0");
  const ngnCost = parseFloat(item.ngn_cost || "0");
  const originalCost = usdCost > 0 ? usdCost : ngnCost;

  // Parse acquisition date
  const acquisitionDate = item.acquisition_date || item.created_at;
  const depreciationRate = parseFloat(item.depreciation_rate?.toString() || "0");
  const usefulLifeYears = parseFloat(item.estimated_life_span || "5");

  // Calculate years since acquisition
  const yearsSinceAcquisition = calculateYearsSinceAcquisition(acquisitionDate);

  // Default to straight line depreciation
  const depreciationMethod: DepreciationMethod = "straight_line";

  // Calculate depreciation amounts
  const yearlyDepreciation = calculateStraightLineDepreciation(originalCost, 0, usefulLifeYears);
  const monthlyDepreciation = yearlyDepreciation / 12;
  const accumulatedDepreciation = Math.min(yearlyDepreciation * yearsSinceAcquisition, originalCost);
  const currentBookValue = Math.max(originalCost - accumulatedDepreciation, 0);

  // Determine asset status
  const isFullyDepreciated = accumulatedDepreciation >= originalCost;
  const assetStatus = isFullyDepreciated ? "fully_depreciated" : "active";

  // Generate asset number if not provided
  const generatedAssetNumber = assetNumber || generateAssetNumber(item);

  return {
    ...item,
    originalCost,
    currentBookValue,
    accumulatedDepreciation,
    monthlyDepreciation,
    yearlyDepreciation,
    depreciationMethod,
    usefulLifeYears,
    depreciationRate: depreciationRate || (100 / usefulLifeYears),
    assetStatus,
    isFullyDepreciated,
    acquisitionDate,
    assetNumber: generatedAssetNumber,
    currentLocation: typeof item.location === "string" ? item.location : item.location?.name,
    assignedProject: typeof item.project === "string" ? item.project : item.project?.title || item.project?.name,
    assignedDepartment: item.assignee ?
      (typeof item.assignee === "string" ? "" : item.assignee.full_name || `${item.assignee.first_name || ""} ${item.assignee.last_name || ""}`.trim())
      : "",
  };
}

/**
 * Calculate years since acquisition date
 */
function calculateYearsSinceAcquisition(acquisitionDate: string): number {
  const acquisitionDateTime = new Date(acquisitionDate);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - acquisitionDateTime.getTime();
  const yearsDifference = timeDifference / (1000 * 3600 * 24 * 365.25);
  return Math.max(yearsDifference, 0);
}

/**
 * Generate asset number from ItemData
 */
function generateAssetNumber(item: ItemData): string {
  if (item.asset_code) {
    return item.asset_code;
  }

  // Generate based on category and creation date
  const category = typeof item.category === "string" ? "GEN" :
    (item.category?.name || "GEN").substring(0, 3).toUpperCase();
  const year = new Date(item.created_at).getFullYear();
  const id = item.id.substring(0, 6).toUpperCase();

  return `FA-${category}-${year}-${id}`;
}

/**
 * Generate depreciation schedule for an asset
 */
export function generateDepreciationSchedule(
  asset: FixedAsset,
  periods: number = 60 // 5 years in months
): DepreciationCalculation[] {
  const schedule: DepreciationCalculation[] = [];
  let remainingBookValue = asset.currentBookValue;
  let totalAccumulatedDepreciation = asset.accumulatedDepreciation;

  const startDate = new Date(asset.acquisitionDate);

  for (let i = 0; i < periods; i++) {
    const periodDate = new Date(startDate);
    periodDate.setMonth(periodDate.getMonth() + i);

    let depreciationAmount = 0;

    switch (asset.depreciationMethod) {
      case "straight_line":
        depreciationAmount = asset.monthlyDepreciation;
        break;
      case "double_declining":
        depreciationAmount = calculateDoubleDecliningDepreciation(
          asset.originalCost,
          remainingBookValue,
          asset.usefulLifeYears
        ) / 12;
        break;
      default:
        depreciationAmount = asset.monthlyDepreciation;
    }

    // Don't depreciate below zero
    depreciationAmount = Math.min(depreciationAmount, remainingBookValue);

    const openingBookValue = remainingBookValue;
    totalAccumulatedDepreciation += depreciationAmount;
    remainingBookValue -= depreciationAmount;

    schedule.push({
      year: periodDate.getFullYear(),
      period: periodDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      openingBookValue,
      depreciationAmount,
      accumulatedDepreciation: totalAccumulatedDepreciation,
      closingBookValue: remainingBookValue,
      method: asset.depreciationMethod,
    });

    // Stop if fully depreciated
    if (remainingBookValue <= 0) break;
  }

  return schedule;
}

/**
 * Calculate asset summary from a list of assets
 */
export function calculateAssetSummary(assets: FixedAsset[]) {
  const summary = {
    totalAssets: assets.length,
    totalOriginalCost: 0,
    totalCurrentBookValue: 0,
    totalAccumulatedDepreciation: 0,
    monthlyDepreciation: 0,
    assetsAdded: 0,
    assetsDisposed: 0,
    assetsByCategory: {} as Record<string, { count: number; originalCost: number; bookValue: number }>,
    assetsByProject: {} as Record<string, { count: number; originalCost: number; bookValue: number }>,
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  assets.forEach(asset => {
    summary.totalOriginalCost += asset.originalCost;
    summary.totalCurrentBookValue += asset.currentBookValue;
    summary.totalAccumulatedDepreciation += asset.accumulatedDepreciation;
    summary.monthlyDepreciation += asset.monthlyDepreciation;

    // Count assets added this month
    const acquisitionDate = new Date(asset.acquisitionDate);
    if (acquisitionDate.getMonth() === currentMonth && acquisitionDate.getFullYear() === currentYear) {
      summary.assetsAdded++;
    }

    // Count disposed assets
    if (asset.assetStatus === "disposed") {
      summary.assetsDisposed++;
    }

    // Group by category
    const categoryName = typeof asset.category === "string" ? asset.category : asset.category?.name || "Uncategorized";
    if (!summary.assetsByCategory[categoryName]) {
      summary.assetsByCategory[categoryName] = { count: 0, originalCost: 0, bookValue: 0 };
    }
    summary.assetsByCategory[categoryName].count++;
    summary.assetsByCategory[categoryName].originalCost += asset.originalCost;
    summary.assetsByCategory[categoryName].bookValue += asset.currentBookValue;

    // Group by project
    const projectName = asset.assignedProject || "Unassigned";
    if (!summary.assetsByProject[projectName]) {
      summary.assetsByProject[projectName] = { count: 0, originalCost: 0, bookValue: 0 };
    }
    summary.assetsByProject[projectName].count++;
    summary.assetsByProject[projectName].originalCost += asset.originalCost;
    summary.assetsByProject[projectName].bookValue += asset.currentBookValue;
  });

  return summary;
}