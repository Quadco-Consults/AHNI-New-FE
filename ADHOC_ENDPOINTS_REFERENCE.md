# Adhoc Management - Endpoint Reference

This document provides a complete overview of all endpoints used in the Adhoc Management system.

---

## 1. Adhoc Requisition Endpoints ✅ ALL WORKING

**Base URL**: `adhoc-requisitions/`

**Controller**: `src/controllers/adhocRequisitionController.ts`

**Full API Path**: `/api/v1/adhoc-requisitions/`

**Note**: This is the only adhoc endpoint NOT under `programs/` prefix. Backend router was fixed to use `r""` instead of `r"requisitions"` to make it accessible at the correct path.

### Query Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| GET | `adhoc-requisitions/` | Get all requisitions (paginated) | `useGetAllAdhocRequisitions` |
| GET | `adhoc-requisitions/{id}/` | Get single requisition details | `useGetSingleAdhocRequisition` |
| GET | `adhoc-requisitions/my-requisitions/` | Get current user's requisitions | `useGetMyAdhocRequisitions` |
| GET | `adhoc-requisitions/pending-approvals/` | Get pending approvals for current user | `useGetPendingApprovals` |

### Mutation Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `adhoc-requisitions/` | Create new requisition | `useCreateAdhocRequisition` |
| PATCH | `adhoc-requisitions/{id}/` | Update requisition | `useUpdateAdhocRequisition` |
| DELETE | `adhoc-requisitions/{id}/` | Delete requisition | `useDeleteAdhocRequisition` |

### Action Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `adhoc-requisitions/{id}/submit/` | Submit requisition for approval | `useSubmitRequisition` |
| POST | `adhoc-requisitions/{id}/review/` | Review requisition (Level 1) | `useReviewRequisition` |
| POST | `adhoc-requisitions/{id}/authorize/` | Authorize requisition (Level 2) | `useAuthorizeRequisition` |
| POST | `adhoc-requisitions/{id}/approve/` | Approve requisition (Level 3) | `useApproveRequisition` |
| POST | `adhoc-requisitions/{id}/reject/` | Reject requisition | `useRejectRequisition` |
| POST | `adhoc-requisitions/{id}/convert_to_advertisement/` | Convert approved requisition to job ad | `useConvertToAdvertisement` |

**Fallback Behavior**:
- If `/submit/` endpoint returns 404/405, falls back to `PATCH /{id}/` with `status: "PENDING_APPROVAL"`

**Status**: ✅ All endpoints working correctly

---

## 2. Adhoc Advertisement Endpoints

**Base URL**: `programs/adhoc/advertisements/`

**Controller**: `src/features/programs/controllers/adhocAdvertisementController.ts`

### Query Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| GET | `programs/adhoc/advertisements/` | Get all advertisements (paginated) | `useGetAllAdhocAdvertisements` |
| GET | `programs/adhoc/advertisements/{id}/` | Get single advertisement details | `useGetSingleAdhocAdvertisement` |
| GET | `programs/adhoc/advertisements/active/` | Get only active/published ads | `useGetActiveAdhocAdvertisements` |
| GET | `programs/adhoc/advertisements/{id}/statistics/` | Get advertisement statistics | `useGetAdvertisementStatistics` |

### Mutation Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `programs/adhoc/advertisements/` | Create new advertisement | `useCreateAdhocAdvertisement` |
| PATCH | `programs/adhoc/advertisements/{id}/` | Update advertisement | `useUpdateAdhocAdvertisement` |
| DELETE | `programs/adhoc/advertisements/{id}/` | Delete advertisement | `useDeleteAdhocAdvertisement` |

### Action Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `programs/adhoc/advertisements/{id}/publish/` | Publish advertisement (DRAFT → PUBLISHED) | `usePublishAdvertisement` |
| POST | `programs/adhoc/advertisements/{id}/close/` | Close advertisement (stop applications) | `useCloseAdvertisement` |
| POST | `programs/adhoc/advertisements/{id}/reopen/` | Reopen closed advertisement | `useReopenAdvertisement` |
| POST | `programs/adhoc/advertisements/{id}/cancel/` | Cancel advertisement permanently | `useCancelAdvertisement` |

---

## 3. Adhoc Applicant Endpoints

**Base URL**: `programs/adhoc/applicants/`

**Controller**: `src/features/programs/controllers/adhocApplicantController.ts`

**Currently Used By**:
- ✅ Contract Recipients page
- ✅ Accepted Contracts page

