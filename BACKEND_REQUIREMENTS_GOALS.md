# Backend Requirements - Goals Management System

## Overview
This document outlines the backend API requirements for the Goals Management system with role-based access control.

---

## 1. Database Models

### **Goal Model**
```python
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Goal(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    total_weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    approved = models.BooleanField(default=False)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_goals'
        ordering = ['-created_datetime']

    def __str__(self):
        return f"{self.title} - {self.employee.get_full_name()}"

    def calculate_total_weight(self):
        """Calculate total weight from narratives"""
        total = self.narratives.aggregate(
            total=models.Sum('weight')
        )['total'] or 0
        self.total_weight = total
        return total

    def save(self, *args, **kwargs):
        # Auto-calculate total weight before saving
        if self.pk:  # Only if updating existing goal
            self.calculate_total_weight()
        super().save(*args, **kwargs)
```

### **GoalNarrative Model**
```python
class GoalNarrative(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='narratives')
    description = models.TextField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # 0.00 to 100.00
    completed = models.BooleanField(default=False)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_goal_narratives'
        ordering = ['created_datetime']

    def __str__(self):
        return f"{self.description[:50]} - {self.weight}%"
```

---

## 2. Serializers

### **GoalNarrativeSerializer**
```python
from rest_framework import serializers

class GoalNarrativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalNarrative
        fields = [
            'id',
            'description',
            'weight',
            'completed',
            'created_datetime',
            'updated_datetime'
        ]
        # IMPORTANT: Do NOT include 'goal' FK field to avoid circular reference
```

### **GoalSerializer (for LIST/RETRIEVE)**
```python
class GoalSerializer(serializers.ModelSerializer):
    narratives = GoalNarrativeSerializer(many=True, read_only=True)
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            'id',
            'employee',
            'employee_name',
            'title',
            'description',
            'status',
            'start_date',
            'end_date',
            'total_weight',
            'approved',
            'narratives',
            'created_datetime',
            'updated_datetime'
        ]
        read_only_fields = ['id', 'total_weight', 'created_datetime', 'updated_datetime']

    def get_employee_name(self, obj):
        """Return employee's full name"""
        return f"{obj.employee.first_name} {obj.employee.last_name}"
```

### **GoalCreateUpdateSerializer**
```python
class GoalCreateUpdateSerializer(serializers.ModelSerializer):
    narratives = GoalNarrativeSerializer(many=True)

    class Meta:
        model = Goal
        fields = [
            'employee',
            'title',
            'description',
            'status',
            'start_date',
            'end_date',
            'narratives'
        ]

    def validate_narratives(self, narratives):
        """Validate that narratives sum to 100%"""
        if not narratives or len(narratives) == 0:
            raise serializers.ValidationError("At least one narrative/task is required")

        total_weight = sum(float(n['weight']) for n in narratives)

        # Allow small floating point tolerance
        if abs(total_weight - 100.0) > 0.01:
            raise serializers.ValidationError(
                f"Task weights must sum to 100%. Current total: {total_weight:.2f}%"
            )

        # Validate individual weights
        for i, narrative in enumerate(narratives, 1):
            weight = float(narrative['weight'])
            if weight < 0 or weight > 100:
                raise serializers.ValidationError(
                    f"Task {i} weight must be between 0-100. Got: {weight}"
                )

        return narratives

    def validate_employee(self, employee):
        """Validate employee access based on user role"""
        request = self.context.get('request')
        user = request.user

        # Check if user is trying to create goal for someone else
        if not self._is_hr_admin(user) and str(employee.id) != str(user.id):
            raise serializers.ValidationError(
                "You can only create goals for yourself. Contact HR for assistance."
            )

        return employee

    def _is_hr_admin(self, user):
        """Check if user is HR or Admin"""
        return (
            user.is_superuser or
            user.groups.filter(name__in=['HR', 'Admin']).exists() or
            getattr(user, 'role', None) in ['admin', 'hr']
        )

    def create(self, validated_data):
        narratives_data = validated_data.pop('narratives', [])

        # Create goal
        goal = Goal.objects.create(**validated_data)

        # Create narratives
        for narrative_data in narratives_data:
            GoalNarrative.objects.create(goal=goal, **narrative_data)

        # Calculate and save total weight
        goal.calculate_total_weight()
        goal.save()

        return goal

    def update(self, instance, validated_data):
        narratives_data = validated_data.pop('narratives', None)

        # Update goal fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update narratives if provided
        if narratives_data is not None:
            # Delete existing narratives
            instance.narratives.all().delete()

            # Create new narratives
            for narrative_data in narratives_data:
                GoalNarrative.objects.create(goal=instance, **narrative_data)

            # Recalculate total weight
            instance.calculate_total_weight()
            instance.save()

        return instance
```

