# Approval Permission Streamlining Proposal

## Executive Summary

This document proposes a comprehensive system to streamline approval workflows by integrating approval permissions directly into the role creation process. This will enable administrators to assign `can_review`, `can_authorize`, and `can_approve` permissions at the role level, automatically determining which users can perform approval actions across the system.

---

## Current System Analysis

### Role & Permission Structure

**Current Implementation:**
- Roles are created with a name
- Permissions are assigned to roles by module (grouped by functionality)
- Users inherit permissions from their assigned role(s)

**Files:**
- Controller: `src/features/auth/controllers/roleController.ts`
- Types: `src/features/auth/types/permission.ts`
- Components:
  - Role Creation: `src/features/admin/components/modals/AddNewRoleModal.tsx`
  - Permission Assignment: `src/features/auth/components/Users/AssignPermission.tsx`

**Current Permission Structure:**
```typescript
interface IRole {
  id: string;
  name: string;
  permissions: Permission[]; // Grouped by module
}

interface Permission {
  module: string; // e.g., "procurement", "contracts", "hr"
  permissions: IPermission[];
}

interface IPermission {
  id: number;
  name: string;
  codename: string; // e.g., "add_purchase_request", "delete_user"
}
```

### Approval System

**Current Approval Permissions:**
```typescript
interface ApprovalInfo {
  current_user_permissions: {
    can_review: boolean;
    can_authorize: boolean;
    can_approve: boolean;
  };
}
```

**Problem:**
- Approval permissions (`can_review`, `can_authorize`, `can_approve`) are **NOT** currently in the permission system
- They are hardcoded or manually checked in each approval workflow
- No centralized way to assign approval permissions from role creation

---

## Proposed Solution

### Option 1: Add Approval Permissions as Special Module ⭐ **RECOMMENDED**

Create a dedicated "Approvals" module in the permission system with three key permissions.

#### Implementation Steps:

##### 1. **Backend Changes Required**

Add new permission module:
```python
# Backend: Add to permissions system
APPROVAL_PERMISSIONS = [
    {
        "module": "approvals",
        "codename": "can_review",
        "name": "Can Review Requests",
        "description": "Can review and provide initial approval for requests"
    },
    {
        "module": "approvals",
        "codename": "can_authorize",
        "name": "Can Authorize Requests",
        "description": "Can authorize requests after review"
    },
    {
        "module": "approvals",
        "codename": "can_approve",
        "name": "Can Approve Requests",
        "description": "Can give final approval for requests"
    }
]
```

##### 2. **Frontend Type Updates**

Update permission types:
```typescript
// src/features/auth/types/permission.ts

export interface IPermission {
  id: number;
  name: string;
  codename: string;
  module: string;
  description?: string;
}

export interface IRole {
  id: string;
  name: string;
  permissions: Permission[];
  // Computed approval permissions
  approval_permissions?: {
    can_review: boolean;
    can_authorize: boolean;
    can_approve: boolean;
  };
}

// Helper function to extract approval permissions from role
export function getApprovalPermissions(role: IRole): {
  can_review: boolean;
  can_authorize: boolean;
  can_approve: boolean;
} {
  const approvalModule = role.permissions.find(p => p.module === 'approvals');

  return {
    can_review: approvalModule?.permissions.some(p => p.codename === 'can_review') || false,
    can_authorize: approvalModule?.permissions.some(p => p.codename === 'can_authorize') || false,
    can_approve: approvalModule?.permissions.some(p => p.codename === 'can_approve') || false,
  };
}
```

##### 3. **Update Permission Assignment UI**

Enhance the permission assignment modal to highlight approval permissions:

