# Contract Request Approval Flow - Frontend Implementation Guide

## ❌ **CRITICAL ISSUES FOUND**

### **1. Missing Approval Endpoints in Controller**

**File**: `src/features/contracts-grants/controllers/contractController.ts`

**Problem**: The controller only has basic CRUD operations. It's **MISSING** all 6 approval workflow endpoints!

**What's Missing**:
```typescript
// ❌ MISSING - These DON'T exist in the frontend controller
useSubmitContractRequest()       // POST /contract-requests/{id}/submit/
useReviewContractRequest()       // POST /contract-requests/{id}/review/
useCompleteReviewContractRequest() // POST /contract-requests/{id}/complete_review/
useAuthorizeContractRequest()    // POST /contract-requests/{id}/authorize/
useApproveContractRequest()      // POST /contract-requests/{id}/approve/
useRejectContractRequest()       // POST /contract-requests/{id}/reject/
```

---

## 🔧 **How to Fix**

### **Step 1: Add Missing Hooks to contractController.ts**

Add these hooks after line 273:

```typescript
// ===== APPROVAL WORKFLOW HOOKS =====

// Submit Contract Request (DRAFT → SUBMITTED)
export const useSubmitContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    { comment?: string }
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const submitContractRequest = async (comment?: string) => {
    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request submit error:", error);
      throw error;
    }
  };

  return { submitContractRequest, data, isLoading, isSuccess, error };
};

// Review Contract Request (SUBMITTED → UNDER_REVIEW)
export const useReviewContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    { comment?: string }
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const reviewContractRequest = async (comment?: string) => {
    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request review error:", error);
      throw error;
    }
  };

  return { reviewContractRequest, data, isLoading, isSuccess, error };
};

// Complete Review (UNDER_REVIEW → REVIEWED)
export const useCompleteReviewContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    { comment?: string }
  >({
    endpoint: `${BASE_URL}${id}/complete_review/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const completeReviewContractRequest = async (comment?: string) => {
    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request complete review error:", error);
      throw error;
    }
  };

  return { completeReviewContractRequest, data, isLoading, isSuccess, error };
};

// Authorize Contract Request (REVIEWED → AUTHORIZED)
export const useAuthorizeContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    { comment?: string }
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const authorizeContractRequest = async (comment?: string) => {
    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request authorize error:", error);
      throw error;
    }
  };

  return { authorizeContractRequest, data, isLoading, isSuccess, error };
};

// Approve Contract Request (AUTHORIZED → APPROVED)
export const useApproveContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    { comment?: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const approveContractRequest = async (comment?: string) => {
    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request approve error:", error);
      throw error;
    }
  };

  return { approveContractRequest, data, isLoading, isSuccess, error };
};

// Reject Contract Request (ANY → REJECTED)
export const useRejectContractRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IContractRequestSingleData,
    Error,
    { comment: string }  // ⚠️ REQUIRED field!
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["contractRequests", "contractRequest"],
    isAuth: true,
    method: "POST",
  });

  const rejectContractRequest = async (comment: string) => {
    if (!comment || comment.trim() === "") {
      throw new Error("A comment is required when rejecting a request.");
    }

    try {
      await callApi({ comment });
    } catch (error) {
      console.error("Contract request reject error:", error);
      throw error;
    }
  };

  return { rejectContractRequest, data, isLoading, isSuccess, error };
};
```

---

## 📊 **Backend Approval Flow (What Actually Exists)**

```
DRAFT
  ↓ POST /contract-requests/{id}/submit/
SUBMITTED
  ↓ POST /contract-requests/{id}/review/
UNDER_REVIEW
  ↓ POST /contract-requests/{id}/complete_review/
REVIEWED
  ↓ POST /contract-requests/{id}/authorize/
AUTHORIZED
  ↓ POST /contract-requests/{id}/approve/
APPROVED

