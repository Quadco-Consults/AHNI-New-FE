/**
 * Activity Cost Sheet Types
 *
 * Represents sub-activities that break down the total cost of an activity.
 * Each activity can have multiple cost sheet entries (sub-activities).
 */

export interface TActivityCostSheet {
  id: string;
  activity: string; // Foreign key to TActivity ID
  description: string;
  units: number;
  days: number;
  frequency: number;
  rate_ngn: number; // Rate in Naira
  total_cost_ngn: number; // Calculated: units × days × frequency × rate_ngn
  comments: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface TActivityCostSheetCreate {
  activity: string;
  description: string;
  units: number;
  days: number;
  frequency: number;
  rate_ngn: number;
  comments?: string;
}

export interface TActivityCostSheetUpdate {
  description?: string;
  units?: number;
  days?: number;
  frequency?: number;
  rate_ngn?: number;
  comments?: string;
}

export interface TActivityCostSheetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TActivityCostSheet[];
}

export interface TActivityCostSheetStats {
  total_activities: number;
  activities_with_cost_sheets: number;
  activities_without_cost_sheets: number;
  completion_percentage: number;
  total_cost_sheets_count: number;
}

export interface TActivityCostSheetSummary {
  activity_id: string;
  activity_number: string;
  activity_name: string;
  total_budget_ngn: number;
  cost_sheet_total_ngn: number;
  variance_ngn: number; // total_budget - cost_sheet_total
  variance_percentage: number;
  cost_sheets_count: number;
  has_cost_sheet: boolean;
  validation_status: 'VALIDATED' | 'REVIEW' | 'MISMATCH' | 'MISSING';
}

/**
 * Validation Status Logic:
 * - VALIDATED: Cost sheet total matches activity budget (difference < 0.01%)
 * - REVIEW: Close match but needs review (difference 0.01% - 5%)
 * - MISMATCH: Significant difference (difference >= 5%)
 * - MISSING: No cost sheets created yet
 */
export type TCostSheetValidationStatus = 'VALIDATED' | 'REVIEW' | 'MISMATCH' | 'MISSING';

/**
 * Helper function to calculate total cost
 */
export function calculateTotalCost(
  units: number,
  days: number,
  frequency: number,
  rate_ngn: number
): number {
  return units * days * frequency * rate_ngn;
}

/**
 * Helper function to determine validation status
 */
export function getCostSheetValidationStatus(
  budgetTotal: number,
  costSheetTotal: number,
  hasCostSheets: boolean
): TCostSheetValidationStatus {
  if (!hasCostSheets || costSheetTotal === 0) {
    return 'MISSING';
  }

  const difference = Math.abs(budgetTotal - costSheetTotal);
  const percentageDiff = (difference / budgetTotal) * 100;

  if (percentageDiff < 0.01) {
    return 'VALIDATED';
  } else if (percentageDiff < 5) {
    return 'REVIEW';
  } else {
    return 'MISMATCH';
  }
}

/**
 * Helper function to get status styling
 */
export function getCostSheetStatusStyling(status: TCostSheetValidationStatus) {
  switch (status) {
    case 'VALIDATED':
      return {
        label: 'Validated',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: '✓',
        description: 'Cost sheet matches budget'
      };
    case 'REVIEW':
      return {
        label: 'Needs Review',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '⚠',
        description: 'Cost sheet close but needs review'
      };
    case 'MISMATCH':
      return {
        label: 'Mismatch',
        className: 'bg-red-100 text-red-800 border-red-300',
        icon: '✗',
        description: 'Significant variance from budget'
      };
    case 'MISSING':
      return {
        label: 'No Cost Sheet',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: '○',
        description: 'Cost sheet not created'
      };
  }
}
