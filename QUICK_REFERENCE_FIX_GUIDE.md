# Quick Reference: Document Upload Fix Guide

## Problem
Documents upload successfully (201 response) but:
- Don't appear in the document list
- Display as "Untitled Document"
- Have broken download links
- Disappear on page refresh

## Root Causes (7 Issues Found)

### 1. Query Key Mismatch (CRITICAL)
**File**: `src/features/contracts-grants/controllers/agreementController.ts`

**Current (BROKEN)**:
```typescript
// Line ~211 - useUploadContractDocument
queryKey: ["agreement-documents", agreementId]

// Line ~328 - useDeleteContractDocument  
queryKey: ["agreement-documents", agreementId]
```

**Fix**:
```typescript
// Should be (from cgfinalfix)
queryKey: ["agreements", "agreement", "agreement-documents"]
// in BOTH functions
```

---

### 2. FormData Field Name (CRITICAL)
**File**: `src/features/contracts-grants/components/contract-management/agreement/view/index.tsx`

**Current (BROKEN)** - Line ~143:
```typescript
formData.append('document', uploadFile);  // WRONG!
formData.append('document_type', uploadDocumentType);
// Missing title field
```

**Fix**:
```typescript
formData.append('file', uploadFile);  // Correct field name
formData.append('document_type', uploadDocumentType);
formData.append('title', uploadDocumentTitle.trim());  // Required field
if (uploadRemarks) {
  formData.append('remarks', uploadRemarks);
}
```

---

### 3. Missing Document Title Input (CRITICAL)
**File**: `src/features/contracts-grants/components/contract-management/agreement/view/index.tsx`

**Current (BROKEN)** - Line ~41:
```typescript
// State exists but is never used
const [uploadDocumentTitle, setUploadDocumentTitle] = useState("");
```

**Missing from resetUploadForm()** - Line ~151:
```typescript
// Should include:
setUploadDocumentTitle("");
```

**Missing from handleUploadDocument()** - Line ~163:
```typescript
// Should validate:
if (!uploadDocumentTitle.trim()) {
    toast.error("Please provide a document title");
    return;
}
```

**Missing from Form JSX** - Around Line 1050:
```typescript
// Should add:
<div>
    <Label>Document Title *</Label>
    <Input
        type="text"
        value={uploadDocumentTitle}
        onChange={(e) => setUploadDocumentTitle(e.target.value)}
        placeholder="Enter a title for this document"
        required
    />
    <p className="text-xs text-gray-500 mt-1">
        Provide a descriptive title for the document
    </p>
</div>
```

---

### 4. Document Field Mapping (CRITICAL)
**File**: `src/features/contracts-grants/components/contract-management/agreement/view/index.tsx`

**Current (BROKEN)**:
```typescript
// Line ~591
h4: {doc.document_name}  // Returns undefined!

// Line ~606
span: {formatDate(doc.uploaded_at)}  // Returns undefined!

// Line ~651
window.open(doc.document_url, '_blank')  // Returns undefined!

// Line ~654
link.download = doc.document_name  // Returns undefined!
```

**Fix** - Use cgfinalfix field names:
```typescript
h4: {doc.title || doc.file_name}  // Correct field

span: {formatDate(doc.created_datetime)}  // Correct field

window.open(doc.file_url || doc.file, '_blank')  // Correct field

link.download = doc.title || doc.file_name  // Correct field
```

---

### 5. Missing include_inactive Parameter (MEDIUM)
**File**: `src/features/contracts-grants/controllers/agreementController.ts`

**Current (BROKEN)** - Line ~288:
```typescript
const response = await AxiosWithToken.get(`${BASE_URL}${agreementId}/documents/`);
// No params sent
```

**Fix**:
```typescript
const response = await AxiosWithToken.get(`${BASE_URL}${agreementId}/documents/`, {
  params: {
    include_inactive: true,  // Include all documents
  }
});
```

---

### 6. Missing Refetch Delay (HIGH)
**File**: `src/features/contracts-grants/components/contract-management/agreement/view/index.tsx`

**Current (BROKEN)** - Line ~122:
```typescript
useEffect(() => {
    if (uploadSuccess) {
        toast.success("Document uploaded successfully");
        setIsUploadDialogOpen(false);
        resetUploadForm();

        // Immediate refetch - RACE CONDITION!
        refetchDocuments();
    }
}, [uploadSuccess]);
```

**Fix**:
```typescript
useEffect(() => {
    if (uploadSuccess) {
        toast.success("Document uploaded successfully");
        setIsUploadDialogOpen(false);
        resetUploadForm();

        // Add delay for backend processing
        setTimeout(() => {
            console.log('Refetching documents after upload success...');
            refetchDocuments();
            refetch();
        }, 1500);
    }
}, [uploadSuccess]);
```

---

### 7. Pagination Field Name (HIGH)
**File**: `src/features/contracts-grants/controllers/agreementController.ts`

**Current (BROKEN)** - Line ~24:
```typescript
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {  // WRONG NAME!
      count: number;
      ...
    };
    results: T[];
  };
}
```

**Fix**:
```typescript
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {  // Correct backend field name
      count: number;
      ...
    };
    results: T[];
  };
}
```

---

## Implementation Checklist

### Controller File (`agreementController.ts`)
- [ ] Fix query key in `useUploadContractDocument` (line ~211)
- [ ] Fix query key in `useDeleteContractDocument` (line ~328)
- [ ] Add `include_inactive: true` params in `useGetAgreementDocuments` (line ~288)
- [ ] Change `pagination` to `paginator` in interface (line ~24)
- [ ] Remove verbose logging that was in develop but not in cgfinalfix

### View Component (`agreement/view/index.tsx`)
- [ ] Add uploadDocumentTitle to resetUploadForm() (line ~151)
- [ ] Add title validation in handleUploadDocument() (line ~163)
- [ ] Change `formData.append('document', ...)` to `formData.append('file', ...)` (line ~143)
- [ ] Add title field to FormData
- [ ] Add remarks field logic back to FormData
- [ ] Fix document field mappings (doc.document_name → doc.title, etc.)
- [ ] Add 1500ms delay in uploadSuccess useEffect
- [ ] Add missing Document Title input field in form JSX

---

## Fastest Fix Option

**Copy these files from cgfinalfix branch:**

```bash
# Get the working versions
git show cgfinalfix:src/features/contracts-grants/controllers/agreementController.ts > src/features/contracts-grants/controllers/agreementController.ts

git show cgfinalfix:src/features/contracts-grants/components/contract-management/agreement/view/index.tsx > src/features/contracts-grants/components/contract-management/agreement/view/index.tsx
```

Then test document upload/retrieval to confirm it works.

---

## Testing Steps

1. Create a new agreement
2. Navigate to agreement detail page
3. Try to upload a document
4. Document should:
   - Upload successfully (show success toast)
   - Appear in document list immediately (or after 1.5s)
   - Show correct title, type, upload date
   - Have working download link
   - Persist after page refresh

