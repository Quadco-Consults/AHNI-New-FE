# Contract Management Workflow - Backend Implementation Requirements

## Overview
This document outlines the backend API endpoints and data models required to support the contract document management, submission, approval flow, and modification system for agreements.

## Database Schema Changes

### 1. Agreement Model Updates
Add the following fields to the Agreement model:

```python
class Agreement(models.Model):
    # ... existing fields ...

    # Contract workflow fields
    status = models.CharField(
        max_length=20,
        choices=[
            ('DRAFT', 'Draft'),
            ('SUBMITTED', 'Submitted'),
            ('PENDING_APPROVAL', 'Pending Approval'),
            ('APPROVED', 'Approved'),
            ('ACTIVE', 'Active'),
            ('EXPIRED', 'Expired'),
            ('TERMINATED', 'Terminated'),
        ],
        default='DRAFT'
    )
    contract_number = models.CharField(max_length=50, unique=True, null=True, blank=True)
    current_version = models.IntegerField(default=1)

    # Submission tracking
    submitted_at = models.DateTimeField(null=True, blank=True)
    submitted_by = models.ForeignKey(User, related_name='submitted_agreements', null=True, on_delete=models.SET_NULL)

    # Approval tracking (if using simple approval)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, related_name='approved_agreements', null=True, on_delete=models.SET_NULL)

    # Or integration with existing approval system
    approval_workflow = models.ForeignKey('approvals.ApprovalWorkflow', null=True, blank=True, on_delete=models.SET_NULL)
```

### 2. Contract Document Model (NEW)
Create a new model for contract documents:

```python
class ContractDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, related_name='documents', on_delete=models.CASCADE)

    document = models.FileField(upload_to='contracts/documents/')
    document_name = models.CharField(max_length=255)
    document_type = models.CharField(
        max_length=20,
        choices=[
            ('CONTRACT', 'Main Contract'),
            ('EXTENSION', 'Extension'),
            ('ADDENDUM', 'Addendum'),
            ('AMENDMENT', 'Amendment'),
        ],
        default='CONTRACT'
    )

    version = models.IntegerField(default=1)
    contract_number = models.CharField(max_length=50)
    file_size = models.BigIntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-uploaded_at']

    def save(self, *args, **kwargs):
        # Auto-set file size
        if self.document:
            self.file_size = self.document.size
        # Auto-generate contract number if not provided
        if not self.contract_number:
            self.contract_number = self.generate_contract_number()
        super().save(*args, **kwargs)

    def generate_contract_number(self):
        """Generate unique contract number format: AGR-YYYY-NNNN-VN"""
        year = timezone.now().year
        count = ContractDocument.objects.filter(
            agreement=self.agreement
        ).count() + 1
        return f"AGR-{year}-{str(count).zfill(4)}-V{self.version}"
```

### 3. Contract Modification Model (NEW)
Create a new model for tracking contract modifications:

```python
class ContractModification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agreement = models.ForeignKey(Agreement, related_name='modifications', on_delete=models.CASCADE)

    modification_type = models.CharField(
        max_length=20,
        choices=[
            ('EXTENSION', 'Contract Extension'),
            ('ADDENDUM', 'Addendum'),
            ('AMENDMENT', 'Amendment'),
        ]
    )
    description = models.TextField()

    # Extension-specific fields
    new_end_date = models.DateField(null=True, blank=True)

    # Financial impact
    additional_cost = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Supporting document
    document = models.ForeignKey(ContractDocument, null=True, blank=True, on_delete=models.SET_NULL)

    # Tracking
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('APPROVED', 'Approved'),
            ('REJECTED', 'Rejected'),
        ],
        default='PENDING'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, related_name='created_modifications', on_delete=models.SET_NULL, null=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, related_name='approved_modifications', on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-created_at']
```

## API Endpoints

### 1. Upload Contract Document
**Endpoint:** `POST /contract-grants/agreements/{agreement_id}/upload-document/`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `document` (file): The contract document file
  - `document_type` (string): One of: CONTRACT, EXTENSION, ADDENDUM, AMENDMENT
  - `remarks` (string, optional): Additional notes

**Response (200):**
```json
{
  "status": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "uuid",
    "document_url": "url",
    "document_name": "filename.pdf",
    "document_type": "CONTRACT",
    "version": 1,
    "contract_number": "AGR-2025-0001-V1",
    "uploaded_at": "2025-10-13T10:00:00Z",
    "file_size": 1024000,
    "remarks": "Initial contract"
  }
}
```

**Implementation Notes:**
- Auto-increment version number based on existing documents for this agreement
- Generate unique contract number
- Validate file type (PDF, DOC, DOCX only)
- Validate file size (max 10MB)

### 2. Get Agreement Documents
**Endpoint:** `GET /contract-grants/agreements/{agreement_id}/documents/`

**Response (200):**
```json
{
  "status": true,
  "message": "Documents retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "document_url": "url",
      "document_name": "filename.pdf",
      "document_type": "CONTRACT",
      "version": 1,
      "contract_number": "AGR-2025-0001-V1",
      "uploaded_at": "2025-10-13T10:00:00Z",
      "uploaded_by": "John Doe",
      "file_size": 1024000,
      "remarks": "Initial contract"
    }
  ]
}
```

### 3. Delete Contract Document
**Endpoint:** `DELETE /contract-grants/agreements/{agreement_id}/documents/{document_id}/`

