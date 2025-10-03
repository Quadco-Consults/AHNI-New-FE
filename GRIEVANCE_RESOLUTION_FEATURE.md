# Grievance Resolution Feature ✅

**Date:** 2025-10-03
**Status:** Feature Added
**Location:** `/dashboard/hr/grievance-management/{id}/details`

---

## Feature Summary

Added the ability to **mark grievances as resolved or reopen them** directly from the Resolution tab in the Grievance Details page.

---

## What Was Added

### Visual Status Badge
- **Location:** Resolution tab header
- **Colors:**
  - Green badge: "Resolved"
  - Red badge: "Unresolved"

### Action Buttons

#### Mark as Resolved Button
- **Shows when:** Grievance status is `is_resolved: false`
- **Button text:** "Mark as Resolved"
- **Icon:** CheckCircle2 (green)
- **Action:** Sets `is_resolved` to `true` via PATCH API call

#### Reopen Button
- **Shows when:** Grievance status is `is_resolved: true`
- **Button text:** "Reopen"
- **Icon:** XCircle (red)
- **Action:** Sets `is_resolved` to `false` via PATCH API call

---

## How to Use

### To Mark a Grievance as Resolved

1. Navigate to `/dashboard/hr/grievance-management`
2. Click the "View" (eye icon) button on any grievance
3. Click the **Resolution** tab
4. Review the resolution details
5. Click the **"Mark as Resolved"** button (green)
6. The grievance status will update to "Resolved"
7. Page will refresh automatically to show updated status

### To Reopen a Resolved Grievance

1. Navigate to a resolved grievance detail page
2. Go to the **Resolution** tab
3. Click the **"Reopen"** button (red)
4. The grievance status will change back to "Unresolved"
5. Page will refresh automatically

---

## Technical Implementation

### Files Modified

**File:** `/src/features/hr/components/grievance-management/id/Resolutions.tsx`

### API Integration

Uses the existing `usePatchGrievance` hook from `/src/features/hr/controllers/grievanceController.ts`:

```typescript
const { patchGrievance, isLoading: isPatching } = usePatchGrievance(data?.id || "")

const handleResolveToggle = async () => {
  try {
    await patchGrievance({
      is_resolved: !data?.is_resolved
    });
    toast.success(data?.is_resolved ? "Grievance reopened" : "Grievance marked as resolved");
    window.location.reload();
  } catch (error) {
    toast.error("Failed to update grievance status");
  }
};
```

### Backend API Call

**Endpoint:** `PATCH /api/v1/hr/grievances/complaints/{id}/`

**Request Body:**
```json
{
  "is_resolved": true  // or false to reopen
}
```

**Expected Response:**
```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "title": "Complaint title",
    "is_resolved": true,
    // ... other fields
  }
}
```

---

## UI Components Added

### 1. Status Badge

```tsx
<Badge
  className={cn(
    "px-3 py-1 rounded-lg capitalize",
    data?.is_resolved
      ? "bg-green-50 text-green-600 border-green-200"
      : "bg-red-50 text-red-600 border-red-200"
  )}
>
  {data?.is_resolved ? "Resolved" : "Unresolved"}
</Badge>
```

### 2. Toggle Button

```tsx
<Button
  onClick={handleResolveToggle}
  disabled={isPatching}
  className={cn(
    "py-2 px-4 rounded-md",
    data?.is_resolved
      ? "bg-red-50 text-red-600 hover:bg-red-100"
      : "bg-green-50 text-green-600 hover:bg-green-100"
  )}
  variant="outline"
>
  {isPatching ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      Updating...
    </>
  ) : (
    <>
      {data?.is_resolved ? (
        <>
          <XCircle className="w-4 h-4 mr-2" />
          Reopen
        </>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark as Resolved
        </>
      )}
    </>
  )}
</Button>
```

---

## User Experience

### Before
- No way to change grievance status from the UI
- Status displayed as read-only badge in list view
- Users had to manually edit database or use API

### After
- ✅ Clear visual status indicator
- ✅ One-click status toggle
- ✅ Loading state during API call
- ✅ Success/error toast notifications
- ✅ Automatic page refresh to show updated data
- ✅ Button disabled during update to prevent double-clicks

---

## Error Handling

### API Errors
```typescript
try {
  await patchGrievance({ is_resolved: !data?.is_resolved });
  toast.success(...);
} catch (error) {
  toast.error("Failed to update grievance status");
}
```

### Loading State
- Button shows spinner with "Updating..." text
- Button is disabled during API call
- Prevents accidental multiple submissions

---

## Workflow Integration

### Typical Grievance Resolution Workflow

1. **Complaint Submitted** → `is_resolved: false`
2. **Investigation** → Staff adds findings in Findings tab
3. **Resolution Documented** → Staff adds resolution in Resolution tab
4. **Mark as Resolved** → Click "Mark as Resolved" button → `is_resolved: true`
5. **Status Updated** → Grievance shows as "Resolved" in list view

### If Grievance Needs Reopening

1. **New Information** → Additional evidence or appeal
2. **Reopen** → Click "Reopen" button → `is_resolved: false`
3. **Further Investigation** → Update findings/resolution
4. **Resolve Again** → Click "Mark as Resolved" when complete

---

## Testing Checklist

- [ ] Navigate to grievance list
- [ ] Click view on an unresolved grievance
- [ ] Go to Resolution tab
- [ ] Verify "Unresolved" badge shows in red
- [ ] Click "Mark as Resolved" button
- [ ] Verify success toast appears
- [ ] Verify page refreshes
- [ ] Verify badge now shows "Resolved" in green
- [ ] Verify button now shows "Reopen" in red
- [ ] Click "Reopen" button
- [ ] Verify grievance returns to "Unresolved" status
- [ ] Go to grievance list
- [ ] Verify status badge updated correctly

---

## Related Files

1. `/src/features/hr/components/grievance-management/id/Resolutions.tsx` - Resolution tab component
2. `/src/features/hr/controllers/grievanceController.ts` - API hooks
3. `/src/features/hr/types/grieviance-management.ts` - Type definitions
4. `/src/features/hr/components/grievance-management/index.tsx` - List view (shows status)

---

## Additional Enhancements (Future)

Consider adding:
- [ ] Confirmation dialog before marking as resolved
- [ ] Reason field when reopening a grievance
- [ ] Activity log showing status change history
- [ ] Email notifications when status changes
- [ ] Bulk resolve/reopen functionality
- [ ] Filter by resolved/unresolved in list view
- [ ] Dashboard widget showing resolution metrics

---

## Impact

**Before:** Users couldn't change grievance status from UI
**After:** ✅ One-click status management with clear visual feedback

**Benefits:**
- Faster grievance processing
- Better status tracking
- Improved user experience
- Clearer workflow progression
- No need for database access to update status

---

**Status:** ✅ Feature complete and ready for testing
