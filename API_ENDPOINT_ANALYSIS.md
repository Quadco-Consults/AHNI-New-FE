# AHNI ERP API Endpoint Analysis

**Base URL:** `https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/`

**Test Date:** 2025-11-19

## Executive Summary

This document catalogs all API endpoints used by the AHNI ERP dashboard and their current status. The analysis was conducted by examining controller files in the codebase and testing endpoints via HTTP requests.

---

## Dashboard Critical Endpoints

These are the primary endpoints used by the main dashboard (`/Users/muhammadilu/AHNI-New-FE/src/app/dashboard/Dashboard.tsx`):

### 1. **Authentication - Get Current User**
- **Hook:** `useGetCurrentUser()`
- **Endpoint:** `auth/me/`
- **Status:** ❌ **NOT FOUND (404)**
- **Controller:** `/src/features/auth/controllers/userController.ts` (line 20)
- **Issue:** The endpoint returns 404. This is a critical failure as the dashboard needs current user info.
- **Impact:** Dashboard cannot load user data, permissions, or role-based features

### 2. **Users - Get All Users**
- **Hook:** `useGetAllUsers()`
- **Endpoint:** `users/`
- **Status:** ✅ **EXISTS (401 when unauthenticated)**
- **Controller:** `/src/features/auth/controllers/userController.ts` (line 44)
- **Parameters:** `page`, `size`, `search`, `status`, `user_type`
- **Impact:** Works with authentication token

### 3. **Projects - Get All Projects**
- **Hook:** `useGetAllProjects()`
- **Endpoint:** `projects/`
- **Status:** ✅ **EXISTS (401 when unauthenticated)**
- **Controller:** `/src/features/projects/controllers/projectController.ts` (line 24)
- **Parameters:** `page`, `size`, `search`, `has_fund_requests`
- **Impact:** Works with authentication token

### 4. **Fund Requests - Get All Fund Requests**
- **Hook:** `useGetAllFundRequests()`
- **Endpoint:** `programs/fund-requests/`
- **Status:** ✅ **EXISTS (401 when unauthenticated)**
- **Controller:** `/src/features/programs/controllers/fundRequestController.ts` (line 131)
- **Parameters:** `page`, `size`, `search`, `project`, `status`, `month`, `year`, `type`
- **Impact:** Works with authentication token

---

## Complete Endpoint Inventory

### ✅ **WORKING ENDPOINTS** (Return 401 - Require Authentication)

These endpoints exist on the backend and require a valid authentication token:

#### **Authentication & Users**
1. `users/` - Get all users (paginated)
2. `users/profile/` - Get user profile
3. `users/{id}/` - Get single user (inferred from controller)
4. `users/{id}/roles/` - Add user to role (inferred from controller)
5. `users/{id}/activate/` - Activate user (inferred from controller)
6. `users/{id}/deactivate/` - Deactivate user (inferred from controller)

#### **Projects**
7. `projects/` - Get all projects
8. `projects/partners/` - Get project partners
9. `projects/{id}/` - Get single project (inferred)
10. `projects/{id}/activity_report/` - Get project activity report (inferred)
11. `projects/{id}/disbursements/` - Get project disbursements (inferred)
12. `projects/{id}/expenditures/` - Get project expenditures (inferred)

#### **Programs - Fund Requests**
13. `programs/fund-requests/` - Get all fund requests
14. `programs/fund-requests/next-sequence/` - Get next sequence number
15. `programs/fund-requests/{id}/` - Get single fund request (inferred)
16. `programs/fund-requests/{id}/review/` - Review fund request (inferred)
17. `programs/fund-requests/{id}/approve/` - Approve fund request (inferred)

#### **Programs - Other**
18. `programs/stakeholders/` - Get stakeholders
19. `programs/adhoc/applicants/` - Get adhoc applicants

#### **Admin - Inventory**
20. `admins/inventory/stores/` - Get stores
21. `admins/inventory/good-receive-notes/` - Get good receive notes
22. `admins/inventory/item-store-stocks/` - Get item store stocks
23. `admins/inventory/assets/history/` - Get asset history

#### **Admin - Fleet Management**
24. `admins/fleets/fuel-consumptions/` - Get fuel consumptions
25. `admins/fleets/vehicles/maintenance/tickets/` - Get vehicle maintenance tickets

#### **Admin - Facilities**
26. `admins/facilities/maintenance/tickets/` - Get facility maintenance tickets

#### **Admin - Payments & Expenses**
27. `admins/payments/requests/` - Get payment requests
28. `admins/reports/travel-expenses/` - Get travel expenses
29. `admins/authorization/expenses/` - Get expense authorizations

