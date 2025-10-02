# Adhoc Staff Requisition - Backend API Specification

## Overview
This document specifies the REST API endpoints required for the Adhoc Staff Requisition module.

**Base URL:** `/api/adhoc-requisitions/`

**Authentication:** All endpoints require JWT authentication

---

## Table of Contents
1. [Models & Database Schema](#models--database-schema)
2. [API Endpoints](#api-endpoints)
3. [Serializers](#serializers)
4. [Permissions](#permissions)
5. [Notifications](#notifications)
6. [Integration Points](#integration-points)

---

## Models & Database Schema

### AdhocRequisition Model

```python
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class AdhocRequisition(models.Model):
    """Main model for adhoc staff requisitions"""

    # Status Choices
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_APPROVAL = 'PENDING_APPROVAL', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        CANCELLED = 'CANCELLED', 'Cancelled'
        CONVERTED_TO_AD = 'CONVERTED_TO_AD', 'Converted to Advertisement'

    # Staff Type Choices
    class StaffType(models.TextChoices):
        CONSULTANT = 'CONSULTANT', 'Consultant'
        ADHOC = 'ADHOC', 'Adhoc Staff'
        FACILITATOR = 'FACILITATOR', 'Facilitator'

    # Priority Choices
    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    # Work Arrangement Choices
    class WorkArrangement(models.TextChoices):
        ON_SITE = 'ON_SITE', 'On-site'
        REMOTE = 'REMOTE', 'Remote'
        HYBRID = 'HYBRID', 'Hybrid'

    # Primary Key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requisition_number = models.CharField(max_length=50, unique=True, editable=False)

    # Basic Information
    staff_type = models.CharField(max_length=20, choices=StaffType.choices)
    position_title = models.CharField(max_length=255)
    requesting_department = models.ForeignKey('config.Department', on_delete=models.PROTECT)
    number_of_positions = models.PositiveIntegerField()
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)

    # Duration & Budget
    start_date = models.DateField()
    end_date = models.DateField()
    proposed_salary = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    budget_line = models.CharField(max_length=255)
    total_budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)

    # Requirements
    qualifications = models.TextField()
    skills_required = models.TextField()
    experience_years = models.PositiveIntegerField()
    education_level = models.CharField(max_length=100)

    # Job Details
    job_description = models.TextField()
    key_responsibilities = models.TextField()
    reporting_to = models.ForeignKey(User, on_delete=models.PROTECT, related_name='requisitions_reporting_to')
    location = models.ForeignKey('config.Location', on_delete=models.PROTECT)
    work_arrangement = models.CharField(max_length=10, choices=WorkArrangement.choices, null=True, blank=True)

    # Justification
    business_justification = models.TextField()
    urgency_reason = models.TextField(null=True, blank=True)
    alternative_considered = models.TextField(null=True, blank=True)
    additional_notes = models.TextField(null=True, blank=True)

    # Approval Workflow
    reviewer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='requisitions_to_review')
    authorizer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='requisitions_to_authorize')
    approver = models.ForeignKey(User, on_delete=models.PROTECT, related_name='requisitions_to_approve')

    # Approval Tracking
    reviewed_at = models.DateTimeField(null=True, blank=True)
    authorized_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)

    # Status
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    # Conversion to Advertisement
    converted_to_advertisement = models.BooleanField(default=False)
    advertisement = models.ForeignKey(
        'contracts_grants.ConsultantManagement',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='requisition'
    )

    # Audit Fields
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='requisitions_created')
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='requisitions_updated')

    class Meta:
        db_table = 'adhoc_requisitions'
        ordering = ['-created_datetime']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['requesting_department', 'status']),
            models.Index(fields=['created_datetime']),
        ]

    def __str__(self):
        return f"{self.requisition_number} - {self.position_title}"

    def save(self, *args, **kwargs):
        # Auto-generate requisition number
        if not self.requisition_number:
            last_req = AdhocRequisition.objects.all().order_by('-created_datetime').first()
            if last_req and last_req.requisition_number:
                last_num = int(last_req.requisition_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.requisition_number = f"ADH-REQ-{timezone.now().year}-{new_num:05d}"

        # Auto-submit for approval if all approvers are set and status is DRAFT
        if self.status == self.Status.DRAFT and self.reviewer and self.authorizer and self.approver:
            if self.pk:  # Only on update, not creation
                old_instance = AdhocRequisition.objects.get(pk=self.pk)
                if old_instance.status == self.Status.DRAFT:
                    self.status = self.Status.PENDING_APPROVAL

        super().save(*args, **kwargs)


class RequisitionApprovalHistory(models.Model):
    """Track all approval actions"""

    class Action(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        REVIEWED = 'REVIEWED', 'Reviewed'
        AUTHORIZED = 'AUTHORIZED', 'Authorized'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requisition = models.ForeignKey(AdhocRequisition, on_delete=models.CASCADE, related_name='approval_history')
    action = models.CharField(max_length=20, choices=Action.choices)
    performed_by = models.ForeignKey(User, on_delete=models.PROTECT)
    performed_at = models.DateTimeField(auto_now_add=True)
    comments = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'requisition_approval_history'
        ordering = ['performed_at']
        verbose_name_plural = 'Requisition approval histories'

    def __str__(self):
        return f"{self.requisition.requisition_number} - {self.action} by {self.performed_by}"


class RequisitionAttachment(models.Model):
    """Store attachments for requisitions"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requisition = models.ForeignKey(AdhocRequisition, on_delete=models.CASCADE, related_name='attachments')
    file_name = models.CharField(max_length=255)
    file_url = models.FileField(upload_to='requisitions/attachments/%Y/%m/')
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'requisition_attachments'
        ordering = ['uploaded_at']

    def __str__(self):
        return f"{self.requisition.requisition_number} - {self.file_name}"
```

---

## API Endpoints

### 1. List All Requisitions

**Endpoint:** `GET /api/adhoc-requisitions/`

**Description:** Get paginated list of all requisitions (filtered by permissions)

**Query Parameters:**
- `page` (int, default: 1)
- `size` (int, default: 20, max: 100)
- `search` (string) - Search in position_title, requisition_number
- `staff_type` (string) - Filter by CONSULTANT, ADHOC, FACILITATOR
- `status` (string) - Filter by status
- `priority` (string) - Filter by priority
- `department` (uuid) - Filter by requesting_department
- `date_from` (date) - Filter by created_datetime >= date
- `date_to` (date) - Filter by created_datetime <= date

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Requisitions retrieved successfully",
  "data": {
    "paginator": {
      "count": 45,
      "page": 1,
      "page_size": 20,
      "total_pages": 3,
      "next_page_number": 2,
      "previous_page_number": null,
      "next": "/api/adhoc-requisitions/?page=2",
      "previous": null
    },
    "results": [
      {
        "id": "uuid",
        "requisition_number": "ADH-REQ-2025-00001",
        "staff_type": "CONSULTANT",
        "position_title": "Senior Data Analyst",
        "requesting_department": {
          "id": "uuid",
          "name": "Finance Department"
        },
        "requesting_department_name": "Finance Department",
        "number_of_positions": 2,
        "priority": "HIGH",
        "start_date": "2025-02-01",
        "end_date": "2025-08-01",
        "proposed_salary": "500000.00",
        "currency": "NGN",
        "budget_line": "5200 - Consultancy Services",
        "status": "PENDING_APPROVAL",
        "status_display": "Pending Approval",
        "reviewer_detail": {
          "id": "uuid",
          "first_name": "John",
          "last_name": "Doe",
          "email": "john@ahni.org"
        },
        "reviewed_at": null,
        "authorized_at": null,
        "approved_at": null,
        "created_by": {
          "id": "uuid",
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane@ahni.org"
        },
        "created_datetime": "2025-01-15T10:30:00Z",
        "updated_datetime": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 2. Get Single Requisition

**Endpoint:** `GET /api/adhoc-requisitions/{id}/`

**Description:** Get detailed information about a specific requisition

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Requisition retrieved successfully",
  "data": {
    "id": "uuid",
    "requisition_number": "ADH-REQ-2025-00001",
    "staff_type": "CONSULTANT",
    "position_title": "Senior Data Analyst",
    "requesting_department": {
      "id": "uuid",
      "name": "Finance Department",
      "code": "FIN"
    },
    "number_of_positions": 2,
    "priority": "HIGH",
    "start_date": "2025-02-01",
    "end_date": "2025-08-01",
    "proposed_salary": "500000.00",
    "currency": "NGN",
    "budget_line": "5200 - Consultancy Services",
    "total_budget": "3000000.00",
    "qualifications": "Bachelor's degree in Computer Science or related field...",
    "skills_required": "Python, SQL, Data Analysis, Statistical Modeling...",
    "experience_years": 5,
    "education_level": "Bachelor's Degree",
    "job_description": "We are seeking a Senior Data Analyst...",
    "key_responsibilities": "- Analyze complex datasets\n- Create reports...",
    "reporting_to": {
      "id": "uuid",
      "first_name": "Mike",
      "last_name": "Johnson",
      "email": "mike@ahni.org",
      "designation": "Director of Finance"
    },
    "location": {
      "id": "uuid",
      "name": "Abuja Office",
      "state": "FCT"
    },
    "work_arrangement": "HYBRID",
    "business_justification": "The Finance Department requires...",
    "urgency_reason": "Critical project deadline in Q1 2025",
    "alternative_considered": "Considered internal reassignment...",
    "additional_notes": "Preferred start date is February 1st",
    "reviewer_detail": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@ahni.org"
    },
    "authorizer_detail": {
      "id": "uuid",
      "first_name": "Sarah",
      "last_name": "Lee",
      "email": "sarah@ahni.org"
    },
    "approver_detail": {
      "id": "uuid",
      "first_name": "David",
      "last_name": "Brown",
      "email": "david@ahni.org"
    },
    "reviewed_at": "2025-01-16T09:15:00Z",
    "authorized_at": null,
    "approved_at": null,
    "rejected_at": null,
    "rejection_reason": null,
    "status": "PENDING_APPROVAL",
    "status_display": "Pending Approval",
    "converted_to_advertisement": false,
    "advertisement_id": null,
    "attachments": [
      {
        "id": "uuid",
        "file_name": "job_requirements.pdf",
        "file_url": "/media/requisitions/attachments/2025/01/job_requirements.pdf",
        "uploaded_at": "2025-01-15T10:35:00Z"
      }
    ],
    "approval_history": [
      {
        "id": "uuid",
        "action": "SUBMITTED",
        "performed_by": {
          "id": "uuid",
          "first_name": "Jane",
          "last_name": "Smith"
        },
        "performed_at": "2025-01-15T10:30:00Z",
        "comments": "Urgent requirement for Q1 project"
      },
      {
        "id": "uuid",
        "action": "REVIEWED",
        "performed_by": {
          "id": "uuid",
          "first_name": "John",
          "last_name": "Doe"
        },
        "performed_at": "2025-01-16T09:15:00Z",
        "comments": "Approved. Budget line verified."
      }
    ],
    "created_by": {
      "id": "uuid",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@ahni.org"
    },
    "created_datetime": "2025-01-15T10:30:00Z",
    "updated_datetime": "2025-01-16T09:15:00Z"
  }
}
```

---

### 3. Create Requisition

**Endpoint:** `POST /api/adhoc-requisitions/`

**Description:** Create a new adhoc staff requisition

**Request Body:**
```json
{
  "staff_type": "CONSULTANT",
  "position_title": "Senior Data Analyst",
  "requesting_department": "uuid",
  "number_of_positions": "2",
  "priority": "HIGH",
  "start_date": "2025-02-01",
  "end_date": "2025-08-01",
  "proposed_salary": "500000",
  "currency": "NGN",
  "budget_line": "5200 - Consultancy Services",
  "total_budget": "3000000",
  "qualifications": "Bachelor's degree in Computer Science...",
  "skills_required": "Python, SQL, Data Analysis...",
  "experience_years": "5",
  "education_level": "Bachelor's Degree",
  "job_description": "We are seeking a Senior Data Analyst...",
  "key_responsibilities": "- Analyze complex datasets...",
  "reporting_to": "uuid",
  "location": "uuid",
  "work_arrangement": "HYBRID",
  "business_justification": "The Finance Department requires...",
  "urgency_reason": "Critical project deadline",
  "alternative_considered": "Considered internal reassignment",
  "reviewer_id": "uuid",
  "authorizer_id": "uuid",
  "approver_id": "uuid",
  "additional_notes": "Preferred start date is February 1st"
}
```

**Response:** `201 Created`
```json
{
  "status": true,
  "message": "Requisition created successfully",
  "data": {
    "id": "uuid",
    "requisition_number": "ADH-REQ-2025-00001",
    "status": "PENDING_APPROVAL",
    ...
  }
}
```

---

### 4. Update Requisition

**Endpoint:** `PATCH /api/adhoc-requisitions/{id}/`

**Description:** Update a requisition (only allowed for DRAFT status)

**Request Body:** (Same as Create, partial updates allowed)

**Response:** `200 OK`

---

### 5. Delete Requisition

**Endpoint:** `DELETE /api/adhoc-requisitions/{id}/`

**Description:** Delete a requisition (only allowed for DRAFT status)

**Response:** `204 No Content`

---

### 6. Review Requisition

**Endpoint:** `POST /api/adhoc-requisitions/{id}/review/`

**Description:** Review and approve/reject at review stage

**Permissions:** Only the assigned reviewer can perform this action

**Request Body:**
```json
{
  "action": "review",
  "comments": "Budget line verified. Approved for authorization."
}
```

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Requisition reviewed successfully",
  "data": {
    "id": "uuid",
    "status": "PENDING_APPROVAL",
    "reviewed_at": "2025-01-16T09:15:00Z"
  }
}
```

---

### 7. Authorize Requisition

**Endpoint:** `POST /api/adhoc-requisitions/{id}/authorize/`

**Description:** Authorize requisition (after review)

**Permissions:** Only the assigned authorizer can perform this action

**Request Body:**
```json
{
  "action": "authorize",
  "comments": "Budget authorized. Proceeding to final approval."
}
```

**Response:** `200 OK`

---

### 8. Approve Requisition

**Endpoint:** `POST /api/adhoc-requisitions/{id}/approve/`

**Description:** Give final approval to requisition

**Permissions:** Only the assigned approver can perform this action

**Request Body:**
```json
{
  "action": "approve",
  "comments": "Final approval granted. Ready for advertisement."
}
```

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Requisition approved successfully",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "approved_at": "2025-01-17T14:20:00Z"
  }
}
```

---

### 9. Reject Requisition

**Endpoint:** `POST /api/adhoc-requisitions/{id}/reject/`

**Description:** Reject requisition at any approval stage

**Permissions:** Any approver in the chain can reject

**Request Body:**
```json
{
  "action": "reject",
  "comments": "Budget constraints. Please revise salary expectations."
}
```

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Requisition rejected",
  "data": {
    "id": "uuid",
    "status": "REJECTED",
    "rejected_at": "2025-01-16T11:30:00Z",
    "rejection_reason": "Budget constraints. Please revise salary expectations."
  }
}
```

---

### 10. My Requisitions

**Endpoint:** `GET /api/adhoc-requisitions/my-requisitions/`

**Description:** Get requisitions created by the current user

**Query Parameters:** Same as List endpoint

**Response:** Same format as List endpoint

---

### 11. Pending Approvals

**Endpoint:** `GET /api/adhoc-requisitions/pending-approvals/`

**Description:** Get requisitions pending approval by current user

**Logic:**
- If user is reviewer: Show requisitions in PENDING_APPROVAL status where reviewed_at is NULL
- If user is authorizer: Show requisitions where reviewed_at is NOT NULL and authorized_at is NULL
- If user is approver: Show requisitions where authorized_at is NOT NULL and approved_at is NULL

**Response:** Same format as List endpoint

---

### 12. Convert to Advertisement

**Endpoint:** `POST /api/adhoc-requisitions/{id}/convert-to-advertisement/`

**Description:** Convert approved requisition to job advertisement

**Permissions:** Only HR or Admin can perform this action

**Prerequisites:**
- Requisition status must be APPROVED
- Not already converted

**Request Body:** (Empty or optional additional data)

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Requisition converted to job advertisement successfully",
  "data": {
    "requisition_id": "uuid",
    "advertisement_id": "uuid",
    "advertisement_url": "/dashboard/c-and-g/consultant-management/uuid"
  }
}
```

**Backend Logic:**
```python
# Create ConsultantManagement record from requisition
advertisement = ConsultantManagement.objects.create(
    title=requisition.position_title,
    locations=[requisition.location],
    grade_level=requisition.education_level,
    commencement_date=requisition.start_date,
    end_date=requisition.end_date,
    consultants_number=requisition.number_of_positions,
    type=requisition.staff_type,
    status='DRAFT',
    created_by=request.user
)

# Create scope of work
ScopeOfWork.objects.create(
    consultant_management=advertisement,
    description=requisition.job_description,
    background=requisition.business_justification,
    objectives=requisition.key_responsibilities,
    ...
)

# Update requisition
requisition.converted_to_advertisement = True
requisition.advertisement = advertisement
requisition.status = AdhocRequisition.Status.CONVERTED_TO_AD
requisition.save()

# Log history
RequisitionApprovalHistory.objects.create(
    requisition=requisition,
    action='CONVERTED',
    performed_by=request.user,
    comments='Converted to job advertisement'
)
```

---

## Serializers

### RequisitionListSerializer
```python
class RequisitionListSerializer(serializers.ModelSerializer):
    requesting_department = DepartmentSerializer(read_only=True)
    requesting_department_name = serializers.CharField(source='requesting_department.name', read_only=True)
    reviewer_detail = UserMinimalSerializer(source='reviewer', read_only=True)
    authorizer_detail = UserMinimalSerializer(source='authorizer', read_only=True)
    approver_detail = UserMinimalSerializer(source='approver', read_only=True)
    created_by = UserMinimalSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AdhocRequisition
        fields = [
            'id', 'requisition_number', 'staff_type', 'position_title',
            'requesting_department', 'requesting_department_name',
            'number_of_positions', 'priority', 'start_date', 'end_date',
            'proposed_salary', 'currency', 'budget_line', 'status', 'status_display',
            'reviewer_detail', 'authorizer_detail', 'approver_detail',
            'reviewed_at', 'authorized_at', 'approved_at', 'rejected_at',
            'created_by', 'created_datetime', 'updated_datetime'
        ]
```

### RequisitionDetailSerializer
```python
class RequisitionDetailSerializer(serializers.ModelSerializer):
    requesting_department = DepartmentSerializer(read_only=True)
    reviewer_detail = UserDetailSerializer(source='reviewer', read_only=True)
    authorizer_detail = UserDetailSerializer(source='authorizer', read_only=True)
    approver_detail = UserDetailSerializer(source='approver', read_only=True)
    reporting_to = UserDetailSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    created_by = UserDetailSerializer(read_only=True)
    attachments = RequisitionAttachmentSerializer(many=True, read_only=True)
    approval_history = RequisitionApprovalHistorySerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AdhocRequisition
        fields = '__all__'
```

### RequisitionCreateUpdateSerializer
```python
class RequisitionCreateUpdateSerializer(serializers.ModelSerializer):
    reviewer_id = serializers.UUIDField(write_only=True)
    authorizer_id = serializers.UUIDField(write_only=True)
    approver_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = AdhocRequisition
        fields = [
            'staff_type', 'position_title', 'requesting_department',
            'number_of_positions', 'priority', 'start_date', 'end_date',
            'proposed_salary', 'currency', 'budget_line', 'total_budget',
            'qualifications', 'skills_required', 'experience_years', 'education_level',
            'job_description', 'key_responsibilities', 'reporting_to', 'location',
            'work_arrangement', 'business_justification', 'urgency_reason',
            'alternative_considered', 'additional_notes',
            'reviewer_id', 'authorizer_id', 'approver_id'
        ]

    def create(self, validated_data):
        # Extract approver IDs
        reviewer_id = validated_data.pop('reviewer_id')
        authorizer_id = validated_data.pop('authorizer_id')
        approver_id = validated_data.pop('approver_id')

        # Create requisition
        requisition = AdhocRequisition.objects.create(
            reviewer_id=reviewer_id,
            authorizer_id=authorizer_id,
            approver_id=approver_id,
            created_by=self.context['request'].user,
            **validated_data
        )

        # Log submission
        RequisitionApprovalHistory.objects.create(
            requisition=requisition,
            action=RequisitionApprovalHistory.Action.SUBMITTED,
            performed_by=self.context['request'].user,
            comments='Requisition submitted for approval'
        )

        return requisition
```

---

## Permissions

### Permission Classes

```python
from rest_framework import permissions

class IsRequisitionOwner(permissions.BasePermission):
    """Allow only the creator to edit/delete DRAFT requisitions"""

    def has_object_permission(self, request, view, obj):
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            return obj.created_by == request.user and obj.status == 'DRAFT'
        return True


class CanReviewRequisition(permissions.BasePermission):
    """Allow only assigned reviewer to review"""

    def has_object_permission(self, request, view, obj):
        return (
            obj.reviewer == request.user and
            obj.status == 'PENDING_APPROVAL' and
            obj.reviewed_at is None
        )


class CanAuthorizeRequisition(permissions.BasePermission):
    """Allow only assigned authorizer to authorize"""

    def has_object_permission(self, request, view, obj):
        return (
            obj.authorizer == request.user and
            obj.status == 'PENDING_APPROVAL' and
            obj.reviewed_at is not None and
            obj.authorized_at is None
        )


class CanApproveRequisition(permissions.BasePermission):
    """Allow only assigned approver to approve"""

    def has_object_permission(self, request, view, obj):
        return (
            obj.approver == request.user and
            obj.status == 'PENDING_APPROVAL' and
            obj.authorized_at is not None and
            obj.approved_at is None
        )


class CanConvertToAdvertisement(permissions.BasePermission):
    """Allow only HR/Admin to convert"""

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_staff or
            request.user.groups.filter(name__in=['HR', 'Admin']).exists()
        ) and obj.status == 'APPROVED'
```

---

## Notifications

### Email Notifications to Implement

1. **On Submission (Status: PENDING_APPROVAL)**
   - **To:** Reviewer
   - **Subject:** New Adhoc Staff Requisition - {requisition_number}
   - **Body:** You have a new requisition to review: {position_title}
   - **Action Link:** /dashboard/adhoc-requisition/{id}

2. **On Review Approval**
   - **To:** Authorizer
   - **Subject:** Requisition Ready for Authorization - {requisition_number}
   - **Body:** Requisition has been reviewed and requires your authorization
   - **Action Link:** /dashboard/adhoc-requisition/{id}

3. **On Authorization**
   - **To:** Final Approver
   - **Subject:** Requisition Ready for Final Approval - {requisition_number}
   - **Body:** Requisition has been authorized and requires your final approval
   - **Action Link:** /dashboard/adhoc-requisition/{id}

4. **On Final Approval**
   - **To:** Requisition Creator, HR Team
   - **Subject:** Requisition Approved - {requisition_number}
   - **Body:** Your requisition for {position_title} has been approved
   - **Action:** HR can now convert to job advertisement

5. **On Rejection**
   - **To:** Requisition Creator
   - **Subject:** Requisition Rejected - {requisition_number}
   - **Body:** Your requisition has been rejected. Reason: {rejection_reason}
   - **Action Link:** /dashboard/adhoc-requisition/{id}

6. **On Conversion to Advertisement**
   - **To:** Requisition Creator
   - **Subject:** Requisition Converted to Job Advertisement
   - **Body:** Your approved requisition has been published as a job advertisement
   - **Action Link:** /dashboard/c-and-g/consultant-management/{ad_id}

### Notification Implementation Example

```python
from django.core.mail import send_mail
from django.template.loader import render_to_string

def send_requisition_notification(requisition, action, recipient):
    """Send email notification for requisition actions"""

    subject_templates = {
        'submitted': 'New Adhoc Staff Requisition - {requisition_number}',
        'reviewed': 'Requisition Ready for Authorization - {requisition_number}',
        'authorized': 'Requisition Ready for Final Approval - {requisition_number}',
        'approved': 'Requisition Approved - {requisition_number}',
        'rejected': 'Requisition Rejected - {requisition_number}',
        'converted': 'Requisition Converted to Job Advertisement',
    }

    subject = subject_templates[action].format(
        requisition_number=requisition.requisition_number
    )

    context = {
        'requisition': requisition,
        'recipient': recipient,
        'action': action,
        'action_url': f'https://yourdomain.com/dashboard/adhoc-requisition/{requisition.id}'
    }

    html_message = render_to_string(f'emails/requisition_{action}.html', context)

    send_mail(
        subject=subject,
        message='',
        from_email='noreply@ahni.org',
        recipient_list=[recipient.email],
        html_message=html_message,
        fail_silently=False,
    )
```

---

## Integration Points

### 1. Department Model
**Path:** `config.Department`
**Fields Needed:** `id`, `name`, `code`

### 2. Location Model
**Path:** `config.Location`
**Fields Needed:** `id`, `name`, `state`

### 3. User Model
**Path:** `auth.User`
**Fields Needed:** `id`, `first_name`, `last_name`, `email`, `designation`

### 4. Consultant Management Model
**Path:** `contracts_grants.ConsultantManagement`
**Used for:** Converting approved requisitions to job advertisements
**Link:** `requisition` ForeignKey

---

## ViewSet Implementation Example

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q

class AdhocRequisitionViewSet(viewsets.ModelViewSet):
    """ViewSet for Adhoc Requisitions"""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = AdhocRequisition.objects.select_related(
            'requesting_department', 'reviewer', 'authorizer', 'approver',
            'reporting_to', 'location', 'created_by'
        ).prefetch_related('attachments', 'approval_history')

        # Filter by permissions
        if not user.is_staff:
            queryset = queryset.filter(
                Q(created_by=user) |  # Own requisitions
                Q(reviewer=user) |     # Assigned as reviewer
                Q(authorizer=user) |   # Assigned as authorizer
                Q(approver=user) |     # Assigned as approver
                Q(requesting_department__in=user.departments.all())  # Department requisitions
            )

        # Apply filters
        staff_type = self.request.query_params.get('staff_type')
        if staff_type:
            queryset = queryset.filter(staff_type=staff_type)

        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(position_title__icontains=search) |
                Q(requisition_number__icontains=search)
            )

        return queryset.distinct()

    def get_serializer_class(self):
        if self.action == 'list':
            return RequisitionListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return RequisitionCreateUpdateSerializer
        return RequisitionDetailSerializer

    @action(detail=False, methods=['get'])
    def my_requisitions(self, request):
        """Get requisitions created by current user"""
        queryset = self.get_queryset().filter(created_by=request.user)
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        """Get requisitions pending approval by current user"""
        user = request.user
        queryset = self.get_queryset().filter(
            Q(reviewer=user, reviewed_at__isnull=True) |
            Q(authorizer=user, reviewed_at__isnull=False, authorized_at__isnull=True) |
            Q(approver=user, authorized_at__isnull=False, approved_at__isnull=True)
        ).filter(status='PENDING_APPROVAL')

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[CanReviewRequisition])
    def review(self, request, pk=None):
        """Review requisition"""
        requisition = self.get_object()
        comments = request.data.get('comments', '')

        requisition.reviewed_at = timezone.now()
        requisition.save()

        # Log history
        RequisitionApprovalHistory.objects.create(
            requisition=requisition,
            action=RequisitionApprovalHistory.Action.REVIEWED,
            performed_by=request.user,
            comments=comments
        )

        # Send notification to authorizer
        send_requisition_notification(requisition, 'reviewed', requisition.authorizer)

        serializer = self.get_serializer(requisition)
        return Response({
            'status': True,
            'message': 'Requisition reviewed successfully',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'], permission_classes=[CanAuthorizeRequisition])
    def authorize(self, request, pk=None):
        """Authorize requisition"""
        requisition = self.get_object()
        comments = request.data.get('comments', '')

        requisition.authorized_at = timezone.now()
        requisition.save()

        # Log history
        RequisitionApprovalHistory.objects.create(
            requisition=requisition,
            action=RequisitionApprovalHistory.Action.AUTHORIZED,
            performed_by=request.user,
            comments=comments
        )

        # Send notification to approver
        send_requisition_notification(requisition, 'authorized', requisition.approver)

        serializer = self.get_serializer(requisition)
        return Response({
            'status': True,
            'message': 'Requisition authorized successfully',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'], permission_classes=[CanApproveRequisition])
    def approve(self, request, pk=None):
        """Give final approval"""
        requisition = self.get_object()
        comments = request.data.get('comments', '')

        requisition.approved_at = timezone.now()
        requisition.status = AdhocRequisition.Status.APPROVED
        requisition.save()

        # Log history
        RequisitionApprovalHistory.objects.create(
            requisition=requisition,
            action=RequisitionApprovalHistory.Action.APPROVED,
            performed_by=request.user,
            comments=comments
        )

        # Send notification to creator and HR
        send_requisition_notification(requisition, 'approved', requisition.created_by)

        serializer = self.get_serializer(requisition)
        return Response({
            'status': True,
            'message': 'Requisition approved successfully',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject requisition"""
        requisition = self.get_object()
        comments = request.data.get('comments', '')

        if not comments:
            return Response({
                'status': False,
                'message': 'Rejection reason is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        requisition.rejected_at = timezone.now()
        requisition.rejection_reason = comments
        requisition.status = AdhocRequisition.Status.REJECTED
        requisition.save()

        # Log history
        RequisitionApprovalHistory.objects.create(
            requisition=requisition,
            action=RequisitionApprovalHistory.Action.REJECTED,
            performed_by=request.user,
            comments=comments
        )

        # Send notification to creator
        send_requisition_notification(requisition, 'rejected', requisition.created_by)

        serializer = self.get_serializer(requisition)
        return Response({
            'status': True,
            'message': 'Requisition rejected',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'], permission_classes=[CanConvertToAdvertisement])
    def convert_to_advertisement(self, request, pk=None):
        """Convert approved requisition to job advertisement"""
        requisition = self.get_object()

        if requisition.converted_to_advertisement:
            return Response({
                'status': False,
                'message': 'Requisition already converted to advertisement'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create ConsultantManagement record
        from contracts_grants.models import ConsultantManagement, ScopeOfWork

        advertisement = ConsultantManagement.objects.create(
            title=requisition.position_title,
            grade_level=requisition.education_level,
            commencement_date=requisition.start_date,
            end_date=requisition.end_date,
            consultants_number=requisition.number_of_positions,
            type=requisition.staff_type,
            status='DRAFT',
            created_by=request.user
        )
        advertisement.locations.add(requisition.location)

        # Create scope of work
        ScopeOfWork.objects.create(
            consultant_management=advertisement,
            description=requisition.job_description,
            background=requisition.business_justification,
            objectives=requisition.key_responsibilities,
        )

        # Update requisition
        requisition.converted_to_advertisement = True
        requisition.advertisement = advertisement
        requisition.status = AdhocRequisition.Status.CONVERTED_TO_AD
        requisition.save()

        # Log history
        RequisitionApprovalHistory.objects.create(
            requisition=requisition,
            action='CONVERTED',
            performed_by=request.user,
            comments='Converted to job advertisement'
        )

        # Send notification
        send_requisition_notification(requisition, 'converted', requisition.created_by)

        return Response({
            'status': True,
            'message': 'Requisition converted to job advertisement successfully',
            'data': {
                'requisition_id': str(requisition.id),
                'advertisement_id': str(advertisement.id),
                'advertisement_url': f'/dashboard/c-and-g/consultant-management/{advertisement.id}'
            }
        })
```

---

## URL Configuration

```python
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()
router.register(r'adhoc-requisitions', AdhocRequisitionViewSet, basename='adhoc-requisition')

urlpatterns = [
    path('api/', include(router.urls)),
]
```

---

## Testing Checklist

### API Endpoints to Test:
- [ ] List all requisitions with filters
- [ ] Get single requisition detail
- [ ] Create requisition (auto-generate requisition_number)
- [ ] Update requisition (only DRAFT status)
- [ ] Delete requisition (only DRAFT status)
- [ ] Review requisition (permission check)
- [ ] Authorize requisition (permission check)
- [ ] Approve requisition (permission check)
- [ ] Reject requisition (any approver)
- [ ] Get my requisitions
- [ ] Get pending approvals (filtered by user role)
- [ ] Convert to advertisement (permission check)

### Email Notifications to Test:
- [ ] Notification on submission to reviewer
- [ ] Notification on review to authorizer
- [ ] Notification on authorization to approver
- [ ] Notification on approval to creator + HR
- [ ] Notification on rejection to creator
- [ ] Notification on conversion to creator

### Integration Tests:
- [ ] Create requisition → Auto-submit if approvers set
- [ ] Approval workflow (Review → Authorize → Approve)
- [ ] Convert to ConsultantManagement record
- [ ] Approval history logging
- [ ] Permission checks at each stage

---

## Migration Commands

```bash
# Generate migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create test data (optional)
python manage.py shell
from adhoc_requisitions.factories import RequisitionFactory
RequisitionFactory.create_batch(20)
```

---

## Environment Variables

Add to `.env`:
```
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@ahni.org
EMAIL_HOST_PASSWORD=your_password

# Notification URLs
FRONTEND_BASE_URL=https://yourdomain.com
```

---

## Summary

This specification provides:
1. ✅ Complete database schema (3 models)
2. ✅ 12 API endpoints
3. ✅ Detailed request/response formats
4. ✅ Permission classes
5. ✅ Email notification system
6. ✅ Integration with existing modules
7. ✅ ViewSet implementation example
8. ✅ Testing checklist

**Next Steps:**
1. Implement models in Django
2. Create serializers
3. Build ViewSet with custom actions
4. Set up email templates
5. Write tests
6. Deploy and test end-to-end

The frontend is already complete and ready to consume these APIs!