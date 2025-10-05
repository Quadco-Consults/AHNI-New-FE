# 🚨 URGENT: Foreign Key Constraint Error

## Error
```
insert or update on table "hr_goal" violates foreign key constraint
"hr_goal_employee_id_3910e1ad_fk_hr_employee_id"
DETAIL: Key (employee_id)=(5ff6e971-4ccc-4fde-8249-cad64b78e304) is not present in table "hr_employee".
```

## Problem

The `hr_goal` table has a foreign key to `hr_employee` table, but:
- ❌ Users are NOT in `hr_employee` table
- ✅ Users ARE in the `users` or `auth_user` table

The Goal model is pointing to the wrong table!

---

## Solution

### Option 1: Fix Goal Model (Recommended)

Change the Goal model to reference the correct User model:

**Current (Wrong):**
```python
from hr.models import Employee  # Wrong table

class Goal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='goals')
    # ...
```

**Should be:**
```python
from django.contrib.auth import get_user_model  # Correct
User = get_user_model()

class Goal(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    # ...
```

OR if you have a custom User model:

```python
from users.models import User  # Your actual User model

class Goal(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    # ...
```

---

### Steps to Fix:

#### 1. Update the Model

**File:** `hr/models.py` (or wherever Goal is defined)

Find the Goal model and change:
```python
# BEFORE (incorrect)
from hr.models import Employee
employee = models.ForeignKey(Employee, ...)

# AFTER (correct)
from django.conf import settings
employee = models.ForeignKey(settings.AUTH_USER_MODEL, ...)
```

#### 2. Create Migration

```bash
python manage.py makemigrations hr
```

This will create a migration that changes the foreign key.

#### 3. Apply Migration

**⚠️ WARNING:** This will require database changes and might lose existing data!

```bash
# Local test first
python manage.py migrate

# Then on Heroku
heroku run python manage.py migrate --app ahni-erp-029252c2fbb9
```

---

## Option 2: Quick Workaround (Temporary)

If you can't change the model right now, sync the `hr_employee` table with users:

```python
# In Django shell
from users.models import User
from hr.models import Employee

# Create hr_employee records for all users
for user in User.objects.all():
    Employee.objects.get_or_create(
        id=user.id,
        defaults={
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            # ... other fields
        }
    )
```

**Note:** This is NOT recommended - fix the model instead!

---

## Recommended Approach

### Step 1: Check Your User Model

```bash
# In Django shell
heroku run python manage.py shell --app ahni-erp-029252c2fbb9

>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> print(User._meta.db_table)
# This will show the actual table name (e.g., 'users', 'auth_user', etc.)
```

### Step 2: Update Goal Model

Use `settings.AUTH_USER_MODEL` which automatically points to the correct user model:

```python
# hr/models.py
from django.db import models
from django.conf import settings

class Goal(models.Model):
    # Change this line:
    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # ← Correct way to reference User
        on_delete=models.CASCADE,
        related_name='goals'
    )
    title = models.CharField(max_length=255)
    # ... rest of fields
```

### Step 3: Create and Run Migration

```bash
# 1. Create migration
python manage.py makemigrations hr

# 2. Review the migration
cat hr/migrations/0003_alter_goal_employee.py

# 3. Apply locally (test first!)
python manage.py migrate

# 4. Commit
git add hr/migrations/0003_alter_goal_employee.py hr/models.py
git commit -m "Fix: Goal model should reference User, not Employee"

# 5. Deploy
git push heroku main

# 6. Run migration on Heroku
heroku run python manage.py migrate --app ahni-erp-029252c2fbb9
```

---

## Expected Result

After fixing:
- ✅ Goal model references correct User table
- ✅ Frontend can create goals using user IDs from `/users/` endpoint
- ✅ No more foreign key constraint errors

---

## Verification

After the fix, test with Postman:

```
POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/performance/goals/

Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body:
{
  "employee": "5ff6e971-4ccc-4fde-8249-cad64b78e304",  // ← This user ID should work now
  "title": "Test Goal",
  "description": "Test",
  "status": "not_started",
  "narratives": [
    {
      "description": "Task 1",
      "weight": 100.00,
      "completed": false
    }
  ]
}
```

Expected: `201 Created` (not 400 foreign key error)

---

## Summary

**Problem:** Goal model references `hr_employee` table, but users are in different table

**Solution:** Update Goal model to use `settings.AUTH_USER_MODEL`

**Time:** 10-15 minutes

**Files to change:**
- `hr/models.py` - Update Goal model
- Create migration
- Deploy and run migration

---

## Alternative: Check if hr_employee Exists

Maybe the `hr_employee` table does exist but is empty? Check:

```bash
heroku run python manage.py shell --app ahni-erp-029252c2fbb9

>>> from hr.models import Employee
>>> Employee.objects.count()
# If this returns 0, the table exists but is empty

>>> from users.models import User
>>> User.objects.count()
# This should return > 0

# If hr_employee is empty but should be used, sync it:
>>> for user in User.objects.all():
>>>     Employee.objects.create(id=user.id, first_name=user.first_name, ...)
```

But really, the model should just reference the User model directly!
