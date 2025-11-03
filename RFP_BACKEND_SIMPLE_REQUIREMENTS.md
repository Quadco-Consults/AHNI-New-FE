# RFP Manual Bid Submission - SIMPLE Backend Requirements

## ⚠️ IMPORTANT: Keep It Simple!

This endpoint is **ONLY** for receiving vendor document submissions.

**You do NOT need:**
- ❌ Committee member evaluation logic
- ❌ Scoring algorithms
- ❌ Consensus calculations
- ❌ Multi-phase workflows
- ❌ Real-time collaboration
- ❌ Advanced analytics

Those are **separate features** that happen AFTER submission.

---

## What This Endpoint Does

**Single Purpose:** Accept vendor proposal documents and store them.

```
Vendor submits documents → Backend saves them → Done ✅
```

---

## Endpoint Specification

```
POST /api/v1/procurements/manaul-bid/
Content-Type: multipart/form-data
```

---

## Required Fields

| Field | Type | Validation |
|-------|------|------------|
| `solicitation` | UUID string | Must exist in database |
| `vendor` | UUID string | Must exist and be approved |
| `technical_documents` | File[] | At least 1 PDF/DOC/DOCX file |
| `commercial_documents` | File[] | At least 1 PDF/DOC/DOCX file |

## Optional Fields

| Field | Type | Notes |
|-------|------|-------|
| `evaluations` | JSON string | Only if RFP has evaluation criteria |

---

## Minimal Database Schema

### Table 1: rfp_submissions
```sql
CREATE TABLE rfp_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitation_id UUID NOT NULL REFERENCES solicitations(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(solicitation_id, vendor_id) -- Prevent duplicate submissions
);
```

### Table 2: rfp_submission_documents
```sql
CREATE TABLE rfp_submission_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES rfp_submissions(id),
    document_type VARCHAR(20) NOT NULL, -- 'technical' or 'commercial'
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### Table 3: rfp_submission_evaluations (Optional)
```sql
CREATE TABLE rfp_submission_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES rfp_submissions(id),
    evaluation_criteria_id UUID NOT NULL REFERENCES evaluation_criteria(id),
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**That's it!** Only 3 tables needed.

---

## Minimal Backend Logic (Pseudocode)

```python
def create_rfp_submission(request):
    """
    Simple endpoint to receive and store RFP submissions.
    No complex logic - just save files and return confirmation.
    """

    # 1. Extract data
    solicitation_id = request.data.get('solicitation')
    vendor_id = request.data.get('vendor')
    technical_files = request.FILES.getlist('technical_documents')
    commercial_files = request.FILES.getlist('commercial_documents')
    evaluations_json = request.data.get('evaluations')  # Optional

    # 2. Basic validation
    if not solicitation_id:
        return error_response("solicitation is required")

    if not vendor_id:
        return error_response("vendor is required")

    if not technical_files:
        return error_response("technical_documents required")

    if not commercial_files:
        return error_response("commercial_documents required")

    # 3. Validate files
    for file in technical_files + commercial_files:
        if not file.name.endswith(('.pdf', '.doc', '.docx')):
            return error_response(f"Invalid file type: {file.name}")
        if file.size > 10_485_760:  # 10MB
            return error_response(f"File too large: {file.name}")

    # 4. Create submission record
    submission = RFPSubmission.objects.create(
        solicitation_id=solicitation_id,
        vendor_id=vendor_id
    )

    # 5. Save technical documents
    for file in technical_files:
        saved_file = save_to_storage(file)  # Your file storage logic
        RFPSubmissionDocument.objects.create(
            submission=submission,
            document_type='technical',
            file_name=file.name,
            file_url=saved_file.url,
            file_size=file.size
        )

    # 6. Save commercial documents
    for file in commercial_files:
        saved_file = save_to_storage(file)
        RFPSubmissionDocument.objects.create(
            submission=submission,
            document_type='commercial',
            file_name=file.name,
            file_url=saved_file.url,
            file_size=file.size
        )

    # 7. Save evaluation responses (if provided)
    if evaluations_json:
        evaluations = json.loads(evaluations_json)
        for eval_data in evaluations:
            RFPSubmissionEvaluation.objects.create(
                submission=submission,
                evaluation_criteria_id=eval_data['evaluation_criteria'],
                response=eval_data.get('response', '')
            )

    # 8. Return success response
    return success_response({
        "id": submission.id,
        "solicitation": solicitation_id,
        "vendor": vendor_id,
        "technical_documents": [
            {
                "id": doc.id,
                "file_name": doc.file_name,
                "file_url": doc.file_url,
                "file_size": doc.file_size
            }
            for doc in submission.documents.filter(document_type='technical')
        ],
        "commercial_documents": [
            {
                "id": doc.id,
                "file_name": doc.file_name,
                "file_url": doc.file_url,
                "file_size": doc.file_size
            }
            for doc in submission.documents.filter(document_type='commercial')
        ],
        "created_at": submission.created_at
    })
```

