# RFP Manual Bid Submission - Frontend Implementation Specification

## Overview
This document describes the frontend implementation for RFP (Request for Proposal) manual bid submission. The frontend sends a **multipart/form-data** request with file uploads and JSON data.

---

## API Endpoint

```
POST /api/v1/procurements/manaul-bid/
```

**Note:** The endpoint has a typo "manaul" instead of "manual" - this is the actual backend endpoint.

---

## Request Format

The frontend sends data as **FormData** (multipart/form-data) to support file uploads.

### Content-Type
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
```

---

## Request Fields

### 1. Required Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `solicitation` | string (UUID) | The RFP solicitation ID | `"550e8400-e29b-41d4-a716-446655440000"` |
| `vendor` | string (UUID) | The vendor/company ID submitting the bid | `"660e8400-e29b-41d4-a716-446655440001"` |
| `technical_documents` | File[] | One or more technical proposal documents | Multiple PDF/DOC/DOCX files |
| `commercial_documents` | File[] | One or more commercial proposal documents | Multiple PDF/DOC/DOCX files |

### 2. Optional Fields

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `evaluations` | string (JSON array) | Evaluation criteria responses | See structure below |

---

## Evaluation Criteria Structure

If the RFP has evaluation criteria, the frontend sends responses as a JSON string:

```json
[
  {
    "response": "Our team has 10+ years experience in similar projects",
    "evaluation_criteria": "550e8400-e29b-41d4-a716-446655440002"
  },
  {
    "response": "We have ISO 9001 certification and relevant industry accreditations",
    "evaluation_criteria": "550e8400-e29b-41d4-a716-446655440003"
  }
]
```

**Field Details:**
- `response`: string - The vendor's response/answer to the criteria (can be empty string)
- `evaluation_criteria`: string (UUID) - The ID of the evaluation criteria being responded to

---

## FormData Structure

The frontend constructs the FormData as follows:

```javascript
const formData = new FormData();

// Add required fields
formData.append("solicitation", "550e8400-e29b-41d4-a716-446655440000");
formData.append("vendor", "660e8400-e29b-41d4-a716-446655440001");

// Add technical documents (multiple files)
formData.append("technical_documents", file1); // PDF/DOC/DOCX
formData.append("technical_documents", file2); // PDF/DOC/DOCX
formData.append("technical_documents", file3); // PDF/DOC/DOCX

// Add commercial documents (multiple files)
formData.append("commercial_documents", file1); // PDF/DOC/DOCX
formData.append("commercial_documents", file2); // PDF/DOC/DOCX

// Add evaluations (if any)
formData.append("evaluations", JSON.stringify([
  {
    "response": "Our team has 10+ years experience",
    "evaluation_criteria": "550e8400-e29b-41d4-a716-446655440002"
  }
]));
```

---

## File Upload Specifications

### Accepted File Types
- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)

### File Size Limit
- Maximum: 10MB per file (frontend validation)

### Multiple Files
- Both `technical_documents` and `commercial_documents` support **multiple file uploads**
- Files are appended with the **same field name** (not indexed like `technical_documents[0]`)

---

## Frontend Validation

Before submission, the frontend validates:

1. **Vendor Selection**
   - Error: "Please select a vendor"

2. **Technical Documents**
   - Must upload at least 1 file
   - Error: "Please upload technical documents"

3. **Commercial Documents**
   - Must upload at least 1 file
   - Error: "Please upload commercial documents"

4. **Solicitation ID**
   - Must be a valid UUID (auto-populated from URL)
   - Error: "Solicitation is required"

---

## Example Request (Raw HTTP)

```http
POST /api/v1/procurements/manaul-bid/ HTTP/1.1
Host: ahni-erp-029252c2fbb9.herokuapp.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Authorization: Bearer <token>

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="solicitation"

550e8400-e29b-41d4-a716-446655440000
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="vendor"

660e8400-e29b-41d4-a716-446655440001
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="technical_documents"; filename="technical_proposal.pdf"
Content-Type: application/pdf

[Binary file content]
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="technical_documents"; filename="company_profile.pdf"
Content-Type: application/pdf

[Binary file content]
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="commercial_documents"; filename="pricing.pdf"
Content-Type: application/pdf

[Binary file content]
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="evaluations"

[{"response":"Our team has 10+ years experience","evaluation_criteria":"550e8400-e29b-41d4-a716-446655440002"}]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

---

## Expected Backend Response

### Success Response (200/201)

```json
{
  "status": true,
  "message": "RFP proposal submitted successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440004",
    "solicitation": "550e8400-e29b-41d4-a716-446655440000",
    "vendor": "660e8400-e29b-41d4-a716-446655440001",
    "technical_documents": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440005",
        "file_url": "https://storage.../technical_proposal.pdf",
        "file_name": "technical_proposal.pdf",
        "uploaded_at": "2025-11-03T10:30:00Z"
      }
    ],
    "commercial_documents": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440006",
        "file_url": "https://storage.../pricing.pdf",
        "file_name": "pricing.pdf",
        "uploaded_at": "2025-11-03T10:30:00Z"
      }
    ],
    "evaluations": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440007",
        "response": "Our team has 10+ years experience",
        "evaluation_criteria": "550e8400-e29b-41d4-a716-446655440002"
      }
    ],
    "created_at": "2025-11-03T10:30:00Z",
    "updated_at": "2025-11-03T10:30:00Z"
  }
}
```

