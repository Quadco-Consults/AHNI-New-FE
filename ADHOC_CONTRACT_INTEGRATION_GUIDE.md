# AdHoc Contract Workflow - Integration Guide

**Date:** October 21, 2025
**Implementation:** Option 1 - Reuse Consultancy Contract System
**Status:** Frontend Complete, Backend Integration Required

---

## Summary of Changes

We've successfully integrated the AdHoc hiring workflow with the existing Consultancy contract acceptance system. The frontend is now ready to handle the complete workflow from application to contract acceptance.

---

## Frontend Changes Completed

### 1. Added New Statuses to AdHoc Types ✅

**File:** `src/features/programs/types/adhoc-management.ts`

**Changes:**
```typescript
// Line 248 - Updated status type
status: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED" | "CONTRACT_ISSUED" | "APPROVED";

// Line 476 - Updated filter params
status?: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED" | "CONTRACT_ISSUED" | "APPROVED";

// Line 297-300 - Added contract acceptance fields
offer_accepted?: boolean;
offer_acceptance_date?: string;
contract_issued_at?: string;

// Line 227-231 - Added compatibility fields
name?: string; // Full name for display
email?: string; // Alias for email_address
position_under_contract?: string; // Position from advertisement
type?: "ADHOC" | "CONSULTANT" | "FACILITATOR"; // For filtering
contract_request?: any; // For consultancy compatibility
```

### 2. Updated Contract Acceptance Component ✅

**File:** `src/features/contracts-grants/components/contract-management/consultant-acceptance/index.tsx`

**Changes:**
- **Line 9-10:** Imported AdHoc hooks (`useGetAllAdhocApplicants`, `useGetAllAdhocAdvertisements`)
- **Line 24-36:** Dual data fetching - uses consultancy endpoints for consultants, adhoc endpoints for adhoc
- **Line 56-61:** Conditional data source selection based on applicant type
- **Line 94-107:** Updated grouping logic to handle both `advertisement` (adhoc) and `contract_request` (consultancy) fields
- **Line 123-129:** Updated uncategorized filter for both types
- **Line 248-258:** Dynamic display for position title and reference number
- **Line 299-306:** Dynamic date display (publication_date vs created_datetime)

**New Behavior:**
- When pathname includes "adhoc": fetches adhoc applicants and advertisements
- When pathname is consultancy: fetches consultancy applicants and contract requests
- Displays applicants with `CONTRACT_ISSUED` or `APPROVED` status
- Groups by advertisement (adhoc) or contract request (consultancy)

### 3. Updated Hire Button to Issue Contract ✅

**File:** `src/features/programs/components/adhoc-management/AdhocApplicantDetails.tsx`

**Changes (Line 56-92):**
```typescript
const handleContractIssuance = async () => {
  setIsModifyLoading(true);
  try {
    // Calculate contract dates (6 months)
    const today = new Date();
    const contractStart = today.toISOString().split('T')[0];
    const contractEnd = new Date(today.setMonth(today.getMonth() + 6))
      .toISOString().split('T')[0];

    // Step 1: Update to HIRED with contract dates
    await updateStatusMutation.mutateAsync({
      status: "HIRED",
      contract_start_date: contractStart,
      contract_end_date: contractEnd,
    });

    // Step 2: Auto-issue contract (CONTRACT_ISSUED status)
    await updateStatusMutation.mutateAsync({
      status: "CONTRACT_ISSUED",
    });

    toast.success("Contract issued successfully! Applicant can now accept the contract.");

    // Navigate to contract acceptance portal
    router.push(`/dashboard/programs/adhoc/adhoc-acceptance`);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to hire applicant");
  } finally {
    setIsModifyLoading(false);
  }
};
```

**New Workflow:**
1. Click "Hire Applicant" button
2. Status updates to `HIRED` with contract dates
3. Status immediately updates to `CONTRACT_ISSUED`
4. Applicant appears in contract acceptance portal
5. User is redirected to `/dashboard/programs/adhoc/adhoc-acceptance`

### 4. Updated Status Mutation Hook ✅

**File:** `src/features/programs/controllers/adhocApplicantController.ts`

**Change (Line 528):**
```typescript
// BEFORE
mutationFn: async (payload: { status: string }) => { ... }

// AFTER
mutationFn: async (payload: {
  status: string;
  contract_start_date?: string;
  contract_end_date?: string
}) => { ... }
```

