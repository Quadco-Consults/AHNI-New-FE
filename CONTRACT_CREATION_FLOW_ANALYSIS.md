# Contract Creation Flow Analysis - Review/Authorization/Approval Role Selection

## Overview
The current contract creation implementation has two active files and follows a multi-step form pattern with validation. The system needs enhancement to add role selection fields for review, authorization, and final approval workflows.

---

## Current Contract Creation Components

### 1. Main Files
- **Primary Create Form**: `/src/features/contracts-grants/components/contract-management/agreement/create.tsx`
- **Refactored Multi-Step Form**: `/src/features/contracts-grants/components/contract-management/agreement/create-refactored.tsx`
- **Summary/Final Page**: `/src/features/contracts-grants/components/contract-management/agreement/summary.tsx`

### 2. Type Definitions & Validation
- **File**: `/src/features/contracts-grants/types/contract-management/agreement.ts`
- **Current Fields**: 
  - `service_type` (Job Category)
  - `service` (Service Category)
  - `subcategory` (Optional)
  - `type` (Agreement Type: CONSULTANT, FACILITATOR, ADHOC_STAFF, SLA, etc.)
  - `start_date`
  - `end_date`
  - `contract_cost`
  - `location`
  - Entity fields: `consultant_id`, `facilitator_id`, `adhoc_staff_id`, `vendor_id`

### 3. Current Form Flow

#### **Option A: Basic Flow (create.tsx)**
- Single form with all fields on one page
- Cascading dropdowns for service selection
- Dynamic entity dropdown based on agreement type
- Direct form submission

#### **Option B: Multi-Step Flow (create-refactored.tsx)**
- **Step 1**: Agreement Type Selection (grouped by category)
- **Step 2**: Details Entry (entity selection, dates, costs, location)
- **Step 3**: Review & Submit
- **Step 4**: Document Upload (after creation)
- Uses `StepIndicator` component for visual progress

---

## Existing Approval Workflow System

The platform already has a mature approval workflow system for **Contract Requests** (separate from Agreements):

### Approval Workflow Components:
1. **WorkflowActions.tsx** - User actions for different workflow stages
2. **WorkflowHistory.tsx** - Visual display of workflow progress
3. **ApprovalHistory.tsx** - Comments and status change history

### Workflow Stages:
1. **DRAFT** → Submit
2. **SUBMITTED** → Start Review
3. **UNDER_REVIEW** → Complete Review
4. **REVIEWED** → Authorize
5. **AUTHORIZED** → Approve (Final)
6. **APPROVED** / **REJECTED**

### Role Fields in Contract Requests:
- `current_reviewer` / `current_reviewer_detail` - Who reviews
- `authorizer` / `authorizer_detail` - Who authorizes
- `approver` / `approver_detail` - Who gives final approval

---

## Recommendation: WHERE TO ADD ROLE SELECTION

### **BEST APPROACH: Add to Agreement Schema During Creation**

Add three new fields to the agreement creation form:

```typescript
// In AgreementSchema (agreement.ts)
export const AgreementSchema = z.object({
    // ... existing fields ...
    
    // NEW: Governance Workflow Fields
    reviewer_id: z.string().optional(),           // User who should review
    authorizer_id: z.string().optional(),         // User who should authorize
    approver_id: z.string().optional(),           // User who should give final approval
    
    // ... rest of schema ...
});
```

### **Form Integration Points**

#### **In create-refactored.tsx (Recommended - Multi-step):**

**Add to Step 2 (Details Entry)** - After entity selection, add a new subsection:

```jsx
{/* Governance Workflow Section */}
<div className="lg:col-span-2 border-t pt-6">
    <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Approval Workflow Setup (Optional)</h3>
    </div>
    
    <p className="text-sm text-gray-600 mb-6">
        Select who should review, authorize, and approve this agreement. 
        If left empty, default approvers will be notified.
    </p>
    
    {/* Reviewer Selection */}
    <FormSelect
        label="Reviewer"
        name="reviewer_id"
        placeholder="Select reviewer (optional)"
        options={userOptions}
    />
    
    {/* Authorizer Selection */}
    <FormSelect
        label="Authorizer"
        name="authorizer_id"
        placeholder="Select authorizer (optional)"
        options={userOptions}
    />
    
    {/* Approver Selection */}
    <FormSelect
        label="Final Approver"
        name="approver_id"
        placeholder="Select final approver (optional)"
        options={userOptions}
    />
</div>
```

---

## Implementation Details

### Step 1: Update Type Definitions

