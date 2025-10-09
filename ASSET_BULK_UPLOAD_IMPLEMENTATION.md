# Asset Bulk Upload - Name-to-UUID Conversion Implementation

## Overview

This document explains the frontend implementation of the name-to-UUID conversion system for asset bulk uploads. This feature allows users to upload CSV/Excel files using friendly names (e.g., "IT Equipment", "USAID") instead of UUIDs for foreign key fields.

## Problem Statement

**Original Issue**: Users had to manually look up UUIDs for all foreign key relationships (Asset Types, Projects, Donors, Locations, etc.) and include them in the CSV file, making bulk uploads extremely tedious and error-prone.

**Solution**: Frontend automatically converts friendly names to UUIDs before sending the file to the backend.

---

## Architecture

### High-Level Flow

```
1. User opens bulk upload dialog
   ↓
2. Frontend fetches all lookup data from backend APIs
   ↓
3. User selects CSV/Excel file with friendly names
   ↓
4. Frontend preprocesses file:
   - Reads CSV/Excel
   - Finds foreign key columns
   - Converts names → UUIDs using lookup maps
   ↓
5. Frontend uploads processed CSV with UUIDs to backend
   ↓
6. Backend validates and processes as normal
```

---

## Implementation Details

### 1. Lookup Data Fetching

**File**: `src/features/admin/utils/assetBulkUploadHelper.ts`

**Function**: `fetchAssetUploadLookups()`

**What it does**:
- Fetches all reference data from backend APIs in parallel
- Creates case-insensitive name→UUID maps for easy lookup
- Handles different API response structures

**APIs Called**:
```typescript
GET /admins/inventory/asset-types/     (page=1, size=1000)
GET /projects/                          (page=1, size=1000)
GET /projects/funding-sources/          (page=1, size=1000)
GET /projects/partners/                 (page=1, size=1000)
GET /config/locations/                  (page=1, size=1000)
GET /admins/inventory/asset-classifications/ (page=1, size=1000)
GET /admins/inventory/asset-conditions/ (page=1, size=1000)
GET /hr/employees/                      (page=1, size=1000)
```

