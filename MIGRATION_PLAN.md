# Migration Plan: Unified Performance Management

## Current State vs Target State

### Current Endpoints
```
❌ /api/v1/hr/employees/goal/          (Goals - OLD, no POST support)
❌ /api/v1/hr/performance/assessments/  (Assessments - backend removed)
```

### Target Endpoints (Unified Structure)
```
✅ /api/v1/hr/performance/goals/         (Goals - NEW)
✅ /api/v1/hr/performance/assessments/   (Assessments - NEW)
```

---

## Migration Options

### Option 1: Complete Migration (Recommended)

**Backend implements the full unified structure from scratch:**

1. ✅ Create all 6 models (Goal, GoalNarrative, PerformanceAssessment, etc.)
2. ✅ Create serializers with validation
3. ✅ Create viewsets with permissions
4. ✅ Set up new URLs under `/hr/performance/`
5. ✅ Test all endpoints
6. ✅ Deploy backend
7. ✅ Frontend updates 2 lines in `goalsController.ts`
8. ✅ Deploy frontend

**Timeline:** 1-2 days for full implementation

**Reference Document:** `UNIFIED_PERFORMANCE_BACKEND_REQUIREMENTS.md`

---

### Option 2: Quick Fix (Get Goals Working First)

**Just make the existing goals endpoint accept POST requests:**

**Step 1: Add POST method to existing endpoint**

```python
# In your existing GoalViewSet or APIView
class GoalViewSet(viewsets.ModelViewSet):
    # ... existing code ...

    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
    # Previously was: ['get', 'put', 'patch', 'delete', 'head', 'options']

    def create(self, request, *args, **kwargs):
        """Handle POST requests to create goals"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            'status': True,
            'message': 'Goal created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
```

**Step 2: Verify**
```bash
curl -X OPTIONS https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/
# Should show: Allow: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
```

**Timeline:** 30 minutes

**Then:** Plan full migration to unified structure later

---

## Current Frontend Status

### Working ✅
- Goal listing page (`/dashboard/hr/goals-management`)
- Goal create form (`/dashboard/hr/goals-management/create`)
- Goal detail page (`/dashboard/hr/goals-management/[id]`)
- Employee dropdown for admins (44 users)
- Role-based access control
- Form validation (weights sum to 100%)
- Number input handling

### Blocked ⏸️
- **Creating goals** - Backend returns "Method POST not allowed"
- **Performance assessments** - Backend implementation was removed

### Frontend Files Ready to Switch
```typescript
// File: /src/features/hr/controllers/goalsController.ts
// Line 56-58

// CURRENT (temporary, waiting for backend):
const BASE_URL = "hr/employees/goal/";

// WILL CHANGE TO (once backend ready):
const BASE_URL = "hr/performance/goals/";
```

---

## Recommended Approach

### Phase 1: Quick Fix (Today)
**Goal:** Get goal creation working immediately

1. **Backend:** Add POST method to `/api/v1/hr/employees/goal/`
   - Takes 30 minutes
   - Unblocks frontend immediately
   - Users can start creating goals today

2. **Test:** Verify POST works
   ```bash
   curl -X POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/ \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "employee": "uuid",
       "title": "Test Goal",
       "description": "Test",
       "status": "not_started",
       "narratives": [
         {"description": "Task 1", "weight": 100, "completed": false}
       ]
     }'
   ```

### Phase 2: Full Migration (Next Week)
**Goal:** Implement unified performance management system

1. **Backend:** Implement full structure from `UNIFIED_PERFORMANCE_BACKEND_REQUIREMENTS.md`
   - 6 models
   - Serializers with validation
   - ViewSets with permissions
   - New URL structure `/hr/performance/`

2. **Data Migration:** Move data from old endpoint to new
   ```python
   # Migration script to move goals
   from old_app.models import OldGoal
   from performance.models import Goal, GoalNarrative

   for old_goal in OldGoal.objects.all():
       new_goal = Goal.objects.create(
           id=old_goal.id,
           employee=old_goal.employee,
           title=old_goal.title,
           # ... map all fields
       )
       # Create narratives...
   ```

3. **Frontend:** Update endpoint in `goalsController.ts` (2 lines)

4. **Deprecate:** Old endpoint `/hr/employees/goal/` after 2 weeks

---

## Testing Checklist

### Phase 1 Testing (Quick Fix)
- [ ] OPTIONS request shows POST method
- [ ] POST creates goal successfully
- [ ] Frontend create button works
- [ ] Goal appears in list after creation
- [ ] Admin can create goals for any employee
- [ ] Staff can create goals only for themselves

### Phase 2 Testing (Full Migration)
- [ ] All goals migrated to new endpoint
- [ ] Old endpoint deprecated
- [ ] Assessments endpoint working
- [ ] Evaluator workflow complete
- [ ] Final rating calculation correct

---

## Current Error Analysis

### Error Seen
```
Method "POST" not allowed.
```

### Root Cause
The backend endpoint `/api/v1/hr/employees/goal/` only allows:
```
GET, PUT, PATCH, DELETE, HEAD, OPTIONS
```

But NOT `POST` (create).

### Solution
Add POST to allowed methods in the ViewSet:
```python
http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
```

---

## Communication with Backend Team

**Share these files:**
1. ✅ `UNIFIED_PERFORMANCE_BACKEND_REQUIREMENTS.md` - Full specification
2. ✅ `MIGRATION_PLAN.md` - This file (migration strategy)
3. ✅ `BACKEND_REQUIREMENTS_GOALS.md` - Original goals requirements
4. ✅ `GOALS_API_INTEGRATION_CHECKLIST.md` - Testing checklist

**Ask them to choose:**
- **Option A:** Quick fix (30 min) → Add POST to existing endpoint
- **Option B:** Full migration (1-2 days) → Implement unified structure

**Recommended:** Do both - Quick fix now, full migration next week

---

## Frontend Developer Next Steps

### Right Now
⏸️ **Wait** for backend to add POST method

### When Backend Adds POST to Old Endpoint
✅ **Test** goal creation works
✅ **Deploy** to production
✅ **Monitor** for any issues

### When Backend Implements Unified Structure
1. ✅ Update `goalsController.ts` line 57:
   ```typescript
   const BASE_URL = "hr/performance/goals/";
   ```
2. ✅ Test all features still work
3. ✅ Deploy

---

## Summary

**Immediate Issue:** Backend doesn't accept POST for goal creation

**Quick Fix:** Backend adds POST method to existing endpoint (30 min)

**Long-term Plan:** Migrate to unified `/hr/performance/` structure (1-2 days)

**Frontend Impact:** Already built and ready, just waiting for backend ✅

**Next Action:** Backend team implements quick fix OR full unified structure
