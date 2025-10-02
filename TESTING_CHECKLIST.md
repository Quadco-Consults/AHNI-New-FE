# HR Compensation System - Testing Checklist

## Test Environment
- **Frontend URL:** http://localhost:3000
- **Backend API:** /api/v1/hr/employee-benefits/
- **Date:** 2025-10-02

---

## 1. COMPENSATIONS TESTING

### 1.1 List View (`/dashboard/hr/employee-benefit/compensation`)

**Test Cases:**
- [ ] Page loads without errors
- [ ] Table displays with proper columns:
  - [ ] Compensation Name
  - [ ] Type (Deduction/Earning)
  - [ ] Amount/Percentage
  - [ ] Position
  - [ ] Grade
  - [ ] Level
  - [ ] Period
  - [ ] Actions (Edit/Delete buttons)
- [ ] Pagination works
- [ ] Search functionality works
- [ ] Filter functionality works (if implemented)

### 1.2 Create Compensation

**Manual Create:**
- [ ] Click "Add Compensation" button
- [ ] Modal opens successfully
- [ ] Fill form:
  - [ ] Compensation Name (e.g., "Test Housing")
  - [ ] Type: "Earning"
  - [ ] Amount or Percentage: "Amount"
  - [ ] Amount: 200000
  - [ ] Pay Group (Position/Grade/Level)
  - [ ] Period: "Monthly"
- [ ] Click "Create"
- [ ] Success toast appears
- [ ] Modal closes
- [ ] Table refreshes with new record

**Bulk Upload:**
- [ ] Click "Bulk Upload" button
- [ ] Download template
- [ ] Template downloads correctly (Excel/CSV)
- [ ] Fill template with sample data:
  ```csv
  Compensation Name,Type,Amount or Percentage,Amount,Percentage,Position,Grade,Level,Period
  Test Transport,Earning,Amount,120000,,Driver,grade 8,step 1,Monthly
  ```
- [ ] Upload filled template
- [ ] File parses successfully
- [ ] Preview shows correct data
- [ ] Click "Upload"
- [ ] Success message shows
- [ ] Records appear in table

### 1.3 View Compensation Details

- [ ] Click on a compensation record
- [ ] Details page opens (`/compensation/{id}`)
- [ ] All fields display correctly
- [ ] Related pay group information shows

### 1.4 Edit Compensation

- [ ] Click edit button on a record
- [ ] Edit modal opens
- [ ] Form pre-populates with existing data
- [ ] Modify a field (e.g., change amount)
- [ ] Click "Update"
- [ ] Success toast appears
- [ ] Table refreshes with updated data
- [ ] Changes persist after page refresh

### 1.5 Delete Compensation

- [ ] Click delete button
- [ ] Confirmation dialog appears
- [ ] Click "Confirm"
- [ ] Success toast appears
- [ ] Record removed from table
- [ ] Deletion persists after page refresh

---

## 2. COMPENSATION SPREAD TESTING

### 2.1 List View (`/dashboard/hr/employee-benefit/compensation-spread`)

**Test Cases:**
- [ ] Page loads without errors
- [ ] Table displays with proper columns:
  - [ ] S/No
  - [ ] Employee Number
  - [ ] Surname
  - [ ] Firstname
  - [ ] Position
  - [ ] Grade
  - [ ] Level
  - [ ] Location
  - [ ] Project
  - [ ] Hire Date
  - [ ] Basic
  - [ ] Housing
  - [ ] Transport
  - [ ] Meal
  - [ ] Miscellaneous
  - [ ] Total Allowance
  - [ ] 13th Month
  - [ ] Gross Total
  - [ ] Action (Edit/Delete buttons)
- [ ] All 7 sample records display
- [ ] Numbers format correctly with commas
- [ ] Calculated totals are correct:
  - [ ] Total Allowance = Housing + Transport + Meal + Miscellaneous
  - [ ] Gross Total = Basic + Total Allowance + 13th Month

