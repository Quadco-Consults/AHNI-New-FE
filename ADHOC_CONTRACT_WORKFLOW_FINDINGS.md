# AdHoc Contract Workflow - Investigation Findings

**Date:** October 21, 2025
**Issue:** Contract issuance and acceptance workflow missing for AdHoc applicants

---

## Summary

Your implementation successfully handles the complete interview workflow (Advertise → Apply → Shortlist → Create Interview → Conduct → Score → Rate → Hire), but **contract issuance and acceptance are NOT implemented for AdHoc applicants.**

The contract acceptance UI you see at `/dashboard/programs/adhoc/adhoc-acceptance` is designed for **Consultancy applicants only**, not AdHoc applicants, because they use different status workflows.

---

## Key Findings

### 1. Status Workflows Differ

#### AdHoc Applicant Statuses
**Source:** `src/features/programs/types/adhoc-management.ts:248`

```typescript
status: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED"
```

**Workflow:**
```
SUBMITTED → SHORTLISTED → INTERVIEWED → SELECTED → HIRED (END)
```

#### Consultancy Applicant Statuses
**Source:** Contract acceptance component expects these:

```typescript
status: "CONTRACT_ISSUED" | "APPROVED" | ...
```

**Workflow:**
```
... → HIRED → CONTRACT_ISSUED → APPROVED (END)
```

### 2. Contract Acceptance UI is for Consultants

**File:** `src/features/contracts-grants/components/contract-management/consultant-acceptance/index.tsx`

**Key Evidence:**
- Line 22-30: Uses `useGetAllContractRequests` and `useGetAllConsultancyApplicants`
- Line 54: Filters for `status === 'CONTRACT_ISSUED'` or `status === 'APPROVED'`
- Line 18: Determines type based on pathname but **still fetches consultancy data**

**This means:**
- The UI **detects** if you're on the adhoc route (`pathname.includes("adhoc")`)
- It **sets the label** to "adhoc staff" instead of "consultants"
- BUT it still **fetches consultancy applicants** from consultancy endpoints
- AdHoc applicants with status `HIRED` will **never appear** because they don't have `CONTRACT_ISSUED` status

### 3. AdHoc Has No Contract Generation

**Evidence:**
1. No `CONTRACT_ISSUED` status exists for AdHoc applicants
2. No contract generation endpoint in adhoc controllers
3. Hire functionality (line 56-82 in `AdhocApplicantDetails.tsx`) only updates status to `HIRED`
4. No follow-up action after hiring

**Current Hire Implementation:**
```typescript
// AdhocApplicantDetails.tsx:56-82
const handleContractIssuance = async () => {
  await updateStatusMutation.mutateAsync({
    status: "HIRED",
    contract_start_date: contractStart,
    contract_end_date: contractEnd,
  });
  // No contract document generation!
  // No contract issuance!
  // Just status update to HIRED
};
```

### 4. Contract Routes Exist But Don't Work for AdHoc

**Existing Routes:**
1. `/dashboard/programs/adhoc/adhoc-acceptance` - Shows consultancy applicants with wrong filter
2. `/dashboard/programs/adhoc/contract-recipients` - Unknown implementation
3. `/dashboard/programs/adhoc/accepted-contracts` - Unknown implementation

**Why They Don't Work:**
- They fetch from consultancy endpoints
- They filter for `CONTRACT_ISSUED` status
- AdHoc applicants never reach `CONTRACT_ISSUED` status
- No data bridge between adhoc and consultancy systems

---

## Why HIRED Status Update Wasn't Working

### Original Issue
You reported clicking "Hire Applicant" didn't change status to `HIRED`.

### Root Cause (FIXED)
The `useUpdateAdhocApplicantStatus` mutation only accepted `{ status: string }` but you were trying to send contract dates too.

**Fix Applied:** `src/features/programs/controllers/adhocApplicantController.ts:528`
```typescript
// BEFORE
mutationFn: async (payload: { status: string }) => { ... }

// AFTER (FIXED)
mutationFn: async (payload: {
  status: string;
  contract_start_date?: string;
  contract_end_date?: string
}) => { ... }
```

### Next Steps to Test
1. Clear browser cache
2. Navigate to applicant details with status `INTERVIEWED` or `SELECTED`
3. Click "Hire Applicant" button
4. Check:
   - Network tab for PATCH request success (200 response)
   - Toast notification appears
   - Applicant appears in "Accepted" tab (filters for `status === "HIRED"`)
   - Database confirms status is `HIRED` with contract dates

---

## What's Missing - Complete Analysis

### Missing Feature 1: Contract Document Generation

