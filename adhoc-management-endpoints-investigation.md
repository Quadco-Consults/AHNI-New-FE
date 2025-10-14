# Adhoc Management Details Page - Endpoint Investigation

**Page URL:** `http://localhost:3000/dashboard/programs/adhoc-management/2e8f6cb7-63f0-4add-a46b-61ec85668364/details`

**Advertisement ID:** `2e8f6cb7-63f0-4add-a46b-61ec85668364`

## Overview

The adhoc management details page displays information about a specific adhoc job advertisement and manages its applicants through different workflow stages. The page has been updated to support both **Consultancy** and **Adhoc** modes by detecting the route pathname.

---

## Tab 1: Job Details

### Purpose
Displays comprehensive information about the adhoc advertisement/job posting.

### API Endpoint Used
```
GET /api/v1/programs/adhoc/advertisements/2e8f6cb7-63f0-4add-a46b-61ec85668364/
```

### Hook Used
```typescript
useGetSingleAdhocAdvertisement(id, true)
```

### Component
`ConsultancyDetails.tsx` (Lines 37-40)

### Data Transformation
The adhoc advertisement data is transformed to match the consultancy structure:
- `position_title` → `title`
- `number_of_positions` → `consultants_number`
- `duration_months` → `duration`
- `start_date` → `commencement_date`
- `job_description` → `scope_of_work.description`
- `qualifications_required` → `scope_of_work.background`
- `key_responsibilities` → `scope_of_work.objectives`

### Expected Response Structure
```json
{
  "status": true,
  "message": "Advertisement retrieved successfully",
  "data": {
    "id": "2e8f6cb7-63f0-4add-a46b-61ec85668364",
    "advertisement_number": "ADV-2025-001",
    "position_title": "Health Program Officer",
    "number_of_positions": 2,
    "grade_level": "5",
    "project": { "id": "...", "title": "..." },
    "department": { "id": "...", "name": "..." },
    "location": { "id": "...", "name": "Lagos", "city": "Lagos" },
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "duration_months": 12,
    "proposed_salary": "500000",
    "currency": "NGN",
    "job_description": "...",
    "key_responsibilities": "...",
    "qualifications_required": "...",
    "skills_required": "...",
    "status": "PUBLISHED",
    "total_applicants": 10,
    "shortlisted_applicants": 3,
    "selected_applicants": 1
  }
}
```

---

## Tab 2: Submitted Applications

### Purpose
Lists all applicants who have submitted applications for this adhoc advertisement.

### API Endpoint Used
```
GET /api/v1/programs/adhoc/applicants/?page=1&size=10&advertisement_id=2e8f6cb7-63f0-4add-a46b-61ec85668364&status=SUBMITTED
```

### Hook Used
```typescript
useGetApplicantsByAdvertisement(id, {
  page: currentPage,
  size: 10,
  status: "SUBMITTED",
  enabled: isAdhoc && !!id
})
```

### Component
`ConsultancyStaffList.tsx` (Lines 32-40)

### Route Detection
```typescript
const isAdhoc = !!(pathname && pathname.includes("adhoc-management"));
```

### Field Mapping
Adhoc field names are mapped to consultancy field names:
- `other_names` → `first_name`
- `sur_name` → `last_name`
- `email_address` → `email`

