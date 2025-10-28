# Contract Creation Flow - Exploration Summary

## Search Results Overview

Successfully explored the contract creation workflow to identify integration points for adding review/authorization/approval role selection fields.

---

## Key Findings

### 1. Two Active Contract Creation Forms

**Primary Implementation**: `/src/features/contracts-grants/components/contract-management/agreement/create-refactored.tsx`
- Multi-step form with 4 steps
- Step 1: Agreement Type Selection
- Step 2: Details Entry (dates, costs, entity selection)
- Step 3: Review & Confirm
- Step 4: Document Upload

**Alternative Implementation**: `/src/features/contracts-grants/components/contract-management/agreement/create.tsx`
- Single-page form with cascading dropdowns
- Used for editing or quick creation

**Summary Component**: `/src/features/contracts-grants/components/contract-management/agreement/summary.tsx`
- Final review before creation
- Displays all agreement details

### 2. Current Form Structure

**Agreement Type Options**:
- Staff Contracts: CONSULTANT, FACILITATOR, ADHOC_STAFF
- Service Agreements: SLA, SECURITY, INSURANCE, LEASE, HMO, TICKETING

**Required Fields**:
- Agreement Type (type)
- Entity Selection (consultant_id, facilitator_id, adhoc_staff_id, or vendor_id)
- Service Category (service) - for service agreements
- Start Date & End Date
- Contract Cost
- Location

**Current Validation**: 
- Handled by Zod schema in `/src/features/contracts-grants/types/contract-management/agreement.ts`
- Uses `.superRefine()` for conditional validation

### 3. Existing Approval Workflow System

The platform already has a MATURE approval workflow for Contract Requests:

**Components**:
1. `WorkflowActions.tsx` - Handles workflow transitions (Submit → Review → Authorize → Approve)
2. `WorkflowHistory.tsx` - Visual timeline of approval progress
3. `ApprovalHistory.tsx` - Comments and status changes

**Workflow Stages** (in order):
1. DRAFT
2. SUBMITTED
3. UNDER_REVIEW (assigned to reviewer)
4. REVIEWED
5. AUTHORIZED (assigned to authorizer)
6. APPROVED (assigned to approver)
7. REJECTED (at any stage)

**Role Fields in Contract Requests**:
- `current_reviewer` / `current_reviewer_detail`
- `authorizer` / `authorizer_detail`
- `approver` / `approver_detail`

### 4. Permission & Authorization System

**File**: `/src/features/contracts-grants/utils/approvalPermissions.ts`
- Helper functions to check if user can perform actions at each stage
- `canReviewContractRequest()`
- `canAuthorizeContractRequest()`
- `canApproveContractRequest()`
- `canRejectContractRequest()`

**File**: `/src/features/contracts-grants/utils/userLookup.ts`
- User caching and lookup utilities
- `cacheUser()` and `getUserFromCache()`
- Fallback mechanisms for user names

### 5. Form Component Patterns

**FormSelect Component** (`/src/components/FormSelect.tsx`):
- Standard select dropdown using React Hook Form
- Takes options array with `{label, value}` structure
- Fully integrated with form validation

**User Selection Pattern**:
- Fetch users from API endpoint
- Format as `{label: "Name (email)", value: "user-id"}`
- Filter by active status
- Implemented in multiple components (consultants, facilitators, vendors)

### 6. Integration Points Identified

#### Where to Add Role Selection:

**BEST CHOICE: Step 2 of Multi-Step Form** (`create-refactored.tsx`)
- After entity selection
- Before review step
- Grouped in a "Approval Workflow Setup" section
- 3 columns for Reviewer, Authorizer, Final Approver

**Alternative: Basic Form** (`create.tsx`)
- Could add below service/entity selections
- Less intuitive due to single-page layout
- Should apply same changes for consistency

#### API Endpoint for User Fetching:
- `/auth/users/` - Expected endpoint
- Parameters: `page`, `size`, `is_active=true`
- Returns: User list with first_name, last_name, email, id

---

## Recommended Implementation Strategy

### Architecture Pattern

Follow the existing contract request workflow pattern:

```
Agreement Creation
  ↓
  ├─ Set Governance Roles (NEW)
  │  ├─ Reviewer
  │  ├─ Authorizer
  │  └─ Final Approver
  ↓
  ├─ Store in Database (Backend)
  ↓
  ├─ Trigger Approval Workflow
  │  ├─ Notify Reviewer
  │  ├─ Wait for Review → Authorize → Approve
  │  └─ Track Status Transitions
```

### Implementation Scope

**Minimal (Phase 1)**:
1. Add 3 optional fields to agreement schema
2. Add user selection UI in Step 2
3. Pass fields to API

**Enhanced (Phase 2)**:
1. Integrate with existing approval workflow system
2. Auto-transition agreements through workflow stages
3. Send notifications to assigned reviewers
4. Display workflow history in agreement details

---

## Files & Locations

