# Timesheet Frontend-Backend Alignment Guide

**Date:** 2025-10-03
**Status:** API Integration Complete, UI Refactoring Required

---

## ✅ What's Complete

### Backend API (100% Complete)
- ✅ All CRUD endpoints implemented
- ✅ Approval workflow (submit, approve, reject)
- ✅ Validation API
- ✅ Blocked dates API (weekends + leave days)
- ✅ Dashboard API
- ✅ Hybrid activity support (ActivityPlan OR custom text)
- ✅ Complete documentation available

### Frontend API Layer (100% Complete)
- ✅ `timesheetController.ts` updated with all endpoints
- ✅ TypeScript types aligned with backend models
- ✅ All hooks created:
  - `useGetTimesheets` - List with filters
  - `useGetTimesheetById` - Single timesheet
  - `useCreateTimesheet` - Create new
  - `useUpdateTimesheet` - Update existing
  - `useSubmitTimesheet` - Submit for approval
  - `useApproveTimesheet` - Approve
  - `useRejectTimesheet` - Reject
  - `useDeleteTimesheet` - Delete
  - `useValidateTimesheet` - Validate before submit
  - `useGetBlockedDates` - Get weekends and leave days
  - `useGetTimesheetDashboard` - Dashboard data

---

## ⚠️ What Needs Updating

### Frontend UI (Requires Refactoring)

The current timesheet detail page (`/src/features/hr/components/timesheet-management/id/index.tsx`) needs significant updates to align with the backend API structure.

#### Current Structure (Incorrect)
```typescript
type TTimesheetDetail = {
  projectId: string;
  workplanId: string;
  name: string;
  activity: string;
  activityId: string;
  mon: string;  // ❌ Backend uses individual date entries
  tue: string;  // ❌ Backend uses individual date entries
  wed: string;  // ❌ Backend uses individual date entries
  thu: string;  // ❌ Backend uses individual date entries
  fri: string;  // ❌ Backend uses individual date entries
  sat: string;  // ❌ Backend uses individual date entries
  sun: string;  // ❌ Backend uses individual date entries
  total: string;
};
```

#### Required Structure (Correct)
```typescript
type TimesheetEntry = {
  id?: string;
  project: string;  // UUID
  project_name?: string;  // Read-only

  // Hybrid Activity (EITHER activity_plan OR custom_activity)
  activity_plan?: string;  // UUID to ActivityPlan (from workplan)
  custom_activity?: string;  // Free text
  activity_name?: string;  // Read-only

  date: string;  // Single date (YYYY-MM-DD)
  hours_worked: number;  // Decimal (0.01 to 24.00)
  description?: string;
};
```

---

## 📋 Required Frontend Changes

### 1. Data Structure Changes

**Current:** Weekly column view (Mon-Sun columns)
```
| Project | Activity | Mon | Tue | Wed | Thu | Fri | Sat | Sun | Total |
```

**Required:** Daily entry rows
```
| Project | Activity (Hybrid) | Date | Hours | Description | Actions |
```

### 2. Hybrid Activity Selection

**Current Implementation:**
- Project → Workplan → Activity (3-step selection)
- Always uses ActivityPlan

**Required Implementation:**
```typescript
// Option 1: Select from ActivityPlan (existing workplan activities)
{
  project: "uuid",
  activity_plan: "uuid",  // Selected from workplan activities
  date: "2025-10-03",
  hours_worked: 8.0,
  description: "Worked on feature X"
}

// Option 2: Custom activity text (for ad-hoc work)
{
  project: "uuid",
  custom_activity: "Team meeting",  // Free text input
  date: "2025-10-03",
  hours_worked: 2.0,
  description: "Weekly team sync"
}
```

**UI Suggestion:**
```tsx
<div className="flex gap-2">
  <Select value={activityType} onValueChange={setActivityType}>
    <SelectItem value="planned">From Workplan</SelectItem>
    <SelectItem value="custom">Custom Activity</SelectItem>
  </Select>

  {activityType === "planned" ? (
    <ActivityPlanSelect ... />  // Dropdown from workplan activities
  ) : (
    <Input
      placeholder="Enter custom activity name"
      value={customActivity}
      onChange={(e) => setCustomActivity(e.target.value)}
    />
  )}
</div>
```

### 3. Date Selection with Blocked Dates

**Required:** Integrate with blocked dates API

```typescript
// Fetch blocked dates for the timesheet period
const { data: blockedData } = useGetBlockedDates(timesheetId);
const blockedDates = blockedData?.data?.blocked_dates || [];

// Disable blocked dates in date picker
const isDateBlocked = (date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return blockedDates.some(blocked => blocked.date === dateStr);
};

// Show visual indicators
const getDateInfo = (date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const blocked = blockedDates.find(b => b.date === dateStr);
  if (!blocked) return null;

  return {
    type: blocked.type,  // 'weekend' or 'leave'
    reason: blocked.reason,  // e.g., "On leave: Annual Leave"
    isBlocked: true
  };
};
```

### 4. Validation Before Submit

**Required:** Call validation API before submission

```typescript
const handleSubmitForApproval = async () => {
  // 1. Validate first
  const { validateTimesheet } = useValidateTimesheet(timesheetId);
  const validationResult = await validateTimesheet();

  if (!validationResult.valid) {
    // Show errors - block submission
    toast.error("Cannot submit: " + validationResult.errors.join(", "));
    return;
  }

  if (validationResult.warnings.length > 0) {
    // Show warnings - allow submission with confirmation
    const confirmed = await confirm(
      `Warnings: ${validationResult.warnings.join(", ")}. Continue?`
    );
    if (!confirmed) return;
  }

  // 2. Then submit
  if (!selectedApprover) {
    toast.error("Please select an approver");
    return;
  }

  await submitTimesheet(selectedApprover);
  toast.success("Timesheet submitted for approval");
};
```

