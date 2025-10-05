# Backend Quick Fix - Enable Goal Creation

## Problem
Frontend is ready to create goals, but backend returns:
```
Method "POST" not allowed.
```

## Current Allowed Methods
```bash
curl -X OPTIONS https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/
# Returns: Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
# Missing: POST
```

## Solution (30 minutes)

### Step 1: Add POST to ViewSet

Find your goals ViewSet (probably in `views.py` or `api/views.py`):

```python
class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    # ADD OR UPDATE THIS LINE:
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    # ADD THIS METHOD:
    def create(self, request, *args, **kwargs):
        """Create a new goal with narratives"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            'status': True,
            'message': 'Goal created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
```

### Step 2: Verify Serializer Handles Nested Creation

Your `GoalSerializer` should handle creating `GoalNarrative` objects:

```python
class GoalSerializer(serializers.ModelSerializer):
    narratives = GoalNarrativeSerializer(many=True)

    class Meta:
        model = Goal
        fields = ['id', 'employee', 'title', 'description', 'status',
                  'narratives', 'total_weight', 'created_datetime', 'updated_datetime']

    def create(self, validated_data):
        narratives_data = validated_data.pop('narratives', [])

        # Validate total weight = 100%
        total_weight = sum(n['weight'] for n in narratives_data)
        if abs(total_weight - 100) > 0.01:
            raise serializers.ValidationError(
                f'Task weights must sum to 100%. Current total: {total_weight}%'
            )

        # Create goal
        goal = Goal.objects.create(**validated_data)

        # Create narratives
        for narrative_data in narratives_data:
            GoalNarrative.objects.create(goal=goal, **narrative_data)

        # Update total_weight
        goal.total_weight = total_weight
        goal.save()

        return goal
```

### Step 3: Test

```bash
# 1. Verify POST is now allowed
curl -X OPTIONS https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/
# Should show: Allow: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

# 2. Test creating a goal
curl -X POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employee": "5ff6e971-4ccc-4fde-8249-cad64b78e304",
    "title": "Test Goal",
    "description": "Testing goal creation",
    "status": "not_started",
    "narratives": [
      {
        "description": "Complete task 1",
        "weight": 50,
        "completed": false
      },
      {
        "description": "Complete task 2",
        "weight": 50,
        "completed": false
      }
    ]
  }'
```

### Expected Response

```json
{
  "status": true,
  "message": "Goal created successfully",
  "data": {
    "id": "uuid-here",
    "employee": "5ff6e971-4ccc-4fde-8249-cad64b78e304",
    "title": "Test Goal",
    "description": "Testing goal creation",
    "status": "not_started",
    "total_weight": "100.00",
    "narratives": [
      {
        "id": "narrative-uuid-1",
        "description": "Complete task 1",
        "weight": 50,
        "completed": false,
        "created_datetime": "2025-01-04T12:00:00Z",
        "updated_datetime": "2025-01-04T12:00:00Z"
      },
      {
        "id": "narrative-uuid-2",
        "description": "Complete task 2",
        "weight": 50,
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

## That's It!

Once deployed, the frontend will immediately be able to create goals. No frontend changes needed! 🎉

## Next Step

After this quick fix works, plan for the full unified structure migration using `UNIFIED_PERFORMANCE_BACKEND_REQUIREMENTS.md`.