### Must Modify:
```
src/features/contracts-grants/
  ├── types/
  │   └── contract-management/
  │       └── agreement.ts                    (Add schema fields)
  │
  └── components/
      └── contract-management/
          └── agreement/
              ├── create-refactored.tsx       (Add role selection UI)
              ├── create.tsx                  (Apply same changes)
              └── summary.tsx                 (Display roles)
```

### Can Reference:
```
src/features/contracts-grants/
  ├── components/contract-management/
  │   ├── WorkflowActions.tsx              (Approval workflow pattern)
  │   ├── WorkflowHistory.tsx              (Progress visualization)
  │   └── ContractRequestDetail.tsx        (Complete example)
  │
  └── utils/
      ├── approvalPermissions.ts           (Permission checks)
      └── userLookup.ts                    (User utilities)
```

### Examples to Study:
- Contract Request creation flow (how it implements approval assignments)
- Vendor selection in agreements (how it fetches and displays users)
- FormSelect component usage patterns

---

## Data Flow Diagram

```
User Opens Create Agreement
  ↓
Step 1: Select Agreement Type
  ├─ CONSULTANT/FACILITATOR/ADHOC_STAFF (Staff Contracts)
  └─ SLA/SECURITY/INSURANCE/etc (Service Agreements)
  ↓
Step 2: Enter Details
  ├─ Select Entity (Consultant, Vendor, etc.)
  ├─ Enter Dates, Cost, Location
  │
  └─ [NEW] SELECT APPROVAL ROLES
      ├─ Fetch active users from /auth/users/
      ├─ Display as dropdown list
      ├─ Set Reviewer (Optional)
      ├─ Set Authorizer (Optional)
      └─ Set Final Approver (Optional)
  ↓
Step 3: Review & Submit
  ├─ Display all details
  ├─ Show selected approvers
  └─ Submit to API
  ↓
Step 4: Upload Documents
  ├─ Add contract files
  └─ Finish
  ↓
API Backend (Expected)
  ├─ Store agreement with role assignments
  ├─ Create approval workflow record
  ├─ Send notifications to assigned users
  └─ Track workflow transitions
```

---

## API Contract (Expected Payload)

When submitting agreement with approval roles:

```json
{
  "type": "CONSULTANT",
  "service": "Consultant Services",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "contract_cost": "500000",
  "location": "location-uuid",
  "consultant": "consultant-uuid",
  "created_by": "current-user-uuid",
  "reviewer_id": "reviewer-user-uuid",
  "authorizer_id": "authorizer-user-uuid",
  "approver_id": "approver-user-uuid"
}
```

---

## Code Examples Found

### Pattern 1: User Selection (from create-refactored.tsx)
```typescript
const [entityOptions, setEntityOptions] = useState<...>([]);
const fetchEntities = async (type: string) => {
  const response = await AxiosWithToken.get(`/contract-grants/agreements/${type}_dropdown/`);
  const entities = response.data?.data?.results || [];
  setEntityOptions(entities.map(e => ({
    label: e.label,
    value: e.value
  })));
};
```

### Pattern 2: Form Integration
```typescript
<FormSelect
  label="Consultant"
  name="consultant_id"
  placeholder="Select Consultant"
  options={entityOptions}
  required
  disabled={isLoadingEntities}
/>
```

### Pattern 3: Workflow Validation (from approvalPermissions.ts)
```typescript
export const canReviewContractRequest = (
  contractRequest: IContractRequestSingleData,
  currentUserId?: string
): boolean => {
  if (contractRequest.status !== 'SUBMITTED') return false;
  return contractRequest.current_reviewer_detail?.id === currentUserId;
};
```

---

## Reusable Components

1. **FormSelect** - Already exists, use for role selection
2. **StepIndicator** - Already exists in create-refactored.tsx
3. **useEffect + useState** - Pattern for fetching users
4. **AxiosWithToken** - API calls with authentication
5. **Toast notifications** - Error/success messages

---

## Testing Checklist

After implementation:
- [ ] User can select reviewer without selecting authorizer/approver
- [ ] All combinations of role assignments work
- [ ] Users list displays correctly (name + email)
- [ ] Form submission includes role IDs correctly
- [ ] Summary step shows selected roles
- [ ] Backend receives role IDs in payload
- [ ] Empty role selections are handled (optional fields)
- [ ] Error handling if user fetch fails

---

## Next Steps

1. **Review backend API** - Confirm `/auth/users/` endpoint format
2. **Coordinate with backend team** - Ensure agreement model accepts role IDs
3. **Implement Phase 1** - Add schema, UI, and basic integration
4. **Test thoroughly** - All role combinations and edge cases
5. **Implement Phase 2** - Workflow automation and notifications

---

## Questions for Backend Team

1. What's the exact endpoint for fetching users? (/auth/users/?)
2. What fields are available on the User model?
3. Should agreements auto-transition through workflow stages?
4. Should notifications be sent to assigned reviewers?
5. Are there permission roles that restrict who can review/authorize?
6. How should default approvers be handled if none are assigned?

---

## Documentation Created

1. **CONTRACT_CREATION_FLOW_ANALYSIS.md** - Comprehensive implementation guide
2. **EXPLORATION_SUMMARY.md** - This file

Both files are ready for developer reference and implementation.
