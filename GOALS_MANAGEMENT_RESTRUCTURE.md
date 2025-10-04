# Goals Management System - Restructured

## Overview
Goals management has been moved from Employee Details to a standalone module under Performance Management in the HR menu.

---

## Navigation Structure

### **Sidebar Menu**
```
HR
└── Performance Management
    ├── Performance Appraisal (/dashboard/hr/performance-management)
    └── Goal Setting (/dashboard/hr/goals-management) ← NEW
```

---

## Routes Added

### **RouterConstants.ts**
```typescript
GOALS_MANAGEMENT: "/dashboard/hr/goals-management",
GOALS_MANAGEMENT_CREATE: "/dashboard/hr/goals-management/create",
GOALS_MANAGEMENT_DETAIL: "/dashboard/hr/goals-management/:id",
```

### **Pages Created**
1. `/dashboard/hr/goals-management` - Goals list page
2. `/dashboard/hr/goals-management/create` - Create new goal
3. `/dashboard/hr/goals-management/[id]` - View goal details

---

## Components Created

### **1. Goals List** (`src/features/hr/components/goals-management/index.tsx`)
**Features:**
- Data table showing all goals
- Columns: Title, Employee, Total Weight, Tasks Count, Status, Created Date
- Search and filter functionality
- "Create New Goal" button
- Actions: View, Delete

**Key Code:**
```typescript
const columns: ColumnDef<any>[] = [
  { header: "Title", accessorKey: "title" },
  { header: "Employee", accessorKey: "employee_name" },
  { header: "Total Weight", accessorKey: "total_weight" },
  { header: "Tasks Count", id: "narratives_count" },
  { header: "Status", accessorKey: "status" },
  // ...
];
```

### **2. Create Goal** (`src/features/hr/components/goals-management/form/index.tsx`)
**Features:**
- Employee selection dropdown
- Goal title and description
- Multiple tasks (narratives) with dynamic fields
- Weight validation (must sum to 100%)
- Real-time weight calculation
- Visual feedback showing remaining percentage

**Validation:**
```typescript
const GoalSchema = z.object({
  employee: z.string().min(1, "Employee is required"),
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  narratives: z.array(
    z.object({
      description: z.string().min(1, "Task description is required"),
      weight: z.number().min(0.01).max(100),
    })
  ).min(1, "At least one task is required"),
});
```

**Weight Indicator:**
```tsx
<div className={`${Math.abs(totalWeight - 100) < 0.01 ? 'text-green-600' : 'text-orange-600'}`}>
  Total: {totalWeight.toFixed(1)}%
  {Math.abs(totalWeight - 100) < 0.01 ? '✓' : `(${(100 - totalWeight).toFixed(1)}% remaining)`}
</div>
```

### **3. Goal Details** (`src/features/hr/components/goals-management/id/index.tsx`)
**Features:**
- Full goal information display
- Employee name, status, dates
- List of all tasks with individual weights
- Weight summary
- Edit and Delete actions

**Task Display:**
```tsx
{goal.narratives.map((narrative, idx) => (
  <div className="flex items-start gap-3 p-3 border rounded-lg">
    <div className="w-8 h-8 rounded-full bg-primary/10">
      {idx + 1}
    </div>
    <div className="flex-1">
      <p>{narrative.description}</p>
    </div>
    <Badge variant="secondary">
      {parseFloat(narrative.weight).toFixed(0)}%
    </Badge>
  </div>
))}
```

---

## Changes to Existing Components

### **1. Employee Details** (`workforce-database/id/index.tsx`)
**Removed:**
- ❌ Goals tab from employee details
- ❌ Import of `Goals` component

**Before:**
```typescript
const TABS = [
  { label: "Staff Information", ... },
  { label: "Beneficiary", ... },
  // ...
  { label: "Goals", value: "goal", children: <Goals /> }, // REMOVED
];
```

**After:**
```typescript
const TABS = [
  { label: "Staff Information", ... },
  { label: "Beneficiary", ... },
  { label: "Additional Information", ... },
  // Goals tab removed
];
```

### **2. Performance Assessment Form** (`performance-management/form/index.tsx`)
**Changed from:** Employee self-creates assessment
**Changed to:** HR creates assessment for any employee

**Added:**
- Employee selection dropdown (first field in form)
- Dynamic goal fetching based on selected employee

**Updated Schema:**
```typescript
const PerformanceAssessmentSchema = z.object({
  employee: z.string().min(1, "Employee is required"), // NEW
  description: z.string().min(1, "Description is required"),
  cycle_name: z.string().min(1, "Cycle is required"),
  // ...
});
```

**Employee Selection:**
```tsx
<FormSelect
  label='Select Employee'
  name='employee'
  placeholder='Select employee to evaluate'
  required
  options={userOptions}
/>
```

**Goal Fetching:**
```typescript
const [selectedEmployee, setSelectedEmployee] = useState<string>("");
const watchedEmployee = watch("employee");

useEffect(() => {
  if (watchedEmployee) {
    setSelectedEmployee(watchedEmployee);
  }
}, [watchedEmployee]);

const { data: employeeGoals } = useGetEmployeeGoals(
  selectedEmployee,
  !!selectedEmployee
);
```

---

## User Flow Comparison