---

## 3. Views / ViewSet

### **GoalViewSet**
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

class GoalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return GoalCreateUpdateSerializer
        return GoalSerializer

    def get_queryset(self):
        """
        Return all goals for HR/Admin, only user's goals for regular staff
        """
        user = self.request.user
        queryset = Goal.objects.select_related('employee').prefetch_related('narratives')

        # If user is HR/Admin, return all goals
        if self._is_hr_admin(user):
            # Support filtering by employee
            employee_id = self.request.query_params.get('employee', None)
            if employee_id:
                queryset = queryset.filter(employee__id=employee_id)
        else:
            # Regular staff: only their own goals
            queryset = queryset.filter(employee=user)

        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return queryset

    def _is_hr_admin(self, user):
        """Check if user is HR or Admin"""
        return (
            user.is_superuser or
            user.groups.filter(name__in=['HR', 'Admin']).exists() or
            getattr(user, 'role', None) in ['admin', 'hr']
        )

    def perform_create(self, serializer):
        """Create goal with additional validation"""
        user = self.request.user
        employee = serializer.validated_data.get('employee')

        # Double-check permission (serializer also validates)
        if not self._is_hr_admin(user) and employee.id != user.id:
            raise PermissionError("You can only create goals for yourself")

        serializer.save()

    def perform_update(self, serializer):
        """Update goal with permission check"""
        user = self.request.user
        goal = self.get_object()

        # Check if user has permission to update this goal
        if not self._is_hr_admin(user) and goal.employee.id != user.id:
            raise PermissionError("You can only update your own goals")

        serializer.save()

    def perform_destroy(self, instance):
        """Delete goal with permission check"""
        user = self.request.user

        # Check if user has permission to delete this goal
        if not self._is_hr_admin(user) and instance.employee.id != user.id:
            raise PermissionError("You can only delete your own goals")

        instance.delete()

    @action(detail=False, methods=['get'])
    def my_goals(self, request):
        """Endpoint to get current user's goals"""
        queryset = self.get_queryset().filter(employee=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'status': True,
            'message': 'Goals retrieved successfully',
            'data': serializer.data
        })
```

---

## 4. URL Configuration

### **urls.py**
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet

router = DefaultRouter()
router.register(r'goal', GoalViewSet, basename='goal')

urlpatterns = [
    path('hr/employees/', include(router.urls)),
]
```

**Generated URLs:**
- `GET /api/v1/hr/employees/goal/` - List all goals (filtered by role)
- `POST /api/v1/hr/employees/goal/` - Create new goal
- `GET /api/v1/hr/employees/goal/{id}/` - Get single goal
- `PUT /api/v1/hr/employees/goal/{id}/` - Update goal
- `DELETE /api/v1/hr/employees/goal/{id}/` - Delete goal
- `GET /api/v1/hr/employees/goal/my_goals/` - Get current user's goals

---

## 5. API Endpoints

### **5.1 List Goals**

