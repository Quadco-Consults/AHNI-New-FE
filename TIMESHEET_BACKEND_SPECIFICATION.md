# Timesheet Backend API Specification

## Database Schema

### 1. Timesheets Table
```sql
CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES users(id),
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
    total_hours DECIMAL(5,2) DEFAULT 0,
    submitted_at TIMESTAMP,
    submitted_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    rejected_at TIMESTAMP,
    rejected_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Ensure one timesheet per employee per week
    UNIQUE(employee_id, week_start_date, week_end_date)
);
```

### 2. Timesheet Entries Table
```sql
CREATE TABLE timesheet_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timesheet_id UUID NOT NULL REFERENCES timesheets(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id),
    workplan_id UUID NOT NULL REFERENCES workplans(id),
    activity_id UUID NOT NULL REFERENCES workplan_activities(id),
    
    -- Daily hours
    monday_hours DECIMAL(4,2) DEFAULT 0,
    tuesday_hours DECIMAL(4,2) DEFAULT 0,
    wednesday_hours DECIMAL(4,2) DEFAULT 0,
    thursday_hours DECIMAL(4,2) DEFAULT 0,
    friday_hours DECIMAL(4,2) DEFAULT 0,
    saturday_hours DECIMAL(4,2) DEFAULT 0,
    sunday_hours DECIMAL(4,2) DEFAULT 0,
    
    total_hours DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Ensure one entry per project/activity per timesheet
    UNIQUE(timesheet_id, project_id, activity_id)
);
```

### 3. Workplan Activities Table (Extension)
```sql
CREATE TABLE workplan_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workplan_id UUID NOT NULL REFERENCES workplans(id),
    activity_number VARCHAR(20) NOT NULL,
    activity_name TEXT NOT NULL,
    activity_description TEXT,
    estimated_hours DECIMAL(6,2),
    status ENUM('active', 'completed', 'on_hold') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### 1. Timesheet CRUD Operations

#### GET /api/timesheets
**Get all timesheets with filtering and pagination**
```javascript
Query Parameters:
- page: number (default: 1)
- size: number (default: 20)
- employee_id: UUID (optional)
- status: enum (optional)
- week_start: date (optional)
- week_end: date (optional)
- month: number (optional)
- year: number (optional)
- department: string (optional)

Response:
{
  "count": 150,
  "next": "http://api/timesheets?page=2",
  "previous": null,
  "results": [
    {
      "id": "ts-uuid-001",
      "employee": {
        "id": "emp-uuid-001",
        "name": "Sarah Smith",
        "department": "Engineering",
        "email": "sarah@company.com"
      },
      "week_period": {
        "start_date": "2024-01-08",
        "end_date": "2024-01-14"
      },
      "status": "approved",
      "total_hours": 40.0,
      "submitted_at": "2024-01-15T09:00:00Z",
      "approved_at": "2024-01-16T14:30:00Z",
      "approved_by": {
        "id": "mgr-uuid-001", 
        "name": "John Manager"
      },
      "entries_count": 3,
      "created_at": "2024-01-08T08:00:00Z",
      "updated_at": "2024-01-16T14:30:00Z"
    }
  ]
}
```

#### GET /api/timesheets/{id}
**Get single timesheet with full details**
```javascript
Response:
{
  "id": "ts-uuid-001",
  "employee": {
    "id": "emp-uuid-001",
    "name": "Sarah Smith",
    "department": "Engineering"
  },
  "week_period": {
    "start_date": "2024-01-08",
    "end_date": "2024-01-14"
  },
  "status": "approved",
  "total_hours": 40.0,
  "entries": [
    {
      "id": "entry-uuid-001",
      "project": {
        "id": "proj-uuid-001",
        "title": "ACEBAY Platform",
        "project_id": "PROJ-001"
      },
      "workplan": {
        "id": "wp-uuid-001",
        "financial_year": "2024"
      },
      "activity": {
        "id": "act-uuid-001",
        "activity_number": "1.1",
        "activity_name": "Frontend Development"
      },
      "daily_hours": {
        "monday": 8.0,
        "tuesday": 8.0,
        "wednesday": 8.0,
        "thursday": 4.0,
        "friday": 0.0,
        "saturday": 0.0,
        "sunday": 0.0
      },
      "total_hours": 28.0
    }
  ],
  "approval_history": [
    {
      "action": "submitted",
      "performed_by": "Sarah Smith",
      "performed_at": "2024-01-15T09:00:00Z"
    },
    {
      "action": "approved",
      "performed_by": "John Manager",
      "performed_at": "2024-01-16T14:30:00Z"
    }
  ]
}
```

#### POST /api/timesheets
**Create new timesheet**
```javascript
Request Body:
{
  "employee_id": "emp-uuid-001",
  "week_start_date": "2024-01-08",
  "week_end_date": "2024-01-14",
  "entries": [
    {
      "project_id": "proj-uuid-001",
      "workplan_id": "wp-uuid-001", 
      "activity_id": "act-uuid-001",
      "daily_hours": {
        "monday": 8.0,
        "tuesday": 8.0,
        "wednesday": 8.0,
        "thursday": 4.0,
        "friday": 0.0,
        "saturday": 0.0,
        "sunday": 0.0
      }
    }
  ]
}

