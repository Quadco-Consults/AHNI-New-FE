# Separation Management - Frontend Implementation Documentation

## Overview
Complete frontend implementation for HR Separation Management module with list, create, and detail views.

---

## API Endpoints Expected

### Base URL
```
/hr/separation-management/
```

### Endpoints

#### 1. List/Filter Separation Records (GET)
```
GET /hr/separation-management/
```

**Query Parameters:**
- `page` (integer): Page number for pagination
- `size` (integer): Number of records per page
- `search` (string, optional): Search by employee name
- `status` (string, optional): Filter by status
- `exit_method` (string, optional): Filter by exit method

**Response Format:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "pagination": {
      "count": 100,
      "page": 1,
      "page_size": 20,
      "total_pages": 5,
      "next": "url",
      "next_page_number": 2,
      "previous": null,
      "previous_page_number": null
    },
    "results": [
      {
        "id": "uuid",
        "employee": {
          "id": "uuid",
          "employee_number": "EMP001",
          "legal_firstname": "John",
          "legal_lastname": "Doe",
          "position": {
            "id": "uuid",
            "name": "Software Engineer"
          },
          "grade": "grade 10",
          "location": {
            "id": "uuid",
            "name": "Lagos",
            "state": "Lagos State"
          }
        },
        "exit_method": "Voluntary Separation",
        "project": {
          "id": "uuid",
          "project_id": "PROJ001",
          "title": "Project Alpha",
          "project_name": "Project Alpha"
        },
        "submit_date": "2024-01-15",
        "exit_date": "2024-02-15",
        "status": "Pending",
        "severance_amount": 500000.00,
        "final_pay_amount": 250000.00,
        "unused_leave_days": 10,
        "unused_leave_amount": 100000.00,
        "benefits_info": "Health insurance continued for 3 months",
        "payment_date": "2024-02-20",
        "performance_rating": "Excellent",
        "evaluation_notes": "Outstanding performance",
        "exit_feedback": "Leaving for career growth",
        "rehire_eligible": true,
        "reason_for_leaving": "Better opportunity elsewhere",
        "notice_period": 30,
        "handover_completed": true,
        "assets_returned": true,
        "clearance_status": "Completed",
        "created_at": "2024-01-10T10:00:00Z",
        "updated_at": "2024-01-15T14:30:00Z",
        "created_by": "admin_uuid"
      }
    ]
  }
}
```

#### 2. Get Single Separation Record (GET)
```
GET /hr/separation-management/{id}/
```

**Response Format:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "employee": { /* same as above */ },
    "exit_method": "Voluntary Separation",
    /* ... all fields as listed above ... */
  }
}
```

#### 3. Create Separation Record (POST)
```
POST /hr/separation-management/
```

**Request Body:**
```json
{
  "employee": "employee_uuid",
  "exit_method": "Voluntary Separation",
  "project": "project_uuid",
  "submit_date": "2024-01-15",
  "exit_date": "2024-02-15",
  "reason_for_leaving": "Better opportunity",
  "notice_period": 30
}
```

**Required Fields:**
- `employee` (UUID string)
- `exit_method` (string - one of: "Voluntary Separation", "End Of Project", "Dismissal")
- `submit_date` (ISO date string YYYY-MM-DD)
- `exit_date` (ISO date string YYYY-MM-DD)

**Optional Fields:**
- `project` (UUID string)
- `reason_for_leaving` (string)
- `notice_period` (integer - days)

**Response Format:**
```json
{
  "status": true,
  "message": "Separation record created successfully",
  "data": {
    "id": "uuid",
    "employee": "employee_uuid",
    /* ... created record with all fields ... */
  }
}
```

#### 4. Update Separation Record (PATCH)
```
PATCH /hr/separation-management/{id}/
```

**Request Body (all fields optional):**
```json
{
  "exit_method": "End Of Project",
  "project": "project_uuid",
  "submit_date": "2024-01-15",
  "exit_date": "2024-02-15",
  "status": "In Progress",
  "severance_amount": 500000.00,
  "final_pay_amount": 250000.00,
  "unused_leave_days": 10,
  "unused_leave_amount": 100000.00,
  "benefits_info": "Extended health benefits",
  "payment_date": "2024-02-20",
  "performance_rating": "Excellent",
  "evaluation_notes": "Great contributor",
  "exit_feedback": "Positive experience",
  "rehire_eligible": true,
  "reason_for_leaving": "Career advancement",
  "notice_period": 30,
  "handover_completed": true,
  "assets_returned": true,
  "clearance_status": "Completed"
}
```

#### 5. Delete Separation Record (DELETE)
```
DELETE /hr/separation-management/{id}/
```

**Response Format:**
```json
{
  "status": true,
  "message": "Separation record deleted successfully"
}
```

---

## Data Types & Validation

