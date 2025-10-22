# Multi-Interviewer Scoring System - Integration & Testing Guide

**Status:** Backend ✅ Complete | Frontend ✅ Complete
**Date:** October 20, 2025
**Next Step:** Integration & Testing

---

## 🎯 Overview

Both frontend and backend implementations are complete. This guide will help you:
1. Verify backend endpoints are working
2. Test frontend-backend integration
3. Integrate components into existing pages
4. Perform end-to-end testing
5. Deploy to production

---

## 📋 Phase 1: Backend Verification (30 minutes)

### Step 1.1: Check Backend API Endpoints

Open your browser or use Postman to verify these endpoints exist:

#### HR Recruitment Endpoints
```bash
# Base URL (adjust to your backend URL)
BASE_URL="https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1"

# Test endpoints exist (should return 401 or 403, not 404)
curl $BASE_URL/hr/jobs/interviews/my-pending/
curl $BASE_URL/hr/jobs/interviews/{interview-id}/scores/
curl $BASE_URL/hr/jobs/interviews/{interview-id}/my-score/
curl $BASE_URL/hr/jobs/interviews/{interview-id}/summary/
```

#### Consultancy Endpoints
```bash
curl $BASE_URL/contract-grants/consultancy/interviews/my-pending/
curl $BASE_URL/contract-grants/consultancy/interviews/{interview-id}/scores/
curl $BASE_URL/contract-grants/consultancy/interviews/{interview-id}/my-score/
curl $BASE_URL/contract-grants/consultancy/interviews/{interview-id}/summary/
```

#### AdHoc Endpoints
```bash
curl $BASE_URL/programs/adhoc/interviews/my-pending/
curl $BASE_URL/programs/adhoc/interviews/{interview-id}/scores/
curl $BASE_URL/programs/adhoc/interviews/{interview-id}/my-score/
curl $BASE_URL/programs/adhoc/interviews/{interview-id}/summary/
```

**Expected Result:** Should get authentication error (401), NOT "not found" (404)

### Step 1.2: Test API with Authentication

Use Postman or curl with your auth token:

```bash
# Get your auth token from browser localStorage or login
TOKEN="your-jwt-token-here"

# Test get pending interviews
curl -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/hr/jobs/interviews/my-pending/
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "...",
  "data": []
}
```

### Step 1.3: Verify Response Format

The backend should return data in this format:

```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": {
    // actual data here
  }
}
```

Or for errors:
```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

✅ **Checklist:**
- [ ] All HR endpoints accessible
- [ ] All Consultancy endpoints accessible
- [ ] All AdHoc endpoints accessible
- [ ] Response format matches expected structure
- [ ] Authentication required for all endpoints

---

## 🔗 Phase 2: Frontend-Backend Integration Testing (1 hour)

### Step 2.1: Test React Query Hooks

Create a test page to verify hooks work:

```tsx
// Test page: /app/dashboard/test/interview-hooks/page.tsx
"use client";

import { useGetMyPendingInterviews } from "@/features/hr/controllers/hrInterviewController";
import { useGetMyPendingConsultancyInterviews } from "@/features/contracts-grants/controllers/consultancyInterviewController";
import { useGetMyPendingAdhocInterviews } from "@/features/programs/controllers/adhocInterviewController";

