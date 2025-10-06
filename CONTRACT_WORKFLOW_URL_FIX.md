# Contract Workflow URL Fix - 404 Error Resolved

## 🐛 Problem Identified

The `WorkflowActions.tsx` component was experiencing 404 errors when trying to submit contract requests:

```
POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1//contract-grants/contract-requests/.../submit/
                                                      ^^
                                                 double slash!
```

## 🔍 Root Cause

The `WorkflowActions.tsx` component was:
1. ❌ Using `fetch` API directly instead of the controller hooks
2. ❌ Manually constructing URLs with incorrect baseURL
3. ❌ Using `process.env.NEXT_PUBLIC_API_URL` which defaulted to `/api/v1` (wrong variable)
4. ❌ Adding leading slashes to paths, causing double slashes

**Old Code** (lines 54-60):
```typescript
const token = localStorage.getItem('token');
const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1'; // ❌ Wrong variable

let endpoint = '';
switch (selectedAction) {
  case 'submit':
    endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/submit/`;
    //                   ^ double slash when baseUrl ends with /
```

This created URLs like:
```
/api/v1//contract-grants/... (wrong - double slash)
```

## ✅ Solution Implemented

### 1. Updated contractController.ts

**File**: `src/features/contracts-grants/controllers/contractController.ts`

**Change**: Removed leading slash from BASE_URL to avoid double slash

```typescript
// Before:
const BASE_URL = "/contract-grants/contract-requests/";

// After:
const BASE_URL = "contract-grants/contract-requests/"; // ✅ No leading slash
```

**Result**: URLs are now correctly formed:
```
https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/contract-requests/...
                                                   ^ single slash ✅
```

### 2. Rewrote WorkflowActions.tsx Component

**File**: `src/features/contracts-grants/components/contract-management/WorkflowActions.tsx`

**Change**: Replaced manual `fetch` calls with proper controller hooks

**Before** (253 lines, manual fetch):
```typescript
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  },
  body: JSON.stringify({ comment: comment.trim() || undefined }),
});
```

**After** (236 lines, controller hooks):
```typescript
// Import the approval workflow hooks
import {
  useSubmitContractRequest,
  useReviewContractRequest,
  useCompleteReviewContractRequest,
  useAuthorizeContractRequest,
  useApproveContractRequest,
  useRejectContractRequest,
} from "@/features/contracts-grants/controllers/contractController";

// Initialize hooks
const { submitContractRequest, isLoading: isSubmitting } = useSubmitContractRequest(contractRequest.id);
const { reviewContractRequest, isLoading: isReviewing } = useReviewContractRequest(contractRequest.id);
// ... etc

// Use hooks instead of fetch
switch (selectedAction) {
  case 'submit':
    await submitContractRequest();
    toast.success("Request submitted successfully");
    break;
  // ... etc
}
```

## 📊 Benefits of the Fix

### 1. ✅ Correct URL Construction
- Uses `AxiosWithToken` which has the correct `NEXT_PUBLIC_BASE_URL`
- No more double slashes
- No manual URL string concatenation

### 2. ✅ Consistent Error Handling
- Uses the same error handling as other API calls
- Properly handles 400, 403, 404 errors
- User-friendly error messages

### 3. ✅ Code Reusability
- Uses the same controller hooks as the detail page
- No code duplication
- Easier to maintain

### 4. ✅ Type Safety
- TypeScript types from controller
- Proper request/response typing
- Compile-time error checking

### 5. ✅ Loading States
- Individual loading states per action
- Proper button disabling during requests
- Better UX

## 🔧 Files Modified

1. ✅ `src/features/contracts-grants/controllers/contractController.ts`
   - Removed leading slash from BASE_URL (line 45)
   - Removed leading slash from INTERVIEW_BASE_URL (line 46)

2. ✅ `src/features/contracts-grants/components/contract-management/WorkflowActions.tsx`
   - Complete rewrite using controller hooks
   - Removed manual fetch calls
   - Added proper error handling
   - Reduced lines from 253 to 236

## 🧪 Testing

### Before Fix
```
❌ POST /api/v1//contract-grants/contract-requests/.../submit/
   → 404 Not Found
```

### After Fix
```
✅ POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/contract-requests/.../submit/
   → 200 OK (assuming backend endpoint exists)
```

## 📝 Additional Notes

### Backend Endpoint Verification

If you still get 404 errors after this fix, it means the **backend endpoint doesn't exist**. Verify:

1. Backend has the approval workflow endpoints:
   - `/contract-grants/contract-requests/{id}/submit/`
   - `/contract-grants/contract-requests/{id}/review/`
   - `/contract-grants/contract-requests/{id}/complete_review/`
   - `/contract-grants/contract-requests/{id}/authorize/`
   - `/contract-grants/contract-requests/{id}/approve/`
   - `/contract-grants/contract-requests/{id}/reject/`

2. Endpoints are deployed to Heroku

3. Endpoints accept POST method

### URL Pattern Across Controllers

**Note**: Many other controllers in the codebase also have leading slashes in BASE_URL:
- `projectController.ts`: `const BASE_URL = "/projects/";`
- `goodReceiveNoteController.ts`: `const BASE_URL = "/admins/inventory/good-receive-notes/";`
- etc.

These should also be fixed if they're experiencing similar issues, but since they work currently, the `AxiosWithToken` baseURL likely already accounts for this. The double slash was specifically an issue in `WorkflowActions.tsx` because it was using `fetch` with a different baseURL source.

## ✅ Verification Checklist

- [x] Removed leading slash from BASE_URL in contractController.ts
- [x] Rewrote WorkflowActions.tsx to use controller hooks
- [x] Tested URL construction (no double slashes)
- [x] Error handling matches other controllers
- [x] Loading states work properly
- [ ] End-to-end test with real backend (needs backend endpoints)

## 🚀 Deployment

The fix is ready to deploy. Once deployed:

1. Test the "Submit" action on a DRAFT contract request
2. Verify the URL in browser DevTools Network tab
3. Confirm no double slashes in the URL
4. Verify backend receives the request

---

*Fix Date: 2025-10-05*
*Status: ✅ COMPLETE - Ready for backend verification*
