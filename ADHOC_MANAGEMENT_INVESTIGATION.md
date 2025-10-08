# Adhoc Management Flow Investigation & Analysis

## Executive Summary

After investigating the adhoc management system, I found **critical architectural issues** where adhoc staff data is currently mixed with consultant data in the same database tables. This violates separation of concerns and needs to be fixed.

---

## Current State Analysis

### 1. **Adhoc Requisition Flow** ✅ (Working Correctly)

The adhoc requisition process is properly isolated and working as expected:

**Workflow:**
```
1. User creates Adhoc Requisition → stores in `/adhoc-requisitions/` endpoint
2. Requisition goes through approval (review → authorize → approve)
3. Once approved → Converted to Job Advertisement
4. Advertisement created via POST /adhoc-requisitions/{id}/convert_to_advertisement/
```

**Files:**
- Controller: `src/controllers/adhocRequisitionController.ts`
- Types: `src/types/adhoc-requisition/index.ts`
- API Endpoint: `/api/v1/adhoc-requisitions/`

**Data Structure:**
```typescript
{
  position_title, department, project, budget,
  qualifications, skills_required,
  reviewer_id, authorizer_id, approver_id,
  status: DRAFT | PENDING_APPROVAL | APPROVED | CONVERTED_TO_AD
}
```

---

### 2. **Adhoc Management Flow** ❌ (PROBLEM AREA)

This is where **the issue exists**. The adhoc management currently uses the **consultant management system**, which causes data mixing.

**Current (WRONG) Flow:**
```
/dashboard/programs/adhoc-management → ConsultantManagement Component
  ↓
Uses: useGetAllConsultantManagements({type: "ADHOC"})
  ↓
Calls: /api/v1/contract-grants/consultants/?type=ADHOC
  ↓
Returns: Consultant records filtered by type=ADHOC
```

**Files (Currently Used):**
- Page: `src/app/dashboard/programs/adhoc-management/page.tsx` → imports ConsultantManagement
- Component: `src/features/contracts-grants/components/contract-management/consultant-management/index.tsx`
- Controller: `src/features/contracts-grants/controllers/consultantManagementController.ts`
- Endpoint: `/contract-grants/consultants/` (with type filter)

**Problem:** Adhoc advertisements are stored in the **same table as consultant advertisements**, just differentiated by `type: "ADHOC"` vs `type: "CONSULTANT"`.

---

### 3. **Adhoc Database** ❌ (CRITICAL ISSUE)

The adhoc database is supposed to contain adhoc staff records, but it's currently pulling from the **consultant applicants table**.

**Current (WRONG) Implementation:**
```typescript
// File: src/features/programs/components/adhoc-database/index.tsx

export default function AdhocDatabase() {
  // ❌ WRONG: Using consultant applicants controller
  const { data } = useGetAllConsultancyApplicants({
    page, size: 1000
  });

  // ❌ Filtering consultant applicants by type=ADHOC
  const acceptedApplicants = allResults.filter(applicant => {
    return applicant.offer_accepted && applicant.type === "ADHOC";
  });

  // ❌ Transforming consultant data structure to adhoc structure
  const results = acceptedApplicants.map(applicant => ({
    sur_name: ...,
    other_names: ...,
    // Manual mapping from consultant fields to adhoc fields
  }));
}
```

**Files:**
- Component: `src/features/programs/components/adhoc-database/index.tsx`
- Controller: Uses `useGetAllConsultancyApplicants` from contracts-grants
- Endpoint: `/contract-grants/consultancy/applicants/` (consultant applicants!)

**Data Structure Expected (But Not Implemented):**
```typescript
// src/features/programs/types/adhoc-staff.ts
interface IAdhocStaffPaginatedData {
  id: string;
  sur_name: string;
  other_names: string;
  gender: "MALE" | "FEMALE" | "Other";
  state_of_origin: string;
  designation: string;
  phone_number: string;
  email_address: string;
  qualifications: string;
  health_facility: string;
  lga: string;
  bank_name?: string;
  account_number?: string;
  // ... other adhoc-specific fields
}
```

---

## Problems Identified

### 🔴 **Problem 1: Shared Database Tables**
Adhoc staff and consultant staff are stored in the same database tables:
- **Advertisements**: Both stored in `/contract-grants/consultants/` (filtered by type)
- **Applicants**: Both stored in `/contract-grants/consultancy/applicants/` (filtered by type)

### 🔴 **Problem 2: No Dedicated Adhoc Endpoints**
There are no dedicated backend endpoints for adhoc management:
- ❌ No `/programs/adhoc/advertisements/` endpoint
- ❌ No `/programs/adhoc/applicants/` endpoint
- ❌ No `/programs/adhoc-database/` endpoint

