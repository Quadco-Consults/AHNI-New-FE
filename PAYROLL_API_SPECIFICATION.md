# Payroll API Specification

This document outlines the API endpoints needed for the Payroll Generation feature that are currently **NOT IMPLEMENTED** on the backend.

## Status
🔴 **NOT IMPLEMENTED** - Frontend is currently using mock data

---

## 1. Generate Payroll

### Endpoint
```
POST /hr/employee-benefits/payroll/generate/
```

### Description
Generates payroll for selected employees for a specific month and year.

### Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body
```json
{
  "month": "2025-01",
  "year": 2025,
  "employees": ["employee_id_1", "employee_id_2", "employee_id_3"]
}
```

**Field Descriptions:**
- `month` (string, required): Payroll month in YYYY-MM format
- `year` (number, required): Payroll year (2020-2030)
- `employees` (array of strings, required): List of employee IDs to include in payroll

### Response - Success (200 OK)
```json
{
  "status": true,
  "message": "Payroll generated successfully",
  "data": {
    "id": "payroll_123456",
    "month": "2025-01",
    "year": 2025,
    "total_employees": 3,
    "total_gross_payment": 750000,
    "total_deductions": 150000,
    "total_net_payment": 600000,
    "status": "generated",
    "created_at": "2025-01-15T10:30:00Z",
    "employees": [
      {
        "employee_id": "employee_id_1",
        "employee_name": "John Doe",
        "employee_number": "EMP001",
        "basic_salary": 150000,
        "allowances": 50000,
        "gross_payment": 200000,
        "deductions": 40000,
        "net_payment": 160000
      }
      // ... more employees
    ]
  }
}
```

### Response - Error (400 Bad Request)
```json
{
  "status": false,
  "message": "Validation error",
  "errors": {
    "employees": ["At least one employee must be selected"],
    "month": ["Invalid month format"]
  }
}
```

### Response - Error (404 Not Found)
```json
{
  "status": false,
  "message": "One or more employees not found",
  "data": null
}
```

---

## 2. Calculate Payroll Preview

### Endpoint
```
POST /hr/employee-benefits/payroll/calculate-preview/
```

### Description
Calculates payroll preview/summary without actually generating the payroll. Used for validation before final generation.

### Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body
```json
{
  "month": "2025-01",
  "year": 2025,
  "employees": ["employee_id_1", "employee_id_2", "employee_id_3"]
}
```

**Field Descriptions:**
- `month` (string, required): Payroll month in YYYY-MM format
- `year` (number, required): Payroll year (2020-2030)
- `employees` (array of strings, required): List of employee IDs to calculate preview for

### Response - Success (200 OK)
```json
{
  "status": true,
  "message": "Preview calculated successfully",
  "data": {
    "total_employees": 3,
    "total_gross_payment": 750000,
    "total_deductions": 150000,
    "total_net_payment": 600000
  }
}
```

### Response - Error (400 Bad Request)
```json
{
  "status": false,
  "message": "Validation error",
  "errors": {
    "employees": ["At least one employee must be selected"]
  }
}
```

---

## Business Logic Requirements

### Payroll Calculation
1. **Gross Payment** = Basic Salary + All Allowances (Housing, Transport, Meal, Miscellaneous, etc.)
2. **Deductions** = Tax + Pension + Other Deductions
3. **Net Payment** = Gross Payment - Total Deductions
4. **13th Month** should be calculated as Basic Salary / 12 (if applicable for the month)

### Validation Rules
1. At least one employee must be selected
2. Month must be in YYYY-MM format
3. Year must be between 2020-2030
4. Employees must have compensation data configured
5. Cannot generate payroll for the same month/year/employee combination twice (prevent duplicates)

### Data Sources
- Employee data: `/hr/employees/`
- Compensation data: `/hr/employee-benefits/employee-compensation-spread/`
- Compensation types: `/hr/employee-benefits/compensations/`

---

## Frontend Implementation Location

- **Controller**: `src/features/hr/controllers/hrPayRollController.ts` (lines 139-234)
- **UI Component**: `src/features/hr/components/employee-benefits/Payroll/create.tsx`
- **Types**: `src/features/hr/types/payroll.ts`

---

## Notes for Backend Developers

1. The frontend is currently using **MOCK DATA** to demonstrate the UI functionality
2. Look for `🔧 MOCK:` console logs to see the data structure being sent
3. The mock implementation includes a 1-1.5 second delay to simulate API response time
4. When implementing, replace the mock functions in `hrPayRollController.ts` with actual API calls
5. Ensure proper error handling for scenarios like:
   - Employee not found
   - Missing compensation data
   - Duplicate payroll generation
   - Invalid date ranges

---

## Testing the Implementation

Once implemented, test with:
1. Generate payroll for 1 employee
2. Generate payroll for multiple employees
3. Try generating duplicate payroll (should fail)
4. Try with invalid employee IDs (should fail)
5. Try with employees missing compensation data (should fail/warn)
6. Calculate preview before generating
7. Verify calculations match expected values

---

**Created**: January 2025
**Status**: Awaiting Backend Implementation
**Priority**: High
