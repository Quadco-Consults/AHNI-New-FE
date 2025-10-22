# AdHoc Interview Multi-Scorer System - Frontend Implementation

## Overview
This document details how the frontend implements the multi-scorer interview system for AdHoc applicants, including status transitions and API integrations.

---

## Applicant Status Flow

### Status Progression
```
APPLIED → SHORTLISTED → INTERVIEWED → SELECTED → HIRED
```

### Status Definitions

1. **APPLIED** - Initial application submitted
2. **SHORTLISTED** - Applicant selected for interview
3. **INTERVIEWED** - All committee members have submitted interview scores
4. **SELECTED** - Applicant selected for hiring (backend status after interview)
5. **HIRED** - Final status after contract issuance

---

## API Endpoints Used

### Base URL
```
/api/v1/programs/adhoc/
```

### Endpoints

#### 1. Applicants
- `GET /applicants/` - List all applicants (with filters)
- `GET /applicants/{id}/` - Get single applicant
- `PATCH /applicants/{id}/` - Update applicant status
- `POST /applicants/` - Create new applicant

#### 2. Interviews
- `GET /interviews/` - List all interviews
- `GET /interviews/{id}/` - Get single interview
- `POST /interviews/` - Create interview
- `GET /interviews/my-pending/` - Get current user's pending interviews
- `GET /interviews/{id}/summary/` - Get interview statistics

#### 3. Interview Scores
- `GET /interview-scores/` - List all scores
- `POST /interview-scores/` - Submit individual score
- `GET /interviews/{id}/scores/` - Get all scores for an interview
- `GET /interviews/{id}/my-score/` - Get current user's score
- `PATCH /interviews/{id}/scores/{scoreId}/` - Update score

---

## Frontend Status Update Logic

### Location: `ApplicantInterview.tsx`

When an interviewer submits their score:

```typescript
// After score submission succeeds
1. Fetch all interviews for the applicant
2. Find the interview with matching applicant ID
3. Get committee_members count from interview
4. Fetch all interview-scores
5. Filter scores for this interview
6. Count total submitted scores

if (totalSubmittedScores >= totalCommitteeMembers && totalCommitteeMembers > 0) {
  // All committee members have submitted
  await updateApplicantStatus.mutateAsync({ status: "INTERVIEWED" });
}
```

### Expected Backend Behavior

**Frontend expects backend to:**
1. Accept `PATCH /applicants/{id}/` with `{ status: "INTERVIEWED" }`
2. Update the applicant status in the database
3. Return success response with updated applicant data

**Question for Backend:**
- Does the backend accept "INTERVIEWED" status?
- Or does it use "SELECTED" instead?
- What are the valid status transitions?

---

## Interview Score Submission Flow

### 1. Create Interview (Admin/HR)
**File:** `CreateAdhocInterview.tsx`

```typescript
POST /programs/adhoc/interviews/
{
  applicant: "applicant-id",
  interview_type: "COMMITTEE" | "NON_COMMITTEE",
  committee_members: ["user-id-1", "user-id-2"], // Array of interviewer IDs
  interview_date: "2025-10-21",
  interview_time: "14:00",
  location: "Conference Room A",
  notes: "Interview notes"
}
```

### 2. Interviewer Views Pending Interviews
**File:** `ApplicantInterview.tsx`

```typescript
GET /programs/adhoc/interviews/my-pending/

Returns: [{
  id: "interview-id",
  applicant: "applicant-id",
  applicant_name: "John Doe",
  committee_members: [
    { id: "user-1", name: "Interviewer 1" },
    { id: "user-2", name: "Interviewer 2" }
  ],
  interview_date: "2025-10-21",
  status: "PENDING"
}]
```

### 3. Interviewer Submits Scores
**File:** `ApplicantInterview.tsx`

```typescript
POST /programs/adhoc/interview-scores/
{
  interview: "interview-id",
  // Individual criterion scores (1-5 each)
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
  experience_comments: "Relevant experience",

  // Backend should calculate:
  total_score: 33,      // Sum of all ratings
  percentage_score: 94,  // (total_score / 35) * 100
  status: "SUBMITTED"
}
```

**Criteria Fields (7 total, max 35 points):**
1. `appearance_rating` + `appearance_comments`
2. `communication_rating` + `communication_comments`
3. `teamwork_rating` + `teamwork_comments`
4. `ethics_rating` + `ethics_comments`
5. `analytical_rating` + `analytical_comments`
6. `knowledge_rating` + `knowledge_comments`
7. `experience_rating` + `experience_comments`

### 4. Auto Status Update After All Scores Submitted

```typescript
// Frontend logic after successful score submission
const interview = await fetchInterview(interviewId);
const allScores = await fetchAllScores();
const interviewScores = allScores.filter(s => s.interview === interviewId);

if (interviewScores.length >= interview.committee_members.length) {
  // All committee members have submitted
  await updateApplicantStatus({ status: "INTERVIEWED" });
}
```

---

## Status Display by Tab

### Applications Tab
**File:** `AdhocApplicantsList.tsx`
- Shows applicants with status: `APPLIED`

### Shortlisted Tab
**File:** `AdhocShortlistedApplicants.tsx`
- Shows applicants with status: `SHORTLISTED`

### Interviewed Tab
**File:** `AdhocInterviewedApplicants.tsx`
- Shows applicants with status: `INTERVIEWED` OR `SELECTED`
- Fetches and displays interview scores
- Calculates average scores from all committee members

### Accepted Tab
**File:** `AdhocAcceptedApplicants.tsx`
- Shows applicants with status: `HIRED`

---

## Score Display Implementation

