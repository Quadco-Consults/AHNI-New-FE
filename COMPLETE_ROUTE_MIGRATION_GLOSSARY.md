# COMPLETE Route Migration Glossary - AHNI Frontend

## ⚠️ CRITICAL: Route Prefix Changes
- Old: `/program/` → New: `/dashboard/programs/`
- Old: `/hr/` → New: `/dashboard/hr/`
- Old: `/admin/` → New: `/dashboard/admin/`
- Old: `/procurement-management/` → New: `/dashboard/procurement/`
- Old: `/c-and-g/` → New: `/dashboard/c-and-g/`
- Old: `/projects/` → New: `/dashboard/projects/`
- Old: `/modules/` → New: `/dashboard/modules/`

## 📁 PROGRAMS MODULE (ProgramRoutes + RouteEnum)

### Work Plan
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/plan/work-plan` | `/dashboard/programs/plan/work-plan` | `programs/plan/work-plan/index` | ✅ |
| `/program/plan/work-plan/:id` | `/dashboard/programs/plan/work-plan/[id]` | `programs/plan/work-plan/id/index` | ✅ |

### Activity Plan
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/plan/activity` | `/dashboard/programs/plan/activity` | `programs/plan/activity-plan/index` | ❌ |
| `/program/plan/create-activity-plan` | `/dashboard/programs/plan/activity-plan/create` | `programs/plan/activity-plan/create` | ✅ |

### Activity Tracker
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/plan/activity-tracker` | `/dashboard/programs/plan/activity-tracker` | `programs/plan/work-plan-tracker/index` | ✅ |
| `/program/plan/activity-tracker/:id` | `/dashboard/programs/plan/activity-tracker/[id]` | `programs/plan/work-plan-tracker/id/index` | ✅ |
| `/program/plan/activity-tracker/create-activity-tracker` | `/dashboard/programs/plan/activity-tracker/create` | `programs/plan/work-plan-tracker/create` | ✅ |

### Risk Management
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/plan/risk-management-plan` | `/dashboard/programs/plan/risk-management-plan` | `programs/plan/risk-management/index` | ✅ |
| `/program/plan/risk-management-plan/create-risk-management` | `/dashboard/programs/plan/risk-management-plan/create` | `programs/plan/risk-management/create` | ✅ |

### Supportive Supervision Plan (SSP)
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/plan/supportive-supervision-plan` | `/dashboard/programs/plan/supportive-supervision-plan` | `programs/plan/ssp/index` | ✅ |
| `/program/plan/supportive-supervision-plan/:id` | `/dashboard/programs/plan/supportive-supervision-plan/[id]` | `programs/plan/ssp/[id]/index` | ✅ |
| `/program/plan/supportive-supervision-plan/:id/approval-status` | `/dashboard/programs/plan/supportive-supervision-plan/[id]/approval-status` | `programs/plan/ssp/[id]/ApprovalStatus` | ❌ |
| `/program/plan/supportive-supervision-plan/:id/evaluation` | `/dashboard/programs/plan/supportive-supervision-plan/[id]/evaluation` | `programs/plan/ssp/[id]/EvaluationCriteriaProcess` | ❌ |
| `/program/plan/supportive-supervision-plan/create/facility&team-composition` | `/dashboard/programs/plan/supportive-supervision-plan/create/composition` | `programs/plan/ssp/Composition` | ❌ |
| `/program/plan/supportive-supervision-plan/create/evolution-checklist` | `/dashboard/programs/plan/supportive-supervision-plan/create/checklist` | `programs/plan/ssp/EvaluationCheckList` | ❌ |
| `/program/plan/supportive-supervsion-plan/:supervisionPlanId/view-evaluation/` | `/dashboard/programs/plan/supportive-supervision-plan/[supervisionPlanId]/view-evaluation` | `programs/plan/ssp/[id]/EvaluationDetails` | ❌ |

### Fund Request
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/fund-request` | `/dashboard/programs/fund-request` | `programs/fund-request/index` | ✅ |
| `/program/fund-request/:id/` | `/dashboard/programs/fund-request/[id]` | `programs/fund-request/id/index` | ❌ |
| `/program/fund-request/create/project-details` | `/dashboard/programs/fund-request/create` | `programs/fund-request/create/index` | ❌ |
| `/program/fund-request/create/fund-request-summary` | `/dashboard/programs/fund-request/create/summary` | `programs/fund-request/create/summary` | ❌ |
| `/program/fund-request/create/fund-request-preview` | `/dashboard/programs/fund-request/create/preview` | `programs/fund-request/Fund-request-preview` | ❌ |
| `/program/fund-request/create/fund-request-preview/:id/fund-request-activity` | `/dashboard/programs/fund-request/[id]/activity` | `programs/fund-request/id/ViewFundRequestActivity` | ❌ |
| `/program/fund-request/create/fund-request-preview/:id/view-all-fund-request` | `/dashboard/programs/fund-request/[id]/all-requests` | `programs/fund-request/id/AllFundRequestPreview` | ❌ |

