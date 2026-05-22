# Standardized Upload Components

Consistent, reusable upload components for the AHNI ERP system.

## Features

✅ **Unified UX** - Consistent design across all uploads
✅ **Progress Tracking** - Real-time progress with stages (Validating → Uploading → Processing → Complete)
✅ **Detailed Error Reporting** - Shows specific row and column for each error
✅ **Drag & Drop** - Modern drag-and-drop interface
✅ **Backward Compatible** - Works with all existing backend response formats
✅ **Template Integration** - Built-in template download support
✅ **File Validation** - Client-side validation before upload

---

## Components

### 1. StandardBulkUpload

For bulk data imports (Excel, CSV).

```tsx
import { StandardBulkUpload } from '@/components/uploads';

<StandardBulkUpload
  endpoint="/api/v1/procurement/vendors/bulk-upload/"
  templateUrl="/api/v1/procurement/vendors/template/"
  acceptedFormats={['.xlsx', '.csv']}
  maxFileSizeMB={10}
  title="Bulk Upload Vendors"
  description="Upload a CSV or Excel file to import multiple vendors"
  onSuccess={(result) => {
    console.log(`Created ${result.created_count} vendors`);
    refetch(); // Refresh data
  }}
  onError={(error) => {
    console.error('Upload failed:', error);
  }}
  showTemplateDownload={true}
  autoCloseDelay={2000} // Auto-close after 2 seconds if successful
/>
```

### 2. StandardDocumentUpload

For single document uploads (PDFs, images, etc.).

```tsx
import { StandardDocumentUpload } from '@/components/uploads';

<StandardDocumentUpload
  endpoint="/api/v1/documents/upload/"
  acceptedFormats={['.pdf', '.doc', '.docx']}
  maxFileSizeMB={5}
  title="Upload Contract Document"
  description="Upload the signed contract PDF"
  additionalData={{
    contract_id: contractId,
    document_type: 'signed_contract'
  }}
  onSuccess={(result) => {
    toast.success('Document uploaded successfully');
  }}
  showPreview={true}
/>
```

---

## Hooks

### useStandardUpload

Low-level hook for custom upload implementations.

```tsx
import { useStandardUpload } from '@/components/uploads';

const {
  upload,
  isUploading,
  progress,
  stage,
  result,
  errors,
  reset,
  validateFile
} = useStandardUpload('/api/endpoint', {
  onSuccess: (result) => console.log(result),
  maxFileSize: 10 * 1024 * 1024,
  acceptedFormats: ['.xlsx']
});

// Upload file
await upload(file, { project_id: '123' });
```

### useUploadProgress

Hook for progress tracking.

```tsx
import { useUploadProgress } from '@/components/uploads';

const {
  progress,
  setProgress,
  startUpload,
  completeUpload,
  errorUpload
} = useUploadProgress();
```

---

## Backend Integration

### Option 1: Use StandardUploadResponseMixin (Recommended)

```python
from commons.mixins.standard_upload import StandardUploadResponseMixin
from rest_framework.views import APIView
from rest_framework.response import Response

class VendorBulkUploadView(StandardUploadResponseMixin, APIView):
    def post(self, request):
        file = request.FILES.get('file')

        # Your upload processing logic
        results = {
            "created_count": 45,
            "failed_count": 2,
            "errors": [
                {
                    "row": 15,
                    "column": "email",
                    "field_label": "Email Address",
                    "value": "invalid-email",
                    "error": "Enter a valid email address",
                    "error_code": "invalid"
                }
            ]
        }

        # Automatically formats to standard response
        return Response(self.format_upload_response(results))
```

### Option 2: Use StandardBulkUploadMixin (Advanced)

```python
from commons.mixins.standard_upload import StandardBulkUploadMixin
import pandas as pd

class VendorBulkUploadView(StandardBulkUploadMixin, APIView):
    def post(self, request):
        file = request.FILES.get('file')
        df = pd.read_excel(file)

        # Automatically processes DataFrame with error handling
        results = self.process_dataframe(
            df=df,
            serializer_class=VendorSerializer,
            row_processor=self.process_vendor_row  # Optional
        )

        return Response(results)

    def process_vendor_row(self, row, index):
        """Optional: Custom row processing"""
        return {
            'company_name': row['Company Name'],
            'email': row['Email'],
            # ... map other fields
        }
```

---

## Migration Guide

### Migrating Existing Uploads

#### Before:
```tsx
// Old upload modal with custom implementation
<Modal>
  <input type="file" onChange={handleFileChange} />
  <button onClick={handleUpload}>Upload</button>
  {error && <div className="text-red-500">{error}</div>}
</Modal>
```

