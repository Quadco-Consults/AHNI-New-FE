/**
 * TEMPORARY FALLBACK DATA FOR FINANCE CONFIGURATION DROPDOWNS
 *
 * This file provides fallback financial configuration data when the backend API
 * is applying permission-based filtering that limits results.
 *
 * TODO: Remove this file once backend implements proper unrestricted endpoints
 * for financial configurations that bypass user-specific filtering.
 */

export interface FallbackFinanceItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

/**
 * Common budget lines for financial management
 */
export const FALLBACK_BUDGET_LINES: FallbackFinanceItem[] = [
  { id: "temp-bl-1", name: "Personnel", description: "Staff salaries and benefits" },
  { id: "temp-bl-2", name: "Travel", description: "Travel and transportation" },
  { id: "temp-bl-3", name: "Equipment", description: "Equipment and supplies" },
  { id: "temp-bl-4", name: "Training", description: "Training and workshops" },
  { id: "temp-bl-5", name: "Operations", description: "Operational costs" },
  { id: "temp-bl-6", name: "Administration", description: "Administrative costs" },
  { id: "temp-bl-7", name: "Communications", description: "Communications and outreach" },
  { id: "temp-bl-8", name: "Monitoring", description: "Monitoring and evaluation" },
  { id: "temp-bl-9", name: "Utilities", description: "Utilities and maintenance" },
  { id: "temp-bl-10", name: "Consultancy", description: "Consultancy services" },
];

/**
 * Common cost categories for expense classification
 */
export const FALLBACK_COST_CATEGORIES: FallbackFinanceItem[] = [
  { id: "temp-cc-1", name: "Direct Costs", description: "Direct program costs" },
  { id: "temp-cc-2", name: "Indirect Costs", description: "Indirect program costs" },
  { id: "temp-cc-3", name: "Administrative Costs", description: "Administrative expenses" },
  { id: "temp-cc-4", name: "Operational Costs", description: "Day-to-day operations" },
  { id: "temp-cc-5", name: "Capital Expenditure", description: "Capital investments" },
  { id: "temp-cc-6", name: "Program Costs", description: "Program implementation" },
  { id: "temp-cc-7", name: "Support Costs", description: "Support services" },
  { id: "temp-cc-8", name: "Emergency Costs", description: "Emergency responses" },
];

/**
 * Common cost inputs for detailed expense tracking
 */
export const FALLBACK_COST_INPUTS: FallbackFinanceItem[] = [
  { id: "temp-ci-1", name: "Salary", description: "Staff salaries" },
  { id: "temp-ci-2", name: "Per Diem", description: "Daily allowances" },
  { id: "temp-ci-3", name: "Fuel", description: "Vehicle fuel costs" },
  { id: "temp-ci-4", name: "Office Rent", description: "Office rental costs" },
  { id: "temp-ci-5", name: "Vehicle Rental", description: "Vehicle rental costs" },
  { id: "temp-ci-6", name: "Training Materials", description: "Training supplies" },
  { id: "temp-ci-7", name: "Communication", description: "Phone and internet" },
  { id: "temp-ci-8", name: "Stationery", description: "Office supplies" },
  { id: "temp-ci-9", name: "Workshop Venue", description: "Venue rental" },
  { id: "temp-ci-10", name: "Equipment Purchase", description: "Equipment costs" },
  { id: "temp-ci-11", name: "Maintenance", description: "Equipment maintenance" },
  { id: "temp-ci-12", name: "Insurance", description: "Insurance costs" },
];

/**
 * Common FCO numbers for funding tracking
 */
export const FALLBACK_FCO_NUMBERS: FallbackFinanceItem[] = [
  { id: "temp-fco-1", name: "FCO-2024-001", code: "FCO-2024-001", description: "General Operations 2024" },
  { id: "temp-fco-2", name: "FCO-2024-002", code: "FCO-2024-002", description: "Emergency Response 2024" },
  { id: "temp-fco-3", name: "FCO-2024-003", code: "FCO-2024-003", description: "Capacity Building 2024" },
  { id: "temp-fco-4", name: "FCO-2024-004", code: "FCO-2024-004", description: "Research and Development 2024" },
  { id: "temp-fco-5", name: "FCO-2025-001", code: "FCO-2025-001", description: "General Operations 2025" },
];

/**
 * Common funding sources
 */
