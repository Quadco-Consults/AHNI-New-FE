# Site Visit Architecture & Data Flow

## Current Architecture

```
User at /dashboard/programs/plan/site-visit
│
├─ Sees: SiteVisitList Component
│  ├─ Renders DataTable with:
│  │  ├─ Title, Type, Dates, Team Size, Status, Created By
│  │  ├─ Search functionality
│  │  ├─ Pagination
│  │  └─ Row click → Navigate to detail page
│  │
│  ├─ Button: "New Application" → Go to /create
│  ├─ Button: "Export" → TODO (not implemented)
│  └─ Button: "Import" → TODO (not implemented)
│
└─ Missing:
   ├─ Delete button/menu
   ├─ Edit button/link
   ├─ Approve button/link
   ├─ Status transition buttons
   └─ Action menu/context menu
```

## Detail Page Architecture

```
User at /dashboard/programs/plan/site-visit/[id]
│
├─ Sees: SiteVisitDetail Component
│  ├─ Header with:
│  │  ├─ Title + Status badge
│  │  ├─ Button: "Download" (TODO)
│  │  └─ Button: "Edit" (conditional - DRAFT/SUBMITTED only)
│  │
│  ├─ Tabs:
│  │  ├─ Overview: Location, dates, team, purpose, outcome
│  │  ├─ Details: Full information (has field mismatch issues)
│  │  ├─ Team Members: List of team members
│  │  ├─ Approvals: Shows approval status (read-only in current state)
│  │  └─ EA Details: Shows EA reference if available
│  │
│  └─ Missing:
│     ├─ Delete button
│     ├─ Approval action buttons (approve/reject)
│     ├─ Status transition UI
│     └─ Generate EA button
│
└─ Type Issues:
   └─ Component expects fields that don't match type definitions
```

## Data Flow Diagram

```
BACKEND API
├─ GET /programs/site-visits/ → List (✓ Used)
├─ GET /programs/site-visits/{id}/ → Detail (✓ Used)
├─ POST /programs/site-visits/ → Create (✓ Used)
├─ PUT /programs/site-visits/{id}/ → Update (✗ Not used from list)
├─ DELETE /programs/site-visits/{id}/ → Delete (✗ NEVER CALLED)
├─ POST /programs/site-visits/{id}/update_status/ → Status change (✗ Not used)
├─ POST /programs/site-visits/{id}/generate_eas/ → EA generation (✗ Not used from list)
│
├─ GET /programs/site-visits/{id}/approval_status/ → Approval status (Partially used)
├─ GET /programs/site-visit-approvals/?site_visit={id} → Get approvals (✗ Not used)
├─ POST /programs/site-visit-approvals/{id}/approve_action/ → Approval action (✗ Not used)
├─ POST /programs/site-visit-approvals/{id}/approve/ → Quick approve (✗ Not used)
└─ POST /programs/site-visit-approvals/{id}/reject/ → Quick reject (✗ Not used)
                     ↓
              Controller Layer (siteVisitController.ts)
              All hooks exist and are fully implemented!
                     ↓
           React Query (caching & sync)
                     ↓
           Components (Missing UI integration)
              ├─ SiteVisitList (no action buttons)
              ├─ SiteVisitDetail (no delete/approve buttons)
              ├─ ApprovalWorkflow (not used in list)
              ├─ SiteVisitApprovalStatus (only in tab)
              └─ EAGenerationWorkflow (only in detail tab)
```

## Component Dependency Tree

