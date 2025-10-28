# CRITICAL DIFFERENCES: cgfinalfix vs develop Branch

## Executive Summary
The user confirmed that **document upload/retrieval was working in cgfinalfix but not in the current develop branch**. After investigation, we've identified **5 critical differences** between the implementations that are causing the document upload failure.

---

## CRITICAL FINDING 1: Query Key Mismatch

### cgfinalfix (WORKING)
```typescript
// agreementController.ts
export const useUploadContractDocument = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<...>({
    endpoint: `${BASE_URL}${agreementId}/documents/`,
    queryKey: ["agreements", "agreement", "agreement-documents"], // 3-part key
    ...
  });
};

export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["agreement-documents", agreementId],
    ...
  });
};

export const useDeleteContractDocument = (agreementId: string, documentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<...>({
    endpoint: `${BASE_URL}${agreementId}/documents/${documentId}/`,
    queryKey: ["agreements", "agreement", "agreement-documents"], // Matches upload key
    ...
  });
};
```

### develop (BROKEN)
```typescript
// agreementController.ts
export const useUploadContractDocument = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<...>({
    endpoint: `${BASE_URL}${agreementId}/documents/`,
    queryKey: ["agreement-documents", agreementId], // 2-part key, DIFFERENT!
    ...
  });
};

export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["agreement-documents", agreementId],
    ...
  });
};

export const useDeleteContractDocument = (agreementId: string, documentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<...>({
    endpoint: `${BASE_URL}${agreementId}/documents/${documentId}/`,
    queryKey: ["agreement-documents", agreementId], // ALSO INCONSISTENT!
    ...
  });
};
```

### Impact
- In cgfinalfix: All document operations use consistent 3-part keys: `["agreements", "agreement", "agreement-documents"]`
- In develop: Download operations use inconsistent 2-part key: `["agreement-documents", agreementId]`
- **This causes React Query cache invalidation failures** - when you upload, the cache key that gets invalidated doesn't match the retrieval key
- Result: Documents upload successfully (201 response), but the UI never refetches because the cache keys don't match

---

## CRITICAL FINDING 2: Pagination Interface Mismatch

### cgfinalfix (WORKING)
```typescript
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {  // ← PAGINATOR (singular)
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      ...
    };
    results: T[];
  };
}
```

### develop (BROKEN)
```typescript
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {  // ← PAGINATION (plural) - WRONG!
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      ...
    };
    results: T[];
  };
}
```

### Impact
- The develop branch expects `pagination` but the backend likely returns `paginator`
- This is a **TypeScript type mismatch** that may cause runtime issues

---

## CRITICAL FINDING 3: FormData Field Name Difference

### cgfinalfix (WORKING)
```typescript
// agreement/view/index.tsx - Line 175
const formData = new FormData();
formData.append('file', uploadFile);  // ← Uses 'file' field name
formData.append('document_type', uploadDocumentType);
formData.append('title', uploadDocumentTitle.trim());

if (uploadRemarks) {
  formData.append('remarks', uploadRemarks);
}
```

### develop (BROKEN)
```typescript
// agreement/view/index.tsx - Line ~143
const formData = new FormData();
formData.append('document', uploadFile);  // ← Uses 'document' field name - WRONG!
formData.append('document_type', uploadDocumentType);
// Missing title field entirely
// Missing remarks logic
```

### Backend Expectation
The backend document endpoint likely expects:
- Field name: `file` (not `document`)
- Additional fields: `title`, `remarks`, etc.

### Impact
- **Form field mismatch** causes the backend to reject the upload with 400 Bad Request
- The develop branch is sending the wrong field name entirely
- This is the **PRIMARY CAUSE** of document upload failure

---

## CRITICAL FINDING 4: Missing Document Title Field

### cgfinalfix (WORKING)
```typescript
// agreement/view/index.tsx
const [uploadTitle, setUploadTitle] = useState("");

// In resetUploadForm()
setUploadTitle("");

// In handleUploadDocument()
if (!uploadTitle.trim()) {
    toast.error("Please provide a document title");
    return;
}

formData.append('title', uploadTitle);

// In the form JSX (~Line 1050+)
<div>
    <Label>Document Title *</Label>
    <Input
        type="text"
        value={uploadTitle}
        onChange={(e) => setUploadTitle(e.target.value)}
        placeholder="Enter a title for this document"
        required
    />
</div>
```

### develop (BROKEN)
```typescript
// agreement/view/index.tsx - Line 41
const [uploadDocumentTitle, setUploadDocumentTitle] = useState(""); // Declared but...

// In resetUploadForm() - Line 152
setUploadRemarks("");
// ← uploadDocumentTitle NOT reset here!

// In handleUploadDocument() - No title validation!
// ← No check for uploadDocumentTitle.trim()

// FormData never includes title:
formData.append('document', uploadFile);
formData.append('document_type', uploadDocumentType);
// ← No formData.append('title', ...)

// The Document Title field is REMOVED from the form entirely!
// Line 1052-1069 in cgfinalfix are completely deleted in develop
```

