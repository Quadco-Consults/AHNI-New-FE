# Fund Request Module - Issues and Fixes

## Critical Issues Found

### 1. Route Confusion: `/fund-request/[id]`
**Current State**: This route serves TWO different purposes
- Displays project fund request summary (uses project ID)
- Should display individual fund request details (uses fund request ID)

**Files Affected**:
- `/src/app/dashboard/programs/fund-request/[id]/page.tsx`
- `/src/features/programs/components/fund-request/id/index.tsx`

**Fix**: Create separate routes
```
/dashboard/programs/fund-request/:fundRequestId/details  # Individual fund request
/dashboard/programs/project/:projectId/fund-requests     # All fund requests for a project
```

---

### 2. Missing Approvers in Preview & Submission
**Current State**: Preview page only shows "reviewer" but form has 7 approver fields

**Files Affected**:
- `/src/features/programs/components/fund-request/Fund-request-preview.tsx`

**Problems**:
- Line 46: `const { data: reviewer } = useGetSingleUser(programFundRequest?.reviewer);`
- Field `reviewer` doesn't exist in the form data
- Missing all 7 approver fields in preview display

**Fix Required**:
1. Add all approver fields to preview display
2. Fetch all approver user data
3. Display approver hierarchy clearly

---

### 3. Inconsistent Approver Field Names
**Current State**: Different field names used across components

**Create Form Fields** (`create/index.tsx`):
- `location_reviewer`
- `location_authorizer`
- `state_reviewer`
- `state_authorizer`
- `hq_reviewer`
- `hq_authorizer`
- `hq_approver`

**Preview Uses**:
- `reviewer` ❌ (doesn't exist)

**Edit Form Fields** (`edit/index.tsx`):
- Correctly uses all 7 fields ✅

**Fix**: Update preview to use correct field names

---

### 4. Broken "View Activity" Link
**Current State**: Line 187-192 in `fund-request/index.tsx`
```typescript
href={{
  pathname: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(":id", data?.project),
  search: `?fundRequestId=${data?.id}`,
}}
```

**Problem**: `data?.project` might be an object or undefined

**Fix**: Use correct ID extraction
```typescript
href={{
  pathname: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(
    ":id",
    typeof data?.project === 'object' ? data.project.id : data?.project
  ),
  search: `?fundRequestId=${data?.id}`,
}}
```

---

### 5. localStorage Dependency
**Current State**: Entire create flow depends on localStorage
- `create/index.tsx` line 187: `localStorage.setItem("programFundRequest", ...)`
- `create/summary.tsx` line 67: `localStorage.setItem("programFundRequest", ...)`
- `Fund-request-preview.tsx` line 33: `JSON.parse(localStorage.getItem("programFundRequest"))`

**Problems**:
- SSR incompatibility
- Data loss if tab closed
- Difficult debugging
- Security concerns

**Recommended Fix**: Use React Context or URL state
```typescript
// Create context
export const FundRequestContext = createContext();

// Or use URL parameters
router.push({
  pathname: '/fund-request/create/summary',
  query: { data: encodeURIComponent(JSON.stringify(formData)) }
});
```

---

### 6. Approval Workflow Status Issues
**Current State**: Commented out approval status tab (line 113-130 in `id/index.tsx`)

**Problems**:
- Users can't see approval progress
- Approval status only visible in activity view
- Inconsistent workflow visibility

**Fix**: Uncomment and fix approval status tab

---

### 7. Fund Request Type Definition Mismatch
**Pagination vs Direct Data**:
Some endpoints return:
```typescript
{ data: { results: [], pagination: {} } }  // Paginated
```
Others return:
```typescript
{ data: FundRequest }  // Direct object
```

**Fix**: Standardize API response handling

---

## Routing Structure Issues

### Current Routes (Confusing):
```
/dashboard/programs/fund-request/                    # List all fund requests
/dashboard/programs/fund-request/:id/                # Project fund requests (NOT fund request detail!)
/dashboard/programs/fund-request/:id/edit            # Edit fund request (correct)
/dashboard/programs/fund-request/:id/activity        # View fund request activity
/dashboard/programs/fund-request/:id/all-requests    # All fund requests for project
/dashboard/programs/fund-request/create/             # Create step 1
/dashboard/programs/fund-request/create/summary/     # Create step 2 (activities)
/dashboard/programs/fund-request/create/preview/     # Create step 3 (preview & submit)
```

### Recommended Routes (Clear):
```
# Fund Request Management
/dashboard/programs/fund-request/                         # List all fund requests
/dashboard/programs/fund-request/create                   # Create step 1
/dashboard/programs/fund-request/create/activities        # Create step 2
/dashboard/programs/fund-request/create/preview           # Create step 3
/dashboard/programs/fund-request/:fundRequestId           # View single fund request
/dashboard/programs/fund-request/:fundRequestId/edit      # Edit fund request
/dashboard/programs/fund-request/:fundRequestId/activity  # View activities with approvals

# Project-Related Fund Requests
/dashboard/programs/projects/:projectId/fund-requests           # All fund requests for project
/dashboard/programs/projects/:projectId/fund-requests/summary  # Project fund request summary
```

---

## Priority Fixes (High to Low)

### 🔴 CRITICAL (Must Fix Immediately):
1. **Fix approver fields in preview and submission**
   - Users creating fund requests without approvers
   - Blocks entire approval workflow

2. **Fix route confusion for [id]**
   - Users can't view individual fund request details
   - Creates 404 errors and confusion

### 🟡 HIGH (Fix Soon):
3. **Fix broken "View Activity" navigation**
   - Users can't access activity pages

4. **Replace localStorage with proper state management**
   - Data loss issues
   - SSR problems

### 🟢 MEDIUM (Fix When Possible):
5. **Uncomment and fix approval status tab**
   - Poor UX without visible workflow

6. **Standardize API response handling**
   - Prevents future bugs

---

## Testing Checklist

After fixes, test these workflows:

### Create Fund Request:
- [ ] Step 1: Fill basic info and approvers
- [ ] Step 2: Add activities
- [ ] Step 3: Preview shows ALL approvers
- [ ] Submit creates fund request WITH all approvers assigned
- [ ] Redirect to fund request list works

### View Fund Request:
- [ ] Click "View" from list navigates correctly
- [ ] Activity page shows correct fund request data
- [ ] Approver information displays correctly

### Edit Fund Request:
- [ ] Edit page loads existing data
- [ ] All approver fields are populated
- [ ] Update saves changes correctly

### Approval Workflow:
- [ ] Each approver can see pending requests
- [ ] Approval transitions through correct statuses
- [ ] Rejection workflow works

### Navigation:
- [ ] All breadcrumbs work
- [ ] Back buttons navigate correctly
- [ ] Tabs switch properly

---

## Files That Need Changes

### Immediate Changes Required:
1. `src/features/programs/components/fund-request/Fund-request-preview.tsx`
   - Add all 7 approver fields
   - Display approver information

2. `src/features/programs/components/fund-request/index.tsx`
   - Fix "View Activity" link (line 187)

3. `src/features/programs/components/fund-request/id/index.tsx`
   - Either fix to use fund request ID or rename route

### Recommended Refactoring:
4. Replace localStorage with React Context or URL params
5. Standardize API response handling
6. Create separate routes for project vs fund request views