#### **For HR/Admin:**
```http
GET /api/v1/hr/employees/goal/
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": true,
  "message": "Goals retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "employee": "employee-uuid-1",
      "employee_name": "John Doe",
      "title": "Improve Customer Satisfaction",
      "description": "Focus on enhancing customer experience",
      "status": "in_progress",
      "start_date": "2025-01-01",
      "end_date": "2025-12-31",
      "total_weight": "100.00",
      "approved": false,
      "narratives": [
        {
          "id": "narrative-uuid-1",
          "description": "Reduce response time by 30%",
          "weight": "40.00",
          "completed": false,
          "created_datetime": "2025-01-04T12:00:00Z",
          "updated_datetime": "2025-01-04T12:00:00Z"
        },
        {
          "id": "narrative-uuid-2",
          "description": "Achieve 90% satisfaction rating",
          "weight": "60.00",
          "completed": false,
          "created_datetime": "2025-01-04T12:00:00Z",
          "updated_datetime": "2025-01-04T12:00:00Z"
        }
      ],
      "created_datetime": "2025-01-04T12:00:00Z",
      "updated_datetime": "2025-01-04T12:00:00Z"
    },
    {
      "id": "uuid-2",
      "employee": "employee-uuid-2",
      "employee_name": "Jane Smith",
      "title": "Professional Development",
      "description": "Complete certifications and training",
      "status": "not_started",
      "total_weight": "100.00",
      "narratives": [
        {
          "id": "narrative-uuid-3",
          "description": "Complete AWS certification",
          "weight": "50.00",
          "completed": false,
          "created_datetime": "2025-01-05T10:00:00Z",
          "updated_datetime": "2025-01-05T10:00:00Z"
        },
        {
          "id": "narrative-uuid-4",
          "description": "Attend 2 conferences",
          "weight": "50.00",
          "completed": false,
          "created_datetime": "2025-01-05T10:00:00Z",
          "updated_datetime": "2025-01-05T10:00:00Z"
        }
      ],
      "created_datetime": "2025-01-05T10:00:00Z",
      "updated_datetime": "2025-01-05T10:00:00Z"
    }
  ]
}
```

#### **For Regular Staff:**
```http
GET /api/v1/hr/employees/goal/
Authorization: Bearer {staff-token}
```

**Response (filtered to only their goals):**
```json
{
  "status": true,
  "message": "Goals retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "employee": "current-user-uuid",
      "employee_name": "Current User",
      "title": "My Personal Goal",
      "description": "My goal description",
      "status": "in_progress",
      "total_weight": "100.00",
      "narratives": [
        {
          "id": "narrative-uuid-1",
          "description": "Task 1",
          "weight": "50.00",
          "completed": false,
          "created_datetime": "2025-01-04T12:00:00Z",
          "updated_datetime": "2025-01-04T12:00:00Z"
        },
        {
          "id": "narrative-uuid-2",
          "description": "Task 2",
          "weight": "50.00",
          "completed": false,
          "created_datetime": "2025-01-04T12:00:00Z",
          "updated_datetime": "2025-01-04T12:00:00Z"
        }
      ],
      "created_datetime": "2025-01-04T12:00:00Z",
      "updated_datetime": "2025-01-04T12:00:00Z"
    }
  ]
}
```

### **5.2 Filter by Employee**
```http
GET /api/v1/hr/employees/goal/?employee={employee-uuid}
Authorization: Bearer {admin-token}
```

**Response:** Returns goals for specific employee (admin only)

### **5.3 Create Goal**