### Expected Response Structure
```json
{
  "status": true,
  "message": "Applicants retrieved successfully",
  "data": {
    "paginator": {
      "count": 10,
      "page": 1,
      "page_size": 10,
      "total_pages": 1
    },
    "results": [
      {
        "id": "applicant-id-1",
        "application_number": "APP-2025-001",
        "advertisement": {
          "id": "2e8f6cb7-63f0-4add-a46b-61ec85668364",
          "advertisement_number": "ADV-2025-001",
          "position_title": "Health Program Officer"
        },
        "sur_name": "Doe",
        "other_names": "John",
        "gender": "MALE",
        "date_of_birth": "1990-01-01",
        "phone_number": "+2348012345678",
        "email_address": "john.doe@example.com",
        "qualifications": "BSc. Public Health",
        "total_experience_years": 5,
        "status": "SUBMITTED",
        "applied_at": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Actions Available
- View applicant details
- Shortlist applicants (bulk action)
- Reject applicants

---

## Tab 3: Shortlisted

### Purpose
Lists applicants who have been shortlisted from the submitted applications.

### API Endpoint Used
```
GET /api/v1/programs/adhoc/applicants/shortlisted/?page=1&size=10&advertisement_id=2e8f6cb7-63f0-4add-a46b-61ec85668364
```

### Hook Used
```typescript
useGetShortlistedApplicants({
  page: currentPage,
  size: 10,
  advertisement_id: id,
  enabled: isAdhoc && !!id
})
```

### Component
`ShortlistedApplicants.tsx` (Lines 44-49)

### Shortlisting Process
1. From "Submitted Applications" tab, select applicants
2. Click "Shortlist" action button
3. API call: `POST /api/v1/programs/adhoc/applicants/shortlist/`
   ```json
   {
     "applicant_ids": ["id1", "id2"],
     "notes": "Selected based on qualifications"
   }
   ```
4. Applicant status changes from `SUBMITTED` → `SHORTLISTED`

### Expected Response Structure
```json
{
  "status": true,
  "message": "Shortlisted applicants retrieved successfully",
  "data": {
    "paginator": {
      "count": 3,
      "page": 1,
      "page_size": 10,
      "total_pages": 1
    },
    "results": [
      {
        "id": "applicant-id-1",
        "sur_name": "Doe",
        "other_names": "John",
        "email_address": "john.doe@example.com",
        "phone_number": "+2348012345678",
        "status": "SHORTLISTED",
        "updated_at": "2025-01-16T14:20:00Z"
      }
    ]
  }
}
```

### Actions Available
- View applicant details
- Create/Schedule interview
- Move back to submitted (reject from shortlist)

---

## Tab 4: Interviewed

### Purpose
Lists applicants who have completed their interviews.

### API Endpoint Used
```
GET /api/v1/programs/adhoc/applicants/?page=1&size=20&advertisement_id=2e8f6cb7-63f0-4add-a46b-61ec85668364&status=INTERVIEWED
```

### Hook Used
```typescript
useGetApplicantsByAdvertisement(consultancyId, {
  page,
  size: 20,
  status: "INTERVIEWED",
  enabled: isAdhoc && !!consultancyId
})
```

### Component
`InterviewedApplicants.tsx` (Lines 48-56)

### Interview Process
1. From "Shortlisted" tab, click "Create Interview"
2. Schedule interview: `POST /api/v1/programs/adhoc/applicants/{id}/schedule-interview/`
   ```json
   {
     "interview_date": "2025-01-20",
     "interview_time": "10:00",
     "interview_location": "Head Office",
     "panel_members": ["user-id-1", "user-id-2"],
     "notes": "Technical interview"
   }
   ```
3. After interview, record results: `POST /api/v1/programs/adhoc/applicants/{id}/record-interview/`
   ```json
   {
     "score": 42,
     "notes": "Strong technical skills",
     "recommendation": "HIRE"
   }
   ```
4. Applicant status changes: `SHORTLISTED` → `INTERVIEWED`

### Expected Response Structure
```json
{
  "status": true,
  "message": "Applicants retrieved successfully",
  "data": {
    "paginator": {
      "count": 2,
      "page": 1,
      "page_size": 20,
      "total_pages": 1
    },
    "results": [
      {
        "id": "applicant-id-1",
        "sur_name": "Doe",
        "other_names": "John",
        "email_address": "john.doe@example.com",
        "status": "INTERVIEWED",
        "interview_scheduled_at": "2025-01-20T10:00:00Z",
        "interview_conducted_at": "2025-01-20T11:30:00Z",
        "interview_score": 42,
        "interview_notes": "Strong technical skills"
      }
    ]
  }
}
```

### Actions Available
- View applicant details
- Accept candidate (moves to Accepted tab)
- View interview scores

---

## Tab 5: Accepted Candidates

### Purpose
Lists candidates who have been accepted after interviews and are ready for hiring/contract issuance.

### API Endpoint Used
```
GET /api/v1/programs/adhoc/applicants/?page=1&size=20&advertisement_id=2e8f6cb7-63f0-4add-a46b-61ec85668364&status=SELECTED
```

### Hook Used
```typescript
useGetApplicantsByAdvertisement(consultancyId, {
  page,
  size: 20,
  status: "SELECTED",
  enabled: isAdhoc && !!consultancyId
})
```

### Component
`AcceptedApplicants.tsx` (Lines 48-56)

### Acceptance Process
1. From "Interviewed" tab, click "Accept Candidate" button
2. API call to update status (for consultancy): `PATCH /api/v1/contract-grants/consultancy/applicants/{id}/`
   ```json
   {
     "status": "ACCEPTED"
   }
   ```
3. For adhoc, the status would be `SELECTED` or `HIRED`
4. Applicant status changes: `INTERVIEWED` → `SELECTED`

### Status Filtering
The component filters for multiple statuses to handle workflow variations:
```typescript
const acceptedApplicants = mappedApplicants.filter(
  (applicant) => isAdhoc
    ? (applicant.status === "SELECTED" || applicant.status === "HIRED")
    : applicant.status === "ACCEPTED"
);
```

### Expected Response Structure
```json
{
  "status": true,
  "message": "Applicants retrieved successfully",
  "data": {
    "paginator": {
      "count": 1,
      "page": 1,
      "page_size": 20,
      "total_pages": 1
    },
    "results": [
      {
        "id": "applicant-id-1",
        "sur_name": "Doe",
        "other_names": "John",
        "email_address": "john.doe@example.com",
        "phone_number": "+2348012345678",
        "status": "SELECTED",
        "interview_score": 42,
        "selected_at": "2025-01-21T09:00:00Z",
        "selected_by": {
          "id": "user-id",
          "first_name": "Jane",
          "last_name": "Manager"
        }
      }
    ]
  }
}
```

### Actions Available
- View applicant details
- Issue Contract
- Hire applicant (moves to staff database)

### Hiring Process
To hire an accepted candidate: `POST /api/v1/programs/adhoc/applicants/hire/`
```json
{
  "applicant_id": "applicant-id-1",
  "contract_start_date": "2025-02-01",
  "contract_end_date": "2026-01-31",
  "salary": "500000",
  "currency": "NGN",
  "payment_frequency": "MONTHLY",
  "assigned_health_facility": "Lagos State Hospital",
  "assigned_lga": "Ikeja",
  "qmap_backstop": "user-id-1",
  "programs_officer": "user-id-2"
}
```

This creates a record in the Adhoc Staff Database.

---

## Applicant Status Flow

```
SUBMITTED → SHORTLISTED → INTERVIEWED → SELECTED → HIRED
              ↓              ↓             ↓
           REJECTED      REJECTED      REJECTED