(ANY) → POST /contract-requests/{id}/reject/ → REJECTED
```

---

## 🔐 **Permission Logic (CRITICAL)**

### **1. WHO Can Perform Each Action**

| Action | Status Required | Who Can Do It | Backend Check |
|--------|----------------|---------------|---------------|
| **Submit** | DRAFT | Anyone (creator) | No specific check |
| **Review** | SUBMITTED | `instance.reviewer` ONLY | `instance.reviewer == user` |
| **Complete Review** | UNDER_REVIEW | `instance.reviewer` OR `instance.current_reviewer` | Both checked |
| **Authorize** | REVIEWED | `instance.authorizer` ONLY | `instance.authorizer == user` |
| **Approve** | AUTHORIZED | `instance.approver` ONLY | `instance.approver == user` |
| **Reject** | ANY | Anyone (with comment) | Must provide comment |

### **2. Frontend Must Check BOTH**
```typescript
// Example: Should show "Review" button?
const canReview =
  contractRequest.status === 'SUBMITTED' &&
  contractRequest.reviewer?.id === currentUser.id;

// Example: Should show "Authorize" button?
const canAuthorize =
  contractRequest.status === 'REVIEWED' &&
  contractRequest.authorizer?.id === currentUser.id;

// Example: Should show "Approve" button?
const canApprove =
  contractRequest.status === 'AUTHORIZED' &&
  contractRequest.approver?.id === currentUser.id;
```

---

## 🚨 **Common Errors & How to Handle**

### **Error 1: Wrong Status**
```json
{
  "detail": "Only draft requests can be submitted.",
  "status": 400
}
```
**Fix**: Check `contractRequest.status` before showing button

### **Error 2: Wrong User**
```json
{
  "detail": "Only the assigned reviewer can review this request.",
  "status": 403
}
```
**Fix**: Check `contractRequest.reviewer?.id === currentUser.id`

### **Error 3: Missing Comment (Reject)**
```json
{
  "detail": "A comment is required when rejecting a request.",
  "status": 400
}
```
**Fix**: Always require comment input when rejecting

---

## 💬 **Comment Tracking**

### **Backend Automatically Creates**
Every action creates a `ContractRequestComment`:
```typescript
interface ContractRequestComment {
  id: string;
  contract_request: string;
  comment: string;         // User's comment
  old_status: string;      // Previous status
  new_status: string;      // New status
  created_by: {           // Who made the change
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_datetime: string;
}
```

### **Frontend Should Display**
Show comment history/timeline in contract request details:
```typescript
// Get comments from contract request
const comments = contractRequest.comments || [];

// Display in UI
{comments.map(comment => (
  <div key={comment.id}>
    <p>{comment.created_by.first_name} {comment.created_by.last_name}</p>
    <p>{comment.old_status} → {comment.new_status}</p>
    <p>{comment.comment}</p>
    <p>{formatDate(comment.created_datetime)}</p>
  </div>
))}
```

---

## 🎯 **UI Implementation Example**

### **Contract Request Details Page**

```typescript
import { useParams } from "next/navigation";
import { useGetSingleContractRequest,
         useSubmitContractRequest,
         useReviewContractRequest,
         useCompleteReviewContractRequest,
         useAuthorizeContractRequest,
         useApproveContractRequest,
         useRejectContractRequest } from "@/features/contracts-grants/controllers/contractController";
import { useAuth } from "@/hooks/useAuth";

export default function ContractRequestDetailsPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { data, isLoading } = useGetSingleContractRequest(id);

  const contractRequest = data?.data;
  const status = contractRequest?.status;

  // Hooks for actions
  const { submitContractRequest, isLoading: isSubmitting } = useSubmitContractRequest(id);
  const { reviewContractRequest, isLoading: isReviewing } = useReviewContractRequest(id);
  const { completeReviewContractRequest, isLoading: isCompletingReview } = useCompleteReviewContractRequest(id);
  const { authorizeContractRequest, isLoading: isAuthorizing } = useAuthorizeContractRequest(id);
  const { approveContractRequest, isLoading: isApproving } = useApproveContractRequest(id);
  const { rejectContractRequest, isLoading: isRejecting } = useRejectContractRequest(id);