**Impact:**
- Hook now accepts contract dates along with status
- Properly invalidates all related caches
- Shows toast notification on success

---

## Backend Requirements

### 1. Add New Status Values to AdHoc Applicant Model

**Required Changes:**

```python
class AdhocApplicant(models.Model):
    # ... existing fields ...

    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEWED', 'Interviewed'),
        ('SELECTED', 'Selected'),
        ('REJECTED', 'Rejected'),
        ('HIRED', 'Hired'),
        ('CONTRACT_ISSUED', 'Contract Issued'),  # NEW
        ('APPROVED', 'Approved'),                # NEW (or CONTRACT_ACCEPTED)
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    # Add contract acceptance fields
    offer_accepted = models.BooleanField(default=False)  # NEW
    offer_acceptance_date = models.DateTimeField(null=True, blank=True)  # NEW
    contract_issued_at = models.DateTimeField(null=True, blank=True)  # NEW
```

### 2. Accept Status Updates via PATCH Endpoint

**Endpoint:** `PATCH /api/v1/programs/adhoc/applicants/{id}/`

**Should Accept:**
```json
{
  "status": "CONTRACT_ISSUED",
  "contract_start_date": "2025-10-21",
  "contract_end_date": "2026-04-21"
}
```

**Backend should:**
1. Validate status transition (e.g., can't go from SUBMITTED to CONTRACT_ISSUED)
2. Save contract dates
3. Set `contract_issued_at` timestamp when status = "CONTRACT_ISSUED"
4. Return updated applicant data

**Validation Rules:**
- `HIRED` → `CONTRACT_ISSUED`: ✅ Allowed
- `CONTRACT_ISSUED` → `APPROVED`: ✅ Allowed (contract acceptance)
- `SUBMITTED` → `CONTRACT_ISSUED`: ❌ Not allowed
- Must have `contract_start_date` and `contract_end_date` when hiring

### 3. Return Applicant Data in List Endpoint

**Endpoint:** `GET /api/v1/programs/adhoc/applicants/`

**Should Return:**
```json
{
  "data": {
    "results": [
      {
        "id": "uuid",
        "sur_name": "Doe",
        "other_names": "John",
        "name": "John Doe",  // Computed field (sur_name + other_names)
        "email": "john@example.com",  // Same as email_address
        "email_address": "john@example.com",
        "status": "CONTRACT_ISSUED",
        "advertisement": {
          "id": "uuid",
          "advertisement_number": "AHN-2025-001",
          "position_title": "Health Worker"
        },
        "position_under_contract": "Health Worker",  // From advertisement
        "type": "ADHOC",  // NEW - to differentiate from consultancy
        "offer_accepted": false,  // NEW
        "offer_acceptance_date": null,  // NEW
        "contract_start_date": "2025-10-21",
        "contract_end_date": "2026-04-21",
        "contract_issued_at": "2025-10-21T10:30:00Z"
      }
    ]
  }
}
```

**New Fields to Add:**
- `name` (computed): `"{sur_name} {other_names}"`
- `email` (alias): Same value as `email_address`
- `position_under_contract` (computed): From `advertisement.position_title`
- `type` (hardcoded): Always `"ADHOC"` for adhoc applicants
- `offer_accepted`: Boolean flag
- `offer_acceptance_date`: Timestamp when contract was accepted

### 4. Support Filter by Status

**Endpoint:** `GET /api/v1/programs/adhoc/applicants/?status=CONTRACT_ISSUED`

**Should return only applicants with status = `CONTRACT_ISSUED`**

### 5. Contract Acceptance Endpoint (Optional but Recommended)

**Endpoint:** `POST /api/v1/programs/adhoc/applicants/{id}/accept-contract/`

**Request Body:**
```json
{
  "signature": "base64-encoded-signature-image",  // Optional
  "accepted_by": "APPLICANT" | "ADMIN"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Contract accepted successfully!",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "offer_accepted": true,
    "offer_acceptance_date": "2025-10-21T15:45:00Z"
  }
}
```

**Backend should:**
1. Update `status` to `"APPROVED"`
2. Set `offer_accepted` = `true`
3. Set `offer_acceptance_date` = current timestamp
4. Send email notification to HR
5. Send confirmation email to applicant

---

## Complete Workflow (As Implemented)

### 1. Application Phase
```
User submits application
  → Status: SUBMITTED
  → Appears in "Applications" tab
```

### 2. Shortlisting Phase
```
HR reviews applicant details
  → Clicks "Shortlist Applicant"
  → Status: SHORTLISTED
  → Appears in "Shortlisted" tab
```

### 3. Interview Creation
```
HR creates interview
  → Selects committee members
  → Sets date, time, location
  → Interview created (no status change)
```

### 4. Interview Scoring
```
Each committee member:
  → Opens pending interviews
  → Submits individual scores (7 criteria, 1-5 each)
  → Score saved

When ALL committee members submit:
  → Status: INTERVIEWED (auto-update)
  → Appears in "Interviewed" tab
  → Average scores calculated
```

### 5. Hiring Phase
```
HR clicks "Hire Applicant"
  → Contract dates calculated (6 months)
  → Status: HIRED → CONTRACT_ISSUED (two API calls)
  → Redirect to contract acceptance portal
```

### 6. Contract Acceptance Phase
```
Applicant appears in contract acceptance portal
  → HR can view applicants by advertisement
  → Shows "Pending" badge
  → Applicant can accept contract (future feature)
  → Status: APPROVED
  → Appears as "Accepted"
```

### 7. Final Status
```
Status: APPROVED
  → Contract fully executed
  → Applicant ready for onboarding
```

---

## Testing Checklist

### Backend Testing

- [ ] Can update applicant status to `HIRED` with contract dates
- [ ] Can update applicant status from `HIRED` to `CONTRACT_ISSUED`
- [ ] Can update applicant status from `CONTRACT_ISSUED` to `APPROVED`
- [ ] `contract_issued_at` timestamp is set when status = `CONTRACT_ISSUED`
- [ ] `offer_accepted` can be set to `true`
- [ ] `offer_acceptance_date` is set when contract is accepted
- [ ] GET endpoint returns all new fields (`name`, `email`, `type`, etc.)
- [ ] Filter by `status=CONTRACT_ISSUED` works
- [ ] Validation prevents invalid status transitions

### Frontend Testing

- [ ] Click "Hire Applicant" on interviewed applicant
- [ ] Status updates to `HIRED` then `CONTRACT_ISSUED`
- [ ] Toast notification shows: "Contract issued successfully!"
- [ ] User is redirected to `/dashboard/programs/adhoc/adhoc-acceptance`
- [ ] Applicant appears in contract acceptance portal
- [ ] Applicant is grouped under correct advertisement
- [ ] Shows "Pending" badge (not accepted yet)
- [ ] Stats show correct counts (Issued: 1, Accepted: 0, Pending: 1)
- [ ] Can click "View Applicants" to see details

### End-to-End Testing

- [ ] Complete workflow: Apply → Shortlist → Interview → Score → Hire → Issue → Accept
- [ ] Multiple interviewers can submit scores
- [ ] Average scores display correctly
- [ ] Contract dates are saved
- [ ] Contract acceptance changes status to `APPROVED`
- [ ] Accepted contracts show "Accepted" badge
- [ ] Acceptance date displays correctly

---

## API Examples for Backend Team

### Example 1: Hire Applicant (Frontend sends 2 requests)

**Request 1: Update to HIRED**
```http
PATCH /api/v1/programs/adhoc/applicants/abc-123/
Content-Type: application/json

{
  "status": "HIRED",
  "contract_start_date": "2025-10-21",
  "contract_end_date": "2026-04-21"
}
```

**Response 1:**
```json
{
  "status": true,
  "message": "Applicant hired successfully!",
  "data": {
    "id": "abc-123",
    "status": "HIRED",
    "contract_start_date": "2025-10-21",
    "contract_end_date": "2026-04-21",
    "hired_at": "2025-10-21T10:30:00Z"
  }
}
```

**Request 2: Issue Contract**
```http
PATCH /api/v1/programs/adhoc/applicants/abc-123/
Content-Type: application/json

{
  "status": "CONTRACT_ISSUED"
}
```

**Response 2:**
```json
{
  "status": true,
  "message": "Status updated successfully!",
  "data": {
    "id": "abc-123",
    "status": "CONTRACT_ISSUED",
    "contract_start_date": "2025-10-21",
    "contract_end_date": "2026-04-21",
    "contract_issued_at": "2025-10-21T10:31:00Z",
    "offer_accepted": false
  }
}
```

### Example 2: List CONTRACT_ISSUED Applicants

**Request:**
```http
GET /api/v1/programs/adhoc/applicants/?status=CONTRACT_ISSUED&page=1&size=100
```

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "results": [
      {
        "id": "abc-123",
        "sur_name": "Doe",
        "other_names": "John",
        "name": "John Doe",
        "email": "john@example.com",
        "email_address": "john@example.com",
        "phone_number": "+2348012345678",
        "status": "CONTRACT_ISSUED",
        "type": "ADHOC",
        "advertisement": {
          "id": "adv-456",
          "advertisement_number": "AHN-2025-001",
          "position_title": "Health Worker"
        },
        "position_under_contract": "Health Worker",
        "contract_start_date": "2025-10-21",
        "contract_end_date": "2026-04-21",
        "contract_issued_at": "2025-10-21T10:31:00Z",
        "offer_accepted": false,
        "offer_acceptance_date": null
      }
    ],
    "pagination": {
      "count": 1,
      "page": 1,
      "page_size": 100,
      "total_pages": 1
    }
  }
}
```

### Example 3: Accept Contract (Future Feature)

**Request:**
```http
POST /api/v1/programs/adhoc/applicants/abc-123/accept-contract/
Content-Type: application/json

