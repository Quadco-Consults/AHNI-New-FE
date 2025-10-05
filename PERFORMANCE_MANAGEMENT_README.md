# Performance Management System - OrangeHRM Workflow

## Overview

The performance management system has been restructured to follow the OrangeHRM workflow model where:
1. **Employees** initiate their own performance assessments
2. **Employees** set their goals beforehand
3. **Employees** select their evaluators (self, peers, supervisors)
4. **Evaluators** rate the employee based on their pre-set goals
5. **System** calculates average ratings from all evaluators

---

## Complete Workflow

### Phase 1: Goal Setting
**Actor:** Employee

1. Navigate to Employee Profile → Goals Tab
2. Click "Create Goals"
3. Add one or more goals with:
   - Goal description
   - Competency
   - Weight (must sum to 100% across all goals)
4. Save goals

**Files:**
- `/src/features/hr/components/workforce-database/id/Goals.tsx`
- `/src/features/hr/components/modals/CreateGoalsModal.tsx`
- `/src/features/hr/controllers/goalsController.ts`

### Phase 2: Assessment Creation
**Actor:** Employee

1. Navigate to Performance Management → Create Assessment
2. Review displayed goals (must have goals set first)
3. Fill in assessment details:
   - Description
   - Cycle (365 Appraisal or Probationary)
   - Start/End dates
4. Select evaluators:
   - Add self (for self-evaluation)
   - Add supervisor(s)
   - Add peer(s)
5. Submit assessment (status: `draft`)

**Files:**
- `/src/features/hr/components/performance-management/form/index.tsx`
- `/src/features/hr/controllers/hrPerformanceAssessmentController.ts`

**Key Features:**
- ✅ Shows employee's goals before creating assessment
- ✅ Prevents creation if no goals exist
- ✅ Validates evaluator selection
- ✅ Employee-initiated (not HR-initiated)

### Phase 3: Evaluation
**Actor:** Each selected evaluator

1. Navigate to Performance Management → Assessment Details
2. View employee information and goals
3. Click "Start Evaluation"
4. Rate each goal (1-5 scale):
   - 1 - Needs Improvement
   - 2 - Below Expectations
   - 3 - Meets Expectations
   - 4 - Exceeds Expectations
   - 5 - Outstanding
5. Add comments for each goal
6. Submit evaluation

**Files:**
- `/src/features/hr/components/performance-management/id/index.tsx`
- `/src/features/hr/components/performance-management/components/EvaluatorForm.tsx`

**Key Features:**
- ✅ Each evaluator sees the same goals
- ✅ Simple 1-5 rating scale
- ✅ Individual comments per goal
- ✅ Access control (only assigned evaluators can evaluate)

### Phase 4: Rating Calculation
**Actor:** System (automatic)

When all evaluators submit:
1. Calculate average rating for each goal
2. Calculate weighted average across all goals
3. Update assessment status to `completed`
4. Display final rating

**Files:**
- `/src/features/hr/utils/performanceCalculations.ts`

**Formulas:**
```typescript
// Per-goal average
goal_average = SUM(all_evaluator_ratings) / number_of_evaluators

// Final rating (weighted)
final_rating = SUM(goal_average * goal_weight / 100)
```

### Phase 5: Review & Approval
**Actor:** HR / Manager

1. View completed assessments
2. Review final ratings and comments
3. Approve assessment (status: `approved`)

---

## Data Model

### PerformanceAssessment
```typescript
{
  id: string
  description: string
  cycle_name: '365 Appraisal Cycle' | 'Probationary Cycle'
  employee: Employee
  status: 'draft' | 'pending_self' | 'pending_evaluators' | 'in_progress' | 'completed' | 'approved'
  start_date: string
  end_date: string
  final_rating: number (calculated)
  evaluators: Evaluator[]
  goals: Goal[]
  created_by: string (employee who created)
}
```

### Evaluator
```typescript
{
  id: string
  evaluator: User
  evaluator_type: 'self' | 'supervisor' | 'peer'
  status: 'pending' | 'in_progress' | 'completed'
  submitted_at: string
}
```

### Goal
```typescript
{
  id: string
  goal: string
  weight: number (percentage)
  ratings: GoalRating[] (one per evaluator)
  average_rating: number (calculated)
}
```

