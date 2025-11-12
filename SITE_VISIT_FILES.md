# Site Visit Feature - Complete File Listing

## Pages (Next.js)

### List View
**File**: `/src/app/dashboard/programs/plan/site-visit/page.tsx`
- Simple wrapper that renders `SiteVisitList` component
- No additional logic

### Detail View
**File**: `/src/app/dashboard/programs/plan/site-visit/[id]/page.tsx`
- Simple wrapper that renders `SiteVisitDetail` component
- No additional logic

### Create View
**File**: `/src/app/dashboard/programs/plan/site-visit/create/page.tsx`
- Renders `SiteVisitCreate` component
- Form for creating new site visits

## Components

### Main Components

**SiteVisitList** (THE MAIN LIST VIEW)
- File: `/src/features/programs/components/plan/site-visit/index.tsx`
- Size: 275 lines
- Status: Functional but missing action buttons
- What it does:
  - Displays paginated list of site visits
  - Search functionality
  - Status badges
  - Type badges
  - Row click navigation to detail
- What it's missing:
  - Delete buttons
  - Edit buttons
  - Approve buttons
  - Action menu/context menu
  - Status transition links
- **PRIORITY**: HIGH - This is where users expect to find actions

**SiteVisitDetail** (THE DETAIL PAGE)
- File: `/src/features/programs/components/plan/site-visit/[id]/index.tsx`
- Size: 383 lines
- Status: Mostly complete but missing key actions
- What it does:
  - Displays full site visit details in tabs
  - Shows team members
  - Shows approval status
  - Edit button (conditional)
- What it's missing:
  - Delete button
  - Approval action buttons (approve/reject)
  - Status transition UI
  - EA generation button
  - Download/print functionality
- **PRIORITY**: HIGH - Users expect these buttons here

**SiteVisitCreate** (THE CREATE FORM)
- File: `/src/features/programs/components/plan/site-visit/create.tsx`
- Size: 400+ lines (partial read)
- Status: Implemented
- What it does:
  - Full form for creating site visits
  - Team member selection
  - Facility selection
  - Staff selection

### Supporting Components (UNDERUTILIZED)

**ApprovalWorkflow** (ADVANCED APPROVAL SYSTEM)
- File: `/src/features/programs/components/plan/site-visit/ApprovalWorkflow.tsx`
- Size: 500+ lines
- Status: Fully implemented but barely used
- What it does:
  - Approval dialog
  - Approval history
  - Send reminders
  - Comment handling
  - Multiple approval type support
- Current use: Only in detail view tab
- **Could be integrated into**: List view action menu, detail view header

**SiteVisitApprovalStatus** (APPROVAL STATUS DISPLAY)
- File: `/src/features/programs/components/plan/site-visit/SiteVisitApprovalStatus.tsx`
- Size: 300+ lines
- Status: Implemented with some buttons
- What it does:
  - Shows approval status
  - Has approve/reject buttons (but not well integrated)
  - Shows comments
- Current use: Approval tab in detail view
- **Issues**: Buttons may not be visible or prominent enough

**EAGenerationWorkflow** (EA GENERATION)
- File: `/src/features/programs/components/plan/site-visit/EAGenerationWorkflow.tsx`
- Size: 400+ lines
- Status: Fully implemented but barely used
- What it does:
  - EA generation logic
  - Team member cost calculations
  - EA tracking
- Current use: Only in detail view tab
- **Could be integrated into**: Detail view header as button

**TeamMemberManagement** (TEAM MEMBER MANAGEMENT)
- File: `/src/features/programs/components/plan/site-visit/TeamMemberManagement.tsx`
- Size: 400+ lines
- Status: Fully implemented
- What it does:
  - Add/remove team members
  - Cost calculations
  - Role assignments
- Current use: Create/edit forms

**EnhancedSiteVisitForm** (ENHANCED FORM)
- File: `/src/features/programs/components/plan/site-visit/EnhancedSiteVisitForm.tsx`
- Size: 700+ lines
- Status: Fully implemented
- What it does:
  - Complete form with all fields
  - Validation
  - Team member integration
  - Better UX than basic form
- Current use: Used in create flow
- **Note**: Might be used for edit flow too

**EnhancedSiteVisitDashboard** (ENHANCED DASHBOARD)
- File: `/src/features/programs/components/plan/site-visit/EnhancedSiteVisitDashboard.tsx`
- Size: 500+ lines
- Status: Implemented but not used
- What it does:
  - Better organization than basic list
  - More features/insights
  - Different layout
- Current use: NOT USED - could replace SiteVisitList
- **Consideration**: Evaluate if this should replace current list

