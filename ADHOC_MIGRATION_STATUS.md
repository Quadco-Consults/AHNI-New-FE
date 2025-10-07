# Adhoc Management Migration Status

## Current Status: Phase 1 - Using Consultancy Endpoints (Workaround) ✅

### What's Working Now
The current implementation uses the consultancy endpoints with the `type` field to differentiate adhoc from consultant data:

- ✅ **Endpoints**: `/api/v1/contract-grants/consultancy/applicants/`
- ✅ **Type Filtering**: Client-side filtering by `type === "ADHOC"`
- ✅ **Applicant Creation**: Passes `type: "ADHOC"` based on advertisement type
- ✅ **Contract Pages**: Filter and display only adhoc applicants with contracts

### Current Implementation Files
1. **Contract Recipients** (`src/features/contracts-grants/components/contract-management/contract-recipients/index.tsx`)
   - Uses: `useGetAllConsultancyApplicants`
   - Filters: `type === "ADHOC"` AND contract issued

2. **Accepted Contracts** (`src/features/contracts-grants/components/contract-management/accepted-contracts/index.tsx`)
   - Uses: `useGetAllConsultancyApplicants`
   - Filters: `type === "ADHOC"` AND accepted status

3. **Applicant Creation** (`src/features/contracts-grants/components/contract-management/consultant-management/id/applicants/NewConsultancyStaffForm.tsx`)
   - Passes: `type` field from `consultancyManagementData.type`
   - Controller: `consultancyApplicantsController.ts`

---

## Next Step: Phase 2 - Migrate to Dedicated Adhoc Endpoints

### Backend Endpoints Available ✅
The backend has implemented dedicated adhoc endpoints:

```
✅ /api/v1/programs/adhoc/advertisements/
✅ /api/v1/programs/adhoc/applicants/
✅ /api/v1/programs/adhoc-database/
```

### Frontend Controllers Already Created ✅
The dedicated controllers exist but aren't being used yet:

```
✅ src/features/programs/controllers/adhocAdvertisementController.ts
✅ src/features/programs/controllers/adhocApplicantController.ts
✅ src/features/programs/controllers/adhocDatabaseController.ts
```

### Migration Tasks Needed

#### Task 1: Update Contract Recipients Page
**File**: `src/features/contracts-grants/components/contract-management/contract-recipients/index.tsx`

**Change From**:
```typescript
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

const { data } = useGetAllConsultancyApplicants({ page, size: 50 });

// Filter by type
const contractRecipients = allApplicants.filter((applicant: any) => {
  const isAdhoc = applicant.type === "ADHOC";
  const hasContractIssued = applicant.status === "CONTRACT_ISSUED" || ...;
  return isAdhoc && hasContractIssued;
});
```

**Change To**:
```typescript
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";

const { data } = useGetAllAdhocApplicants({ page, size: 50, enabled: true });

// No type filtering needed - all results are adhoc
const contractRecipients = allApplicants.filter((applicant: any) => {
  const hasContractIssued = applicant.status === "CONTRACT_ISSUED" || ...;
  return hasContractIssued;
});
```

#### Task 2: Update Accepted Contracts Page
**File**: `src/features/contracts-grants/components/contract-management/accepted-contracts/index.tsx`

**Same pattern as Task 1** - replace `useGetAllConsultancyApplicants` with `useGetAllAdhocApplicants`

#### Task 3: Update Applicant Creation
**File**: `src/features/contracts-grants/components/contract-management/consultant-management/id/applicants/NewConsultancyStaffForm.tsx`

**Decision Needed**:
- Option A: Create new dedicated `AdhocApplicantForm.tsx` component
- Option B: Keep using shared form (if consultant form works for adhoc)

**If Option A** (recommended):
- Create new form component using adhoc applicant controller
- Update adhoc advertisement pages to use new form
- Keep consultant form separate

#### Task 4: Update Table Column Types
**Files**:
- `src/features/contracts-grants/components/table-columns/contract-management/contract-recipients.tsx`
- `src/features/contracts-grants/components/table-columns/contract-management/accepted-contracts.tsx`

**Update column types from**:
```typescript
ColumnDef<IConsultancyStaffPaginatedData>
```

**To**:
```typescript
ColumnDef<IAdhocApplicant>
```

#### Task 5: Field Name Updates
The adhoc endpoints use different field names. Update all references:

**Old (Consultancy)** → **New (Adhoc)**:
- `contractor_name` → `surname` + `other_names`
- `name` → `full_name`
- `position_under_contract` → Uses advertisement position
- No `type` field needed (all are adhoc)

#### Task 6: Test Integration
Once migrated:
1. Test contract recipients page loads
2. Test accepted contracts page loads
3. Test creating new adhoc applicants
4. Test issuing contracts
5. Test contract acceptance
6. Verify data displays correctly

---

## Backend Issues to Report

### Issue 1: Requisition Conversion Error ❌
**Endpoint**: `POST /api/v1/adhoc-requisitions/{id}/convert_to_advertisement/`

**Error**: `'AdhocRequisition' object has no attribute 'department'`

**Root Cause**: Backend uses `requisition.department` but should use `requisition.requesting_department`

**Status**: Reported to backend team

---

## Timeline Estimate

### Quick Migration (Recommended)
- **Day 1**: Update contract pages (Tasks 1-2)
- **Day 2**: Update column types and test (Task 4)
- **Day 3**: Testing and bug fixes

### Full Migration (If creating new forms)
- **Week 1**: Update all pages, create new forms
- **Week 2**: Testing and refinement

---

## Migration Decision

**Current Recommendation**: Keep using consultancy endpoints until:
1. Backend fixes the requisition conversion bug
2. We confirm all adhoc endpoints are stable
3. We have time for proper testing of the migration

**Why Wait?**
- Current workaround is functional ✅
- Backend endpoints exist but haven't been tested in production
- Conversion bug needs to be fixed first
- No urgent business need to migrate immediately

**When to Migrate?**
- After backend confirms all adhoc endpoints are production-ready
- After conversion bug is fixed
- During a planned sprint for adhoc improvements

---

## Contact

**Backend Team**: Need to fix `department` → `requesting_department` in conversion endpoint

**Frontend Team**: Current implementation works, migration can wait for proper sprint planning