**File**: `src/features/contracts-grants/types/contract-management/agreement.ts`

```typescript
export const AgreementSchema = z.object({
    // ... existing fields ...
    
    // Governance workflow fields
    reviewer_id: z.string().optional().transform(val => 
        val && val.trim() !== "" ? val : undefined
    ),
    authorizer_id: z.string().optional().transform(val => 
        val && val.trim() !== "" ? val : undefined
    ),
    approver_id: z.string().optional().transform(val => 
        val && val.trim() !== "" ? val : undefined
    ),
    
    // ... rest of schema ...
});

export interface IAgreementSingleData {
    // ... existing fields ...
    
    // Governance workflow fields
    reviewer_id?: string;
    reviewer?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    
    authorizer_id?: string;
    authorizer?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
    
    approver_id?: string;
    approver?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
    };
}
```

### Step 2: Create User Selection Component

**New File**: `src/features/contracts-grants/components/contract-management/agreement/_components/ApprovalRoleSelection.tsx`

```typescript
"use client";

import { useEffect, useMemo, useState } from "react";
import FormSelect from "components/atoms/FormSelect";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";

interface ApprovalRoleSelectionProps {
    onUsersLoaded?: (users: any[]) => void;
}

export default function ApprovalRoleSelection({ onUsersLoaded }: ApprovalRoleSelectionProps) {
    const [userOptions, setUserOptions] = useState<Array<{label: string, value: string}>>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Fetch all users who can be assigned to approval roles
                const response = await AxiosWithToken.get('/auth/users/', {
                    params: {
                        page: 1,
                        size: 1000,
                        is_active: true  // Only active users
                    }
                });

                const users = response.data?.data?.results || response.data?.results || [];
                
                const options = users.map((user: any) => ({
                    label: `${user.first_name} ${user.last_name} (${user.email})`,
                    value: user.id
                }));

                setUserOptions(options);
                onUsersLoaded?.(options);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                toast.error('Failed to load users for approval workflow');
                setUserOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [onUsersLoaded]);

    return {
        userOptions,
        isLoading,
        formFields: (
            <>
                <FormSelect
                    label="Reviewer"
                    name="reviewer_id"
                    placeholder={isLoading ? "Loading users..." : "Select reviewer (optional)"}
                    options={userOptions}
                    disabled={isLoading}
                />
                
                <FormSelect
                    label="Authorizer"
                    name="authorizer_id"
                    placeholder={isLoading ? "Loading users..." : "Select authorizer (optional)"}
                    options={userOptions}
                    disabled={isLoading}
                />
                
                <FormSelect
                    label="Final Approver"
                    name="approver_id"
                    placeholder={isLoading ? "Loading users..." : "Select final approver (optional)"}
                    options={userOptions}
                    disabled={isLoading}
                />
            </>
        )
    };
}
```

### Step 3: Integrate into Create Form

**File**: `src/features/contracts-grants/components/contract-management/agreement/create-refactored.tsx`

Add user fetching:
```typescript
// Add to imports
import { Shield, Users } from "lucide-react";

// Add state for user options
const [userOptions, setUserOptions] = useState<Array<{label: string, value: string}>>([]);
const [isLoadingUsers, setIsLoadingUsers] = useState(false);

// Add useEffect to fetch users
useEffect(() => {
    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await AxiosWithToken.get('/auth/users/', {
                params: {
                    page: 1,
                    size: 1000,
                    is_active: true
                }
            });

            const users = response.data?.data?.results || response.data?.results || [];
            const options = users.map((user: any) => ({
                label: `${user.first_name} ${user.last_name} (${user.email})`,
                value: user.id
            }));

            setUserOptions(options);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUserOptions([]);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    fetchUsers();
}, []);

// Add to Step 2 (Details section), after other form fields
<div className="lg:col-span-2 border-t pt-6 mt-6">
    <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Approval Workflow Setup</h3>
    </div>
    
    <p className="text-sm text-gray-600 mb-6">
        Select who should review, authorize, and approve this agreement. 
        These assignments are optional - leave blank to notify default approvers.
    </p>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Review Stage</span>
            </div>
            <FormSelect
                label="Reviewer"
                name="reviewer_id"
                placeholder={isLoadingUsers ? "Loading..." : "Select reviewer"}
                options={userOptions}
                disabled={isLoadingUsers}
            />
        </div>
        
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Authorization Stage</span>
            </div>
            <FormSelect
                label="Authorizer"
                name="authorizer_id"
                placeholder={isLoadingUsers ? "Loading..." : "Select authorizer"}
                options={userOptions}
                disabled={isLoadingUsers}
            />
        </div>
        
        <div>
            <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Final Approval Stage</span>
            </div>
            <FormSelect
                label="Final Approver"
                name="approver_id"
                placeholder={isLoadingUsers ? "Loading..." : "Select approver"}
                options={userOptions}
                disabled={isLoadingUsers}
            />
        </div>
    </div>
</div>
```

