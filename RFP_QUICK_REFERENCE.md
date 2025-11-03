# RFP Manual Bid Submission - Quick Reference Guide

## For Backend Developers

### Endpoint
```
POST /api/v1/procurements/manaul-bid/
```
⚠️ **Note:** URL has typo "manaul" (not "manual") - keep it as is!

---

## What Frontend Sends

### Content Type
```
multipart/form-data
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `solicitation` | UUID string | ✅ Yes | RFP ID |
| `vendor` | UUID string | ✅ Yes | Vendor ID |
| `technical_documents` | File(s) | ✅ Yes | PDF/DOC/DOCX files |
| `commercial_documents` | File(s) | ✅ Yes | PDF/DOC/DOCX files |
| `evaluations` | JSON string | ❌ No | Evaluation responses |

---

## Example Request Data

```javascript
// FormData structure
{
  solicitation: "550e8400-e29b-41d4-a716-446655440000",
  vendor: "660e8400-e29b-41d4-a716-446655440001",
  technical_documents: [File, File, File],  // Multiple PDF files
  commercial_documents: [File, File],        // Multiple PDF files
  evaluations: '[{"response":"...", "evaluation_criteria":"UUID"}]'
}
```

---

## How to Receive Files (Backend)

### Python/Django Example
```python
# Get multiple files
technical_files = request.FILES.getlist('technical_documents')
commercial_files = request.FILES.getlist('commercial_documents')

# Parse evaluations JSON string
evaluations = json.loads(request.data.get('evaluations', '[]'))
```

### Node.js/Express + Multer Example
```javascript
// Using multer middleware
const upload = multer({ dest: 'uploads/' });

app.post('/api/v1/procurements/manaul-bid/',
  upload.fields([
    { name: 'technical_documents', maxCount: 10 },
    { name: 'commercial_documents', maxCount: 10 }
  ]),
  (req, res) => {
    const solicitation = req.body.solicitation;
    const vendor = req.body.vendor;
    const technicalDocs = req.files.technical_documents;
    const commercialDocs = req.files.commercial_documents;
    const evaluations = JSON.parse(req.body.evaluations || '[]');
  }
);
```

---

## Validation Rules

### Required Checks
- ✅ `solicitation` must exist in database
- ✅ `vendor` must exist and be approved
- ✅ At least 1 technical document
- ✅ At least 1 commercial document

### File Validation
- ✅ File types: `.pdf`, `.doc`, `.docx` only
- ✅ Max size: 10MB per file
- ✅ Scan for malware (recommended)

### Business Rules (Optional)
- ✅ RFP must be open for submissions
- ✅ Check for duplicate submissions
- ✅ Vendor must be eligible

---

## Expected Response Format

### Success (201 Created)
```json
{
  "status": true,
  "message": "RFP proposal submitted successfully",
  "data": {
    "id": "770e8400-...",
    "solicitation": "550e8400-...",
    "vendor": "660e8400-...",
    "technical_documents": [
      {
        "id": "880e8400-...",
        "file_url": "https://storage.../file.pdf",
        "file_name": "technical_proposal.pdf",
        "file_size": 2621440,
        "uploaded_at": "2025-11-03T10:30:00Z"
      }
    ],
    "commercial_documents": [
      {
        "id": "990e8400-...",
        "file_url": "https://storage.../file.pdf",
        "file_name": "pricing.pdf",
        "file_size": 1258291,
        "uploaded_at": "2025-11-03T10:30:00Z"
      }
    ],
    "evaluations": [
      {
        "id": "aa0e8400-...",
        "response": "Our team has experience...",
        "evaluation_criteria": "550e8400-..."
      }
    ],
    "created_at": "2025-11-03T10:30:00Z",
    "updated_at": "2025-11-03T10:30:00Z"
  }
}
```

### Error (400 Bad Request)
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "solicitation: This field is required.",
  "data": null
}
```

---

## Database Tables Needed

### 1. Main Submission
```sql
rfp_submissions
├─ id (UUID, PK)
├─ solicitation_id (UUID, FK)
├─ vendor_id (UUID, FK)
├─ created_at (TIMESTAMP)
└─ updated_at (TIMESTAMP)
```

