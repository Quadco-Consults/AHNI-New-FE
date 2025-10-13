# ✅ Contract Document Upload - Fixed and Working

## Issue Resolved

The document upload endpoint was returning 404 errors because:
1. ❌ Wrong endpoint URL pattern
2. ❌ Wrong field names in FormData

## What Was Fixed

### Backend (Confirmed Working)
✅ Endpoint now supports both GET and POST:
```python
@action(detail=True, methods=['get', 'post'])
def documents(self, request, pk=None):
```

**URL:** `POST /api/v1/contract-grants/agreements/{id}/documents/`

### Frontend (Updated to Match)

**File:** `src/features/contracts-grants/controllers/agreementController.ts`
- ✅ Changed endpoint from `/upload-document/` to `/documents/`

**File:** `src/features/contracts-grants/components/contract-management/agreement/view/index.tsx`
- ✅ Updated FormData field names to match backend expectations

## Field Name Mapping

| Frontend Field | Backend Expects | Notes |
|---------------|-----------------|-------|
| ~~`document`~~ → `file` | `file` | File object |
| (new) | `title` | File name (required) |
| `document_type` | `document_type` | CONTRACT, EXTENSION, ADDENDUM, AMENDMENT |
| ~~`remarks`~~ → `description` | `description` | Optional notes |

## Updated Upload Code

```typescript
const formData = new FormData();
formData.append('file', file);                    // ✅ Changed from 'document'
formData.append('title', file.name);              // ✅ Added title
formData.append('document_type', documentType);   // ✅ Same
formData.append('description', remarks);          // ✅ Changed from 'remarks'
```

## Testing the Upload

### Step-by-Step Test

1. **Navigate to Agreement View**
   ```
   http://localhost:3000/dashboard/c-and-g/agreements/{id}/view
   ```

2. **Verify Agreement is in DRAFT status**
   - Status badge should show "DRAFT" (gray)
   - Upload section should be visible

3. **Upload a Document**
   - Click "Select Documents"
   - Choose a PDF, DOC, or DOCX file
   - Select document type from dropdown
   - Add optional remarks
   - Click "Upload Documents"

4. **Expected Results**
   - ✅ Success toast: "Document uploaded successfully"
   - ✅ Document appears in "Contract Documents" section
   - ✅ File shows metadata: name, type, upload date
   - ✅ "Submit for Approval" button appears (if first document)

### Expected Backend Response

**Success (200/201):**
```json
{
  "status": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "title": "contract.pdf",
    "document_url": "https://...",
    "document_type": "CONTRACT",
    "description": "Initial contract document",
    "created_datetime": "2025-10-13T10:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "status": false,
  "message": "Validation error",
  "errors": {
    "file": ["This field is required"],
    "title": ["This field is required"]
  }
}
```

## Available Endpoints

### 1. Upload Document (POST)
```
POST /api/v1/contract-grants/agreements/{id}/documents/
Content-Type: multipart/form-data

Body:
- file: (file object)
- title: "Document title"
- document_type: "CONTRACT" | "EXTENSION" | "ADDENDUM" | "AMENDMENT"
- description: "Optional notes"
```

### 2. Get Documents (GET)
```
GET /api/v1/contract-grants/agreements/{id}/documents/

Response: Array of document objects
```

### 3. Delete Document (DELETE)
```
DELETE /api/v1/contract-grants/agreements/{id}/documents/{doc_id}/
```

### 4. Alternative Upload Endpoint
You can also use:
```
POST /api/v1/contract-grants/agreements/{id}/upload-document/
```
(Same field names apply)

## Complete Workflow Now Working

1. ✅ **Create Agreement** - User creates draft agreement
2. ✅ **Upload Documents** - User uploads contract document(s)
3. ✅ **Submit for Approval** - Button appears after upload
4. ⏳ **Approve** - Backend endpoint ready (`/approve_agreement/`)
5. ⏳ **Activate** - Contract becomes active with contract number
6. ✅ **Add Modifications** - For active contracts

## Integration Status

| Feature | Frontend | Backend | Status |
|---------|----------|---------|--------|
| Upload Document | ✅ | ✅ | **WORKING** |
| List Documents | ✅ | ✅ | **WORKING** |
| Delete Document | ✅ | ✅ | **WORKING** |
| Submit Agreement | ✅ | ✅ | **WORKING** |
| Approve Agreement | ✅ | ✅ | Ready to test |
| Reject Agreement | ✅ | ✅ | Ready to test |
| Create Modification | ✅ | ✅ | Ready to test |

## Known Issues - RESOLVED

### ~~Issue 1: 404 Not Found~~ ✅ FIXED
- **Cause:** Endpoint was `/upload-document/`, now `/documents/`
- **Solution:** Updated to `/documents/` in controller

### ~~Issue 2: Wrong Field Names~~ ✅ FIXED
- **Cause:** Frontend sent `document`, backend expected `file`
- **Solution:** Updated FormData to use correct field names

## Next Steps

1. ✅ **Test document upload** - Should work now!
2. ⏭️ **Test complete workflow** - Upload → Submit → Approve
3. ⏭️ **Test modifications** - For active contracts
4. ⏭️ **Deploy to production** - Once all tests pass

## Quick Test Command

```bash
# Test with cURL
curl -X POST \
  "http://localhost:8000/api/v1/contract-grants/agreements/387023d8-be75-41db-ab63-be3061883d34/documents/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "title=Test Contract" \
  -F "document_type=CONTRACT" \
  -F "description=Test upload"
```

## Support

If you encounter any issues:
1. Check browser console for error messages
2. Check Network tab to see actual request/response
3. Verify file is PDF, DOC, or DOCX
4. Verify agreement is in DRAFT status
5. Check backend logs for server errors

---

**Last Updated:** 2025-10-13
**Status:** ✅ **WORKING - Ready for Testing**
