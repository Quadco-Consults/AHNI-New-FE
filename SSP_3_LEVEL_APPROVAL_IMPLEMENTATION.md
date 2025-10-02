# SSP 3-Level Approval Implementation Summary

## Overview
Implemented a complete 3-level approval workflow for Supportive Supervision Plans (SSP) that allows users to select approvers during SSP creation and ensures sequential approval from Level 1 → Level 2 → Level 3.

## Frontend Changes

### 1. SSP Schema & Types (`src/features/programs/types/program/plan/supervision-plan/supervision-plan.ts`)

**Added Fields to Schema:**
```typescript
export const SSPCompositionSchema = z.object({
    // ... existing fields
    level1_approver: z.string().min(1, "Level 1 approver is required"),
    level2_approver: z.string().min(1, "Level 2 approver is required"),
    level3_approver: z.string().min(1, "Level 3 approver is required"),
});
```

**New Interface for Approval Levels:**
```typescript
export interface IApprovalLevel {
    id: string;
    level: number;
    approver: IUser;
    status: "PENDING" | "APPROVED" | "REJECTED";
    comments?: string;
    approval_date?: string;
    created_datetime: string;
}
```

**Updated Supervision Plan Data Interface:**
```typescript
export interface TSupervisionPlanSingleData {
    // ... existing fields
    level1_approver?: IUser;
    level2_approver?: IUser;
    level3_approver?: IUser;
    approvals?: IApprovalLevel[];
    current_approval_level?: number;
}
```

### 2. SSP Composition Form (`src/features/programs/components/plan/ssp/Composition.tsx`)

**Added Approver Selection Fields:**
- Level 1 Approver (required)
- Level 2 Approver (required)
- Level 3 Approver (required)

**Features:**
- User dropdown showing: `FirstName LastName (email)`
- Clear instructions: "Approvals must be completed in order (Level 1 → Level 2 → Level 3)"
- Pre-populates approvers when editing existing SSP
- Stores approver selections in session storage for multi-step form

**Updated Default Values:**
```typescript
defaultValues: {
    // ... existing fields
    level1_approver: "",
    level2_approver: "",
    level3_approver: "",
}
```

### 3. Approval Controller (`src/features/programs/controllers/supervisionPlanController.ts`)

**New Approval Hook:**
```typescript
export const useApproveSupervisionPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      comments,
    }: {
      action: "approve" | "reject";
      comments?: string;
    }) => {
      const response = await AxiosWithToken.post(
        `${BASE_URL}${id}/approve/`,
        { action, comments }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supervision-plans"] });
      queryClient.invalidateQueries({ queryKey: ["supervision-plan", id] });
    },
  });
};
```

**Error Handling:**
- 404: Supervision plan not found
- 403: Permission denied (not the correct approver for current level)
- 400: Cannot approve at this time (workflow validation)

**New Approval Status Hook:**
```typescript
export const useGetSupervisionPlanApprovalStatus = (id: string) => {
  return useQuery({
    queryKey: ["supervision-plan-approval-status", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(
        `${BASE_URL}${id}/approval-status/`
      );
      return response.data;
    },
    enabled: !!id,
  });
};
```

### 4. Approval Modal (`src/features/programs/components/modals/SspApproveModal.tsx`)

**Completely Redesigned:**

**New Features:**
1. **Current Approval Level Display**
   - Shows which level is currently pending approval
   - Displays current approver's name and email

2. **Previous Approvals History**
   - Shows all completed approval levels
   - Color-coded: Green for approved, Red for rejected
   - Displays approver comments

3. **Approval/Rejection Actions**
   - Two-button choice (Approve/Reject)
   - Optional comments field
   - Submit button disabled until action is selected

4. **Loading State**
   - Fetches supervision plan data on open
   - Shows loading spinner while fetching

**Key Components:**
```typescript
// Alert showing current approval level
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>
    <p>Current Approval Level: Level {currentLevel}</p>
    <p>Approver: {approver.name} ({approver.email})</p>
  </AlertDescription>
</Alert>

// Previous approvals display
{approvals.map((approval) => (
  <div className={getColorByStatus(approval.status)}>
    <p>Level {approval.level}: {approval.approver.name} - {approval.status}</p>
    {approval.comments && <p>{approval.comments}</p>}
  </div>
))}
```

### 5. Approval Status Page (`src/features/programs/components/plan/ssp/[id]/ApprovalStatus.tsx`)

