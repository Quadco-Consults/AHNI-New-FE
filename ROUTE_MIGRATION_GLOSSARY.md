# Route Migration Glossary

## Programs Module Routes

### Work Plan
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_WORK_PLAN | /dashboard/programs/plan/work-plan | pages/protectedPages/programs/plan/work-plan/index | ✅ EXISTS |
| RouteEnum.PROGRAM_WORK_PLAN_DETAILS | /dashboard/programs/plan/work-plan/[id] | pages/protectedPages/programs/plan/work-plan/id/index | ✅ EXISTS |

### Activity Plan
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_ACTIVITY | /dashboard/programs/plan/activity-plan | pages/protectedPages/programs/plan/activity-plan/index | ❌ MISSING |
| RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN | /dashboard/programs/plan/activity-plan/create | pages/protectedPages/programs/plan/activity-plan/create | ❌ MISSING |

### Work Plan Tracker
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_ACTIVITY_TRACKER | /dashboard/programs/plan/work-plan-tracker | pages/protectedPages/programs/plan/work-plan-tracker/index | ❌ MISSING |
| RouteEnum.PROGRAM_ACTIVITY_TRACKER_DETAILS | /dashboard/programs/plan/work-plan-tracker/[id] | pages/protectedPages/programs/plan/work-plan-tracker/id/index | ❌ MISSING |
| RouteEnum.PROGRAM_ACTIVITY_TRACKER_CREATE | /dashboard/programs/plan/work-plan-tracker/create | pages/protectedPages/programs/plan/work-plan-tracker/create | ❌ MISSING |

### Supportive Supervision Plan (SSP)
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION | /dashboard/programs/plan/ssp | pages/protectedPages/programs/plan/ssp/index | ❌ MISSING (have supportive-supervision-plan instead) |
| RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS | /dashboard/programs/plan/ssp/[id] | pages/protectedPages/programs/plan/ssp/[id]/index | ❌ MISSING |
| RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT | /dashboard/programs/plan/ssp/[id]/evaluation-criteria | pages/protectedPages/programs/plan/ssp/[id]/EvaluationCriteriaProcess | ❌ MISSING |
| RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL | /dashboard/programs/plan/ssp/[id]/approval-status | pages/protectedPages/programs/plan/ssp/[id]/ApprovalStatus | ❌ MISSING |
| RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION | /dashboard/programs/plan/ssp/composition | pages/protectedPages/programs/plan/ssp/Composition | ❌ MISSING |
| RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST | /dashboard/programs/plan/ssp/evaluation-checklist | pages/protectedPages/programs/plan/ssp/EvaluationCheckList | ❌ MISSING |
| ProgramRoutes.SUPERVISION_PLAN_EVALUATION_DETAILS | /dashboard/programs/plan/ssp/[id]/evaluation-details | pages/protectedPages/programs/plan/ssp/[id]/EvaluationDetails | ❌ MISSING |

### Risk Management
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_RISK_MANAGEMENT | /dashboard/programs/plan/risk-management | pages/protectedPages/programs/plan/risk-management/index | ❌ MISSING (have risk-management-plan instead) |
| RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE | /dashboard/programs/plan/risk-management/create | pages/protectedPages/programs/plan/risk-management/create | ❌ MISSING (have risk-management-plan/create instead) |

### Fund Request
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_FUND_REQUEST | /dashboard/programs/fund-request | pages/protectedPages/programs/fund-request/index | ✅ EXISTS |
| RouteEnum.PROGRAM_FUND_REQUEST_DETAILS | /dashboard/programs/fund-request/[id] | pages/protectedPages/programs/fund-request/id/index | ❌ MISSING |
| RouteEnum.PROGRAM_FUND_REQUEST_CREATE | /dashboard/programs/fund-request/create | pages/protectedPages/programs/fund-request/create/index | ❌ MISSING |
| RouteEnum.PROGRAM_FUND_REQUEST_PREVIEW | /dashboard/programs/fund-request/preview | pages/protectedPages/programs/fund-request/Fund-request-preview | ❌ MISSING |
| RouteEnum.PROGRAM_FUND_REQUEST_FUND_SUMMARY | /dashboard/programs/fund-request/create/summary | pages/protectedPages/programs/fund-request/create/summary | ❌ MISSING |
| RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS | /dashboard/programs/fund-request/[id]/all-requests | pages/protectedPages/programs/fund-request/id/AllFundRequestPreview | ❌ MISSING |
| RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY | /dashboard/programs/fund-request/[id]/view-activity | pages/protectedPages/programs/fund-request/id/ViewFundRequestActivity | ❌ MISSING |