### Error Response (400)

```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "Validation failed",
  "data": {
    "solicitation": ["This field is required"],
    "vendor": ["This field is required"],
    "technical_documents": ["At least one technical document is required"],
    "commercial_documents": ["At least one commercial document is required"]
  }
}
```

---

## Backend Implementation Requirements

### 1. Database Schema

The backend should store:

#### Main Submission Table
```sql
CREATE TABLE rfp_submissions (
  id UUID PRIMARY KEY,
  solicitation_id UUID REFERENCES solicitations(id),
  vendor_id UUID REFERENCES vendors(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Documents Table
```sql
CREATE TABLE rfp_submission_documents (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES rfp_submissions(id),
  document_type VARCHAR(20), -- 'technical' or 'commercial'
  file_name VARCHAR(255),
  file_url VARCHAR(500),
  file_size INTEGER,
  uploaded_at TIMESTAMP
);
```

#### Evaluations Table
```sql
CREATE TABLE rfp_submission_evaluations (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES rfp_submissions(id),
  evaluation_criteria_id UUID REFERENCES evaluation_criteria(id),
  response TEXT,
  created_at TIMESTAMP
);
```

### 2. File Storage

- Store files in cloud storage (S3, Azure Blob, etc.)
- Generate unique file names to prevent conflicts
- Store original file name for display purposes
- Return accessible URLs in the response

### 3. Validation Rules

#### Required Validations:
- `solicitation`: Must be a valid UUID and exist in database
- `vendor`: Must be a valid UUID and exist in database
- `technical_documents`: At least 1 file required
- `commercial_documents`: At least 1 file required

#### File Validations:
- File type: Only PDF, DOC, DOCX allowed
- File size: Maximum 10MB per file (recommended)
- Scan for malware/viruses (recommended)

#### Optional Validations:
- Check if vendor is approved/active
- Check if RFP is still open for submissions
- Check if vendor has already submitted (prevent duplicates)

### 4. Processing Steps

1. **Validate request data**
   - Check required fields
   - Validate UUIDs
   - Validate file types and sizes

2. **Upload files to storage**
   - Upload technical documents
   - Upload commercial documents
   - Generate secure URLs

3. **Create database records**
   - Create submission record
   - Create document records
   - Create evaluation records (if provided)

4. **Return response**
   - Include all created data
   - Include file URLs for access

---

## Frontend Code Reference

The actual implementation code is in:
```
src/features/procurement/components/solicitation-management/RFP/[id]/Manual-bid-submission.tsx
```

### Key Code Snippet:

```typescript
const onSubmit = async (data: z.infer<typeof RFPSubmissionSchema>) => {
  // Create FormData for file upload
  const formData = new FormData();
  formData.append("solicitation", data.solicitation);
  formData.append("vendor", data.vendor);

  // Append technical documents
  Array.from(technicalFiles).forEach((file) => {
    formData.append(`technical_documents`, file);
  });

  // Append commercial documents
  Array.from(commercialFiles).forEach((file) => {
    formData.append(`commercial_documents`, file);
  });

  // Append evaluations if any
  if (data.evaluations && data.evaluations.length > 0) {
    formData.append("evaluations", JSON.stringify(data.evaluations));
  }

  await createSolicitationSubmission(formData);
};
```

---

## Differences from RFQ Submission

| Aspect | RFQ | RFP |
|--------|-----|-----|
| **Data Format** | JSON | FormData (multipart) |
| **Main Content** | Procurement items with pricing | Document uploads |
| **Items** | `bid_items` array with unit prices | No items - documents only |
| **Documents** | Optional/Supporting | Required (technical + commercial) |
| **Schema** | `SolicitationSubmissionSchema` | `RFPSubmissionSchema` |

---

## Testing Recommendations

### Backend Testing Checklist:

- [ ] Test with single file upload
- [ ] Test with multiple files upload
- [ ] Test file type validation (reject .exe, .zip, etc.)
- [ ] Test file size validation
- [ ] Test with missing required fields
- [ ] Test with invalid UUIDs
- [ ] Test with evaluations data
- [ ] Test without evaluations data
- [ ] Test duplicate submission handling
- [ ] Test file storage and URL generation
- [ ] Test response structure matches expected format

---

## Support & Questions

For questions about this implementation, contact the frontend development team or refer to:
- Schema definition: `src/features/procurement/types/procurement-validator.ts`
- Controller: `src/features/procurement/controllers/vendorBidSubmissionsController.ts`
- Component: `src/features/procurement/components/solicitation-management/RFP/[id]/Manual-bid-submission.tsx`

---

**Document Version:** 1.0
**Last Updated:** 2025-11-03
**Author:** Frontend Development Team
