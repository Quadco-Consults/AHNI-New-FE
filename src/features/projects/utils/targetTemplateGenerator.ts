/**
 * Project Targets Bulk Upload Template Generator
 *
 * Generates an Excel template for bulk import of project performance targets
 */

import { XLSX } from '@/utils/excelUtils';

export interface TargetTemplateData {
  indicator_code: string;
  indicator_name?: string;
  tracking_mode: 'SIMPLE' | 'QUARTERLY';
  fiscal_year: string;
  annual_target: number;
  q1_target?: number;
  q2_target?: number;
  q3_target?: number;
  q4_target?: number;
  target_notes?: string;
}

export const TARGET_TEMPLATE_HEADERS_SIMPLE = [
  { key: 'indicator_code', label: 'Indicator Code *', required: true },
  { key: 'indicator_name', label: 'Custom Indicator Name (only for CUSTOM code)', required: false },
  { key: 'fiscal_year', label: 'Fiscal Year *', required: true },
  { key: 'annual_target', label: 'Annual Target *', required: true },
  { key: 'target_notes', label: 'Target Notes (Optional)', required: false },
];

export const TARGET_TEMPLATE_HEADERS_QUARTERLY = [
  { key: 'indicator_code', label: 'Indicator Code *', required: true },
  { key: 'indicator_name', label: 'Custom Indicator Name (only for CUSTOM code)', required: false },
  { key: 'fiscal_year', label: 'Fiscal Year *', required: true },
  { key: 'annual_target', label: 'Annual Target *', required: true },
  { key: 'q1_target', label: 'Q1 Target (Optional)', required: false },
  { key: 'q2_target', label: 'Q2 Target (Optional)', required: false },
  { key: 'q3_target', label: 'Q3 Target (Optional)', required: false },
  { key: 'q4_target', label: 'Q4 Target (Optional)', required: false },
  { key: 'target_notes', label: 'Target Notes (Optional)', required: false },
];

const SAMPLE_DATA_SIMPLE = {
  indicator_code: 'TX_CURR',
  indicator_name: '',
  fiscal_year: 'FY26',
  annual_target: 5000,
  target_notes: 'Main target for ART therapy',
};

const SAMPLE_DATA_QUARTERLY = {
  indicator_code: 'HTS_TST',
  indicator_name: '',
  fiscal_year: 'FY26',
  annual_target: 10000,
  q1_target: 2000,
  q2_target: 2500,
  q3_target: 2500,
  q4_target: 3000,
  target_notes: 'HIV testing services with quarterly breakdown',
};

const VALID_INDICATOR_CODES = [
  'TX_CURR',
  'TX_NEW',
  'HTS_TST',
  'PMTCT_STAT',
  'OVC_SERV',
  'TB_STAT',
  'TB_ART',
  'CUSTOM'
];

/**
 * Generate Excel template for project targets
 */