#### **Staff Creating Own Goal:**
```http
POST /api/v1/hr/employees/goal/
Authorization: Bearer {staff-token}
Content-Type: application/json

{
  "employee": "current-user-uuid",
  "title": "Improve Communication Skills",
  "description": "Focus on presentation and writing skills",
  "status": "not_started",
  "narratives": [
    {
      "description": "Complete public speaking course",
      "weight": 30.0,
      "completed": false
    },
    {
      "description": "Write 5 technical articles",
      "weight": 40.0,
      "completed": false
    },
    {
      "description": "Lead 3 team presentations",
      "weight": 30.0,
      "completed": false
    }
  ]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Goal created successfully",
  "data": {
    "id": "new-goal-uuid",
    "employee": "current-user-uuid",
    "employee_name": "Current User",
    "title": "Improve Communication Skills",
    "description": "Focus on presentation and writing skills",
    "status": "not_started",
    "total_weight": "100.00",
    "narratives": [
      {
        "id": "narrative-uuid-1",
        "description": "Complete public speaking course",
        "weight": "30.00",
        "completed": false,
        "created_datetime": "2025-01-04T12:00:00Z",
        "updated_datetime": "2025-01-04T12:00:00Z"
      },
      {
        "id": "narrative-uuid-2",
        "description": "Write 5 technical articles",
        "weight": "40.00",
        "completed": false,
        "created_datetime": "2025-01-04T12:00:00Z",
        "updated_datetime": "2025-01-04T12:00:00Z"
      },
      {
        "id": "narrative-uuid-3",
        "description": "Lead 3 team presentations",
        "weight": "30.00",
        "completed": false,
        "created_datetime": "2025-01-04T12:00:00Z",
        "updated_datetime": "2025-01-04T12:00:00Z"
      }
    ],
    "created_datetime": "2025-01-04T12:00:00Z",
    "updated_datetime": "2025-01-04T12:00:00Z"
  }
}
```

#### **Admin Creating Goal for Employee:**
```http
POST /api/v1/hr/employees/goal/
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "employee": "other-employee-uuid",
  "title": "Sales Target Achievement",
  "description": "Meet quarterly sales goals",
  "status": "not_started",
  "narratives": [
    {
      "description": "Acquire 10 new clients",
      "weight": 50.0,
      "completed": false
    },
    {
      "description": "Upsell to 5 existing clients",
      "weight": 50.0,
      "completed": false
    }
  ]
}
```

### **5.4 Get Single Goal**
```http
GET /api/v1/hr/employees/goal/{goal-id}/
Authorization: Bearer {token}
```

**Response:** Same structure as create response

### **5.5 Update Goal**
```http
PUT /api/v1/hr/employees/goal/{goal-id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "employee": "employee-uuid",
  "title": "Updated Goal Title",
  "description": "Updated description",
  "status": "in_progress",
  "narratives": [
    {
      "description": "Updated task 1",
      "weight": 60.0,
      "completed": true
    },
    {
      "description": "Updated task 2",
      "weight": 40.0,
      "completed": false
    }
  ]
}
```

### **5.6 Delete Goal**
```http
DELETE /api/v1/hr/employees/goal/{goal-id}/
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": true,
  "message": "Goal deleted successfully"
}
```

---

## 6. Validation Rules

### **Goal Level:**
1. ✅ `title` is required (max 255 characters)
2. ✅ `description` is optional
3. ✅ `employee` must be a valid user
4. ✅ `status` must be one of: not_started, in_progress, completed, on_hold, cancelled
5. ✅ At least 1 narrative is required

### **Narrative Level:**
1. ✅ `description` is required
2. ✅ `weight` must be between 0-100
3. ✅ All narrative weights must sum to exactly 100% (tolerance: ±0.01)
4. ✅ `completed` defaults to False

### **Permission Level:**
1. ✅ Staff can only create goals where `employee` = their own user ID
2. ✅ Staff can only view/edit/delete their own goals
3. ✅ HR/Admin can create goals for any employee
4. ✅ HR/Admin can view/edit/delete any goal

---

## 7. Error Responses

### **Validation Error:**
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "Task weights must sum to 100%. Current total: 95.00%",
  "data": null
}
```

### **Permission Denied:**
```json
{
  "status": false,
  "error_code": "permission_denied",
  "message": "You can only create goals for yourself. Contact HR for assistance.",
  "data": null
}
```

### **Not Found:**
```json
{
  "status": false,
  "error_code": "not_found",
  "message": "Goal not found",
  "data": null
}
```

### **Narratives Sum Error:**
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "Task weights must sum to 100%. Current total: 110.50%",
  "data": {
    "narratives": ["Task weights must sum to 100%. Current total: 110.50%"]
  }
}
```

