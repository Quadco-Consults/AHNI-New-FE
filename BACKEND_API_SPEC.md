# Backend API Specification for HR Compensation System

This document outlines the frontend implementation and expected backend API contracts for the HR Compensation and Compensation Spread features.

---

## 1. COMPENSATIONS API

### Base URL
`/hr/employee-benefits/compensations/`

### Data Model

**Compensation Type Interface:**
```typescript
{
  id: string;
  name: string;                    // e.g., "Housing", "Transport", "Meal"
  type: string;                    // "Deduction" or "Earning"
  amount?: number;                 // Fixed amount (e.g., 200000)
  percentage?: number;             // Percentage value (e.g., 10 for 10%)
  amount_or_percentage?: string;   // "Amount" or "Percentage"
  period: string;                  // "Daily", "Weekly", "Monthly", "Annually", "One-Off"
  pay_group?: {
    id: string;
    position?: {
      id: string;
      name: string;
    };
    grade?: {
      id: string;
      name: string;
    };
    level?: {
      id: string;
      name: string;
    };
  };
  created_at?: string;
  updated_at?: string;
}
```

### API Endpoints

#### 1.1 GET - List All Compensations
**Endpoint:** `GET /hr/employee-benefits/compensations/`

**Query Parameters:** None (or add pagination if needed)

