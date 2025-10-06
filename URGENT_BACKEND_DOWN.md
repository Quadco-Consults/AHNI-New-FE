# 🚨 URGENT: Backend Application is Down

## Status: CRITICAL - Entire Application Unavailable

**Time Detected:** January 4, 2025, ~22:00 UTC
**Severity:** P0 - Complete System Outage
**Impact:** All users cannot access the application

---

## Problem Summary

The entire backend API is returning **500 Internal Server Error** for all endpoints.

### Affected Endpoints (Confirmed)

```bash
❌ POST /api/v1/auth/login/          → 500 Internal Server Error
❌ GET  /api/v1/hr/employees/goal/   → 500 Internal Server Error
❌ (Likely ALL endpoints are affected)
```

### User Impact

- ❌ **Cannot login** to the application
- ❌ **Cannot access any features**
- ❌ **Complete application downtime**
- ❌ **All users affected** (staff, HR, admin)

---

## Root Cause (Suspected)

Based on the timeline, this issue started after **undoing backend implementations for performance management**.

**What likely happened:**
1. Performance management backend code was removed/reverted
2. This created errors in the Django application (broken imports, missing models, etc.)
3. The errors prevent the entire Django application from starting properly
4. All API requests now return 500 errors

---

## Verification Commands

### Check Backend Status
```bash
# 1. Check login endpoint
curl -I https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/
# Expected (broken): HTTP/1.1 500 Internal Server Error
# Should be: HTTP/1.1 200 OK or 400/401

# 2. Check if any endpoint works
curl -I https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/
# If this also returns 500, the entire app is down
```

### Check Heroku Logs (Backend Team)
```bash
# View live logs
heroku logs --tail --app ahni-erp-029252c2fbb9

# View recent errors
heroku logs --tail --app ahni-erp-029252c2fbb9 | grep ERROR

# View app crashes
heroku ps --app ahni-erp-029252c2fbb9
```

---

## Immediate Actions Required

### Priority 1: Restore Service (Choose One)

#### Option A: Rollback to Last Working Deployment (FASTEST - 5 minutes)

```bash
# 1. Check recent releases
heroku releases --app ahni-erp-029252c2fbb9

# 2. Identify last working release (before performance mgmt changes)
# Example output:
# v150  Deploy abc123  admin@mail.com  2025/01/04 20:00:00 (~ 2 hours ago)  ← BROKEN
# v149  Deploy def456  admin@mail.com  2025/01/04 18:00:00 (~ 4 hours ago)  ← LAST WORKING?

# 3. Rollback to working version
heroku rollback v149 --app ahni-erp-029252c2fbb9

# 4. Verify it works
curl -I https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/
# Should return: HTTP/1.1 200 OK or 400 (not 500)
```

**Timeline:** 5-10 minutes
**Risk:** Low (just reverting to known good state)
**Recommended:** YES - Do this first to restore service

---

#### Option B: Fix the Current Deployment (SLOWER - 30+ minutes)

**Only do this if rollback is not possible**

1. **Check Logs for Specific Error**
   ```bash
   heroku logs --tail --app ahni-erp-029252c2fbb9
   ```

2. **Common Errors to Look For:**

   **A. Import Error**
   ```
   ImportError: cannot import name 'PerformanceAssessment' from 'app.models'
   ```
   **Fix:** Remove imports referencing deleted models

   **B. Migration Error**
   ```
   django.db.utils.ProgrammingError: relation "hr_performance_assessments" does not exist
   ```
   **Fix:** Run migrations or revert migration files

   **C. Model Reference Error**
   ```
   django.core.exceptions.FieldError: Unknown field(s) (performance_assessment)
   ```
   **Fix:** Remove foreign keys referencing deleted models

3. **Fix and Redeploy**
   ```bash
   git add .
   git commit -m "Fix: Restore backend after performance mgmt removal"
   git push heroku main
   ```

**Timeline:** 30 minutes - 2 hours
**Risk:** Medium (depends on complexity of issue)
**Recommended:** Only if rollback fails

---

## Prevention for Future

### Before Removing Backend Code:

1. ✅ **Check for Dependencies**
   ```bash
   # Search for references to model being removed
   grep -r "PerformanceAssessment" .
   grep -r "from.*performance" .
   ```