**SiteVisitDashboard** (BASIC DASHBOARD)
- File: `/src/features/programs/components/plan/site-visit/SiteVisitDashboard.tsx`
- Size: 300+ lines
- Status: Implemented but not used
- What it does:
  - Basic dashboard view
  - Stats and overview
- Current use: NOT USED
- **Status**: Unclear if this should be used

**PlannedVisitSelector** (UTILITY COMPONENT)
- File: `/src/features/programs/components/plan/site-visit/PlannedVisitSelector.tsx`
- Size: 400+ lines
- Status: Helper component
- What it does:
  - Selects from planned visits
  - Used in creation flow

**SiteVisitPlannedVisitLinker** (UTILITY COMPONENT)
- File: `/src/features/programs/components/plan/site-visit/SiteVisitPlannedVisitLinker.tsx`
- Size: 300+ lines
- Status: Helper component
- What it does:
  - Links site visits to planned visits
  - Used in creation flow

## Type Definitions

**File**: `/src/features/programs/types/site-visit.ts`
- Size: 416 lines
- Status: Well-structured but has issues
- Contains:
  - 5 main enums (Type, Status, Role, ApprovalType, ApprovalStatus)
  - 5 main interfaces (ISiteVisit, TeamMember, Approval, etc.)
  - Zod validation schema
  - Status transition rules
- **Issues**:
  - Naming inconsistencies
  - Missing fields that detail view expects
  - Field naming mismatches

### Specific Type Issues

**Location**: Line 105-153 in site-visit.ts
```typescript
interface ISiteVisit {
  // Has:
  visit_type: SiteVisitType;  // But detail expects site_visit_type
  start_date: string;         // But detail expects proposed_start_date
  end_date: string;           // But detail expects proposed_end_date
  
  // Missing:
  // proposed_start_date
  // proposed_end_date
  // actual_start_date
  // actual_end_date
  // facility: TFacilityData
  // travel_reason
  // expected_outcome
  // state
  // lga
}
```

## Controllers/Hooks

**File**: `/src/features/programs/controllers/siteVisitController.ts`
- Size: 688 lines
- Status: FULLY COMPLETE - All API methods implemented
- Contains 40+ hooks for:
  - **CRUD**: useGet, useCreate, useUpdate, useDelete
  - **Status**: useUpdateStatus
  - **Approvals**: useApprove, useReject, useQuickApprove, useQuickReject
  - **EA**: useGenerateEAs, useGenerateTeamMemberEA
  - **Team**: useAddTeamMember, useRemoveTeamMember
  - **Dashboard**: useGetDashboard, useGetApprovalDashboard
  - **History**: useGetApprovalHistory
  - **Reminders**: useSendApprovalReminder

### Available Hooks (ALL FUNCTIONAL)

#### CRUD Operations
```
useGetAllSiteVisits() - List with filters ✓ USED
useGetSingleSiteVisit() - Get detail ✓ USED
useCreateSiteVisit() - Create new ✓ USED
useUpdateSiteVisit() - Edit existing ✗ NOT USED
useDeleteSiteVisit() - Delete ✗ NEVER CALLED (CRITICAL)
useUpdateSiteVisitStatus() - Change status ✗ NOT USED
```

#### Approval Operations
```
useGetSiteVisitApprovalStatus() - Get status ✓ PARTIALLY USED
useGetSiteVisitApprovals() - List approvals ✗ NOT USED
useApprovalAction() - Approve/reject/revise ✗ NOT USED
useQuickApprove() - Quick approve ✗ NOT USED
useQuickReject() - Quick reject ✗ NOT USED
useGetMyPendingApprovals() - My approvals ✗ NOT USED
useGetPendingApprovals() - All pending ✗ NOT USED
```

#### EA Operations
```
useGenerateEAsFromSiteVisit() - Generate EAs ✗ NOT USED
useGenerateTeamMemberEA() - Generate for member ✗ NOT USED
```

#### Team Member Operations
```
useGetSiteVisitTeamMembers() - List team ✓ POSSIBLY USED
useAddTeamMember() - Add member ✓ PROBABLY USED
useRemoveTeamMember() - Remove member ✗ NOT USED
useGetMyVisitsAsTeamMember() - My visits ✗ NOT USED
```

#### Dashboard & Utility
```
useGetSiteVisitDashboard() - Dashboard stats ✗ NOT USED
useGetApprovalDashboard() - Approval stats ✗ NOT USED
useGetApprovalHistory() - View history ✓ PROBABLY USED
useSendApprovalReminder() - Send reminder ✗ NOT USED
useGetSiteVisitReport() - Get report ✗ NOT USED
useCreateSiteVisitReport() - Create report ✗ NOT USED
```

