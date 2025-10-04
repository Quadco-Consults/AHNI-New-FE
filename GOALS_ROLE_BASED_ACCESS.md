# Goals Management - Role-Based Access

## Overview
The Goals Management system now supports role-based access control:
- **Staff/Employees**: Can only view and create their own goals
- **HR/Admin**: Can view all goals and create goals for any employee

---

## Role Detection

### **How Roles are Determined**
```typescript
const userId = localStorage.getItem('user_id') || "";
const userRole = localStorage.getItem('user_role') || "";
const userGroups = localStorage.getItem('user_groups') || "";

const isAdmin = userRole === 'admin' ||
                userRole === 'hr' ||
                userGroups.includes('HR') ||
                userGroups.includes('Admin');
```

**Admin/HR Users:**
- `user_role` = 'admin' OR 'hr'
- OR `user_groups` includes 'HR' or 'Admin'

**Regular Staff:**
- All other users

---

## Goals List Page (`/dashboard/hr/goals-management`)

### **For Staff/Employees**

**What They See:**
- Page Title: "My Goals"
- Description: "Set and track your personal performance goals"
- Table shows: Only their own goals
- No "Employee" column (since all goals are theirs)
- Button: "Create My Goal"

**Data Fetching:**
```typescript
const { data: myGoalsData } = useGetEmployeeGoals(
  currentUserId,  // Only fetch current user's goals
  !isAdmin && !!currentUserId
);
```

**Table Columns:**
1. Checkbox
2. Title
3. Total Weight
4. Tasks Count
5. Status
6. Created Date
7. Actions

### **For HR/Admin**

**What They See:**
- Page Title: "Goals Management"
- Description: "Manage goals for all employees"
- Table shows: All goals across organization
- Includes "Employee" column
- Button: "Create New Goal"

**Data Fetching:**
```typescript
const { data: allGoalsData } = useGetGoals({
  search: debouncedSearchTerm,
  page: 1,
  size: 20,
  enabled: isAdmin,  // Fetch all goals
});
```

**Table Columns:**
1. Checkbox
2. Title
3. **Employee** ← Extra column
4. Total Weight
5. Tasks Count
6. Status
7. Created Date
8. Actions

---

## Create Goal Page (`/dashboard/hr/goals-management/create`)

### **For Staff/Employees**

**What They See:**
- Page Title: "Create My Goal"
- **No employee selection dropdown**
- Info banner: "Creating goal for: Your account"
- Goal title, description, and tasks fields

**Employee Field:**
- Hidden from UI
- Automatically set to current user's ID
- Cannot create goals for others

**Code:**
```typescript
// Pre-select current user
if (!isAdminUser && userId) {
  form.setValue('employee', userId);
}

// UI shows info banner instead of dropdown
{!isAdmin && (
  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <p className="text-sm text-blue-800">
      <span className="font-semibold">Creating goal for:</span> Your account
    </p>
  </div>
)}
```

### **For HR/Admin**

**What They See:**
- Page Title: "Create New Goal"
- **Employee selection dropdown** with all users
- Can select any employee to create goal for
- Goal title, description, and tasks fields

**Employee Field:**
- Visible dropdown showing all employees
- Required field
- Can create goals for any employee

**Code:**
```typescript
// Show employee selection
{isAdmin && (
  <FormSelect
    label="Employee"
    name="employee"
    placeholder="Select employee"
    required
    options={userOptions}  // All users
  />
)}
```

---

## User Experience Comparison

### **Staff Creating Their Own Goal**

1. Navigate to: HR → Performance Management → Goal Setting
2. See: "My Goals" page with only their goals
3. Click: "Create My Goal"
4. See: Info banner "Creating goal for: Your account"
5. Fill: Goal title, description, tasks
6. Validate: Tasks must sum to 100%
7. Submit: Goal created for current user
8. Redirected to: "My Goals" list

### **Admin Creating Goal for Any Employee**

