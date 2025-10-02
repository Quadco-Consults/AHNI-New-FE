# Leave Management - Frontend Implementation Documentation

## Overview
Complete frontend implementation for HR Leave Management module with advanced features including leave balances, request workflow, approval system, and comprehensive validation.

---

## Current Implementation Status

### ✅ Frontend: Partially Complete
- **API Controller**: Basic CRUD operations exist
- **List Page**: Using DUMMY DATA
- **Request Form**: Complete with mock service fallback
- **Types**: Defined but may need alignment with backend

### ⚠️ Backend Integration: MIXED
- Some API hooks exist but list page uses mock data
- Service layer has backend health check with mock fallback

---

## File Structure

```
src/features/hr/
├── types/
│   ├── leave.ts                          # Main leave type definitions
│   ├── leave-request.ts                  # Leave request types
│   └── leave-package.ts                  # Leave package types
├── controllers/
│   ├── leaveRequestController.ts         # Basic CRUD API hooks
│   └── hrLeavePackageController.ts       # Leave package hooks
├── services/
│   ├── leaveService.ts                   # Service layer with backend health check
│   └── mockLeaveService.ts               # Mock data fallback
└── components/
    └── leave-management/
        ├── leaveRequest.tsx              # List page (USING DUMMY DATA)
        ├── LeaveRequestForm.tsx          # Create/Request form (Complete)
        ├── LeaveDashboard.tsx            # Dashboard view
        ├── LeaveBalanceCard.tsx          # Balance display
        ├── LeaveApprovalWorkflow.tsx     # Approval workflow
        └── id/
            └── LeaveHistory.tsx          # Employee leave history
```

---

## API Endpoints Expected

### Base URL
```
/hr/leave-request/
/hr/leave-types/
/hr/leave-balances/
```

### 1. List Leave Requests (GET)
```
GET /hr/leave-request/
```

**Query Parameters:**
- `page` (integer): Page number
- `size` (integer): Records per page
- `status` (string, optional): Filter by status
- `search` (string, optional): Search by employee name

**Expected Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "employee": {
        "id": "uuid",
        "legal_firstname": "John",
        "legal_lastname": "Doe",
        "employee_number": "EMP001",
        "position": {
          "name": "Software Engineer"
        }
      },
      "reason": "Family emergency",
      "fromDate": "2025-01-15",
      "toDate": "2025-01-20",
      "status": "Pending",
      "statusDisplay": "Pending Approval",
      "numberOfDays": 5
    }
  ]
}
```

### 2. Get Single Leave Request (GET)
```
GET /hr/leave-request/{id}/
```

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "employee": { /* employee details */ },
    "leaveType": {
      "id": "uuid",
      "name": "Annual Leave",
      "code": "AL"
    },
    "fromDate": "2025-01-15",
    "toDate": "2025-01-20",
    "duration": "full_day",
    "reason": "Family emergency",
    "status": "Pending",
    "numberOfDays": 5,
    "workingDays": 5,
    "isEmergency": false,
    "backupPerson": {
      "id": "uuid",
      "name": "Jane Smith"
    },
    "handoverNotes": "All urgent tasks completed",
    "attachments": [
      {
        "id": "uuid",
        "fileName": "medical_cert.pdf",
        "fileUrl": "https://...",
        "fileType": "application/pdf"
      }
    ],
    "approvalWorkflow": [
      {
        "level": 1,
        "approver": {
          "id": "uuid",
          "name": "Manager Name"
        },
        "status": "pending",
        "approvedAt": null,
        "comments": null
      }
    ],
    "createdAt": "2025-01-10T10:00:00Z",
    "updatedAt": "2025-01-10T10:00:00Z"
  }
}
```

### 3. Create Leave Request (POST)
```
POST /hr/leave-request/
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "leaveTypeId": "uuid",
  "fromDate": "2025-01-15",
  "toDate": "2025-01-20",
  "duration": "full_day",
  "reason": "Family emergency",
  "isEmergency": false,
  "emergencyContactInfo": "+234...",
  "workCoverage": {
    "backupPersonId": "uuid",
    "handoverNotes": "All tasks delegated",
    "clientNotificationRequired": false
  },
  "attachments": [
    {
      "fileName": "medical_cert.pdf",
      "fileUrl": "https://...",
      "fileType": "application/pdf"
    }
  ]
}
```

