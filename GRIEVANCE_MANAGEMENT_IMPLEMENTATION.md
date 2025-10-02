# Grievance Management - Frontend Implementation Documentation

## Overview
Complete frontend implementation for HR Grievance/Complaint Management module with list, create, and detail views with 4 tabs.

---

## API Endpoints Expected

### Base URL
```
/hr/grievances/complaints/
```

### Endpoints

#### 1. List/Filter Complaints (GET)
```
GET /hr/grievances/complaints/
```

**Query Parameters:**
- `page` (integer): Page number for pagination
- `size` (integer): Number of records per page
- `search` (string, optional): Search by title or description
- `status` (string, optional): Filter by resolution status

**Response Format:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "results": [
      {
        "id": "uuid",
        "whistle_blower": "Anonymous",
        "title": "Complaint",
        "type": "Complaint",
        "description": "Description of the complaint",
        "date": "2024-01-15",
        "is_resolved": false,
        "findings": "Investigation findings text",
        "resolution": "Resolution details text",
        "feedback": "Feedback from investigation",
        "created_datetime": "2024-01-15T10:00:00Z",
        "updated_datetime": "2024-01-15T14:30:00Z",
        "uploads": [
          {
            "id": "uuid",
            "complaint": "complaint_uuid",
            "name": "Document Name",
            "uploaded_file_urls": ["url1", "url2"],
            "created_datetime": "2024-01-15T10:00:00Z",
            "updated_datetime": "2024-01-15T14:30:00Z"
          }
        ]
      }
    ]
  }
}
```

**Note:** The response does NOT use the standard pagination structure. It directly returns `data.results` without a `pagination` object.

#### 2. Get Single Complaint (GET)
```
GET /hr/grievances/complaints/{id}/
```

**Response Format:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "whistle_blower": "Anonymous",
    "title": "Complaint",
    "type": "Complaint",
    "description": "Detailed description of the complaint",
    "date": "2024-01-15",
    "is_resolved": false,
    "findings": "Investigation findings",
    "resolution": "Resolution details",
    "feedback": "Feedback text",
    "created_datetime": "2024-01-15T10:00:00Z",
    "updated_datetime": "2024-01-15T14:30:00Z",
    "uploads": []
  }
}
```

#### 3. Create Complaint (POST)
```
POST /hr/grievances/complaints/
```

**Request Body (JSON):**
```json
{
  "type": "Complaint",
  "title": "Complaint",
  "description": "Detailed description of the complaint or whistleblowing report",
  "whistle_blower": "Anonymous",
  "date": "2024-01-15"
}
```

**Required Fields:**
- `type` (string - one of: "Complaint", "Whistleblowing")
- `title` (string - one of: "Complaint", "Whistleblowing")
- `description` (string)
- `whistle_blower` (string - default: "Anonymous")

**Optional Fields:**
- `date` (ISO date string YYYY-MM-DD)

**Response Format:**
```json
{
  "status": true,
  "message": "Complaint created successfully",
  "data": {
    "id": "uuid",
    "type": "Complaint",
    "title": "Complaint",
    "description": "Description text",
    "whistle_blower": "Anonymous",
    "date": "2024-01-15",
    "is_resolved": false,
    "findings": null,
    "resolution": null,
    "feedback": null,
    "created_datetime": "2024-01-15T10:00:00Z",
    "updated_datetime": "2024-01-15T10:00:00Z"
  }
}
```

**Important Notes:**
- Document upload is **NOT** supported in the create endpoint
- Documents must be uploaded separately using the document upload endpoint
- The frontend currently sends JSON (not FormData) for complaint creation

#### 4. Update Complaint (PUT)
```
PUT /hr/grievances/complaints/{id}/
```

**Request Body (JSON - ALL fields required):**
```json
{
  "type": "Complaint",
  "title": "Complaint",
  "description": "Updated description",
  "whistle_blower": "Anonymous",
  "findings": "Investigation findings text",
  "resolution": "Resolution details",
  "feedback": "Feedback text"
}
```

**Note:** This is a full update (PUT), so ALL fields must be included even if not changing.

#### 5. Partial Update Complaint (PATCH)
```
PATCH /hr/grievances/complaints/{id}/
```

**Request Body (JSON - all fields optional):**
```json
{
  "findings": "Updated investigation findings",
  "resolution": "Updated resolution",
  "feedback": "Updated feedback",
  "is_resolved": true
}
```

**Note:** PATCH allows partial updates. Only send fields that need to be changed.

#### 6. Delete Complaint (DELETE)
```
DELETE /hr/grievances/complaints/{id}/
```

**Response Format:**
```json
{
  "status": true,
  "message": "Complaint deleted successfully"
}
```

---

## Document Upload API

### Base URL
```
/hr/grievances/complaints/uploads/
```

### Endpoints

