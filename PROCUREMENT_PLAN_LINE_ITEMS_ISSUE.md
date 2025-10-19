# Procurement Plan Line Items Issue

## Problem Summary

When uploading an Excel file with multiple rows for a procurement plan, the detail page at `/dashboard/procurement/procurement-plan/{id}` does not display all the uploaded data. Only the header-level information is shown, but not the individual line items from the Excel file.

## Root Cause

The backend API endpoint `GET /api/v1/procurements/procurement-plans/{id}/` currently returns **only the procurement plan header data**, but does NOT include an array of line items.

### Current API Response Structure
```json
{
  "status": "success",
  "message": "Retrieved successfully.",
  "data": {
    "id": "4d0ba866-babc-4df3-9b7d-2487c1190248",
    "project": {...},
    "financial_year": {...},
    "budget_line": "14600000",
    "description": "Care and Treatment",
    // ... other header fields
    // ❌ NO items/line_items/procurement_items array
  }
}
```

### Expected API Response Structure
```json
{
  "status": "success",
  "message": "Retrieved successfully.",
  "data": {
    "id": "4d0ba866-babc-4df3-9b7d-2487c1190248",
    "project": {...},
    "financial_year": {...},
    "budget_line": "14600000",
    "description": "Care and Treatment",
    // ... other header fields

    // ✅ REQUIRED: Array of line items from uploaded Excel
    "items": [
      {
        "id": "item-1",
        "implementer": "PHO-Niger",
        "implementation_location": "Niger State",
        "workplan_activity_reference": "WP-2024-002",
        "description": "Medical supplies procurement",
        "budget_line": "14600000",
        "approved_budget": 12015.45,
        "pr_staff": "Local Procurement Team",
        "mode_of_procurement": "Intl Bidding",
        "procurement_committee_review": "no",
        "procurement_process": "DFP",
        "start_date": "2025-10-02",
        "selected_supplier": "MedTech Solutions Ltd",
        "expected_delivery_date_1": "2025-01-09",
        "ware_houses": "PHO Adamawa",
        "donor_remarks": "Priority procurement",
        "implenter_remarks": "Monthly progress reviews",
        "is_ppm": false
      },
      // ... more items from Excel rows
    ]
  }
}
```

## Backend Requirements

The backend needs to implement ONE of the following solutions:

### Solution 1: Include Line Items in Main Response (RECOMMENDED)
Modify the `GET /api/v1/procurements/procurement-plans/{id}/` endpoint to include a nested `items` or `line_items` array containing all the rows from the uploaded Excel file.

**Pros:**
- Single API call
- Simpler frontend logic
- Better performance

### Solution 2: Create Separate Line Items Endpoint
Create a new endpoint: `GET /api/v1/procurements/procurement-plans/{id}/items/`

**Response:**
```json
{
  "status": "success",
  "data": {
    "results": [
      { /* line item 1 */ },
      { /* line item 2 */ },
      // ...
    ],
    "count": 150,
    "next": null,
    "previous": null
  }
}
```

**Pros:**
- Better for large datasets with pagination
- More RESTful design

## Frontend Changes Made

I've updated the frontend to:

1. ✅ Try to fetch line items from multiple possible endpoint patterns:
   - `/procurements/procurement-plans/{id}/items/`
   - `/procurements/procurement-plans/{id}/line-items/`
   - `/procurements/procurement-plans/items/?procurement_plan={id}`
   - `/procurements/procurement-plans/line-items/?procurement_plan={id}`

2. ✅ Added detailed console logging to help debug the issue

3. ✅ Automatically merge line items if found from a separate endpoint

4. ✅ Display all line items in the table once they're available

## Testing Instructions

1. Navigate to: `http://localhost:3001/dashboard/procurement/procurement-plan/4d0ba866-babc-4df3-9b7d-2487c1190248`

2. Open browser console (F12)

3. Check the console logs:
   - Look for "Trying to fetch line items from:" messages
   - Check which endpoints return 404 vs which succeed
   - See the "Items count:" to verify if items are being fetched

4. Once backend implements the endpoint, the line items should automatically appear in the table

## Data Model Reference

Each line item should have these fields (from `ProcurementPlanLineItem` type):

```typescript
{
  id?: string;
  budget_line?: string;
  implementer?: string;
  implementation_location?: string;
  workplan_activity_reference?: string;
  description?: string;
  approved_budget?: number;
  pr_staff?: string;
  mode_of_procurement?: string;
  procurement_committee_review?: string;
  is_ppm?: boolean;
  procurement_process?: string;
  donor_remarks?: string;
  implenter_remarks?: string;
  start_date?: string;
  expected_delivery_date_1?: string;
  expected_delivery_date_2?: string;
  ware_houses?: string;
  workplan_activity?: string;
  selected_supplier?: string;
}
```

## Backend Developer Action Items

- [ ] Decide on Solution 1 (include items in main response) vs Solution 2 (separate endpoint)
- [ ] Ensure the upload endpoint saves ALL Excel rows as individual line item records
- [ ] Implement the chosen solution
- [ ] Test with the uploaded Excel file to ensure all rows are returned
- [ ] Verify pagination if using separate endpoint (support `size` parameter for large datasets)
- [ ] Update API documentation

## Contact

If you have questions about this issue, please check:
- Frontend file: `src/features/procurement/components/procurement-plan/id/index.tsx`
- Controller: `src/features/procurement/controllers/procurementPlanController.ts`
- Type definitions: `src/features/procurement/types/procurementPlan.ts`