**Changed from Mock Data to Real API Data:**

**Before:** Hardcoded 5 mock approvers
**After:** Dynamically shows 3 approvers from SSP data

**Features:**
- Fetches approval status from API
- Transforms data to ApprovalInfo format for ApprovalDisplay component
- Shows current approval level
- Displays approval timeline
- Shows pending/approved/rejected status for each level

**Data Transformation:**
```typescript
const approvals: ApprovalInfo[] = useMemo(() => {
  const plan = supervisionPlan.data;
  const approvalsList: ApprovalInfo[] = [];

  // Level 1
  if (plan.level1_approver) {
    const level1Approval = plan.approvals?.find((a) => a.level === 1);
    approvalsList.push({
      name: `${plan.level1_approver.first_name} ${plan.level1_approver.last_name}`,
      email: plan.level1_approver.email,
      status: level1Approval?.status || "PENDING",
      level: "Level 1",
      comments: level1Approval?.comments || "",
    });
  }
  // ... Level 2 & 3 similar

  return approvalsList;
}, [supervisionPlan]);
```

### 6. Table Actions Update (`src/features/programs/components/table-columns/plan/supportive-supervision-plan.tsx`)

**Fixed Approve Button:**
```typescript
<Button
  onClick={() => {
    dispatch(
      openDialog({
        type: DialogType.SspApproveModal,
        dialogProps: {
          header: "Approve Supportive Supervision Plan",
          width: "max-w-2xl",
          id: id, // ← Now passes SSP ID to modal
        },
      })
    );
  }}
>
  <ApproveIcon />
  Approve
</Button>
```

## How It Works

### User Flow:

1. **Create SSP**
   - Navigate to SSP Composition page
   - Fill in facility, team members, dates
   - **NEW:** Select Level 1, 2, and 3 approvers
   - Continue to checklist and save

2. **Approval Process**
   - SSP starts at Level 1 (current_approval_level = 1)
   - Level 1 approver clicks "Approve" in table actions
   - Modal opens showing:
     - Current level: Level 1
     - Current approver info
     - Approve/Reject buttons
   - After Level 1 approval, moves to Level 2
   - After Level 2 approval, moves to Level 3
   - After Level 3 approval, SSP is fully approved

3. **View Approval Status**
   - Click "Approval Status" in table menu
   - See timeline of all 3 approval levels
   - View approver details, status, comments
   - Track current approval level

### Approval Workflow Logic:

```
SSP Created
    ↓
Level 1 Approver Reviews
    ↓
[APPROVED] → Level 2 Approver Reviews
    ↓
[APPROVED] → Level 3 Approver Reviews
    ↓
[APPROVED] → SSP Fully Approved

[REJECTED] at any level → SSP Rejected (workflow stops)
```

### Backend API Endpoints Expected:

1. **POST** `/programs/plans/supportive-supervision/{id}/approve/`
   - Request: `{ action: "approve" | "reject", comments?: string }`
   - Logic:
     - Check current_approval_level
     - Verify user is the approver for current level
     - Create approval record
     - If approved: increment current_approval_level
     - If rejected: mark SSP as rejected
   - Response: Updated supervision plan with new approval status

2. **GET** `/programs/plans/supportive-supervision/{id}/approval-status/`
   - Returns approval history and current level
   - Response:
     ```json
     {
       "current_approval_level": 2,
       "approvals": [
         {
           "id": "...",
           "level": 1,
           "approver": { "id": "...", "first_name": "...", ... },
           "status": "APPROVED",
           "comments": "Looks good",
           "approval_date": "2025-10-02T10:00:00Z"
         }
       ]
     }
     ```

3. **POST/PUT** `/programs/plans/supportive-supervision/`
   - Now accepts: `level1_approver`, `level2_approver`, `level3_approver`
   - Creates supervision plan with approvers assigned

## Files Created
1. `SSP_3_LEVEL_APPROVAL_IMPLEMENTATION.md` - This documentation

## Files Modified
1. `src/features/programs/types/program/plan/supervision-plan/supervision-plan.ts`
2. `src/features/programs/components/plan/ssp/Composition.tsx`
3. `src/features/programs/controllers/supervisionPlanController.ts`
4. `src/features/programs/components/modals/SspApproveModal.tsx`
5. `src/features/programs/components/plan/ssp/[id]/ApprovalStatus.tsx`
6. `src/features/programs/components/table-columns/plan/supportive-supervision-plan.tsx`

