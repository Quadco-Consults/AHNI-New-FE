# Timesheet Management - Implementation Documentation

## Current Implementation Status

### ⚠️ Frontend: Using Mock Data (No API Integration Yet)
### ❌ Backend: Not Connected

---

## Overview

The timesheet management system allows employees to track their work hours across different projects and activities on a weekly or monthly basis. The frontend UI is complete but currently uses mock data and needs to be connected to a backend API.

---

## Current Frontend Implementation

### File Structure
```
src/features/hr/
├── types/
│   └── timesheet.ts                          # TypeScript interfaces
├── utils/
│   ├── timesheetIdGenerator.ts               # ID generation utility
│   ├── timesheetValidation.ts                # Validation logic
│   └── timesheetPermissions.ts               # Permission checks
└── components/
    └── timesheet-management/
        ├── index.tsx                         # List page (Weekly/Monthly views)
        ├── CreateTimesheet.tsx               # Create timesheet form
        ├── components/
        │   ├── ValidatedHourInput.tsx        # Hour input with validation
        │   └── ValidationAlert.tsx           # Validation alerts
        ├── reports/
        │   └── TimesheetReports.tsx          # Timesheet reports
        └── id/
            ├── index.tsx                     # Detail/Edit page
            ├── edit.tsx                      # Edit component
            └── CopyAcitivitiesModal.tsx      # Copy activities modal
```

### Current Data Flow (Mock Data)

**List Page:**
```typescript
const [timesheets] = useState<TimesheetSummary[]>(mockTimesheetData);
const [monthlyTimesheets] = useState<MonthlyTimesheetSummary[]>(mockMonthlyData);
```

**Detail Page:**
```typescript
const [timesheetData, setTimesheetData] = useState<TTimesheetDetail[]>([initialRow]);
// Local state management only
```

**Create Page:**
```typescript
// Generates local timesheet ID
const timesheetId = await getNextAvailableTimesheetId();
// Simulates API call with setTimeout
await new Promise(resolve => setTimeout(resolve, 1500));
```

---

## Data Models (Current Frontend Types)

### TimesheetSummary (List View)
```typescript
export type TimesheetSummary = {
  id: string;
  employee: {
    id: string;
    name: string;
    department: string;
  };
  weekPeriod: {
    startDate: string;  // ISO date string
    endDate: string;    // ISO date string
  };
  projects: {
    projectName: string;
    totalHours: number;
    activities: {
      activityName: string;
      hours: number;
    }[];
  }[];
  totalHours: number;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
};
```

### TimesheetDetail (Detail/Edit View)
```typescript
type TTimesheetDetail = {
  projectId: string;
  workplanId: string;
  name: string;           // Project name
  activity: string;       // Activity name
  activityId: string;
  mon: string;            // Hours for Monday
  tue: string;            // Hours for Tuesday
  wed: string;            // Hours for Wednesday
  thu: string;            // Hours for Thursday
  fri: string;            // Hours for Friday
  sat: string;            // Hours for Saturday
  sun: string;            // Hours for Sunday
  total: string;          // Total hours (auto-calculated)
};
```

---

## Features Implemented (Frontend Only)

### ✅ List Page (`/dashboard/hr/timesheet-management`)
- **Two View Modes:**
  - Weekly View: Shows timesheets by week
  - Monthly View: Shows timesheets aggregated by month
- **Month Navigation** (monthly view):
  - Previous/Next month buttons
  - Current month display
- **Search** (UI only - not functional)
- **Filter** (UI only - not functional)
- **Create Button** - Routes to create page
- **Columns Displayed:**
  - Employee Name
  - Department
  - Week Period / Month
  - Projects worked on
  - Total Hours
  - Status (badge with color coding)
  - Actions (View/Edit/Delete)

**Status Color Coding:**
- Draft: Gray
- Submitted: Blue
- Approved: Green
- Rejected: Red

### ✅ Create Page (`/dashboard/hr/timesheet-management/create`)
- **Form Fields:**
  - Project Name (text input)
  - Activity Name (dropdown - empty)
  - Type of Activity (dropdown - empty)
  - Applicable Employees (radio: All/Selected)
  - Employee Selection (checkboxes - commented out)
  - Date Type (radio: Range/Week)
  - Start Date (auto-set to start of current week)
  - End Date (auto-set to end of current week)
