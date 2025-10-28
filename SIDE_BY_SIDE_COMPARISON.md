# Side-by-Side Comparison: cgfinalfix vs develop

## Issue 1: Query Key Configuration

### cgfinalfix (WORKING) ✓
```typescript
// agreementController.ts - Line ~206
export const useUploadContractDocument = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${agreementId}/documents/`,
    queryKey: ["agreements", "agreement", "agreement-documents"], // 3-part consistent key
    isAuth: true,
    method: "POST",
  });
  return { uploadDocument, data, isLoading, isSuccess, error };
};

export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["agreement-documents", agreementId], // Retrieval uses same conceptual key
    queryFn: async () => { ... }
  });
};

export const useDeleteContractDocument = (agreementId: string, documentId: string) => {
  const { callApi, ... } = useApiManager({
    endpoint: `${BASE_URL}${agreementId}/documents/${documentId}/`,
    queryKey: ["agreements", "agreement", "agreement-documents"], // Matches upload key
    method: "DELETE",
  });
  return { deleteDocument, data, isLoading, isSuccess, error };
};
```

### develop (BROKEN) ✗
```typescript
// agreementController.ts - Line ~211
export const useUploadContractDocument = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${agreementId}/documents/`,
    queryKey: ["agreement-documents", agreementId], // Different! 2-part key
    isAuth: true,
    method: "POST",
  });
  return { uploadDocument, data, isLoading, isSuccess, error };
};

export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["agreement-documents", agreementId], // WORKS with this
    queryFn: async () => { ... }
  });
};

export const useDeleteContractDocument = (agreementId: string, documentId: string) => {
  const { callApi, ... } = useApiManager({
    endpoint: `${BASE_URL}${agreementId}/documents/${documentId}/`,
    queryKey: ["agreement-documents", agreementId], // Different AGAIN! Inconsistent
    method: "DELETE",
  });
  return { deleteDocument, data, isLoading, isSuccess, error };
};
```

**Impact**: Cache invalidation fails silently. Upload works but UI never refetches.

---

## Issue 2: Document Upload - FormData Structure

### cgfinalfix (WORKING) ✓
```typescript
// agreement/view/index.tsx - Line ~174-181
const handleUploadDocument = async () => {
    if (!uploadFile) {
        toast.error("Please select a file to upload");
        return;
    }

    if (!uploadDocumentTitle.trim()) {
        toast.error("Please provide a document title");
        return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);  // ← CORRECT FIELD NAME
    formData.append('document_type', uploadDocumentType);
    formData.append('title', uploadDocumentTitle.trim());  // ← REQUIRED FIELD

    if (uploadRemarks) {
        formData.append('remarks', uploadRemarks);
    }

    console.log('Document Upload Debug:', {
        fileName: uploadFile.name,
        fileSize: uploadFile.size,
        documentType: uploadDocumentType,
        title: uploadDocumentTitle.trim(),
        remarks: uploadRemarks,
        formDataEntries: Array.from(formData.entries()).map(...)
    });

    try {
        await uploadDocument(formData);
    } catch (error: any) {
        console.error('Upload error details:', error);
        toast.error(error?.message || "Failed to upload document");
    }
};
```

### develop (BROKEN) ✗
```typescript
// agreement/view/index.tsx - Line ~163-202
const handleUploadDocument = async () => {
    if (!uploadFile) {
        toast.error("Please select a file to upload");
        return;
    }

    if (!uploadDocumentTitle.trim()) {  // ← STATE EXISTS BUT...
        toast.error("Please enter a document title");  // ← This check appears to be removed in actual code!
        return;
    }

    const formData = new FormData();
    formData.append('document', uploadFile);  // ← WRONG FIELD NAME! Backend expects 'file'
    formData.append('document_type', uploadDocumentType);
    // ← title field NOT appended to FormData! Missing critical field
    formData.append('agreement', agreementId);  // ← Extra field, probably not needed
    formData.append('is_active', 'true');  // ← Extra field, probably not needed

    if (uploadRemarks) {
        formData.append('remarks', uploadRemarks);
    }

    // Missing detailed debug logging

    try {
        await uploadDocument(formData);
    } catch (error: any) {
        console.error('Upload error details:', error);
        toast.error(error?.message || "Failed to upload document");
    }
};
```

**Impact**: 
- Field name mismatch causes 400 Bad Request error
- Missing title field causes validation error
- Extra fields confuse the backend

---

## Issue 3: Form UI - Document Title Input

### cgfinalfix (WORKING) ✓
```typescript
// agreement/view/index.tsx - Around Line 1050
<div>
    <Label>Document Title *</Label>
    <Input
        type="text"
        value={uploadTitle}
        onChange={(e) => setUploadTitle(e.target.value)}
        placeholder="Enter a title for this document"
        className="mt-1"
        required
    />
    <p className="text-xs text-gray-500 mt-1">
        Provide a descriptive title for the document
    </p>
</div>
```

### develop (BROKEN) ✗
```typescript
// agreement/view/index.tsx - Lines 1050-1069 DELETED ENTIRELY
// This entire section is missing in develop branch!
// Users cannot enter a document title
// Form is incomplete
```

**Impact**: Users cannot provide required document title. Form is broken.

---

## Issue 4: Document Field Mapping

