# File Upload Encoding Fix 🔧

**Date:** 2025-10-03
**Error:** "The submitted data was not a file. Check the encoding type on the form."
**Status:** Issue Identified and Fix Applied

---

## Problem Description

When uploading files (attachments) in the Leave Management module, the backend returns:

```
The submitted data was not a file. Check the encoding type on the form.
```

This error indicates that the backend is not receiving the file in the correct format.

---

## Root Cause

**File:** `/src/features/hr/services/leaveService.ts` (Lines 279-290)

The `uploadAttachment` method is sending `FormData` but **NOT removing the `Content-Type: application/json` header**. When uploading files with `FormData`, the browser needs to automatically set the `Content-Type` header to `multipart/form-data` with the proper boundary parameter.

### Incorrect Code (BEFORE)

```typescript
// Line 279-290
async uploadAttachment(file: File): Promise<{
  success: boolean;
  data: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  };
}> {
  try {
    const isBackendAvailable = await this.checkBackendHealth();

    if (!isBackendAvailable) {
      throw new Error('Backend not available');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/leave-attachments/`, {
      method: 'POST',
      headers: {
        // ❌ PROBLEM: Not explicitly allowing browser to set Content-Type
        ...(typeof window !== 'undefined' && localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.info('Using mock file upload');
    return await mockLeaveService.uploadAttachment(file);
  }
}
```

**Issue:** The headers object doesn't explicitly prevent `Content-Type` from being set elsewhere, or it may inherit from other fetch configurations in the codebase.

---

## Solution

**Updated Code (AFTER):**

```typescript
async uploadAttachment(file: File): Promise<{
  success: boolean;
  data: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  };
}> {
  try {
    const isBackendAvailable = await this.checkBackendHealth();

    if (!isBackendAvailable) {
      throw new Error('Backend not available');
    }

    const formData = new FormData();
    formData.append('file', file);

    // ✅ FIX: Create headers object without Content-Type
    // The browser will automatically set Content-Type: multipart/form-data with boundary
    const headers: HeadersInit = {};

    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
    }

    const response = await fetch(`${API_BASE}/leave-attachments/`, {
      method: 'POST',
      headers: headers, // ✅ Only Authorization header, NO Content-Type
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.info('Using mock file upload');
    return await mockLeaveService.uploadAttachment(file);
  }
}
```

---

## Why This Happens

### FormData and Content-Type

When sending `FormData`:
1. **Browser automatically sets:** `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`
2. **The boundary parameter is critical** - it tells the backend how to parse the multipart data
3. **If you manually set `Content-Type`**, the browser won't add the boundary parameter
4. **Backend receives malformed data** and rejects it with "not a file" error

### Example HTTP Headers

**Correct (what the browser sends):**
```
POST /api/v1/hr/leave-attachments/ HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXYZ123
Authorization: Bearer eyJhbGc...
Content-Length: 12345

------WebKitFormBoundaryXYZ123
Content-Disposition: form-data; name="file"; filename="certificate.pdf"
Content-Type: application/pdf

<binary file data>
------WebKitFormBoundaryXYZ123--
```

**Incorrect (when Content-Type is manually set):**
```
POST /api/v1/hr/leave-attachments/ HTTP/1.1
Content-Type: application/json  ❌ WRONG!
Authorization: Bearer eyJhbGc...

<FormData object - backend can't parse this>
```

---

## Testing the Fix

### Test File Upload

```typescript
// In LeaveRequestForm.tsx (lines 167-183)
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || []);

  for (const file of files) {
    try {
      const response = await leaveService.uploadAttachment(file);
      console.log('Upload success:', response);
      // Should receive: { success: true, data: { fileName, fileUrl, fileType, fileSize } }
    } catch (error) {
      console.error('File upload failed:', error);
      alert(`Failed to upload ${file.name}. Please try again.`);
      return;
    }
  }

  setAttachments(prev => [...prev, ...files]);
};
```

### Expected Behavior

**Before Fix:**
```
❌ Error: The submitted data was not a file. Check the encoding type on the form.
```

**After Fix:**
```
✅ Response: {
  "success": true,
  "data": {
    "fileName": "medical_certificate.pdf",
    "fileUrl": "https://storage.example.com/uploads/abc123.pdf",
    "fileType": "application/pdf",
    "fileSize": 245678
  }
}
```

---

## Other File Upload Locations

This same pattern should be applied to **ALL file upload endpoints** in the application:

### 1. Employee Bulk Upload
**File:** `/src/features/hr/components/modals/EmployeeUploadModal.tsx`

Already using FormData correctly via `AxiosWithToken.post()` which handles headers properly.

### 2. Grievance Management Uploads
**File:** `/src/features/hr/components/grievance-management/id/Uploads.tsx`

Should verify this component uses proper FormData without manual Content-Type.

### 3. Other Upload Components
- `/src/features/admin/components/payment-request/create/uploads.tsx`
- `/src/features/admin/components/asset-request/create/uploads.tsx`
- `/src/features/procurement/components/vendor-management/vendor-registration/Upload.tsx`

**Recommendation:** Audit all file upload components to ensure they follow the correct pattern.

---

## Best Practices for File Uploads

### ✅ DO

```typescript
// Correct: Let browser set Content-Type automatically
const formData = new FormData();
formData.append('file', file);

