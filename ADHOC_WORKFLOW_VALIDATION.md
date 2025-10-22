# AdHoc Interview Workflow - Implementation Validation

**Generated:** October 21, 2025

---

## Expected Workflow (As Described by User)

```
1. ADVERTISE      → Create job advertisement
2. APPLY          → Applicants submit applications
3. SHORTLIST      → Select candidates for interview
4. CREATE         → Create interview with committee members
5. CONDUCT        → Committee members conduct interviews
6. SCORE          → Each interviewer submits their scores
7. RATE           → Calculate average scores across interviewers
8. HIRE           → Select and hire top candidates
9. ISSUE CONTRACT → Generate and issue employment contract
10. ACCEPT        → Applicant/Admin accepts the contract
```

---

## Current Implementation Status

### ✅ IMPLEMENTED FEATURES

#### 1. ADVERTISE (✅ Fully Implemented)
**Location:** Advertisement Management Module
- Create job advertisements with details
- Set application deadlines
- Publish to applicants
- **Status:** `ACTIVE`, `DRAFT`, `CLOSED`

#### 2. APPLY (✅ Fully Implemented)
**Location:** `AdhocApplicantsList.tsx`
- Applicants can submit applications
- Form captures personal info, qualifications, experience
- Auto-assigned status: `APPLIED`
- **Endpoint:** `POST /programs/adhoc/applicants/`

#### 3. SHORTLIST (✅ Fully Implemented)
**Location:** `AdhocApplicantDetails.tsx` (Line 36-54)
- HR can review applicant details
- Click "Shortlist Applicant" button
- Updates status to: `SHORTLISTED`
- **Endpoint:** `PATCH /programs/adhoc/applicants/{id}/` with `{ status: "SHORTLISTED" }`
- **Action:** `handleShortListing()`

#### 4. CREATE INTERVIEW (✅ Fully Implemented)
**Location:** `CreateAdhocInterview.tsx`
- Create interview for shortlisted applicant
- Select multiple committee members (multi-scorer)
- Set interview date, time, location
- **Endpoint:** `POST /programs/adhoc/interviews/`
- **Payload:**
  ```typescript
  {
    applicant: "applicant-id",
    interview_type: "COMMITTEE" | "NON_COMMITTEE",
    committee_members: ["user-id-1", "user-id-2"],
    interview_date: "2025-10-21",
    interview_time: "14:00",
    location: "Conference Room A",
    notes: "Interview notes"
  }
  ```

#### 5. CONDUCT INTERVIEW (✅ Fully Implemented)
**Location:** `ApplicantInterview.tsx`
- Committee members receive interview notifications
- Each interviewer accesses their pending interviews
- **Endpoint:** `GET /programs/adhoc/interviews/my-pending/`
- View applicant details before interview
- Interview form displayed for score submission

#### 6. SCORE SUBMISSION (✅ Fully Implemented)
**Location:** `ApplicantInterview.tsx` (Line 136-289)
- Each committee member submits individual scores
- 7 evaluation criteria (1-5 points each):
  1. Appearance
  2. Communication
  3. Teamwork
  4. Ethics
  5. Analytical Skills
  6. Knowledge
  7. Experience
- **Total Possible:** 35 points
- **Endpoint:** `POST /programs/adhoc/interview-scores/`
- **Payload:**
  ```typescript
  {
    interview: "interview-id",
    appearance_rating: 5,
    appearance_comments: "Professional appearance",
    communication_rating: 4,
    communication_comments: "Clear communication",
    teamwork_rating: 5,
    teamwork_comments: "Good team player",
    ethics_rating: 5,
    ethics_comments: "Strong ethical values",
    analytical_rating: 4,
    analytical_comments: "Good analytical skills",
    knowledge_rating: 5,
    knowledge_comments: "Excellent knowledge",
    experience_rating: 5,
    experience_comments: "Relevant experience"
  }
  ```

#### 7. RATING/AUTO STATUS UPDATE (✅ Fully Implemented)
**Location:** `ApplicantInterview.tsx` (Line 162-180)
- After score submission, check if all committee members submitted
- If all submitted: Auto-update applicant status to `INTERVIEWED`
- **Endpoint:** `PATCH /programs/adhoc/applicants/{id}/` with `{ status: "INTERVIEWED" }`
- **Logic:**
  ```typescript
  if (submittedScores >= totalCommitteeMembers) {
    await updateApplicantStatus.mutateAsync({ status: "INTERVIEWED" });
  }
  ```

#### 8. SCORE DISPLAY (✅ Fully Implemented)
**Location:** `InterviewScoresSection.tsx`
- Displays on applicant details page
- Shows individual interviewer scores
- Calculates and displays average scores
- Breakdown by each criterion
- Total score out of 35
- Percentage score

**Tabs Organization:**
- **Applications Tab:** Shows `APPLIED` applicants
- **Shortlisted Tab:** Shows `SHORTLISTED` applicants
- **Interviewed Tab:** Shows `INTERVIEWED` or `SELECTED` applicants with scores
- **Accepted Tab:** Shows `HIRED` applicants

