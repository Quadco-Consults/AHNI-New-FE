# 🚨 URGENT: Backend Needs to Run Migrations

## Error
```
relation "hr_goals" does not exist
LINE 1: INSERT INTO "hr_goals" ("id", "employee_id", "title", "descr...
```

## Problem
The backend code exists, but the database tables haven't been created yet.

## Solution (Backend Team)

### Step 1: Run Migrations on Heroku

```bash
# Run migrations to create the hr_goals table
heroku run python manage.py migrate --app ahni-erp-029252c2fbb9
```

### Expected Output:
```
Running migrations:
  Applying hr.0001_initial... OK
  Applying hr.0002_goal_goalnarrative... OK
  (or similar)
```

### Step 2: Verify Tables Were Created

```bash
# Connect to database
heroku pg:psql --app ahni-erp-029252c2fbb9

# List tables
\dt

# Should see:
# hr_goals
# hr_goal_narratives
# hr_performance_assessments
# etc.

# Exit
\q
```

### Step 3: Test API Again

After migrations run successfully, try creating a goal from the frontend.

---

## If Migrations Don't Exist

If you get an error saying "No migrations to apply", you need to create the migrations first:

### Local Development:

```bash
# 1. Make migrations
python manage.py makemigrations

# 2. Check what will be created
python manage.py sqlmigrate hr 0001

# 3. Apply migrations locally first (test)
python manage.py migrate

# 4. Commit migration files
git add */migrations/*.py
git commit -m "Add migrations for goals and performance management"

# 5. Deploy to Heroku
git push heroku main

# 6. Run migrations on Heroku
heroku run python manage.py migrate --app ahni-erp-029252c2fbb9
```

---

## Required Tables

Based on the unified performance management structure, these tables should be created:

1. **hr_goals** - Main goals table
2. **hr_goal_narratives** - Tasks/narratives for each goal
3. **hr_performance_assessments** - Performance appraisals
4. **hr_assessment_evaluators** - Evaluators for assessments
5. **hr_goal_ratings** - Ratings given by evaluators
6. **hr_competencies** - Competency evaluations

---

## Quick Commands Reference

```bash
# Run migrations
heroku run python manage.py migrate --app ahni-erp-029252c2fbb9

# Check migration status
heroku run python manage.py showmigrations --app ahni-erp-029252c2fbb9

# Create migrations (if needed)
python manage.py makemigrations hr

# View SQL that will run
python manage.py sqlmigrate hr 0001
```

---

## After Migrations Run

Once migrations complete successfully:
1. ✅ Tables will exist in database
2. ✅ API will work without errors
3. ✅ Frontend can create goals
4. ✅ Data will persist

---

## Timeline

**Priority:** HIGH - Blocks all goal creation
**Time to Fix:** 5 minutes (just run one command)
**Command:** `heroku run python manage.py migrate --app ahni-erp-029252c2fbb9`

---

## Verification

After running migrations, test with:

```bash
# Should work now (not 500 error about missing table)
curl -X POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/performance/goals/ \
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

Expected response: Goal created successfully (not database error)

---

## Summary

**Problem:** Database tables don't exist
**Solution:** Run migrations
**Command:** `heroku run python manage.py migrate --app ahni-erp-029252c2fbb9`
**Time:** 5 minutes
**Impact:** Will fix goal creation immediately
