# Contract Workflow - Integration Testing Guide

## ✅ Backend Implementation Complete

Based on the backend summary, the following has been implemented:

### Backend Endpoints
- ✅ `POST /contract-grants/agreements/{id}/submit/` - Submit for approval
- ✅ `POST /contract-grants/agreements/{id}/approve_agreement/` - Approve agreement
- ✅ `POST /contract-grants/agreements/{id}/reject/` - Reject agreement with reason
- ✅ `POST /contract-grants/agreements/{id}/upload-document/` - Upload documents (existing)
- ✅ `GET /contract-grants/agreements/{id}/documents/` - Get documents (existing)
- ✅ `POST /contract-grants/agreements/{id}/extend/` - Create extension (existing)

### Frontend Hooks Added
- ✅ `useSubmitAgreement()` - Matches `POST /submit/`
- ✅ `useApproveAgreement()` - Matches `POST /approve_agreement/`
- ✅ `useRejectAgreement()` - Matches `POST /reject/`
- ✅ `useUploadContractDocument()` - Matches `POST /upload-document/`
- ✅ `useGetAgreementDocuments()` - Matches `GET /documents/`
- ✅ `useCreateContractModification()` - Matches `POST /extend/`

---

## 🧪 End-to-End Testing Scenarios

### Test 1: Complete Submission Workflow

**Objective:** Test the full workflow from draft to active contract

**Steps:**
1. **Create Draft Agreement**
   - Navigate to: http://localhost:3000/dashboard/c-and-g/agreements/create
   - Fill in all required fields
   - Save as draft
   - Note the agreement ID

2. **Navigate to View Page**
   - Go to: http://localhost:3000/dashboard/c-and-g/agreements/{agreement-id}/view
   - Verify: "Upload Contract Documents" section is visible
   - Verify: Status badge shows "DRAFT" (gray)
   - Verify: "Submit for Approval" button is NOT visible yet

3. **Upload Contract Document**
   - Select document type: "Main Contract"
   - Add optional remarks: "Initial agreement document"
   - Click "Select Documents"
   - Choose a PDF file
   - Click "Upload Documents"
   - Expected: Success toast notification
   - Expected: Document appears in "Contract Documents" section

4. **Verify Document Display**
   - Check document shows:
     - ✅ File name
     - ✅ Document type badge (blue "CONTRACT")
     - ✅ Version number (Version 1)
     - ✅ Contract number (should be empty until approved)
     - ✅ Upload date
     - ✅ File size
     - ✅ Remarks (if provided)
   - Check buttons work:
     - ✅ "View" button opens document in new tab
     - ✅ "Download" button downloads the file

5. **Submit for Approval**
   - Verify: "Submit for Approval" button now appears in top-right
   - Click "Submit for Approval"
   - Expected: Confirmation dialog appears
   - Dialog shows: "1 document(s)" to be submitted
   - Click "Submit for Approval" in dialog
   - Expected: Success toast "Agreement submitted for approval"
   - Expected: Status changes to "SUBMITTED" (blue badge)
   - Expected: Upload section disappears
   - Expected: "Submit for Approval" button disappears
   - Expected: "Edit Agreement" button disappears

6. **Approve Agreement** (as approver)
   - Backend endpoint: `POST /contract-grants/agreements/{id}/approve_agreement/`
   - Use API tool (Postman/curl) or implement UI for approvers
   - Expected: Status changes to "APPROVED"
   - Expected: Contract number is generated (format: AGR-2025-0001-V1)
   - Expected: Contract number appears in header
   - Expected: Documents now show the contract number

7. **Verify Active State**
   - Refresh the page
   - Status should show "APPROVED" or "ACTIVE"
   - Contract number visible in header
   - "Add Modification" button should appear (if ACTIVE)

