# Site Visit Functionality - Quick Summary

## The Problem

Users cannot **delete**, **edit**, **approve**, or perform other critical actions on site visits from the list view at `/dashboard/programs/plan/site-visit`. 

They can only:
- View the list
- Click a row to see details
- Create new site visits
- Search/filter

## Why This Happened

The backend API and advanced components were fully built, but they were **never integrated** into the list view. It's like having a fully-equipped kitchen that users can't see - all the functionality exists, just not exposed in the UI.

---

## What Needs to Be Fixed

### CRITICAL (Do First)
1. **Add Delete Button** - Users can't delete site visits at all
   - Add to list view with confirmation dialog
   - Add to detail view
   - Uses existing API: `useDeleteSiteVisit()`

2. **Fix Type Mismatches** - Detail component shows wrong data
   - Field name mismatches (e.g., `visit_type` vs `site_visit_type`)
   - Missing fields in type definitions

### HIGH PRIORITY (Do Next)
3. **Add Action Menu to List** - Make actions obvious
   - Edit button/link
   - Delete button
   - Approve button (conditional)
   - Status transition options
   - Generate EA button (conditional)

4. **Improve Detail View Approval UI**
   - Make approval actions more prominent
   - Add buttons instead of tab-only interface

### MEDIUM PRIORITY (Polish)
5. **Add Quick-Access Features**
   - Status transition quick links
   - EA generation with one-click
   - Export/import (currently TODO)

---

## Files Involved

### Need Changes
- `/src/features/programs/components/plan/site-visit/index.tsx` (list view)
- `/src/features/programs/components/plan/site-visit/[id]/index.tsx` (detail view)
- `/src/features/programs/types/site-visit.ts` (fix types)

### Already Complete (Reusable)
- `ApprovalWorkflow.tsx` - Has approval logic
- `SiteVisitApprovalStatus.tsx` - Shows approval status
- `EAGenerationWorkflow.tsx` - Has EA generation
- Controller has all API calls needed

---

## API Endpoints Available

All these already exist and work:

**CRUD**:
- `useGetAllSiteVisits()` ✓
- `useGetSingleSiteVisit()` ✓
- `useCreateSiteVisit()` ✓
- `useUpdateSiteVisit()` ✓
- `useDeleteSiteVisit()` ✓ (NEVER CALLED)
- `useUpdateSiteVisitStatus()` ✓

**Approvals**:
- `useGetSiteVisitApprovals()` ✓
- `useApprovalAction()` ✓
- `useQuickApprove()` ✓
- `useQuickReject()` ✓

**EA Generation**:
- `useGenerateEAsFromSiteVisit()` ✓
- `useGenerateTeamMemberEA()` ✓

**Everything is ready** - just need to call them from the UI!

---

## Step-by-Step Fix

### Step 1: Add Delete (Most Critical)
```typescript
// In list view, add delete button column
const handleDelete = async (id: string) => {
  // Show confirmation dialog
  // Call: const { mutate: delete } = useDeleteSiteVisit(id)
  // Refresh list after delete
}
```

### Step 2: Add Delete to Detail
```typescript
// In detail view, add delete button in header
// Show confirmation dialog
// Navigate back after deletion
```

### Step 3: Add Action Menu Column
```typescript
// In list view DataTable, add new column with dropdown menu:
// - Edit (navigate to detail)
// - Delete (show dialog)
// - Approve (if status allows)
// - View Details (already works via row click)
```

### Step 4: Fix Types
- Update `ISiteVisit` interface to include all fields detail view expects
- Replace `ISiteVisitData` with `ISiteVisit` consistently
- Add missing fields: `facility`, `travel_reason`, `expected_outcome`, actual dates

### Step 5: Improve Approvals
- Make approval buttons visible in detail view (not just in tab)
- Show conditional buttons based on user role and status

---

## Expected User Experience After Fix

### List View
1. User sees site visits ✓ (already works)
2. User sees action menu in each row (NEW)
   - Click "View" → goes to details
   - Click "Edit" → goes to edit page (if draft/submitted)
   - Click "Delete" → shows confirmation, deletes
   - Click "Approve" → shows dialog, approves (if pending)
   - Click "Generate EA" → generates EA (if approved)

### Detail View
1. User sees full details ✓ (already works)
2. User sees action buttons in header (IMPROVED)
   - Edit button (if draft/submitted)
   - Delete button (with confirmation)
   - Generate EA button (if approved)
   - Approve button (if reviewer)
3. Approval tab shows interactive controls (IMPROVED)

---

## Type System Issues Found

### Current Problem
```typescript
// Type file says:
interface ISiteVisit {
  visit_type: SiteVisitType;
  start_date: string;
  end_date: string;
  // ... no proposed/actual dates, no facility field
}

// But detail component uses:
siteVisit.site_visit_type // WRONG! 
siteVisit.proposed_start_date // NOT IN TYPE
siteVisit.actual_start_date // NOT IN TYPE
siteVisit.facility // NOT IN TYPE
```

### Solution
Add to `ISiteVisit`:
```typescript
site_visit_type?: SiteVisitType; // Alternative field name
proposed_start_date?: string;
actual_start_date?: string;
proposed_end_date?: string;
actual_end_date?: string;
facility?: TFacilityData;
travel_reason?: string;
expected_outcome?: string;
```

---

## Test Checklist When Done

- [ ] Can delete a site visit from list (with confirmation)
- [ ] Can delete a site visit from detail page
- [ ] Can see action menu in list view
- [ ] Can edit site visit from list
- [ ] Can approve site visit (if eligible)
- [ ] Can generate EA (if approved)
- [ ] Detail view shows all fields correctly
- [ ] Status transitions are clear
- [ ] No type errors in console

---

## Effort Estimate

- **Delete functionality**: 1-2 hours (straightforward)
- **Fix type mismatches**: 30 minutes
- **Add action menu to list**: 1-2 hours (UI integration)
- **Improve detail view**: 1 hour (button placement)
- **Testing**: 1-2 hours
- **Total**: ~5-7 hours

---

## Files to Read for Context

1. **Main List**: `/src/features/programs/components/plan/site-visit/index.tsx` (275 lines)
2. **Detail View**: `/src/features/programs/components/plan/site-visit/[id]/index.tsx` (383 lines)
3. **Types**: `/src/features/programs/types/site-visit.ts` (416 lines)
4. **Controller**: `/src/features/programs/controllers/siteVisitController.ts` (688 lines)
5. **Approvals**: `/src/features/programs/components/plan/site-visit/ApprovalWorkflow.tsx` (500+ lines)

For more details, see: `/SITE_VISIT_INVESTIGATION.md`
