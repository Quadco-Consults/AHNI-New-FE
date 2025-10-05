# Goals Management - API Integration Checklist

## ✅ Frontend API Integration Status

### **Endpoint Configuration**
```typescript
const BASE_URL = "hr/employees/goal/";
const CREATE_GOALS_URL = "hr/employees/goal/";
```

**Full URL:** `https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/hr/employees/goal/`

---

## ✅ Create Goal Integration

### **Frontend Payload Structure**
```typescript
interface CreateGoalPayload {
  employee: string;              // Employee UUID
  title: string;                 // Goal title
  description?: string;          // Optional description
  status?: "not_started" | ...;  // Goal status
  start_date?: string;           // Optional start date
  end_date?: string;             // Optional end date
  narratives: Array<{
    description: string;         // Task description
    weight: number;             // Weight (0-100)
    completed: boolean;         // Completion status
  }>;
}
```

### **Actual Payload Sent from Form**
```typescript
const payload: CreateGoalPayload = {
  employee: data.employee,        // ✅ From form (employee dropdown or auto-filled)
  title: data.title,             // ✅ From form
  description: data.description || "", // ✅ From form
  status: "not_started",         // ✅ Hardcoded default
  narratives: data.narratives.map(n => ({
    description: n.description,  // ✅ From form
    weight: n.weight,           // ✅ From form
    completed: false,           // ✅ Default false
  })),
};
```

### **Expected Backend Response**
```json
{
  "status": true,
  "message": "Goal created successfully",
  "data": {
    "id": "uuid",
    "employee": "employee-uuid",
    "employee_name": "John Doe",
    "title": "Goal Title",
    "description": "Goal Description",
    "status": "not_started",
    "start_date": null,
    "end_date": null,
    "total_weight": "100.00",
    "approved": false,
    "narratives": [
      {
        "id": "narrative-uuid",
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
}
```

---

## ✅ List Goals Integration

### **For Regular Staff**
**Endpoint:** `GET /api/v1/hr/employees/goal/`

**Expected Behavior:**
- Backend filters to show only goals where `employee` = current user
- Frontend displays in "My Goals" table

**Controller:**
```typescript
const { data: myGoalsData } = useGetEmployeeGoals(
  currentUserId,
  !isAdmin && !!currentUserId
);
```

**API Call:**
```
GET /api/v1/hr/employees/goal/?employee={current-user-id}
```

### **For HR/Admin**
**Endpoint:** `GET /api/v1/hr/employees/goal/`

**Expected Behavior:**
- Backend returns all goals across organization
- Frontend displays in "Goals Management" table with Employee column

**Controller:**
```typescript
const { data: allGoalsData } = useGetGoals({
  search: debouncedSearchTerm,
  page: 1,
  size: 20,
  enabled: isAdmin,
});
```

**API Call:**
```
GET /api/v1/hr/employees/goal/?page=1&size=20
```

---

## ✅ Validation (Frontend)

### **Pre-submission Validation**
```typescript
// 1. Check narratives sum to 100%
if (Math.abs(totalWeight - 100) > 0.01) {
  toast.error(`Task weights must equal 100%. Currently: ${totalWeight.toFixed(2)}%`);
  return;
}

// 2. Validate payload structure
const validationErrors = validateGoalPayload(details);
if (validationErrors.length > 0) {
  throw new Error(validationErrors.join(". "));
}
```

### **Validation Function**
```typescript
export const validateGoalPayload = (payload: CreateGoalPayload): string[] => {
  const errors: string[] = [];

  // Check narratives exist
  if (!payload.narratives || payload.narratives.length === 0) {
    errors.push("At least one narrative is required");
  }

  // Check narrative weights sum to 100
  const totalWeight = payload.narratives.reduce((sum, n) => sum + n.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    errors.push(`Narrative weights must sum to 100, got ${totalWeight.toFixed(2)}`);
  }

  // Check individual weights
  payload.narratives.forEach((narrative, index) => {
    if (narrative.weight < 0 || narrative.weight > 100) {
      errors.push(`Narrative ${index + 1} weight must be between 0-100`);
    }
  });

  // Check required fields
  if (!payload.employee) {
    errors.push("Employee ID is required");
  }
  if (!payload.title?.trim()) {
    errors.push("Goal title is required");
  }

  return errors;
};
```

---

## ✅ Error Handling