**Expected Results:**
- ✅ Complete workflow from DRAFT → SUBMITTED → APPROVED → ACTIVE
- ✅ Contract number generated on approval
- ✅ Documents inherit contract number
- ✅ UI updates correctly at each stage
- ✅ Permissions enforced (can't edit after submission)

---

### Test 2: Rejection and Resubmission

**Objective:** Test rejection flow and resubmission capability

**Steps:**
1. **Create and Submit Agreement** (follow Test 1, steps 1-5)
   - Agreement status: SUBMITTED

2. **Reject Agreement** (as approver)
   - Backend endpoint: `POST /contract-grants/agreements/{id}/reject/`
   - Request body: `{"reason": "Missing signature page"}`
   - Expected: Status returns to "DRAFT"
   - Expected: Rejection reason logged in remarks

3. **Verify Draft State Restored**
   - Refresh the view page
   - Status badge: "DRAFT" (gray)
   - Upload section: Visible again
   - Can upload more documents
   - Can edit agreement

4. **Upload Additional Document**
   - Upload the missing signature page
   - Select type: "ADDENDUM"
   - Add remarks: "Signature page added"

5. **Resubmit**
   - Click "Submit for Approval" again
   - Verify: Dialog shows "2 document(s)" now
   - Submit
   - Expected: Status → SUBMITTED again

**Expected Results:**
- ✅ Rejection returns status to DRAFT
- ✅ User can upload more documents
- ✅ User can resubmit with corrections
- ✅ Rejection reason is logged

---

### Test 3: Multiple Document Upload

**Objective:** Test uploading multiple documents of different types

**Steps:**
1. **Create Draft Agreement**
2. **Upload Main Contract**
   - Type: "Main Contract"
   - File: contract_v1.pdf
   - Upload
   - Verify: Shows as Version 1

3. **Upload Amendment**
   - Type: "AMENDMENT"
   - File: amendment_1.pdf
   - Remarks: "Added clause 5.3"
   - Upload
   - Verify: Shows as Version 2

4. **Upload Addendum**
   - Type: "ADDENDUM"
   - File: addendum_scope.pdf
   - Remarks: "Scope expansion"
   - Upload
   - Verify: Shows as Version 3

5. **Verify Document List**
   - All 3 documents visible
   - Each has unique version number
   - Correct type badges (different colors)
   - All metadata displayed correctly

**Expected Results:**
- ✅ Can upload multiple documents
- ✅ Version numbers auto-increment (1, 2, 3...)
- ✅ Each document type displays correctly
- ✅ All documents listed with metadata

---

### Test 4: Contract Modifications (Extensions)

**Objective:** Test creating contract modifications on active contracts

**Prerequisites:**
- Agreement must be in ACTIVE status
- Follow Test 1 completely first

**Steps:**
1. **Navigate to Active Agreement**
   - Status: ACTIVE
   - Verify: "Add Modification" button visible in top-right

2. **Open Modification Modal**
   - Click "Add Modification"
   - Modal appears: "Create Contract Modification"

3. **Create Extension**
   - Modification Type: "Contract Extension"
   - Description: "Extending contract by 6 months due to project delay"
   - New End Date: Select date 6 months from current end date
   - Additional Cost: 50000
   - Attach Document: Optional extension_agreement.pdf
   - Click "Create Modification"

4. **Verify Modification Created**
   - Expected: Success toast
   - Expected: New "Contract Modifications" section appears
   - Modification shows:
     - ✅ Type badge: "EXTENSION" (green)
     - ✅ Status: "PENDING" (yellow) - assuming needs approval
     - ✅ Description text
     - ✅ New end date
     - ✅ Additional cost: ₦50,000
     - ✅ Created date

5. **Create Addendum**
   - Click "Add Modification" again
   - Type: "Addendum"
   - Description: "Adding new deliverable: Monthly reports"
   - Additional Cost: 0
   - Create
   - Verify: Shows with yellow badge

6. **Create Amendment**
   - Click "Add Modification" again
   - Type: "Amendment"
   - Description: "Modifying payment terms to net-30"
   - Create
   - Verify: Shows with purple badge

**Expected Results:**
- ✅ "Add Modification" button only visible for ACTIVE contracts
- ✅ Can create multiple modification types
- ✅ Each type has correct color badge
- ✅ All modifications tracked with status
- ✅ Backend creates modifications via `/extend/` endpoint

---

### Test 5: Permission and State Validation

**Objective:** Verify correct permissions at each workflow stage

**Test Matrix:**

| Status | Can Upload? | Can Edit? | Can Submit? | Can Modify? | Submit Button Visible? | Edit Button Visible? | Add Modification Visible? |
|--------|------------|-----------|-------------|-------------|----------------------|---------------------|-------------------------|
| DRAFT | ✅ Yes | ✅ Yes | ✅ Yes (if docs exist) | ❌ No | ✅ Yes (if docs exist) | ✅ Yes | ❌ No |
| SUBMITTED | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| PENDING_APPROVAL | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| APPROVED | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| ACTIVE | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| EXPIRED | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

**Steps:**
1. Test each status by manually updating the agreement status in the database
2. Refresh the view page after each status change
3. Verify UI elements match the table above

**Expected Results:**
- ✅ Correct permissions enforced at each stage
- ✅ UI elements show/hide appropriately
- ✅ No unauthorized actions possible

---

### Test 6: Contract Number Generation

**Objective:** Verify unique contract number generation

**Steps:**
1. **Approve Multiple Agreements**
   - Create 3 draft agreements (different types)
   - Upload documents for each
   - Submit each for approval
   - Approve all 3

2. **Verify Contract Numbers**
   - Agreement 1: Should get AGR-2025-0001-V1
   - Agreement 2: Should get AGR-2025-0002-V1
   - Agreement 3: Should get AGR-2025-0003-V1

3. **Test Year Rollover** (if testing spans years)
   - Next year's first contract: AGR-2026-0001-V1

4. **Verify Uniqueness**
   - All contract numbers are unique
   - No duplicates in database
   - Documents inherit correct contract numbers

**Expected Results:**
- ✅ Sequential numbering within year
- ✅ Year-based partitioning
- ✅ Version tracking (V1, V2, etc.)
- ✅ Unique constraint prevents duplicates

---

### Test 7: Error Handling

**Objective:** Test error scenarios and validation

**Scenarios to Test:**

**7.1: Submit Without Documents**
- Create draft agreement
- Don't upload any documents
- Try to submit
- Expected: "Submit for Approval" button doesn't appear
- OR: If button visible, error toast: "Please upload at least one contract document before submitting"

**7.2: Upload Invalid File Type**
- Try uploading .exe, .zip, or other non-document files
- Expected: File not accepted (HTML5 accept attribute) OR backend validation error

**7.3: Network Error During Upload**
- Simulate network failure (disconnect wifi)
- Try to upload document
- Expected: Error toast with message
- Expected: File not uploaded, can retry

**7.4: Already Submitted Agreement**
- Submit agreement
- Try to upload more documents (via API if needed)
- Expected: Backend returns error, status check prevents upload

**Expected Results:**
- ✅ Clear error messages
- ✅ Validation prevents invalid actions
- ✅ User can recover from errors
- ✅ No data corruption on failures

---

## 📋 Pre-Testing Checklist

Before starting tests, ensure:

- [ ] Backend migrations have been run
  ```bash
  python manage.py makemigrations contract_grants
  python manage.py migrate
  ```

- [ ] Database schema includes new fields:
  - Agreement: `status`, `contract_number`, `submitted_at`, `submitted_by`, `approved_at`, `approved_by`
  - AgreementDocument: `contract_number`, `file_size_bytes`

- [ ] API endpoints are accessible:
  ```bash
  # Test endpoint availability
  curl -X POST http://localhost:8000/contract-grants/agreements/{id}/submit/
  ```

- [ ] Frontend dev server running:
  ```bash
  npm run dev
  # or
  yarn dev
  ```

- [ ] Test user has appropriate permissions

- [ ] File upload directory has write permissions

---

## 🐛 Common Issues and Solutions

### Issue: "Submit for Approval" button doesn't appear
**Solution:**
- Verify at least one document is uploaded
- Check agreement status is DRAFT
- Check `canSubmit` logic in view component (line 178)

### Issue: Contract number not generated
**Solution:**
- Verify `generate_contract_number()` method is called in backend
- Check database unique constraint on `contract_number`
- Ensure approval endpoint is hit, not just status change

### Issue: Documents don't show contract number
**Solution:**
- Contract number is only assigned after approval
- Check `save()` method in AgreementDocument model
- Verify documents inherit from parent agreement's `contract_number`

### Issue: Modification modal not working
**Solution:**
- Check agreement status is ACTIVE
- Verify `isActive` variable (line 179 in view component)
- Check browser console for JS errors

### Issue: File upload fails silently
**Solution:**
- Check backend file size limits
- Verify media storage configuration
- Check file permissions on upload directory
- Look for CORS issues in browser console

---

## ✅ Sign-Off Criteria

The contract workflow is ready for production when:

- [ ] All 7 test scenarios pass successfully
- [ ] No console errors in browser
- [ ] No backend errors in Django logs
- [ ] Contract numbers generated correctly
- [ ] Permissions enforced at each stage
- [ ] Documents upload and display correctly
- [ ] Status transitions work as expected
- [ ] Modifications create successfully
- [ ] Error handling works gracefully
- [ ] UI updates in real-time after actions
- [ ] Toast notifications show for all actions
- [ ] Loading states display during operations
- [ ] Page refreshes maintain correct state

---

## 📝 Testing Notes Template

Use this template to document test results:

```
## Test Run: [Date/Time]
Tester: [Name]
Environment: [Dev/Staging/Prod]

### Test 1: Complete Submission Workflow
- [ ] PASS / [ ] FAIL
Issues: _________________________
Screenshots: ____________________

### Test 2: Rejection and Resubmission
- [ ] PASS / [ ] FAIL
Issues: _________________________

### Test 3: Multiple Document Upload
- [ ] PASS / [ ] FAIL
Issues: _________________________

### Test 4: Contract Modifications
- [ ] PASS / [ ] FAIL
Issues: _________________________

### Test 5: Permission Validation
- [ ] PASS / [ ] FAIL
Issues: _________________________

### Test 6: Contract Number Generation
- [ ] PASS / [ ] FAIL
Issues: _________________________

### Test 7: Error Handling
- [ ] PASS / [ ] FAIL
Issues: _________________________

## Overall Assessment:
- [ ] READY FOR PRODUCTION
- [ ] NEEDS FIXES
- [ ] NEEDS RETESTING

Critical Issues Found:
1. ____________________________
2. ____________________________

Non-Critical Issues:
1. ____________________________
2. ____________________________
```