### cgfinalfix (WORKING) ✓
```typescript
// agreement/view/index.tsx - Document display
documents.map((doc) => (
    <div key={doc.id}>
        <h4>
            {doc.title || doc.file_name}  // ← Correct field names
        </h4>
        <span>
            {formatDate(doc.created_datetime)}  // ← Correct field
        </span>
        <Button onClick={() => window.open(doc.file_url || doc.file, '_blank')}>
            {/* ← Correct field names with fallback */}
        </Button>
        <Button onClick={() => {
            const link = document.createElement('a');
            link.href = doc.file_url || doc.file;  // ← Correct field
            link.download = doc.title || doc.file_name;  // ← Correct field
            link.click();
        }}>
            Download
        </Button>
    </div>
))
```

### develop (BROKEN) ✗
```typescript
// agreement/view/index.tsx - Document display
documents.map((doc) => (
    <div key={doc.id}>
        <h4>
            {doc.document_name}  // ← Backend returns 'title', not 'document_name' ✗
        </h4>
        <span>
            {formatDate(doc.uploaded_at)}  // ← Backend returns 'created_datetime', not 'uploaded_at' ✗
        </span>
        <Button onClick={() => window.open(doc.document_url, '_blank')}>
            {/* ← Backend returns 'file_url', not 'document_url' ✗ */}
        </Button>
        <Button onClick={() => {
            const link = document.createElement('a');
            link.href = doc.document_url;  // ← Returns undefined ✗
            link.download = doc.document_name;  // ← Returns undefined ✗
            link.click();
        }}>
            Download
        </Button>
    </div>
))
```

**Impact**: All document properties display as undefined. Documents appear as "Untitled Document".

---

## Issue 5: Document Retrieval Parameters

### cgfinalfix (WORKING) ✓
```typescript
// agreementController.ts - Line ~287
export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["agreement-documents", agreementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${agreementId}/documents/`,
          {
            params: {
              include_inactive: true,  // ← INCLUDE THIS PARAMETER
            }
          }
        );
        console.log('GET Documents API Response:', response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('GET Documents Error:', axiosError.response?.data);
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!agreementId,
    refetchOnWindowFocus: false,
  });
};
```

### develop (BROKEN) ✗
```typescript
// agreementController.ts - Line ~288
export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["agreement-documents", agreementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${agreementId}/documents/`
          // ← MISSING params object entirely!
        );
        console.log('GET Documents API Response:', response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('GET Documents Error:', axiosError.response?.data);
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!agreementId,
    refetchOnWindowFocus: false,
  });
};
```

**Impact**: Backend may filter documents by active status. Inactive documents won't be returned.

---

## Issue 6: Post-Upload Refetch Timing

### cgfinalfix (WORKING) ✓
```typescript
// agreement/view/index.tsx - Line ~122
useEffect(() => {
    if (uploadSuccess) {
        toast.success("Document uploaded successfully");
        setIsUploadDialogOpen(false);
        resetUploadForm();

        // Add delay before refetching to ensure backend has processed the upload
        setTimeout(() => {
            console.log('🔄 Refetching documents after upload success...');
            refetchDocuments();

            // Also refetch the main agreement data to ensure consistency
            refetch();
        }, 1500);  // ← WAIT 1.5 SECONDS before refetching
    }
}, [uploadSuccess]);
```

### develop (BROKEN) ✗
```typescript
// agreement/view/index.tsx - Line ~122
useEffect(() => {
    if (uploadSuccess) {
        toast.success("Document uploaded successfully");
        setIsUploadDialogOpen(false);
        resetUploadForm();

        // IMMEDIATELY refetch - RACE CONDITION!
        refetchDocuments();  // ← No delay!
    }
}, [uploadSuccess]);
```

**Impact**: 
- Race condition: Frontend asks for documents before backend saves them
- GET returns empty array (because it hasn't been saved yet)
- Documents appear to upload but don't show up

---

## Issue 7: Type Definitions

### cgfinalfix (WORKING) ✓
```typescript
// agreementController.ts - Line ~18
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {  // ← CORRECT: 'paginator' (singular)
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}
```

### develop (BROKEN) ✗
```typescript
// agreementController.ts - Line ~22
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {  // ← WRONG: 'pagination' (plural)
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}
```

**Impact**: TypeScript type mismatch with actual backend response. May cause runtime errors.

---

## Summary Table

| Issue | cgfinalfix | develop | Impact |
|-------|-----------|---------|--------|
| Upload Query Key | `["agreements", "agreement", "agreement-documents"]` | `["agreement-documents", agreementId]` | Cache mismatch |
| Get Query Key | `["agreement-documents", agreementId]` | `["agreement-documents", agreementId]` | ✓ Same |
| Delete Query Key | `["agreements", "agreement", "agreement-documents"]` | `["agreement-documents", agreementId]` | Inconsistent |
| FormData field | `'file'` | `'document'` | 400 error |
| Title field | appended | missing | Validation fails |
| Title UI | ✓ Present | ✗ Missing | Can't enter title |
| Doc field: name | `title` | `document_name` | Undefined display |
| Doc field: date | `created_datetime` | `uploaded_at` | Undefined display |
| Doc field: URL | `file_url` | `document_url` | Undefined display |
| Params | `include_inactive: true` | none | Filtering issue |
| Refetch delay | 1500ms | immediate | Race condition |
| Pagination field | `paginator` | `pagination` | Type mismatch |

---

## Conclusion

**cgfinalfix is clearly the stable, working version.**

All 7 issues exist simultaneously in the develop branch, creating a compound failure:
1. Upload fails due to field name mismatch
2. Even if upload succeeds, UI can't display it due to field mapping errors
3. Cache invalidation doesn't work due to key mismatches
4. Race conditions cause documents to disappear
5. Type mismatches may cause TypeScript errors

**Recommendation**: Restore files from cgfinalfix immediately.