```typescript
// src/features/auth/components/Users/AssignPermission.tsx

// Add special section for approval permissions
const ApprovalPermissionsSection = ({ selectedPermissions, onSelectPermission }) => {
  const approvalPermissions = permission?.data?.find(
    (p) => p.module === 'approvals'
  )?.permissions || [];

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg text-blue-900">
          Approval Permissions
        </h3>
      </div>
      <p className="text-sm text-blue-700 mb-3">
        These permissions control who can review, authorize, and approve requests across the system.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {approvalPermissions.map((permission) => (
          <PermissionCheckbox
            key={permission.id}
            permission={permission}
            checked={selectedPermissions.includes(permission.id)}
            onChange={() => onSelectPermission(permission.id)}
            highlighted={true}
          />
        ))}
      </div>
    </div>
  );
};
```

##### 4. **Create User Permission Hook**

Create a centralized hook to check user's approval permissions:

```typescript
// src/hooks/useUserApprovalPermissions.ts

import { useGetCurrentUser } from "@/features/auth/controllers/userController";
import { getApprovalPermissions } from "@/features/auth/types/permission";

export function useUserApprovalPermissions() {
  const { data: currentUser } = useGetCurrentUser();

  const approvalPermissions = useMemo(() => {
    if (!currentUser?.role) {
      return {
        can_review: false,
        can_authorize: false,
        can_approve: false,
      };
    }

    // If user has multiple roles, combine permissions
    if (Array.isArray(currentUser.roles)) {
      const allPermissions = currentUser.roles.map(getApprovalPermissions);
      return {
        can_review: allPermissions.some(p => p.can_review),
        can_authorize: allPermissions.some(p => p.can_authorize),
        can_approve: allPermissions.some(p => p.can_approve),
      };
    }

    return getApprovalPermissions(currentUser.role);
  }, [currentUser]);

  return {
    ...approvalPermissions,
    canPerformAnyApproval: Object.values(approvalPermissions).some(Boolean),
  };
}
```

##### 5. **Update Approval Workflows**

Update all approval components to use the new permission system:

```typescript
// Example: src/features/procurement/components/purchase-request/ApprovalFlow.tsx

import { useUserApprovalPermissions } from "@/hooks/useUserApprovalPermissions";

export function ApprovalFlow({ approvalInfo }) {
  const userPermissions = useUserApprovalPermissions();

  const canApprove = useMemo(() => {
    const { next_action_required } = approvalInfo;

    return (
      (next_action_required === 'review' && userPermissions.can_review) ||
      (next_action_required === 'authorise' && userPermissions.can_authorize) ||
      (next_action_required === 'approve' && userPermissions.can_approve)
    );
  }, [approvalInfo, userPermissions]);

  return (
    <div>
      {canApprove && (
        <Button onClick={handleApprove}>
          Approve
        </Button>
      )}
    </div>
  );
}
```

##### 6. **Filter Users by Approval Permissions**

Create utility to filter users who can approve:

```typescript
// src/utils/approvalFilters.ts

import { IUser } from "@/features/auth/types/user";
import { getApprovalPermissions } from "@/features/auth/types/permission";

export function filterUsersWithReviewPermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.role) return false;
    const permissions = getApprovalPermissions(user.role);
    return permissions.can_review;
  });
}

export function filterUsersWithAuthorizePermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.role) return false;
    const permissions = getApprovalPermissions(user.role);
    return permissions.can_authorize;
  });
}

export function filterUsersWithApprovePermission(users: IUser[]): IUser[] {
  return users.filter(user => {
    if (!user.role) return false;
    const permissions = getApprovalPermissions(user.role);
    return permissions.can_approve;
  });
}

// Usage in forms
export function getReviewerOptions(allUsers: IUser[]) {
  return filterUsersWithReviewPermission(allUsers).map(user => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.id,
  }));
}

export function getAuthorizerOptions(allUsers: IUser[]) {
  return filterUsersWithAuthorizePermission(allUsers).map(user => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.id,
  }));
}

export function getApproverOptions(allUsers: IUser[]) {
  return filterUsersWithApprovePermission(allUsers).map(user => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.id,
  }));
}
```