### GoalRating
```typescript
{
  id: string
  goal_id: string
  evaluator_id: string
  rating: number (1-5)
  comments: string
}
```

---

## Status Workflow

```
draft
  ↓
pending_self (if self-evaluator exists and hasn't submitted)
  ↓
pending_evaluators (waiting for other evaluators)
  ↓
in_progress (some evaluations submitted)
  ↓
completed (all evaluations submitted)
  ↓
approved (HR/Manager approval)
```

---

## Key Features

### ✅ Implemented

1. **Employee-Initiated Workflow**
   - Employees create their own assessments
   - Must set goals before creating assessment

2. **Goal-Based Evaluation**
   - All evaluators rate the same employee-defined goals
   - No hardcoded competencies

3. **Multiple Evaluator Types**
   - Self-evaluation
   - Supervisor evaluation
   - Peer evaluation

4. **Automated Rating Calculation**
   - Per-goal average across evaluators
   - Weighted final rating based on goal weights
   - Helper utilities for calculations

5. **Access Control**
   - Only assigned evaluators can submit ratings
   - Assessment creator can view progress

6. **Progress Tracking**
   - Visual progress bar showing completion percentage
   - Status badges for each evaluator

7. **Type Safety**
   - Full TypeScript types with zod validation
   - Proper error handling

---

## UI Components

### 1. Assessment Creation Form
**Path:** `/dashboard/hr/performance-management/create`

- Shows employee's goals at top
- Evaluator selection with type
- Date range selection
- Validation prevents submission without goals

### 2. Assessment List
**Path:** `/dashboard/hr/performance-management`

**Columns:**
- Description
- Start/End Dates
- Employee Name
- Final Rating (with label)
- Progress Bar
- Cycle Name
- Status Badge
- Actions (View/Delete)

### 3. Assessment Details
**Path:** `/dashboard/hr/performance-management/[id]`

**Sections:**
- Appraisal Information (description, status, dates, rating)
- Employee Information
- Employee Goals (with average ratings if completed)
- Evaluators (with status and submission dates)

### 4. Evaluation Form
**Shown when:** Evaluator clicks "Start Evaluation"

**Features:**
- Card-based layout per goal
- 5-button rating selector
- Comment textarea per goal
- Shows goal weight
- Validates all ratings before submission

---

## Utility Functions

### Rating Calculation
```typescript
import {
  calculateGoalAverageRating,
  calculateWeightedAverageRating,
  calculateFinalRating,
} from '@/features/hr/utils/performanceCalculations';
```

### Progress Tracking
```typescript
import {
  areAllEvaluationsComplete,
  getEvaluationProgress,
  determineAssessmentStatus,
} from '@/features/hr/utils/performanceCalculations';
```

### Display Helpers
```typescript
import {
  getRatingLabel,    // Returns: "Outstanding", "Exceeds Expectations", etc.
  getRatingColor,    // Returns Tailwind color class
} from '@/features/hr/utils/performanceCalculations';
```

---

## API Endpoints

### Performance Assessments
- `GET /hr/performance/assessments/` - List assessments
- `GET /hr/performance/assessments/{id}/` - Get single assessment
- `POST /hr/performance/assessments/` - Create assessment
- `PUT /hr/performance/assessments/{id}/` - Update/submit evaluation

### Goals
- `GET /hr/employees/goal/?employee={id}` - Get employee goals
- `POST /hr/employees/goal/` - Create goal
- `PUT /hr/employees/goal/{id}/` - Update goal
- `DELETE /hr/employees/goal/{id}/` - Delete goal

---

## Backend Requirements

For full functionality, the backend should support:

1. **Nested evaluator submission:**
```json
{
  "assessment_id": "uuid",
  "evaluator_id": "uuid",
  "goal_ratings": [
    {
      "goal_id": "uuid",
      "rating": 4,
      "comments": "Great progress"
    }
  ]
}
```

2. **Return populated data:**
- Assessments should include full employee objects
- Evaluators should include full user objects
- Goals should include all ratings from evaluators

3. **Automatic calculation on backend (optional):**
Backend can calculate averages on each submission, or frontend can send calculated values.

---

