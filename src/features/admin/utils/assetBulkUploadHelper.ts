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
    const isExcelFile = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls');
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        let textContent: string;

        if (isExcelFile) {
          // For Excel files, use XLSX library to convert to CSV first
          const data = e.target?.result;
          if (!data) {
            reject(new Error("Failed to read file data"));
            return;
          }

          console.log('Reading Excel file, data type:', typeof data, 'size:', data instanceof ArrayBuffer ? data.byteLength : 'unknown');

          try {
            const workbook = XLSX.read(data, {
              type: 'array',
              cellDates: true,
              cellNF: false,
              cellText: false
            });

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              reject(new Error('Excel file contains no sheets'));
              return;
            }

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            if (!worksheet) {
              reject(new Error('Failed to read Excel worksheet'));
              return;
            }

            textContent = XLSX.utils.sheet_to_csv(worksheet, {
              blankrows: false,
              skipHidden: true
            });

            console.log('Successfully converted Excel to CSV, length:', textContent.length);
            console.log('First 200 chars of converted CSV:', textContent.substring(0, 200));
          } catch (xlsxError) {
            console.error('XLSX parsing error:', xlsxError);
            reject(new Error(`Failed to parse Excel file: ${xlsxError instanceof Error ? xlsxError.message : 'Unknown error'}`));
            return;
          }
        } else {
          // For CSV files, read as text
          textContent = e.target?.result as string;
          if (!textContent) {
            reject(new Error("Failed to read file data"));
            return;
          }
          console.log('Read CSV file as text, length:', textContent.length);
        }

        // Parse CSV text
        const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        if (lines.length < 2) {
          reject(new Error("File must contain headers and at least one data row"));
          return;
        }

        // Extract headers (first non-comment line)
        let headerIndex = 0;
        while (headerIndex < lines.length && lines[headerIndex].startsWith('#')) {
          headerIndex++;
        }

        if (headerIndex >= lines.length) {
          reject(new Error("No header row found in file"));
          return;
        }

        const headers = lines[headerIndex].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

        // Clean headers - remove helper text in parentheses (e.g., "name (Required)" -> "name")
        const cleanedHeaders = headers.map(h => h.replace(/\s*\(.*?\)\s*/g, '').trim());

        // Find column indices for fields that need UUID conversion
        const assetTypeIdx = cleanedHeaders.indexOf('asset_type');
        const projectIdx = cleanedHeaders.indexOf('project');
        const donorIdx = cleanedHeaders.indexOf('donor');
        const assigneeIdx = cleanedHeaders.indexOf('assignee');
        const implementerIdx = cleanedHeaders.indexOf('implementer');
        const locationIdx = cleanedHeaders.indexOf('location');
        const classificationIdx = cleanedHeaders.indexOf('classification');
        const assetConditionIdx = cleanedHeaders.indexOf('asset_condition');

        // Process data rows
        const processedLines: string[] = [lines[headerIndex]]; // Keep header

        for (let i = headerIndex + 1; i < lines.length; i++) {
          const line = lines[i];

          // Skip comment lines
          if (line.startsWith('#')) {
            continue;
          }

          // Parse CSV row (handle quoted values)
          const values = parseCSVLine(line);

          if (values.length === 0) {
            continue;
          }

          // Convert names to UUIDs
          if (assetTypeIdx >= 0 && assetTypeIdx < values.length) {
            values[assetTypeIdx] = resolveToUUID(values[assetTypeIdx], lookups.assetTypes);
          }
          if (projectIdx >= 0 && projectIdx < values.length) {
            values[projectIdx] = resolveToUUID(values[projectIdx], lookups.projects);
          }
          if (donorIdx >= 0 && donorIdx < values.length) {
            values[donorIdx] = resolveToUUID(values[donorIdx], lookups.donors);
          }
          if (assigneeIdx >= 0 && assigneeIdx < values.length) {
            values[assigneeIdx] = resolveToUUID(values[assigneeIdx], lookups.employees);
          }
          if (implementerIdx >= 0 && implementerIdx < values.length) {
            values[implementerIdx] = resolveToUUID(values[implementerIdx], lookups.implementers);
          }
          if (locationIdx >= 0 && locationIdx < values.length) {
            values[locationIdx] = resolveToUUID(values[locationIdx], lookups.locations);
          }
          if (classificationIdx >= 0 && classificationIdx < values.length) {
            values[classificationIdx] = resolveToUUID(values[classificationIdx], lookups.classifications);
          }
          if (assetConditionIdx >= 0 && assetConditionIdx < values.length) {
            values[assetConditionIdx] = resolveToUUID(values[assetConditionIdx], lookups.conditions);
          }

          // Rebuild CSV line (escape values with commas)
          const processedLine = values.map(v => {
            const val = String(v || '').trim();
            return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
          }).join(',');

          processedLines.push(processedLine);
        }

        if (processedLines.length < 2) {
          reject(new Error("No valid data rows found in file"));
          return;
        }

        // Create CSV content
        const csvContent = processedLines.join('\n');

        console.log('=== CSV PREPROCESSING COMPLETE ===');
        console.log('Original file:', file.name, file.type, file.size, 'bytes');
        console.log('Processed CSV preview:', csvContent.substring(0, 500));
        console.log('Total data rows:', processedLines.length - 1);
        console.log('Headers:', headers.join(', '));

        // Create blob and file with .csv extension
        const outputFileName = file.name.replace(/\.(xlsx|xls)$/i, '.csv');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const processedFile = new File([blob], outputFileName, { type: 'text/csv' });

        console.log('Output file:', processedFile.name, processedFile.type, processedFile.size, 'bytes');
        console.log('=== END CSV PREPROCESSING ===');

        resolve(processedFile);
      } catch (error) {
        console.error("CSV preprocessing error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to process file";
        reject(new Error(errorMessage));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    // Read file based on type
    if (isExcelFile) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
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