**Required Fields:**
- `employeeId` (UUID)
- `leaveTypeId` (UUID)
- `fromDate` (ISO date YYYY-MM-DD)
- `toDate` (ISO date YYYY-MM-DD)
- `reason` (string, min 5 chars)

**Optional Fields:**
- `duration` (enum: full_day, half_day_morning, half_day_afternoon, custom)
- `isEmergency` (boolean)
- `emergencyContactInfo` (string)
- `workCoverage` (object)
- `attachments` (array)

### 4. Update Leave Request (PUT/PATCH)
```
PATCH /hr/leave-request/{id}/
```

**Request Body (partial update):**
```json
{
  "reason": "Updated reason",
  "toDate": "2025-01-22"
}
```

### 5. Approve Leave Request (POST)
```
POST /hr/leave-request/{id}/approve/
```

**Request Body:**
```json
{
  "comments": "Approved for the requested dates",
  "approverId": "uuid"
}
```

### 6. Reject Leave Request (POST)
```
POST /hr/leave-request/{id}/reject/
```

**Request Body:**
```json
{
  "reason": "Insufficient leave balance",
  "comments": "Please resubmit after accrual"
}
```

### 7. Cancel Leave Request (POST)
```
POST /hr/leave-request/{id}/cancel/
```

**Request Body:**
```json
{
  "reason": "Plans changed"
}
```

---

## Additional Endpoints Needed

### 8. Get Leave Types (GET)
```
GET /hr/leave-types/
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "name": "Annual Leave",
      "code": "AL",
      "color": "#4CAF50",
      "description": "Annual vacation leave",
      "daysPerYear": 20,
      "isActive": true,
      "requiresApproval": true,
      "canCarryForward": true,
      "maxCarryForwardDays": 5,
      "canApplyInAdvance": true,
      "advanceNoticeDays": 7,
      "requiresDocumentation": false,
      "allowHalfDay": true,
      "allowNegativeBalance": false
    }
  ]
}
```