### 🔴 **Problem 3: Data Structure Mismatch**
The adhoc staff schema (in `adhoc-staff.ts`) has different fields than consultant schema:
- Adhoc: `sur_name`, `other_names`, `health_facility`, `spoke_site_name`, `lga`
- Consultant: `name`, `facility`, `location`

Currently doing manual field mapping which is error-prone.

### 🔴 **Problem 4: Missing Adhoc Controllers**
No dedicated controllers exist for adhoc staff:
- ❌ No `adhocManagementController.ts`
- ❌ No `adhocStaffController.ts`
- ❌ No `adhocDatabaseController.ts`

---

## Recommended Solution

### **Option A: Separate Adhoc System (RECOMMENDED)** ⭐

Create a completely separate adhoc management system with its own endpoints and database tables.

#### Backend Changes Required:

1. **New Database Tables:**
   ```sql
   -- Adhoc Advertisements (from requisitions)
   programs_adhoc_advertisement

   -- Adhoc Applicants (people who applied)
   programs_adhoc_applicant

   -- Adhoc Staff Database (accepted contracts)
   programs_adhoc_staff
   ```

2. **New API Endpoints:**
   ```
   POST   /api/v1/programs/adhoc/advertisements/         # Create from requisition
   GET    /api/v1/programs/adhoc/advertisements/         # List all adverts
   GET    /api/v1/programs/adhoc/advertisements/{id}/    # Single advert

   POST   /api/v1/programs/adhoc/applicants/             # Add applicant
   GET    /api/v1/programs/adhoc/applicants/             # List applicants
   GET    /api/v1/programs/adhoc/applicants/{id}/        # Single applicant
   POST   /api/v1/programs/adhoc/applicants/{id}/interview/ # Interview
   POST   /api/v1/programs/adhoc/applicants/{id}/accept/    # Accept offer

   GET    /api/v1/programs/adhoc-database/               # All adhoc staff
   GET    /api/v1/programs/adhoc-database/{id}/          # Single staff
   PATCH  /api/v1/programs/adhoc-database/{id}/          # Update staff
   GET    /api/v1/programs/adhoc-database/{id}/payments/ # Payment tracking
   ```

3. **Data Flow:**
   ```
   Adhoc Requisition (Approved)
        ↓
   Convert to Adhoc Advertisement
        ↓
   Applicants Apply to Adhoc Advertisement
        ↓
   Interview & Selection
        ↓
   Contract Acceptance
        ↓
   Added to Adhoc Database
   ```

#### Frontend Changes Required:

1. **New Controllers:**
   ```
   src/features/programs/controllers/
     ├── adhocManagementController.ts      # Manage advertisements
     ├── adhocApplicantsController.ts      # Manage applicants
     └── adhocDatabaseController.ts        # Manage staff database
   ```

2. **Update Components:**
   - `src/app/dashboard/programs/adhoc-management/page.tsx`
     - Remove: `import ConsultantManagement`
     - Add: New AdhocManagement component

   - `src/features/programs/components/adhoc-database/index.tsx`
     - Remove: `useGetAllConsultancyApplicants`
     - Add: `useGetAllAdhocStaff` from new controller

3. **New Components:**
   ```
   src/features/programs/components/adhoc-management/
     ├── index.tsx                         # List adhoc advertisements
     ├── AdhocAdvertisementCard.tsx        # Card display
     ├── create/                           # Create advert from requisition
     └── [id]/
         ├── details/                      # Advert details
         ├── applicants/                   # List applicants
         └── interview/                    # Interview process
   ```

---

### **Option B: Keep Shared Tables (NOT RECOMMENDED)** ⚠️

If backend cannot be changed, improve the current filtering system:

#### Changes:

1. **Add Clear Separation Markers:**
   ```typescript
   // Add constants to distinguish types
   export const STAFF_TYPES = {
     CONSULTANT: "CONSULTANT",
     ADHOC: "ADHOC",
     FACILITATOR: "FACILITATOR"
   } as const;
   ```

2. **Create Wrapper Controllers:**
   ```typescript
   // src/features/programs/controllers/adhocManagementController.ts
   export const useGetAllAdhocAdvertisements = (params) => {
     return useGetAllConsultantManagements({
       ...params,
       type: "ADHOC" // Force adhoc type
     });
   };

   export const useGetAllAdhocApplicants = (params) => {
     return useGetAllConsultancyApplicants({
       ...params,
       type: "ADHOC" // Force adhoc type
     });
   };
   ```

3. **Benefits:**
   - No backend changes
   - Quick implementation

4. **Drawbacks:**
   - Still shares tables (data mixing)
   - Field mismatches remain
   - Confusing for developers
   - Difficult to maintain

---

## Data Flow Comparison

### **Current (WRONG) Flow:**
```
Adhoc Requisition → Approved
  ↓
Convert to Advertisement (stored in consultant table)
  ↓
Applicants apply (stored in consultant applicants table)
  ↓
Contract acceptance (still in consultant applicants table)
  ↓
Adhoc Database shows filtered consultant applicants
```