**Expected Sample Data:**
```
Employee: EMP-ISJA0001 (Isaac Jame, STL)
Basic: 2,550,000
Housing: 200,000
Transport: 120,000
Meal: 58,000
Miscellaneous: 480,000
Total Allowance: 858,000
13th Month: 820,000
Gross Total: 4,228,000
```

### 2.2 Create Compensation Spread

**Test Cases:**
- [ ] Click "Add Employee Compensation" button
- [ ] Modal opens successfully
- [ ] Employee dropdown loads
- [ ] Select an employee
- [ ] Employee info card displays with:
  - [ ] Employee Number
  - [ ] Name
  - [ ] Position
  - [ ] Grade
  - [ ] Location
- [ ] Compensation fields auto-populate (if pay group template exists)
- [ ] Success toast shows if template loaded
- [ ] Enter/modify values:
  - [ ] Project: "Test Project"
  - [ ] Basic: 3000000
  - [ ] Housing: 250000
  - [ ] Transport: 150000
  - [ ] Meal: 75000
  - [ ] Miscellaneous: 500000
  - [ ] 13th Month: 900000
- [ ] Total Allowance auto-calculates: 975,000
- [ ] Gross Total auto-calculates: 4,875,000
- [ ] Click "Create Compensation Spread"
- [ ] Success toast appears
- [ ] Modal closes
- [ ] Table refreshes with new record

**Bulk Upload:**
- [ ] Click "Bulk Upload" button
- [ ] Download template
- [ ] Template downloads correctly (CSV/Excel)
- [ ] Fill template with sample data:
  ```csv
  Employee ID,Employee Number,Project,Basic Salary,Housing,Transport,Meal,Miscellaneous,13th Month
  {uuid},EMP-TEST001,Test Project,2500000,200000,120000,58000,480000,820000
  ```
- [ ] Upload filled template
- [ ] File parses successfully
- [ ] Preview shows correct data
- [ ] Click "Upload"
- [ ] Success message shows
- [ ] Records appear in table

### 2.3 Edit Compensation Spread

**Test Cases:**
- [ ] Click edit (pencil) button on a record
- [ ] Edit modal opens
- [ ] Employee info card displays (read-only)
- [ ] Form pre-populates with existing data
- [ ] Modify compensation values:
  - [ ] Change Basic to 3500000
  - [ ] Change Housing to 300000
- [ ] Total Allowance recalculates automatically
- [ ] Gross Total recalculates automatically
- [ ] Calculated values are correct:
  - [ ] Total Allowance = 300,000 + 150,000 + 75,000 + 500,000 = 1,025,000
  - [ ] Gross Total = 3,500,000 + 1,025,000 + 900,000 = 5,425,000
- [ ] Click "Update Compensation"
- [ ] Success toast appears
- [ ] Modal closes
- [ ] Table refreshes with updated data
- [ ] Changes persist after page refresh

### 2.4 Delete Compensation Spread

**Test Cases:**
- [ ] Click delete button
- [ ] Confirmation dialog shows employee name
- [ ] Click "OK" to confirm
- [ ] Success toast appears
- [ ] Record removed from table
- [ ] Deletion persists after page refresh

---

## 3. AUTO-CALCULATION TESTING

### 3.1 Create Form Calculations

**Test Case 1: All fields filled**
- Input:
  - Basic: 2,000,000
  - Housing: 200,000
  - Transport: 100,000
  - Meal: 50,000
  - Miscellaneous: 400,000
  - 13th Month: 700,000
- Expected:
  - Total Allowance: 750,000
  - Gross Total: 3,450,000
- [ ] Calculations are correct
- [ ] Values update in real-time as you type

**Test Case 2: Zero values**
- Input:
  - Basic: 1,000,000
  - Housing: 0
  - Transport: 0
  - Meal: 0
  - Miscellaneous: 0
  - 13th Month: 0
- Expected:
  - Total Allowance: 0
  - Gross Total: 1,000,000
- [ ] Calculations are correct

**Test Case 3: Partial values**
- Input:
  - Basic: 2,500,000
  - Housing: 200,000
  - Transport: 120,000
  - Meal: 0
  - Miscellaneous: 0
  - 13th Month: 820,000