#### After:
```tsx
// New standardized upload
<Modal>
  <StandardBulkUpload
    endpoint="/api/v1/endpoint/"
    templateUrl="/api/v1/endpoint/template/"
    onSuccess={handleSuccess}
    onClose={closeModal}
  />
</Modal>
```

### Step-by-Step Migration

1. **Keep old code as backup** (comment it out)
2. **Replace with StandardBulkUpload**
3. **Update backend to use mixin** (optional but recommended)
4. **Test thoroughly**
5. **Remove old code after 2 weeks of stable operation**

---

## Response Format

### Standard Format (All Endpoints Should Return This)

```json
{
  "status": true,
  "message": "Successfully created 48 records",
  "data": {
    "total_rows": 50,
    "created_count": 48,
    "updated_count": 0,
    "failed_count": 2,
    "skipped_count": 0,
    "errors": [
      {
        "row": 15,
        "column": "registration_number",
        "field_label": "Registration Number",
        "value": null,
        "error": "This field is required",
        "error_code": "required"
      },
      {
        "row": 23,
        "column": "vehicle_type",
        "field_label": "Vehicle Type",
        "value": "SUV2",
        "error": "Invalid vehicle type code",
        "error_code": "invalid_choice"
      }
    ],
    "created_items": [
      {"row": 1, "id": "uuid-1"},
      {"row": 2, "id": "uuid-2"}
    ]
  }
}
```

### Backward Compatibility

The frontend components automatically handle these old formats:

- **Procurement Plan Format**: `{summary: {...}, errors: [...]}`
- **Employee Format**: `{successful: 10, failed: 2, errors: [...]}`
- **Asset Format**: `{created_count: 10, failed_count: 2, errors: [...]}`

No backend changes required for existing endpoints!

---

## Error Display

Errors are shown with:
- ✅ Row number (e.g., "Row 15")
- ✅ Column name (e.g., "Registration Number")
- ✅ Actual value that caused error
- ✅ Clear error message
- ✅ Error code for programmatic handling

Example:
```
❌ Row 15, Column "Registration Number": This field is required
❌ Row 23, Column "Vehicle Type": Invalid vehicle type "SUV2"

✅ Successfully created: 48 records
⚠️ Failed: 2 records
```

---

## Progress Stages

Uploads progress through 4 automatic stages:

1. **Validating** (0-30%) - File validation
2. **Uploading** (30-60%) - Sending file to server
3. **Processing** (60-90%) - Server processing data
4. **Complete** (90-100%) - Finished

Users see real-time progress:
```
🔍 Validating... 25%
⬆️ Uploading... 45%
⚙️ Processing... 75%
✅ Complete 100%
```

---

## Design Tokens

All styling is centralized in `design-tokens.ts`. To customize:

```ts
import { UPLOAD_DESIGN } from '@/components/uploads';

// All components use these consistent styles:
UPLOAD_DESIGN.progressBar.colors.fill = 'bg-blue-600';
UPLOAD_DESIGN.dropZone.height = '200px';
UPLOAD_DESIGN.errors.maxVisible = 10;
```

---

## Testing

### Test Scenarios

1. **Valid file** - Should upload successfully
2. **Invalid format** - Should show error before upload
3. **File too large** - Should show error before upload
4. **Partial errors** - Should show success count + error details
5. **All errors** - Should show all errors (up to 10 visible)
6. **Network error** - Should show error message

### Example Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StandardBulkUpload } from '@/components/uploads';

test('shows error for invalid file format', async () => {
  render(
    <StandardBulkUpload
      endpoint="/api/upload"
      acceptedFormats={['.xlsx']}
    />
  );

  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  const input = screen.getByRole('input');

  fireEvent.change(input, { target: { files: [file] } });

  expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument();
});
```

---

## Rollout Plan

### Phase 1: Foundation (Complete ✅)
- StandardBulkUpload component
- StandardDocumentUpload component
- useStandardUpload hook
- Backend mixins

### Phase 2: Pilot Migrations (Week 2)
- Annual Supervision Plan Upload
- Vendor Bulk Upload

### Phase 3: High-Priority (Week 3-4)
- Procurement Plan Upload
- Work Plan Upload
- Employee Bulk Upload

### Phase 4: Gradual Rollout (Week 5-8)
- Asset uploads
- Configuration uploads
- Document uploads

---

## Support

For questions or issues:
1. Check this README
2. Look at existing implementations (e.g., AnnualPlanUpload.tsx)
3. Review design tokens for styling options
4. Test with backend mixin for consistent responses

---

## Examples

See live examples in:
- `/src/features/programs/components/plan/annual-supervision/AnnualPlanUpload.tsx`
- `/src/features/admin/components/assets/BulkUploadDialog.tsx`