  // Permission checks
  const canSubmit = status === 'DRAFT';
  const canReview = status === 'SUBMITTED' && contractRequest?.reviewer?.id === currentUser?.id;
  const canCompleteReview = status === 'UNDER_REVIEW' &&
    (contractRequest?.reviewer?.id === currentUser?.id ||
     contractRequest?.current_reviewer?.id === currentUser?.id);
  const canAuthorize = status === 'REVIEWED' && contractRequest?.authorizer?.id === currentUser?.id;
  const canApprove = status === 'AUTHORIZED' && contractRequest?.approver?.id === currentUser?.id;
  const canReject = status !== 'APPROVED' && status !== 'REJECTED';

  return (
    <div>
      <h1>{contractRequest?.title}</h1>
      <Badge>{contractRequest?.status_display}</Badge>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {canSubmit && (
          <Button onClick={() => submitContractRequest()} disabled={isSubmitting}>
            Submit for Review
          </Button>
        )}

        {canReview && (
          <Button onClick={() => reviewContractRequest()} disabled={isReviewing}>
            Start Review
          </Button>
        )}

        {canCompleteReview && (
          <Button onClick={() => completeReviewContractRequest()} disabled={isCompletingReview}>
            Complete Review
          </Button>
        )}

        {canAuthorize && (
          <Button onClick={() => authorizeContractRequest()} disabled={isAuthorizing}>
            Authorize
          </Button>
        )}

        {canApprove && (
          <Button onClick={() => approveContractRequest()} disabled={isApproving}>
            Approve
          </Button>
        )}

        {canReject && (
          <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
            Reject
          </Button>
        )}
      </div>

      {/* Comment History */}
      <div className="mt-8">
        <h2>Approval History</h2>
        {contractRequest?.comments?.map(comment => (
          <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="font-semibold">
              {comment.created_by.first_name} {comment.created_by.last_name}
            </p>
            <p className="text-sm text-gray-500">
              {comment.old_status_display} → {comment.new_status_display}
            </p>
            {comment.comment && <p className="mt-2">{comment.comment}</p>}
            <p className="text-xs text-gray-400">
              {new Date(comment.created_datetime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ **Checklist for Frontend Team**

### **Controller (contractController.ts)**
- [ ] Add `useSubmitContractRequest` hook
- [ ] Add `useReviewContractRequest` hook
- [ ] Add `useCompleteReviewContractRequest` hook
- [ ] Add `useAuthorizeContractRequest` hook
- [ ] Add `useApproveContractRequest` hook
- [ ] Add `useRejectContractRequest` hook (with required comment validation)

### **UI Components**
- [ ] Show action buttons based on status AND user permission
- [ ] Handle 400 errors (wrong status)
- [ ] Handle 403 errors (wrong user)
- [ ] Require comment input for reject action
- [ ] Display comment/approval history
- [ ] Show loading states for all actions
- [ ] Invalidate query cache after successful action

### **Types (contract-request.ts)**
- [ ] Add `reviewer_detail` field to interface
- [ ] Add `authorizer_detail` field to interface
- [ ] Add `approver_detail` field to interface
- [ ] Add `current_reviewer` field to interface
- [ ] Add `comments` array field to interface

---

## 📝 **Summary**

### **What's Wrong**
1. ❌ Frontend controller missing all 6 approval endpoints
2. ❌ No permission checks in UI
3. ❌ No comment tracking/display
4. ❌ No status-based action buttons

### **What to Do**
1. ✅ Add all 6 approval hooks to controller
2. ✅ Implement permission checks (status + user role)
3. ✅ Display approval history/comments
4. ✅ Show correct buttons based on status and permissions
5. ✅ Handle errors properly (400 for status, 403 for permissions)

### **Backend is Correct**
The backend implementation is **100% correct** with:
- ✅ Proper status validation
- ✅ Role-based permissions
- ✅ Comment tracking
- ✅ Audit trail

**The frontend just needs to use what's already there!**
