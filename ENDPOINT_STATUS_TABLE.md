# API Endpoint Status Table

## Quick Visual Reference

### Legend
- ✅ **EXISTS** - Endpoint exists (returns 401 without auth)
- ❌ **NOT FOUND** - Endpoint returns 404
- 🔴 **CRITICAL** - Critical issue blocking functionality
- ⚠️ **WARNING** - May need path correction

---

## Dashboard Critical Endpoints

| Priority | Endpoint | Status | Hook | Impact |
|----------|----------|--------|------|--------|
| 🔴 CRITICAL | `auth/me/` | ❌ NOT FOUND | `useGetCurrentUser()` | Dashboard broken |
| High | `users/` | ✅ EXISTS | `useGetAllUsers()` | Works with auth |
| High | `projects/` | ✅ EXISTS | `useGetAllProjects()` | Works with auth |
| High | `programs/fund-requests/` | ✅ EXISTS | `useGetAllFundRequests()` | Works with auth |

---

## All Endpoints by Module

### Authentication & Users

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `auth/me/` | ❌ | GET | Get current user |
| `users/` | ✅ | GET | List all users |
| `users/profile/` | ✅ | GET | Get user profile |
| `users/{id}/` | ✅ | GET | Get single user |
| `users/{id}/roles/` | ✅ | POST | Add user to role |
| `users/{id}/activate/` | ✅ | POST | Activate user |
| `users/{id}/deactivate/` | ✅ | POST | Deactivate user |

**Working: 6/7 (86%)**

---

### Projects

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `projects/` | ✅ | GET | List all projects |
| `projects/partners/` | ✅ | GET | Get project partners |
| `projects/{id}/` | ✅ | GET | Get single project |
| `projects/{id}/activity_report/` | ✅ | GET | Get activity report |
| `projects/{id}/disbursements/` | ✅ | GET | Get disbursements |
| `projects/{id}/expenditures/` | ✅ | GET | Get expenditures |
| `projects/documents/` | ✅ | GET | Get project documents |

**Working: 7/7 (100%)**

---

### Programs - Fund Requests

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `programs/fund-requests/` | ✅ | GET | List fund requests |
| `programs/fund-requests/next-sequence/` | ✅ | POST | Get next sequence |
| `programs/fund-requests/{id}/` | ✅ | GET | Get single request |
| `programs/fund-requests/{id}/review/` | ✅ | POST | Review request |
| `programs/fund-requests/{id}/approve/` | ✅ | POST | Approve request |

**Working: 5/5 (100%)**

---

### Programs - Other

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `programs/stakeholders/` | ✅ | GET | List stakeholders |
| `programs/adhoc/applicants/` | ✅ | GET | List adhoc applicants |
| `programs/work-plans/` | ❌ | GET | List work plans |

**Working: 2/3 (67%)**

---

### Admin - Inventory

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `admins/inventory/stores/` | ✅ | GET | List stores |
| `admins/inventory/good-receive-notes/` | ✅ | GET | List GRNs |
| `admins/inventory/item-store-stocks/` | ✅ | GET | List stock items |
| `admins/inventory/assets/history/` | ✅ | GET | Get asset history |
| `admins/inventory/assets/` | ❌ | GET | List assets |
| `admins/inventory/consumables/` | ❌ | GET | List consumables |
| `admins/inventory/assets/maintenance/` | ❌ | GET | List maintenance |

**Working: 4/7 (57%)**

---

### Admin - Fleet Management

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `admins/fleets/fuel-consumptions/` | ✅ | GET | List fuel records |
| `admins/fleets/vehicles/maintenance/tickets/` | ✅ | GET | List maintenance tickets |

**Working: 2/2 (100%)**

---

### Admin - Facilities

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `admins/facilities/maintenance/tickets/` | ✅ | GET | List facility tickets |

**Working: 1/1 (100%)**

---

### Admin - Payments & Reports

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `admins/payments/requests/` | ✅ | GET | List payment requests |
| `admins/reports/travel-expenses/` | ✅ | GET | List travel expenses |
| `admins/authorization/expenses/` | ✅ | GET | List expense authorizations |

**Working: 3/3 (100%)**

---

### Procurement

| Endpoint | Status | Method | Purpose | Note |
|----------|--------|--------|---------|------|
| `procurement/vendors/` | ❌ | GET | List vendors | ⚠️ Try `procurements/vendors/` |
| `procurement/purchase-requests/` | ❌ | GET | List PRs | ⚠️ Try `procurements/purchase-request-memo/` |
| `procurement/purchase-orders/` | ❌ | GET | List POs | ⚠️ Try `procurements/purchase-orders/` |
| `procurement/solicitations/` | ❌ | GET | List solicitations | ⚠️ Try `procurements/solicitations/` |
| `procurement/lots/` | ❌ | GET | List lots | ⚠️ Try `procurements/lots/` |