### Exit Method Options
Must be one of:
- `"Voluntary Separation"`
- `"End Of Project"`
- `"Dismissal"`

### Status Options
Must be one of:
- `"Pending"`
- `"In Progress"`
- `"Completed"`
- `"Cancelled"`

### Clearance Status Options
Must be one of:
- `"Pending"`
- `"In Progress"`
- `"Completed"`

### Date Fields
All dates should be in ISO 8601 format: `YYYY-MM-DD`

### Currency Fields
All amount fields are numbers (float/decimal):
- `severance_amount`
- `final_pay_amount`
- `unused_leave_amount`

### Boolean Fields
- `rehire_eligible`
- `handover_completed`
- `assets_returned`

---

## Frontend Implementation Details

### File Structure
```
src/features/hr/
├── types/
│   └── separation-management.ts          # TypeScript interfaces
├── controllers/
│   └── separationManagementController.ts # API hooks
└── components/
    └── separation-management/
        ├── index.tsx                     # List page
        ├── CreateSeparationManagement.tsx # Create form
        └── id/
            ├── index.tsx                 # Detail page wrapper
            ├── ExitSummary.tsx           # Tab 1: Exit details
            ├── Severance.tsx             # Tab 2: Severance & benefits
            └── Feedback.tsx              # Tab 3: Evaluation & feedback
```

### API Hooks Used

#### `useGetSeparationManagement`
```typescript
const { data, isLoading, refetch } = useGetSeparationManagement({
  search: "John Doe",
  status: "Pending",
  exit_method: "Voluntary Separation",
  page: 1,
  size: 20,
});
```

#### `useGetSeparationManagementById`
```typescript
const { data, isLoading } = useGetSeparationManagementById(id, enabled);
```

#### `useCreateSeparationManagement`
```typescript
const { createSeparationManagement, isLoading, isSuccess } = useCreateSeparationManagement();

await createSeparationManagement({
  employee: "uuid",
  exit_method: "Voluntary Separation",
  submit_date: "2024-01-15",
  exit_date: "2024-02-15",
  // ... other fields
});
```

#### `useUpdateSeparationManagement`
```typescript
const { updateSeparationManagement, isLoading } = useUpdateSeparationManagement(id);

await updateSeparationManagement({
  status: "Completed",
  // ... other fields to update
});
```

#### `useDeleteSeparationManagement`
```typescript
const { deleteSeparationManagement } = useDeleteSeparationManagement(id);

await deleteSeparationManagement();
```

---

## Features Implemented

### ✅ List Page (`/dashboard/hr/separation-management`)
- Paginated data table with all separation records
- Search by employee name (debounced, 500ms)
- Filter by status (dropdown)
- Columns displayed:
  - Checkbox for bulk selection
  - Employee Name
  - Position
  - Exit Method
  - Location
  - Project
  - Grade
  - Submit Date
  - Exit Date
  - Status (badge with color coding)
  - Actions (View/Delete)
- Delete functionality with confirmation dialog
- Real-time data refresh after delete

### ✅ Create Page (`/dashboard/hr/separation-management/create`)
- Form fields:
  - Employee Name (dropdown - fetches from employee onboarding API)
  - Exit Method (dropdown - 3 options)
  - Project (dropdown - optional, fetches from projects API)
  - Submit Date (date picker)
  - Exit Date (date picker)
  - Notice Period (number input - days)
  - Reason for Leaving (text input)
- Form validation
- Loading states during submission
- Success toast notification
- Automatic redirect to list page after successful creation
- Cancel button to go back

### ✅ Detail Page (`/dashboard/hr/separation-management/{id}`)

#### Tab 1: Exit Summary
Displays:
- Employee name (uppercase)
- Employee number
- Position
- Grade
- Location
- Exit method
- Project name
- Submission date
- Exit date
- Status
- Clearance status
- Handover completed (Yes/No)
- Assets returned (Yes/No)
- Notice period (in days)
- Rehire eligible (Yes/No)
- Reason for leaving

#### Tab 2: Severance & Benefits
Displays:
- Total payment (calculated: severance + final pay + unused leave)
- Payment date
- Severance amount (formatted currency)
- Final pay amount (formatted currency)
- Unused leave days
- Unused leave amount (formatted currency)
- Benefits information

#### Tab 3: Evaluation & Feedback
Displays:
- Performance rating
- Rehire eligible
- Evaluation notes
- Exit feedback
- "Write Feedback" button (for future implementation)

---

## Error Handling

All API calls include error handling:

```typescript
try {
  await createSeparationManagement(payload);
  toast.success("Separation record created successfully");
} catch (error) {
  toast.error("Failed to create separation record");
}
```

---

## Routes

```typescript
HrRoutes.SEPARATION_MANAGEMENT = "/dashboard/hr/separation-management"
HrRoutes.SEPARATION_MANAGEMENT_CREATE = "/dashboard/hr/separation-management/create"
// Detail page: /dashboard/hr/separation-management/[id]
```