##### 7. **Update All Approval Forms**

Apply the filters to all forms that have approval workflows:

```typescript
// Example: Contract Request Form
// src/features/contracts-grants/components/contract-management/contract-request/create.tsx

import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions,
} from "@/utils/approvalFilters";

export default function CreateContractRequest() {
  const { data: user } = useGetAllUsers({ page: 1, size: 2000000 });
  const allUsers = user?.data.results || [];

  // Filter users by approval permissions
  const reviewerOptions = useMemo(() => getReviewerOptions(allUsers), [allUsers]);
  const authorizerOptions = useMemo(() => getAuthorizerOptions(allUsers), [allUsers]);
  const approverOptions = useMemo(() => getApproverOptions(allUsers), [allUsers]);

  return (
    <form>
      <FormSelect
        label='Reviewer'
        name='current_reviewer'
        placeholder='Select reviewer'
        required
        options={reviewerOptions}
      />

      <FormSelect
        label='Authorizer'
        name='authorizer'
        placeholder='Select authorizer (optional)'
        options={authorizerOptions}
      />

      <FormSelect
        label='Approver'
        name='approver'
        placeholder='Select approver (optional)'
        options={approverOptions}
      />
    </form>
  );
}
```

---

### Option 2: Add Approval Flags to User Model

Add approval flags directly to user profiles (simpler but less flexible).

#### Implementation:

```typescript
// User model
interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: IRole;
  // Add approval flags
  can_review: boolean;
  can_authorize: boolean;
  can_approve: boolean;
}
```

**Pros:**
- Simpler to implement
- Direct user-level control

**Cons:**
- ❌ Less flexible (requires updating each user)
- ❌ Doesn't leverage existing permission system
- ❌ Harder to manage at scale
- ❌ No role-based inheritance

---

### Option 3: Hybrid Approach

Combine both options - permissions at role level with user-level overrides.

**Use Case:**
- Role gives default approval permissions
- Individual users can be granted or revoked specific approval rights

```typescript
interface IUser {
  role: IRole; // Inherits permissions from role
  permission_overrides?: {
    can_review?: boolean; // Override role permission
    can_authorize?: boolean;
    can_approve?: boolean;
  };
}
```

---

## Recommended Implementation: Option 1 ⭐

### Why Option 1 is Best:

1. **✅ Leverages Existing System**
   - Uses current role & permission infrastructure
   - No new concepts to learn
   - Follows existing patterns

2. **✅ Scalability**
   - Easy to manage approval permissions for many users
   - Changes to role automatically apply to all users with that role
   - Centralized permission management

3. **✅ Flexibility**
   - Can create specialized approval roles (e.g., "Reviewer Only", "Full Approver")
   - Users can have multiple roles with different approval levels
   - Easy to audit who has what approval permissions

4. **✅ Maintainability**
   - Single source of truth for approval permissions
   - Changes in one place affect the entire system
   - Easy to troubleshoot permission issues

5. **✅ User Experience**
   - Admins can see approval permissions during role creation
   - Clear visual indication in permission UI
   - Filtered dropdowns only show users with appropriate permissions

---

## Implementation Roadmap

### Phase 1: Backend Setup (Backend Team) 🔧

**Week 1:**
1. Add "approvals" module to permission system
2. Create three permissions: `can_review`, `can_authorize`, `can_approve`
3. Update role API to include approval permissions in response
4. Add migration to create approval permissions
5. Test permission assignment and retrieval

**Deliverables:**
- New permission module in database
- API endpoints return approval permissions
- Documentation for frontend team

### Phase 2: Frontend Type System (Week 1) 📝

**Tasks:**
1. Update `src/features/auth/types/permission.ts`
2. Add `getApprovalPermissions()` helper function
3. Create `useUserApprovalPermissions()` hook
4. Update role and user interfaces
5. Add TypeScript types for approval filters