#### 9. HIRE APPLICANT (✅ Recently Fixed)
**Location:** `AdhocApplicantDetails.tsx` (Line 56-82)
- Button appears for `INTERVIEWED` or `SELECTED` status
- Calculates contract dates (6 months from today)
- Updates status to: `HIRED`
- **Endpoint:** `PATCH /programs/adhoc/applicants/{id}/`
- **Payload:**
  ```typescript
  {
    status: "HIRED",
    contract_start_date: "2025-10-21",
    contract_end_date: "2026-04-21"
  }
  ```
- **Action:** `handleContractIssuance()`
- **Recent Fix:** Added contract_start_date and contract_end_date fields (Line 528 in controller)

---

### ❓ PARTIALLY IMPLEMENTED / MISSING FEATURES

#### 10. ISSUE CONTRACT (❌ Not Implemented)
**Expected Functionality:**
- Generate formal employment contract document
- Populate contract with applicant details
- Include contract terms, salary, start/end dates
- Send contract to applicant for signature
- Track contract status

**Current Status:**
- ❌ No contract document generation
- ❌ No contract template system
- ❌ No contract sending mechanism
- ✅ Contract dates are captured during hire (start_date, end_date)

**Existing Routes That May Be Related:**
- `/dashboard/programs/adhoc/adhoc-acceptance` (exists)
- `/dashboard/programs/adhoc/contract-recipients` (exists)
- `/dashboard/programs/adhoc/accepted-contracts` (exists)

**Next Steps:**
- Investigate if these routes are functional
- Check if backend has contract generation endpoints
- Implement contract document creation if missing

#### 11. CONTRACT ACCEPTANCE (❓ Unclear Implementation)
**Expected Functionality:**
- Applicant receives contract notification
- Applicant can view contract details
- Applicant can accept or reject contract
- Admin can track acceptance status
- Final status update after acceptance

**Current Status:**
- ❓ Unclear if implemented
- ❓ Routes exist but need verification:
  - `/dashboard/programs/adhoc/adhoc-acceptance`
  - `/dashboard/programs/adhoc/accepted-contracts`

**Questions:**
1. How does applicant access the contract?
2. Is there a separate applicant portal?
3. Can admin accept on behalf of applicant?
4. What status does applicant have after accepting? (Still `HIRED`?)

---

## Status Progression Flow

### Current Implementation

```
APPLIED          → Initial application submission
    ↓
SHORTLISTED      → Manual action by HR (Shortlist button)
    ↓
[Interview Created but no status change]
    ↓
INTERVIEWED      → Auto after all committee members submit scores
    ↓
SELECTED         → (Backend may set this after interview)
    ↓
HIRED            → Manual action by HR (Hire Applicant button + contract dates)
    ↓
[CONTRACT ISSUED - NOT IMPLEMENTED]
    ↓
[ACCEPTED - UNCLEAR IF IMPLEMENTED]
```

### Status Definitions

| Status | Trigger | Location |
|--------|---------|----------|
| `APPLIED` | Applicant submits application | Auto |
| `SHORTLISTED` | HR clicks "Shortlist Applicant" | `AdhocApplicantDetails.tsx:36` |
| `INTERVIEWED` | All committee members submit scores | `ApplicantInterview.tsx:162` |
| `SELECTED` | Backend may auto-set (verify with backend team) | Unknown |
| `HIRED` | HR clicks "Hire Applicant" with contract dates | `AdhocApplicantDetails.tsx:56` |
| `REJECTED` | Manual rejection | Various |
| `WITHDRAWN` | Applicant withdraws | Unknown |

---

## Comparison: Expected vs Actual

| Step | Expected | Implemented | Status | Notes |
|------|----------|-------------|--------|-------|
| 1. Advertise | ✅ | ✅ | COMPLETE | Advertisement management exists |
| 2. Apply | ✅ | ✅ | COMPLETE | Application form functional |
| 3. Shortlist | ✅ | ✅ | COMPLETE | Manual shortlisting works |
| 4. Create Interview | ✅ | ✅ | COMPLETE | Multi-scorer interviews supported |
| 5. Conduct Interview | ✅ | ✅ | COMPLETE | Interview scoring UI exists |
| 6. Score | ✅ | ✅ | COMPLETE | 7 criteria, individual submissions |
| 7. Rate | ✅ | ✅ | COMPLETE | Auto-calculate averages, auto-update status |
| 8. Hire | ✅ | ✅ | COMPLETE | Hire button with contract dates |
| 9. Issue Contract | ✅ | ❌ | **MISSING** | No document generation |
| 10. Accept Contract | ✅ | ❓ | **UNCLEAR** | Routes exist, need verification |

---

## Missing Pieces / Recommendations

### 1. Contract Document Generation
**Priority:** HIGH

**Requirements:**
- Create contract template
- Populate with applicant data
- Generate PDF document
- Store contract in database
- Send contract to applicant (email/portal)