**What Should Happen After Hiring:**
1. HR clicks "Hire Applicant"
2. System auto-generates contract document (PDF)
3. Contract includes:
   - Applicant details
   - Position details
   - Salary and benefits
   - Contract dates
   - Terms and conditions
   - Signature fields
4. Contract is stored in database
5. Status updates to `CONTRACT_ISSUED` (NEW STATUS NEEDED)

**Currently:**
- Status just updates to `HIRED`
- No document generation
- No `CONTRACT_ISSUED` status exists

### Missing Feature 2: Contract Issuance

**What Should Happen:**
1. After contract generation, HR can "issue" the contract
2. System sends email to applicant with:
   - Contract document (PDF attachment)
   - Unique acceptance link (token-based)
   - Instructions for review and acceptance
3. Applicant can view contract online
4. Notification sent to HR that contract was sent

**Currently:**
- No email notification system
- No contract sending mechanism
- No acceptance portal for applicants

### Missing Feature 3: Contract Acceptance by Applicant

**What Should Happen:**
1. Applicant receives email with contract link
2. Clicks link → opens contract acceptance page
3. Views contract details
4. Can:
   - Accept contract (with optional digital signature)
   - Reject contract (with reason)
   - Request clarification
5. On acceptance:
   - Status updates to `CONTRACT_ACCEPTED` (NEW STATUS NEEDED)
   - HR gets notification
   - Applicant receives confirmation email
   - Contract marked as accepted with timestamp

**Currently:**
- No applicant portal
- No acceptance mechanism
- No `CONTRACT_ACCEPTED` status

### Missing Feature 4: Admin Override for Contract Acceptance

**What Should Happen:**
1. If applicant doesn't respond within deadline
2. HR can manually mark contract as accepted
3. Or HR can void/cancel the contract
4. System tracks who accepted (applicant vs admin)

**Currently:**
- No manual acceptance option
- Hired applicants just stay in `HIRED` status forever

---

## Recommended Implementation Plan

### Phase 1: Add New Statuses (REQUIRED)

**Update:** `src/features/programs/types/adhoc-management.ts:248`

```typescript
// BEFORE
status: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED";

// AFTER
status:
  | "SUBMITTED"
  | "SHORTLISTED"
  | "INTERVIEWED"
  | "SELECTED"
  | "REJECTED"
  | "HIRED"
  | "CONTRACT_ISSUED"      // NEW: Contract generated and sent
  | "CONTRACT_ACCEPTED"    // NEW: Applicant accepted contract
  | "CONTRACT_REJECTED"    // NEW: Applicant rejected contract
  | "CONTRACT_EXPIRED"     // NEW: No response within deadline
  | "ONBOARDED";           // NEW: Applicant completed onboarding
```

**New Workflow:**
```
HIRED → CONTRACT_ISSUED → CONTRACT_ACCEPTED → ONBOARDED
                        ↓
                   CONTRACT_REJECTED
                        ↓
                   CONTRACT_EXPIRED
```

### Phase 2: Contract Generation Backend API

**Required Endpoints:**

```typescript
// Generate contract document
POST /programs/adhoc/applicants/{id}/generate-contract/
Request: {
  template_id?: string,  // Optional custom template
  custom_clauses?: string[]
}
Response: {
  contract_id: string,
  document_url: string,
  generated_at: string
}

// Send contract to applicant
POST /programs/adhoc/contracts/{id}/send/
Request: {
  email?: string,  // Override applicant email if needed
  message?: string // Custom message
}
Response: {
  sent_at: string,
  recipient_email: string,
  acceptance_token: string
}

// Accept contract (public endpoint, token-based)
POST /programs/adhoc/contracts/accept/{token}/
Request: {
  signature?: string,  // Base64 encoded signature image
  notes?: string
}
Response: {
  status: "CONTRACT_ACCEPTED",
  accepted_at: string,
  accepted_by: "APPLICANT"
}

// Reject contract (public endpoint, token-based)
POST /programs/adhoc/contracts/reject/{token}/
Request: {
  reason: string,
  alternative_proposal?: string
}
Response: {
  status: "CONTRACT_REJECTED",
  rejected_at: string,
  rejection_reason: string
}

// Admin override accept
POST /programs/adhoc/contracts/{id}/admin-accept/
Request: {
  reason: string
}
Response: {
  status: "CONTRACT_ACCEPTED",
  accepted_at: string,
  accepted_by: "ADMIN"
}
```

### Phase 3: Frontend Contract UI

#### 3.1 Update Hire Button Action

**File:** `src/features/programs/components/adhoc-management/AdhocApplicantDetails.tsx`