**Expected Response Format**:
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "results": [
      {
        "id": "uuid-here",
        "name": "IT Equipment"
      }
    ]
  }
}
```

**Returns**:
```typescript
{
  assetTypes: Map<string, string>,      // "IT Equipment" → UUID
  projects: Map<string, string>,        // "Project A" → UUID
  donors: Map<string, string>,          // "USAID" → UUID
  implementers: Map<string, string>,    // "ABC Organization" → UUID
  locations: Map<string, string>,       // "Lagos Office" → UUID
  classifications: Map<string, string>, // "Fixed Asset" → UUID
  conditions: Map<string, string>,      // "Good" → UUID
  employees: Map<string, string>        // "admin@mail.com" → UUID
}
```

**Special Handling**:
- **Case-insensitive**: Both "USAID" and "usaid" will match
- **Employees**: Maps by both email AND full_name
- **Graceful degradation**: If HR endpoint fails, continues with empty employee map

---

### 2. CSV Preprocessing

**Function**: `preprocessAssetCSV(file: File, lookups: AssetUploadLookups)`

**What it does**:
1. Reads CSV or Excel file
2. Converts Excel to CSV if needed (using xlsx library)
3. Finds the header row (skips title rows, comment lines starting with #)
4. Cleans headers by removing helper text: `"category (Required)"` → `"category"`
5. Identifies columns that need UUID conversion
6. Processes each data row:
   - Parses CSV properly (handles quoted values)
   - Converts names to UUIDs for foreign key fields
   - Leaves empty fields as empty
   - Preserves already-valid UUIDs
7. Rebuilds CSV with converted values
8. Returns new File object

**Columns Converted**:
- `asset_type` → Asset Type UUID
- `project` → Project UUID
- `donor` → Donor/Funding Source UUID
- `assignee` → Employee UUID (by email or name)
- `implementer` → Partner UUID
- `location` → Location UUID
- `classification` → Classification UUID
- `asset_condition` → Condition UUID

**Example Conversion**:

**Input CSV**:
```csv
category,name,asset_type,project,donor,location
Fixed Assets,Toyota Hilux,Vehicle,Project A,USAID,Lagos Office
```

**Output CSV** (sent to backend):
```csv
category,name,asset_type,project,donor,location
Fixed Assets,Toyota Hilux,abc-123-def,xyz-789-ghi,mno-456-pqr,stu-789-vwx
```

---

### 3. Name Resolution Logic

**Function**: `resolveToUUID(value, lookupMap, fieldName)`

**Logic**:
1. If value is empty → return empty string
2. If value is already a valid UUID → return as-is
3. Try exact match in lookup map
4. Try case-insensitive match
5. If found → log success and return UUID
6. If not found → log warning and return original value (backend will reject)

**UUID Validation**:
```typescript
/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
```

---

### 4. CSV Parsing

**Function**: `parseCSVLine(line: string)`

**Features**:
- Properly handles quoted values with commas
- Handles escaped quotes (`""` inside quoted strings)
- Trims whitespace
- Returns array of values

**Example**:
```
Input:  "Fixed Assets","Toyota Hilux, 4x4",Vehicle
Output: ["Fixed Assets", "Toyota Hilux, 4x4", "Vehicle"]
```

---

## File Format Requirements

### CSV Template Headers

**Format**: `column_name (Helper Text)`

**Required Fields**:
- `category (Required)` - Must match existing category exactly
- `name (Required)` - Asset name
- `uom (Required)` - Unit of measure
- `unit (Required)` - Quantity

**Optional Foreign Key Fields** (support name-to-UUID conversion):
- `asset_type (Optional - ID or name)`
- `project (Optional - ID or name)`
- `donor (Optional - ID or name)`
- `assignee (Optional - Email or ID)`
- `implementer (Optional - ID or name)`
- `location (Optional - ID or name)`
- `classification (Optional - ID or name)`
- `asset_condition (Optional - ID or name)`

**Other Optional Fields**:
- `description`, `asset_code`, `plate_number`, `chasis_number`
- `state`, `acquisition_date`, `estimated_life_span`
- `usd_cost`, `ngn_cost`, `depreciation_rate`, `insurance_duration`

### Supported File Formats
- `.csv` (UTF-8 encoded)
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

### Special Features
- **Comment lines**: Lines starting with `#` are ignored
- **Helper text**: Automatically stripped from headers
- **Empty fields**: Optional fields can be left empty
- **Excel title rows**: Automatically skipped if they don't contain column names

---

## Integration Points

### Component: BulkUploadDialog

**Location**: `src/features/admin/components/assets/BulkUploadDialog.tsx`

**Key Steps**:

1. **Dialog Opens** → Fetch lookup data
```typescript
useEffect(() => {
  if (open && !lookups) {
    fetchAssetUploadLookups()
      .then(setLookups)
      .catch(handleError);
  }
}, [open, lookups]);
```

2. **User Selects File** → Validate file type

3. **User Clicks Upload** → Preprocess then upload
```typescript
const handleUpload = async () => {
  // Preprocess CSV to convert names to UUIDs
  const processedFile = await preprocessAssetCSV(selectedFile, lookups);

  // Upload to backend
  const result = await bulkUploadItems(processedFile);
};
```

4. **Backend Endpoint**: `POST /config/items/bulk-upload/`

---

## Logging & Debugging

### Console Logs

**When dialog opens**:
```
🔄 Dialog opened, fetching lookup data...
✅ Lookup data fetched successfully: {assetTypes: 10, projects: 5, ...}
```

**When upload starts**:
```
🔄 Starting preprocessing for file: assets.xlsx
📊 Lookups available: {assetTypes: 10, projects: 5, ...}
Reading Excel file, data type: object size: 11510
Successfully converted Excel to CSV, length: 1195
📋 Found headers at line 1: category (Required), name (Required), ...
📋 Cleaned headers: category, name, description, ...
```

