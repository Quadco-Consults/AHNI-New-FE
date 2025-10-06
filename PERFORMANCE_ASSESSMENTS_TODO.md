# Performance Assessments - TODO

## Current Status

❌ **Not Implemented Yet**

Error when accessing: `relation "hr_performance_assessments" does not exist`

## What's Working

✅ **Goals Management** - Fully functional
- Create goals
- List goals
- View goal details
- Role-based access

## What Needs to Be Done

### Backend Tasks

1. **Run Migrations for Performance Assessments**
   ```bash
   heroku run python manage.py migrate --app ahni-erp-029252c2fbb9
   ```

2. **Create Required Tables**
   - `hr_performance_assessments`
   - `hr_assessment_evaluators`
   - `hr_goal_ratings`
   - `hr_competencies`

### Reference Documentation

The complete implementation spec is in:
- `UNIFIED_PERFORMANCE_BACKEND_REQUIREMENTS.md` (see Assessments section)

### Models Needed

From the unified requirements, these models need migrations:

1. **PerformanceAssessment** - Main assessment table
2. **AssessmentEvaluator** - Evaluators assigned to assessment
3. **GoalRating** - Ratings given by evaluators for each goal
4. **Competency** - Competency evaluations

## Temporary Solution

For now, users should only use:
- ✅ Goals Management (fully working)

Avoid:
- ❌ Performance Appraisal (not yet implemented)

## Timeline

**Priority:** Medium (Goals are working, this is next phase)
**Estimated Time:** 1-2 hours for backend
**Blocker:** Backend needs to run migrations

## Next Steps

1. Backend team creates migrations for assessment models
2. Run migrations on Heroku
3. Test assessment creation from frontend
4. Integrate goals with assessments

---

**Note:** The frontend code for assessments already exists and is ready. It just needs the backend tables to be created.
