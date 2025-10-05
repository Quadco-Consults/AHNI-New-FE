# Unified Performance Management - Backend API Requirements

## Overview
This document outlines the backend API structure for a unified Performance Management system that combines:
1. **Goal Setting** (employee goals with narratives/tasks)
2. **Performance Assessments** (evaluations based on goals)

Both features will live under the same endpoint structure: `/api/v1/hr/performance/`

---

## API Endpoint Structure

### Base URL
```
/api/v1/hr/performance/
```

### Endpoint Hierarchy
```
/api/v1/hr/performance/
├── goals/                          # Goal management
│   ├── GET     List all goals (filtered by user role)
│   ├── POST    Create new goal
│   ├── {id}/
│   │   ├── GET     Get goal details
│   │   ├── PUT     Update goal
│   │   ├── PATCH   Partial update
│   │   └── DELETE  Delete goal
│
├── assessments/                    # Performance assessments
│   ├── GET     List all assessments
│   ├── POST    Create new assessment
│   ├── {id}/
│   │   ├── GET     Get assessment details
│   │   ├── PUT     Update assessment
│   │   ├── PATCH   Partial update
│   │   └── DELETE  Delete assessment
│   │
│   └── {id}/evaluate/              # Submit evaluation
│       └── POST    Submit evaluator ratings
```

---

## Database Models

### 1. Goal Model

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User

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
        return f"{self.employee.get_full_name()} - {self.title}"

    def save(self, *args, **kwargs):
        # Auto-calculate total_weight from narratives
        if self.pk:
            self.total_weight = sum(
                narrative.weight for narrative in self.narratives.all()
            )
        super().save(*args, **kwargs)
```

### 2. GoalNarrative Model (Tasks)

```python
class GoalNarrative(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='narratives')
    description = models.TextField()
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    completed = models.BooleanField(default=False)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_goal_narratives'
        ordering = ['id']

    def __str__(self):
        return f"{self.goal.title} - {self.description[:50]}"