## Backend Requirements

The backend needs to implement:

1. **Database Schema Updates:**
   ```python
   class SupervisionPlan(models.Model):
       # ... existing fields
       level1_approver = models.ForeignKey(User, related_name='ssp_level1_approvals')
       level2_approver = models.ForeignKey(User, related_name='ssp_level2_approvals')
       level3_approver = models.ForeignKey(User, related_name='ssp_level3_approvals')
       current_approval_level = models.IntegerField(default=1)

   class SupervisionPlanApproval(models.Model):
       supervision_plan = models.ForeignKey(SupervisionPlan, related_name='approvals')
       level = models.IntegerField()  # 1, 2, or 3
       approver = models.ForeignKey(User)
       status = models.CharField(choices=[('PENDING', 'Pending'), ('APPROVED', 'Approved'), ('REJECTED', 'Rejected')])
       comments = models.TextField(null=True, blank=True)
       approval_date = models.DateTimeField(null=True, blank=True)
       created_datetime = models.DateTimeField(auto_now_add=True)
   ```

2. **Approval Endpoint Logic:**
   ```python
   @action(detail=True, methods=['post'])
   def approve(self, request, pk=None):
       supervision_plan = self.get_object()
       action = request.data.get('action')  # 'approve' or 'reject'
       comments = request.data.get('comments', '')

       current_level = supervision_plan.current_approval_level

       # Get the approver for current level
       approver_field = f'level{current_level}_approver'
       expected_approver = getattr(supervision_plan, approver_field)

       # Verify user is the correct approver
       if request.user != expected_approver:
           return Response(
               {"message": "You are not authorized to approve at this level"},
               status=403
           )

       # Create or update approval record
       approval, created = SupervisionPlanApproval.objects.get_or_create(
           supervision_plan=supervision_plan,
           level=current_level,
           defaults={'approver': request.user}
       )

       approval.status = 'APPROVED' if action == 'approve' else 'REJECTED'
       approval.comments = comments
       approval.approval_date = timezone.now()
       approval.save()

       # Update supervision plan
       if action == 'approve' and current_level < 3:
           supervision_plan.current_approval_level = current_level + 1
       elif action == 'approve' and current_level == 3:
           supervision_plan.status = 'APPROVED'
       else:  # rejected
           supervision_plan.status = 'REJECTED'

       supervision_plan.save()

       return Response({"message": "Success"})
   ```

## Testing Checklist

### ✅ SSP Creation
- [ ] Can select Level 1 approver
- [ ] Can select Level 2 approver
- [ ] Can select Level 3 approver
- [ ] Form validation requires all approvers
- [ ] Approvers saved correctly to database

### ✅ Approval Modal
- [ ] Modal shows current approval level
- [ ] Modal shows current approver info
- [ ] Shows previous approval history
- [ ] Can select Approve or Reject
- [ ] Can add comments
- [ ] Submit button disabled until action selected
- [ ] Success notification on submit
- [ ] Modal closes after successful approval

### ✅ Approval Workflow
- [ ] Level 1 approver can approve at level 1
- [ ] Other users cannot approve at level 1
- [ ] After level 1 approval, moves to level 2
- [ ] Level 2 approver can approve at level 2
- [ ] After level 2 approval, moves to level 3
- [ ] Level 3 approver can approve at level 3
- [ ] After level 3 approval, SSP marked as fully approved
- [ ] Rejection at any level stops workflow

### ✅ Approval Status Page
- [ ] Shows all 3 approval levels
- [ ] Shows correct approver for each level
- [ ] Shows current approval level
- [ ] Shows approval status (Pending/Approved/Rejected)
- [ ] Shows approval dates
- [ ] Shows approver comments
- [ ] Timeline displays correctly

## Future Enhancements

1. **Email Notifications**
   - Notify approver when their level is ready
   - Notify creator when SSP is approved/rejected

2. **Delegation**
   - Allow approvers to delegate to another user

3. **Approval History Export**
   - Export approval timeline to PDF

4. **Bulk Approval**
   - Approve multiple SSPs at once (for same approver)

5. **Conditional Approvals**
   - Skip levels based on SSP value/type
   - Auto-approve for certain conditions

---
**Implementation Date:** 2025-10-02
**Developer:** Claude Code