**Total Lines:** ~70 lines of actual code. Very simple!

---

## Response Format

### Success (201 Created)
```json
{
  "status": true,
  "message": "RFP proposal submitted successfully",
  "data": {
    "id": "submission-uuid",
    "solicitation": "rfp-uuid",
    "vendor": "vendor-uuid",
    "technical_documents": [
      {
        "id": "doc-uuid",
        "file_name": "technical_proposal.pdf",
        "file_url": "https://storage.../technical_proposal.pdf",
        "file_size": 2621440
      }
    ],
    "commercial_documents": [
      {
        "id": "doc-uuid",
        "file_name": "pricing.pdf",
        "file_url": "https://storage.../pricing.pdf",
        "file_size": 1258291
      }
    ],
    "created_at": "2025-11-03T10:30:00Z"
  }
}
```

### Error (400 Bad Request)
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "technical_documents is required",
  "data": null
}
```

---

## File Storage

Choose ONE simple approach:

### Option 1: Local Filesystem (Development)
```python
MEDIA_ROOT = '/var/www/media/rfp_submissions/'
MEDIA_URL = '/media/'
```

### Option 2: Cloud Storage (Production)
```python
# AWS S3, Azure Blob, or similar
# Use your existing file upload service
```

**Don't overcomplicate!** Use whatever file storage you already have.

---

## Testing Checklist

- [ ] Can accept UUID for solicitation and vendor
- [ ] Can receive multiple files for technical_documents
- [ ] Can receive multiple files for commercial_documents
- [ ] Validates file types (PDF/DOC/DOCX only)
- [ ] Validates file sizes (reject >10MB)
- [ ] Saves files to storage
- [ ] Returns accessible file URLs
- [ ] Handles evaluations JSON (optional)
- [ ] Returns proper error messages
- [ ] Prevents duplicate submissions (same vendor + solicitation)

---

## Common Mistakes to Avoid

### ❌ DON'T: Build complex evaluation system
```python
# NO! This is separate functionality!
def calculate_vendor_score(submission):
    committee_scores = get_committee_evaluations()
    consensus = calculate_weighted_consensus()
    # ... complex logic
```

### ✅ DO: Just save the submission
```python
# YES! Keep it simple
def create_submission(data):
    submission = save(data)
    return submission
```

---

### ❌ DON'T: Use request.FILES.get() for multiple files
```python
# WRONG - only gets first file
file = request.FILES.get('technical_documents')
```

### ✅ DO: Use request.FILES.getlist()
```python
# CORRECT - gets all files
files = request.FILES.getlist('technical_documents')
```

---

### ❌ DON'T: Require evaluations
```python
# WRONG - evaluations are optional!
if not request.data['evaluations']:
    return error("evaluations required")
```

### ✅ DO: Make evaluations optional
```python
# CORRECT - evaluations are optional
evaluations = request.data.get('evaluations', None)
if evaluations:
    save_evaluations(evaluations)
```

---

## What Happens After Submission?

**This endpoint's job is done!** ✅

Later, procurement officers or committee members will:
1. View all submissions
2. Download and review documents
3. Evaluate and score vendors
4. Select winner

**But that's in DIFFERENT endpoints!** Not this one.

---

## Summary

### This Endpoint Should:
✅ Accept files
✅ Validate files
✅ Save files
✅ Return confirmation

### This Endpoint Should NOT:
❌ Score vendors
❌ Calculate consensus
❌ Manage committees
❌ Generate analytics
❌ Compare proposals

**Keep it simple!** Just receive and store documents.

---

## Need Help?

If backend developer is confused, show them:
1. This document (simplest requirements)
2. `RFP_BACKEND_IMPLEMENTATION_EXAMPLE.py` (line 104-140 - the create() method)

Ignore all the complex stuff about committees, scoring, phases, etc. That's NOT needed here.

---

**Last Updated:** 2025-11-03
**Complexity Level:** SIMPLE ⭐
**Estimated Implementation Time:** 2-4 hours