### **Old Flow (Employee-centric)**
```
1. Workforce Database
2. Click on employee
3. Click "Goals" tab
4. Create goal for that employee
```

### **New Flow (HR-driven)**

#### **Goal Management:**
```
1. HR Menu
2. Performance Management → Goal Setting
3. View all goals across organization
4. Create New Goal → Select Employee → Add tasks
```

#### **Performance Assessment:**
```
1. HR Menu
2. Performance Management → Performance Appraisal
3. Create Assessment
4. Select Employee → System fetches their goals
5. Add evaluators → Submit
```

---

## API Integration

### **Goals Controller** (`goalsController.ts`)
Used hooks:
- `useGetGoals()` - Fetch all goals (for list page)
- `useGetGoal(id)` - Fetch single goal (for detail page)
- `useCreateGoal()` - Create new goal
- `useGetEmployeeGoals(employeeId)` - Fetch goals for specific employee (used in assessment form)

### **Payload Structure**
```typescript
interface CreateGoalPayload {
  employee: string;              // Employee UUID
  title: string;                 // Goal title
  description?: string;          // Optional description
  status: "not_started" | ...;
  narratives: Array<{
    description: string;         // Task description
    weight: number;             // Percentage (0-100)
    completed: boolean;
  }>;
}
```

---

## Backend Requirements

The backend API should support:

### **1. GET /hr/employees/goal/**
Returns all goals (for Goals Management list page)

### **2. GET /hr/employees/goal/?employee={uuid}**
Returns goals for specific employee (for Performance Assessment form)

### **3. GET /hr/employees/goal/{id}/**
Returns single goal detail

### **4. POST /hr/employees/goal/**
Creates new goal with narratives

**Expected Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "employee": "employee-uuid",
      "employee_name": "John Doe",
      "title": "Improve Customer Satisfaction",
      "description": "Focus on enhancing experience",
      "status": "not_started",
      "total_weight": "100.00",
      "narratives": [
        {
          "id": "narrative-uuid",
          "description": "Reduce response time by 30%",
          "weight": "40.00",
          "completed": false,
          "created_datetime": "2025-01-04T12:00:00Z"
        },
        {
          "id": "narrative-uuid-2",
          "description": "Achieve 90% satisfaction rating",
          "weight": "60.00",
          "completed": false,
          "created_datetime": "2025-01-04T12:00:00Z"
        }
      ],
      "created_datetime": "2025-01-04T12:00:00Z",
      "updated_datetime": "2025-01-04T12:00:00Z"
    }
  ]
}
```

---

## Benefits

### **For HR Team**
✅ **Centralized Management** - All goals in one place
✅ **Cross-employee Visibility** - See all goals organization-wide
✅ **Better Control** - HR can create/manage goals for any employee
✅ **Easier Tracking** - Monitor goal completion across teams

### **For Users**
✅ **Cleaner Interface** - Employee details not cluttered with goals
✅ **Clear Separation** - Goals management separate from employee records
✅ **Better Navigation** - Goals under Performance Management (logical grouping)

### **For Developers**
✅ **Maintainability** - Clear module boundaries
✅ **Reusability** - Goal components can be used elsewhere
✅ **Scalability** - Easier to add goal-related features

---

## Testing Checklist

- [ ] Navigate to HR → Performance Management → Goal Setting
- [ ] Verify goals list loads correctly
- [ ] Click "Create New Goal"
- [ ] Select an employee from dropdown
- [ ] Add goal title and description
- [ ] Add multiple tasks with weights
- [ ] Verify weight validation (must sum to 100%)
- [ ] Submit and verify goal is created
- [ ] Click on a goal to view details
- [ ] Navigate to Performance Management → Performance Appraisal
- [ ] Click "Create Assessment"
- [ ] Select an employee
- [ ] Verify their goals display automatically
- [ ] Complete assessment creation

---

## Files Modified

### **Created:**
- `src/features/hr/components/goals-management/index.tsx`
- `src/features/hr/components/goals-management/form/index.tsx`
- `src/features/hr/components/goals-management/id/index.tsx`
- `src/app/dashboard/hr/goals-management/page.tsx`
- `src/app/dashboard/hr/goals-management/create/page.tsx`
- `src/app/dashboard/hr/goals-management/[id]/page.tsx`
- `src/pages/protectedPages/hr/goals-management/index.tsx`
- `src/pages/protectedPages/hr/goals-management/form/index.tsx`
- `src/pages/protectedPages/hr/goals-management/id/index.tsx`

### **Modified:**
- `src/constants/RouterConstants.ts` - Added Goals routes
- `src/routes/hr.tsx` - Added Goals route configuration
- `src/components/Sidebar.tsx` - Added "Goal Setting" to Performance Management menu
- `src/features/hr/components/workforce-database/id/index.tsx` - Removed Goals tab
- `src/features/hr/components/performance-management/form/index.tsx` - Added employee selection

---

## Summary

Goals management is now a **standalone HR module** accessible via:
- **Main Menu:** HR → Performance Management → Goal Setting
- **Direct URL:** `/dashboard/hr/goals-management`

The system allows HR to:
1. **View all goals** across the organization
2. **Create goals** for any employee
3. **Track goal completion** and status
4. **Integrate with assessments** - goals automatically load when creating performance assessments

This restructuring provides better organization, clearer workflows, and centralized goal management for the HR team.