export const generateTargetsTemplate = async (trackingMode: 'simple' | 'quarterly' = 'simple'): Promise<void> => {
  const isQuarterly = trackingMode === 'quarterly';
  const headers = isQuarterly ? TARGET_TEMPLATE_HEADERS_QUARTERLY : TARGET_TEMPLATE_HEADERS_SIMPLE;
  const sampleData = isQuarterly ? SAMPLE_DATA_QUARTERLY : SAMPLE_DATA_SIMPLE;

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // ===== DATA SHEET =====
  const dataSheet: any[][] = [];

  // Add headers
  dataSheet.push(headers.map(h => h.label));

  // Add sample row
  dataSheet.push(headers.map(h => {
    const value = sampleData[h.key as keyof typeof sampleData];
    return value !== undefined ? value : '';
  }));

  // Add 5 empty rows for user to fill
  for (let i = 0; i < 5; i++) {
    dataSheet.push(headers.map(() => ''));
  }

  const worksheet = createWorksheetFromArray(dataSheet);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Targets');

  // ===== INSTRUCTIONS SHEET =====
  const instructionsData: any[][] = [
    ['PROJECT PERFORMANCE TARGETS - BULK UPLOAD TEMPLATE'],
    [''],
    ['INSTRUCTIONS:'],
    ['1. Fill in the target details in the "Targets" sheet'],
    ['2. Each row represents one performance target'],
    ['3. Fields marked with * are required'],
    ['4. Delete the sample row before uploading'],
    ['5. Save the file and upload it in the application'],
    [''],
    ['FIELD DESCRIPTIONS:'],
    [''],
    ['Indicator Code *'],
    ['  Valid values: TX_CURR, TX_NEW, HTS_TST, PMTCT_STAT, OVC_SERV, TB_STAT, TB_ART, CUSTOM'],
    ['  Use CUSTOM if your indicator is not in the list above'],
    [''],
    ['Custom Indicator Name'],
    ['  Only required when Indicator Code is CUSTOM'],
    ['  Example: "Number of community health workers trained"'],
    [''],
    ['Fiscal Year *'],
    ['  Format: FY24, FY25, FY26, etc.'],
    ['  Example: FY26 for fiscal year 2025/2026'],
    [''],
    ['Annual Target *'],
    ['  The total target value for the entire fiscal year'],
    ['  Must be a positive number'],
    ['  Example: 5000'],
    [''],
  ];

  if (isQuarterly) {
    instructionsData.push(
      ['Q1, Q2, Q3, Q4 Targets'],
      ['  Optional quarterly breakdown of the annual target'],
      ['  Must be numbers'],
      ['  Ideally Q1 + Q2 + Q3 + Q4 should equal Annual Target'],
      ['']
    );
  }

  instructionsData.push(
    ['Target Notes'],
    ['  Optional notes or comments about this target'],
    ['  Can include context, assumptions, or special considerations'],
    [''],
    ['EXAMPLE DATA:'],
    ['  See the first row in the "Targets" sheet for an example'],
    [''],
    ['TIPS:'],
    ['  - Copy and paste rows to add multiple targets quickly'],
    ['  - Use Excel formulas to calculate values if needed'],
    ['  - Save frequently to avoid losing data'],
    ['  - Upload the Excel file (.xlsx) directly - no need to convert to CSV'],
    [''],
    ['TRACKING MODE:'],
    [`  This template is for ${isQuarterly ? 'QUARTERLY' : 'SIMPLE'} tracking mode`],
    [`  ${isQuarterly ? 'Include quarterly breakdowns for detailed monitoring' : 'Only annual targets are required'}`],
  );

  const instructionsSheet = createWorksheetFromArray(instructionsData);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Download file
  const filename = `Project_Targets_Template_${isQuarterly ? 'Quarterly' : 'Simple'}_${new Date().toISOString().split('T')[0]}.xlsx`;
  await XLSX.writeFile(workbook, filename);
};

/**
 * Helper to create worksheet from 2D array
 */
function createWorksheetFromArray(data: any[][]): any {
  const maxCol = Math.max(...data.map(row => row.length));
  const maxRow = data.length;

  const worksheet: any = {
    '!ref': `A1:${String.fromCharCode(65 + maxCol - 1)}${maxRow}`
  };

  data.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellRef = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
      worksheet[cellRef] = {
        v: cell,
        t: typeof cell === 'number' ? 'n' : 's'
      };
    });
  });

  return worksheet;
}

/**
 * Parse uploaded Excel file and validate targets
 */
