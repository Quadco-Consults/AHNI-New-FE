# Asset Update Payload Structure

## API Endpoint
```
PATCH /config/items/{asset_id}/
```

## Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

## Full Payload Example (Vehicle Asset)

Based on the Honda Accord vehicle example with all fields populated:

```json
{
  "name": "HONDA",
  "assignee": "user-uuid-for-tony-stark",
  "asset_code": "3343",
  "asset_type": "vehicles-asset-type-uuid",
  "project": "project-uuid",
  "donor": "funding-source-uuid",
  "depreciation_rate": "10",
  "acquisition_date": "2025-10-06",
  "state": "Adamawa",
  "asset_condition": "a1-condition-uuid",
  "location": "test-location-uuid",
  "estimated_life_span": "GOOD",
  "classification": "test-1-classification-uuid",
  "usd_cost": "500000.00",
  "ngn_cost": "600000.00",
  "unit": "2",
  "implementer": "janis-hahn-partner-uuid",
  "insurance_duration": "1 year",
  "category": "vehicles-category-uuid",
  "uom": "unit",
  "description": "Honda Accord vehicle description",

  // Vehicle-specific fields (currently showing N/A)
  "plate_number": "dba-23-fe",
  "chasis_number": "3832732783278",
  "engine_number": "ENG-12345",           // ⭐ This should be filled
  "odometer_reading": "100000",           // ⭐ This should be filled
  "make": "Honda",                        // ⭐ This should be filled
  "model": "Accord"
}
```

## Minimal Update Payload (Only Changed Fields)

When editing, only fields that have values are sent (due to filtering in `create.tsx`):

```json
{
  "name": "HONDA",
  "assignee": "user-uuid",
  "asset_code": "3343",
  "asset_type": "vehicles-type-uuid",
  "project": "project-uuid",
  "donor": "funding-source-uuid",
  "depreciation_rate": "10",
  "acquisition_date": "2025-10-06",
  "state": "Adamawa",
  "asset_condition": "condition-uuid",
  "location": "location-uuid",
  "estimated_life_span": "GOOD",
  "classification": "classification-uuid",
  "usd_cost": "500000.00",
  "ngn_cost": "600000.00",
  "unit": "2",
  "implementer": "implementer-uuid",
  "insurance_duration": "1 year",
  "category": "vehicles-category-uuid",
  "uom": "unit",
  "description": "Honda Accord vehicle",
  "plate_number": "dba-23-fe",
  "chasis_number": "3832732783278",
  "model": "Accord",

  // These fields should be included when you edit and fill them in
  "engine_number": "ENG-12345",
  "odometer_reading": "100000",
  "make": "Honda"
}
```

## Field Filtering Logic

In `create.tsx` lines 308-322, the form filters out empty values:

```typescript
const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
  if (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    String(value).trim() !== ""
  ) {
    acc[key as keyof TAssetFormValues] = value;
  }
  return acc;
}, {} as Partial<TAssetFormValues>);
```

**This means:**
- ❌ Empty strings `""` are **NOT sent**
- ❌ `null` values are **NOT sent**
- ❌ `undefined` values are **NOT sent**
- ❌ Whitespace-only strings `"   "` are **NOT sent**
- ✅ Non-empty values **ARE sent**

## Why Some Fields Show "N/A"

If the following fields are showing "N/A" on the details page:
- `engine_number`
- `odometer_reading`
- `make`

**Possible reasons:**

### 1. Fields Were Never Filled In
The user never entered values for these fields when creating/editing the asset.

**Solution:** Edit the asset and fill in the missing fields.

### 2. Fields Were Filtered Out (Empty Strings)
The fields had empty strings or whitespace, so they were removed from the payload.

**Check console logs:**
```javascript
// In browser console after submitting form
=== ASSET FORM SUBMISSION DEBUG ===
1. Raw form data: {
  engine_number: "",        // ❌ Empty string - will be filtered out
  odometer_reading: "",     // ❌ Empty string - will be filtered out
  make: "",                 // ❌ Empty string - will be filtered out
}

2. Filtered data (being sent to backend): {
  // engine_number not here ❌
  // odometer_reading not here ❌
  // make not here ❌
}
```

### 3. Backend Not Saving the Fields
The payload includes the fields, but the backend isn't saving them to the database.

**Check console logs:**
```javascript
=== MAIN CONTROLLER HTTP REQUEST ===
Request payload: {
  "engine_number": "ENG-12345",  // ✅ Present in request
  "odometer_reading": "100000",  // ✅ Present in request
  "make": "Honda"                // ✅ Present in request
}

=== HTTP RESPONSE ===
Response data: {
  "data": {
    "engine_number": null,    // ❌ Backend didn't save it
    "odometer_reading": null, // ❌ Backend didn't save it
    "make": null              // ❌ Backend didn't save it
  }
}
```

**Backend issues to check:**
1. Django model doesn't have these fields
2. Django serializer doesn't include these fields
3. Database migration not applied
4. Field validation errors

## TypeScript Interfaces

### ItemFormValues (Request)
Located in: `/src/features/modules/types/config/index.ts`

```typescript
export interface ItemFormValues {
  // Standard fields
  name: string;
  description?: string;
  category?: string;
  unit?: string;

  // Asset-specific fields
  assignee?: string;
  asset_code?: string;
  asset_type?: string;
  project?: string;
  donor?: string;
  depreciation_rate?: string | number;
  acquisition_date?: string;
  state?: string;
  asset_condition?: string;
  location?: string;
  estimated_life_span?: string;
  classification?: string;
  usd_cost?: string;
  ngn_cost?: string;
  implementer?: string;
  insurance_duration?: string;
  uom?: string;

  // Vehicle-specific fields
  plate_number?: string;
  chasis_number?: string; // VIN
  engine_number?: string;
  odometer_reading?: string | number;
  make?: string;
  model?: string;

  // IT/Lab equipment fields
  serial_number?: string;
}
```