### Step 4: Update API Payload

In the `onSubmit` function, include the new fields:

```typescript
const transformedData: any = {
    // ... existing fields ...
    
    // Add governance workflow fields
    reviewer_id: data.reviewer_id,
    authorizer_id: data.authorizer_id,
    approver_id: data.approver_id,
};
```

### Step 5: Update Summary Review

In Step 3 (Review), add display of selected reviewers:

```jsx
{/* New section in Step 3 */}
{(form.watch('reviewer_id') || form.watch('authorizer_id') || form.watch('approver_id')) && (
    <div>
        <label className="text-sm font-medium text-gray-700">Approval Workflow</label>
        <div className="mt-2 space-y-2">
            {form.watch('reviewer_id') && (
                <p className="text-sm text-gray-900">
                    Reviewer: {userOptions.find(u => u.value === form.watch('reviewer_id'))?.label}
                </p>
            )}
            {form.watch('authorizer_id') && (
                <p className="text-sm text-gray-900">
                    Authorizer: {userOptions.find(u => u.value === form.watch('authorizer_id'))?.label}
                </p>
            )}
            {form.watch('approver_id') && (
                <p className="text-sm text-gray-900">
                    Final Approver: {userOptions.find(u => u.value === form.watch('approver_id'))?.label}
                </p>
            )}
        </div>
    </div>
)}
```

---

## API Backend Expectations

The backend should:

1. Accept these new fields in the agreement creation/update endpoints
2. Store the assigned reviewer/authorizer/approver IDs
3. Optionally trigger notifications when an agreement is created with assigned reviewers
4. Allow the workflow system to use these assignments when transitioning through approval stages

Expected API payload:
```json
{
    "type": "CONSULTANT",
    "service": "Consultant Services",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "contract_cost": "500000",
    "location": "location-uuid",
    "consultant": "consultant-uuid",
    "created_by": "user-uuid",
    "reviewer_id": "reviewer-user-uuid",
    "authorizer_id": "authorizer-user-uuid",
    "approver_id": "approver-user-uuid"
}
```

---

## Implementation Path

### Phase 1: Backend Changes
- Add fields to agreement model
- Create/update database migrations
- Update API serializers to accept new fields
- Implement optional notification system

### Phase 2: Frontend Type Updates
- Update `AgreementSchema` in agreement.ts
- Update `IAgreementSingleData` interface
- Add validation for role selection (currently optional)

### Phase 3: Form Component Updates
- Update `create-refactored.tsx` with user selection section
- Add user fetch logic
- Integrate into Step 2 (Details)
- Add review display in Step 3

### Phase 4: Testing & Refinement
- Test with different role assignments
- Verify workflow progression
- Test with optional role assignments (no selection)

---

## Files That Need Modification

1. **`/src/features/contracts-grants/types/contract-management/agreement.ts`**
   - Add schema fields
   - Update interface

2. **`/src/features/contracts-grants/components/contract-management/agreement/create-refactored.tsx`**
   - Add user fetching
   - Add approval role selection section
   - Update form submission

3. **`/src/features/contracts-grants/components/contract-management/agreement/summary.tsx`**
   - Optional: Display assigned roles in summary

4. **`/src/features/contracts-grants/components/contract-management/agreement/create.tsx`**
   - Apply same changes to basic form (for consistency)

---

## Key Design Decisions

1. **Optional Fields**: Role assignments are optional - if not provided, default approval workflow applies
2. **User Fetching**: Users are fetched from `/auth/users/` endpoint at form load
3. **Active Users Only**: Only active users are shown in dropdowns
4. **Placement**: Approval section appears in Step 2 of multi-step form, after main details
5. **Display**: Users shown with name and email for clarity
6. **No Validation Required**: Users can create agreements without assigning specific reviewers

---

## Benefits of This Approach

✓ Maintains existing agreement creation workflow
✓ Leverages existing approval workflow system
✓ Allows flexible role assignment at creation time
✓ Optional - doesn't break existing flows
✓ Integrates naturally with existing contract request workflow
✓ User-friendly with clear role descriptions
✓ Scalable to support additional workflow stages if needed