```

### Status Definitions

1. **SUBMITTED** - Initial application submitted by candidate
2. **SHORTLISTED** - Candidate passed initial screening and selected for interview
3. **INTERVIEWED** - Candidate completed interview and scored
4. **SELECTED** - Candidate accepted after interview review (ready for contract)
5. **HIRED** - Candidate hired and added to staff database
6. **REJECTED** - Candidate rejected at any stage

---

## Key Implementation Details

### 1. Route-Based API Selection
All tabs detect whether they're in adhoc or consultancy mode:
```typescript
const pathname = usePathname();
const isAdhoc = !!(pathname && pathname.includes("adhoc-management"));
```

### 2. Conditional Query Enabling
React Query hooks are conditionally enabled to prevent unnecessary API calls:
```typescript
// Consultancy query - disabled in adhoc mode
const consultancyQuery = useGetAllConsultancyApplicants({
  enabled: !isAdhoc && !!consultancyId
});

// Adhoc query - only enabled in adhoc mode
const adhocQuery = useGetApplicantsByAdvertisement(consultancyId, {
  enabled: isAdhoc && !!consultancyId
});

// Use appropriate result
const { data, isFetching, error } = isAdhoc ? adhocQuery : consultancyQuery;
```

### 3. Field Name Mapping
Adhoc and consultancy have different field names, so mapping is applied:
```typescript
const mappedApplicants = data?.data?.results?.map((applicant: any) => ({
  ...applicant,
  first_name: applicant.first_name || applicant.other_names || applicant.name || 'Unknown',
  last_name: applicant.last_name || applicant.sur_name || applicant.contractor_name || '',
  email: applicant.email || applicant.email_address,
}));
```

### 4. Pagination Structure Handling
The code handles both `pagination` and `paginator` structures:
```typescript
pagination={{
  total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? 0,
  pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
  onChange: (page: number) => setCurrentPage(page)
}}
```

---

## API Base URLs

### Adhoc Endpoints
**Base:** `/api/v1/programs/adhoc/`

- Advertisements: `/programs/adhoc/advertisements/`
- Applicants: `/programs/adhoc/applicants/`
- Shortlisted: `/programs/adhoc/applicants/shortlisted/`
- Actions: `/programs/adhoc/applicants/{action}/`

### Consultancy Endpoints (for reference)
**Base:** `/api/v1/contract-grants/consultancy/`

- Consultant Management: `/contract-grants/consultancy/consultant-management/`
- Applicants: `/contract-grants/consultancy/applicants/`

---

## Common Issues and Solutions

### Issue 1: Wrong API Called
**Problem:** Consultancy API called when in adhoc mode
**Solution:** Added route detection and conditional query enabling

### Issue 2: Field Name Mismatches
**Problem:** Adhoc uses `other_names` but component expects `first_name`
**Solution:** Added field mapping layer to normalize field names

### Issue 3: Both Queries Running
**Problem:** Both consultancy and adhoc queries running simultaneously
**Solution:** Used `enabled` parameter to conditionally activate queries

### Issue 4: Pagination Structure Differences
**Problem:** Some endpoints use `pagination`, others use `paginator`
**Solution:** Handle both structures with fallback logic

---

## Testing Checklist

For URL: `http://localhost:3000/dashboard/programs/adhoc-management/2e8f6cb7-63f0-4add-a46b-61ec85668364/details`