---

## Dependencies

- **React Hook Form**: Form management
- **TanStack React Query**: Data fetching and caching
- **Sonner**: Toast notifications
- **Next.js 14**: App router
- **TypeScript**: Type safety

---

## Testing Recommendations for Backend

### Test Cases

1. **List Endpoint:**
   - Returns paginated results
   - Search filters work correctly
   - Status filter works correctly
   - Exit method filter works correctly
   - Empty results handled gracefully

2. **Get Single Record:**
   - Returns correct record with all nested data
   - Returns 404 for non-existent ID
   - Employee, position, location, project data properly populated

3. **Create Endpoint:**
   - Required fields validation
   - Invalid employee UUID handling
   - Invalid project UUID handling
   - Date validation (exit_date should be after submit_date)
   - Exit method value validation

4. **Update Endpoint:**
   - Partial updates work correctly
   - Invalid status values rejected
   - Currency fields accept decimal values
   - Boolean fields work correctly

5. **Delete Endpoint:**
   - Successfully deletes record
   - Returns 404 for non-existent ID
   - Cascading deletes handled if needed

---

## Sample Test Data

```json
{
  "employee": "existing_employee_uuid",
  "exit_method": "Voluntary Separation",
  "project": "existing_project_uuid",
  "submit_date": "2024-01-15",
  "exit_date": "2024-02-15",
  "status": "Pending",
  "reason_for_leaving": "Pursuing higher education",
  "notice_period": 30,
  "severance_amount": 500000.00,
  "final_pay_amount": 250000.00,
  "unused_leave_days": 10,
  "unused_leave_amount": 100000.00,
  "benefits_info": "Health insurance coverage extended for 3 months",
  "performance_rating": "Excellent",
  "evaluation_notes": "Consistently exceeded expectations",
  "exit_feedback": "Positive work environment and growth opportunities",
  "rehire_eligible": true,
  "handover_completed": true,
  "assets_returned": true,
  "clearance_status": "Completed",
  "payment_date": "2024-02-20"
}
```

---

## Notes for Backend Team

1. **Employee Data**: The frontend expects employee data to include nested `position`, `grade`, and `location` objects with their details.

2. **Project Data**: Project can have either `title` or `project_name` field. Frontend checks both.

3. **Date Format**: All dates are sent and expected in `YYYY-MM-DD` format.

4. **Currency Display**: Frontend formats currency as Nigerian Naira (₦) with 2 decimal places.

5. **Search**: The search parameter should search across employee first name and last name.

6. **Pagination**: Frontend uses standard pagination with count, total_pages, next/previous links.

7. **Status Badge Colors**:
   - Completed: Green
   - Others: Red

8. **Optional Fields**: Project, notice_period, and reason_for_leaving are optional during creation.

---

## Backend Implementation Status

### ✅ BACKEND COMPLETE - Ready for Testing

The backend has been fully implemented and matches all frontend requirements:

#### Model Changes (`modules/hr/models/workforce/separation.py`)
- ✅ Added all required fields (project, severance_amount, final_pay_amount, etc.)
- ✅ Field aliases for frontend compatibility (exit_method → separation_type, etc.)
- ✅ Proper choice values ("Voluntary Separation", "End Of Project", "Dismissal")
- ✅ Status choices ("Pending", "In Progress", "Completed", "Cancelled")
- ✅ Computed `total_payment` property

#### Serializers (`modules/hr/serializers/workforce/separation.py`)
- ✅ Request serializer with frontend field names
- ✅ Response serializer with nested employee and project data
- ✅ Date validation (exit_date must be after submit_date)
- ✅ All field mappings configured

#### ViewSet (`modules/hr/endpoints/workforce/separation.py`)
- ✅ Full CRUD operations
- ✅ Search by employee name
- ✅ Filter by status and exit_method
- ✅ Optimized querysets with select_related
- ✅ Proper pagination

#### URL Configuration (`modules/hr/urls.py`)
- ✅ Endpoint: `/hr/separation-management/`

#### Migrations
- ✅ Migration 0019: Initial models
- ✅ Migration 0020: All new fields added

### Testing Checklist

- [ ] Create separation record
- [ ] List all separation records
- [ ] Search by employee name
- [ ] Filter by status
- [ ] Filter by exit_method
- [ ] Get single separation record with nested data
- [ ] Update separation record (partial update)
- [ ] Delete separation record
- [ ] Verify date validation
- [ ] Verify total_payment calculation
- [ ] Verify pagination works correctly

---

**Implementation Status:** ✅ Frontend Complete | ✅ Backend Complete
**Date:** 2025-10-02
**Frontend Location:** `/dashboard/hr/separation-management`
**Backend Endpoint:** `/api/v1/hr/separation-management/`