---

## 8. Testing Scenarios

### **Test Case 1: Staff Creates Own Goal**
```
Given: Regular staff user is logged in
When: POST /api/v1/hr/employees/goal/ with employee = current user
Then: Goal is created successfully
And: Narratives sum to 100%
And: total_weight is calculated correctly
```

### **Test Case 2: Staff Tries to Create Goal for Others**
```
Given: Regular staff user is logged in
When: POST /api/v1/hr/employees/goal/ with employee = different user
Then: HTTP 403 Forbidden
And: Error message: "You can only create goals for yourself"
```

### **Test Case 3: Admin Creates Goal for Employee**
```
Given: HR/Admin user is logged in
When: POST /api/v1/hr/employees/goal/ with any employee
Then: Goal is created successfully
And: Goal is assigned to specified employee
```

### **Test Case 4: Narratives Don't Sum to 100%**
```
Given: Any user creates a goal
When: Narratives sum to 90%
Then: HTTP 400 Bad Request
And: Error: "Task weights must sum to 100%. Current total: 90.00%"
```

### **Test Case 5: Staff Views Goals List**
```
Given: Regular staff user is logged in
When: GET /api/v1/hr/employees/goal/
Then: Returns only goals where employee = current user
And: Does not show other employees' goals
```

### **Test Case 6: Admin Views Goals List**
```
Given: HR/Admin user is logged in
When: GET /api/v1/hr/employees/goal/
Then: Returns all goals across organization
And: Includes employee_name for each goal
```

---

## 9. Migration Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for testing
python manage.py createsuperuser
```

---

## 10. Summary Checklist

### **Database:**
- [ ] Create `Goal` model with all fields
- [ ] Create `GoalNarrative` model with FK to Goal
- [ ] Add `calculate_total_weight()` method to Goal
- [ ] Run migrations

### **Serializers:**
- [ ] Create `GoalNarrativeSerializer` (exclude 'goal' FK)
- [ ] Create `GoalSerializer` with narratives nested
- [ ] Create `GoalCreateUpdateSerializer` with validation
- [ ] Add `validate_narratives()` to check 100% sum
- [ ] Add `validate_employee()` for permission check

### **Views:**
- [ ] Create `GoalViewSet`
- [ ] Implement role-based `get_queryset()`
- [ ] Add permission checks in `perform_create/update/destroy`
- [ ] Add search functionality
- [ ] Add employee filter parameter

### **URLs:**
- [ ] Register `GoalViewSet` in router
- [ ] Test all endpoints

### **Permissions:**
- [ ] Staff can only CRUD their own goals
- [ ] Admin can CRUD any goal
- [ ] Proper error messages for permission denied

### **Validation:**
- [ ] Narratives must sum to 100%
- [ ] Individual weights between 0-100
- [ ] At least 1 narrative required
- [ ] Title is required

### **Testing:**
- [ ] Test staff creating own goal
- [ ] Test staff trying to create goal for others (should fail)
- [ ] Test admin creating goal for any employee
- [ ] Test narrative weight validation
- [ ] Test role-based filtering

---

## 11. Quick Start Commands

```python
# In Django shell
python manage.py shell

# Test creating a goal
from hr.models import Goal, GoalNarrative
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.first()

goal = Goal.objects.create(
    employee=user,
    title="Test Goal",
    description="This is a test goal",
    status="not_started"
)

GoalNarrative.objects.create(
    goal=goal,
    description="Complete task 1",
    weight=50.00,
    completed=False
)

GoalNarrative.objects.create(
    goal=goal,
    description="Complete task 2",
    weight=50.00,
    completed=False
)

goal.calculate_total_weight()
goal.save()

print(f"Goal created: {goal.title}")
print(f"Total weight: {goal.total_weight}%")
print(f"Narratives: {goal.narratives.count()}")
```

---

This document provides everything the backend team needs to implement the Goals Management system correctly! 🎯
