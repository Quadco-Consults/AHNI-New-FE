# 🎯 Complete EOI System Handling Guide

## Overview
This guide provides a comprehensive approach to handling the EOI (Expression of Interest) system in the AHNI procurement platform. The EOI system supports three types of procurement opportunities and integrates with vendor registration workflows.

## ✅ What We Just Fixed

### 1. EOI Delete Functionality
- **File**: `/src/features/procurement/components/vendor-management/eoi/EOI.tsx:285-310`
- **Fixed**: Replaced mock delete with actual API call using `useDeleteEoi` hook
- **Status**: ✅ Complete

### 2. EOI Response Submission API
- **File**: `/src/features/procurement/controllers/eoiController.ts:173-256`
- **Added**:
  - `useSubmitEOIResponse()` - Submit vendor responses to EOI
  - `useGetEOISubmissions()` - Fetch submissions for an EOI
- **Status**: ✅ Complete (Frontend ready, needs backend)

## 🎯 EOI System Architecture

### EOI Types Supported

1. **NEW_VENDOR** 🆕
   - Purpose: Simple vendor registration
   - Flow: Public EOI → Vendor Registration → Admin Approval
   - Status: ✅ Working

2. **OPEN_TENDER** 📢
   - Purpose: Public bidding opportunities
   - Flow: Public EOI → Vendor Response → Evaluation → CBA Creation
   - Status: ✅ Working (needs backend for submissions)

3. **PROCUREMENT_WITH_REGISTRATION** 🔄
   - Purpose: Combined vendor registration + bid submission
   - Flow: Dual path (New vendor vs Existing vendor)
   - Status: ✅ Working

### Key Components

#### Admin Components
```
/src/features/procurement/components/vendor-management/eoi/
├── EOI.tsx                    # Main EOI management (CRUD)
├── EOI-vendor.tsx            # Legacy vendor submissions (deprecated)
└── eoi-tabs-contents/
    ├── EOIVendorSubmission.tsx    # Enhanced vendor submissions
    └── EoIDetails.tsx             # EOI details display
```

#### Public Components
```
/src/app/
├── eoi/[id]/page.tsx         # Public EOI submission portal
└── dashboard/procurement/vendor-management/eoi/
    ├── page.tsx              # Admin EOI list
    └── [id]/page.tsx         # Admin EOI details
```

## 🔧 Current Status & What Works

### ✅ Working Features

1. **EOI CRUD Operations**
   - Create EOI with file upload ✅
   - Read/List EOIs with pagination ✅
   - Update EOI ✅
   - Delete EOI ✅ (Just fixed!)

2. **Public EOI Portal**
   - View EOI details ✅
   - PDF document viewer ✅
   - Path selection (New vs Existing vendor) ✅

3. **Vendor Integration**
   - EOI → Vendor Registration flow ✅
   - Category-based filtering ✅
   - Status tracking ✅

4. **Form Validation**
   - Zod schemas for all forms ✅
   - TypeScript type safety ✅
   - Error handling ✅

### ⚠️ Needs Backend Support

1. **EOI Submissions**
   - API: `POST /api/procurements/eoi/{id}/submissions/`
   - API: `GET /api/procurements/eoi/{id}/submissions/`

2. **Vendor-EOI Linking**
   - Database: `vendors.eoi_id` field
   - API: `GET /api/procurements/vendors/?eoi_id={id}`

3. **Evaluation Workflow**
   - Update submission status
   - Assign evaluators
   - Create CBA from submissions

## 🚀 How to Use the EOI System

### For Admins

#### 1. Create an EOI
```bash
# Navigate to EOI management
http://localhost:3001/dashboard/procurement/vendor-management/eoi

# Click "+" to create new EOI
# Fill form:
- Name: "Medical Equipment Procurement"
- Type: PROCUREMENT_WITH_REGISTRATION
- Categories: Medical Equipment, Supplies
- Documents: Upload PDF specification
- Dates: Set opening/closing dates
```

#### 2. Manage EOI Submissions
```bash
# View EOI details
http://localhost:3001/dashboard/procurement/vendor-management/eoi/[id]

# Switch to "Vendor Submissions" tab
# Features available:
- Search vendor submissions
- Filter by prequalification status
- View vendor details
- Create CBA (for OPEN_TENDER)
- Add new vendors
```

### For Vendors

#### 1. Public EOI Response
```bash
# Public EOI page
http://localhost:3001/eoi/[id]

# For NEW_VENDOR or PROCUREMENT_WITH_REGISTRATION:
- Select "New Vendor" path
- Fill registration + response form
- Upload supporting documents
- Submit

# For existing vendors:
- Click "Login to Submit"
- Redirects to vendor portal
```

#### 2. Vendor Portal Submission
```bash
# From vendor dashboard
http://localhost:3001/vendor-portal/dashboard

# Available RFQs section shows EOI opportunities
# Click to submit bid response
```

## 🔄 Complete EOI Workflow

### Workflow 1: NEW_VENDOR EOI
```
1. Admin creates NEW_VENDOR EOI
2. Public can view at /eoi/[id]
3. Vendors register through EOI link
4. Admin reviews vendors in submissions tab
5. Admin approves/rejects vendors
6. Approved vendors can access future RFQs
```

### Workflow 2: OPEN_TENDER EOI
```
1. Admin creates OPEN_TENDER EOI
2. Public/vendors submit responses
3. Admin evaluates submissions
4. Admin creates CBA from qualified submissions
5. CBA process continues with selected vendors
```