#### 1. List Documents for a Complaint (GET)
```
GET /hr/grievances/complaints/uploads/?complaint={complaint_id}
```

**Query Parameters:**
- `complaint` (string, required): The complaint UUID to filter documents
- `page` (integer, optional): Page number
- `size` (integer, optional): Number of records per page

**Response Format:**
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "complaint": "complaint_uuid",
      "name": "Document Name.pdf",
      "document": "https://s3.amazonaws.com/path/to/document.pdf",
      "created_datetime": "2024-01-15T10:00:00Z",
      "updated_datetime": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### 2. Upload Document (POST)
```
POST /hr/grievances/complaints/uploads/
```

**Request Body (FormData):**
```
name: "Document Name"
document: [File object]
complaint: "complaint_uuid"
```

**Required Fields:**
- `name` (string): Name/description of the document
- `document` (File): The actual file to upload
- `complaint` (string): UUID of the complaint this document belongs to

**Response Format:**
```json
{
  "status": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "complaint": "complaint_uuid",
    "name": "Document Name",
    "document": "https://s3.amazonaws.com/path/to/document.pdf",
    "created_datetime": "2024-01-15T10:00:00Z",
    "updated_datetime": "2024-01-15T10:00:00Z"
  }
}
```

#### 3. Delete Document (DELETE)
```
DELETE /hr/grievances/complaints/uploads/{id}/
```

**Response Format:**
```json
{
  "status": true,
  "message": "Document deleted successfully"
}
```

---

## Data Types & Validation

### Title/Type Options
Must be one of:
- `"Complaint"`
- `"Whistleblowing"`

### Boolean Fields
- `is_resolved` (true/false)

### Date Fields
All dates should be in ISO 8601 format: `YYYY-MM-DD`

### Text Fields (can be null/empty)
- `findings`
- `resolution`
- `feedback`

---

## Frontend Implementation Details

### File Structure
```
src/features/hr/
├── types/
│   └── grieviance-management.ts              # TypeScript interfaces
├── controllers/
│   ├── grievanceController.ts                # Complaint API hooks
│   └── hrGrievianceManagementDocumentController.ts  # Document API hooks
└── components/
    └── grievance-management/
        ├── index.tsx                         # List page
        ├── form/
        │   └── index.tsx                     # Create form
        └── id/
            ├── index.tsx                     # Detail page wrapper
            ├── Details.tsx                   # Tab 1: Details & Investigation
            ├── Uploads.tsx                   # Tab 2: Document uploads
            ├── Resolutions.tsx               # Tab 3: Resolution
            └── Feedback.tsx                  # Tab 4: Feedback
```

### API Hooks Used

#### Complaint Hooks

**`useGetGrievances`**
```typescript
const { data, isLoading } = useGetGrievances({
  status: "resolved",
  search: "complaint text",
  page: 1,
  size: 20,
});
```

**`useGetGrievance`**
```typescript
const { data, isLoading } = useGetGrievance(id, enabled);
```

**`useCreateGrievance`**
```typescript
const { createGrievance, isLoading, isSuccess } = useCreateGrievance();

await createGrievance({
  type: "Complaint",
  title: "Complaint",
  description: "Details",
  whistle_blower: "Anonymous",
  date: "2024-01-15"
});
```

**`useUpdateGrievance`** (PUT - full update)
```typescript
const { updateGrievance, isLoading } = useUpdateGrievance(id);

await updateGrievance({
  type: "Complaint",
  title: "Complaint",
  description: "Updated description",
  whistle_blower: "Anonymous",
  findings: "Investigation complete",
  // ... all other fields required
});
```

**`usePatchGrievance`** (PATCH - partial update)
```typescript
const { patchGrievance, isLoading } = usePatchGrievance(id);

await patchGrievance({
  findings: "Investigation findings"
  // ... only fields to update
});
```

**`useDeleteGrievance`**
```typescript
const { deleteGrievance, isLoading } = useDeleteGrievance(id);

await deleteGrievance();
```

#### Document Upload Hooks

**`useGetGrievianceManagementDocuments`**
```typescript
const { data, isLoading } = useGetGrievianceManagementDocuments({
  page: 1,
  size: 20,
  complaint: complaintId,
  enabled: true
});
```

**`useCreateGrievianceManagementDocument`**
```typescript
const { createGrievianceManagementDocument, isLoading } = useCreateGrievianceManagementDocument();

const formData = new FormData();
formData.append("name", "Document Name");
formData.append("document", file);
formData.append("complaint", complaintId);

await createGrievianceManagementDocument(formData);
```

**`useDeleteGrievianceManagementDocument`**
```typescript
const { deleteGrievianceManagementDocument, isLoading } = useDeleteGrievianceManagementDocument(documentId);

await deleteGrievianceManagementDocument();
```