**Response (200):**
```json
{
  "status": true,
  "message": "Document deleted successfully"
}
```

**Validation:**
- Only allow deletion if agreement status is DRAFT
- Don't allow deletion if it's the only document

### 4. Submit Agreement for Approval
**Endpoint:** `POST /contract-grants/agreements/{agreement_id}/submit/`

**Response (200):**
```json
{
  "status": true,
  "message": "Agreement submitted for approval",
  "data": {
    "id": "uuid",
    "status": "SUBMITTED",
    "submitted_at": "2025-10-13T10:00:00Z",
    "submitted_by": "user_id"
  }
}
```

**Implementation Notes:**
- Validate at least one document exists
- Change status from DRAFT to SUBMITTED
- Set submitted_at and submitted_by fields
- Trigger approval workflow (if integrated with existing approval system)
- Send notifications to approvers

### 5. Create Contract Modification
**Endpoint:** `POST /contract-grants/agreements/{agreement_id}/modifications/`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `modification_type` (string): EXTENSION, ADDENDUM, or AMENDMENT
  - `description` (string): Description of modification
  - `new_end_date` (date, optional): For extensions
  - `additional_cost` (decimal, optional): Additional cost
  - `document` (file, optional): Supporting document

**Response (200):**
```json
{
  "status": true,
  "message": "Modification created successfully",
  "data": {
    "id": "uuid",
    "modification_type": "EXTENSION",
    "description": "Extending contract by 6 months",
    "new_end_date": "2026-04-13",
    "additional_cost": "50000.00",
    "status": "PENDING",
    "created_at": "2025-10-13T10:00:00Z"
  }
}
```

**Validation:**
- Only allow if agreement status is ACTIVE
- For extensions, new_end_date must be after current end_date
- If document provided, auto-create ContractDocument with type matching modification_type

### 6. Update Agreement Serializer
Update the existing GET endpoint `/contract-grants/agreements/{id}/` to include:

```python
class AgreementDetailSerializer(serializers.ModelSerializer):
    documents = ContractDocumentSerializer(many=True, read_only=True)
    modifications = ContractModificationSerializer(many=True, read_only=True)

    # ... existing fields ...

    class Meta:
        model = Agreement
        fields = [
            # ... existing fields ...
            'status',
            'status_display',
            'contract_number',
            'current_version',
            'submitted_at',
            'submitted_by',
            'approved_at',
            'approved_by',
            'documents',
            'modifications',
        ]
```

## Approval Flow Integration

### Option 1: Simple Approval (if no existing approval system)
Add these endpoints:

**Approve Agreement:**
```
POST /contract-grants/agreements/{agreement_id}/approve/
```

**Reject Agreement:**
```
POST /contract-grants/agreements/{agreement_id}/reject/
Body: { "reason": "Rejection reason" }
```

### Option 2: Integration with Existing Approval System
If you have an existing approval workflow system:

1. When agreement is submitted, create an approval workflow instance
2. Link the agreement to the approval workflow
3. Frontend will use existing approval UI
4. On approval completion, update agreement status to APPROVED
5. On approval rejection, update agreement status back to DRAFT

**Webhook/Signal Handler:**
```python
@receiver(approval_completed)
def handle_agreement_approval(sender, approval_workflow, **kwargs):
    if approval_workflow.content_type.model == 'agreement':
        agreement = approval_workflow.content_object
        if approval_workflow.status == 'APPROVED':
            agreement.status = 'ACTIVE'
            agreement.approved_at = timezone.now()
            agreement.approved_by = approval_workflow.approved_by
            agreement.save()
```

## Status Transition Rules

```
DRAFT → SUBMITTED (when user submits with documents)
SUBMITTED → PENDING_APPROVAL (when approval workflow starts)
PENDING_APPROVAL → APPROVED (when all approvers approve)
PENDING_APPROVAL → DRAFT (when rejected - user can resubmit)
APPROVED → ACTIVE (when approved and start_date reached)
ACTIVE → EXPIRED (when end_date passed)
ACTIVE → TERMINATED (manual termination)
```

## Contract Number Format

Format: `AGR-{YEAR}-{SEQUENCE}-V{VERSION}`

Examples:
- AGR-2025-0001-V1 (First contract, version 1)
- AGR-2025-0001-V2 (First contract, version 2 after modification)
- AGR-2025-0002-V1 (Second contract, version 1)

## Permissions

```python
- Upload Document: Agreement.status == 'DRAFT' AND user is creator
- Delete Document: Agreement.status == 'DRAFT' AND user is creator
- Submit Agreement: Agreement.status == 'DRAFT' AND user is creator AND documents.count() > 0
- Create Modification: Agreement.status == 'ACTIVE' AND user has permission
- Approve Agreement: user is approver in workflow
```

## Testing Checklist

- [ ] Upload single document
- [ ] Upload multiple documents
- [ ] Version numbering increments correctly
- [ ] Contract number generation is unique
- [ ] Submit agreement with documents
- [ ] Cannot submit without documents
- [ ] Cannot edit after submission
- [ ] Approval workflow triggers correctly
- [ ] Status changes on approval/rejection
- [ ] Create extension modification
- [ ] Create addendum modification
- [ ] Modification uploads document correctly
- [ ] Documents display with correct metadata
- [ ] File size calculation
- [ ] Document type badges