- Expected:
  - Total Allowance: 320,000
  - Gross Total: 3,640,000
- [ ] Calculations are correct

### 3.2 Edit Form Calculations

- [ ] Open edit modal for existing record
- [ ] Change Housing from 200,000 to 250,000
- [ ] Total Allowance increases by 50,000
- [ ] Gross Total increases by 50,000
- [ ] Change 13th Month from 820,000 to 900,000
- [ ] Total Allowance stays the same
- [ ] Gross Total increases by 80,000

---

## 4. DATA VALIDATION TESTING

### 4.1 Required Fields

**Compensation Create:**
- [ ] Try to submit without Compensation Name → Shows error
- [ ] Try to submit without Type → Shows error
- [ ] Try to submit without Amount/Percentage → Shows error
- [ ] Try to submit without Period → Shows error

**Compensation Spread Create:**
- [ ] Try to submit without Employee → Shows error
- [ ] Try to submit without Basic → Shows error or uses 0

### 4.2 Number Validation

- [ ] Try to enter negative numbers → Should reject or warn
- [ ] Try to enter text in number fields → Should reject
- [ ] Try to enter very large numbers (> 1 billion) → Should accept
- [ ] Try to enter decimals → Should handle correctly

### 4.3 Duplicate Prevention

**Compensation Spread:**
- [ ] Try to create two compensation spreads for same employee
- [ ] Should allow (constraint removed in backend)
- [ ] Both records should save successfully

---

## 5. UI/UX TESTING

### 5.1 Loading States

- [ ] Loading spinner shows while fetching data
- [ ] Loading state shows during create/update operations
- [ ] Button shows "Creating..." or "Updating..." text
- [ ] Button is disabled during submission

### 5.2 Error Handling

**Network Errors:**
- [ ] Disconnect internet
- [ ] Try to load page → Shows error message
- [ ] Try to create record → Shows error toast

**Backend Errors:**
- [ ] Submit invalid data
- [ ] Error toast displays with clear message
- [ ] Form stays open for correction

### 5.3 Toast Notifications

- [ ] Success toast shows on create: "Compensation created successfully"
- [ ] Success toast shows on update: "Compensation updated successfully"
- [ ] Success toast shows on delete: "Compensation deleted successfully"
- [ ] Error toasts show appropriate messages
- [ ] Toasts auto-dismiss after 3-5 seconds

### 5.4 Responsive Design

- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Table scrolls horizontally on small screens
- [ ] Modals are responsive

---

## 6. PERFORMANCE TESTING

### 6.1 Load Times

- [ ] Compensation list loads in < 2 seconds
- [ ] Compensation spread list loads in < 2 seconds
- [ ] Modal opens instantly
- [ ] Form submission completes in < 1 second

### 6.2 Large Data Sets

- [ ] Create 50+ compensation records
- [ ] List still loads quickly
- [ ] Pagination works correctly
- [ ] Search/filter remains performant

---

## 7. INTEGRATION TESTING

### 7.1 Pay Group Integration

**Compensation:**
- [ ] Create compensation linked to pay group
- [ ] Pay group information displays correctly
- [ ] Can filter by position/grade/level

**Compensation Spread:**
- [ ] Select employee with pay group
- [ ] Compensation auto-populates from template
- [ ] Values match pay group compensation template

### 7.2 Employee Integration

- [ ] Employee dropdown shows all employees
- [ ] Employee details display correctly:
  - [ ] Name matches employee record
  - [ ] Position matches employee record
  - [ ] Grade matches employee record
  - [ ] Location matches employee record

---

## 8. EDGE CASES

### 8.1 Empty States

- [ ] No compensations exist → Shows empty state message
- [ ] No compensation spreads exist → Shows empty state message
- [ ] No employees exist → Employee dropdown shows "No employees found"

### 8.2 Special Characters

- [ ] Project name with special characters: "Project #1 (Test)"
- [ ] Compensation name with apostrophe: "Driver's Allowance"
- [ ] Names with accents: "José García"