---

## Features Implemented

### ✅ List Page (`/dashboard/hr/grievance-management`)
- Data table with all grievance records
- Search functionality
- Columns displayed:
  - Checkbox for bulk selection
  - Title
  - Description
  - Submit Date (formatted from created_datetime)
  - Status (badge: Resolved/Unresolved based on is_resolved)
  - Actions (View/Delete)
- Delete functionality with confirmation dialog
- Real-time data refresh after delete
- Color-coded status badges:
  - Green for Resolved
  - Red for Unresolved

### ✅ Create Page (`/dashboard/hr/grievance-management/create`)
- Form fields:
  - Title (dropdown - "Complaint" or "Whistleblowing")
  - Description (textarea - required)
  - Date (date picker - optional)
  - Document Name (text input - optional)
  - Document Upload (file input - optional)
- Form validation using Zod schema
- Loading states during submission
- Success toast notification
- Automatic redirect to list page after successful creation
- Cancel button to go back

**Current Implementation Note:**
- Documents are NOT uploaded during complaint creation
- Document upload is commented out with TODO for future implementation
- Only complaint data (type, title, description, whistle_blower, date) is sent

### ✅ Detail Page (`/dashboard/hr/grievance-management/{id}`)

#### Tab 1: Details
Displays:
- Title (complaint type)
- Description (full complaint text)
- Submission date (formatted from created_datetime)
- Status badge (Resolved/Unresolved)
- Investigation findings section with:
  - Findings text
  - "Edit" button to update findings
- Edit dialog to update findings

**Update Flow:**
- When updating findings, frontend sends ALL required fields:
  - type (from original data)
  - title (from original data)
  - description (from original data)
  - whistle_blower (from original data)
  - findings (new value)

#### Tab 2: Uploads
Displays:
- List of all uploaded documents for this complaint
- Each document shows:
  - Document icon (PDF icon or image icon based on file type)
  - Document preview (PDF first page or image thumbnail)
  - Document name
  - Last updated date
  - Delete button
- "Add" button to upload new documents
- PDF viewer in modal for full document view
- Image viewer for image documents
- Delete confirmation dialog

**Document Upload Flow:**
1. Click "Add" button
2. Fill in document name
3. Select file
4. Submit (sends FormData with name, document, complaint)
5. List refreshes automatically

#### Tab 3: Resolution
Displays:
- Resolution text
- "Edit" button to update resolution
- Edit dialog to update resolution

**Update Flow:**
- Similar to findings, sends all required fields plus resolution

#### Tab 4: Feedback
Displays:
- Feedback text
- "Write Feedback" button
- Edit dialog to update feedback

**Update Flow:**
- Similar to other updates, sends all required fields plus feedback

---

## Error Handling

All API calls include error handling:

```typescript
try {
  await createGrievance(complaintData);
  toast.success("Complaint Submitted Successfully!");
} catch (error: any) {
  console.error("Submission error:", error);
  toast.error(error?.response?.data?.message ?? error?.message ?? "Something went wrong");
}
```

---

## Routes

```typescript
HrRoutes.GRIEVANCE_MANAGEMENT = "/dashboard/hr/grievance-management"
// Create page: /dashboard/hr/grievance-management/create
// Detail page: /dashboard/hr/grievance-management/{id}/details
```

---

## Dependencies

- **React Hook Form**: Form management
- **Zod**: Form validation
- **TanStack React Query**: Data fetching and caching
- **Sonner**: Toast notifications
- **Next.js 14**: App router
- **TypeScript**: Type safety
- **react-pdf**: PDF viewing
- **moment**: Date formatting
- **date-fns**: Date utilities

---

## Testing Recommendations for Backend

### Test Cases

1. **List Endpoint:**
   - Returns results array directly under data
   - Search filters work correctly
   - Empty results handled gracefully
   - No pagination object in response

2. **Get Single Record:**
   - Returns correct record with all fields
   - Returns 404 for non-existent ID
   - Null values allowed for findings, resolution, feedback

3. **Create Endpoint:**
   - Accepts JSON (not FormData)
   - Required fields validation
   - Type/Title value validation (only "Complaint" or "Whistleblowing")
   - Date is optional
   - Does NOT accept document in create request

4. **Update Endpoint (PUT):**
   - Requires ALL fields even if not changing
   - Validates type and title values
   - Allows null for findings, resolution, feedback

5. **Patch Endpoint (PATCH):**
   - Accepts partial updates
   - Only updates provided fields
   - Can update is_resolved boolean

6. **Delete Endpoint:**
   - Successfully deletes record
   - Returns 404 for non-existent ID
   - Cascading deletes for associated documents

7. **Document Upload Endpoint:**
   - Accepts FormData with file
   - All 3 fields required: name, document, complaint
   - Returns document URL in response
   - Supports PDF and image files