- [ ] **Job Details Tab**
  - [ ] Advertisement details load correctly
  - [ ] Location information displays properly
  - [ ] Qualifications and responsibilities shown
  - [ ] Statistics (total_applicants, shortlisted, selected) displayed

- [ ] **Submitted Applications Tab**
  - [ ] Applicants list loads
  - [ ] Network request uses adhoc endpoint with `advertisement_id` parameter
  - [ ] No 400 errors about "consultants" parameter
  - [ ] Name fields display correctly (other_names + sur_name)
  - [ ] Email addresses display correctly
  - [ ] Shortlist action available

- [ ] **Shortlisted Tab**
  - [ ] Network request uses `/programs/adhoc/applicants/shortlisted/` endpoint
  - [ ] Shortlisted applicants display
  - [ ] "Create Interview" button available
  - [ ] No duplicate applicants from other advertisements

- [ ] **Interviewed Tab**
  - [ ] Network request uses adhoc endpoint with `status=INTERVIEWED`
  - [ ] Interview scores display
  - [ ] Interview dates shown
  - [ ] "Accept Candidate" action available

- [ ] **Accepted Candidates Tab**
  - [ ] Network request uses adhoc endpoint with `status=SELECTED`
  - [ ] Accepted candidates display
  - [ ] "Issue Contract" or "Hire" action available
  - [ ] Selection date and user shown

---

## Next Steps

1. **Test with Real Data**
   - Add test applicants to the advertisement
   - Verify each workflow stage (submit → shortlist → interview → accept → hire)

2. **Verify Action Buttons**
   - Test shortlist functionality
   - Test interview creation
   - Test acceptance flow
   - Test hiring process

3. **Check Remaining Components**
   - Verify interview scheduling page
   - Verify applicant details pages
   - Verify adhoc staff database page

4. **Review Permissions**
   - Ensure proper role-based access control
   - Verify action buttons show/hide based on permissions
