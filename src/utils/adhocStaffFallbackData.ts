/**
 * TEMPORARY FALLBACK DATA FOR ADHOC STAFF REQUISITIONS
 *
 * This file provides fallback position and department data for adhoc staff requisitions
 * when the backend API is applying permission-based filtering that limits results.
 *
 * TODO: Remove this file once backend implements proper unrestricted endpoints
 * for positions and departments that bypass user-specific filtering.
 */

export interface FallbackPosition {
  id: string;
  name: string;
}

export interface FallbackDepartment {
  id: string;
  name: string;
}

/**
 * Common AHNI positions for adhoc staff - based on typical organizational structure
 */
export const FALLBACK_POSITIONS: FallbackPosition[] = [
  { id: "temp-pos-1", name: "Program Officer" },
  { id: "temp-pos-2", name: "Project Manager" },
  { id: "temp-pos-3", name: "Field Coordinator" },
  { id: "temp-pos-4", name: "Data Officer" },
  { id: "temp-pos-5", name: "Finance Officer" },
  { id: "temp-pos-6", name: "Administrative Assistant" },
  { id: "temp-pos-7", name: "Driver" },
  { id: "temp-pos-8", name: "Security Officer" },
  { id: "temp-pos-9", name: "Cleaner/Office Assistant" },
  { id: "temp-pos-10", name: "IT Support Specialist" },
  { id: "temp-pos-11", name: "Communications Officer" },
  { id: "temp-pos-12", name: "Monitoring & Evaluation Officer" },
  { id: "temp-pos-13", name: "Logistics Officer" },
  { id: "temp-pos-14", name: "Human Resources Officer" },
  { id: "temp-pos-15", name: "Research Associate" },
  { id: "temp-pos-16", name: "Technical Advisor" },
  { id: "temp-pos-17", name: "Community Health Worker" },
  { id: "temp-pos-18", name: "Nurse/Medical Officer" },
  { id: "temp-pos-19", name: "Accountant" },
  { id: "temp-pos-20", name: "Procurement Officer" },
];

/**
 * Common AHNI departments for adhoc staff - based on typical organizational structure
 */
export const FALLBACK_DEPARTMENTS: FallbackDepartment[] = [
  { id: "temp-dept-1", name: "Programs" },
  { id: "temp-dept-2", name: "Finance & Administration" },
  { id: "temp-dept-3", name: "Human Resources" },
  { id: "temp-dept-4", name: "Monitoring & Evaluation" },
  { id: "temp-dept-5", name: "Communications" },
  { id: "temp-dept-6", name: "Information Technology" },
  { id: "temp-dept-7", name: "Procurement & Logistics" },
  { id: "temp-dept-8", name: "Project Management" },
  { id: "temp-dept-9", name: "Operations" },
  { id: "temp-dept-10", name: "Research & Development" },
  { id: "temp-dept-11", name: "Quality Assurance" },
  { id: "temp-dept-12", name: "Field Operations" },
  { id: "temp-dept-13", name: "Training & Capacity Building" },
  { id: "temp-dept-14", name: "Security & Safety" },
  { id: "temp-dept-15", name: "Executive Office" },
];

/**
 * Check if API returned limited results indicating permission filtering
 */
export function isLimitedByPermissions(resultCount: number, expectedMinimum: number = 5): boolean {
  return resultCount < expectedMinimum;
}

/**
 * Merge API results with fallback data to ensure comprehensive options
 */
export function mergeFallbackPositions(apiPositions: FallbackPosition[]): FallbackPosition[] {
  if (isLimitedByPermissions(apiPositions.length)) {
    console.warn(`⚠️ Only ${apiPositions.length} positions from API. Adding fallback positions for adhoc staff requisition.`);

    // Merge API results with fallback, avoiding duplicates based on name similarity
    const merged = [...apiPositions];

    FALLBACK_POSITIONS.forEach(fallbackPos => {
      const exists = apiPositions.some(apiPos =>
        apiPos.name.toLowerCase().includes(fallbackPos.name.toLowerCase()) ||
        fallbackPos.name.toLowerCase().includes(apiPos.name.toLowerCase())
      );

      if (!exists) {
        merged.push(fallbackPos);
      }
    });

    console.log(`✅ Merged positions: ${apiPositions.length} from API + ${merged.length - apiPositions.length} fallback = ${merged.length} total`);
    return merged;
  }

  return apiPositions;
}

/**
 * Merge API results with fallback data to ensure comprehensive options
 */
export function mergeFallbackDepartments(apiDepartments: FallbackDepartment[]): FallbackDepartment[] {
  if (isLimitedByPermissions(apiDepartments.length)) {
    console.warn(`⚠️ Only ${apiDepartments.length} departments from API. Adding fallback departments for adhoc staff requisition.`);

    // Merge API results with fallback, avoiding duplicates based on name similarity
    const merged = [...apiDepartments];

    FALLBACK_DEPARTMENTS.forEach(fallbackDept => {
      const exists = apiDepartments.some(apiDept =>
        apiDept.name.toLowerCase().includes(fallbackDept.name.toLowerCase()) ||
        fallbackDept.name.toLowerCase().includes(apiDept.name.toLowerCase())
      );

      if (!exists) {
        merged.push(fallbackDept);
      }
    });

    console.log(`✅ Merged departments: ${apiDepartments.length} from API + ${merged.length - apiDepartments.length} fallback = ${merged.length} total`);
    return merged;
  }

  return apiDepartments;
}