8. **Document List Endpoint:**
   - Filters by complaint UUID
   - Returns array directly under data
   - Each document has full URL to file

9. **Document Delete Endpoint:**
   - Deletes document file from storage
   - Returns success message

---

## Sample Test Data

### Create Complaint
```json
{
  "type": "Complaint",
  "title": "Complaint",
  "description": "There is a serious issue with workplace harassment that needs to be addressed immediately.",
  "whistle_blower": "Anonymous",
  "date": "2024-01-15"
}
```

### Update Findings
```json
{
  "type": "Complaint",
  "title": "Complaint",
  "description": "There is a serious issue with workplace harassment that needs to be addressed immediately.",
  "whistle_blower": "Anonymous",
  "findings": "Investigation revealed multiple instances of misconduct. Three witnesses confirmed the allegations."
}
```

### Update Resolution
```json
{
  "type": "Complaint",
  "title": "Complaint",
  "description": "There is a serious issue with workplace harassment that needs to be addressed immediately.",
  "whistle_blower": "Anonymous",
  "resolution": "Disciplinary action taken against the offender. Training sessions scheduled for all staff members."
}
```

### Update Feedback
```json
{
  "type": "Complaint",
  "title": "Complaint",
  "description": "There is a serious issue with workplace harassment that needs to be addressed immediately.",
  "whistle_blower": "Anonymous",
  "feedback": "Complainant satisfied with the resolution and appreciates the prompt action taken."
}
```

### Mark as Resolved (PATCH)
```json
{
  "is_resolved": true
}
```

---

## Known Issues & TODOs

### ⚠️ Current Issues

1. **Document Upload in Create Form:**
   - Frontend form has document upload fields but they are NOT sent to backend
   - Documents must be uploaded separately after complaint creation
   - TODO comment in code indicates this needs to be implemented

2. **Response Format Inconsistency:**
   - Grievance list endpoint returns `data.results` without pagination object
   - This is different from other modules which use `data.pagination` + `data.results`
   - Frontend expects this specific format

### 🔧 Future Enhancements

1. **Implement document upload during creation:**
   - Backend needs to support multipart/form-data for create endpoint
   - Or implement two-step process: create complaint, then upload documents

2. **Add pagination to list endpoint:**
   - Current implementation doesn't use pagination
   - Should add pagination object for consistency

3. **Bulk actions:**
   - Frontend has "Bulk Actions" button but no implementation
   - Could add bulk delete, bulk mark as resolved, etc.

---

## Notes for Backend Team

1. **Response Format**: The grievance list endpoint should return `{ data: { results: [...] } }` without a pagination object (this is different from the standard format).

2. **Type/Title Field**: Both `type` and `title` fields are set to the same value ("Complaint" or "Whistleblowing"). This seems redundant but is how the frontend currently sends data.

3. **Whistle Blower**: Always sent as "Anonymous" by default from the frontend.

4. **Date Format**: All dates are sent and expected in `YYYY-MM-DD` format.

5. **Document URL**: The document field in the uploads response should be a full URL to the file that can be used directly in `<img>` tags or PDF viewers.

6. **Update Pattern**: When updating findings/resolution/feedback, the frontend always sends ALL required fields (type, title, description, whistle_blower) along with the new field value. This is because the update hook uses PUT method.

7. **Created DateTime**: Used for display as "submission date" in the list and detail views.

8. **File Types Supported**: Frontend can display PDFs and images. PDF viewer shows all pages. Images are displayed as thumbnails.

---

**Implementation Status:** ✅ Complete (except document upload in create form)
**Date:** 2025-10-02
**Frontend Location:** `/dashboard/hr/grievance-management`

---

## API Contract Summary

| Endpoint | Method | Content-Type | Request Body | Response |
|----------|--------|--------------|--------------|----------|
| `/hr/grievances/complaints/` | GET | - | Query params | `{data: {results: []}}` |
| `/hr/grievances/complaints/{id}/` | GET | - | - | `{data: {...}}` |
| `/hr/grievances/complaints/` | POST | JSON | `{type, title, description, whistle_blower, date}` | `{data: {...}}` |
| `/hr/grievances/complaints/{id}/` | PUT | JSON | All fields required | `{data: {...}}` |
| `/hr/grievances/complaints/{id}/` | PATCH | JSON | Partial fields | `{data: {...}}` |
| `/hr/grievances/complaints/{id}/` | DELETE | - | - | `{status: true}` |
| `/hr/grievances/complaints/uploads/` | GET | - | `?complaint=uuid` | `{data: [...]}` |
| `/hr/grievances/complaints/uploads/` | POST | FormData | `{name, document, complaint}` | `{data: {...}}` |
| `/hr/grievances/complaints/uploads/{id}/` | DELETE | - | - | `{status: true}` |