**Expected Response:**
```json
{
  "status": true,
  "message": "Successfully retrieved compensations",
  "data": {
    "paginator": {
      "count": 10,
      "page": 1,
      "page_size": 20,
      "total_pages": 1,
      "next_page_number": null,
      "next": null,
      "previous": null,
      "previous_page_number": null
    },
    "results": [
      {
        "id": "uuid-1",
        "name": "Housing",
        "type": "Earning",
        "amount_or_percentage": "Amount",
        "amount": 200000,
        "percentage": null,
        "period": "Monthly",
        "pay_group": {
          "id": "paygroup-uuid",
          "position": {
            "id": "position-uuid",
            "name": "Driver"
          },
          "grade": {
            "id": "grade-uuid",
            "name": "grade 8"
          },
          "level": {
            "id": "level-uuid",
            "name": "step 1"
          }
        },
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### 1.2 GET - Get Compensation by ID
**Endpoint:** `GET /hr/employee-benefits/compensations/{id}/`

**Expected Response:**
```json
{
  "status": true,
  "message": "Successfully retrieved compensation",
  "data": {
    "id": "uuid-1",
    "name": "Housing",
    "type": "Earning",
    "amount": 200000,
    "percentage": null,
    "period": "Monthly",
    "pay_group": { /* ... */ }
  }
}
```

#### 1.3 POST - Create Compensation
**Endpoint:** `POST /hr/employee-benefits/compensations/`

**Request Body:**
```json
{
  "name": "Housing",
  "type": "Earning",
  "amount_or_percentage": "Amount",
  "amount": 200000,
  "percentage": null,
  "pay_group": "paygroup-uuid",
  "period": "Monthly"
}
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Compensation created successfully",
  "data": {
    "id": "new-uuid",
    "name": "Housing",
    "type": "Earning",
    "amount": 200000,
    "period": "Monthly"
  }
}
```

#### 1.4 PATCH - Update Compensation
**Endpoint:** `PATCH /hr/employee-benefits/compensations/{id}/`

**Request Body:** (partial update supported)
```json
{
  "name": "Housing Allowance",
  "amount": 250000
}
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Compensation updated successfully",
  "data": {
    "id": "uuid-1",
    "name": "Housing Allowance",
    "amount": 250000
  }
}
```

#### 1.5 DELETE - Delete Compensation
**Endpoint:** `DELETE /hr/employee-benefits/compensations/{id}/`

**Expected Response:**
```json
{
  "status": true,
  "message": "Compensation deleted successfully",
  "data": null
}
```

---

## 2. COMPENSATION SPREAD API

### Base URL
`/hr/employee-benefits/employee-compensation-spread/`

### Data Model

**Compensation Spread Interface:**
```typescript
{
  id: string;
  employee: string;                  // Employee UUID
  employeeNumber: string;
  surname: string;
  firstname: string;
  position: string;
  grade: string;
  level: string;
  location?: string;
  project: string | null;
  projectName?: string | null;
  hireDate?: string;
  basic: string | number;
  housing: string | number;
  transport: string | number;
  meal: string | number;
  miscellaneous: string | number;
  totalAllowance: string | number;   // Auto-calculated
  thirteenthMonth: string | number;
  grossTotal: string | number;       // Auto-calculated
  is_active?: boolean;
  effective_date?: string | null;
  notes?: string | null;
}
```

### API Endpoints

#### 2.1 GET - List All Compensation Spreads
**Endpoint:** `GET /hr/employee-benefits/employee-compensation-spread/`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 20)
- `search` (optional): Search query

**Expected Response:**
```json
{
  "status": true,
  "message": "Successfully retrieved data",
  "data": {
    "pagination": {
      "count": 7,
      "page": 1,
      "page_size": 20,
      "total_pages": 1,
      "next": null,
      "next_page_number": null,
      "previous": null,
      "previous_page_number": null
    },
    "results": [
      {
        "id": "uuid-1",
        "employee": "employee-uuid",
        "employeeNumber": "EMP-ISJA0001",
        "firstname": "Isaac",
        "surname": "Jame",
        "position": "STL",
        "grade": "grade 9",
        "level": "step 1",
        "project": null,
        "projectName": null,
        "basic": "2550000.00",
        "housing": "200000.00",
        "transport": "120000.00",
        "meal": "58000.00",
        "miscellaneous": "480000.00",
        "thirteenthMonth": "820000.00",
        "totalAllowance": "858000.00",
        "grossTotal": "4228000.00",
        "is_active": true,
        "effective_date": null,
        "notes": null
      }
    ]
  }
}
```

**Important Notes:**
- Field names should be **camelCase** (employeeNumber, totalAllowance, thirteenthMonth, grossTotal, projectName)
- Values are returned as strings with decimal precision (e.g., "2550000.00")
- The backend **auto-calculates** `totalAllowance` and `grossTotal`:
  - `totalAllowance = housing + transport + meal + miscellaneous`
  - `grossTotal = basic + totalAllowance + thirteenthMonth`
- Additional fields: `is_active`, `effective_date`, `notes` for tracking status and metadata

#### 2.2 POST - Create Compensation Spread
**Endpoint:** `POST /hr/employee-benefits/employee-compensation-spread/`

**Request Body:**
```json
{
  "employee": "employee-uuid",
  "project": "Project Name",
  "basic": 2550000,
  "housing": 200000,
  "transport": 120000,
  "meal": 58000,
  "miscellaneous": 480000,
  "total_allowance": 858000,
  "thirteenth_month": 820000,
  "gross_total": 4228000
}
```

**Alternative Request Body (if backend uses snake_case):**
```json
{
  "employee": "employee-uuid",
  "project": "Project Name",
  "basic": 2550000,
  "housing": 200000,
  "transport": 120000,
  "meal": 58000,
  "miscellaneous": 480000,
  "total_allowance": 858000,
  "thirteenth_month": 820000,
  "gross_total": 4228000
}
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Compensation spread created successfully",
  "data": {
    "id": "new-uuid",
    "employee": "employee-uuid",
    "employeeNumber": "AHIN0001",
    "firstname": "John",
    "surname": "Doe",
    "position": "Technical Officer",
    "grade": "grade 10",
    "level": "step 1",
    "project": null,
    "projectName": null,
    "basic": "2550000.00",
    "housing": "200000.00",
    "transport": "120000.00",
    "meal": "58000.00",
    "miscellaneous": "480000.00",
    "thirteenthMonth": "820000.00",
    "totalAllowance": "858000.00",
    "grossTotal": "4228000.00",
    "is_active": true,
    "effective_date": null,
    "notes": null
  }
}
```

#### 2.3 PATCH - Update Compensation Spread
**Endpoint:** `PATCH /hr/employee-benefits/employee-compensation-spread/{id}/`

**Request Body:** (partial update)
```json
{
  "project": "Updated Project",
  "basic": 3000000,
  "housing": 250000,
  "transport": 150000,
  "meal": 60000,
  "miscellaneous": 500000,
  "total_allowance": 960000,
  "thirteenth_month": 900000,
  "gross_total": 4860000
}
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Compensation spread updated successfully",
  "data": {
    "id": "uuid-1",
    "basic": "3000000.00",
    "housing": "250000.00",
    "grossTotal": "4860000.00"
  }
}
```

#### 2.4 DELETE - Delete Compensation Spread
**Endpoint:** `DELETE /hr/employee-benefits/employee-compensation-spread/{id}/`

**Expected Response:**
```json
{
  "status": true,
  "message": "Compensation spread deleted successfully",
  "data": null
}
```

#### 2.5 POST - Bulk Create Compensation Spreads
**Endpoint:** `POST /hr/employee-benefits/employee-compensation-spread/bulk-create/`

**Request Body:**
```json
{
  "data": [
    {
      "employee": "employee-uuid-1",
      "project": "Project Name",
      "basic": 2550000,
      "housing": 200000,
      "transport": 120000,
      "meal": 58000,
      "miscellaneous": 480000,
      "thirteenth_month": 820000
    },
    {
      "employee": "employee-uuid-2",
      "project": "Another Project",
      "basic": 2250000,
      "housing": 200000,
      "transport": 120000,
      "meal": 58000,
      "miscellaneous": 480000,
      "thirteenth_month": 820000
    }
  ]
}
```

**Expected Response:**
```json
{
  "status": true,
  "message": "2 compensation spreads created successfully",
  "data": {
    "created": 2,
    "failed": 0,
    "errors": []
  }
}
```

---

## 3. BULK UPLOAD

### 3.1 Compensation Bulk Upload

**Template Structure (CSV/Excel):**
```csv
Compensation Name,Type (Deduction/Earning),Amount or Percentage,Amount,Percentage,Position,Grade,Level,Period (Daily/Weekly/Monthly/Annually/One-Off)
Housing,Earning,Amount,200000,,Driver,grade 8,step 1,Monthly
Transport,Earning,Amount,120000,,Technical Officer,grade 8,step 1,Monthly
Tax Deduction,Deduction,Percentage,,10,All Positions,All Grades,All Levels,Monthly
```

**Frontend Process:**
1. Parses Excel/CSV file
2. For each row:
   - Finds matching pay group by Position + Grade + Level
   - Creates compensation via POST `/hr/employee-benefits/compensations/`

**Backend Requirement:**
- Accept POST requests with the structure shown in section 1.3

### 3.2 Compensation Spread Bulk Upload

**Template Structure (CSV/Excel):**
```csv
Employee ID,Employee Number,Project,Basic Salary,Housing,Transport,Meal,Miscellaneous,13th Month
507f1f77bcf86cd799439011,AHIN0001,Palm Estate ERP,2550000,200000,120000,58000,480000,820000
507f1f77bcf86cd799439012,AHIN0002,Field Operations,2250000,200000,120000,58000,480000,820000
```

**Frontend Process:**
1. Parses Excel/CSV file
2. For each row:
   - Calculates total_allowance and gross_total
   - Creates compensation spread via POST `/hr/employee-benefits/employee-compensation-spread/`

---

## 4. INTEGRATION NOTES

### 4.1 Pay Group System
- Compensations are linked to Pay Groups (Position + Grade + Level combination)
- When creating compensation spread for an employee, the system auto-fetches compensation values from the employee's pay group

### 4.2 Auto-Calculation
Frontend auto-calculates:
- **Total Allowance** = Housing + Transport + Meal + Miscellaneous
- **Gross Total** = Basic + Total Allowance + 13th Month

Backend should either:
1. Accept these calculated values and store them, OR
2. Calculate them server-side and return in response

### 4.3 Field Name Convention
**Backend Response:** Use **camelCase** for JSON responses
- `employeeNumber` (not employee_number)
- `totalAllowance` (not total_allowance)
- `thirteenthMonth` (not thirteenth_month)
- `grossTotal` (not gross_total)

**Backend Request:** Can accept both formats, but frontend sends **snake_case**:
- `employee`, `project`, `basic`, `housing`, `transport`, `meal`
- `miscellaneous`, `total_allowance`, `thirteenth_month`, `gross_total`

### 4.4 Error Handling
All error responses should follow this format:
```json
{
  "status": false,
  "message": "Error description here",
  "data": null
}
```

---

## 5. SUMMARY OF ENDPOINTS

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/hr/employee-benefits/compensations/` | List compensations |
| GET | `/hr/employee-benefits/compensations/{id}/` | Get single compensation |
| POST | `/hr/employee-benefits/compensations/` | Create compensation |
| PATCH | `/hr/employee-benefits/compensations/{id}/` | Update compensation |
| DELETE | `/hr/employee-benefits/compensations/{id}/` | Delete compensation |
| GET | `/hr/employee-benefits/employee-compensation-spread/` | List compensation spreads |
| POST | `/hr/employee-benefits/employee-compensation-spread/` | Create compensation spread |
| POST | `/hr/employee-benefits/employee-compensation-spread/bulk-create/` | Bulk create compensation spreads |
| PATCH | `/hr/employee-benefits/employee-compensation-spread/{id}/` | Update compensation spread |
| DELETE | `/hr/employee-benefits/employee-compensation-spread/{id}/` | Delete compensation spread |