```
SiteVisitPage (Next.js page)
│
└─ SiteVisitList (Main component)
   ├─ useGetAllSiteVisits() [API Hook]
   ├─ DataTable (from UI library)
   │  └─ Column Definitions
   │     ├─ Title Column
   │     ├─ Type Badge Column
   │     ├─ Dates Column
   │     ├─ Team Size Column
   │     ├─ Status Badge Column
   │     └─ Created By Column
   │        (MISSING: Actions Column)
   │
   ├─ Search Input
   ├─ Pagination
   └─ Buttons:
      ├─ "New Application" → Creates a new site visit
      ├─ "Export" → TODO
      └─ "Import" → TODO

SiteVisitDetailPage (Next.js page)
│
└─ SiteVisitDetail (Main component)
   ├─ useGetSingleSiteVisit() [API Hook]
   ├─ Header Section
   │  ├─ Title + Status Badge
   │  ├─ Button: "Download" → TODO
   │  └─ Button: "Edit" → Conditional (DRAFT/SUBMITTED)
   │     (MISSING: Delete button)
   │
   ├─ Tabs Component
   │  ├─ Overview Tab
   │  │  ├─ Location Card
   │  │  ├─ Dates Card
   │  │  ├─ Team Info Card
   │  │  ├─ Purpose Card
   │  │  └─ Outcome Card
   │  │
   │  ├─ Details Tab
   │  │  └─ Detail Grid (HAS TYPE MISMATCH ISSUES)
   │  │
   │  ├─ Team Members Tab
   │  │  └─ Team Member List
   │  │
   │  ├─ Approvals Tab
   │  │  └─ SiteVisitApprovalStatus (only shows info, no buttons)
   │  │     └─ useApproveSiteVisit() [API Hook, not called]
   │  │
   │  └─ EA Details Tab (Conditional)
   │     └─ EA Information
   │
   └─ Created but not used:
      ├─ ApprovalWorkflow component
      └─ EAGenerationWorkflow component
```

## Type System Issues Diagram

```
What Backend Returns (ISiteVisit)
├─ id: string
├─ title: string
├─ visit_type: SiteVisitType
├─ start_date: string
├─ end_date: string
├─ status: SiteVisitStatus
├─ team_members_count: number
├─ created_datetime: string
└─ ... (14 more fields per type def)

What Detail Component Expects
├─ id: string
├─ title: string
├─ site_visit_type: SiteVisitType (DIFFERENT NAME!)
├─ proposed_start_date: string (FIELD NOT IN TYPE)
├─ proposed_end_date: string (FIELD NOT IN TYPE)
├─ actual_start_date: string (FIELD NOT IN TYPE)
├─ actual_end_date: string (FIELD NOT IN TYPE)
├─ location: string
├─ state: string
├─ lga: string
├─ facility: FacilityObject (NOT IN TYPE)
├─ travel_reason: string (NOT IN TYPE)
├─ expected_outcome: string (NOT IN TYPE)
├─ created_by: UserObject
├─ team_members: TeamMemberArray
└─ ... (more fields)

Result: Type checking is loose, component may fail at runtime
        because fields don't exist in actual API response
```

## Missing Features - Feature Matrix

```
┌──────────────────┬─────────────┬──────────────┬──────────────┐
│ Feature          │ List View   │ Detail View  │ In API       │
├──────────────────┼─────────────┼──────────────┼──────────────┤
│ View Details     │ Row click   │ N/A          │ ✓ useGet()   │
│ Create           │ ✓ Button    │ N/A          │ ✓ useCreate()│
│ Edit             │ ✗ Missing   │ ✓ Button     │ ✓ useUpdate()│
│ Delete           │ ✗ Missing   │ ✗ Missing    │ ✓ useDelete()│
│ Approve          │ ✗ Missing   │ ✗ Missing    │ ✓ useApprove│
│ Reject           │ ✗ Missing   │ ✗ Missing    │ ✓ useReject()│
│ Status Change    │ ✗ Missing   │ ✗ Missing    │ ✓ useStatus()│
│ Generate EA      │ ✗ Missing   │ ✗ Missing    │ ✓ useGenEA() │
│ Quick Actions    │ ✗ Missing   │ ✗ Missing    │ ✓ Multiple   │
│ Search/Filter    │ ✓ Works     │ N/A          │ ✓ Supported  │
│ Pagination       │ ✓ Works     │ N/A          │ ✓ Supported  │
│ Bulk Actions     │ ✗ Missing   │ N/A          │ ? Unknown    │
│ Export           │ TODO        │ N/A          │ ? Unknown    │
│ Import           │ TODO        │ N/A          │ ? Unknown    │
│ Download Report  │ N/A         │ TODO         │ ✓ useReport()│
└──────────────────┴─────────────┴──────────────┴──────────────┘

Legend:
✓ = Implemented
✗ = Missing
? = Unknown
TODO = Planned but not done
N/A = Not applicable
```