```

### 3. PerformanceAssessment Model

```python
class PerformanceAssessment(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_self', 'Pending Self Evaluation'),
        ('pending_evaluators', 'Pending Evaluators'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('approved', 'Approved'),
        ('cancelled', 'Cancelled'),
    ]

    CYCLE_CHOICES = [
        ('365 Appraisal Cycle', '365 Appraisal Cycle'),
        ('Probationary Cycle', 'Probationary Cycle'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    description = models.TextField(blank=True, null=True)
    cycle_name = models.CharField(max_length=100, choices=CYCLE_CHOICES)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='draft')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    final_rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_assessments')
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_performance_assessments'
        ordering = ['-created_datetime']

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.cycle_name}"
```

### 4. AssessmentEvaluator Model

```python
class AssessmentEvaluator(models.Model):
    EVALUATOR_TYPE_CHOICES = [
        ('self', 'Self Evaluation'),
        ('supervisor', 'Supervisor'),
        ('peer', 'Peer'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(PerformanceAssessment, on_delete=models.CASCADE, related_name='evaluators')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations')
    evaluator_type = models.CharField(max_length=20, choices=EVALUATOR_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(blank=True, null=True)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_assessment_evaluators'
        unique_together = ['assessment', 'evaluator']

    def __str__(self):
        return f"{self.evaluator.get_full_name()} - {self.evaluator_type}"
```

### 5. GoalRating Model

```python
class GoalRating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(PerformanceAssessment, on_delete=models.CASCADE, related_name='goal_ratings')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='ratings')
    evaluator = models.ForeignKey(AssessmentEvaluator, on_delete=models.CASCADE, related_name='goal_ratings')
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comments = models.TextField(blank=True, null=True)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_goal_ratings'
        unique_together = ['assessment', 'goal', 'evaluator']

    def __str__(self):
        return f"{self.goal.title} - {self.rating}/5"
```

### 6. Competency Model (Optional - for additional evaluations)

```python
class Competency(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Technical Skills'),
        ('behavioral', 'Behavioral'),
        ('leadership', 'Leadership'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(PerformanceAssessment, on_delete=models.CASCADE, related_name='competencies')
    evaluator = models.ForeignKey(AssessmentEvaluator, on_delete=models.CASCADE, related_name='competencies')
    competency = models.CharField(max_length=255)
    evaluation_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comments = models.TextField(blank=True, null=True)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hr_competencies'

    def __str__(self):
        return f"{self.competency} - {self.rating}/5"
```

---

## Serializers

### 1. GoalNarrativeSerializer

```python
from rest_framework import serializers

class GoalNarrativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalNarrative
        fields = ['id', 'description', 'weight', 'completed', 'created_datetime', 'updated_datetime']
        # IMPORTANT: Do NOT include 'goal' FK here to avoid circular reference
```

### 2. GoalSerializer

```python
class GoalSerializer(serializers.ModelSerializer):
    narratives = GoalNarrativeSerializer(many=True)
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = [
            'id', 'employee', 'employee_name', 'title', 'description',
            'status', 'start_date', 'end_date', 'total_weight', 'approved',
            'narratives', 'created_datetime', 'updated_datetime'
        ]
        read_only_fields = ['id', 'total_weight', 'created_datetime', 'updated_datetime']

    def get_employee_name(self, obj):
        return obj.employee.get_full_name() if obj.employee else None

    def create(self, validated_data):
        narratives_data = validated_data.pop('narratives', [])

        # Validate narratives sum to 100%
        total_weight = sum(n['weight'] for n in narratives_data)
        if abs(total_weight - 100) > 0.01:
            raise serializers.ValidationError({
                'narratives': f'Task weights must sum to 100%. Current total: {total_weight}%'
            })

        # Create goal
        goal = Goal.objects.create(**validated_data)

        # Create narratives
        for narrative_data in narratives_data:
            GoalNarrative.objects.create(goal=goal, **narrative_data)

        # Update total_weight
        goal.total_weight = total_weight
        goal.save()

        return goal

    def update(self, instance, validated_data):
        narratives_data = validated_data.pop('narratives', None)

        # Update goal fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update narratives if provided
        if narratives_data is not None:
            # Validate total weight
            total_weight = sum(n['weight'] for n in narratives_data)
            if abs(total_weight - 100) > 0.01:
                raise serializers.ValidationError({
                    'narratives': f'Task weights must sum to 100%. Current total: {total_weight}%'
                })

            # Delete existing narratives
            instance.narratives.all().delete()

            # Create new narratives
            for narrative_data in narratives_data:
                GoalNarrative.objects.create(goal=instance, **narrative_data)

            instance.total_weight = total_weight

        instance.save()
        return instance
```

### 3. AssessmentEvaluatorSerializer

```python
class AssessmentEvaluatorSerializer(serializers.ModelSerializer):
    evaluator_name = serializers.SerializerMethodField()

    class Meta:
        model = AssessmentEvaluator
        fields = [
            'id', 'evaluator', 'evaluator_name', 'evaluator_type',
            'status', 'submitted_at', 'created_datetime', 'updated_datetime'
        ]
        read_only_fields = ['id', 'created_datetime', 'updated_datetime']

    def get_evaluator_name(self, obj):
        return obj.evaluator.get_full_name() if obj.evaluator else None
```

### 4. GoalRatingSerializer

```python
class GoalRatingSerializer(serializers.ModelSerializer):
    goal_title = serializers.CharField(source='goal.title', read_only=True)

    class Meta:
        model = GoalRating
        fields = [
            'id', 'goal', 'goal_title', 'evaluator', 'rating', 'comments',
            'created_datetime', 'updated_datetime'
        ]
        read_only_fields = ['id', 'created_datetime', 'updated_datetime']
```

### 5. CompetencySerializer

```python
class CompetencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Competency
        fields = [
            'id', 'competency', 'evaluation_category', 'weight',
            'rating', 'comments', 'evaluator', 'created_datetime', 'updated_datetime'
        ]
        read_only_fields = ['id', 'created_datetime', 'updated_datetime']
```

### 6. PerformanceAssessmentSerializer

```python
class PerformanceAssessmentSerializer(serializers.ModelSerializer):
    evaluators = AssessmentEvaluatorSerializer(many=True)
    employee_name = serializers.SerializerMethodField()
    goals = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceAssessment
        fields = [
            'id', 'employee', 'employee_name', 'description', 'cycle_name',
            'status', 'start_date', 'end_date', 'final_rating',
            'evaluators', 'goals', 'created_by', 'created_datetime', 'updated_datetime'
        ]
        read_only_fields = ['id', 'final_rating', 'created_datetime', 'updated_datetime']

    def get_employee_name(self, obj):
        return obj.employee.get_full_name() if obj.employee else None

    def get_goals(self, obj):
        # Fetch employee's active goals
        goals = Goal.objects.filter(employee=obj.employee, status__in=['in_progress', 'completed'])
        return GoalSerializer(goals, many=True).data

    def create(self, validated_data):
        evaluators_data = validated_data.pop('evaluators', [])

        # Create assessment
        assessment = PerformanceAssessment.objects.create(**validated_data)

        # Create evaluators
        for evaluator_data in evaluators_data:
            AssessmentEvaluator.objects.create(assessment=assessment, **evaluator_data)

        return assessment
```

---

## ViewSets

### 1. GoalViewSet

```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        user = self.request.user

        # Admin/HR can see all goals
        if user.is_superuser or user.is_staff or hasattr(user, 'groups') and user.groups.filter(name__in=['HR', 'Admin']).exists():
            return Goal.objects.all()

        # Regular staff see only their own goals
        return Goal.objects.filter(employee=user)

    def perform_create(self, serializer):
        user = self.request.user
        employee_id = self.request.data.get('employee')

        # Permission check: Staff can only create goals for themselves
        if not (user.is_superuser or user.is_staff) and str(user.id) != employee_id:
            raise PermissionDenied("You can only create goals for yourself. Contact HR for assistance.")

        serializer.save()

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response(
                {
                    'status': False,
                    'error_code': 'validation_error',
                    'message': str(e.detail),
                    'data': None
                },
                status=status.HTTP_400_BAD_REQUEST
            )
```

### 2. PerformanceAssessmentViewSet

```python
from rest_framework.decorators import action
from django.utils import timezone

class PerformanceAssessmentViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceAssessmentSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        user = self.request.user

        # Admin/HR can see all assessments
        if user.is_superuser or user.is_staff:
            return PerformanceAssessment.objects.all()

        # Staff see assessments where they are the employee OR an evaluator
        return PerformanceAssessment.objects.filter(
            models.Q(employee=user) | models.Q(evaluators__evaluator=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def evaluate(self, request, pk=None):
        """
        Submit evaluation for an assessment.
        Expected payload:
        {
            "evaluator_id": "uuid",
            "goal_ratings": [
                {"goal_id": "uuid", "rating": 4, "comments": "..."},
                ...
            ],
            "competencies": [
                {"competency": "Leadership", "evaluation_category": "leadership", "weight": 25, "rating": 5, "comments": "..."},
                ...
            ]
        }
        """
        assessment = self.get_object()
        evaluator_id = request.data.get('evaluator_id')

        try:
            evaluator = AssessmentEvaluator.objects.get(
                id=evaluator_id,
                assessment=assessment
            )
        except AssessmentEvaluator.DoesNotExist:
            return Response(
                {'status': False, 'message': 'Evaluator not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Save goal ratings
        goal_ratings_data = request.data.get('goal_ratings', [])
        for rating_data in goal_ratings_data:
            GoalRating.objects.update_or_create(
                assessment=assessment,
                goal_id=rating_data['goal_id'],
                evaluator=evaluator,
                defaults={
                    'rating': rating_data['rating'],
                    'comments': rating_data.get('comments', '')
                }
            )

        # Save competencies (optional)
        competencies_data = request.data.get('competencies', [])
        for comp_data in competencies_data:
            Competency.objects.create(
                assessment=assessment,
                evaluator=evaluator,
                **comp_data
            )

        # Mark evaluator as completed
        evaluator.status = 'completed'
        evaluator.submitted_at = timezone.now()
        evaluator.save()

        # Calculate final rating if all evaluators are done
        if not assessment.evaluators.filter(status__in=['pending', 'in_progress']).exists():
            all_ratings = GoalRating.objects.filter(assessment=assessment)
            if all_ratings.exists():
                avg_rating = all_ratings.aggregate(models.Avg('rating'))['rating__avg']
                assessment.final_rating = round(avg_rating, 2)
                assessment.status = 'completed'
                assessment.save()

        return Response({
            'status': True,
            'message': 'Evaluation submitted successfully',
            'data': PerformanceAssessmentSerializer(assessment).data
        })
```

---

## URL Configuration

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GoalViewSet, PerformanceAssessmentViewSet

router = DefaultRouter()
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'assessments', PerformanceAssessmentViewSet, basename='assessment')

urlpatterns = [
    path('hr/performance/', include(router.urls)),
]
```

This will create:
- `/api/v1/hr/performance/goals/`
- `/api/v1/hr/performance/goals/{id}/`
- `/api/v1/hr/performance/assessments/`
- `/api/v1/hr/performance/assessments/{id}/`
- `/api/v1/hr/performance/assessments/{id}/evaluate/`

---

## Frontend Endpoint Updates Required

### Current Endpoints → New Endpoints

**Goals:**
- ❌ OLD: `hr/employees/goal/`
- ✅ NEW: `hr/performance/goals/`

**Assessments:**
- ❌ OLD: `hr/performance/assessments/`
- ✅ NEW: `hr/performance/assessments/` (stays the same!)

### Frontend File Changes

1. **`/src/features/hr/controllers/goalsController.ts`**
   ```typescript
   // Change line 56-57
   const BASE_URL = "hr/performance/goals/";
   const CREATE_GOALS_URL = "hr/performance/goals/";
   ```

2. **No changes needed** for `hrPerformanceAssessmentController.ts` - it already uses the correct path!

---

## API Response Format

### Standard Success Response
```json
{
  "status": true,
  "message": "Successfully retrieved data",
  "data": {
    // Response data here
  }
}
```

### Standard Error Response
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "Task weights must sum to 100%. Current total: 95.00%",
  "data": null
}
```

---

## Permissions Summary

| Action | Staff | HR/Admin |
|--------|-------|----------|
| **Goals** |
| View own goals | ✅ Yes | ✅ Yes |
| View all goals | ❌ No | ✅ Yes |
| Create own goal | ✅ Yes | ✅ Yes |
| Create goal for others | ❌ No | ✅ Yes |
| Edit own goal | ✅ Yes | ✅ Yes |
| Edit others' goals | ❌ No | ✅ Yes |
| Delete own goal | ✅ Yes | ✅ Yes |
| Delete others' goals | ❌ No | ✅ Yes |
| **Assessments** |
| View own assessments | ✅ Yes | ✅ Yes |
| View all assessments | ❌ No | ✅ Yes |
| Create assessment | ❌ No | ✅ Yes (HR-initiated) |
| Submit evaluation | ✅ Yes (if assigned) | ✅ Yes |
| View evaluation results | ✅ Yes (own only) | ✅ Yes (all) |

---

## Testing Checklist

### Goals API
- [ ] POST `/hr/performance/goals/` - Create goal with narratives summing to 100%
- [ ] POST `/hr/performance/goals/` - Reject if narratives don't sum to 100%
- [ ] POST `/hr/performance/goals/` - Reject if staff tries to create for others
- [ ] GET `/hr/performance/goals/` - Admin sees all goals
- [ ] GET `/hr/performance/goals/` - Staff sees only own goals
- [ ] GET `/hr/performance/goals/?employee={uuid}` - Filter by employee
- [ ] PUT `/hr/performance/goals/{id}/` - Update goal
- [ ] DELETE `/hr/performance/goals/{id}/` - Delete goal

### Assessments API
- [ ] POST `/hr/performance/assessments/` - Create assessment with evaluators
- [ ] GET `/hr/performance/assessments/` - List assessments
- [ ] GET `/hr/performance/assessments/{id}/` - Get assessment with employee goals
- [ ] POST `/hr/performance/assessments/{id}/evaluate/` - Submit evaluation
- [ ] Verify final_rating calculation after all evaluators submit
- [ ] Verify status changes from draft → completed

---

## Migration Strategy

1. **Backend:** Implement all models, serializers, and views
2. **Backend:** Run migrations
3. **Backend:** Test all endpoints with Postman
4. **Frontend:** Update goal controller endpoint (1 line change)
5. **Frontend:** Test goal creation
6. **Frontend:** Test assessment creation
7. **Deploy:** Backend first, then frontend

---

## Summary

This unified structure provides:
- ✅ Clean, logical endpoint hierarchy under `/hr/performance/`
- ✅ Shared database structure for goals and assessments
- ✅ Role-based permissions
- ✅ OrangeHRM-aligned workflow
- ✅ Easy frontend integration (minimal changes needed)
- ✅ Scalable for future features (360° reviews, etc.)

**Frontend changes required:** Only 2 lines in `goalsController.ts`! 🎉