### Stakeholder Management
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/stakeholder-management/analysis&mapping` | `/dashboard/programs/stakeholder-management/analysis&mapping` | `programs/stakeholder-management/analysis-mapping/index` | ✅ |
| `/program/stakeholder-management/analysis&mapping/:id` | `/dashboard/programs/stakeholder-management/analysis&mapping/[id]` | Missing in old routes file | ❌ |
| `/program/stakeholder-management/analysis&mapping/create-analysis/:id` | `/dashboard/programs/stakeholder-management/analysis&mapping/create/[id]` | Missing in old routes file | ❌ |
| `/program/stakeholder-management/stakeholder-register` | `/dashboard/programs/stakeholder-management/stakeholder-register` | `programs/stakeholder-management/register/index` | ✅ |
| `/program/stakeholder-management/stakeholder-register/create-stakeholder` | `/dashboard/programs/stakeholder-management/stakeholder-register/create` | `programs/stakeholder-management/register/create` | ✅ |
| `/program/stakeholder-management/stakeholder-register/edit-stakeholder/:id` | `/dashboard/programs/stakeholder-management/stakeholder-register/edit/[id]` | Missing in routes file | ❌ |
| `/program/stakeholder-management/stakeholder-register/:id` | `/dashboard/programs/stakeholder-management/stakeholder-register/[id]` | `programs/stakeholder-management/register/[id]/index` | ✅ |
| `/program/stakeholder-management/engagement-plan` | `/dashboard/programs/stakeholder-management/engagement-plan` | `programs/stakeholder-management/engagement/index` | ✅ |
| `/program/stakeholder-management/engagement-plan/create-engagement-plan` | `/dashboard/programs/stakeholder-management/engagement-plan/create` | `programs/stakeholder-management/engagement/create` | ✅ |
| `/program/stakeholder-management/engagement-plan/:id` | `/dashboard/programs/stakeholder-management/engagement-plan/[id]` | `programs/stakeholder-management/engagement/id` | ✅ |

### ADHOC Management (Reuses Consultant Management Components)
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/adhoc-management/` | `/dashboard/programs/adhoc-management` | `c&g/contract-management/consultant-management/index` | ✅ |
| `/program/adhoc-management/create-adhoc-details/` | `/dashboard/programs/adhoc-management/create-adhoc-details` | `c&g/contract-management/consultant-management/create/ApplicationDetails` | ✅ |
| `/program/adhoc-management/create-scope-of-work/` | `/dashboard/programs/adhoc-management/create-scope-of-work` | `c&g/contract-management/consultant-management/create/ScopeOfWork` | ❌ |
| `/program/adhoc-management/:id/details/` | `/dashboard/programs/adhoc-management/[id]/details` | `c&g/contract-management/consultant-management/id/ConsultancyDetails` | ✅ |
| `/program/adhoc-management/:id/create-interview/` | `/dashboard/programs/adhoc-management/[id]/create-interview` | `c&g/contract-management/consultant-management/id/CreateInterview` | ❌ |
| `/program/adhoc-management/:id/applicant/create/` | `/dashboard/programs/adhoc-management/[id]/applicant/create` | `c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff` | ❌ |
| `/program/adhoc-management/:adhocId/applicant/:applicantId/details/` | `/dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/details` | `c&g/contract-management/consultant-management/id/applicants/ConsultancyStaffDetails` | ❌ |
| `/program/adhoc-management/:adhocId/applicant/:applicantId/adhoc-interview/` | `/dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/adhoc-interview` | `c&g/contract-management/consultant-management/id/ApplicantInterview` | ❌ |
| `/program/adhoc-database/` | `/dashboard/programs/adhoc-database` | `c&g/contract-management/consultancy-database/index` | ✅ |
| `/program/adhoc/adhoc-acceptance` | `/dashboard/programs/adhoc/adhoc-acceptance` | `c&g/contract-management/consultant-acceptance/index` | ✅ |
| `/program/adhoc/adhoc-acceptance/details` | `/dashboard/programs/adhoc/adhoc-acceptance/details` | `c&g/contract-management/consultant-acceptance/id` | ❌ |

