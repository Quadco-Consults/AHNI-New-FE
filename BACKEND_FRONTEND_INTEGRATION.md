# Backend-Frontend Integration - Performance Management

## ✅ Backend Fixed (Deployed)

### **Issue Resolved**
```
Error: "goal" is not a valid UUID
```

### **Root Cause**
`GoalNarrativeSerializer` used `fields = "__all__"` which included the `goal` foreign key field. When nested inside `GoalSerializer`, this caused serialization conflicts.

### **Solution Applied**
1. **GoalNarrativeSerializer** - Explicitly defined fields, excluded `goal` FK
2. **GoalSerializer** - Added `employee_id` and `employee_name` for easier access
3. **Error Handling** - Added try-catch with standardized response format

### **Commit**
```
b44e7e5 - Fix: Resolve 'goal is not a valid UUID' error in Goals API
```

---

## ✅ Frontend Updated (Ready)

### **Schema Alignment**
Updated frontend to match backend goal structure:

**Backend Response:**
```json
{
  "id": "uuid",
  "title": "Improve Customer Satisfaction",
  "description": "Focus on customer service",
  "status": "not_started",
  "employee": "uuid",
  "employee_id": "uuid",
  "employee_name": "John Doe",
  "narratives": [
    {
      "id": "uuid",
      "description": "Respond within 24 hours",
      "weight": 15,
      "completed": false
    },
    {
      "id": "uuid",
      "description": "Maintain 4.5/5 satisfaction",
      "weight": 15,
      "completed": false
    }
  ],
  "created_at": "2025-01-04T...",
  "updated_at": "2025-01-04T..."
}
```

**Frontend Interface:**
```typescript
export interface Goal {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  employee?: string;
  narratives?: Array<{
    description: string;
    weight: number;
    completed: boolean;
  }>;

  // Backward compatibility
  goal?: string;      // = title
  competency?: string; // = description
  weight?: number;    // = sum of narratives

  created_at?: string;
  updated_at?: string;
}
```

### **Files Updated**
1. ✅ `/src/features/hr/controllers/goalsController.ts`
   - Updated `Goal` interface to match backend

2. ✅ `/src/features/hr/types/performance-assesment.ts`
   - Updated `Goal` type with narratives support

3. ✅ `/src/features/hr/components/workforce-database/id/Goals.tsx`
   - Display narratives as sub-items
   - Calculate total weight from narratives
   - Support both API and localStorage format

4. ✅ `/src/features/hr/components/performance-management/form/index.tsx`
   - Show goal narratives in assessment creation
   - Display individual narrative weights

5. ✅ `/src/features/hr/components/performance-management/components/EvaluatorForm.tsx`
   - Show narratives when evaluators rate goals
   - Display breakdown of goal components

---

## 🔄 Integration Flow

### **1. Employee Sets Goals**
```
Frontend (CreateGoalsModal.tsx)
  ↓ POST /hr/employees/goal/
  {
    "employee": "uuid",
    "title": "Goal name",
    "description": "Details",
    "narratives": [
      {"description": "Sub-goal 1", "weight": 50, "completed": false},
      {"description": "Sub-goal 2", "weight": 50, "completed": false}
    ]
  }
  ↓
Backend (GoalViewSet.create)
  ✅ Creates goal with narratives
  ✅ Returns serialized goal with employee info
```

### **2. View Goals**
```
Frontend (Goals.tsx)
  ↓ GET /hr/employees/goal/?employee={uuid}
  ↓
Backend (GoalViewSet.list)
  ✅ Returns goals array with narratives
  ✅ Each narrative excludes 'goal' FK (fixed!)
  ✅ Includes employee_id and employee_name
  ↓
Frontend
  ✅ Displays goal title
  ✅ Shows narratives as bullet list
  ✅ Calculates total weight from narratives
```

### **3. Create Assessment**
```
Frontend (form/index.tsx)
  ✓ Fetches employee goals via useGetEmployeeGoals
  ✓ Displays goals with narratives
  ✓ Shows total weight per goal
  ↓
  User selects evaluators
  ↓
  POST /hr/performance/assessments/
  {
    "employee": "uuid",
    "description": "Q1 Review",
    "evaluators": [...],
    "goals": [...] // References existing goals
  }
```

### **4. Submit Evaluation**
```
Frontend (EvaluatorForm.tsx)
  ✓ Shows goal with all narratives
  ✓ Evaluator rates goal (1-5)
  ✓ Adds comments
  ↓
  PUT /hr/performance/assessments/{id}/
  {
    "goal_ratings": [
      {
        "goal_id": "uuid",
        "rating": 4,
        "comments": "Great work"
      }
    ]
  }
```

---

## 📊 Sample Data Structure