1. Navigate to: HR → Performance Management → Goal Setting
2. See: "Goals Management" page with all employees' goals
3. Click: "Create New Goal"
4. Select: Employee from dropdown (e.g., "John Doe")
5. Fill: Goal title, description, tasks
6. Validate: Tasks must sum to 100%
7. Submit: Goal created for selected employee
8. Redirected to: "Goals Management" list showing all goals

---

## API Behavior

### **For Staff**
```
GET /hr/employees/goal/?employee={current_user_id}
POST /hr/employees/goal/
{
  "employee": "{current_user_id}",  // Auto-filled
  "title": "My Goal",
  "narratives": [...]
}
```

### **For Admin**
```
GET /hr/employees/goal/  // All goals
POST /hr/employees/goal/
{
  "employee": "{selected_employee_id}",  // Chosen from dropdown
  "title": "Employee Goal",
  "narratives": [...]
}
```

---

## Security Considerations

### **Frontend Protection**
- Role detection via localStorage
- Conditional data fetching
- UI elements hidden/shown based on role
- Pre-filled employee ID for staff

### **Backend Requirements (Important!)**
The backend MUST enforce these rules:

1. **Regular Staff:**
   - Can only create goals where `employee` = their own ID
   - Can only view goals where `employee` = their own ID
   - Cannot access other employees' goals

2. **HR/Admin:**
   - Can create goals for any employee
   - Can view all goals
   - Can delete/edit any goal

**Backend Validation Example:**
```python
def create_goal(request):
    user = request.user
    employee_id = request.data.get('employee')

    # Check if user is trying to create goal for someone else
    if not user.is_hr_admin() and employee_id != str(user.id):
        return Response(
            {"error": "You can only create goals for yourself"},
            status=403
        )

    # Proceed with goal creation
    ...
```

---

## Permissions Matrix

| Action | Staff | HR/Admin |
|--------|-------|----------|
| View own goals | ✅ Yes | ✅ Yes |
| View all goals | ❌ No | ✅ Yes |
| Create own goal | ✅ Yes | ✅ Yes |
| Create goal for others | ❌ No | ✅ Yes |
| Edit own goal | ✅ Yes | ✅ Yes |
| Edit others' goals | ❌ No | ✅ Yes |
| Delete own goal | ✅ Yes | ✅ Yes |
| Delete others' goals | ❌ No | ✅ Yes |

---

## Testing Checklist

### **As Staff User:**
- [ ] Navigate to Goal Setting
- [ ] Verify page title is "My Goals"
- [ ] Verify only your goals are shown
- [ ] Verify "Employee" column is NOT visible
- [ ] Click "Create My Goal"
- [ ] Verify NO employee dropdown
- [ ] Verify info banner shows "Creating goal for: Your account"
- [ ] Create a goal and verify it's saved
- [ ] Verify you cannot see other employees' goals

### **As HR/Admin User:**
- [ ] Navigate to Goal Setting
- [ ] Verify page title is "Goals Management"
- [ ] Verify all employees' goals are shown
- [ ] Verify "Employee" column IS visible
- [ ] Click "Create New Goal"
- [ ] Verify employee dropdown IS visible
- [ ] Select an employee from dropdown
- [ ] Create a goal for that employee
- [ ] Verify goal appears in the list with correct employee

---

## Role Determination Logic

### **Check Order:**
1. First check `user_role` in localStorage
2. Then check `user_groups` in localStorage
3. If any condition matches admin/HR criteria → Admin
4. Otherwise → Regular Staff

### **Fallback:**
If role cannot be determined:
- Default to **Staff** (safer, restricts access)
- User sees only their own goals
- Cannot create goals for others

---

## Summary

The Goals Management system now intelligently adapts based on user role:

**Staff Experience:**
- Personal goal tracking interface
- Simplified UI (no employee selection)
- Can only manage their own goals
- Self-service goal setting

**Admin Experience:**
- Organization-wide goal management
- Full employee selection capabilities
- Can create/manage goals for anyone
- Centralized goal oversight

This provides both **autonomy for staff** and **control for HR**, while maintaining a clean, role-appropriate user experience.