---

## 6. CURRENT IMPLEMENTATION STATUS

✅ **Frontend Complete:**
- Compensation CRUD operations
- Compensation Spread CRUD with edit/delete
- Bulk upload for both compensations and compensation spreads
- Auto-calculation of totals
- Pay group integration
- Type definitions updated with new fields (is_active, effective_date, notes)

✅ **Backend Complete:**
- CompensationSpread model with auto-calculation
- GET `/employee-compensation-spread/` returns camelCase fields
- POST, PATCH, DELETE endpoints implemented
- Bulk create endpoint at `/bulk-create/`
- Request serializer accepts snake_case
- Response serializer returns camelCase
- Pagination support
- Filter by employee, project, is_active
- Search by employee name/number

---

## 7. NEW FEATURES IN BACKEND

**Auto-Calculation:**
- `total_allowance` = housing + transport + meal + miscellaneous
- `gross_total` = basic + total_allowance + thirteenth_month
- Calculated on save, no need to send in request

**Additional Fields:**
- `is_active` (boolean) - Active status
- `effective_date` (date) - When compensation takes effect
- `notes` (text) - Additional notes

**Bulk Operations:**
- Endpoint: `/hr/employee-benefits/employee-compensation-spread/bulk-create/`
- Accepts array of compensation spread records
- Returns success/failure counts with error details

---

**Generated:** 2025-10-02
**Updated:** 2025-10-02 (Backend implementation complete)
**Frontend Version:** React + TypeScript + Next.js 14
**State Management:** Tanstack React Query
**Backend:** Django REST Framework with custom serializers