## Component Reuse Opportunity

```
Available Components That Could Be Integrated:

1. ApprovalWorkflow.tsx (500+ lines)
   ├─ Dialog component for approval actions
   ├─ Approval history display
   ├─ Comment handling
   └─ Could be used in:
      ├─ Detail page header
      └─ List view action menu

2. EAGenerationWorkflow.tsx (400+ lines)
   ├─ EA generation UI
   ├─ Status tracking
   └─ Could be used in:
      ├─ Detail page header
      └─ List view action menu

3. EnhancedSiteVisitDashboard.tsx (500+ lines)
   ├─ Better organization
   ├─ More features
   └─ Could replace current SiteVisitDashboard if needed

4. SiteVisitApprovalStatus.tsx (300+ lines)
   ├─ Already used in detail tab
   └─ Could be integrated into detail page header

Current State: These components exist but are underutilized
Future State: Integrate them into list and detail views properly
```

## State Management Flow

```
User Action
├─ Click row
│  └─ Router.push(/dashboard/programs/plan/site-visit/{id})
│     └─ SiteVisitDetail loads
│        └─ useGetSingleSiteVisit() fetches data
│           └─ Display in tabs
│
├─ Click "New" button
│  └─ Router.push(/dashboard/programs/plan/site-visit/create)
│     └─ SiteVisitCreate loads
│        └─ useCreateSiteVisit() on form submit
│           └─ Invalidate queries
│              └─ Navigate back to list
│
├─ Click "Edit" button (PARTIALLY IMPLEMENTED)
│  └─ Router.push(/dashboard/programs/plan/site-visit/{id}/edit)
│     └─ Component exists in [id] folder?
│        └─ Need to verify this flow
│
└─ Click "Delete" button (MISSING)
   └─ Show confirmation dialog
      └─ useDeleteSiteVisit(id) on confirm
         └─ Invalidate site-visits query
            └─ Toast notification
               └─ Back to list
```

## Error Handling & Edge Cases

```
Current Issues:
1. Type mismatch means some fields are undefined
   - Detail view tries to access fields that don't exist
   - Potential runtime errors

2. No delete confirmation
   - User could accidentally delete important data
   - No recovery mechanism shown

3. No permission checking
   - Should some users not be able to delete/approve?
   - Currently no role-based visibility

4. No loading states for actions
   - User doesn't know if action succeeded
   - Toast notifications should be added

5. No error boundaries
   - Component error could crash page
   - Need error state handling
```

## Recommended Implementation Order

```
Phase 1: FOUNDATION (Fix Types)
├─ Update ISiteVisit to include all fields detail expects
├─ Remove unused type aliases
└─ Verify all components use correct field names
   Effort: ~1 hour
   Risk: Low (just data definitions)

Phase 2: CRITICAL FEATURE (Delete)
├─ Add delete button to detail view header
├─ Add confirmation dialog
├─ Call useDeleteSiteVisit() on confirm
├─ Add toast notifications
└─ Add to list view as column action
   Effort: ~2 hours
   Risk: Medium (destructive action)

Phase 3: HIGH PRIORITY (Action Menu)
├─ Add actions column to list DataTable
├─ Create dropdown menu component
├─ Add edit/delete/view options
├─ Make approve/EA conditional
└─ Style and test
   Effort: ~2 hours
   Risk: Medium (UI complexity)

Phase 4: IMPROVE DETAIL VIEW
├─ Add action buttons in header area
├─ Make approval workflow more visible
├─ Add EA generation button
└─ Improve layout for quick access
   Effort: ~2 hours
   Risk: Low (UI improvements only)

Phase 5: POLISH (Optional)
├─ Export/import functionality
├─ Advanced filters
├─ Bulk operations
└─ Report generation
   Effort: ~3 hours per feature
   Risk: Low (optional features)
```

---

## Summary

Current State: 
- Backend: 100% complete (all endpoints exist)
- Components: 80% complete (most components built)
- UI Integration: 20% complete (only basic list works)

The gap is purely in UI integration. All the heavy lifting is done - just needs UI buttons to call existing APIs.
