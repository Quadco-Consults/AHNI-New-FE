import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import * as XLSX from "xlsx";

// Types for lookup data
interface LookupData {
  id: string;
  name: string;
}

interface AssetUploadLookups {
  assetTypes: Map<string, string>; // name -> UUID
  projects: Map<string, string>;
  donors: Map<string, string>; // funding sources
  implementers: Map<string, string>; // partners
  locations: Map<string, string>;
  classifications: Map<string, string>;
  conditions: Map<string, string>;
  employees: Map<string, string>; // email -> UUID for assignees
}

/**
 * Fetch all lookup data needed for asset bulk upload
 */
export async function fetchAssetUploadLookups(): Promise<AssetUploadLookups> {
  try {
    // Fetch all data in parallel with large page sizes to get all records
    const [
      assetTypesRes,
      projectsRes,
      donorsRes,
      implementersRes,
      locationsRes,
      classificationsRes,
      conditionsRes,
      employeesRes
    ] = await Promise.all([
      AxiosWithToken.get("/admins/inventory/asset-types/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/projects/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/projects/funding-sources/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/projects/partners/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/config/locations/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/admins/inventory/asset-classifications/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/admins/inventory/asset-conditions/", { params: { page: 1, size: 1000 } }),
      AxiosWithToken.get("/hr/employees/", { params: { page: 1, size: 1000 } }).catch(() => ({ data: { data: { results: [] } } })) // Handle if HR endpoint is not available
    ]);

    // Helper function to create case-insensitive name->UUID map
    const createLookupMap = (items: any[]): Map<string, string> => {
      const map = new Map<string, string>();
      items.forEach((item) => {
        if (item.name && item.id) {
          // Store both original case and lowercase for flexible matching
          map.set(item.name.toLowerCase().trim(), item.id);
          map.set(item.name.trim(), item.id);
        }
      });
      return map;
    };

    // Helper function for email -> UUID map (for employees/assignees)
    const createEmailLookupMap = (items: any[]): Map<string, string> => {
      const map = new Map<string, string>();
      items.forEach((item) => {
        if (item.email && item.id) {
          map.set(item.email.toLowerCase().trim(), item.id);
          map.set(item.email.trim(), item.id);
        }
        // Also support lookup by full name if available
        if (item.full_name && item.id) {
          map.set(item.full_name.toLowerCase().trim(), item.id);
          map.set(item.full_name.trim(), item.id);
        }
      });
      return map;
    };

    return {
      assetTypes: createLookupMap(assetTypesRes.data?.data?.results || assetTypesRes.data?.results || []),
      projects: createLookupMap(projectsRes.data?.data?.results || projectsRes.data?.results || []),
      donors: createLookupMap(donorsRes.data?.data?.results || donorsRes.data?.results || []),
      implementers: createLookupMap(implementersRes.data?.data?.results || implementersRes.data?.results || []),
      locations: createLookupMap(locationsRes.data?.data?.results || locationsRes.data?.results || []),
      classifications: createLookupMap(classificationsRes.data?.data?.results || classificationsRes.data?.results || []),
      conditions: createLookupMap(conditionsRes.data?.data?.results || conditionsRes.data?.results || []),
      employees: createEmailLookupMap(employeesRes.data?.data?.results || employeesRes.data?.results || []),
    };
  } catch (error) {
    console.error("Error fetching lookup data:", error);
    throw new Error("Failed to load reference data. Please try again.");
  }
}

/**
 * Check if a string is a valid UUID
 */
function isValidUUID(str: string): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str.trim());
}

/**
 * Convert name to UUID using lookup map
 * Returns the original value if it's already a UUID or if conversion fails
 */
function resolveToUUID(value: string | undefined | null, lookupMap: Map<string, string>): string {
  if (!value || value.trim() === '') return '';

  const trimmedValue = value.trim();

  // If it's already a UUID, return as-is
  if (isValidUUID(trimmedValue)) {
    return trimmedValue;
  }

  // Try to find UUID by name (case-insensitive)
  const uuid = lookupMap.get(trimmedValue) || lookupMap.get(trimmedValue.toLowerCase());

  // Return UUID if found, otherwise return original value (will cause validation error on backend)
  return uuid || trimmedValue;
}

/**
 * Process CSV file and convert names to UUIDs
 */
export async function preprocessAssetCSV(file: File, lookups: AssetUploadLookups): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonData.length === 0) {
          reject(new Error("CSV file is empty"));
          return;
        }

        // Process each row and convert names to UUIDs
        const processedData = jsonData.map((row) => {
          // Skip comment rows (rows where first column starts with #)
          const firstValue = Object.values(row)[0] as string;
          if (firstValue && String(firstValue).trim().startsWith('#')) {
            return row;
          }

          return {
            ...row,
            "Asset Type": resolveToUUID(row["Asset Type"], lookups.assetTypes),
            "Project": resolveToUUID(row["Project"], lookups.projects),
            "Donor": resolveToUUID(row["Donor"], lookups.donors),
            "Assignee": resolveToUUID(row["Assignee"], lookups.employees),
            "Implementer": resolveToUUID(row["Implementer"], lookups.implementers),
            "Location": resolveToUUID(row["Location"], lookups.locations),
            "Classification": resolveToUUID(row["Classification"], lookups.classifications),
            "Asset Condition": resolveToUUID(row["Asset Condition"], lookups.conditions),
          };
        });

        // Convert back to worksheet
        const newWorksheet = XLSX.utils.json_to_sheet(processedData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

        // Convert to CSV blob
        const csvContent = XLSX.utils.sheet_to_csv(newWorksheet);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create new File object with same name
        const processedFile = new File([blob], file.name, { type: 'text/csv' });

        resolve(processedFile);
      } catch (error) {
        console.error("CSV preprocessing error:", error);
        reject(new Error("Failed to process CSV file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Validate that all required lookup data exists
 */
export function validateLookupsLoaded(lookups: AssetUploadLookups): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (lookups.assetTypes.size === 0) missing.push("Asset Types");
  if (lookups.projects.size === 0) missing.push("Projects");
  if (lookups.donors.size === 0) missing.push("Donors/Funding Sources");
  if (lookups.implementers.size === 0) missing.push("Implementers/Partners");
  if (lookups.locations.size === 0) missing.push("Locations");
  if (lookups.classifications.size === 0) missing.push("Asset Classifications");
  if (lookups.conditions.size === 0) missing.push("Asset Conditions");

  return {
    valid: missing.length === 0,
    missing
  };
}