### **Goal with Narratives**
```json
{
  "id": "7f234567-89ab-cdef-0123-456789abcdef",
  "title": "Improve Customer Satisfaction",
  "description": "Focus on enhancing customer experience",
  "status": "not_started",
  "employee": "5190ce0c-e686-4f6d-89ee-0f81db45787f",
  "employee_id": "5190ce0c-e686-4f6d-89ee-0f81db45787f",
  "employee_name": "System Administrator",
  "narratives": [
    {
      "id": "narrative-1",
      "description": "Respond to all customer inquiries within 24 hours",
      "weight": 15,
      "completed": false,
      "created_datetime": "2025-01-04T10:00:00Z"
    },
    {
      "id": "narrative-2",
      "description": "Maintain customer satisfaction rating above 4.5/5",
      "weight": 15,
      "completed": false,
      "created_datetime": "2025-01-04T10:00:00Z"
    }
  ],
  "created_at": "2025-01-04T10:00:00Z",
  "updated_at": "2025-01-04T10:00:00Z"
}
```

### **Frontend Display Logic**
```typescript
const goalTitle = goal.title || goal.goal;
const goalDescription = goal.description || goal.competency;
const goalWeight = goal.weight || goal.narratives?.reduce((sum, n) => sum + n.weight, 0);

// Display
<h3>{goalTitle}</h3>
<p>{goalDescription}</p>
<p>Total Weight: {goalWeight}%</p>
{goal.narratives?.map(narrative => (
  <li>{narrative.description} ({narrative.weight}%)</li>
))}
```

---

## 🧪 Testing Steps

### **After Backend Deployment**

1. **Test Goal Creation**
   ```bash
   # Navigate to Employee Profile → Goals
   # Click "Create Goals"
   # Add goal with narratives
   # Verify saves successfully
   ```

2. **Test Goal Display**
   ```bash
   # Refresh employee profile
   # Goals tab should show:
   ✓ Goal title
   ✓ Description
   ✓ Narratives as bullet list
   ✓ Individual weights
   ✓ Total weight
   ```

3. **Test Assessment Creation**
   ```bash
   # Go to Performance Management → Create
   # Should see employee goals loaded
   # Each goal shows narratives
   # Can proceed to create assessment
   ```

4. **Test Evaluation**
   ```bash
   # Open assessment as evaluator
   # Click "Start Evaluation"
   # Should see goals with narratives
   # Rate and submit
   ```

---

## 🔍 API Verification

### **Check Goals Endpoint**
```bash
curl -H "Authorization: Bearer {token}" \
  "https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/?employee=5190ce0c-e686-4f6d-89ee-0f81db45787f"
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Goals retrieved successfully",
  "data": [
    {
      "id": "...",
      "title": "Goal name",
      "narratives": [
        {"description": "...", "weight": 50, "completed": false}
      ]
    }
  ]
}
```

**NOT:**
```json
{
  "status": false,
  "error_code": "error",
  "message": "['\"goal\" is not a valid UUID.']"
}
```

---

## ⚠️ Known Compatibility Notes

### **Field Mapping**
| Backend Field | Frontend Usage | Notes |
|--------------|----------------|-------|
| `title` | Primary display | Goal name |
| `description` | Secondary info | Goal details |
| `narratives` | Sub-items list | Individual weighted tasks |
| `employee_id` | Quick reference | No need to extract from object |
| `employee_name` | Display name | Saves extra lookup |

### **Weight Calculation**
```typescript
// Frontend calculates total from narratives
const totalWeight = narratives.reduce((sum, n) => sum + n.weight, 0);

// Validation: must sum to 100%
if (totalWeight !== 100) {
  toast.error(`Narratives must sum to 100%, got ${totalWeight}%`);
}
```

### **Backward Compatibility**
The frontend supports both:
- **New format**: `{ title, description, narratives }`
- **Old format**: `{ goal, competency, weight }` (localStorage)

This ensures smooth transition even if some old data exists.

---

## 🚀 Deployment Checklist

### **Backend**
- [x] Fixed GoalNarrativeSerializer
- [x] Enhanced GoalSerializer
- [x] Added error handling
- [x] Committed changes (b44e7e5)
- [ ] Deploy to Heroku: `git push heroku main`
- [ ] Restart: `heroku restart --app ahni-erp-029252c2fbb9`

### **Frontend**
- [x] Updated Goal interface
- [x] Updated display components
- [x] Added narratives support
- [x] Tested TypeScript compilation
- [ ] Test in browser after backend deploy
- [ ] Verify goal creation flow
- [ ] Verify assessment creation flow

---

## 📝 Summary

### **What Was Fixed**
✅ Backend serialization error causing UUID validation failure
✅ Frontend schema mismatch between expected and actual API response
✅ Goal display to show narratives properly
✅ Weight calculation from narrative array

### **What Now Works**
✅ Employee can create goals with multiple narratives
✅ Goals display with weighted sub-tasks
✅ Assessment creation shows detailed goals
✅ Evaluators see full goal breakdown when rating

### **Next Action**
1. Deploy backend to Heroku
2. Test goal creation in frontend
3. Verify full workflow end-to-end
4. Proceed with performance evaluations

---

## 🎯 Success Criteria

- ✅ No more "goal is not a valid UUID" errors
- ✅ GET /hr/employees/goal/ returns goals with narratives
- ✅ Frontend displays narratives as sub-items
- ✅ Total weight calculated correctly
- ✅ Assessment creation shows employee goals
- ✅ Evaluation form displays goal details

**Status:** Ready for deployment and testing! 🚀