### Query Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| GET | `programs/adhoc/applicants/` | Get all applicants (paginated) | `useGetAllAdhocApplicants` |
| GET | `programs/adhoc/applicants/{id}/` | Get single applicant details | `useGetSingleAdhocApplicant` |
| GET | `programs/adhoc/applicants/` (with `advertisement_id`) | Get applicants by advertisement | `useGetApplicantsByAdvertisement` |
| GET | `programs/adhoc/applicants/shortlisted/` | Get shortlisted applicants | `useGetShortlistedApplicants` |

### Mutation Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `programs/adhoc/applicants/` | Create new applicant | `useCreateAdhocApplicant` |
| PATCH | `programs/adhoc/applicants/{id}/` | Update applicant | `useUpdateAdhocApplicant` |
| DELETE | `programs/adhoc/applicants/{id}/` | Delete applicant | `useDeleteAdhocApplicant` |

### Action Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `programs/adhoc/applicants/shortlist/` | Shortlist applicants (bulk) | `useShortlistApplicants` |
| POST | `programs/adhoc/applicants/reject/` | Reject applicants (bulk) | `useRejectApplicants` |
| POST | `programs/adhoc/applicants/{id}/schedule-interview/` | Schedule interview for applicant | `useScheduleInterview` |
| POST | `programs/adhoc/applicants/{id}/record-interview/` | Record interview results | `useRecordInterview` |
| POST | `programs/adhoc/applicants/hire/` | Hire applicant (add to staff database) | `useHireApplicant` |
| POST | `programs/adhoc/applicants/{id}/upload-document/` | Upload applicant document | `useUploadApplicantDocument` |
| DELETE | `programs/adhoc/applicants/{id}/documents/{documentId}/` | Delete applicant document | `useDeleteApplicantDocument` |

**Status Workflow**:
```
SUBMITTED → SHORTLISTED → INTERVIEWED → SELECTED → HIRED
         ↘ REJECTED (at any stage)
```

---

## 4. Adhoc Staff Database Endpoints

**Base URL**: `programs/adhoc-database/`

**Controller**: `src/features/programs/controllers/adhocDatabaseController.ts`

### Query Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| GET | `programs/adhoc-database/` | Get all adhoc staff (paginated) | `useGetAllAdhocStaff` |
| GET | `programs/adhoc-database/{id}/` | Get single staff member details | `useGetSingleAdhocStaff` |
| GET | `programs/adhoc-database/active/` | Get only active staff | `useGetActiveAdhocStaff` |
| GET | `programs/adhoc-database/expiring-contracts/` | Get staff with expiring contracts | `useGetExpiringContracts` |
| GET | `programs/adhoc-database/statistics/` | Get database statistics | `useGetDatabaseStatistics` |
| GET | `programs/adhoc-database/by-project/{projectId}/` | Get staff by project | `useGetStaffByProject` |
| GET | `programs/adhoc-database/{id}/payment-history/` | Get staff payment history | `useGetStaffPaymentHistory` |

### Mutation Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| PATCH | `programs/adhoc-database/{id}/` | Update staff information | `useUpdateAdhocStaff` |
| DELETE | `programs/adhoc-database/{id}/` | Delete staff member | `useDeleteAdhocStaff` |

### Action Endpoints

| Method | Endpoint | Purpose | Hook |
|--------|----------|---------|------|
| POST | `programs/adhoc-database/{id}/terminate/` | Terminate staff contract | `useTerminateStaff` |
| POST | `programs/adhoc-database/{id}/suspend/` | Suspend staff temporarily | `useSuspendStaff` |
| POST | `programs/adhoc-database/{id}/reactivate/` | Reactivate suspended staff | `useReactivateStaff` |
| POST | `programs/adhoc-database/{id}/renew-contract/` | Renew staff contract | `useRenewContract` |
| GET | `programs/adhoc-database/export/` | Export database to Excel | `useExportDatabase` |

---

## Complete Adhoc Process Flow

### 1. Requisition Phase
```
Create Requisition → Submit → Review → Authorize → Approve → Convert to Advertisement
     ↓                 ↓         ↓          ↓          ↓              ↓
   DRAFT         PENDING    REVIEWED   AUTHORIZED  APPROVED   JOB ADVERTISEMENT
```

**Endpoints Used**:
- POST `/adhoc-requisitions/` - Create
- POST `/adhoc-requisitions/{id}/submit/` - Submit
- POST `/adhoc-requisitions/{id}/review/` - Review
- POST `/adhoc-requisitions/{id}/authorize/` - Authorize
- POST `/adhoc-requisitions/{id}/approve/` - Approve
- POST `/adhoc-requisitions/{id}/convert_to_advertisement/` - Convert