## Migration from Old System

### Old vs New

| Old System | New System |
|------------|------------|
| HR creates assessment | Employee creates assessment |
| HR selects employee | Employee is auto-selected (creator) |
| Hardcoded competencies | Employee's pre-set goals |
| Single evaluation form | Multiple evaluators with same goals |
| Manual rating entry | Calculated from all evaluators |

### Breaking Changes

1. **Evaluator model changed:**
   - Removed: `evaluation_category`, `competency`
   - Added: `evaluator_type`, `status`, `submitted_at`

2. **Goal model changed:**
   - `weight` is now number (not string)
   - Added: `ratings[]`, `average_rating`

3. **Assessment creation:**
   - Now requires `created_by` (employee ID)
   - `employee` field is same as `created_by`

---

## Testing Checklist

### Goal Setting
- [ ] Employee can create goals
- [ ] Weight validation (sum to 100%)
- [ ] Goals persist in local storage
- [ ] Goals display in employee profile

### Assessment Creation
- [ ] Cannot create without goals
- [ ] Shows current goals
- [ ] Can add multiple evaluators
- [ ] Validates evaluator types
- [ ] Redirects after creation

### Evaluation
- [ ] Only assigned evaluators see "Start Evaluation"
- [ ] All goals displayed with correct weights
- [ ] Rating buttons work (1-5)
- [ ] Comments save per goal
- [ ] Submission updates evaluator status

### Rating Calculation
- [ ] Goal average calculated correctly
- [ ] Weighted average uses goal weights
- [ ] Final rating displays on completion
- [ ] Status updates automatically

### Progress Tracking
- [ ] Progress bar shows correct percentage
- [ ] Status badges show correct state
- [ ] Evaluator cards show submission dates

---

## Future Enhancements

1. **Notifications**
   - Email evaluators when assigned
   - Remind pending evaluators
   - Notify employee when completed

2. **Reporting**
   - Team performance dashboards
   - Historical trend analysis
   - Export to PDF

3. **Advanced Features**
   - Goal templates by role
   - Competency libraries
   - Multi-year comparison
   - Performance improvement plans

4. **Workflows**
   - Multi-stage approvals
   - Goal revision cycles
   - Mid-year check-ins

---

## Troubleshooting

### Issue: Cannot create assessment
**Cause:** No goals set
**Solution:** Navigate to employee profile and create goals first

### Issue: Cannot evaluate
**Cause:** Not assigned as evaluator
**Solution:** Verify evaluator list includes your user ID

### Issue: Ratings not calculating
**Cause:** Missing goal weights or ratings
**Solution:** Ensure all goals have weights that sum to 100%

### Issue: TypeScript errors
**Cause:** Type mismatches after migration
**Solution:** Update imports to use new types from `performance-assesment.ts`

---

## Support

For issues or questions:
1. Check TypeScript diagnostics in IDE
2. Review console logs (extensive logging in place)
3. Verify API responses match expected structure
4. Check local storage for goals (fallback mode)

---

## Files Modified/Created

### Created
- `/src/features/hr/components/performance-management/components/EvaluatorForm.tsx`
- `/src/features/hr/utils/performanceCalculations.ts`
- `/PERFORMANCE_MANAGEMENT_README.md`

### Modified
- `/src/features/hr/types/performance-assesment.ts` (complete overhaul)
- `/src/features/hr/components/performance-management/form/index.tsx` (restructured)
- `/src/features/hr/components/performance-management/id/index.tsx` (new workflow)
- `/src/features/hr/components/performance-management/index.tsx` (enhanced list view)

### Deprecated
- `/src/features/hr/components/performance-management/components/EvaluationForm.tsx` (replaced by EvaluatorForm.tsx)

---

## Summary

The performance management system now follows a complete OrangeHRM-style workflow where employees drive the process by setting goals and selecting evaluators. The system automatically calculates ratings from multiple evaluators and provides clear visibility into assessment progress.

**Key Success Factors:**
✅ Employee ownership of assessments
✅ Goal-based evaluation (not arbitrary competencies)
✅ Multi-evaluator support (self, peer, supervisor)
✅ Automated rating aggregation
✅ Clear workflow with status tracking
✅ Type-safe implementation with validation