### TAssetFormValues (Form Schema)
Located in: `/src/features/admin/types/inventory-management/asset.ts`

```typescript
export const AssetSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  assignee: z.string().optional().nullable(),
  asset_code: z.string().optional().nullable(),

  // Vehicle-specific fields
  plate_number: z.string().optional().nullable(),
  chasis_number: z.string().optional().nullable(), // VIN
  engine_number: z.string().optional().nullable(),
  odometer_reading: z.coerce.string().optional().nullable(),

  // Common equipment fields
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  serial_number: z.string().optional().nullable(),

  description: z.string().optional().nullable(),
  asset_type: z.string().optional().nullable(),
  project: z.string().optional().nullable(),
  donor: z.string().optional().nullable(),
  depreciation_rate: z.coerce.string().optional().nullable(),
  acquisition_date: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  asset_condition: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  estimated_life_span: z.string().optional().nullable(),
  classification: z.string().optional().nullable(),
  usd_cost: z.string().optional().nullable(),
  ngn_cost: z.string().optional().nullable(),
  unit: z.coerce.string().min(1, "Please enter unit"),
  implementer: z.string().optional().nullable(),
  insurance_duration: z.string().optional().nullable(),
  category: z.string().min(1, "Please select a Category"),
  uom: z.string().min(1, "Please enter uom"),
});

export type TAssetFormValues = z.infer<typeof AssetSchema>;
```

## Data Flow

```
User Form Input
    ↓
React Hook Form (validation with Zod)
    ↓
onSubmit handler (create.tsx:306-350)
    ↓
Filter out empty values (create.tsx:312-322)
    ↓
editItem(filteredData) (create.tsx:334)
    ↓
UpdateItemManager (itemController.ts:82-101)
    ↓
callApi(details) → useApiManager
    ↓
mainController.ts (HTTP PATCH request)
    ↓
AxiosWithToken.patch(endpoint, payload)
    ↓
Backend API: PATCH /config/items/{id}/
    ↓
Backend Response
    ↓
Query Invalidation → Data Refetch
    ↓
Updated data displayed on details page
```

## Testing the Payload

### Method 1: Browser Console
1. Edit the asset
2. Fill in vehicle fields
3. Submit form
4. Check console logs:
   - "=== ASSET FORM SUBMISSION DEBUG ===" shows filtered payload
   - "=== ITEM CONTROLLER UPDATE ===" shows controller payload
   - "=== MAIN CONTROLLER HTTP REQUEST ===" shows exact HTTP payload

### Method 2: Network Tab
1. Open DevTools → Network tab
2. Filter by "items"
3. Edit and submit asset
4. Find PATCH request to `/config/items/{id}/`
5. Click request → **Payload** tab
6. View exact JSON sent to backend

### Method 3: Backend Logs
If you have access to backend logs:
```bash
# Django development server
tail -f /path/to/django/logs/debug.log

# Or check terminal where Django is running
# Look for incoming PATCH requests
```

## Example Console Output

When you submit the form, you should see:

```
=== ASSET FORM SUBMISSION DEBUG ===
1. Raw form data: {
  name: "HONDA",
  engine_number: "ENG-12345",
  odometer_reading: "100000",
  make: "Honda",
  // ... all other fields
}

2. Filtered data (being sent to backend): {
  name: "HONDA",
  engine_number: "ENG-12345",
  odometer_reading: "100000",
  make: "Honda",
  // ... only non-empty fields
}

3. Vehicle-specific fields:
   - engine_number: ENG-12345
   - odometer_reading: 100000
   - make: Honda

4. Asset ID: 94f62a5c-5cd8-42b6-b8ee-0bc36a364a5d
5. Operation: UPDATE
6. Calling editItem with filtered data...

=== ITEM CONTROLLER UPDATE ===
1. Update endpoint: /config/items/94f62a5c-5cd8-42b6-b8ee-0bc36a364a5d/
2. Payload being sent to backend: {
  name: "HONDA",
  engine_number: "ENG-12345",
  odometer_reading: "100000",
  make: "Honda",
  // ...
}
3. Payload keys: ["name", "engine_number", "odometer_reading", "make", ...]
4. Vehicle fields in payload:
   - engine_number: ENG-12345
   - odometer_reading: 100000
   - make: Honda

=== MAIN CONTROLLER HTTP REQUEST ===
Method: PATCH
Endpoint: /config/items/94f62a5c-5cd8-42b6-b8ee-0bc36a364a5d/
Request payload: {
  "name": "HONDA",
  "engine_number": "ENG-12345",
  "odometer_reading": "100000",
  "make": "Honda",
  ...
}

=== HTTP RESPONSE ===
Status: 200
Response data: {
  "status": true,
  "message": "Item updated successfully",
  "data": {
    "id": "94f62a5c-5cd8-42b6-b8ee-0bc36a364a5d",
    "name": "HONDA",
    "engine_number": "ENG-12345",    // ✅ Check if present
    "odometer_reading": "100000",    // ✅ Check if present
    "make": "Honda",                 // ✅ Check if present
    ...
  }
}

7. editItem completed successfully
8. Redirecting to assets page...
```

---

**Last Updated**: 2025-10-11
**API Version**: Latest
**Status**: ✅ Documented