Response: 201 Created
{
  "id": "ts-uuid-new",
  "status": "draft",
  "total_hours": 28.0,
  "message": "Timesheet created successfully"
}
```

#### PUT /api/timesheets/{id}
**Update existing timesheet (only if draft or rejected)**
```javascript
Request Body: (same as POST)

Response: 200 OK
{
  "id": "ts-uuid-001",
  "status": "draft",
  "total_hours": 32.0,
  "message": "Timesheet updated successfully"
}
```

### 2. Timesheet Workflow Operations

#### POST /api/timesheets/{id}/submit
**Submit timesheet for approval**
```javascript
Response: 200 OK
{
  "id": "ts-uuid-001",
  "status": "submitted",
  "submitted_at": "2024-01-15T09:00:00Z",
  "message": "Timesheet submitted for approval"
}
```

#### POST /api/timesheets/{id}/approve
**Approve submitted timesheet (managers only)**
```javascript
Request Body:
{
  "approval_notes": "Good work this week"
}

Response: 200 OK
{
  "id": "ts-uuid-001", 
  "status": "approved",
  "approved_at": "2024-01-16T14:30:00Z",
  "approved_by": "mgr-uuid-001",
  "message": "Timesheet approved"
}
```

#### POST /api/timesheets/{id}/reject
**Reject submitted timesheet (managers only)**
```javascript
Request Body:
{
  "rejection_reason": "Missing documentation for overtime hours"
}

Response: 200 OK
{
  "id": "ts-uuid-001",
  "status": "rejected", 
  "rejected_at": "2024-01-16T14:30:00Z",
  "rejected_by": "mgr-uuid-001",
  "rejection_reason": "Missing documentation for overtime hours",
  "message": "Timesheet rejected"
}
```

### 3. Monthly Aggregation APIs

#### GET /api/timesheets/monthly
**Get monthly timesheet aggregations**
```javascript
Query Parameters:
- month: number (1-12)
- year: number
- employee_id: UUID (optional)
- department: string (optional)