2. ✅ **Create Database Backup**
   ```bash
   heroku pg:backups:capture --app ahni-erp-029252c2fbb9
   ```

3. ✅ **Test in Staging First**
   - Make changes in staging environment
   - Verify no 500 errors
   - Then deploy to production

4. ✅ **Review Migration Files**
   - Don't delete migration files for models still in database
   - Create reverse migrations to clean up

---

## Communication Template

### For Users (If Needed)

```
Subject: System Maintenance - Brief Downtime

We are currently experiencing technical difficulties with the AHNI ERP system.

Status: Under Investigation
Expected Resolution: Within 30 minutes
Impact: Temporary inability to access the application

Our technical team is working to resolve this immediately.
We apologize for any inconvenience.

Updates will be provided every 15 minutes.
```

### For Management

```
Subject: P0 Incident - Application Downtime

Status: CRITICAL - Complete application outage
Start Time: ~22:00 UTC, Jan 4, 2025
Cause: Backend deployment issue after performance management changes
Action: Rolling back to last stable version
ETA: 10 minutes

Next Update: 22:15 UTC
```

---

## Recommended Action Plan (Step-by-Step)

### ⏱️ Next 5 Minutes

1. ✅ Backend team member access Heroku dashboard
2. ✅ Check `heroku releases` to identify last working version
3. ✅ Execute rollback command
4. ✅ Verify login works

### ⏱️ Next 30 Minutes (After Rollback)

1. ✅ Confirm all critical features working
2. ✅ Notify users system is restored
3. ✅ Download logs for post-mortem analysis
4. ✅ Document what was changed

### ⏱️ Next 24 Hours

1. ✅ Review the changes that caused the outage
2. ✅ Plan proper removal of performance management code
3. ✅ Implement in staging environment first
4. ✅ Test thoroughly before production deployment

---

## Quick Reference

### Heroku App Details
- **App Name:** `ahni-erp-029252c2fbb9`
- **API Base URL:** `https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/`

### Critical Endpoints to Test After Fix
```bash
# 1. Login (most critical)
curl -X POST https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@mail.com","password":"test"}'
# Should NOT return 500

# 2. User profile (requires auth)
curl -X GET https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/users/profile/ \
  -H "Authorization: Bearer TOKEN"
# Should NOT return 500

# 3. Goals (known broken, can stay broken for now)
curl -X GET https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/
# Can return 500 temporarily - not critical for rollback
```

---

## Frontend Status

✅ **Frontend is NOT the problem** - All frontend code is working correctly

The frontend changes made today:
- Added warning banners for goals feature
- Disabled API calls to broken goals endpoint
- These changes do NOT affect the backend

**Frontend is ready and waiting for backend to be restored.**

---

## Post-Resolution Tasks

After backend is restored:

1. ✅ **Root Cause Analysis**
   - What exactly was changed in backend?
   - What caused the 500 errors?
   - How can we prevent this in the future?

2. ✅ **Proper Goals/Performance Removal (If Still Needed)**
   - Follow the migration plan in `UNIFIED_PERFORMANCE_BACKEND_REQUIREMENTS.md`
   - Test in staging first
   - Use feature flags to disable instead of deleting code

3. ✅ **Update Documentation**
   - Document what happened
   - Update deployment procedures
   - Add pre-deployment checklist

---

## Need Help?

**Immediate Assistance:**
1. Check Heroku logs: `heroku logs --tail`
2. Rollback: `heroku rollback vXXX` (replace XXX with last working version)
3. Verify: `curl -I https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/`

**Questions?**
- Frontend team is standing by to assist
- All documentation is in the repository
- This document: `URGENT_BACKEND_DOWN.md`

---

## Timeline

| Time | Event |
|------|-------|
| ~20:00 UTC | Performance management backend code removed |
| ~22:00 UTC | Issue detected - 500 errors on all endpoints |
| **NOW** | **Action Required: Rollback to restore service** |
| +10 min | **Target: Service restored** |
| +30 min | Post-incident review begins |

---

**🚨 ACTION REQUIRED NOW: Execute rollback command to restore service**

```bash
# 1. Check releases
heroku releases --app ahni-erp-029252c2fbb9

# 2. Rollback (replace vXXX with last working version)
heroku rollback vXXX --app ahni-erp-029252c2fbb9

# 3. Verify
curl -I https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/auth/login/
```

**Priority: Restore service first, investigate later.**