### **Correct Flow (Option A):**
```
Adhoc Requisition → Approved
  ↓
Convert to Adhoc Advertisement (stored in adhoc_advertisement table)
  ↓
Applicants apply (stored in adhoc_applicant table)
  ↓
Contract acceptance (applicant moves to adhoc_staff table)
  ↓
Adhoc Database shows adhoc_staff records
```

---

## Migration Strategy (If Option A Chosen)

### Phase 1: Backend Setup (Backend Team)
1. Create new database tables
2. Implement new API endpoints
3. Add data migration script to move existing adhoc records
4. Test endpoints thoroughly

### Phase 2: Frontend Implementation
1. Create new controllers (adhocManagementController.ts, etc.)
2. Create new components for adhoc management
3. Update adhoc-database component to use new endpoints
4. Test full flow from requisition to database

### Phase 3: Data Migration
1. Export existing adhoc records from consultant tables
2. Import into new adhoc tables via API
3. Verify data integrity
4. Update old records with migration flag

### Phase 4: Cleanup
1. Remove type="ADHOC" filters from consultant queries
2. Add deprecation warnings to old endpoints
3. Update documentation

---

## Key Files to Change (Option A Implementation)

### New Files to Create:

```
Frontend:
  src/features/programs/controllers/
    ├── adhocManagementController.ts       ← New
    ├── adhocApplicantsController.ts       ← New
    └── adhocDatabaseController.ts         ← New

  src/features/programs/components/adhoc-management/
    ├── index.tsx                          ← New (replace ConsultantManagement import)
    ├── AdhocAdvertisementCard.tsx         ← New
    └── [id]/
        ├── details/                       ← New
        ├── applicants/                    ← New
        └── interview/                     ← New

Backend:
  programs/views/
    ├── adhoc_advertisement.py             ← New
    ├── adhoc_applicant.py                 ← New
    └── adhoc_staff.py                     ← New

  programs/models/
    ├── adhoc_advertisement.py             ← New
    ├── adhoc_applicant.py                 ← New
    └── adhoc_staff.py                     ← New

  programs/serializers/
    ├── adhoc_advertisement.py             ← New
    ├── adhoc_applicant.py                 ← New
    └── adhoc_staff.py                     ← New
```

### Files to Modify:

```
Frontend:
  src/app/dashboard/programs/adhoc-management/page.tsx
    - Remove: import ConsultantManagement
    + Add: import AdhocManagement

  src/features/programs/components/adhoc-database/index.tsx
    - Remove: useGetAllConsultancyApplicants
    + Add: useGetAllAdhocStaff

  src/controllers/adhocRequisitionController.ts
    - Update: convert_to_advertisement endpoint
    + Add: Create adhoc advertisement instead of consultant
```

---

## Testing Checklist

### After Implementation:

- [ ] Create adhoc requisition
- [ ] Approve requisition
- [ ] Convert to adhoc advertisement
- [ ] Verify advertisement appears in adhoc management (not consultant management)
- [ ] Add applicant to adhoc advertisement
- [ ] Verify applicant appears in adhoc applicants (not consultant applicants)
- [ ] Interview applicant
- [ ] Accept contract
- [ ] Verify staff appears in adhoc database
- [ ] Verify staff NOT in consultant database
- [ ] Update adhoc staff information
- [ ] View payment tracking for adhoc staff

---

## Conclusion & Recommendation

### Current State: ❌ **BROKEN ARCHITECTURE**
- Adhoc and consultant data are mixed in same tables
- Using type filters as workaround
- Manual data transformation causing errors
- Confusing for developers

### Recommended Action: ✅ **OPTION A - SEPARATE SYSTEM**
- Clean separation of concerns
- Proper data modeling
- Easier to maintain and extend
- Better performance (no filtering needed)
- Clearer codebase

### Immediate Action Required:
1. **Backend Team**: Create new endpoints for adhoc system
2. **Frontend Team**: Can start creating new controllers and components
3. **Coordinate**: Data migration plan between teams

### Estimated Effort:
- Backend: 2-3 days (endpoints + migration)
- Frontend: 2-3 days (controllers + components)
- Testing: 1-2 days
- **Total**: ~1 week for complete separation

---

## Questions for Stakeholders

1. **Backend**: Can you create separate tables for adhoc staff, or must we continue using shared tables?
2. **Product**: Is there a business reason adhoc and consultants share tables?
3. **Timeline**: What's the priority for fixing this? Can we allocate 1 week for proper separation?
4. **Data**: How many existing adhoc records are in the consultant tables that need migration?

---

**Investigation Date**: 2025-10-07
**Investigated By**: Claude Code
**Status**: Awaiting decision on Option A vs Option B
