# Adhoc Contract Pages Issue & Investigation

## Problem Statement

Two adhoc contract pages are showing empty results when they should display adhoc staff who have been issued/accepted contracts:

1. **Contract Recipients Page** (`/dashboard/programs/adhoc/contract-recipients`)
   - Should show: Adhoc staff who have been issued contracts
   - Currently showing: Empty (no results)

2. **Accepted Contracts Page** (`/dashboard/programs/adhoc/accepted-contracts`)
   - Should show: Adhoc staff who have accepted their contracts
   - Currently showing: Empty (no results)

---

## Root Cause

The backend **does not have separate adhoc endpoints** yet. Adhoc and consultant data are stored in the same database tables, differentiated by:
- A `type` field (`"ADHOC"` vs `"CONSULTANT"`)
- Relationship to a consultancy management record with `type="ADHOC"`

**Current Endpoint**: `/api/v1/contract-grants/consultancy/applicants/`
- Returns ALL applicants (both adhoc and consultant)
- No built-in filtering by type parameter

**Non-existent Endpoints** (documented in `ADHOC_FRONTEND_IMPLEMENTATION.md`):
- `/api/v1/programs/adhoc/applicants/` → 404
- `/api/v1/programs/adhoc/database/` → 404

---

## Current Implementation

### Contract Recipients Page
**File**: `src/features/contracts-grants/components/contract-management/contract-recipients/index.tsx`

**What it does**:
```typescript
// Fetches ALL consultancy applicants
const { data } = useGetAllConsultancyApplicants({ page, size: 50 });

// Filters for applicants with contract-issued status
const contractRecipients = allApplicants.filter((applicant: any) => {
    const hasContractIssued =
        applicant.status === "CONTRACT_ISSUED" ||
        applicant.status === "ACCEPTED" ||
        applicant.status === "REJECTED" ||
        applicant.contract_issued === true ||
        applicant.has_contract === true;

    return hasContractIssued;
});
```

**Issue**: Not filtering by adhoc type, so it shows both adhoc and consultant contract recipients.

---

### Accepted Contracts Page
**File**: `src/features/contracts-grants/components/contract-management/accepted-contracts/index.tsx`

**What it does**:
```typescript
// Fetches ALL consultancy applicants
const { data } = useGetAllConsultancyApplicants({ page, size: 1000 });

// Filters for accepted contracts
const results = allResults.filter(applicant => {
    const hasAcceptedStatus =
        applicant.status === "ACCEPTED" ||
        applicant.offer_accepted === true;

    return hasAcceptedStatus;
});
```

**Issue**: Not filtering by adhoc type, so it shows both adhoc and consultant accepted contracts.

---

## Debug Logging Added

Both pages now have comprehensive console logging to help diagnose the issue:

### Contract Recipients Debug Output
```javascript
🔍 Contract Recipients Debug:
- Total Applicants Fetched: <count>
- Adhoc Applicants: <count>
- Contract Recipients (Filtered): <count>
- Is Fetching: <boolean>
- Error: <error>
- All Applicants (type + status): [...]
- Unique Types: [...]
- Unique Statuses: [...]
```

### Accepted Contracts Debug Output
```javascript
🔍 Accepted Contracts Debug:
- Total Applicants Fetched: <count>
- Accepted Contracts (Filtered): <count>
- Is Fetching: <boolean>
- Error: <error>
- All Applicants (status + offer_accepted): [...]
- Unique Statuses: [...]
```

---

## Expected Workflow

According to the adhoc applicant workflow:

1. **APPLIED** - Applicant submits application
2. **SHORTLISTED** - Applicant shortlisted for interview
3. **INTERVIEWED** - Applicant interviewed
4. **CONTRACT_ISSUED** - Contract issued to applicant ← **Should appear on Contract Recipients page**
5. **ACCEPTED** - Applicant accepts contract ← **Should appear on Accepted Contracts page**
6. **REJECTED** - Applicant rejects contract