- **ID Generation:**
  - Auto-generates unique timesheet ID
  - Format: TS-YYYYMM-XXXX (e.g., TS-202501-0001)
- **Navigation:**
  - Redirects to detail page after "creation"
  - Cancel button returns to list

### ✅ Detail/Edit Page (`/dashboard/hr/timesheet-management/{id}`)
- **Spreadsheet-Style Interface:**
  - Columns: Project, Workplan, Activity, Mon-Sun, Total
  - Rows can be added/removed/copied
  - Hours auto-calculate total
- **Project Integration:**
  - Project dropdown (uses real project API)
  - Workplan dropdown (uses real workplan API)
  - Activity dropdown (fetches from selected workplan)
- **Actions:**
  - Add Row
  - Remove Row
  - Copy Row
  - Copy Activities from Another Timesheet
  - Reset (clear all data)
  - Cancel (revert changes)
  - Save (to local state only)
  - Submit (not implemented)

### ✅ Validation Features
- **Hour Input Validation:**
  - Validates hour format (accepts decimal or HH:MM)
  - Max 24 hours per day
  - Max 168 hours per week (configurable)
  - Shows validation alerts
- **Permissions Check:**
  - Can edit based on status and user role
  - Can submit based on completion
  - Can approve based on manager role

---

## What Needs to Be Implemented for Backend Integration

### 1. Create API Controller (`timesheetController.ts`)

This file needs to be created in `/src/features/hr/controllers/`

```typescript
// src/features/hr/controllers/timesheetController.ts

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

const BASE_URL = "/hr/timesheets/";

// Response types (to be defined based on backend)
interface TimesheetResponse {
  status: boolean;
  message: string;
  data: {
    pagination?: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
    };
    results: any[];
  };
}

// Get all timesheets (with filters)
export const useGetTimesheets = ({
  page = 1,
  size = 20,
  employee_id,
  status,
  start_date,
  end_date,
  view_type = "weekly", // "weekly" or "monthly"
  enabled = true,
}: {
  page?: number;
  size?: number;
  employee_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  view_type?: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["timesheets", page, size, employee_id, status, start_date, end_date, view_type],
    queryFn: async () => {
      const response = await AxiosWithToken.get(BASE_URL, {
        params: {
          page,
          size,
          ...(employee_id && { employee_id }),
          ...(status && { status }),
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
          view_type,
        },
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get single timesheet by ID
export const useGetTimesheetById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["timesheet", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create timesheet
export const useCreateTimesheet = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: BASE_URL,
    queryKey: ["timesheets"],
    isAuth: true,
    method: "POST",
  });

  const createTimesheet = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Timesheet create error:", error);
      throw error;
    }
  };

  return { createTimesheet, data, isLoading, isSuccess, error };
};

// Update timesheet
export const useUpdateTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateTimesheet = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Timesheet update error:", error);
      throw error;
    }
  };

  return { updateTimesheet, data, isLoading, isSuccess, error };
};

// Submit timesheet for approval
export const useSubmitTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "POST",
  });

  const submitTimesheet = async () => {
    try {
      await callApi({});
    } catch (error) {
      console.error("Timesheet submit error:", error);
      throw error;
    }
  };

  return { submitTimesheet, data, isLoading, isSuccess, error };
};

// Approve timesheet
export const useApproveTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "POST",
  });

  const approveTimesheet = async () => {
    try {
      await callApi({});
    } catch (error) {
      console.error("Timesheet approve error:", error);
      throw error;
    }
  };

  return { approveTimesheet, data, isLoading, isSuccess, error };
};

// Reject timesheet
export const useRejectTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "POST",
  });

  const rejectTimesheet = async (reason: string) => {
    try {
      await callApi({ reason });
    } catch (error) {
      console.error("Timesheet reject error:", error);
      throw error;
    }
  };

  return { rejectTimesheet, data, isLoading, isSuccess, error };
};

// Delete timesheet
export const useDeleteTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["timesheets"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteTimesheet = async () => {
    try {
      await callApi({});
    } catch (error) {
      console.error("Timesheet delete error:", error);
      throw error;
    }
  };

  return { deleteTimesheet, data, isLoading, isSuccess, error };
};
```