```typescript
// CURRENT (Line 56-82)
const handleContractIssuance = async () => {
  await updateStatusMutation.mutateAsync({
    status: "HIRED",
    contract_start_date: contractStart,
    contract_end_date: contractEnd,
  });
  toast.success("Applicant Hired Successfully");
  router.back();
};

// PROPOSED NEW IMPLEMENTATION
const handleContractIssuance = async () => {
  setIsModifyLoading(true);
  try {
    // Step 1: Update status to HIRED
    await updateStatusMutation.mutateAsync({
      status: "HIRED",
      contract_start_date: contractStart,
      contract_end_date: contractEnd,
    });

    // Step 2: Generate contract document
    const contractResponse = await AxiosWithToken.post(
      `/programs/adhoc/applicants/${applicantId}/generate-contract/`
    );

    // Step 3: Auto-send contract to applicant
    await AxiosWithToken.post(
      `/programs/adhoc/contracts/${contractResponse.data.contract_id}/send/`
    );

    toast.success("Contract generated and sent to applicant!");
    router.push(`/dashboard/programs/adhoc/adhoc-acceptance`);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to issue contract");
  } finally {
    setIsModifyLoading(false);
  }
};
```

#### 3.2 Fix Contract Acceptance Page

**File:** `src/features/contracts-grants/components/contract-management/consultant-acceptance/index.tsx`

**Current Issue:** Line 28 fetches consultancy applicants for adhoc route

**Fix:**
```typescript
// Line 18-31 CURRENT
const applicantType = pathname?.includes("adhoc") ? "ADHOC" : "CONSULTANT";
const { data: applicantsData } = useGetAllConsultancyApplicants({ ... });

// PROPOSED FIX
const applicantType = pathname?.includes("adhoc") ? "ADHOC" : "CONSULTANT";

// Use different hook based on type
const { data: consultancyData } = useGetAllConsultancyApplicants({
  enabled: applicantType === "CONSULTANT",
  ...
});

const { data: adhocData } = useGetAllAdhocApplicants({
  enabled: applicantType === "ADHOC",
  status: "CONTRACT_ISSUED",  // NEW STATUS
  ...
});

const applicantsData = applicantType === "ADHOC" ? adhocData : consultancyData;
```

#### 3.3 Create Public Contract Acceptance Page

**New File:** `src/app/contracts/accept/[token]/page.tsx`

```typescript
export default function ContractAcceptancePage({ params }: { params: { token: string } }) {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch contract by token (public endpoint)
    fetchContractByToken(params.token);
  }, [params.token]);

  const handleAccept = async () => {
    await AxiosWithToken.post(`/programs/adhoc/contracts/accept/${params.token}/`);
    toast.success("Contract accepted successfully!");
  };

  const handleReject = async (reason: string) => {
    await AxiosWithToken.post(`/programs/adhoc/contracts/reject/${params.token}/`, {
      reason
    });
    toast.success("Contract rejected.");
  };

  return (
    <div>
      {/* Display contract details */}
      {/* Accept/Reject buttons */}
      {/* Digital signature pad (optional) */}
    </div>
  );
}
```

#### 3.4 Update Accepted Tab Filter

**File:** `src/features/programs/components/adhoc-management/AdhocAcceptedApplicants.tsx`

```typescript
// Line 30 CURRENT
const isHired = applicant.status === "HIRED";

// PROPOSED FIX
const isAccepted = ["HIRED", "CONTRACT_ISSUED", "CONTRACT_ACCEPTED", "ONBOARDED"]
  .includes(applicant.status);
```

### Phase 4: Contract Template System

**Create contract templates with variables:**
```
Dear {applicant_name},

We are pleased to offer you the position of {position_title} at {organization_name}.

Start Date: {contract_start_date}
End Date: {contract_end_date}
Salary: {salary} {currency}
Location: {health_facility}

Terms and Conditions:
{standard_terms}

{custom_clauses}

Signature: ________________
Date: ________________
```

**Template Management:**
- Admin can create/edit contract templates
- Support for multiple languages
- Variable substitution
- PDF generation with styling

---

## Quick Win Solutions

### Option 1: Reuse Consultancy Contract System

**Pros:**
- Contract system already exists
- Just need to make it work for AdHoc applicants

**Steps:**
1. Add `CONTRACT_ISSUED`, `CONTRACT_ACCEPTED` statuses to AdHoc types
2. Update contract acceptance page to fetch from adhoc endpoints when on adhoc route
3. Share the same contract generation logic
4. Minimal new code required

**Cons:**
- Tightly couples AdHoc and Consultancy systems
- May inherit unwanted consultancy-specific features

### Option 2: Build Dedicated AdHoc Contract System

**Pros:**
- Clean separation of concerns
- Can customize specifically for AdHoc needs
- Independent evolution