{
  "accepted_by": "APPLICANT",
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Response:**
```json
{
  "status": true,
  "message": "Contract accepted successfully!",
  "data": {
    "id": "abc-123",
    "status": "APPROVED",
    "offer_accepted": true,
    "offer_acceptance_date": "2025-10-21T15:45:00Z"
  }
}
```

---

## Migration Required

Backend team should create a migration to:

1. Add new status choices: `CONTRACT_ISSUED`, `APPROVED`
2. Add new fields:
   - `offer_accepted` (BooleanField, default=False)
   - `offer_acceptance_date` (DateTimeField, null=True)
   - `contract_issued_at` (DateTimeField, null=True)

3. Add computed properties (or serialize in response):
   - `name` → `f"{sur_name} {other_names}"`
   - `email` → Same as `email_address`
   - `type` → Always `"ADHOC"`
   - `position_under_contract` → From `advertisement.position_title`

---

## Benefits of This Approach

1. ✅ **Minimal Code Duplication** - Reuses existing consultancy contract UI
2. ✅ **Consistent UX** - Same interface for both adhoc and consultancy contracts
3. ✅ **Fast Implementation** - Most code already exists, just needed integration
4. ✅ **Shared Infrastructure** - Email notifications, acceptance logic all shared
5. ✅ **Easy Maintenance** - One contract system to maintain
6. ✅ **Scalable** - Can easily add more applicant types in the future

---

## Next Steps

### For Frontend Team:
1. ✅ All frontend changes complete
2. ⏳ Wait for backend to add new statuses
3. ⏳ Test end-to-end workflow
4. 📝 Document any issues found

### For Backend Team:
1. ❌ Add `CONTRACT_ISSUED` and `APPROVED` status values
2. ❌ Add contract acceptance fields to model
3. ❌ Update PATCH endpoint to accept contract dates
4. ❌ Add computed fields to GET response (`name`, `email`, `type`, etc.)
5. ❌ Create contract acceptance endpoint (optional for MVP)
6. ❌ Test with frontend team

### For Testing:
1. ⏳ Backend deploys changes to staging
2. ⏳ Frontend tests hire workflow
3. ⏳ Verify contract acceptance portal shows applicants
4. ⏳ Test contract acceptance (when implemented)

---

## Contact

**Frontend Implementation:** Complete as of October 21, 2025
**Backend Requirements:** Documented above
**Questions:** Review this guide with backend team

---

## Summary

We've successfully integrated the AdHoc hiring workflow with the existing contract system by:

1. Adding `CONTRACT_ISSUED` and `APPROVED` statuses to AdHoc types
2. Making the contract acceptance UI work for both Consultancy and AdHoc applicants
3. Updating the hire button to automatically issue contracts
4. Adding compatibility fields to AdHoc applicant type

**The frontend is ready.** Backend just needs to add the new status values and fields, then it will all work seamlessly!

**Expected user flow:**
1. HR hires applicant → Contract is automatically issued
2. Applicant appears in contract acceptance portal
3. Applicant (or admin) accepts contract
4. Status changes to `APPROVED`
5. Complete!

**Best Route:** This reuse approach saves ~1 week of development vs building a separate AdHoc contract system.
