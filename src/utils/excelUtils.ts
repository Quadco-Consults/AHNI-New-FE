/**
 * Excel Utilities using secure packages
 *
 * This module provides a compatibility layer that replaces the vulnerable xlsx package
 * with secure and actively maintained alternatives: read-excel-file and write-excel-file.
 *
 * Security Note: Replaces xlsx package due to CVE-2023-30533 and CVE-2024-22363
 */

import readXlsxFile from 'read-excel-file';
import writeXlsxFile from 'write-excel-file';

// Compatibility interface to match xlsx usage patterns
export interface WorkBook {
  SheetNames: string[];
  Sheets: Record<string, WorkSheet>;
}

export interface WorkSheet {
  [key: string]: any;
}

export interface ReadOptions {
  type?: 'array' | 'buffer' | 'base64' | 'binary';
}

export interface WriteOptions {
  type?: 'array' | 'buffer' | 'base64' | 'binary';
}

export interface CSVOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
}

/**
 * Excel utilities that match the xlsx API but use secure packages internally
 */
export const XLSX = {
  /**
   * Read an Excel file from ArrayBuffer or other formats
   */
  read: (data: ArrayBuffer | Uint8Array, options?: ReadOptions): WorkBook => {
    // For now, we'll handle this in the components directly since read-excel-file
    // is designed to work with Files or URLs. We'll create a placeholder that throws
    // to identify where this needs to be updated.
    throw new Error('XLSX.read() has been replaced. Please use readXlsxFile() directly from the file input.');
  },

  /**
   * Synchronous read (converts to async internally)
   */
  readSync: (data: ArrayBuffer | Uint8Array, options?: ReadOptions): WorkBook => {
    throw new Error('XLSX.readSync() has been replaced. Please use readXlsxFile() directly from the file input.');
  },

  /**
   * Write an Excel file
   */
  write: (workbook: WorkBook, options?: WriteOptions): ArrayBuffer => {
    throw new Error('XLSX.write() has been replaced. Use XLSX.writeFile() directly.');
  },

  /**
   * Write file directly to download - This is the main method we'll keep
   */
  writeFile: async (workbook: WorkBook, filename: string): Promise<void> => {
    try {
      // Convert workbook format to writeXlsxFile format
      const sheets = workbook.SheetNames.map(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        return {
          name: sheetName,
          data: XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        };
      });

      if (sheets.length === 0) {
        throw new Error('No sheets found in workbook');
      }

      // Use the first sheet for now (most of our use cases have single sheets)
      const mainSheet = sheets[0];

      await writeXlsxFile(mainSheet.data, {
        fileName: filename
      });
    } catch (error) {
      throw new Error(`Failed to save Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  utils: {
    /**
     * Convert JSON array to worksheet
     */
    json_to_sheet: (data: any[]): WorkSheet => {
      if (!Array.isArray(data) || data.length === 0) {
        return { '!ref': 'A1:A1' };
      }

      const headers = Object.keys(data[0]);
      const maxCol = headers.length;
      const maxRow = data.length + 1; // +1 for header row

      const worksheet: WorkSheet = {
        '!ref': `A1:${String.fromCharCode(65 + maxCol - 1)}${maxRow}`
      };

      // Add headers
      headers.forEach((header, colIndex) => {
        const cellRef = `${String.fromCharCode(65 + colIndex)}1`;
        worksheet[cellRef] = { v: header, t: 's' };
      });

      // Add data
      data.forEach((row, rowIndex) => {
        headers.forEach((header, colIndex) => {
          const cellRef = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
          const value = row[header];
          if (value !== undefined && value !== null) {
            worksheet[cellRef] = {
              v: value,
              t: typeof value === 'number' ? 'n' : 's'
            };
          }
        });
      });

      return worksheet;
    },

    /**
     * Convert worksheet to JSON array
     */
    sheet_to_json: (worksheet: WorkSheet, options?: { header?: number }): any[] => {
      const range = worksheet['!ref'];
      if (!range) return [];

      const [start, end] = range.split(':');
      const startCol = start.charCodeAt(0) - 65;
      const startRow = parseInt(start.slice(1));
      const endCol = end.charCodeAt(0) - 65;
      const endRow = parseInt(end.slice(1));

      const headerRow = options?.header || 1;
      const headers: string[] = [];

      // Get headers
      for (let col = startCol; col <= endCol; col++) {
        const cellRef = `${String.fromCharCode(65 + col)}${headerRow}`;
        const cell = worksheet[cellRef];
        headers.push(cell ? String(cell.v) : `Column${col + 1}`);
      }

      const data: any[] = [];

      // Get data rows
      for (let row = headerRow + 1; row <= endRow; row++) {
        const rowData: any = {};
        let hasData = false;

        for (let col = startCol; col <= endCol; col++) {
          const cellRef = `${String.fromCharCode(65 + col)}${row}`;
          const cell = worksheet[cellRef];
          const header = headers[col - startCol];

          if (cell && cell.v !== undefined && cell.v !== null) {
            rowData[header] = cell.v;
            hasData = true;
          }
        }

        if (hasData) {
          data.push(rowData);
        }
      }

      return data;
    },

    /**
     * Convert worksheet to CSV
     */
    sheet_to_csv: (worksheet: WorkSheet, options?: CSVOptions): string => {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        return '';
      }

      return jsonData.map((row: any) => {
        if (Array.isArray(row)) {
          return row.map((cell: any) => {
            if (cell === null || cell === undefined) return '';
            const cellStr = String(cell);
            // Escape CSV if contains comma, quote, or newline
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(',');
        }
        return '';
      }).join('\n');
    },

    /**
     * Create a new workbook
     */
    book_new: (): WorkBook => ({
      SheetNames: [],
      Sheets: {}
    }),

    /**
     * Append worksheet to workbook
     */
    book_append_sheet: (workbook: WorkBook, worksheet: WorkSheet, sheetName: string): void => {
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = worksheet;
    }
  }
};

// Default export for compatibility
export default XLSX;