export const parseTargetsFile = async (
  file: File,
  trackingMode: 'simple' | 'quarterly'
): Promise<{ data: TargetTemplateData[]; errors: string[] }> => {
  const errors: string[] = [];
  const data: TargetTemplateData[] = [];

  try {
    // Dynamically import the library
    const readXlsxFile = (await import('read-excel-file')).default;
    const rows = await readXlsxFile(file);

    if (rows.length < 2) {
      errors.push('File must contain at least a header row and one data row');
      return { data, errors };
    }

    const headers = rows[0].map(h => String(h).trim());
    const dataRows = rows.slice(1);

    // Validate headers
    const requiredHeaders = trackingMode === 'quarterly'
      ? TARGET_TEMPLATE_HEADERS_QUARTERLY
      : TARGET_TEMPLATE_HEADERS_SIMPLE;

    const headerMap = new Map<string, number>();
    headers.forEach((header, index) => {
      headerMap.set(header.replace(/\s*\*/g, '').trim(), index);
    });

    // Process each row
    dataRows.forEach((row, rowIndex) => {
      const actualRowNumber = rowIndex + 2; // +2 because we skip header and row indices start at 0

      // Skip completely empty rows
      if (row.every(cell => !cell || String(cell).trim() === '')) {
        return;
      }

      const target: Partial<TargetTemplateData> = {
        tracking_mode: trackingMode === 'quarterly' ? 'QUARTERLY' : 'SIMPLE'
      };

      try {
        // Indicator Code
        const indicatorCode = getCellValue(row, headerMap, 'Indicator Code')?.toUpperCase();
        if (!indicatorCode) {
          errors.push(`Row ${actualRowNumber}: Indicator Code is required`);
          return;
        }
        if (!VALID_INDICATOR_CODES.includes(indicatorCode)) {
          errors.push(`Row ${actualRowNumber}: Invalid Indicator Code "${indicatorCode}". Must be one of: ${VALID_INDICATOR_CODES.join(', ')}`);
          return;
        }
        target.indicator_code = indicatorCode;

        // Custom Indicator Name (only for CUSTOM)
        if (indicatorCode === 'CUSTOM') {
          const customName = getCellValue(row, headerMap, 'Custom Indicator Name');
          if (!customName) {
            errors.push(`Row ${actualRowNumber}: Custom Indicator Name is required when using CUSTOM indicator code`);
            return;
          }
          target.indicator_name = customName;
        }

        // Fiscal Year
        const fiscalYear = getCellValue(row, headerMap, 'Fiscal Year')?.toUpperCase();
        if (!fiscalYear) {
          errors.push(`Row ${actualRowNumber}: Fiscal Year is required`);
          return;
        }
        if (!/^FY\d{2}$/.test(fiscalYear)) {
          errors.push(`Row ${actualRowNumber}: Fiscal Year must be in format FY24, FY25, etc.`);
          return;
        }
        target.fiscal_year = fiscalYear;

        // Annual Target
        const annualTarget = parseNumber(getCellValue(row, headerMap, 'Annual Target'));
        if (annualTarget === null || annualTarget <= 0) {
          errors.push(`Row ${actualRowNumber}: Annual Target must be a positive number`);
          return;
        }
        target.annual_target = annualTarget;

        // Quarterly targets (if quarterly mode)
        if (trackingMode === 'quarterly') {
          target.q1_target = parseNumber(getCellValue(row, headerMap, 'Q1 Target')) || undefined;
          target.q2_target = parseNumber(getCellValue(row, headerMap, 'Q2 Target')) || undefined;
          target.q3_target = parseNumber(getCellValue(row, headerMap, 'Q3 Target')) || undefined;
          target.q4_target = parseNumber(getCellValue(row, headerMap, 'Q4 Target')) || undefined;
        }

        // Target Notes
        target.target_notes = getCellValue(row, headerMap, 'Target Notes') || '';

        data.push(target as TargetTemplateData);
      } catch (error) {
        errors.push(`Row ${actualRowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    if (data.length === 0 && errors.length === 0) {
      errors.push('No valid data rows found in the file');
    }

  } catch (error) {
    errors.push(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { data, errors };
};

/**
 * Helper to get cell value by header name
 */
function getCellValue(row: any[], headerMap: Map<string, number>, headerName: string): string | null {
  const index = headerMap.get(headerName);
  if (index === undefined) return null;
  const value = row[index];
  return value !== null && value !== undefined ? String(value).trim() : null;
}

/**
 * Helper to parse number from cell
 */
function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}