**Files to Update:**
- `src/features/auth/types/permission.ts`
- `src/hooks/useUserApprovalPermissions.ts` (new)

### Phase 3: Permission UI Enhancement (Week 1-2) 🎨

**Tasks:**
1. Update AssignPermission component
2. Add special section for approval permissions
3. Add visual indicators (icons, colors)
4. Add tooltips explaining each approval level
5. Test permission assignment flow

**Files to Update:**
- `src/features/auth/components/Users/AssignPermission.tsx`

### Phase 4: Approval Utilities (Week 2) 🔧

**Tasks:**
1. Create `src/utils/approvalFilters.ts`
2. Implement user filtering functions
3. Add option generation helpers
4. Write unit tests
5. Document utility functions

**Files to Create:**
- `src/utils/approvalFilters.ts`

### Phase 5: Update Approval Workflows (Week 2-3) 🔄

**Tasks:**
1. Update all approval flow components
2. Replace hardcoded permission checks
3. Use `useUserApprovalPermissions()` hook
4. Test approval actions
5. Verify permission enforcement

**Files to Update:**
- `src/features/procurement/components/purchase-request/ApprovalFlow.tsx`
- `src/features/procurement/hooks/usePurchaseRequestApproval.ts`
- All other approval workflow components

### Phase 6: Update Forms with Filtered Dropdowns (Week 3-4) 📋

**Tasks:**
1. Identify all forms with approval workflows
2. Update each form to use approval filters
3. Replace user dropdowns with filtered options
4. Add help text explaining why some users don't appear
5. Test all forms

**Forms to Update:**
- Contract Request (`src/features/contracts-grants/components/contract-management/contract-request/create.tsx`)
- Purchase Request
- Expense Authorization
- Payment Request
- Travel Expense Report
- Fund Request
- Activity Memo
- Asset Request
- Item Requisition
- And 10+ other forms

### Phase 7: Testing & Documentation (Week 4) ✅

**Tasks:**
1. End-to-end testing of approval flows
2. Test permission assignment
3. Test user filtering
4. Create user documentation
5. Create admin guide
6. Record demo videos

**Deliverables:**
- Test report
- User documentation
- Admin guide
- Demo videos

---

## Usage Examples

### Creating an Approval Role

**Admin Workflow:**

1. Navigate to Users → Roles
2. Click "Create New Role"
3. Enter role name: "Department Manager"
4. Click "Assign Permissions"
5. In the **Approval Permissions** section (highlighted in blue):
   - ✅ Check "Can Review Requests"
   - ✅ Check "Can Authorize Requests"
   - ❌ Leave "Can Approve Requests" unchecked
6. Select other module permissions as needed
7. Click "Save & Continue"

**Result:**
- All users with "Department Manager" role can now review and authorize requests
- They will appear in reviewer and authorizer dropdowns
- They won't appear in approver dropdowns (no final approval permission)

### Assigning User to Approval Role

**Admin Workflow:**

1. Navigate to Users
2. Select a user
3. Click "Assign Role"
4. Select "Department Manager"
5. Click "Assign"

**Result:**
- User immediately inherits approval permissions
- User can now review and authorize requests
- User appears in appropriate approval dropdowns

### Creating a Request (User Perspective)

**Before:**
```
Reviewer dropdown: Shows ALL 500+ users (including vendors)
Authorizer dropdown: Shows ALL 500+ users
Approver dropdown: Shows ALL 500+ users
```

**After:**
```
Reviewer dropdown: Shows only 25 users with "Can Review" permission
Authorizer dropdown: Shows only 15 users with "Can Authorize" permission
Approver dropdown: Shows only 5 users with "Can Approve" permission
```

---

## Benefits

### For Administrators

1. **Centralized Management**
   - Create approval roles once
   - Assign to multiple users
   - Change permissions in one place