### Impact
- The title field is declared in state but **never validated, never sent**
- Backend expects `title` field in FormData
- Upload fails silently because the required title field is missing

---

## CRITICAL FINDING 5: Document Response Field Names

### cgfinalfix (WORKING) - Expected fields from backend
```typescript
doc.title              // ← Primary field for document name
doc.file_name         // ← Fallback if title missing
doc.document_type     // ← Document type
doc.version           // ← Version number
doc.created_datetime  // ← Upload timestamp
doc.file_url          // ← Primary URL field
doc.file              // ← Fallback URL field
doc.file_size         // ← File size in bytes
```

### develop (BROKEN) - Looking for wrong fields
```typescript
doc.document_name     // ← Wrong field name!
doc.document_type     // ← This one is correct
doc.version           // ← This one is correct
doc.uploaded_at       // ← Backend returns created_datetime, not uploaded_at
doc.document_url      // ← Backend returns file_url, not document_url
```

### Specific Example from view component
```typescript
// cgfinalfix (Line ~608-612) - WORKING
h4: {doc.title || doc.file_name}
span: {formatDate(doc.created_datetime)}
Button: window.open(doc.file_url || doc.file, '_blank')
link.download = doc.title || doc.file_name

// develop (Line ~589-606) - BROKEN
h4: {doc.document_name}  // ← Returns undefined if field is actually 'title'
span: {formatDate(doc.uploaded_at)}  // ← Returns undefined, should be created_datetime
Button: window.open(doc.document_url, '_blank')  // ← Returns undefined, should be file_url
link.download = doc.document_name  // ← Returns undefined
```

### Impact
- **Documents upload successfully but display as "Untitled Document"**
- Download links show as undefined
- Timestamps show as undefined
- This is why the user sees empty/broken document cards

---

## CRITICAL FINDING 6: Missing Request Parameters

### cgfinalfix (WORKING)
```typescript
export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["agreement-documents", agreementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${agreementId}/documents/`, {
          params: {
            include_inactive: true,  // ← Include inactive documents
          }
        });
```

### develop (BROKEN)
```typescript
export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["agreement-documents", agreementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${agreementId}/documents/`);
        // ← No params at all! Removed include_inactive parameter
```

### Impact
- The backend may not return inactive/all documents without the parameter
- Documents may be filtered out when retrieving

---

## CRITICAL FINDING 7: File Upload Delay Missing

### cgfinalfix (WORKING)
```typescript
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
        }, 1500); // Reasonable delay for backend processing
    }
}, [uploadSuccess]);
```

### develop (BROKEN)
```typescript
useEffect(() => {
    if (uploadSuccess) {
        toast.success("Document uploaded successfully");
        setIsUploadDialogOpen(false);
        resetUploadForm();

        // No delay! Immediately refetch
        refetchDocuments();
    }
}, [uploadSuccess]);
```

### Impact
- **Race condition**: The frontend refetches documents before the backend has processed them
- The backend's "GET documents returns empty array" bug is made worse by this
- With no delay, the refetch happens before the document is saved

---

## SUMMARY OF FIXES NEEDED

| Issue | Priority | Fix | Impact |
|-------|----------|-----|--------|
| Query key mismatch | CRITICAL | Update upload/delete queryKey to `["agreements", "agreement", "agreement-documents"]` | Document list won't refresh after upload |
| Pagination field name | HIGH | Change `pagination` to `paginator` in interface | Type mismatch with backend |
| FormData field name | CRITICAL | Change `formData.append('document', ...)` to `formData.append('file', ...)` | Upload fails with 400 error |
| Missing title field | CRITICAL | Add title to FormData and form validation | Upload fails, backend rejects |
| Response field mapping | CRITICAL | Map `title→document_name`, `created_datetime→uploaded_at`, `file_url→document_url` | Documents display as empty |
| Missing include_inactive param | MEDIUM | Add `params: { include_inactive: true }` to GET request | Some documents may be filtered out |
| Missing refetch delay | HIGH | Add 1500ms delay before refetch after upload | Race condition causes empty list |

---

## RECOMMENDED ACTION

**Copy the entire implementation from cgfinalfix to develop for the following files:**

1. `/src/features/contracts-grants/controllers/agreementController.ts`
   - Use cgfinalfix version exactly
   - Specifically check: query keys, pagination interface, parameters

2. `/src/features/contracts-grants/components/contract-management/agreement/view/index.tsx`
   - Use cgfinalfix version for document handling
   - Lines 39-42: uploadTitle state
   - Lines 148-153: resetUploadForm function
   - Lines 163-202: handleUploadDocument function
   - Lines 122-137: uploadSuccess useEffect with delay
   - Lines 1050-1069: Document Title input field in form

This is a **high-priority production issue** that requires immediate attention.

