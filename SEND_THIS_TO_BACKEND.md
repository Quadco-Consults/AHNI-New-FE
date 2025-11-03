# 📧 Message for Backend Developer

## Subject: RFP Manual Bid Submission - Clarification on Requirements

Hi Backend Team,

There seems to be some confusion about what's needed for the RFP manual bid submission endpoint. Let me clarify:

---

## What We Need (Simple Version)

We need a **simple file upload endpoint** that accepts vendor proposal documents.

**That's it.** Nothing more.

---

## Endpoint Specification

### URL
```
POST /api/v1/procurements/manaul-bid/
```
*(Note: Keep the typo "manaul" as is)*

### Content-Type
```
multipart/form-data
```

### Input Fields

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `solicitation` | UUID string | Yes | The RFP ID |
| `vendor` | UUID string | Yes | The vendor submitting |
| `technical_documents` | File[] | Yes | 1+ PDF/DOC/DOCX files |
| `commercial_documents` | File[] | Yes | 1+ PDF/DOC/DOCX files |
| `evaluations` | JSON string | No | Optional evaluation responses |

### Example Request (cURL)
```bash
curl -X POST 'https://api.../procurements/manaul-bid/' \
  -H 'Authorization: Bearer TOKEN' \
  -F 'solicitation=550e8400-e29b-41d4-a716-446655440000' \
  -F 'vendor=660e8400-e29b-41d4-a716-446655440001' \
  -F 'technical_documents=@technical.pdf' \
  -F 'technical_documents=@profile.pdf' \
  -F 'commercial_documents=@pricing.pdf'
```

### What to Return
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
        "file_name": "technical.pdf",
        "file_url": "https://storage.../technical.pdf",
        "file_size": 2621440,
        "uploaded_at": "2025-11-03T10:30:00Z"
      }
    ],
    "commercial_documents": [
      {
        "id": "doc-uuid",
        "file_name": "pricing.pdf",
        "file_url": "https://storage.../pricing.pdf",
        "file_size": 1258291,
        "uploaded_at": "2025-11-03T10:30:00Z"
      }
    ],
    "created_at": "2025-11-03T10:30:00Z"
  }
}
```

---

## What You Should Build

### Step 1: Receive Files
```python
tech_files = request.FILES.getlist('technical_documents')
comm_files = request.FILES.getlist('commercial_documents')
```

### Step 2: Validate
- Check solicitation and vendor exist
- Ensure files are provided
- Validate file types (PDF/DOC/DOCX only)
- Check file sizes (<10MB)

### Step 3: Save
- Create submission record
- Upload files to storage
- Save file metadata to database

### Step 4: Return
- Return submission data with file URLs

**Total implementation: ~70 lines of code**

---

## What You Should NOT Build

Please **DO NOT** implement:

❌ Committee member management
❌ Individual scoring systems
❌ Consensus calculation algorithms
❌ Multi-phase evaluation workflows
❌ Real-time collaboration features
❌ Advanced analytics or reporting
❌ Document comparison tools
❌ Notification systems
❌ Complex state machines

**Why?** Those are separate features that may be built later, but are NOT part of this endpoint.

---

## Database Tables Needed

Only 3 simple tables:

### Table 1: rfp_submissions
```sql
CREATE TABLE rfp_submissions (
    id UUID PRIMARY KEY,
    solicitation_id UUID REFERENCES solicitations(id),
    vendor_id UUID REFERENCES vendors(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table 2: rfp_submission_documents
```sql
CREATE TABLE rfp_submission_documents (
    id UUID PRIMARY KEY,
    submission_id UUID REFERENCES rfp_submissions(id),
    document_type VARCHAR(20), -- 'technical' or 'commercial'
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### Table 3: rfp_submission_evaluations (optional)
```sql
CREATE TABLE rfp_submission_evaluations (
    id UUID PRIMARY KEY,
    submission_id UUID REFERENCES rfp_submissions(id),
    evaluation_criteria_id UUID REFERENCES evaluation_criteria(id),
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Estimate

- **Simple approach:** 2-4 hours
- **What we need:** Simple approach ✅

---

## Key Points

### 1. Multiple Files, Same Field Name
```python
# CORRECT ✅
files = request.FILES.getlist('technical_documents')

# WRONG ❌
file = request.FILES.get('technical_documents')  # Only gets first file
```

### 2. Evaluations is Optional
```python
# CORRECT ✅
evaluations = request.data.get('evaluations', None)
if evaluations:
    save_evaluations(json.loads(evaluations))

# WRONG ❌
evaluations = request.data['evaluations']  # Will crash if not provided
```

### 3. Use MultiPartParser
```python
# CORRECT ✅
parser_classes = [MultiPartParser, FormParser]

# WRONG ❌
parser_classes = [JSONParser]  # Files won't work
```

---

## Questions?

If anything is unclear, please ask:
1. Do you need clarification on the request format?
2. Do you need help with file upload handling?
3. Do you need help with the database schema?

But please **don't** ask about committee evaluation, scoring, or workflows - those are not part of this endpoint.

---

## Supporting Documents

For complete details, see:
- `RFP_BACKEND_SIMPLE_REQUIREMENTS.md` - Detailed requirements
- `RFP_BACKEND_IMPLEMENTATION_EXAMPLE.py` - Full Python example
- `RFP_REQUEST_EXAMPLE.json` - Request/response examples

---

## TL;DR

**What you're building:**
A simple file upload API that accepts documents from vendors and saves them.

**What you're NOT building:**
A complete RFP lifecycle management platform.

**Estimated time:**
2-4 hours

**Complexity:**
Low ⭐

---

Thanks!
Frontend Team

---

P.S. The "evaluations" field is just simple text responses to evaluation criteria. It's NOT a complex scoring system. Just save the text if it's provided.