### Stakeholder Management
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS | /dashboard/programs/stakeholder-management/analysis-mapping | pages/protectedPages/programs/stakeholder-management/analysis-mapping/index | ❌ MISSING |
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER | /dashboard/programs/stakeholder-management/register | pages/protectedPages/programs/stakeholder-management/register/index | ❌ MISSING |
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE | /dashboard/programs/stakeholder-management/register/create | pages/protectedPages/programs/stakeholder-management/register/create | ❌ MISSING |
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_DETAILS | /dashboard/programs/stakeholder-management/register/[id] | pages/protectedPages/programs/stakeholder-management/register/[id]/index | ❌ MISSING |
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN | /dashboard/programs/stakeholder-management/engagement | pages/protectedPages/programs/stakeholder-management/engagement/index | ❌ MISSING |
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_CREATE | /dashboard/programs/stakeholder-management/engagement/create | pages/protectedPages/programs/stakeholder-management/engagement/create | ❌ MISSING |
| RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_DETAILS | /dashboard/programs/stakeholder-management/engagement/[id] | pages/protectedPages/programs/stakeholder-management/engagement/id | ❌ MISSING |

### ADHOC Management (Reuses Consultant Management Components)
| Old Route | Next.js Route | Component | Status |
|-----------|---------------|-----------|--------|
| ProgramRoutes.ADHOC_MANAGEMENT | /dashboard/programs/adhoc-management | c&g/contract-management/consultant-management/index | ✅ EXISTS |
| ProgramRoutes.CREATE_ADHOC_DETAILS | /dashboard/programs/adhoc-management/create-adhoc-details | c&g/contract-management/consultant-management/create/ApplicationDetails | ✅ EXISTS |
| ProgramRoutes.CREATE_ADHOC_WORK_SCOPE | /dashboard/programs/adhoc-management/create-scope-of-work | c&g/contract-management/consultant-management/create/ScopeOfWork | ❌ MISSING |
| ProgramRoutes.ADHOC_DETAILS | /dashboard/programs/adhoc-management/[id]/details | c&g/contract-management/consultant-management/id/ConsultancyDetails | ✅ EXISTS |
| ProgramRoutes.CREATE_ADHOC_INTERVIEW | /dashboard/programs/adhoc-management/[id]/create-interview | c&g/contract-management/consultant-management/id/CreateInterview | ❌ MISSING |
| ProgramRoutes.CREATE_ADHOC_APPLICANT | /dashboard/programs/adhoc-management/[id]/applicant/create | c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff | ❌ MISSING |
| ProgramRoutes.ADHOC_APPLICANT_DETAILS | /dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/details | c&g/contract-management/consultant-management/id/applicants/ConsultancyStaffDetails | ❌ MISSING |
| ProgramRoutes.ADHOC_APPLICANT_INTERVIEW | /dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/adhoc-interview | c&g/contract-management/consultant-management/id/ApplicantInterview | ❌ MISSING |
| ProgramRoutes.ADHOC_DATABASE | /dashboard/programs/adhoc-database | c&g/contract-management/consultancy-database/index | ❌ MISSING |
| ProgramRoutes.ADHOC_ACCEPTANCE | /dashboard/programs/adhoc/adhoc-acceptance | c&g/contract-management/consultant-acceptance/index | ❌ MISSING |
| ProgramRoutes.ADHOC_ACCEPTANCE_DETAILS | /dashboard/programs/adhoc/adhoc-acceptance/details | c&g/contract-management/consultant-acceptance/id | ❌ MISSING |

## Summary
- **Total Program Routes**: 42
- **Implemented**: 6 ✅ (adhoc-management, adhoc-database, fund-request basic, work-plan basic)
- **Missing**: 36 ❌

## Critical Issues Found:
1. Many routes exist but with different naming (e.g., `risk-management-plan` instead of `risk-management`)
2. Fund request details and create pages missing despite basic page existing
3. SSP pages use different naming convention
4. Most stakeholder management pages missing
5. Activity plan and tracker pages missing

## Component Location Mapping for New Project

In the new project, components should be imported from:
- `/src/features/programs/components/` for program-specific components
- `/src/features/contracts-grants/components/contract-management/consultant-management/` for adhoc management (reuses consultant components)

## Next Steps
1. Create missing page files in `/src/app/dashboard/programs/`
2. Import the correct components from features directory
3. Ensure all components have "use client" directive
4. Fix any React Router migration issues in imported components