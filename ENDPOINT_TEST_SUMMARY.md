# API Endpoint Test Summary

## Quick Reference Guide

### Test Date: 2025-11-19
### Base URL: `https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/`

---

## ✅ WORKING ENDPOINTS (Require Authentication)

These endpoints **exist** and return 401 (Unauthorized) without authentication:

### **Core Dashboard Endpoints**

| Endpoint | Purpose | Hook/Controller | Status |
|----------|---------|----------------|--------|
| `users/` | Get all users (paginated) | `useGetAllUsers()` | ✅ Exists |
| `users/profile/` | Get user profile | `useGetUserProfile()` | ✅ Exists |
| `projects/` | Get all projects | `useGetAllProjects()` | ✅ Exists |
| `projects/partners/` | Get project partners | `useGetAllPartners()` | ✅ Exists |
| `programs/fund-requests/` | Get fund requests | `useGetAllFundRequests()` | ✅ Exists |

### **Additional Working Endpoints**

```
✅ programs/fund-requests/next-sequence/
✅ programs/stakeholders/
✅ programs/adhoc/applicants/
✅ admins/inventory/stores/
✅ admins/inventory/good-receive-notes/
✅ admins/inventory/item-store-stocks/
✅ admins/inventory/assets/history/
✅ admins/fleets/fuel-consumptions/
✅ admins/fleets/vehicles/maintenance/tickets/
✅ admins/facilities/maintenance/tickets/
✅ admins/payments/requests/
✅ admins/reports/travel-expenses/
✅ admins/authorization/expenses/
✅ hr/employees/
✅ adhoc-requisitions/
```

**Total Working Endpoints: 20**

---

## ❌ CRITICAL ISSUE: Missing Auth Endpoint

### **Dashboard Breaking Issue**

| Endpoint | Purpose | Impact | Priority |
|----------|---------|--------|----------|
| ❌ `auth/me/` | Get current user | **Dashboard cannot load** | 🔴 CRITICAL |

**Problem:** The dashboard (`Dashboard.tsx:197`) calls `useGetCurrentUser()` which tries to fetch from `auth/me/`, but this endpoint returns **404 Not Found**.

**Effect:**
- Dashboard cannot load user information
- Role-based permissions fail
- User profile displays broken
- Authentication state unknown

**Fix Required:** Backend needs to implement `auth/me/` endpoint or frontend needs to use different endpoint path.

---

## ❌ NON-EXISTENT ENDPOINTS (404 Not Found)

### **Missing Critical Endpoints**
```
❌ auth/me/ (CRITICAL - breaks dashboard)
❌ programs/work-plans/
❌ admins/inventory/assets/
❌ admins/inventory/consumables/
❌ admins/inventory/assets/maintenance/
```

### **Missing Procurement Endpoints**
**Note:** These may exist under `procurements/` instead of `procurement/`

```
❌ procurement/vendors/ (try: procurements/vendors/)
❌ procurement/purchase-requests/ (try: procurements/purchase-request-memo/)
❌ procurement/purchase-orders/
❌ procurement/solicitations/
❌ procurement/lots/
```

### **Missing HR Endpoints**
**Note:** These may exist under different nested paths

```
❌ hr/leave-requests/ (try: hr/employee-benefits/leave-requests/)
❌ hr/timesheets/
❌ hr/positions/
❌ hr/grades/
```

### **Missing Finance Endpoints**
```
❌ finance/reports/
❌ finance/customers/
❌ finance/petty-cash/
```

**Total Missing: 17**

---

## 🧪 How to Test Endpoints

### **Without Authentication**
```bash
# Test all endpoints
node test-specific-endpoints.js

# Test with custom script
node test-api-endpoints.js
```

### **With Authentication**
```bash
# Provide your auth token
node test-specific-endpoints.js YOUR_AUTH_TOKEN_HERE
```

### **In Browser Console**
```javascript
// 1. Get current token
const token = localStorage.getItem('token');
console.log('Token:', token);

// 2. Test an endpoint
fetch('https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/users/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

---

## 📊 Response Structures

### **Successful Paginated Response (200)**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "count": 150,
    "next": "https://api.example.com/users/?page=2",
    "previous": null,
    "results": [
      {
        "id": "uuid-here",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        ...
      }
    ]
  }
}
```