### 9. Get Leave Balances (GET)
```
GET /hr/leave-balances/{employee_id}/
```

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "leaveTypeId": "uuid",
      "leaveTypeName": "Annual Leave",
      "leaveTypeCode": "AL",
      "entitled": 20,
      "used": 8,
      "pending": 3,
      "scheduled": 2,
      "available": 7,
      "carriedForward": 0,
      "accrued": 20,
      "year": 2025
    }
  ]
}
```

### 10. Validate Leave Request (POST)
```
POST /hr/leave-request/validate/
```

**Request Body:**
```json
{
  "employeeId": "uuid",
  "leaveTypeId": "uuid",
  "fromDate": "2025-01-15",
  "toDate": "2025-01-20",
  "duration": "full_day"
}
```

**Response:**
```json
{
  "status": true,
  "isValid": true,
  "calculatedDays": {
    "totalDays": 5,
    "workDaysCount": 5,
    "weekendDaysCount": 0,
    "holidaysCount": 0,
    "effectiveLeaveDays": 5
  },
  "errors": [],
  "warnings": [
    "This overlaps with peak season"
  ]
}
```

### 11. Get Employees (for backup selection) (GET)
```
GET /hr/employees/
```

**Response:**
```json
{
  "status": true,
  "data": {
    "results": [
      {
        "id": "uuid",
        "name": "John Doe",
        "employeeId": "EMP001",
        "department": "Engineering",
        "position": "Software Engineer"
      }
    ]
  }
}
```

### 12. Upload Attachment (POST)
```
POST /hr/leave-request/attachments/upload/
```

**Request:** multipart/form-data with file

**Response:**
```json
{
  "status": true,
  "data": {
    "fileUrl": "https://...",
    "fileName": "medical_cert.pdf",
    "fileType": "application/pdf"
  }
}
```

---

## Data Types & Validation

### Status Options
- `"Pending"` - Initial state
- `"Approved"` - Approved by all required approvers
- `"Rejected"` - Rejected by any approver
- `"Cancelled"` - Cancelled by employee
- `"On Hold"` - Needs additional information

### Duration Types
- `"full_day"` - Full working day
- `"half_day_morning"` - Morning half (4 hours)
- `"half_day_afternoon"` - Afternoon half (4 hours)
- `"custom"` - Custom hours

### Date Validation Rules
1. `toDate` must be >= `fromDate`
2. Dates cannot be in the past (unless emergency)
3. Must respect advance notice days for leave type
4. Cannot overlap with existing approved/pending leaves
5. Must have sufficient leave balance

---

## Current Frontend Implementation Details

### ✅ Leave Request Form (`LeaveRequestForm.tsx`)

**Features Implemented:**
1. **Leave Type Selection**
   - Dropdown with all active leave types
   - Shows leave type color and code
   - Displays leave balance for selected type

2. **Date Selection**
   - From/To date pickers
   - Duration type (Full day, Half day morning/afternoon)
   - Real-time calculation of:
     - Total days
     - Working days
     - Weekends

3. **Validation**
   - Client-side validation with zod
   - Backend validation API call (with debounce)
   - Shows errors and warnings
   - Prevents submission if validation fails

4. **Additional Information**
   - Reason textarea (required, min 5 chars)
   - Emergency leave checkbox
   - Emergency contact info (conditional)

5. **Work Coverage**
   - Backup person selection
   - Handover notes

6. **Attachments**
   - File upload (PDF, images, docs)
   - Multiple file support
   - Shows file size
   - Can remove attachments

7. **Backend Health Check**
   - Automatically checks if backend is available
   - Falls back to mock data if backend down
   - Shows banner indicating mock data usage

### ⚠️ Leave List Page (`leaveRequest.tsx`)

**Current Status:** USING DUMMY DATA

**What's Implemented:**
- DataTable with columns:
  - Checkbox
  - Employee
  - Reason
  - Leave Type
  - From Date
  - To Date
  - Number of Days
  - Status (badge with colors)
  - Actions (View/Delete)
- Search bar (UI only)
- Filter button (UI only)
- Pagination (hardcoded)

**What Needs Backend Integration:**
```typescript
// Currently using:
const dummyData = [
  {
    id: 1,
    employee: "John Doe",
    reason: "Medical Leave",
    leave_type: "Sick Leave",
    from: "2025-01-10",
    to: "2025-01-15",
    days: 5,
    status: "Approved",
  },
  // ...
];

// Needs to be replaced with:
const { data: leaveRequests, isLoading } = useGetLeaveRequests({
  status: selectedStatus,
  search: debouncedSearch,
  page: currentPage,
  size: 20,
});
```

### Existing API Hooks (`leaveRequestController.ts`)

**Already Implemented:**
```typescript
useGetLeaveRequests({ status, search, page, size, enabled })
useGetLeaveRequest(id, enabled)
useCreateLeaveRequest()
useUpdateLeaveRequest(id)
usePatchLeaveRequest(id)
```

**Missing Hooks Needed:**
```typescript
useApproveLeaveRequest(id)
useRejectLeaveRequest(id)
useCancelLeaveRequest(id)
useValidateLeaveRequest()
useUploadAttachment()
```

---

## Backend Integration Tasks

### High Priority

1. **Update List Page to Use API**
```typescript
// Replace dummy data in leaveRequest.tsx with:
import { useGetLeaveRequests } from "@/features/hr/controllers/leaveRequestController";

const { data, isLoading, refetch } = useGetLeaveRequests({
  page: 1,
  size: 20,
  enabled: true
});