### 2. Update List Page to Use API

Replace mock data with API calls:

```typescript
// src/features/hr/components/timesheet-management/index.tsx

import { useGetTimesheets } from "@/features/hr/controllers/timesheetController";

const TimesheetManagement = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState("weekly");
  const [searchQuery, setSearchQuery] = useState("");

  // Get timesheets from API
  const { data: timesheetsData, isLoading } = useGetTimesheets({
    page: 1,
    size: 20,
    view_type: activeTab,
    start_date: activeTab === "monthly" ? format(startOfMonth(currentMonth), 'yyyy-MM-dd') : undefined,
    end_date: activeTab === "monthly" ? format(endOfMonth(currentMonth), 'yyyy-MM-dd') : undefined,
  });

  const timesheets = timesheetsData?.data?.results || [];

  // Rest of component...
};
```

### 3. Update Detail Page to Use API

```typescript
// src/features/hr/components/timesheet-management/id/index.tsx

import { useGetTimesheetById, useUpdateTimesheet } from "@/features/hr/controllers/timesheetController";

const TimesheetManagementFull = () => {
  const { id } = useParams();
  const { data: timesheetData, isLoading } = useGetTimesheetById(id as string);
  const { updateTimesheet, isLoading: isSaving } = useUpdateTimesheet(id as string);

  const handleSubmit = async () => {
    try {
      await updateTimesheet(timesheetData);
      toast.success("Timesheet saved successfully");
    } catch (error) {
      toast.error("Failed to save timesheet");
    }
  };

  // Rest of component...
};
```

---

## Proposed Backend API Structure

### Base URL
```
/hr/timesheets/
```

### Endpoints Needed

#### 1. List Timesheets (GET)
```
GET /hr/timesheets/
```

**Query Parameters:**
- `page` (integer): Page number
- `size` (integer): Records per page
- `employee_id` (UUID, optional): Filter by employee
- `status` (string, optional): Filter by status (draft, submitted, approved, rejected)
- `start_date` (date, optional): Filter by start date
- `end_date` (date, optional): Filter by end date
- `view_type` (string, optional): "weekly" or "monthly"

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "pagination": {
      "count": 50,
      "page": 1,
      "page_size": 20,
      "total_pages": 3
    },
    "results": [
      {
        "id": "uuid",
        "employee": {
          "id": "uuid",
          "name": "John Doe",
          "department": "Engineering"
        },
        "week_period": {
          "start_date": "2024-01-15",
          "end_date": "2024-01-21"
        },
        "entries": [
          {
            "project_id": "uuid",
            "project_name": "Project Alpha",
            "workplan_id": "uuid",
            "activity_id": "uuid",
            "activity_name": "Development",
            "hours": {
              "monday": 8.0,
              "tuesday": 7.5,
              "wednesday": 8.0,
              "thursday": 6.0,
              "friday": 8.0,
              "saturday": 0.0,
              "sunday": 0.0
            },
            "total_hours": 37.5
          }
        ],
        "total_hours": 37.5,
        "status": "submitted",
        "submitted_date": "2024-01-22T10:00:00Z",
        "approved_by": null,
        "approved_date": null,
        "rejection_reason": null,
        "created_at": "2024-01-15T08:00:00Z",
        "updated_at": "2024-01-22T10:00:00Z"
      }
    ]
  }
}
```

#### 2. Get Single Timesheet (GET)
```
GET /hr/timesheets/{id}/
```

**Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "employee": {
      "id": "uuid",
      "name": "John Doe",
      "department": "Engineering"
    },
    "week_period": {
      "start_date": "2024-01-15",
      "end_date": "2024-01-21"
    },
    "entries": [
      {
        "id": "entry_uuid",
        "project_id": "uuid",
        "project_name": "Project Alpha",
        "workplan_id": "uuid",
        "activity_id": "uuid",
        "activity_name": "Development",
        "hours": {
          "monday": 8.0,
          "tuesday": 7.5,
          "wednesday": 8.0,
          "thursday": 6.0,
          "friday": 8.0,
          "saturday": 0.0,
          "sunday": 0.0
        },
        "total_hours": 37.5
      }
    ],
    "total_hours": 37.5,
    "status": "draft",
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-01-22T10:00:00Z"
  }
}
```