**Working: 0/5 (0%)** - ⚠️ All likely exist under `procurements/` (plural)

**Known Working Procurement Paths:**
- `procurements/purchase-request-memo/` ✅
- `procurements/cba/` ✅

---

### HR - Human Resources

| Endpoint | Status | Method | Purpose | Note |
|----------|--------|--------|---------|------|
| `hr/employees/` | ✅ | GET | List employees | ✅ Works |
| `hr/leave-requests/` | ❌ | GET | List leave requests | ⚠️ Check nested path |
| `hr/timesheets/` | ❌ | GET | List timesheets | ⚠️ Check nested path |
| `hr/positions/` | ❌ | GET | List positions | ⚠️ Check nested path |
| `hr/grades/` | ❌ | GET | List grades | ⚠️ Check nested path |

**Working: 1/5 (20%)**

**Known Working HR Paths:**
- `hr/employees/` ✅
- `hr/employee-benefits/compensations/` ✅
- `hr/performance/competencies/` ✅
- `hr/performance/goals/` ✅
- `hr/grievances/complaints/` ✅
- `hr/employees/beneficiaries/` ✅
- `hr/employees/bank-accounts/` ✅

---

### Finance

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `finance/reports/` | ❌ | GET | List reports |
| `finance/customers/` | ❌ | GET | List customers |
| `finance/petty-cash/` | ❌ | GET | List petty cash |

**Working: 0/3 (0%)**

---

### Other Modules

| Endpoint | Status | Method | Purpose |
|----------|--------|--------|---------|
| `adhoc-requisitions/` | ✅ | GET | List adhoc requisitions |
| `notifications` | ✅ | GET | List notifications |

**Working: 2/2 (100%)**

---

## Summary Statistics

| Module | Working | Total | Success Rate |
|--------|---------|-------|--------------|
| **Authentication & Users** | 6 | 7 | 86% |
| **Projects** | 7 | 7 | 100% |
| **Programs - Fund Requests** | 5 | 5 | 100% |
| **Programs - Other** | 2 | 3 | 67% |
| **Admin - Inventory** | 4 | 7 | 57% |
| **Admin - Fleet** | 2 | 2 | 100% |
| **Admin - Facilities** | 1 | 1 | 100% |
| **Admin - Payments** | 3 | 3 | 100% |
| **Procurement** | 0* | 5 | 0%* |
| **HR** | 1* | 5 | 20%* |
| **Finance** | 0 | 3 | 0% |
| **Other** | 2 | 2 | 100% |
| **TOTAL** | **33** | **49** | **67%** |

\* *May have higher success rate with correct paths*

---

## Critical Path Issues

### 🔴 BLOCKING ISSUES (Must Fix Immediately)

| Issue | Endpoint | Impact | Priority |
|-------|----------|--------|----------|
| Dashboard broken | `auth/me/` returns 404 | Cannot load user data | 🔴 CRITICAL |

### ⚠️ PATH CORRECTION NEEDED

| Module | Wrong Path | Correct Path |
|--------|------------|--------------|
| Procurement | `procurement/` | `procurements/` (plural) |
| HR (some) | `hr/leave-requests/` | Check `hr/employee-benefits/leave-requests/` |

---

## Testing Instructions

### Test Without Auth
```bash
node test-specific-endpoints.js
```

### Test With Auth Token
```bash
node test-specific-endpoints.js YOUR_TOKEN_HERE
```

### Get Token from Browser
```javascript
localStorage.getItem('token')
```

---

## Response Codes Reference

| Code | Meaning | Action |
|------|---------|--------|
| 200 | ✅ Success | Endpoint works, data returned |
| 401 | ⚠️ Unauthorized | Endpoint exists, needs auth token |
| 404 | ❌ Not Found | Endpoint doesn't exist or wrong path |
| 500 | 🔥 Server Error | Backend error, check logs |

---

## Files Reference

| File | Purpose |
|------|---------|
| `API_ENDPOINT_ANALYSIS.md` | Detailed analysis & documentation |
| `ENDPOINT_TEST_SUMMARY.md` | Quick reference guide |
| `ENDPOINT_STATUS_TABLE.md` | This visual reference table |
| `test-api-endpoints.js` | Automated test script (comprehensive) |
| `test-specific-endpoints.js` | Targeted test script (fast) |

---

**Last Updated:** 2025-11-19
**Status:** Analysis Complete
**Next Action:** Fix critical `auth/me/` endpoint