**SUMMARY**: Out of ~30 hooks, only ~5 are actively used. 20+ are not exposed in UI.

## Related Components (In Different Folders)

### Supervision Evaluation (For Comparison)
- File: `/src/app/dashboard/programs/plan/supervision-evaluation/page.tsx`
- Shows better patterns for modal-based creation
- Has similar approval workflow
- Useful for comparing implementation patterns

### Evaluation Components
- Location: `/src/features/programs/components/evaluation/`
- Files:
  - `SupervisionEvaluationDashboard.tsx`
  - `SupervisionEvaluationForm.tsx`
  - `SupervisionEvaluationDetails.tsx`
- Shows how to structure similar features

## Folder Structure

```
/src
├─ app/dashboard/programs/plan/
│  └─ site-visit/
│     ├─ page.tsx (Main list page)
│     ├─ create/
│     │  └─ page.tsx
│     └─ [id]/
│        └─ page.tsx (Detail page)
│
└─ features/programs/
   ├─ components/plan/site-visit/
   │  ├─ index.tsx (SiteVisitList)
   │  ├─ create.tsx (SiteVisitCreate)
   │  ├─ [id]/index.tsx (SiteVisitDetail)
   │  ├─ ApprovalWorkflow.tsx
   │  ├─ SiteVisitApprovalStatus.tsx
   │  ├─ EAGenerationWorkflow.tsx
   │  ├─ TeamMemberManagement.tsx
   │  ├─ EnhancedSiteVisitForm.tsx
   │  ├─ EnhancedSiteVisitDashboard.tsx
   │  ├─ SiteVisitDashboard.tsx
   │  ├─ PlannedVisitSelector.tsx
   │  └─ SiteVisitPlannedVisitLinker.tsx
   │
   ├─ types/
   │  └─ site-visit.ts
   │
   └─ controllers/
      └─ siteVisitController.ts
```

## External Dependencies

### UI Components Used
- `/components/ui/button`
- `/components/ui/dialog`
- `/components/ui/tabs`
- `/components/ui/badge`
- `/components/ui/input`
- `/components/ui/textarea`
- `/components/ui/select`
- `/components/Table/DataTable`
- `/components/Pagination`
- `/components/Breadcrumb`

### API/Query Libraries
- `react-query` (useQuery, useMutation, useQueryClient)
- `axios` (via AxiosWithToken)
- `react-hook-form` (form management)
- `zod` (validation)

### Icons
- `lucide-react` (all icons)

### Other
- `sonner` (toast notifications)

## Documentation Files Created

1. `/SITE_VISIT_INVESTIGATION.md` - Complete detailed investigation (12 sections)
2. `/SITE_VISIT_SUMMARY.md` - Quick reference summary (what, why, how to fix)
3. `/SITE_VISIT_ARCHITECTURE.md` - Architecture diagrams and data flows
4. `/SITE_VISIT_FILES.md` - This file (complete file listing)

## Quick Reference: What to Modify

### To Add Delete Functionality
1. **File**: `/src/features/programs/components/plan/site-visit/index.tsx`
   - Add delete button in DataTable
   - Create delete handler with confirmation dialog
   - Call `useDeleteSiteVisit()` hook

2. **File**: `/src/features/programs/components/plan/site-visit/[id]/index.tsx`
   - Add delete button in header
   - Create delete handler with confirmation dialog
   - Call `useDeleteSiteVisit()` hook
   - Navigate back on success

### To Add Action Menu
1. **File**: `/src/features/programs/components/plan/site-visit/index.tsx`
   - Add new "Actions" column to DataTable
   - Create dropdown menu component
   - Add options: View, Edit, Delete, Approve, Generate EA

### To Fix Type Issues
1. **File**: `/src/features/programs/types/site-visit.ts`
   - Update `ISiteVisit` interface
   - Add missing fields
   - Fix naming inconsistencies
   - Ensure all component expectations are met

### To Improve Detail View
1. **File**: `/src/features/programs/components/plan/site-visit/[id]/index.tsx`
   - Integrate `ApprovalWorkflow` into header
   - Add delete button
   - Add EA generation button
   - Move critical actions out of tabs

## Next Steps

1. Read `/SITE_VISIT_SUMMARY.md` for quick understanding
2. Read `/SITE_VISIT_INVESTIGATION.md` for complete details
3. Read `/SITE_VISIT_ARCHITECTURE.md` for visual understanding
4. Use this file as a reference for which files to modify
5. Start with Phase 1 (Fix Types) then Phase 2 (Add Delete)

---

Total Files Involved: 15+ components/pages
Total Code Size: ~5000+ lines (excluding node_modules)
Ready to Implement: Yes - all infrastructure is in place