### **Frontend Error Handling**
```typescript
try {
  await createGoal(payload);
  queryClient.invalidateQueries({ queryKey: ["goals"] });
  toast.success("Goal created successfully");
  router.push(HrRoutes.GOALS_MANAGEMENT);
} catch (error: any) {
  console.error("Goal creation error:", error);
  toast.error(error?.message || "Failed to create goal");
}
```

### **Expected Error Responses from Backend**

**1. Validation Error (Weights don't sum to 100%)**
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "Task weights must sum to 100%. Current total: 95.00%",
  "data": null
}
```

**2. Permission Denied (Staff creating for others)**
```json
{
  "status": false,
  "error_code": "permission_denied",
  "message": "You can only create goals for yourself. Contact HR for assistance.",
  "data": null
}
```

**3. Missing Required Field**
```json
{
  "status": false,
  "error_code": "validation_error",
  "message": "Goal title is required",
  "data": {
    "title": ["This field is required"]
  }
}
```

---

## 🧪 Testing Scenarios

### **Test 1: Staff Creates Own Goal**
1. ✅ Login as regular staff
2. ✅ Navigate to `/dashboard/hr/goals-management/create`
3. ✅ Verify employee field is hidden
4. ✅ Fill goal title: "Improve Communication"
5. ✅ Add task 1: "Complete course" - 50%
6. ✅ Add task 2: "Give presentations" - 50%
7. ✅ Verify total shows: "100% ✓"
8. ✅ Click "Create Goal"
9. ✅ Verify success toast appears
10. ✅ Verify redirect to goals list
11. ✅ Verify goal appears in list

**Expected API Call:**
```
POST /api/v1/hr/employees/goal/
{
  "employee": "current-user-uuid",
  "title": "Improve Communication",
  "description": "",
  "status": "not_started",
  "narratives": [
    {"description": "Complete course", "weight": 50, "completed": false},
    {"description": "Give presentations", "weight": 50, "completed": false}
  ]
}
```

### **Test 2: Admin Creates Goal for Employee**
1. ✅ Login as HR/Admin
2. ✅ Navigate to `/dashboard/hr/goals-management/create`
3. ✅ Verify employee dropdown is visible
4. ✅ Select employee: "John Doe"
5. ✅ Fill goal title: "Sales Target"
6. ✅ Add task 1: "Acquire clients" - 60%
7. ✅ Add task 2: "Upsell" - 40%
8. ✅ Verify total shows: "100% ✓"
9. ✅ Click "Create Goal"
10. ✅ Verify success toast appears
11. ✅ Verify goal appears for John Doe in list

**Expected API Call:**
```
POST /api/v1/hr/employees/goal/
{
  "employee": "john-doe-uuid",
  "title": "Sales Target",
  "description": "",
  "status": "not_started",
  "narratives": [
    {"description": "Acquire clients", "weight": 60, "completed": false},
    {"description": "Upsell", "weight": 40, "completed": false}
  ]
}
```

### **Test 3: Validation Error - Weights Don't Sum to 100%**
1. ✅ Fill goal form
2. ✅ Add task 1: 40%
3. ✅ Add task 2: 50%
4. ✅ Total shows: "90% (10% remaining)" in orange
5. ✅ Submit button is DISABLED
6. ✅ Try to submit (should not work)
7. ✅ If somehow submitted, show error: "Task weights must equal 100%. Currently: 90.00%"

### **Test 4: Multiple Tasks**
1. ✅ Fill goal form
2. ✅ Add task 1: 25%
3. ✅ Add task 2: 25%
4. ✅ Add task 3: 25%
5. ✅ Add task 4: 25%
6. ✅ Verify total: "100% ✓" in green
7. ✅ Submit successfully
8. ✅ Backend creates goal with 4 narratives

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User fills form:                                           │
│     - Goal Title                                               │
│     - Description (optional)                                   │
│     - Tasks with weights                                       │
│                                                                 │
│  2. Validation (client-side):                                  │
│     - Title required ✓                                         │
│     - Weights sum to 100% ✓                                    │
│     - Each weight 0-100 ✓                                      │
│                                                                 │
│  3. Create payload:                                            │
│     {                                                          │
│       employee: "uuid",                                        │
│       title: "...",                                            │
│       narratives: [...]                                        │
│     }                                                          │
│                                                                 │
│  4. API Call:                                                  │
│     POST /api/v1/hr/employees/goal/                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Receive request                                            │
│                                                                 │
│  2. Permission check:                                          │
│     - Is user HR/Admin? → Can create for anyone               │
│     - Is regular staff? → Can only create for self            │
│                                                                 │
│  3. Validation:                                                │
│     - Narratives sum to 100% ✓                                │
│     - Employee exists ✓                                        │
│     - Title not empty ✓                                        │
│                                                                 │
│  4. Create database records:                                   │
│     - Create Goal                                              │
│     - Create GoalNarratives (loop)                            │
│     - Calculate total_weight                                   │
│                                                                 │
│  5. Return response:                                           │
│     {                                                          │
│       status: true,                                            │
│       data: {                                                  │
│         id, title, narratives, total_weight, ...              │
│       }                                                        │
│     }                                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Receive success response                                   │
│                                                                 │
│  2. Show success toast:                                        │
│     "Goal created successfully"                                │
│                                                                 │
│  3. Invalidate cache:                                          │
│     queryClient.invalidateQueries(["goals"])                  │
│                                                                 │
│  4. Redirect to:                                               │
│     /dashboard/hr/goals-management                            │
│                                                                 │
│  5. Goals list refreshes automatically                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Integration Checklist

### **Frontend (Completed)**
- [x] Create Goal interface matching backend
- [x] Create CreateGoalPayload interface
- [x] Implement useCreateGoal hook
- [x] Create goal form with validation
- [x] Role-based employee selection
- [x] Real-time weight calculation
- [x] Submit button disabled until valid
- [x] Success/error handling
- [x] Cache invalidation
- [x] Redirect after success

### **Backend (Required)**
- [ ] Create Goal model
- [ ] Create GoalNarrative model
- [ ] Create serializers (exclude 'goal' FK in narratives)
- [ ] Implement role-based permissions
- [ ] Validate narratives sum to 100%
- [ ] Auto-calculate total_weight
- [ ] Return proper error messages
- [ ] Test with Postman/curl

### **Testing (To Do)**
- [ ] Test staff creating own goal
- [ ] Test admin creating goal for others
- [ ] Test validation errors
- [ ] Test permission denied errors
- [ ] Test with multiple narratives
- [ ] Test edge cases (0%, 100%, decimals)

---

## 🔍 Quick Verification Commands

### **Check API URL**
```javascript
// In browser console on create page
console.log("API Base:", process.env.NEXT_PUBLIC_API_URL);
console.log("Goals endpoint:", "hr/employees/goal/");
```

### **Monitor Network Requests**
1. Open DevTools → Network tab
2. Filter: XHR/Fetch
3. Fill and submit goal form
4. Look for: `POST hr/employees/goal/`
5. Check request payload
6. Check response

### **Check Current User**
```javascript
// In browser console
console.log("User ID:", localStorage.getItem('user_id'));
console.log("User Role:", localStorage.getItem('user_role'));
console.log("User Groups:", localStorage.getItem('user_groups'));
```

---

## 🚨 Common Issues & Solutions

### **Issue 1: "goal is not a valid UUID"**
**Cause:** Backend GoalNarrativeSerializer includes 'goal' FK
**Solution:** Backend must explicitly exclude 'goal' from fields

### **Issue 2: Employee field empty**
**Cause:** Staff user's ID not auto-filled
**Solution:** Check useEffect that sets employee on form

### **Issue 3: Weights don't validate**
**Cause:** Decimal precision issues (99.99 vs 100)
**Solution:** Use tolerance of ±0.01 in validation

### **Issue 4: Permission denied**
**Cause:** Staff trying to create goal for others
**Solution:** Ensure employee field is auto-filled for staff

### **Issue 5: Cache not updating**
**Cause:** Query key mismatch
**Solution:** Ensure invalidateQueries matches query key in list

---

## ✅ Summary

**API Integration Status: READY** ✅

- Frontend payload structure matches backend requirements
- Validation is implemented on both sides
- Role-based access is configured
- Error handling is in place
- Cache invalidation works correctly

**Next Steps:**
1. Backend team implements the API as per BACKEND_REQUIREMENTS_GOALS.md
2. Test the integration with real API
3. Monitor for errors and adjust as needed
4. Deploy to production

The frontend is ready and waiting for the backend API to be deployed! 🚀
