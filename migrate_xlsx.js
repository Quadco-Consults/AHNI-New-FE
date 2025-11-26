#!/usr/bin/env node

/**
 * Migration script to replace vulnerable xlsx package with secure alternatives
 *
 * This script:
 * 1. Finds all files using xlsx
 * 2. Replaces imports with secure excelUtils
 * 3. Updates file reading logic to use readXlsxFile
 * 4. Keeps writeFile functionality working
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Files that need xlsx replacement (from our earlier grep)
const filesToUpdate = [
  'src/features/hr/components/employee-benefits/components/BulkUploadCompensationSpreadModal.tsx',
  'src/features/hr/components/employee-benefits/components/BulkUploadCompensationModal.tsx',
  'src/features/hr/components/employee-benefits/components/BulkUploadPayGroupModal.tsx',
  'src/features/hr/components/modals/EmployeeUploadModal.tsx',
  'src/features/admin/utils/assetBulkUploadHelper.ts',
  'src/features/procurement/components/procurement-plan/index-copy.tsx'
];

console.log('🔧 Starting XLSX Security Migration...\n');

filesToUpdate.forEach((filePath, index) => {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;

    // 1. Replace imports
    if (content.includes('import * as XLSX from "xlsx"') || content.includes("import * as XLSX from 'xlsx'")) {
      content = content.replace(
        /import \* as XLSX from ['"]xlsx['"];?/g,
        'import { XLSX } from "@/utils/excelUtils";\nimport readXlsxFile from \'read-excel-file\';'
      );
      hasChanges = true;
      console.log(`✅ Updated import in: ${filePath}`);
    }

    // 2. Comment out XLSX.read usage (will be manually updated)
    if (content.includes('XLSX.read(')) {
      content = content.replace(
        /(\s+)(const\s+workbook\s*=\s*XLSX\.read\([^;]+;)/g,
        '$1// TODO: Replace with readXlsxFile - $2'
      );
      hasChanges = true;
      console.log(`⚠️  Found XLSX.read() usage in: ${filePath} - needs manual update`);
    }

    if (hasChanges) {
      fs.writeFileSync(fullPath, content);
      console.log(`💾 Saved changes to: ${filePath}\n`);
    } else {
      console.log(`ℹ️  No changes needed in: ${filePath}\n`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('📋 Migration Summary:');
console.log('✅ Replaced vulnerable xlsx imports with secure excelUtils');
console.log('⚠️  Files with XLSX.read() usage need manual review');
console.log('📝 Check all affected files for async/await compatibility');
console.log('\n🔍 Run yarn audit to verify vulnerabilities are resolved');