### Workflow 3: PROCUREMENT_WITH_REGISTRATION
```
1. Admin creates PROCUREMENT_WITH_REGISTRATION EOI
2. Two paths available:
   a) New vendors: Register + Submit in one flow
   b) Existing vendors: Login and submit bid
3. Admin evaluates both registrations and bids
4. Qualified vendors proceed to contract award
```

## 🛠️ Backend Implementation Requirements

### 1. Database Schema
```sql
-- EOI Submissions table
CREATE TABLE eoi_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eoi_id UUID REFERENCES eoi(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,

    -- Company information (for new vendors)
    company_info JSONB,

    -- Proposal data
    technical_proposal JSONB,
    financial_proposal JSONB,

    -- Status tracking
    status VARCHAR(20) DEFAULT 'SUBMITTED',
    evaluation_status VARCHAR(20) DEFAULT 'UNREVIEWED',

    -- Timestamps
    submitted_date TIMESTAMP DEFAULT NOW(),
    evaluated_date TIMESTAMP,

    -- Evaluation
    evaluator_id UUID REFERENCES users(id),
    evaluation_notes TEXT,
    qualification_score DECIMAL(5,2),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add eoi_id to vendors table
ALTER TABLE vendors ADD COLUMN eoi_id UUID REFERENCES eoi(id);
ALTER TABLE vendors ADD COLUMN evaluation_status VARCHAR(20) DEFAULT 'UNREVIEWED';

-- EOI submission documents
CREATE TABLE eoi_submission_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES eoi_submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### 2. API Endpoints
```python
# EOI Submissions
@api_view(['POST'])
def submit_eoi_response(request, eoi_id):
    """Submit vendor response to EOI"""
    # Handle multipart form data
    # Create submission record
    # Save uploaded documents
    # If PROCUREMENT_WITH_REGISTRATION, also create vendor

@api_view(['GET'])
def get_eoi_submissions(request, eoi_id):
    """Get all submissions for an EOI"""
    # Return paginated submissions
    # Include vendor details
    # Support filtering by status

@api_view(['PATCH'])
def evaluate_submission(request, eoi_id, submission_id):
    """Evaluate a vendor submission"""
    # Update evaluation status
    # Add evaluator notes
    # Set qualification score

# Vendor filtering
@api_view(['GET'])
def get_vendors_by_eoi(request):
    """Get vendors filtered by EOI"""
    eoi_id = request.GET.get('eoi_id')
    if eoi_id:
        return vendors.filter(eoi_id=eoi_id)
```

### 3. File Upload Handling
```python
# Handle multipart form data
def handle_eoi_submission_files(submission, files):
    for key, file in files.items():
        if key.startswith('document_'):
            doc = EOISubmissionDocument.objects.create(
                submission=submission,
                file_name=file.name,
                file_path=save_file(file, f'eoi_submissions/{submission.id}/'),
                file_type=file.content_type,
                file_size=file.size
            )
```

## 🧪 Testing the EOI System

### Test Scenarios

#### 1. Admin EOI Management
```bash
# Test EOI CRUD
1. Create EOI with all types
2. Edit EOI details
3. Delete EOI (now working!)
4. Upload/view documents

# Test vendor submissions
1. View submissions list
2. Search/filter submissions
3. Evaluate submissions
4. Create CBA from OPEN_TENDER
```

#### 2. Public EOI Submission
```bash
# Test NEW_VENDOR flow
1. Navigate to /eoi/[id]
2. Submit vendor registration
3. Check admin sees submission

# Test PROCUREMENT_WITH_REGISTRATION
1. Test new vendor path
2. Test existing vendor path
3. Verify data flows correctly
```

#### 3. Integration Testing
```bash
# Test EOI → Vendor → RFQ flow
1. Create PROCUREMENT_WITH_REGISTRATION EOI
2. Submit vendor response
3. Admin approves vendor
4. Vendor appears in vendor portal
5. Vendor can access RFQs
```

## 📋 Current Issues & Solutions

### Issue 1: Vendor Submissions Using Mock Data
- **Status**: ⚠️ Needs backend migration
- **File**: `EOIVendorSubmission.tsx`
- **Solution**: Backend needs to add `eoi_id` field to vendors table

### Issue 2: EOI Response Submission Mocked
- **Status**: ✅ API ready, needs backend
- **File**: `EOIVendorSubmission.tsx`
- **Solution**: Backend needs to implement submission endpoints

### Issue 3: No Evaluation Workflow
- **Status**: ⚠️ Needs design & implementation
- **Solution**: Create evaluation forms and status management

## 🎯 Next Steps

### Immediate (Frontend Complete)
1. ✅ EOI delete functionality - DONE
2. ✅ EOI submission API hooks - DONE

### Backend Required
1. 🔄 Implement EOI submission endpoints
2. 🔄 Add eoi_id field to vendors table
3. 🔄 Create submission evaluation workflow

### Enhancement
1. 🔄 Add submission analytics dashboard
2. 🔄 Improve evaluation workflow
3. 🔄 Add automated qualification scoring

## 📊 Success Metrics

When fully implemented, the EOI system should support:
- ✅ Multiple EOI types with different workflows
- ✅ Seamless vendor registration integration
- ✅ Document upload and management
- ✅ Admin evaluation tools
- ✅ Public submission portal
- ✅ Vendor portal integration

The frontend is now complete and ready for backend implementation!