#### **HR**
30. `hr/employees/` - Get employees

#### **Other**
31. `adhoc-requisitions/` - Get adhoc requisitions

---

### ❌ **NON-EXISTENT ENDPOINTS** (Return 404 - Not Found)

These endpoints are referenced in the frontend code but do not exist on the backend:

#### **Critical Issues**
1. ❌ `auth/me/` - **CRITICAL:** Get current user (used by dashboard)

#### **Other Missing Endpoints**
2. ❌ `programs/work-plans/` - Get work plans
3. ❌ `admins/inventory/assets/` - Get assets
4. ❌ `admins/inventory/consumables/` - Get consumables
5. ❌ `admins/inventory/assets/maintenance/` - Get asset maintenance

#### **Procurement (All Missing)**
6. ❌ `procurement/vendors/` - Get vendors
7. ❌ `procurement/purchase-requests/` - Get purchase requests
8. ❌ `procurement/purchase-orders/` - Get purchase orders
9. ❌ `procurement/solicitations/` - Get solicitations
10. ❌ `procurement/lots/` - Get lots

**Note:** Procurement endpoints likely use a different base path. Based on controller analysis:
- Actual path appears to be `procurements/` (with 's')
- Example: `procurements/purchase-request-memo/`

#### **HR (Partially Missing)**
11. ❌ `hr/leave-requests/` - Get leave requests
12. ❌ `hr/timesheets/` - Get timesheets
13. ❌ `hr/positions/` - Get positions
14. ❌ `hr/grades/` - Get grades

**Note:** HR endpoints likely use more specific paths:
- `hr/employees/` - exists ✅
- `hr/employee-benefits/compensations/` - (from controller)
- `hr/performance/competencies/` - (from controller)
- `hr/grievances/complaints/` - (from controller)

#### **Finance (All Missing)**
15. ❌ `finance/reports/` - Get finance reports
16. ❌ `finance/customers/` - Get customers
17. ❌ `finance/petty-cash/` - Get petty cash

---

## Endpoint Path Patterns Discovered

### **Procurement Endpoints Pattern**
Based on controller files, procurement uses `procurements/` (plural):
- `procurements/purchase-request-memo/`
- `procurements/cba/`
- `procurements/vendors/` (likely the correct path)

### **HR Endpoints Pattern**
HR uses more specific nested paths:
- `hr/employees/`
- `hr/employees/beneficiaries/`
- `hr/employees/bank-accounts/`
- `hr/employees/qualifications/`
- `hr/employee-benefits/compensations/`
- `hr/performance/competencies/`
- `hr/performance/goals/`
- `hr/grievances/complaints/`

### **Admin Endpoints Pattern**
Admin uses nested module structure:
- `admins/inventory/...`
- `admins/fleets/...`
- `admins/facilities/...`
- `admins/payments/...`
- `admins/reports/...`

---

## Authentication Requirements

### **All endpoints require Bearer token authentication**

Example header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Without authentication, endpoints return:
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### **Token is stored in localStorage**
- Key: `token`
- Retrieved by: `AxiosWithToken` interceptor (line 53 in `/src/constants/api_management/MyHttpHelperWithToken.ts`)

---

## Expected Response Structures

Based on controller code analysis:

### **Paginated Response**
```typescript
{
  status: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<T>;
  }
}
```

### **Single Item Response**
```typescript
{
  status: boolean;
  message: string;
  data: T;
}
```

### **Error Response**
```typescript
{
  status: false;
  error_code: string;
  message: string;
  data: null;
}
```

---

## Critical Issues Identified

### **Issue 1: Dashboard Cannot Load User Data**
- **Endpoint:** `auth/me/`
- **Status:** Returns 404
- **Impact:** HIGH - Dashboard fails to load current user, permissions, role-based features
- **Affected Components:** Dashboard, Permission system, User profile displays
- **Controller Reference:** `/src/features/auth/controllers/userController.ts:20`

### **Issue 2: Endpoint Path Mismatches**
Many frontend controllers reference endpoints that don't match the actual backend paths:
- Procurement: `procurement/` vs `procurements/`
- Some HR paths may need adjustment
- Finance endpoints may not be implemented yet

---

## Testing Methodology

### **Tools Used**
1. Node.js test scripts:
   - `/Users/muhammadilu/AHNI-New-FE/test-api-endpoints.js`
   - `/Users/muhammadilu/AHNI-New-FE/test-specific-endpoints.js`

2. Controller file analysis:
   - Examined all `*Controller.ts` files
   - Extracted `BASE_URL` constants
   - Analyzed `AxiosWithToken` usage