Response:
{
  "month": 1,
  "year": 2024,
  "employees": [
    {
      "employee": {
        "id": "emp-uuid-001",
        "name": "Sarah Smith",
        "department": "Engineering"
      },
      "total_hours": 160.0,
      "projects": [
        {
          "project_name": "ACEBAY Platform",
          "total_hours": 128.0,
          "weeks": [
            {
              "week_number": 1,
              "week_start": "2024-01-01",
              "hours": 32.0,
              "status": "approved"
            },
            {
              "week_number": 2, 
              "week_start": "2024-01-08",
              "hours": 35.0,
              "status": "approved"
            }
          ]
        }
      ],
      "status_summary": {
        "approved_weeks": 2,
        "submitted_weeks": 1,
        "pending_weeks": 1,
        "rejected_weeks": 0
      }
    }
  ]
}
```

### 4. Helper/Lookup APIs

#### GET /api/projects/{project_id}/workplans
**Get workplans for a project**
```javascript
Response:
{
  "project_id": "proj-uuid-001",
  "workplans": [
    {
      "id": "wp-uuid-001",
      "financial_year": "2024",
      "status": "active",
      "activities_count": 15
    }
  ]
}
```

#### GET /api/workplans/{workplan_id}/activities
**Get activities for a workplan**
```javascript
Response:
{
  "workplan_id": "wp-uuid-001",
  "activities": [
    {
      "id": "act-uuid-001",
      "activity_number": "1.1", 
      "activity_name": "Frontend Development",
      "estimated_hours": 120.0,
      "status": "active"
    }
  ]
}
```

#### GET /api/timesheets/copy-activities/{source_timesheet_id}
**Get activities from another timesheet to copy**
```javascript
Response:
{
  "source_timesheet_id": "ts-uuid-source",
  "activities": [
    {
      "project_id": "proj-uuid-001",
      "project_name": "ACEBAY Platform",
      "workplan_id": "wp-uuid-001", 
      "activity_id": "act-uuid-001",
      "activity_name": "Frontend Development"
    }
  ]
}
```

## Business Logic & Validation

### 1. Timesheet State Machine
```
Draft -> Submitted -> Approved
  ^         |
  |         v
  +---- Rejected
```

### 2. Validation Rules
- **Hours per day**: 0-24 hours, increments of 0.5
- **Total weekly hours**: Maximum 60 hours per week
- **Unique constraint**: One timesheet per employee per week
- **Edit permissions**: Only draft and rejected timesheets can be edited
- **Approval permissions**: Only managers can approve/reject
- **Submission validation**: Must have at least one entry with hours > 0

### 3. Automatic Calculations
- **Entry total**: Sum of daily hours per entry
- **Timesheet total**: Sum of all entry totals
- **Monthly aggregations**: Calculated from weekly timesheets

### 4. Permissions
```javascript
// Role-based permissions
{
  "employee": ["create", "read_own", "update_own_draft", "submit_own"],
  "manager": ["create", "read_team", "update_own", "approve_team", "reject_team"],
  "hr": ["read_all", "export_all", "reports"],
  "admin": ["*"]
}
```

## Frontend Integration

### 1. API Client Functions
```javascript
// Timesheet service
export const timesheetService = {
  // CRUD operations
  getTimesheets: (params) => api.get('/timesheets', { params }),
  getTimesheet: (id) => api.get(`/timesheets/${id}`),
  createTimesheet: (data) => api.post('/timesheets', data),
  updateTimesheet: (id, data) => api.put(`/timesheets/${id}`, data),
  deleteTimesheet: (id) => api.delete(`/timesheets/${id}`),
  
  // Workflow operations  
  submitTimesheet: (id) => api.post(`/timesheets/${id}/submit`),
  approveTimesheet: (id, notes) => api.post(`/timesheets/${id}/approve`, { approval_notes: notes }),
  rejectTimesheet: (id, reason) => api.post(`/timesheets/${id}/reject`, { rejection_reason: reason }),
  
  // Aggregations
  getMonthlyTimesheets: (month, year, params) => api.get('/timesheets/monthly', { params: { month, year, ...params } }),
  
  // Helpers
  getProjectWorkplans: (projectId) => api.get(`/projects/${projectId}/workplans`),
  getWorkplanActivities: (workplanId) => api.get(`/workplans/${workplanId}/activities`),
  getCopyActivities: (timesheetId) => api.get(`/timesheets/copy-activities/${timesheetId}`)
};
```

### 2. React Query Hooks
```javascript
// Custom hooks for timesheet operations
export const useTimesheets = (params) => useQuery(['timesheets', params], () => timesheetService.getTimesheets(params));
export const useTimesheet = (id) => useQuery(['timesheet', id], () => timesheetService.getTimesheet(id));
export const useCreateTimesheet = () => useMutation(timesheetService.createTimesheet);
export const useUpdateTimesheet = () => useMutation(({ id, data }) => timesheetService.updateTimesheet(id, data));
export const useSubmitTimesheet = () => useMutation(timesheetService.submitTimesheet);
```

This backend specification provides a robust foundation for your timesheet system with proper data modeling, RESTful APIs, business logic validation, and frontend integration points!