const leaveRequests = data?.data || [];
```

2. **Add Missing API Hooks**
Create in `leaveRequestController.ts`:
- `useApproveLeaveRequest`
- `useRejectLeaveRequest`
- `useCancelLeaveRequest`
- `useGetLeaveTypes`
- `useGetLeaveBalances`
- `useValidateLeaveRequest`

3. **Update Types to Match Backend**
Align `leave-request.ts` types with backend response structure

### Medium Priority

4. **Implement Detail/View Page**
   - Show full leave request details
   - Display approval workflow
   - Show attachments
   - Approve/Reject buttons (for managers)

5. **Implement Leave Dashboard**
   - Overview of all leave requests
   - Leave balance summary
   - Calendar view
   - Upcoming leaves

6. **Add Delete Functionality**
   - Hook up delete button in list page
   - Confirmation dialog
   - API integration

### Low Priority

7. **Enhanced Features**
   - Bulk approval
   - Export to Excel
   - Print leave request
   - Leave calendar integration

---

## Data Flow

### Current Flow (Form Submission)
1. User fills LeaveRequestForm
2. Client validates with zod schema
3. Calls backend validation API (optional)
4. On submit, calls `leaveService.createLeaveRequest()`
5. `leaveService` checks backend health
6. If available: calls real API
7. If not available: uses mockLeaveService
8. Returns success/error
9. Redirects to list page

### Expected Backend Flow
1. Frontend: POST /hr/leave-request/
2. Backend: Validates request
3. Backend: Checks leave balance
4. Backend: Checks for overlaps
5. Backend: Creates leave request
6. Backend: Initiates approval workflow
7. Backend: Sends notifications
8. Backend: Returns created record

---

## Testing Checklist

### Basic Operations
- [ ] List all leave requests with pagination
- [ ] Search leave requests
- [ ] Filter by status
- [ ] View single leave request details
- [ ] Create new leave request
- [ ] Update pending leave request
- [ ] Delete/Cancel leave request
- [ ] Approve leave request (manager)
- [ ] Reject leave request (manager)

### Validation
- [ ] End date after start date
- [ ] Sufficient leave balance
- [ ] No overlapping leaves
- [ ] Advance notice requirements
- [ ] Emergency leave workflow
- [ ] Required documentation check

### Integration
- [ ] File upload works
- [ ] Backup person selection loads employees
- [ ] Leave balance displays correctly
- [ ] Leave types load properly
- [ ] Status badge colors match status
- [ ] Date calculations accurate

---

## Sample Data for Backend Testing

```json
{
  "employeeId": "existing_employee_uuid",
  "leaveTypeId": "annual_leave_uuid",
  "fromDate": "2025-02-01",
  "toDate": "2025-02-05",
  "duration": "full_day",
  "reason": "Family vacation trip to home town",
  "isEmergency": false,
  "workCoverage": {
    "backupPersonId": "backup_employee_uuid",
    "handoverNotes": "All pending tasks completed. Check email for client updates.",
    "clientNotificationRequired": false
  },
  "attachments": []
}
```

---

## Notes for Backend Team

1. **Status Field:** Frontend expects exact string matches: "Approved", "Pending", "Rejected", "On Hold", "Cancelled"

2. **Date Format:** All dates should be ISO 8601: `YYYY-MM-DD`

3. **Employee Data:** Need nested employee object with:
   - `id`, `legal_firstname`, `legal_lastname`, `employee_number`
   - Optional: `position` with `name`

4. **Leave Types:** Must include:
   - `id`, `name`, `code`, `color` (hex), `isActive`
   - Configuration flags (requiresApproval, allowHalfDay, etc.)

5. **Pagination:** Use standard pagination structure with `count`, `page`, `page_size`, `total_pages`

6. **Validation API:** Should be fast (< 500ms) as it's called on every date change (with debounce)

7. **File Upload:** Should return URL immediately, not wait for storage confirmation

---

**Current Status:** ⚠️ Frontend Form Complete | ⚠️ List Page Using Mock Data | ❌ Backend Integration Incomplete

**Date:** 2025-10-02
**Frontend Location:** `/dashboard/hr/leave-management`
**Backend Endpoint:** `/api/v1/hr/leave-request/`