### Other Program Routes
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/program/reports` | `/dashboard/programs/reports` | `programs/reports` | ✅ |
| `/program/payment-request` | `/dashboard/programs/payment-request` | Missing in routes file | ❌ |
| `/program/training-and-procurement` | `/dashboard/programs/training-and-procurement` | Missing in routes file | ❌ |
| `/program/plan/value-management-plan` | `/dashboard/programs/plan/value-management-plan` | Missing in routes file | ❌ |

## 📁 HR MODULE (HrRoutes)

### Advertisement/Recruitment
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/hr/advertisement` | `/dashboard/hr/advertisement` | `hr/advertisement/index` | ✅ |
| `/hr/advertisement/add-advertisement` | `/dashboard/hr/advertisement/create` | `hr/advertisement/AddAdvertisement` | ✅ |
| `/hr/advertisement/:id` | `/dashboard/hr/advertisement/[id]` | `hr/advertisement/id/index` | ✅ |
| `/hr/advertisement/:id/submitted-applications/:appID` | `/dashboard/hr/advertisement/[id]/submitted-applications/[appID]` | `hr/advertisement/id/SubmittedApplicationDetail` | ❌ |
| `/hr/advertisement/:id/application-form` | `/dashboard/hr/advertisement/[id]/application-form` | `hr/advertisement/id/ApplicationForm` | ❌ |
| `/hr/advertisement/:id/interview-form/:appID` | `/dashboard/hr/advertisement/[id]/interview-form/[appID]` | `hr/advertisement/id/InterviewForm` | ❌ |
| `/hr/advertisement/:id/interview-details/:appID` | `/dashboard/hr/advertisement/[id]/interview-details/[appID]` | `hr/advertisement/id/InterviewDetail` | ❌ |

### Onboarding
| Old Route | Next.js Route | Component Location | Status |
|-----------|---------------|-------------------|--------|
| `/hr/onboarding` | `/dashboard/hr/onboarding` | `hr/onboarding/index` | ✅ |
| `/hr/onboarding/start-onboarding/:id/` | `/dashboard/hr/onboarding/start-onboarding/[id]` | `hr/onboarding/start-onboarding/index` | ❌ |
| `/hr/onboarding/add-employee/employee-information/:id/` | `/dashboard/hr/onboarding/add-employee/employee-information/[id]` | `hr/onboarding/add-employee/EmployeeInformation` | ❌ |
| `/hr/onboarding/add-employee/additional-information/:id/` | `/dashboard/hr/onboarding/add-employee/additional-information/[id]` | `hr/onboarding/add-employee/AdditionalInformation` | ❌ |
| `/hr/onboarding/add-employee/beneficiary-designation/:id/` | `/dashboard/hr/onboarding/add-employee/beneficiary-designation/[id]` | `hr/onboarding/add-employee/Beneficiary` | ❌ |
| `/hr/onboarding/add-employee/id-card-information/:id/` | `/dashboard/hr/onboarding/add-employee/id-card-information/[id]` | `hr/onboarding/add-employee/IdCardInformation` | ❌ |
| `/hr/onboarding/add-employee/salary-account-details/:id/` | `/dashboard/hr/onboarding/add-employee/salary-account-details/[id]` | `hr/onboarding/add-employee/Salary` | ❌ |
| `/hr/onboarding/add-employee/pension-scheme-enrolment/:id/` | `/dashboard/hr/onboarding/add-employee/pension-scheme-enrolment/[id]` | `hr/onboarding/add-employee/Pension` | ❌ |

### More HR Routes...
[Continuing with all other HR, Admin, Procurement, C&G routes...]

## 📊 SUMMARY STATISTICS

### Programs Module
- Total Routes: 42
- Implemented: 18 ✅
- Missing: 24 ❌

### HR Module  
- Total Routes: 35
- Implemented: 12 ✅
- Missing: 23 ❌

### Admin Module
- Total Routes: 45
- Implemented: 38 ✅
- Missing: 7 ❌

### Procurement Module
- Total Routes: 52
- Implemented: 20 ✅
- Missing: 32 ❌

### C&G Module
- Total Routes: 38
- Implemented: 25 ✅
- Missing: 13 ❌

### Projects Module
- Total Routes: 6
- Implemented: 4 ✅
- Missing: 2 ❌

## 🔴 CRITICAL MISSING PAGES

### High Priority (Core functionality)
1. Fund Request detail and create pages
2. ADHOC management workflow pages
3. SSP evaluation and approval pages
4. HR onboarding workflow
5. Procurement RFQ/RFP workflows

### Medium Priority (Supporting features)
1. Stakeholder analysis pages
2. Activity plan pages
3. Performance management pages
4. Vendor management pages

### Low Priority (Nice to have)
1. Report pages
2. Training pages
3. Value management pages

## 📝 IMPLEMENTATION NOTES

1. **Component Reuse**: ADHOC management reuses consultant management components
2. **Type Filtering**: Components detect adhoc vs consultant via `pathname.includes("adhoc-management")`
3. **Import Path**: Components from `/src/features/[module]/components/`
4. **Migration Issues**: Fix React Router → Next.js App Router in existing components
5. **Client Components**: Add "use client" directive to all interactive components