---

## Possible Issues

### Issue 1: No Adhoc Applicants in Database
- **Symptom**: `Total Applicants Fetched: 0` or all applicants are type `CONSULTANT`
- **Cause**: No adhoc applicants have been created yet
- **Solution**: Create adhoc advertisements and applicants through the adhoc management flow

### Issue 2: Wrong Status Values
- **Symptom**: Applicants exist but don't have `CONTRACT_ISSUED` or `ACCEPTED` status
- **Cause**: Applicants haven't progressed through the workflow to contract issuance
- **Solution**: Issue contracts to interviewed candidates

### Issue 3: Missing Type Field
- **Symptom**: Applicants exist but `type` field is null/undefined
- **Cause**: Backend not setting `type` field when creating adhoc applicants
- **Solution**: Backend team needs to ensure `type="ADHOC"` is set

### Issue 4: Wrong Relationship Structure
- **Symptom**: Applicants have `consultants` array but it doesn't indicate adhoc
- **Cause**: Data structure for adhoc applicants may be different than expected
- **Solution**: Check actual data structure in console logs

---

## Testing Checklist

To diagnose the issue, check the console logs on each page:

### Contract Recipients Page
1. ✅ Navigate to: `http://localhost:3000/dashboard/programs/adhoc/contract-recipients`
2. ✅ Open browser DevTools Console (F12)
3. ✅ Check the debug output:
   - How many total applicants fetched?
   - What types do they have?
   - What statuses do they have?
   - Are any marked as `CONTRACT_ISSUED`, `ACCEPTED`, or `REJECTED`?

### Accepted Contracts Page
1. ✅ Navigate to: `http://localhost:3000/dashboard/programs/adhoc/accepted-contracts`
2. ✅ Open browser DevTools Console (F12)
3. ✅ Check the debug output:
   - How many total applicants fetched?
   - What types do they have?
   - What statuses do they have?
   - Are any marked as `ACCEPTED`?
   - Do any have `offer_accepted: true`?

---

## Next Steps

Based on the console logs, we need to:

1. **If no applicants are fetched**: Create adhoc advertisements and applicants
2. **If applicants exist but wrong type**: Add adhoc type filtering to both pages
3. **If applicants exist but wrong status**: Issue contracts through the workflow
4. **If data structure is unexpected**: Adjust filtering logic based on actual structure

---

## Recommended Solution (Short-term)

Since the backend doesn't have separate adhoc endpoints, we should:

1. **Add explicit adhoc filtering** to both pages:
   ```typescript
   const adhocApplicants = allApplicants.filter((applicant: any) => {
       // Check multiple indicators of adhoc type
       return applicant.type === "ADHOC" ||
              applicant.consultants?.some((c: any) => c.type === "ADHOC") ||
              // Add other adhoc indicators based on actual data structure
   });
   ```

2. **Then apply status filtering** on the adhoc-only list

3. **Wait for console log results** to determine exact filtering logic needed

---

## Long-term Solution

**Backend Team**: Implement dedicated adhoc endpoints as documented in `ADHOC_FRONTEND_IMPLEMENTATION.md`:

```
GET  /api/v1/programs/adhoc/applicants/              # List all adhoc applicants
GET  /api/v1/programs/adhoc/applicants/{id}/         # Get single adhoc applicant
POST /api/v1/programs/adhoc/applicants/              # Create adhoc applicant
PUT  /api/v1/programs/adhoc/applicants/{id}/         # Update adhoc applicant

# Contract-specific endpoints
GET  /api/v1/programs/adhoc/applicants/contract-recipients/   # Applicants with contracts issued
GET  /api/v1/programs/adhoc/applicants/accepted-contracts/    # Applicants who accepted contracts
```

This would eliminate the need for client-side filtering and improve performance.

---

**Status**: 🔍 **INVESTIGATING** - Waiting for console log output to determine exact issue
**Date**: 2025-10-07
**Updated By**: Claude Code