**For each conversion**:
```
✅ Resolved donor: "USAID" → 497d6447-bdea-4549-b7db-b179df51bd2b
✅ Resolved asset_type: "IT Equipment" → 392fc841-fb2e-464c-b578-0b5913969e3d
⚠️ Could not resolve project: "Project A" (map size: 0)
```

**After preprocessing**:
```
=== CSV PREPROCESSING COMPLETE ===
Original file: assets.xlsx (11510 bytes)
Processed CSV preview: category,name,asset_type,...
Total data rows: 3
Output file: assets.csv (1405 bytes)
=== END CSV PREPROCESSING ===
```

---

## Error Handling

### Frontend Errors

1. **Lookup fetch fails** → Show error toast, allow upload anyway (names won't be converted)
2. **Invalid file format** → Reject before preprocessing
3. **No header row found** → Show error with instructions
4. **Excel parsing fails** → Show specific XLSX error
5. **Empty file** → Reject with message

### Backend Errors

The backend still validates everything. If a name couldn't be converted to UUID, the backend will reject it with validation errors showing which field and row failed.

**Example Backend Error**:
```json
{
  "status": false,
  "message": "Bulk upload failed - all items had errors",
  "data": {
    "created_count": 0,
    "updated_count": 0,
    "failed_count": 1,
    "errors": [
      {
        "row": 2,
        "item_name": "Toyota Hilux",
        "errors": [
          "project: \"Project A\" is not a valid UUID."
        ]
      }
    ]
  }
}
```

---

## Backend API Requirements

### What Backend Needs to Support

1. **Lookup Endpoints** must return data in this format:
```json
{
  "data": {
    "results": [
      {"id": "uuid", "name": "Name"}
    ]
  }
}
```

OR

```json
{
  "results": [
    {"id": "uuid", "name": "Name"}
  ]
}
```

2. **Bulk Upload Endpoint** receives CSV with UUIDs (no changes needed)

3. **Error Responses** should include row numbers and field names for validation errors

---

## Known Issues & Limitations

### Current Issues

1. **Projects Endpoint Returns 0 Results**
   - `GET /projects/` returns empty results even though projects exist
   - This prevents project name conversion from working
   - **Status**: Under investigation
   - **Workaround**: Users can leave project field empty or use UUID directly

### Limitations

1. **Pagination**: Currently fetches only first 1000 records per endpoint
   - If you have more than 1000 Asset Types, some won't be in the lookup map
   - **Solution**: Increase page size or implement pagination

2. **Case Sensitivity**: Category names must match exactly (case-sensitive)

3. **Duplicate Names**: If multiple items have the same name, the last one wins
   - Example: Two locations both named "Office" → only one UUID in map
   - **Best Practice**: Ensure unique names in master data

4. **Performance**: For very large CSV files (>10MB), preprocessing may take time
   - Consider adding progress indicator for large files

---

## Testing Checklist

### For Backend Team

- [ ] Verify all lookup endpoints return data in expected format
- [ ] Test with CSV containing friendly names
- [ ] Test with CSV containing UUIDs (should work unchanged)
- [ ] Test with mixed names and UUIDs
- [ ] Test with empty optional fields
- [ ] Test with non-existent names (should fail with validation error)
- [ ] Test with Excel files (.xlsx, .xls)
- [ ] Test with large files (1000+ rows)

### Sample Test Data

**Valid CSV** (should succeed):
```csv
category,name,uom,asset_type,donor,unit
Fixed Assets,Laptop,Unit,IT Equipment,USAID,1
Fixed Assets,Desk,Unit,Furniture,,1
```

**Invalid CSV** (should fail with specific errors):
```csv
category,name,uom,asset_type,donor,unit
Fixed Assets,Car,Unit,NonExistentType,FakeDonor,1
```

---

## Configuration

### Adjustable Parameters

**File Location**: `src/features/admin/utils/assetBulkUploadHelper.ts`

```typescript
// Change page size for lookup data
{ params: { page: 1, size: 1000 } }  // Line 37-44

// Modify timeout for file processing
// (Currently no timeout - processes synchronously)
```

**File Location**: `src/features/admin/components/assets/BulkUploadDialog.tsx`

```typescript
// Accepted file types
const validTypes = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv"
];  // Line 72-76

// File size limit (currently not enforced)
// Add validation if needed
```

---

## Dependencies

### NPM Packages

```json
{
  "xlsx": "^0.18.5"  // For Excel file parsing
}
```

### Installation
```bash
npm install xlsx
```

---

## Future Enhancements

### Planned Features

1. **Batch Lookup Optimization**: Cache lookup data across multiple uploads
2. **Validation Preview**: Show which names will/won't convert before upload
3. **Auto-Suggest**: Dropdown suggestions for foreign key fields in UI
4. **Progress Indicator**: Show processing progress for large files
5. **Conflict Resolution**: UI to resolve duplicate names
6. **Template Generator**: Generate template with current master data options

### Backend Improvements Needed

1. **Fix Projects Endpoint**: Currently returns 0 results
2. **Add Search Endpoint**: Allow frontend to search for specific names
3. **Add Validation Endpoint**: Pre-validate file without uploading
4. **Bulk Resolve Endpoint**: Send array of names, get back UUIDs

---

## Support & Troubleshooting

### Common Issues

**Q: Names aren't being converted**
- Check console logs for "⚠️ Could not resolve" warnings
- Verify the name exists in the system exactly as typed
- Check if lookup data was fetched (see "✅ Lookup data fetched successfully")

**Q: Upload fails with UUID validation errors**
- Name doesn't exist in system
- Lookup endpoint returned 0 results
- Typo in the name

**Q: Projects not working**
- Known issue: `/projects/` endpoint returns empty results
- Workaround: Leave project field empty or use UUID

**Q: Excel file not processing**
- Ensure file is valid .xlsx or .xls format
- Check console for "XLSX parsing error" messages
- Try exporting as CSV instead

---

## Contact

For questions or issues with this implementation:
- **Frontend Team**: Check `assetBulkUploadHelper.ts` and `BulkUploadDialog.tsx`
- **Backend Team**: Verify lookup endpoints return correct data structure
- **Project Repo**: GitHub issues for bug reports

---

## Change Log

### Version 1.0 (2025-01-09)
- Initial implementation of name-to-UUID conversion
- Support for CSV and Excel files
- Case-insensitive name matching
- Automatic header text cleanup
- Comprehensive error logging

---

## Appendix: Code Examples

### Example: Custom Lookup Endpoint

If you need to add a new foreign key field with name-to-UUID conversion:

```typescript
// 1. Add to AssetUploadLookups interface
export interface AssetUploadLookups {
  // ... existing fields ...
  customField: Map<string, string>;
}

// 2. Fetch data in fetchAssetUploadLookups()
const customFieldRes = await AxiosWithToken.get("/custom/endpoint/",
  { params: { page: 1, size: 1000 } });

// 3. Add to return object
return {
  // ... existing fields ...
  customField: createLookupMap(customFieldRes.data?.data?.results || [])
};

// 4. Find column index in preprocessAssetCSV()
const customFieldIdx = cleanedHeaders.indexOf('custom_field');

// 5. Convert in processing loop
if (customFieldIdx >= 0 && customFieldIdx < values.length) {
  values[customFieldIdx] = resolveToUUID(
    values[customFieldIdx],
    lookups.customField,
    'custom_field'
  );
}
```

### Example: Testing Lookup Data

```typescript
// In browser console
import { fetchAssetUploadLookups } from './assetBulkUploadHelper';

const lookups = await fetchAssetUploadLookups();
console.log('Asset Types:', Array.from(lookups.assetTypes.entries()));
console.log('Total entries:', lookups.assetTypes.size);

// Check if specific name exists
const uuid = lookups.assetTypes.get('IT Equipment');
console.log('IT Equipment UUID:', uuid);
```

---

**Document Version**: 1.0
**Last Updated**: January 9, 2025
**Author**: Frontend Development Team