### 8.3 Very Large Numbers

- [ ] Basic: 999,999,999
- [ ] All calculations still accurate
- [ ] Numbers display with proper formatting

### 8.4 Concurrent Operations

- [ ] Open edit modal for same record in two tabs
- [ ] Make changes in both
- [ ] Last save wins (no conflict)

---

## 9. ACCESSIBILITY TESTING

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Can submit forms with Enter key
- [ ] Can close modals with Escape key
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced

---

## 10. BROWSER COMPATIBILITY

**Test on:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 11. BACKEND API TESTING

### 11.1 Direct API Tests (using Postman/curl)

**GET List:**
```bash
curl -X GET "http://localhost:8000/api/v1/hr/employee-benefits/compensation-spread/?page=1&size=20" \
  -H "Authorization: Bearer {token}"
```
- [ ] Returns paginated results
- [ ] Fields are in camelCase
- [ ] Total count is correct

**POST Create:**
```bash
curl -X POST "http://localhost:8000/api/v1/hr/employee-benefits/compensation-spread/" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee": "employee-uuid",
    "project": "Test Project",
    "basic": 3000000,
    "housing": 250000,
    "transport": 150000,
    "meal": 75000,
    "miscellaneous": 500000,
    "thirteenth_month": 900000
  }'
```
- [ ] Creates successfully
- [ ] Returns 201 status
- [ ] Response includes calculated totals
- [ ] totalAllowance = 975,000
- [ ] grossTotal = 4,875,000

**PATCH Update:**
```bash
curl -X PATCH "http://localhost:8000/api/v1/hr/employee-benefits/compensation-spread/{id}/" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "basic": 3500000
  }'
```
- [ ] Updates successfully
- [ ] Returns updated record
- [ ] Totals recalculated

**DELETE:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/hr/employee-benefits/compensation-spread/{id}/" \
  -H "Authorization: Bearer {token}"
```
- [ ] Deletes successfully
- [ ] Returns 204 or success message
- [ ] Record no longer in list

### 11.2 Bulk Create

```bash
curl -X POST "http://localhost:8000/api/v1/hr/employee-benefits/compensation-spread/bulk-create/" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {
        "employee": "uuid-1",
        "basic": 2550000,
        "housing": 200000,
        "transport": 120000,
        "meal": 58000,
        "miscellaneous": 480000,
        "thirteenth_month": 820000
      },
      {
        "employee": "uuid-2",
        "basic": 2250000,
        "housing": 200000,
        "transport": 120000,
        "meal": 58000,
        "miscellaneous": 480000,
        "thirteenth_month": 820000
      }
    ]
  }'
```
- [ ] Creates multiple records
- [ ] Returns count of created/failed
- [ ] All records appear in list

---

## 12. REGRESSION TESTING

- [ ] Other HR pages still work
- [ ] Navigation menu works
- [ ] User authentication still works
- [ ] Other modules unaffected

---

## SUMMARY

**Critical Tests (Must Pass):**
- [ ] Compensation list loads
- [ ] Compensation spread list loads
- [ ] Create compensation spread
- [ ] Edit compensation spread
- [ ] Auto-calculations are accurate
- [ ] Delete operations work

**High Priority:**
- [ ] Bulk upload works
- [ ] Pay group integration
- [ ] Employee dropdown loads
- [ ] Toast notifications

**Medium Priority:**
- [ ] Filters and search
- [ ] Pagination
- [ ] Responsive design
- [ ] Loading states

**Low Priority:**
- [ ] Browser compatibility
- [ ] Accessibility
- [ ] Edge cases

---

## KNOWN ISSUES

_(Document any issues found during testing)_

1. Issue: [Description]
   - Severity: High/Medium/Low
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:

---

## SIGN-OFF

**Tested by:** _______________
**Date:** _______________
**Environment:** _______________
**Result:** Pass / Fail / Partial

---

**Generated:** 2025-10-02
**Version:** 1.0