#### 3. Create Timesheet (POST)
```
POST /hr/timesheets/
```

**Request Body:**
```json
{
  "employee_id": "uuid",
  "week_start_date": "2024-01-15",
  "week_end_date": "2024-01-21",
  "entries": [
    {
      "project_id": "uuid",
      "workplan_id": "uuid",
      "activity_id": "uuid",
      "hours": {
        "monday": 8.0,
        "tuesday": 7.5,
        "wednesday": 8.0,
        "thursday": 6.0,
        "friday": 8.0,
        "saturday": 0.0,
        "sunday": 0.0
      }
    }
  ]
}
```

#### 4. Update Timesheet (PATCH)
```
PATCH /hr/timesheets/{id}/
```

**Request Body (partial update):**
```json
{
  "entries": [
    {
      "id": "entry_uuid",
      "hours": {
        "monday": 8.5,
        "tuesday": 8.0
      }
    }
  ]
}
```

#### 5. Submit Timesheet (POST)
```
POST /hr/timesheets/{id}/submit/
```

**Response:**
```json
{
  "status": true,
  "message": "Timesheet submitted for approval",
  "data": {
    "id": "uuid",
    "status": "submitted",
    "submitted_date": "2024-01-22T10:00:00Z"
  }
}
```

#### 6. Approve Timesheet (POST)
```
POST /hr/timesheets/{id}/approve/
```

**Request Body:**
```json
{
  "approved_by": "manager_uuid"
}
```

#### 7. Reject Timesheet (POST)
```
POST /hr/timesheets/{id}/reject/
```

**Request Body:**
```json
{
  "rejection_reason": "Hours exceed project budget"
}
```

#### 8. Delete Timesheet (DELETE)
```
DELETE /hr/timesheets/{id}/
```

---

## Data Validation Rules

### Hours Validation
- Each day cannot exceed 24 hours
- Weekly total cannot exceed 168 hours (configurable)
- Hours must be in valid format: decimal (8.5) or time (8:30)
- Minimum increment: 0.25 hours (15 minutes)

### Status Workflow
```
draft → submitted → approved
              ↓
           rejected → draft
```

**Rules:**
- Only drafts can be edited
- Only submitted timesheets can be approved/rejected
- Rejected timesheets return to draft status
- Approved timesheets cannot be edited

### Permissions
- **Employee**: Can create, edit (draft only), submit, delete (draft only)
- **Manager**: Can view all, approve, reject
- **Admin**: Can do everything

---

## Next Steps for Backend Integration

### High Priority
1. ✅ Create `timesheetController.ts` with all API hooks
2. ✅ Update list page to use `useGetTimesheets`
3. ✅ Update detail page to use `useGetTimesheetById` and `useUpdateTimesheet`
4. ✅ Implement submit/approve/reject actions
5. ✅ Add toast notifications for success/error

### Medium Priority
6. ✅ Implement search functionality
7. ✅ Implement status filtering
8. ✅ Add date range filtering
9. ✅ Implement delete with confirmation

### Low Priority
10. ✅ Add validation error display from backend
11. ✅ Implement copy activities from another timesheet
12. ✅ Add timesheet reports
13. ✅ Implement bulk operations

---

## Testing Checklist

### Basic Operations
- [ ] Create new timesheet
- [ ] View timesheet list (weekly)
- [ ] View timesheet list (monthly)
- [ ] Edit timesheet
- [ ] Save timesheet
- [ ] Submit timesheet for approval
- [ ] Approve timesheet (manager)
- [ ] Reject timesheet (manager)
- [ ] Delete timesheet

### Validation
- [ ] Hour input validation (max 24/day)
- [ ] Weekly hour limit validation
- [ ] Status workflow validation
- [ ] Permission checks work correctly

### Data Integrity
- [ ] Total hours calculate correctly
- [ ] Project/workplan/activity relationships work
- [ ] Date ranges are correct
- [ ] Status updates persist correctly

---

**Current Status:** ⚠️ Frontend UI Complete - Backend Integration Needed
**Date:** 2025-10-02
**Frontend Location:** `/dashboard/hr/timesheet-management`
**Proposed Backend Endpoint:** `/api/v1/hr/timesheets/`