### 2. Documents
```sql
rfp_submission_documents
├─ id (UUID, PK)
├─ submission_id (UUID, FK)
├─ document_type (VARCHAR) -- 'technical' or 'commercial'
├─ file_name (VARCHAR)
├─ file_url (VARCHAR)
├─ file_size (INTEGER)
└─ uploaded_at (TIMESTAMP)
```

### 3. Evaluations
```sql
rfp_submission_evaluations
├─ id (UUID, PK)
├─ submission_id (UUID, FK)
├─ evaluation_criteria_id (UUID, FK)
├─ response (TEXT)
└─ created_at (TIMESTAMP)
```

---

## Common Mistakes to Avoid

### ❌ WRONG: Using GET instead of GETLIST
```python
file = request.FILES.get('technical_documents')  # Only gets first file
```

### ✅ CORRECT: Using GETLIST
```python
files = request.FILES.getlist('technical_documents')  # Gets all files
```

---

### ❌ WRONG: Treating evaluations as object
```python
evaluations = request.data.get('evaluations')  # This is a string!
```

### ✅ CORRECT: Parsing evaluations JSON
```python
evaluations = json.loads(request.data.get('evaluations', '[]'))
```

---

### ❌ WRONG: Using JSONParser
```python
parser_classes = [JSONParser]  # Files won't work!
```

### ✅ CORRECT: Using MultiPartParser
```python
parser_classes = [MultiPartParser, FormParser]
```

---

## Quick Test with cURL

```bash
curl -X POST 'https://your-api.com/api/v1/procurements/manaul-bid/' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'solicitation=550e8400-e29b-41d4-a716-446655440000' \
  -F 'vendor=660e8400-e29b-41d4-a716-446655440001' \
  -F 'technical_documents=@/path/to/technical.pdf' \
  -F 'technical_documents=@/path/to/profile.pdf' \
  -F 'commercial_documents=@/path/to/pricing.pdf' \
  -F 'evaluations=[{"response":"Test","evaluation_criteria":"uuid-here"}]'
```

---

## Quick Test with Postman

1. **Method:** POST
2. **URL:** `https://your-api.com/api/v1/procurements/manaul-bid/`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`
4. **Body:** (form-data)
   - `solicitation`: `550e8400-e29b-41d4-a716-446655440000` (Text)
   - `vendor`: `660e8400-e29b-41d4-a716-446655440001` (Text)
   - `technical_documents`: Select file (File)
   - `technical_documents`: Select another file (File)
   - `commercial_documents`: Select file (File)
   - `evaluations`: `[{"response":"Test","evaluation_criteria":"uuid"}]` (Text)

---

## Processing Steps

1. **Validate request data**
   - Check UUIDs are valid
   - Check required fields present
   - Validate file types/sizes

2. **Check business rules**
   - Verify solicitation exists and is open
   - Verify vendor exists and is approved
   - Check for duplicate submissions

3. **Upload files**
   - Save to storage (filesystem/S3/etc)
   - Generate secure file names
   - Create file URLs

4. **Save to database**
   - Create submission record
   - Create document records
   - Create evaluation records

5. **Return response**
   - Include all created data
   - Include accessible file URLs

---

## File Storage Tips

### Local Storage (Development)
```python
MEDIA_ROOT = '/var/www/media/'
MEDIA_URL = '/media/'
```

### Cloud Storage (Production)
```python
# AWS S3
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_STORAGE_BUCKET_NAME = 'your-bucket'
AWS_S3_REGION_NAME = 'us-east-1'
```

---

## Key Differences: RFP vs RFQ

| Aspect | RFQ | RFP |
|--------|-----|-----|
| **Format** | JSON | FormData |
| **Main Data** | Items + Prices | Documents |
| **Content-Type** | application/json | multipart/form-data |
| **Fields** | bid_items[] | technical_documents + commercial_documents |

---

## Need Help?

Refer to these files for more details:
- 📄 `RFP_MANUAL_BID_SUBMISSION_API_SPEC.md` - Full specification
- 📄 `RFP_REQUEST_EXAMPLE.json` - Request examples
- 🐍 `RFP_BACKEND_IMPLEMENTATION_EXAMPLE.py` - Django implementation

Frontend code location:
```
src/features/procurement/components/solicitation-management/RFP/[id]/Manual-bid-submission.tsx
```

---

**Last Updated:** 2025-11-03