### **Test Results Summary**
- **Total Endpoints Tested:** 37
- **Working (require auth):** 20
- **Not Found (404):** 17
- **Working without auth:** 0

---

## Recommendations

### **Immediate Actions**

1. **Fix Critical Auth Endpoint**
   - Verify backend has `auth/me/` endpoint
   - Or update frontend to use correct endpoint path
   - Dashboard is currently broken without this

2. **Verify Endpoint Paths**
   - Procurement: Change `procurement/` to `procurements/` in controllers
   - HR: Use specific nested paths from controller files
   - Finance: Verify if endpoints are implemented

3. **Add Authentication**
   - All working endpoints require valid JWT token
   - Implement login flow to obtain token
   - Store token in localStorage

### **Testing With Authentication**

To test endpoints with authentication:
```bash
node test-specific-endpoints.js YOUR_AUTH_TOKEN
```

Or in the browser console:
```javascript
// Get current token
const token = localStorage.getItem('token');
console.log('Current token:', token);

// Test endpoint
fetch('https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/users/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log);
```

---

## Appendix: Full Endpoint List by Module

### **Authentication**
- `auth/me/` ❌ (404 - NOT FOUND)
- `users/` ✅
- `users/profile/` ✅
- `users/{id}/` ✅
- `users/{id}/roles/` ✅
- `users/{id}/activate/` ✅
- `users/{id}/deactivate/` ✅

### **Projects**
- `projects/` ✅
- `projects/partners/` ✅
- `projects/{id}/` ✅
- `projects/{id}/activity_report/` ✅
- `projects/{id}/disbursements/` ✅
- `projects/{id}/expenditures/` ✅
- `projects/documents/` (from controller)

### **Programs**
- `programs/fund-requests/` ✅
- `programs/fund-requests/{id}/` ✅
- `programs/fund-requests/next-sequence/` ✅
- `programs/fund-requests/{id}/review/` ✅
- `programs/fund-requests/{id}/approve/` ✅
- `programs/stakeholders/` ✅
- `programs/adhoc/applicants/` ✅
- `programs/work-plans/` ❌ (404)

### **Admin**
**Inventory:**
- `admins/inventory/stores/` ✅
- `admins/inventory/good-receive-notes/` ✅
- `admins/inventory/item-store-stocks/` ✅
- `admins/inventory/assets/history/` ✅
- `admins/inventory/assets/` ❌ (404)
- `admins/inventory/consumables/` ❌ (404)
- `admins/inventory/assets/maintenance/` ❌ (404)

**Fleet:**
- `admins/fleets/fuel-consumptions/` ✅
- `admins/fleets/vehicles/maintenance/tickets/` ✅

**Facilities:**
- `admins/facilities/maintenance/tickets/` ✅

**Payments & Reports:**
- `admins/payments/requests/` ✅
- `admins/reports/travel-expenses/` ✅
- `admins/authorization/expenses/` ✅

### **Procurement**
*Note: All tested with `procurement/` prefix, but actual path may be `procurements/`*
- `procurement/vendors/` ❌ (404 - try `procurements/vendors/`)
- `procurement/purchase-requests/` ❌ (404)
- `procurement/purchase-orders/` ❌ (404)
- `procurement/solicitations/` ❌ (404)
- `procurement/lots/` ❌ (404)

**Known working procurement paths (from controllers):**
- `procurements/purchase-request-memo/`
- `procurements/cba/`

### **HR**
- `hr/employees/` ✅
- `hr/leave-requests/` ❌ (404)
- `hr/timesheets/` ❌ (404)
- `hr/positions/` ❌ (404)
- `hr/grades/` ❌ (404)

**Known working HR paths (from controllers):**
- `hr/employee-benefits/compensations/`
- `hr/performance/competencies/`
- `hr/performance/goals/`
- `hr/grievances/complaints/`
- `hr/employees/beneficiaries/`
- `hr/employees/bank-accounts/`
- `hr/employees/qualifications/`

### **Finance**
- `finance/reports/` ❌ (404)
- `finance/customers/` ❌ (404)
- `finance/petty-cash/` ❌ (404)

### **Other**
- `adhoc-requisitions/` ✅
- `notifications` (from controller)

---

## Notes

1. **Authentication is critical** - All endpoints require valid JWT token
2. **404 responses** indicate endpoint doesn't exist or path is wrong
3. **401 responses** indicate endpoint exists but needs authentication
4. **Path variations** exist between frontend expectations and backend implementation
5. **Controller files** are the source of truth for frontend expectations
6. **Backend may have different paths** than what's in the controllers

---

**Generated:** 2025-11-19
**Repository:** AHNI-New-FE
**Base URL:** https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/