2. **Clear Audit Trail**
   - See who has approval permissions
   - Track permission changes
   - Generate permission reports

3. **Flexible Configuration**
   - Create custom approval hierarchies
   - Different approval levels per department
   - Easy to adjust as organization grows

### For Users

1. **Cleaner Interface**
   - Filtered dropdowns (fewer options)
   - Only see relevant approvers
   - Faster request creation

2. **Clear Permissions**
   - Users know if they can approve
   - Clear indication of approval level
   - No confusion about authority

3. **Better Security**
   - Can't assign requests to unauthorized users
   - Permission checks at multiple levels
   - Audit trail of approval actions

---

## Technical Considerations

### Performance

**Concern:** Filtering users by permissions could be slow with many users.

**Solution:**
- Cache approval permissions on user object
- Backend pre-computes `can_review`, `can_authorize`, `can_approve` flags
- Frontend filters cached data

### Backward Compatibility

**Concern:** Existing approval workflows might break.

**Solution:**
- Phase implementation gradually
- Default all existing users to full approval permissions initially
- Migrate permissions module by module

### Multi-Role Support

**Question:** What if a user has multiple roles?

**Answer:**
- User gets union of all permissions from all roles
- If ANY role has `can_approve`, user can approve
- More permissive approach for flexibility

---

## Alternative Architectures Considered

### 1. Permission Matrix
Store approvals in a matrix:
```
User → Module → Approval Level
```

**Rejected:** Too complex, doesn't leverage existing permission system

### 2. Approval Levels (1-3)
Single "approval_level" field:
```typescript
user.approval_level = 3; // Can review, authorize, and approve
user.approval_level = 2; // Can review and authorize only
user.approval_level = 1; // Can review only
```

**Rejected:** Less flexible, hard to extend, doesn't match existing permission model

### 3. Dynamic Approval Rules
Rule-based system:
```
If user.department == "Finance" AND user.designation == "Manager"
  THEN can_approve = true
```

**Rejected:** Too complex for initial implementation, consider for v2

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Permission Assignment Time**
   - Target: < 2 minutes to assign approval permissions to a role
   - Measure: Admin task completion time

2. **User Dropdown Size**
   - Target: 80% reduction in dropdown options
   - Before: 500+ users in each dropdown
   - After: 5-50 users per dropdown (depending on permission)

3. **Approval Permission Errors**
   - Target: 0 permission errors after implementation
   - Measure: Error logs and user reports

4. **Admin Satisfaction**
   - Target: 90%+ satisfaction with permission management
   - Measure: Survey after 1 month

---

## Risks & Mitigation

### Risk 1: Breaking Existing Workflows

**Impact:** High
**Probability:** Medium

**Mitigation:**
- Extensive testing before rollout
- Phase implementation (one module at a time)
- Rollback plan ready
- Default all existing users to full permissions initially

### Risk 2: User Confusion

**Impact:** Medium
**Probability:** Medium

**Mitigation:**
- Clear documentation
- Training sessions for admins
- In-app tooltips and help text
- Support tickets monitored closely

### Risk 3: Performance Issues

**Impact:** Medium
**Probability:** Low

**Mitigation:**
- Backend caches approval permissions
- Frontend caches user lists
- Lazy loading for large user lists
- Performance monitoring

---

## Conclusion

Implementing approval permissions at the role level provides a **scalable**, **maintainable**, and **user-friendly** solution to streamline approval workflows across the AHNI system.

**Next Steps:**
1. Review and approve this proposal
2. Coordinate with backend team for Phase 1
3. Create project tickets in task management system
4. Begin Phase 2 (Frontend Type System)
5. Regular progress updates and demos

**Estimated Timeline:** 4 weeks for full implementation
**Estimated Effort:** 80-100 hours (frontend + backend + testing)

---

**Document Created:** 2025-10-13
**Created By:** Claude Code
**Status:** 📋 **PROPOSAL** - Awaiting Review & Approval