### Location: `InterviewScoresSection.tsx`

Displayed on applicant details page for applicants with status:
- `SHORTLISTED` (if scores exist)
- `INTERVIEWED`
- `SELECTED`
- `HIRED`

**Fetches:**
1. Interview for the applicant
2. All scores for that interview
3. Calculates averages across all interviewers

**Displays:**
1. Average total score (out of 35)
2. Average percentage
3. Individual interviewer scores with breakdown
4. Average by each criterion (if multiple interviewers)

---

## Status Update Mutation

### Location: `adhocApplicantController.ts`

```typescript
export const useUpdateAdhocApplicantStatus = (applicantId: string) => {
  return useMutation({
    mutationFn: async (payload: { status: string }) => {
      const response = await AxiosWithToken.patch(
        `/programs/adhoc/applicants/${applicantId}/`,
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate caches to refresh all views
      queryClient.invalidateQueries({ queryKey: ["adhocApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicant", applicantId] });
      queryClient.invalidateQueries({ queryKey: ["adhocApplicantsByAd"] });
      queryClient.invalidateQueries({ queryKey: ["adhocStaffDatabase"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-adhoc-interviews"] });
      queryClient.invalidateQueries({ queryKey: ["adhoc-interview-scores"] });
      toast.success(data.message || "Status updated successfully!");
    }
  });
};
```

**Usage:**
```typescript
// Shortlist applicant
updateStatus.mutateAsync({ status: "SHORTLISTED" });

// Mark as interviewed (auto, after all scores submitted)
updateStatus.mutateAsync({ status: "INTERVIEWED" });

// Hire applicant
updateStatus.mutateAsync({ status: "HIRED" });
```

---

## Questions for Backend Team

### 1. Status Values
- What are the exact status values in the backend?
- Is it `INTERVIEWED` or `SELECTED` after all interview scores are submitted?
- What are the valid status transitions?

### 2. Status Update Endpoint
```
PATCH /programs/adhoc/applicants/{id}/
{ "status": "INTERVIEWED" }
```
- Does this endpoint accept status updates?
- What statuses are allowed?
- Are there any restrictions or validations?

### 3. Interview Score Response
When we POST to `/interview-scores/`, does the backend:
- Calculate `total_score` automatically? (sum of all ratings)
- Calculate `percentage_score` automatically? ((total / 35) * 100)
- Set `status` to "SUBMITTED"?

### 4. Automatic Status Update
Should the backend automatically update applicant status to "INTERVIEWED" when:
- All committee members have submitted their scores?

Or should the frontend do this manually?

### 5. Interview Creation
When creating an interview via POST `/interviews/`:
- Is `committee_members` an array of user IDs?
- What fields are required vs optional?
- Does the backend validate committee members exist?

---

## Current Frontend Status Codes

```typescript
type ApplicantStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "INTERVIEWED"
  | "SELECTED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";
```

---

## Files Modified for Multi-Scorer Implementation

### Controllers
1. `src/features/programs/controllers/adhocInterviewController.ts`
   - `useSubmitAdhocInterviewScore`
   - `useGetAdhocInterviewScores`
   - `useGetMyPendingAdhocInterviews`
   - `useGetMyAdhocInterviewScore`
   - `useUpdateAdhocInterviewScore`
   - `useGetAdhocInterviewSummary`
   - `useCreateAdhocInterview`

2. `src/features/programs/controllers/adhocApplicantController.ts`
   - `useUpdateAdhocApplicantStatus` (enhanced with interview cache invalidation)

### Components
1. `src/features/contracts-grants/components/contract-management/consultant-management/id/ApplicantInterview.tsx`
   - Reused for AdHoc interviews (dual-purpose component)
   - Handles both consultancy and AdHoc interview scoring
   - Auto-updates applicant status when all scores submitted

2. `src/features/programs/components/adhoc-management/InterviewScoresSection.tsx`
   - NEW: Displays interview scores on applicant details page
   - Shows individual interviewer scores
   - Calculates and displays averages

3. `src/features/programs/components/adhoc-management/AdhocInterviewedApplicants.tsx`
   - Shows interviewed/selected applicants
   - Fetches and displays scores in table
   - Calculates average scores

4. `src/features/programs/components/adhoc-management/AdhocAcceptedApplicants.tsx`
   - Shows hired applicants
   - Filters for status === "HIRED"

5. `src/features/programs/components/adhoc-management/CreateAdhocInterview.tsx`
   - Creates interview with committee members
   - Sends notifications to interviewers

---

## Testing Checklist

### ✅ Completed
- [x] Interview creation with multiple committee members
- [x] Score submission by individual interviewers
- [x] Score fetching and display
- [x] Average score calculation
- [x] Interviewed tab filtering and display
- [x] Score display on applicant details page
- [x] Cache invalidation after score submission

### ❌ Issues Found
- [ ] Status update from SELECTED to HIRED not working
- [ ] Need to verify backend status values match frontend expectations
- [ ] Individual criterion scores showing as 0 (data structure mismatch - FIXED)

---

## Next Steps

1. **Compare with backend implementation**
   - Verify status values match
   - Verify API endpoint signatures match
   - Verify data structures match

2. **Fix status update issue**
   - Determine correct status after interview (INTERVIEWED vs SELECTED)
   - Fix hire functionality to properly update to HIRED status

3. **Add validation**
   - Prevent duplicate score submissions
   - Validate score ranges (1-5)
   - Validate required fields

4. **Add error handling**
   - Handle network errors gracefully
   - Show meaningful error messages
   - Implement retry logic

---

Generated: October 21, 2025