### 2. Advertisement Phase
```
Create/Convert Ad → Publish → Receive Applications → Close → Process Applicants
       ↓              ↓              ↓                 ↓            ↓
     DRAFT       PUBLISHED    APPLICANTS APPLY      CLOSED    SHORTLISTING
```

**Endpoints Used**:
- POST `programs/adhoc/advertisements/` - Create
- POST `programs/adhoc/advertisements/{id}/publish/` - Publish
- GET `programs/adhoc/advertisements/active/` - View active ads
- POST `programs/adhoc/advertisements/{id}/close/` - Close

### 3. Application & Selection Phase
```
Applications → Shortlist → Interview → Select → Hire → Add to Database
     ↓            ↓           ↓          ↓       ↓           ↓
 SUBMITTED   SHORTLISTED INTERVIEWED SELECTED  HIRED  STAFF DATABASE
```

**Endpoints Used**:
- GET `programs/adhoc/applicants/` - View applications
- POST `programs/adhoc/applicants/shortlist/` - Shortlist
- POST `programs/adhoc/applicants/{id}/schedule-interview/` - Schedule
- POST `programs/adhoc/applicants/{id}/record-interview/` - Record interview
- POST `programs/adhoc/applicants/hire/` - Hire applicant
- POST `programs/adhoc-database/` - Add to staff database

### 4. Contract Management Phase
```
Issue Contract → Applicant Accepts → Active Staff → Manage/Renew/Terminate
      ↓                ↓                   ↓              ↓
CONTRACT_ISSUED    ACCEPTED           ACTIVE         MANAGED
```

**Endpoints Used**:
- GET `programs/adhoc/applicants/?status=HIRED` - Contract Recipients
- GET `programs/adhoc/applicants/?status=ACCEPTED` - Accepted Contracts
- GET `programs/adhoc-database/active/` - Active staff
- POST `programs/adhoc-database/{id}/renew-contract/` - Renew
- POST `programs/adhoc-database/{id}/terminate/` - Terminate

---

## Data Models

### IAdhocApplicant Fields (Key Fields)
```typescript
{
  id: string;
  application_number: string;
  sur_name: string;              // ← Not "name"
  other_names: string;
  email_address: string;         // ← Not "email"
  phone_number: string;
  advertisement: {
    position_title: string;      // ← Not "position_under_contract"
  };
  status: "SUBMITTED" | "SHORTLISTED" | "INTERVIEWED" | "SELECTED" | "REJECTED" | "HIRED";
  contract_start_date?: string;
  contract_end_date?: string;
  hired_at?: string;
}
```

### Old Consultancy Fields (Deprecated for Adhoc)
```typescript
{
  name: string;                  // ✗ Don't use
  email: string;                 // ✗ Don't use
  position_under_contract: string; // ✗ Don't use
  type: "ADHOC" | "CONSULTANT";  // ✗ No longer needed
}
```

---

## Migration Status

### ✅ Migrated to Dedicated Endpoints
- Contract Recipients page
- Accepted Contracts page
- Table column definitions

### 🔄 Still Using Shared/Mixed Endpoints
- Applicant creation form (uses consultancy endpoints with type field)
- May need dedicated adhoc applicant form in future

### 📋 Available but Not Yet Integrated
- Advertisement management
- Staff database management
- Interview scheduling
- Payment tracking

---

## Testing Checklist

- [ ] Create adhoc requisition
- [ ] Submit for approval
- [ ] Review → Authorize → Approve
- [ ] Convert to advertisement
- [ ] Publish advertisement
- [ ] Create applicant
- [ ] Shortlist applicant
- [ ] Schedule interview
- [ ] Record interview results
- [ ] Hire applicant
- [ ] Issue contract
- [ ] Verify in Contract Recipients page
- [ ] Accept contract
- [ ] Verify in Accepted Contracts page
- [ ] View in Staff Database

---

## Notes

1. **No API Prefix**: Base URLs don't include `/api/v1/` - this is handled by AxiosWithToken configuration
2. **Pagination**: All list endpoints support `page` and `size` query parameters
3. **Filtering**: Most endpoints support various filter parameters (status, search, dates, etc.)
4. **Error Handling**: All controllers include proper error handling with toast notifications
5. **Query Invalidation**: Mutations properly invalidate related queries for real-time updates

---

Last Updated: January 2025