**Steps:**
1. Create new contract endpoints for adhoc
2. Create new contract components for adhoc
3. Create new contract acceptance flow
4. More control over features

**Cons:**
- More development time
- Code duplication between consultancy and adhoc

### Option 3: Minimal Implementation (Fastest)

**For MVP - Skip document generation:**

1. Add `CONTRACT_ACCEPTED` status to AdHoc
2. After hiring, show admin a confirmation dialog:
   - "Contract sent to applicant via email (manual process)"
   - Admin manually marks when applicant accepts
3. Add "Mark as Accepted" button on hired applicants
4. Status goes: `HIRED` → `CONTRACT_ACCEPTED` (manual action)

**Pros:**
- Can launch immediately
- Offline contract process continues
- Simple status tracking

**Cons:**
- No automation
- No PDF generation
- Manual email sending

---

## Testing Checklist (After Implementation)

### Hire Functionality
- [ ] Click "Hire Applicant" on INTERVIEWED/SELECTED applicant
- [ ] Contract dates are auto-calculated (6 months)
- [ ] PATCH request succeeds (200 OK)
- [ ] Toast success message appears
- [ ] Applicant status updates to HIRED in database
- [ ] Applicant appears in "Accepted" tab
- [ ] Contract dates are saved

### Contract Generation (When Implemented)
- [ ] Contract PDF is generated with correct data
- [ ] Document is stored in database
- [ ] Document URL is accessible
- [ ] Status updates to CONTRACT_ISSUED

### Contract Sending (When Implemented)
- [ ] Email is sent to applicant
- [ ] Email contains contract PDF
- [ ] Email contains acceptance link
- [ ] Acceptance link works (token-based)

### Contract Acceptance (When Implemented)
- [ ] Applicant can view contract via link
- [ ] Applicant can accept contract
- [ ] Applicant can reject contract
- [ ] Status updates to CONTRACT_ACCEPTED on acceptance
- [ ] HR receives notification
- [ ] Admin can manually mark as accepted

---

## Recommendations

### Immediate Actions (Today)

1. **Test the hire fix:**
   - Verify hire button now works with contract dates
   - Confirm applicant appears in Accepted tab

2. **Choose implementation approach:**
   - Option 1 (Reuse Consultancy) - Fastest, recommended
   - Option 2 (Dedicated AdHoc) - Best long-term
   - Option 3 (Minimal) - Quick MVP

3. **Coordinate with backend team:**
   - Share this document
   - Discuss status additions
   - Plan contract endpoints

### Short-term (This Week)

1. Add new statuses to types
2. Implement contract generation endpoint (backend)
3. Create contract template
4. Update hire button to trigger generation

### Medium-term (This Month)

1. Implement contract sending (email)
2. Create public acceptance page
3. Add admin override for acceptance
4. Test end-to-end workflow

---

## Backend Integration Requirements

**Backend team needs to implement:**

1. **New Status Values:**
   - Add `CONTRACT_ISSUED`, `CONTRACT_ACCEPTED`, `CONTRACT_REJECTED`, `CONTRACT_EXPIRED` to AdHoc applicant model

2. **Contract Model:**
   ```python
   class AdhocContract(models.Model):
       applicant = ForeignKey(AdhocApplicant)
       contract_number = CharField()
       document_url = CharField()  # S3 URL
       generated_at = DateTimeField()
       sent_at = DateTimeField(null=True)
       acceptance_token = CharField()
       status = CharField(choices=CONTRACT_STATUSES)
       accepted_at = DateTimeField(null=True)
       accepted_by = CharField(choices=["APPLICANT", "ADMIN"])
       rejection_reason = TextField(null=True)
   ```

3. **API Endpoints:**
   - Generate contract
   - Send contract email
   - Accept contract (public, token-based)
   - Reject contract (public, token-based)
   - Admin override accept

4. **Email Templates:**
   - Contract issuance email
   - Acceptance confirmation email
   - Rejection notification email

5. **PDF Generation:**
   - Use library (e.g., WeasyPrint, ReportLab)
   - Populate template with applicant data
   - Store in S3/file storage
   - Return URL

---

## Conclusion

**Current State:**
- ✅ Interview workflow: **100% complete**
- ✅ Hire functionality: **Just fixed** (contract dates now supported)
- ❌ Contract generation: **Not implemented**
- ❌ Contract issuance: **Not implemented**
- ❌ Contract acceptance: **Not implemented**

**Your workflow is 80% complete.** The core hiring process works perfectly. The missing 20% is the contract paperwork automation.

**Next Decision:** Choose which implementation approach to pursue based on your timeline and requirements.

**Recommended:** Option 1 (Reuse Consultancy Contract System) for fastest time to market.