export default function TestInterviewHooks() {
  // Test HR hooks
  const { data: hrPending, isLoading: hrLoading, error: hrError } = useGetMyPendingInterviews();

  // Test Consultancy hooks
  const { data: consultPending, isLoading: consultLoading, error: consultError } =
    useGetMyPendingConsultancyInterviews();

  // Test AdHoc hooks
  const { data: adhocPending, isLoading: adhocLoading, error: adhocError } =
    useGetMyPendingAdhocInterviews();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Interview Hooks Test Page</h1>

      {/* HR Module */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">HR Recruitment</h2>
        {hrLoading && <p>Loading HR interviews...</p>}
        {hrError && <p className="text-red-500">Error: {hrError.message}</p>}
        {hrPending && (
          <div>
            <p className="text-green-600">✅ HR API Connected</p>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(hrPending, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Consultancy Module */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Consultancy</h2>
        {consultLoading && <p>Loading Consultancy interviews...</p>}
        {consultError && <p className="text-red-500">Error: {consultError.message}</p>}
        {consultPending && (
          <div>
            <p className="text-green-600">✅ Consultancy API Connected</p>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(consultPending, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* AdHoc Module */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">AdHoc Staff</h2>
        {adhocLoading && <p>Loading AdHoc interviews...</p>}
        {adhocError && <p className="text-red-500">Error: {adhocError.message}</p>}
        {adhocPending && (
          <div>
            <p className="text-green-600">✅ AdHoc API Connected</p>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(adhocPending, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Navigate to:** `http://localhost:3000/dashboard/test/interview-hooks`

✅ **Expected Results:**
- [ ] HR API returns data (even if empty array)
- [ ] Consultancy API returns data (even if empty array)
- [ ] AdHoc API returns data (even if empty array)
- [ ] No CORS errors in console
- [ ] No 404 errors
- [ ] Response format matches TypeScript types

### Step 2.2: Test Score Submission

If you have a test interview ID, test score submission:

```tsx
// Add to test page
import { useSubmitInterviewScore } from "@/features/hr/controllers/hrInterviewController";
import { useState } from "react";
import { toast } from "sonner";

function TestScoreSubmission() {
  const [interviewId, setInterviewId] = useState("");
  const { submitScore, isLoading } = useSubmitInterviewScore(interviewId);

  const handleSubmit = async () => {
    try {
      await submitScore({
        appearance_rating: 4,
        appearance_comments: "Test comment",
        communication_rating: 5,
        communication_comments: "Test comment",
        teamwork_rating: 4,
        teamwork_comments: "Test comment",
        ethics_rating: 5,
        ethics_comments: "Test comment",
        analytical_rating: 4,
        analytical_comments: "Test comment",
        knowledge_rating: 4,
        knowledge_comments: "Test comment",
        experience_rating: 5,
        experience_comments: "Test comment",
        preferred_candidate: true,
        recommendation: "Test recommendation",
      });
      toast.success("Score submitted successfully!");
    } catch (error) {
      toast.error(`Error: ${(error as any)?.message}`);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-4">Test Score Submission</h3>
      <input
        type="text"
        placeholder="Enter Interview ID"
        value={interviewId}
        onChange={(e) => setInterviewId(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleSubmit}
        disabled={!interviewId || isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Submit Test Score"}
      </button>
    </div>
  );
}
```

✅ **Checklist:**
- [ ] Score submission works without errors
- [ ] Backend calculates total_score automatically
- [ ] Backend calculates percentage_score automatically
- [ ] Response includes all submitted data
- [ ] Interview completion tracking updates

---

## 🎨 Phase 3: Component Integration (2 hours)

Now let's integrate the components into your actual interview pages.

### Step 3.1: Add PendingInterviewsBanner to Dashboard

**File:** `/app/dashboard/page.tsx` (or your main dashboard)

```tsx
import { PendingInterviewsBanner } from "@/features/hr/components/interview";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Add banner at the top */}
      <PendingInterviewsBanner maxDisplay={5} />

      {/* Rest of your dashboard content */}
      {/* ... existing dashboard widgets ... */}
    </div>
  );
}
```

### Step 3.2: Create Interview Scoring Page (HR Module)

**File:** `/app/dashboard/hr/interviews/[id]/score/page.tsx`

```tsx
"use client";

import { useParams } from "next/navigation";
import { InterviewScoreCard } from "@/features/hr/components/interview";
import { useGetInterview } from "@/features/hr/controllers/hrInterviewController";
import { Loading } from "components/Loading";
import GoBack from "components/GoBack";

export default function InterviewScorePage() {
  const params = useParams();
  const interviewId = params?.id as string;

  const { data, isLoading } = useGetInterview(interviewId);
  const interview = data?.data;

  if (isLoading) return <Loading />;

  if (!interview) {
    return (
      <div className="p-8">
        <GoBack />
        <p className="text-red-500">Interview not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <GoBack />

      <InterviewScoreCard
        interviewId={interviewId}
        candidateName={interview.candidate_name}
        position={interview.position_applied}
        interviewDate={interview.date_of_interview}
        onScoreSubmitted={() => {
          // Optionally navigate back or show success message
          window.history.back();
        }}
      />
    </div>
  );
}
```

### Step 3.3: Create Interview Summary Page (HR Module)

**File:** `/app/dashboard/hr/interviews/[id]/summary/page.tsx`

```tsx
"use client";

import { useParams } from "next/navigation";
import { InterviewScoreSummary } from "@/features/hr/components/interview";
import { useGetInterview } from "@/features/hr/controllers/hrInterviewController";
import { Loading } from "components/Loading";
import GoBack from "components/GoBack";

export default function InterviewSummaryPage() {
  const params = useParams();
  const interviewId = params?.id as string;

  const { data, isLoading } = useGetInterview(interviewId);
  const interview = data?.data;

  if (isLoading) return <Loading />;

  if (!interview) {
    return (
      <div className="p-8">
        <GoBack />
        <p className="text-red-500">Interview not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <GoBack />

      <InterviewScoreSummary
        interviewId={interviewId}
        candidateName={interview.candidate_name}
        position={interview.position_applied}
      />
    </div>
  );
}
```

### Step 3.4: Do the Same for Consultancy Module

**File:** `/app/dashboard/c-and-g/consultancy/[id]/applicant/[applicantId]/interview-score/page.tsx`

```tsx
"use client";

import { useParams } from "next/navigation";
import { ConsultancyScoreCard } from "@/features/contracts-grants/components/contract-management/consultant-management/interview";
import GoBack from "components/GoBack";

export default function ConsultancyInterviewScorePage() {
  const params = useParams();
  const interviewId = params?.interviewId as string; // Adjust based on your routing

  return (
    <div className="p-8">
      <GoBack />

      <ConsultancyScoreCard
        interviewId={interviewId}
        candidateName="Candidate Name" // Get from API
        position="Consultant Position" // Get from API
        interviewDate="2025-01-20" // Get from API
        onScoreSubmitted={() => window.history.back()}
      />
    </div>
  );
}
```

### Step 3.5: Do the Same for AdHoc Module

**File:** `/app/dashboard/programs/adhoc/[id]/applicant/[applicantId]/interview-score/page.tsx`

```tsx
"use client";

import { useParams } from "next/navigation";
import { ConsultancyScoreCard } from "@/features/contracts-grants/components/contract-management/consultant-management/interview";
import GoBack from "components/GoBack";

export default function AdhocInterviewScorePage() {
  const params = useParams();
  const interviewId = params?.interviewId as string;

  // AdHoc uses same component as Consultancy (same 10 criteria)
  return (
    <div className="p-8">
      <GoBack />

      <ConsultancyScoreCard
        interviewId={interviewId}
        candidateName="Candidate Name" // Get from API
        position="AdHoc Position" // Get from API
        interviewDate="2025-01-20" // Get from API
        onScoreSubmitted={() => window.history.back()}
      />
    </div>
  );
}
```

---

## ✅ Phase 4: End-to-End Testing (2 hours)

### Test Scenario 1: Complete HR Interview Workflow

1. **Create Interview with Committee**
   - Navigate to HR job applications
   - Select an application
   - Click "Schedule Interview"
   - Select "Committee Interview"
   - Add 3 interviewers
   - Set date, time, location
   - Click "Create Interview"

2. **Verify Notifications Sent**
   - Check if in-app notifications created for all 3 interviewers
   - Check if emails sent to all 3 interviewers
   - Check if calendar invites attached

3. **Submit Scores (as Interviewer 1)**
   - Login as interviewer 1
   - Navigate to "My Pending Interviews" (or click notification)
   - See the interview in the list
   - Click "Submit Score"
   - Fill all 7 criteria ratings
   - Add comments for each
   - Add overall recommendation
   - Check "Mark as Preferred"
   - Click "Submit Score"
   - Verify success message

4. **Verify Progress Update**
   - Check interview shows "1/3 completed"
   - Check interviewer 1's score is marked "SUBMITTED"

5. **Submit Scores (as Interviewer 2 & 3)**
   - Repeat steps 3-4 for other interviewers

6. **View Summary**
   - Navigate to interview summary page
   - Verify all 3 scores displayed
   - Verify average scores calculated correctly
   - Verify completion shows 100%

7. **Verify Completion Notification**
   - Check interview creator received notification
   - Check interview status changed to "COMPLETED"

✅ **Checklist:**
- [ ] Interview creation works
- [ ] All 3 interviewers notified
- [ ] Each interviewer can submit score independently
- [ ] Progress tracking updates correctly
- [ ] Average calculation is accurate
- [ ] Completion notification sent

### Test Scenario 2: Consultancy Interview (10 Criteria)

Repeat above test for Consultancy module:
- [ ] Create committee interview for consultant applicant
- [ ] Verify 10 criteria displayed (not 7)
- [ ] Verify max score is 50 (not 35)
- [ ] Verify average calculation with 10 criteria
- [ ] All scores display correctly in summary

### Test Scenario 3: AdHoc Interview

Repeat above test for AdHoc module:
- [ ] Create committee interview for AdHoc applicant
- [ ] Verify 10 criteria displayed (same as Consultancy)
- [ ] Verify max score is 50
- [ ] Average calculation works
- [ ] Summary displays correctly

### Test Scenario 4: Pending Interviews Banner

- [ ] Banner appears on dashboard
- [ ] Shows correct count of pending interviews
- [ ] Urgent interviews highlighted
- [ ] Overdue interviews marked in red
- [ ] Click interview navigates to scoring page
- [ ] Dismiss button works
- [ ] Banner auto-refreshes every 5 minutes

---

## 🐛 Phase 5: Troubleshooting Common Issues

### Issue 1: CORS Errors

**Symptom:** Console shows "CORS policy blocked"

**Solution:**
```python
# Backend settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-production-domain.com"
]
```

### Issue 2: 404 on API Calls

**Symptom:** All API calls return 404

**Check:**
1. Is backend running?
2. Is base URL correct in `.env.local`?
3. Are endpoint paths correct?

**Debug:**
```typescript
// Check what URL is being called
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);
```

### Issue 3: Data Not Displaying

**Symptom:** Components render but no data shows

**Check:**
1. Open Network tab in browser DevTools
2. Find the API request
3. Check response format

**Expected:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**If backend returns different format, update hooks:**
```typescript
// Adjust response parsing in hooks
queryFn: async () => {
  const response = await AxiosWithToken.get(url);
  // If backend returns data directly without wrapper:
  return { data: response.data, status: 'success' };
}
```

### Issue 4: Scores Not Calculating

**Symptom:** total_score and percentage_score are null

**Solution:** Backend should calculate these automatically via database trigger or model save method.

**Check backend code:**
```python
def save(self, *args, **kwargs):
    # Calculate total score
    self.total_score = sum([
        self.appearance_rating,
        self.communication_rating,
        # ... all criteria
    ])
    # Calculate percentage
    self.percentage_score = (self.total_score / 35) * 100
    super().save(*args, **kwargs)
```

### Issue 5: Notifications Not Sending

**Check:**
1. Celery worker running?
2. Email credentials correct?
3. Check Celery logs for errors

```bash
# Check Celery logs
celery -A config worker --loglevel=debug
```

---

## 📊 Phase 6: Performance Testing

### Load Testing

Test with multiple users:
- [ ] 5 interviewers submit scores simultaneously
- [ ] Check for race conditions
- [ ] Verify completion percentage updates correctly
- [ ] Check database locks don't cause issues

### Response Time Testing

- [ ] API response < 500ms for score submission
- [ ] API response < 200ms for fetching pending interviews
- [ ] Summary calculation < 1s even with many scores

---

## 🚀 Phase 7: Production Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No console errors in browser
- [ ] All TypeScript types correct
- [ ] Backend API documented
- [ ] User training materials prepared

### Deployment Steps

1. **Update Environment Variables**
```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.ahni.org
```

2. **Build Frontend**
```bash
npm run build
npm run start
```

3. **Deploy Backend**
```bash
# Apply migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Restart services
systemctl restart gunicorn
systemctl restart celery
systemctl restart celery-beat
```

4. **Verify Production**
- [ ] Test all endpoints on production
- [ ] Test score submission
- [ ] Test notifications
- [ ] Test calendar invites

### Post-Deployment

- [ ] Monitor error logs for 24 hours
- [ ] Check email delivery rates
- [ ] Verify all interviewers can access
- [ ] Collect user feedback

---

## 📚 User Training Materials

### For Interviewers

**Quick Start Guide:**
1. You'll receive email notification when assigned to interview
2. Click link in email or find interview in "My Pending Interviews"
3. Conduct interview
4. Submit evaluation form within 24 hours
5. Can't edit after submission (contact admin if needed)

### For HR/Admin

**Quick Start Guide:**
1. Create interview as usual
2. Select "Committee Interview" type
3. Choose multiple interviewers from dropdown
4. System automatically sends notifications
5. Track progress in real-time
6. View summary when all evaluations complete

---

## ✅ Final Checklist

### Backend Verification
- [ ] All API endpoints accessible
- [ ] Authentication working
- [ ] Response format correct
- [ ] Database triggers working
- [ ] Email service configured
- [ ] Celery workers running

### Frontend Integration
- [ ] All hooks tested and working
- [ ] Components rendering correctly
- [ ] Forms submitting successfully
- [ ] Data displaying as expected
- [ ] No TypeScript errors
- [ ] No console errors

### Features Working
- [ ] Create committee interview
- [ ] Send notifications
- [ ] Submit individual scores
- [ ] Calculate averages
- [ ] Track completion
- [ ] View summaries
- [ ] Pending interviews banner

### Production Ready
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Error handling in place
- [ ] User documentation ready
- [ ] Training materials prepared

---

## 🎉 Success!

Once all checklists are complete, your multi-interviewer scoring system is fully operational!

**Next Steps:**
1. Monitor first week of usage
2. Gather user feedback
3. Make adjustments as needed
4. Train additional users
5. Consider future enhancements

**Congratulations on successful implementation! 🚀**
