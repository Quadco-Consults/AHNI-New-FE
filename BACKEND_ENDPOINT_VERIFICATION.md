# Backend Endpoint Verification Guide

## Issue
The frontend is getting **404 Not Found** errors when trying to upload documents:
```
POST /api/v1/contract-grants/agreements/{id}/documents/ → 404
```

## Backend Endpoints to Verify

According to your backend summary, these features **already exist**:

### ✅ Existing Endpoints (Should Work)
1. **Upload Document** - Need to verify the actual URL pattern
2. **Get Documents** - `GET /agreements/{id}/documents/`
3. **Delete Document** - `DELETE /agreements/{id}/documents/{doc_id}/`

### ✅ New Endpoints (Recently Added)
4. **Submit Agreement** - `POST /agreements/{id}/submit/`
5. **Approve Agreement** - `POST /agreements/{id}/approve_agreement/`
6. **Reject Agreement** - `POST /agreements/{id}/reject/`
7. **Extend Agreement** - `POST /agreements/{id}/extend/` (existing)

## How to Find the Correct Endpoint

### Option 1: Check Django URLs Configuration

In your backend code, find the URL patterns:

```bash
# Look in these files:
modules/contract_grants/urls.py
modules/contract_grants/endpoints/contract_management/agreement.py
```

Look for patterns like:
```python
# URL pattern for document upload
path('agreements/<uuid:pk>/documents/', DocumentUploadView.as_view()),
# OR
path('agreements/<uuid:pk>/upload-document/', DocumentUploadView.as_view()),
# OR
@action(detail=True, methods=['post'])
def upload_document(self, request, pk=None):
    # ...
```

### Option 2: Check Django Admin or API Browser

1. Go to your Django REST Framework browsable API:
   ```
   https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/agreements/
   ```

2. Look for available actions on an agreement detail page

3. Check the URL patterns in the API root

### Option 3: Check Existing Working Features

Look at other parts of the frontend that upload documents successfully:

```bash
# Search for working document uploads in the codebase
grep -r "upload.*document" src/features/ --include="*.ts" --include="*.tsx"
```

## Current Frontend Endpoint Configuration

File: `src/features/contracts-grants/controllers/agreementController.ts`

```typescript
// Line 188 - Current configuration
endpoint: `${BASE_URL}${agreementId}/documents/`
// Full URL: /contract-grants/agreements/{id}/documents/
```

## Possible Backend URL Patterns

The backend might be using one of these patterns:

### Pattern 1: Nested Resource (REST standard)
```
POST /contract-grants/agreements/{id}/documents/
```
✅ This is what we're currently trying

### Pattern 2: Action Endpoint
```
POST /contract-grants/agreements/{id}/upload-document/
```
❌ This returned 404

### Pattern 3: ViewSet Action
```
POST /contract-grants/agreements/{id}/add-document/
```

### Pattern 4: Separate Documents Endpoint
```
POST /contract-grants/agreement-documents/
Body: { "agreement": "agreement_id", "document": file }
```

### Pattern 5: Different Base Path
```
POST /contract-grants/documents/
Body: { "agreement": "agreement_id", "document": file }
```

## Testing the Endpoints

### Using cURL

Test if the endpoint exists:

```bash
# Test GET (list documents)
curl -X GET \
  "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/agreements/387023d8-be75-41db-ab63-be3061883d34/documents/" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test POST (upload document) - Pattern 1
curl -X POST \
  "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/agreements/387023d8-be75-41db-ab63-be3061883d34/documents/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@test.pdf" \
  -F "document_type=CONTRACT"

# Test POST - Pattern 2
curl -X POST \
  "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/agreements/387023d8-be75-41db-ab63-be3061883d34/upload-document/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "document=@test.pdf"
```

### Using Postman

1. Create a new request
2. Method: POST
3. URL: `https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/contract-grants/agreements/387023d8-be75-41db-ab63-be3061883d34/documents/`
4. Headers: `Authorization: Bearer {token}`
5. Body: form-data
   - Key: `document` (type: file)
   - Key: `document_type` (type: text, value: "CONTRACT")
6. Send

## Backend Code to Check

Ask your backend team to check these files:

### 1. URL Configuration
```python
# modules/contract_grants/urls.py
urlpatterns = [
    path('agreements/', include('modules.contract_grants.endpoints.contract_management.agreement')),
]
```

### 2. ViewSet Actions
```python
# modules/contract_grants/endpoints/contract_management/agreement.py
class AgreementViewSet(viewsets.ModelViewSet):

    @action(detail=True, methods=['post'], url_path='upload-document')
    def upload_document(self, request, pk=None):
        # This creates: /agreements/{id}/upload-document/
        pass

    # OR nested resource:
    @action(detail=True, methods=['post'])
    def documents(self, request, pk=None):
        # This creates: /agreements/{id}/documents/
        pass
```

### 3. Separate Documents ViewSet
```python
# If documents have their own ViewSet
class AgreementDocumentViewSet(viewsets.ModelViewSet):
    # This creates: /agreement-documents/
    pass
```

## Quick Fix Options

### Option A: Update Frontend to Match Backend

If backend uses `/upload-document/`:
```typescript
endpoint: `${BASE_URL}${agreementId}/upload-document/`
```

### Option B: Update Backend to Match Frontend

If backend can be changed, use REST standard:
```python
@action(detail=True, methods=['post', 'get'])
def documents(self, request, pk=None):
    if request.method == 'POST':
        # Handle upload
    elif request.method == 'GET':
        # List documents
```

### Option C: Check If Already Deployed

The backend changes you made might not be deployed to Heroku yet:

```bash
# Check Heroku logs
heroku logs --tail --app ahni-erp-029252c2fbb9

# Check if migrations were run
heroku run python manage.py showmigrations --app ahni-erp-029252c2fbb9

# Deploy latest changes
git push heroku main
```

## Action Items

1. [ ] **Backend Team**: Confirm the exact URL pattern for document upload endpoint
2. [ ] **Backend Team**: Verify the endpoint is deployed to Heroku
3. [ ] **Backend Team**: Check if migrations were run on Heroku
4. [ ] **Frontend Team**: Update endpoint URL once confirmed
5. [ ] **QA**: Test the endpoint with cURL or Postman first

## Expected Backend Response

### Success (201 Created)
```json
{
  "status": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "document_url": "https://...",
    "document_name": "contract.pdf",
    "document_type": "CONTRACT",
    "version": 1,
    "contract_number": "AGR-2025-0001-V1",
    "uploaded_at": "2025-10-13T10:00:00Z",
    "file_size": 1024000
  }
}
```

### Error (400 Bad Request)
```json
{
  "status": false,
  "message": "Invalid file type",
  "errors": {
    "document": ["Only PDF, DOC, DOCX files are allowed"]
  }
}
```

### Error (404 Not Found) - Current Issue
```json
{
  "detail": "Not found."
}
```

This means the endpoint doesn't exist or the URL pattern is wrong.
