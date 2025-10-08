# Adhoc Management - Endpoint Summary

## Endpoint Pattern

**API Base**: `/api/v1/`

**Endpoint Structures**:
- Requisitions: `/api/v1/adhoc-requisitions/` (special case - not under programs/)
- All Others: `/api/v1/programs/adhoc-{module}/`

---

## Complete Endpoint List

### 1. Adhoc Requisitions ✅ FIXED
```
Base: adhoc-requisitions/
Full: /api/v1/adhoc-requisitions/
```

**Backend Fix**: Router was registered with empty string `r""` instead of `r"requisitions"` to make endpoints accessible directly at expected path.

**Operations**:
- ✅ GET - List all requisitions
- ✅ POST - Create requisition
- ✅ GET `{id}/` - Get single requisition
- ✅ PATCH `{id}/` - Update requisition
- ✅ DELETE `{id}/` - Delete requisition
- ✅ POST `{id}/submit/` - Submit for approval
- ✅ POST `{id}/review/` - Review (Level 1)
- ✅ POST `{id}/authorize/` - Authorize (Level 2)
- ✅ POST `{id}/approve/` - Approve (Level 3)
- ✅ POST `{id}/reject/` - Reject
- ⚠️ POST `{id}/convert_to_advertisement/` - Convert (has backend bug)

---

### 2. Adhoc Advertisements
```
Base: programs/adhoc/advertisements/
Full: /api/v1/programs/adhoc/advertisements/
```

**Operations**:
- ✅ GET - List all advertisements
- ✅ POST - Create advertisement
- ✅ GET `{id}/` - Get single advertisement
- ✅ PATCH `{id}/` - Update advertisement
- ✅ DELETE `{id}/` - Delete advertisement
- ✅ GET `active/` - Get active ads
- ✅ GET `{id}/statistics/` - Get ad statistics
- ✅ POST `{id}/publish/` - Publish ad
- ✅ POST `{id}/close/` - Close ad
- ✅ POST `{id}/reopen/` - Reopen ad
- ✅ POST `{id}/cancel/` - Cancel ad

---

### 3. Adhoc Applicants
```
Base: programs/adhoc/applicants/
Full: /api/v1/programs/adhoc/applicants/
```

**Operations**:
- ✅ GET - List all applicants
- ✅ POST - Create applicant
- ✅ GET `{id}/` - Get single applicant
- ✅ PATCH `{id}/` - Update applicant
- ✅ DELETE `{id}/` - Delete applicant
- ✅ GET `shortlisted/` - Get shortlisted applicants
- ✅ POST `shortlist/` - Shortlist applicants (bulk)
- ✅ POST `reject/` - Reject applicants (bulk)
- ✅ POST `{id}/schedule-interview/` - Schedule interview
- ✅ POST `{id}/record-interview/` - Record interview
- ✅ POST `hire/` - Hire applicant
- ✅ POST `{id}/upload-document/` - Upload document
- ✅ DELETE `{id}/documents/{documentId}/` - Delete document

**Currently Used By**:
- Contract Recipients page
- Accepted Contracts page

---

### 4. Adhoc Staff Database
```
Base: programs/adhoc-database/
Full: /api/v1/programs/adhoc-database/
```

**Operations**:
- ✅ GET - List all staff
- ✅ GET `{id}/` - Get single staff
- ✅ PATCH `{id}/` - Update staff
- ✅ DELETE `{id}/` - Delete staff
- ✅ GET `active/` - Get active staff
- ✅ GET `expiring-contracts/` - Get expiring contracts
- ✅ GET `statistics/` - Get database stats
- ✅ GET `by-project/{projectId}/` - Get staff by project
- ✅ GET `{id}/payment-history/` - Get payment history
- ✅ POST `{id}/terminate/` - Terminate contract
- ✅ POST `{id}/suspend/` - Suspend staff
- ✅ POST `{id}/reactivate/` - Reactivate staff
- ✅ POST `{id}/renew-contract/` - Renew contract
- ✅ GET `export/` - Export to Excel

---

## Frontend Controllers

All controllers are located in:

1. **Requisitions**: `src/controllers/adhocRequisitionController.ts`
2. **Advertisements**: `src/features/programs/controllers/adhocAdvertisementController.ts`
3. **Applicants**: `src/features/programs/controllers/adhocApplicantController.ts`
4. **Staff Database**: `src/features/programs/controllers/adhocDatabaseController.ts`

---

## Common Patterns

### Query Parameters (List Endpoints)
All list endpoints support:
- `page` - Page number
- `size` - Items per page
- `search` - Search term
- Various filters (status, date ranges, etc.)

### Response Format (List)
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "paginator": {
      "count": 100,
      "page": 1,
      "page_size": 20,
      "total_pages": 5,
      "next_page_number": 2,
      "previous_page_number": null
    },
    "results": [...]
  }
}
```

### Response Format (Single)
```json
{
  "status": true,
  "message": "Success",
  "data": {...}
}
```

### Error Format
```json
{
  "status": false,
  "error_code": "method_not_allowed",
  "message": "Method \"POST\" not allowed.",
  "data": null
}
```

---

## Recent Fixes

### ✅ Fixed: Requisition Endpoint (Backend Fix)
- **Issue**: 405 Method Not Allowed on POST to `/api/v1/adhoc-requisitions/`
- **Root Cause**: Backend router registered as `r"requisitions"` creating path at `/adhoc-requisitions/requisitions/`
- **Fix**: Backend changed to `r""` so endpoints are at `/api/v1/adhoc-requisitions/`
- **Status**: ✅ Working - all requisition operations now functional
- **Frontend**: Using `adhoc-requisitions/` (correct path)

### ✅ Fixed: Contract Pages Migration
- **Issue**: Using consultancy endpoints with type filtering
- **Old**: `useGetAllConsultancyApplicants` + filter by `type === "ADHOC"`
- **New**: `useGetAllAdhocApplicants` (dedicated endpoint)
- **Fixed In**:
  - Contract Recipients page
  - Accepted Contracts page
  - Table column definitions

---

## Testing Endpoints

You can test these endpoints using:

1. **Browser DevTools**: Network tab shows actual API calls
2. **Postman/Insomnia**: Test endpoints directly
3. **Backend Swagger/OpenAPI**: If available

### Example Request

```bash
# Create Adhoc Requisition
POST /api/v1/programs/adhoc-requisitions/
Content-Type: application/json
Authorization: Bearer {token}

{
  "position_title": "Data Analyst",
  "number_of_positions": 2,
  "requesting_department": "d1234",
  "priority": "HIGH",
  "justification": "...",
  "required_qualifications": "...",
  "start_date": "2025-02-01",
  "duration_months": 6,
  "proposed_salary": "5000.00"
}
```

---

## Status Legend

- ✅ Working and tested
- ⚠️ Has known issues (documented)
- 🔄 In progress
- ❌ Not working

---

Last Updated: January 2025