**Suggested Implementation:**
- Add contract template management
- Use PDF generation library (e.g., jsPDF, pdfmake)
- Create endpoint: `POST /programs/adhoc/contracts/`
- Store contract file reference in applicant record

### 2. Contract Acceptance Workflow
**Priority:** HIGH

**Requirements:**
- Applicant portal or email link to view contract
- Accept/Reject buttons
- Digital signature (optional)
- Status update after acceptance
- Admin notification

**Suggested Implementation:**
- Create public contract view page (token-based access)
- Add acceptance endpoint: `POST /programs/adhoc/contracts/{id}/accept/`
- Add rejection endpoint: `POST /programs/adhoc/contracts/{id}/reject/`
- Update applicant status to `CONTRACT_ACCEPTED` or similar

### 3. Investigate Existing Contract Routes
**Priority:** MEDIUM

Check if these routes are functional:
- `/dashboard/programs/adhoc/adhoc-acceptance`
- `/dashboard/programs/adhoc/contract-recipients`
- `/dashboard/programs/adhoc/accepted-contracts`

If they exist, verify:
- What do they currently do?
- Are they connected to backend?
- Can they be integrated into the workflow?

---

## Backend Integration Points

### Endpoints Currently Used

| Action | Method | Endpoint | Payload |
|--------|--------|----------|---------|
| List Applicants | GET | `/programs/adhoc/applicants/` | Filters |
| Get Applicant | GET | `/programs/adhoc/applicants/{id}/` | - |
| Update Status | PATCH | `/programs/adhoc/applicants/{id}/` | `{ status, contract_start_date?, contract_end_date? }` |
| Create Interview | POST | `/programs/adhoc/interviews/` | Interview details |
| Get My Interviews | GET | `/programs/adhoc/interviews/my-pending/` | - |
| Submit Score | POST | `/programs/adhoc/interview-scores/` | Scores |
| Get Scores | GET | `/programs/adhoc/interview-scores/` | Filters |

### Endpoints Needed (If Missing)

| Action | Method | Endpoint | Payload |
|--------|--------|----------|---------|
| Generate Contract | POST | `/programs/adhoc/contracts/` | `{ applicant, template }` |
| Get Contract | GET | `/programs/adhoc/contracts/{id}/` | - |
| Send Contract | POST | `/programs/adhoc/contracts/{id}/send/` | `{ email }` |
| Accept Contract | POST | `/programs/adhoc/contracts/{id}/accept/` | `{ signature? }` |
| Reject Contract | POST | `/programs/adhoc/contracts/{id}/reject/` | `{ reason }` |

---

## Testing Status

### ✅ Tested and Working
- [x] Application submission
- [x] Shortlisting applicants
- [x] Creating interviews with multiple committee members
- [x] Score submission by individual interviewers
- [x] Score display on applicant details
- [x] Average score calculation
- [x] Auto status update to INTERVIEWED
- [x] Interviewed tab filtering

### 🔧 Recently Fixed
- [x] Hire applicant with contract dates (just updated)

### ⏳ Pending Testing
- [ ] Hire functionality with new contract date fields
- [ ] Applicant appearing in "Accepted" tab after hiring
- [ ] Toast messages for hire success/error

### ❌ Not Tested (Not Implemented)
- [ ] Contract document generation
- [ ] Contract issuance
- [ ] Contract acceptance by applicant
- [ ] Contract acceptance by admin

---

## Summary

**Your implementation matches the expected workflow up to step 8 (Hire).**

### What's Working:
1. ✅ Advertise
2. ✅ Apply
3. ✅ Shortlist
4. ✅ Create Interview
5. ✅ Conduct Interview
6. ✅ Score (multi-scorer system)
7. ✅ Rate (auto-calculate averages)
8. ✅ Hire (with contract dates)

### What's Missing:
9. ❌ Issue Contract (document generation)
10. ❓ Accept Contract (unclear if implemented)

### Next Steps:
1. **Test the hire functionality** with the updated contract date fields
2. **Investigate existing contract routes** to see if contract issuance is already partially implemented
3. **Implement contract generation** if missing
4. **Implement contract acceptance workflow** if missing
5. **Add final status** for contract acceptance (e.g., `CONTRACT_ACCEPTED` or `ONBOARDED`)

---

## Recommended Additional Statuses

Consider adding these statuses to complete the workflow:

```
HIRED               → After HR hires the applicant
    ↓
CONTRACT_ISSUED     → After contract document is generated and sent
    ↓
CONTRACT_ACCEPTED   → After applicant accepts the contract
    ↓
ONBOARDED          → After applicant completes onboarding (optional)
```

Or add rejection points:

```
CONTRACT_REJECTED   → If applicant rejects the contract
CONTRACT_EXPIRED    → If applicant doesn't respond within deadline
```

---

**Conclusion:** Your implementation is **80% complete** with the core interview workflow fully functional. The missing pieces are contract document generation and acceptance, which are the final steps in the complete hiring process.