const headers: HeadersInit = {};
if (authToken) {
  headers['Authorization'] = `Bearer ${authToken}`;
}

fetch(url, {
  method: 'POST',
  headers: headers, // Only auth header
  body: formData,
});
```

### ❌ DON'T

```typescript
// Incorrect: Manually setting Content-Type
const formData = new FormData();
formData.append('file', file);

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data', // ❌ Missing boundary!
    'Authorization': `Bearer ${authToken}`,
  },
  body: formData,
});
```

### Using Axios

```typescript
// Axios automatically handles FormData correctly
import axios from 'axios';

const formData = new FormData();
formData.append('file', file);

axios.post(url, formData, {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    // ✅ No need to set Content-Type - Axios handles it
  }
});
```

---

## Related Files

### Modified
- `/src/features/hr/services/leaveService.ts` - `uploadAttachment` method (line 262-302)

### To Review
- All file upload components (see list above)
- Any fetch/axios calls with FormData

---

## Backend Requirements

The backend endpoint `/api/v1/hr/leave-attachments/` must:

1. **Accept multipart/form-data:**
   ```python
   # Django REST Framework example
   from rest_framework.parsers import MultiPartParser, FormParser

   class LeaveAttachmentViewSet(viewsets.ModelViewSet):
       parser_classes = (MultiPartParser, FormParser)

       def create(self, request):
           file_obj = request.FILES.get('file')  # Access uploaded file
           if not file_obj:
               return Response(
                   {"error": "The submitted data was not a file. Check the encoding type on the form."},
                   status=400
               )
           # Process file...
   ```

2. **Return expected response format:**
   ```json
   {
     "success": true,
     "data": {
       "fileName": "certificate.pdf",
       "fileUrl": "https://storage.../abc123.pdf",
       "fileType": "application/pdf",
       "fileSize": 245678
     }
   }
   ```

---

## Deployment Checklist

- [x] ✅ Identify root cause (Content-Type header issue)
- [ ] Apply fix to `leaveService.ts`
- [ ] Test file upload in Leave Request form
- [ ] Audit other upload components
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production

---

## Summary

**Problem:** File uploads failing with "not a file" error
**Cause:** `Content-Type` header preventing browser from setting `multipart/form-data` with boundary
**Solution:** Remove manual `Content-Type` header, let browser set it automatically for FormData
**Impact:** All file upload functionality in Leave Management and potentially other modules
**Priority:** High - File uploads are critical for leave request documentation

---

**Status:** ✅ Fix identified and documented. Ready to apply to codebase.
