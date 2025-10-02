# Frontend Integration TODO Checklist

**Last Updated:** 2025-10-02

---

## 🎯 High Priority Tasks

### 1. Connect Leave Management List Page to Backend ⚠️

**File:** `/src/features/hr/components/leave-management/leaveRequest.tsx`

**Current State:** Using dummy data
```typescript
const dummyData = [
  {
    id: 1,
    employee: "John Doe",
    reason: "Medical Leave",
    // ...
  }
];
```

**What to Do:**
1. Import the hook:
   ```typescript
   import { useGetLeaveRequests } from "@/features/hr/controllers/leaveRequestController";
   ```

2. Add state for search and filters:
   ```typescript
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   ```

3. Call the API hook:
   ```typescript
   const { data: leaveData, isLoading, refetch } = useGetLeaveRequests({
     page: currentPage,
     size: 20,
     status: statusFilter,
     search: searchQuery,
     enabled: true
   });
   ```

4. Extract the data:
   ```typescript
   const leaveRequests = leaveData?.data || [];
   ```

5. Update the DataTable:
   ```typescript
   <DataTable
     columns={columns}
     data={leaveRequests}
     isLoading={isLoading}
     pagination={{
       total: leaveData?.data?.length || 0,
       pageSize: 20,
       onChange: (page) => setCurrentPage(page),
     }}
   />
   ```

6. Connect the search bar:
   ```typescript
   <SearchBar
     onchange={(value) => setSearchQuery(value)}
     value={searchQuery}
   />
   ```

**Estimated Time:** 30 minutes
**Backend Status:** ✅ Ready and tested

---

### 2. Add Leave Request Detail/View Page 📄

**File:** `/src/features/hr/components/leave-management/[id]/index.tsx` (to be created)

**What to Do:**
1. Create detail page component
2. Use `useGetLeaveRequest(id)` hook
3. Display leave request information
4. Show approval workflow
5. Display documents with download links
6. Add Approve/Reject buttons (if user is approver)
7. Add Cancel button (if user is requester and status is pending)

**Features Needed:**
- Tabs: Details, Documents, Workflow, History
- Status badge with color coding
- Approval/Rejection modal
- Document upload section
- Comments section

**Estimated Time:** 2-3 hours
**Backend Status:** ✅ All endpoints ready

---

### 3. Add Delete Functionality to Leave List Page 🗑️

**What to Do:**
1. Import delete hook:
   ```typescript
   import { useDeleteLeaveRequest } from "@/features/hr/controllers/leaveRequestController";
   ```

2. Add delete handler:
   ```typescript
   const [itemToDelete, setItemToDelete] = useState<string>("");
   const { deleteLeaveRequest } = useDeleteLeaveRequest(itemToDelete);

   const handleDelete = async () => {
     try {
       await deleteLeaveRequest();
       toast.success("Leave request deleted");
       refetch();
     } catch (error) {
       toast.error("Failed to delete");
     }
   };
   ```

3. Add delete button in actions column
4. Add confirmation dialog

**Estimated Time:** 20 minutes
**Backend Status:** ✅ DELETE endpoint ready

---

## 📋 Medium Priority Tasks

### 4. Add Missing Leave Request Hooks

**File:** `/src/features/hr/controllers/leaveRequestController.ts`

**Hooks to Add:**
```typescript
// Approve leave request
export const useApproveLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<any, Error, any>({
    endpoint: `/hr/leave-request/${id}/approve/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const approveLeaveRequest = async (comments?: string) => {
    try {
      await callApi({ comments });
    } catch (error) {
      console.error("Approve error:", error);
      throw error;
    }
  };

  return { approveLeaveRequest, data, isLoading, isSuccess, error };
};

// Reject leave request
export const useRejectLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<any, Error, any>({
    endpoint: `/hr/leave-request/${id}/reject/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const rejectLeaveRequest = async (reason: string, comments?: string) => {
    try {
      await callApi({ reason, comments });
    } catch (error) {
      console.error("Reject error:", error);
      throw error;
    }
  };

  return { rejectLeaveRequest, data, isLoading, isSuccess, error };
};

// Cancel leave request
export const useCancelLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<any, Error, any>({
    endpoint: `/hr/leave-request/${id}/cancel/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const cancelLeaveRequest = async (reason: string) => {
    try {
      await callApi({ reason });
    } catch (error) {
      console.error("Cancel error:", error);
      throw error;
    }
  };

  return { cancelLeaveRequest, data, isLoading, isSuccess, error };
};

// Delete leave request
export const useDeleteLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<any, Error, Record<string, never>>({
    endpoint: `/hr/leave-request/${id}/`,
    queryKey: ["leave-requests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLeaveRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return { deleteLeaveRequest, data, isLoading, isSuccess, error };
};

// Upload document
export const useUploadLeaveDocument = (id: string) => {
  const uploadDocument = async (file: File, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);

    const response = await AxiosWithToken.post(
      `/hr/leave-request/${id}/upload_document/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  };

  return { uploadDocument };
};

// Delete document
export const useDeleteLeaveDocument = (leaveId: string, documentId: string) => {
  const deleteDocument = async () => {
    const response = await AxiosWithToken.delete(
      `/hr/leave-request/${leaveId}/documents/${documentId}/`
    );
    return response.data;
  };

  return { deleteDocument };
};
```

**Estimated Time:** 1 hour
**Backend Status:** ✅ All endpoints ready

---

### 5. Update Leave Request Form to Use Real API

**File:** `/src/features/hr/components/leave-management/LeaveRequestForm.tsx`

**Current State:** Uses mock service with backend health check fallback

**What to Do:**
1. Review current form submission
2. Ensure it's calling real backend (not mock)
3. Test file upload functionality
4. Verify approver selection works
5. Test validation API call

**Note:** Form is already set up to use real API when backend is available. Just needs testing.

**Estimated Time:** 30 minutes (testing)
**Backend Status:** ✅ All endpoints ready

---

## 🔄 Testing Checklist

After implementing the above tasks, test:

### Leave Management Tests
- [ ] List page loads data from backend
- [ ] Search filters leave requests
- [ ] Status filter works
- [ ] Pagination works
- [ ] Create new leave request
- [ ] View leave request details
- [ ] Approve leave request (as manager)
- [ ] Reject leave request (as manager)
- [ ] Cancel leave request (as employee)
- [ ] Delete leave request
- [ ] Upload document
- [ ] Delete document
- [ ] View approval workflow
- [ ] Validation errors display correctly

---

## 📝 Additional Notes

### Data Structure Reminder
```typescript
// Backend response format:
{
  status: true,
  message: "Success",
  data: [
    {
      id: "uuid",
      employee: {
        id: "uuid",
        legal_firstname: "John",
        legal_lastname: "Doe",
        // ...
      },
      reason: "Family emergency",
      fromDate: "2025-01-15",
      toDate: "2025-01-20",
      status: "Pending",
      numberOfDays: 5,
      // ...
    }
  ]
}
```

### Column Mapping
| Display Name | Backend Field | Frontend Accessor |
|--------------|---------------|-------------------|
| Employee | employee.legal_firstname + legal_lastname | row.original.employee |
| Reason | reason | row.original.reason |
| Leave Type | leaveType.name | row.original.leaveType?.name |
| From | fromDate | row.original.fromDate |
| To | toDate | row.original.toDate |
| Days | numberOfDays | row.original.numberOfDays |
| Status | status | row.original.status |

---

**For questions or issues, refer to:**
- `BACKEND_INTEGRATION_STATUS.md` - Overall status
- API documentation in backend repository
- Existing working examples in Separation Management or Grievance Management