### **Successful Single Item Response (200)**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "uuid-here",
    "name": "Project Name",
    "description": "Project description",
    ...
  }
}
```

### **Unauthorized Response (401)**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### **Not Found Response (404)**
```json
{
  "detail": "Not found."
}
```

### **Validation Error (400)**
```json
{
  "status": false,
  "error_code": "required",
  "message": "email: This field is required.",
  "data": null
}
```

---

## 🔑 Authentication

### **Required Header**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Token Location**
- **Storage:** `localStorage`
- **Key:** `"token"`
- **Set by:** Login flow
- **Used by:** `AxiosWithToken` interceptor

### **Token Retrieval**
```javascript
// Get token from localStorage
const token = localStorage.getItem('token');

// Set token (after login)
localStorage.setItem('token', 'your-jwt-token-here');
```

---

## 🔍 Endpoint Path Corrections

### **Procurement Module**
❌ **Wrong:** `procurement/vendors/`
✅ **Correct:** `procurements/vendors/` (plural)

Other procurement paths (from controllers):
- `procurements/purchase-request-memo/`
- `procurements/cba/`
- `procurements/solicitations/`

### **HR Module**
❌ **Wrong:** `hr/leave-requests/`
✅ **Correct:** `hr/employee-benefits/leave-requests/` (more nested)

Other HR paths (from controllers):
- `hr/employees/`
- `hr/employee-benefits/compensations/`
- `hr/performance/competencies/`
- `hr/performance/goals/`
- `hr/grievances/complaints/`

---

## 🛠️ Controller File Locations

If you need to verify endpoint paths, check these controller files:

### **Core Controllers**
- **Users:** `/src/features/auth/controllers/userController.ts`
- **Projects:** `/src/features/projects/controllers/projectController.ts`
- **Fund Requests:** `/src/features/programs/controllers/fundRequestController.ts`

### **Module Controllers**
- **Admin:** `/src/features/admin/controllers/`
- **Procurement:** `/src/features/procurement/controllers/`
- **HR:** `/src/features/hr/controllers/`
- **Finance:** `/src/features/finance/controllers/`

### **Finding Endpoints in Controllers**
```bash
# Search for BASE_URL in controllers
grep -r "BASE_URL.*=" src/features/*/controllers/*.ts

# Search for specific endpoint usage
grep -r "AxiosWithToken.get" src/features/*/controllers/*.ts
```

---

## ⚠️ Common Issues

### **Issue 1: 401 Unauthorized**
**Cause:** No authentication token or invalid token
**Solution:** Ensure token is in localStorage and valid

### **Issue 2: 404 Not Found**
**Cause:** Endpoint doesn't exist or wrong path
**Solution:**
- Check controller file for correct path
- Try plural vs singular (`procurement/` vs `procurements/`)
- Check for nested paths (e.g., `hr/employee-benefits/...`)

### **Issue 3: CORS Errors**
**Cause:** Browser blocking cross-origin requests
**Solution:** Backend must allow CORS from frontend domain

### **Issue 4: Network Timeout**
**Cause:** Backend slow or unresponsive
**Solution:** Increase timeout in `AxiosWithToken` config (currently 60s)

---

## 📈 Statistics

| Category | Count |
|----------|-------|
| **Total Endpoints Tested** | 37 |
| **Working (401 - need auth)** | 20 |
| **Not Found (404)** | 17 |
| **Critical Issues** | 1 |
| **Success Rate** | 54% exist |

---

## 🎯 Next Steps

### **For Developers**

1. **Fix Critical Issue**
   - [ ] Implement `auth/me/` endpoint on backend
   - [ ] Or update frontend to use alternative endpoint
   - [ ] Test dashboard loads properly

2. **Verify Endpoint Paths**
   - [ ] Test with authentication token
   - [ ] Update procurement paths to use `procurements/`
   - [ ] Update HR paths to use nested structure
   - [ ] Document actual backend paths

3. **Complete Testing**
   - [ ] Obtain valid auth token
   - [ ] Re-run tests with authentication
   - [ ] Document actual response structures
   - [ ] Create integration tests

### **For Backend Team**

1. **Implement Missing Endpoint**
   - [ ] Add `auth/me/` endpoint (CRITICAL)
   - [ ] Return current authenticated user data
   - [ ] Match expected response structure

2. **Document API**
   - [ ] Provide OpenAPI/Swagger documentation
   - [ ] Clarify correct endpoint paths
   - [ ] Document authentication requirements

---

## 📝 Files Generated

1. **`API_ENDPOINT_ANALYSIS.md`** - Comprehensive endpoint documentation
2. **`ENDPOINT_TEST_SUMMARY.md`** - This quick reference guide
3. **`test-api-endpoints.js`** - Automated testing script
4. **`test-specific-endpoints.js`** - Targeted endpoint tests

---

**Last Updated:** 2025-11-19
**Repository:** AHNI-New-FE
**Tester:** Claude Code Analysis