export const FALLBACK_FUNDING_SOURCES: FallbackFinanceItem[] = [
  { id: "temp-fs-1", name: "Government Grant", description: "Government funding" },
  { id: "temp-fs-2", name: "International Donor", description: "International donor funding" },
  { id: "temp-fs-3", name: "Private Foundation", description: "Private foundation grant" },
  { id: "temp-fs-4", name: "Corporate Sponsorship", description: "Corporate sponsor funding" },
  { id: "temp-fs-5", name: "Internal Funds", description: "Organization internal funds" },
  { id: "temp-fs-6", name: "Emergency Fund", description: "Emergency response fund" },
];

/**
 * Common intervention areas
 */
export const FALLBACK_INTERVENTION_AREAS: FallbackFinanceItem[] = [
  { id: "temp-ia-1", name: "IA001", code: "IA001", description: "Health and Nutrition" },
  { id: "temp-ia-2", name: "IA002", code: "IA002", description: "Education and Training" },
  { id: "temp-ia-3", name: "IA003", code: "IA003", description: "Water and Sanitation" },
  { id: "temp-ia-4", name: "IA004", code: "IA004", description: "Livelihood Support" },
  { id: "temp-ia-5", name: "IA005", code: "IA005", description: "Emergency Response" },
  { id: "temp-ia-6", name: "IA006", code: "IA006", description: "Capacity Building" },
  { id: "temp-ia-7", name: "IA007", code: "IA007", description: "Research and Development" },
];

/**
 * Check if API returned limited results indicating permission filtering
 */
export function isLimitedByPermissions(resultCount: number, expectedMinimum: number = 3): boolean {
  return resultCount < expectedMinimum;
}

/**
 * Generic merge function for finance configuration data
 */
function mergeWithFallback<T extends FallbackFinanceItem>(
  apiResults: T[],
  fallbackData: T[],
  dataType: string
): T[] {
  if (isLimitedByPermissions(apiResults.length)) {
    console.warn(`⚠️ Only ${apiResults.length} ${dataType} from API. Adding fallback ${dataType} for dropdown.`);

    // Merge API results with fallback, avoiding duplicates based on name similarity
    const merged = [...apiResults];

    fallbackData.forEach(fallbackItem => {
      const exists = apiResults.some(apiItem =>
        apiItem.name.toLowerCase().includes(fallbackItem.name.toLowerCase()) ||
        fallbackItem.name.toLowerCase().includes(apiItem.name.toLowerCase()) ||
        (fallbackItem.code && apiItem.name.toLowerCase().includes(fallbackItem.code.toLowerCase()))
      );

      if (!exists) {
        merged.push(fallbackItem);
      }
    });

    console.log(`✅ Merged ${dataType}: ${apiResults.length} from API + ${merged.length - apiResults.length} fallback = ${merged.length} total`);
    return merged;
  }

  return apiResults;
}

/**
 * Merge budget lines with fallback data
 */
export function mergeFallbackBudgetLines(apiBudgetLines: FallbackFinanceItem[]): FallbackFinanceItem[] {
  return mergeWithFallback(apiBudgetLines, FALLBACK_BUDGET_LINES, "budget lines");
}

/**
 * Merge cost categories with fallback data
 */
export function mergeFallbackCostCategories(apiCostCategories: FallbackFinanceItem[]): FallbackFinanceItem[] {
  return mergeWithFallback(apiCostCategories, FALLBACK_COST_CATEGORIES, "cost categories");
}

/**
 * Merge cost inputs with fallback data
 */
export function mergeFallbackCostInputs(apiCostInputs: FallbackFinanceItem[]): FallbackFinanceItem[] {
  return mergeWithFallback(apiCostInputs, FALLBACK_COST_INPUTS, "cost inputs");
}

/**
 * Merge FCO numbers with fallback data
 */
export function mergeFallbackFCONumbers(apiFCONumbers: FallbackFinanceItem[]): FallbackFinanceItem[] {
  return mergeWithFallback(apiFCONumbers, FALLBACK_FCO_NUMBERS, "FCO numbers");
}

/**
 * Merge funding sources with fallback data
 */
export function mergeFallbackFundingSources(apiFundingSources: FallbackFinanceItem[]): FallbackFinanceItem[] {
  return mergeWithFallback(apiFundingSources, FALLBACK_FUNDING_SOURCES, "funding sources");
}

/**
 * Merge intervention areas with fallback data
 */
export function mergeFallbackInterventionAreas(apiInterventionAreas: FallbackFinanceItem[]): FallbackFinanceItem[] {
  return mergeWithFallback(apiInterventionAreas, FALLBACK_INTERVENTION_AREAS, "intervention areas");
}