### 5. API Integration for CRUD Operations

**Create Timesheet:**
```typescript
const handleCreateTimesheet = async () => {
  const { createTimesheet } = useCreateTimesheet();

  await createTimesheet({
    start_date: "2025-09-29",
    end_date: "2025-10-05",
    entries: [
      {
        project: selectedProject.id,
        activity_plan: selectedActivity?.id,  // OR custom_activity: "Custom text"
        date: "2025-10-01",
        hours_worked: 8.0,
        description: "Worked on feature"
      }
    ]
  });
};
```

**Update Timesheet:**
```typescript
const handleUpdateTimesheet = async () => {
  const { updateTimesheet } = useUpdateTimesheet(timesheetId);

  await updateTimesheet({
    entries: [
      {
        id: "existing-entry-id",  // Update existing
        hours_worked: 7.5,
        description: "Updated hours"
      },
      {
        // New entry (no id)
        project: "uuid",
        custom_activity: "New task",
        date: "2025-10-02",
        hours_worked: 4.0
      }
    ]
  });
};
```

### 6. List Page Integration

**File:** `/src/features/hr/components/timesheet-management/TimesheetManagement.tsx`

```typescript
const { data: timesheetsData, isLoading } = useGetTimesheets({
  page: currentPage,
  page_size: 20,
  status: statusFilter,
  search: searchQuery,
  enabled: true
});

const timesheets = timesheetsData?.data?.results || [];
```

---

## 🎯 Implementation Priority

### High Priority (Core Functionality)
1. ✅ Update TypeScript types (DONE)
2. ✅ Update API controller (DONE)
3. ⏳ Refactor timesheet detail page data structure (IN PROGRESS)
   - Change from weekly columns to daily entry rows
   - Update state management
   - Update table columns
4. ⏳ Implement hybrid activity selection UI
5. ⏳ Integrate create/update/submit with backend API

### Medium Priority (Enhanced UX)
6. Add blocked dates integration
7. Add validation before submit
8. Add date picker with blocked date indicators
9. Update list page with real API data

### Low Priority (Nice to Have)
10. Add timesheet dashboard
11. Add bulk operations
12. Add export functionality

---

## 📝 Example: Refactored Timesheet Detail Page

Here's a simplified example of what the refactored component should look like:

```typescript
const TimesheetManagementFull = () => {
  const { id } = useParams();  // Get timesheet ID from URL

  // Fetch timesheet data
  const { data: timesheetData, isLoading } = useGetTimesheetById(id, !!id);
  const timesheet = timesheetData?.data;

  // Local state for entries
  const [entries, setEntries] = useState<TimesheetEntry[]>(timesheet?.entries || []);

  // Blocked dates
  const { data: blockedData } = useGetBlockedDates(id);
  const blockedDates = blockedData?.data?.blocked_dates || [];

  // Add new entry
  const addEntry = () => {
    setEntries(prev => [...prev, {
      project: "",
      date: "",
      hours_worked: 0,
      description: ""
    }]);
  };

  // Update entry
  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  // Save to backend
  const handleSave = async () => {
    const { updateTimesheet } = useUpdateTimesheet(id);
    await updateTimesheet({ entries });
    toast.success("Timesheet saved");
  };

  // Submit for approval
  const handleSubmit = async () => {
    // Validate first
    const { validateTimesheet } = useValidateTimesheet(id);
    const result = await validateTimesheet();

    if (!result.valid) {
      toast.error("Validation failed: " + result.errors.join(", "));
      return;
    }

    // Then submit
    const { submitTimesheet } = useSubmitTimesheet(id);
    await submitTimesheet(selectedApprover);
    toast.success("Submitted for approval");
  };

  return (
    <div>
      <h2>Timesheet for {timesheet?.start_date} to {timesheet?.end_date}</h2>

      <DataTable
        columns={columns}
        data={entries}
      />

      <Button onClick={addEntry}>Add Entry</Button>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={handleSubmit}>Submit for Approval</Button>
    </div>
  );
};
```

---

## 🚀 Next Steps

### For Frontend Team:

1. **Review this document** and backend API documentation
2. **Decide on UI/UX approach** for daily entries vs weekly columns
3. **Refactor timesheet detail page** following the patterns above
4. **Test with backend API** using the endpoints documented in `TIMESHEET_API_DOCUMENTATION.md`

### For Backend Team:

✅ All backend work is complete!
- API is ready and tested
- Documentation is comprehensive
- Frontend team has everything they need

---

## 📞 Questions?

- **Backend API Docs:** `/Users/muhammadilu/ahni-erp/erp/TIMESHEET_API_DOCUMENTATION.md`
- **Frontend Controller:** `/Users/muhammadilu/AHNI-New-FE/src/features/hr/controllers/timesheetController.ts`
- **Frontend Types:** `/Users/muhammadilu/AHNI-New-FE/src/features/hr/types/timesheet.ts`

---

**Status Summary:**
- ✅ Backend: 100% Complete
- ✅ Frontend API Layer: 100% Complete
- ⏳ Frontend UI: Requires Refactoring

**The API integration work is done. The remaining work is UI refactoring to match the backend's data structure.**
