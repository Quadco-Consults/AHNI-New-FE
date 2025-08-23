# Missing Routes with Component Mappings

This document maps each missing route to its exact component from the old project.

## 🔴 PROGRAMS MODULE - Priority Missing Routes

### Fund Request
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/programs/fund-request/[id]` | `programs/fund-request/id/index` | Need to check component |
| `/dashboard/programs/fund-request/create/project-details` | `programs/fund-request/create/index` | Need to check component |
| `/dashboard/programs/fund-request/create/fund-request-summary` | `programs/fund-request/create/summary` | Need to check component |
| `/dashboard/programs/fund-request/create/fund-request-preview` | `programs/fund-request/Fund-request-preview` | Need to check component |
| `/dashboard/programs/fund-request/create/fund-request-preview/[id]/fund-request-activity` | `programs/fund-request/id/ViewFundRequestActivity` | Need to check component |
| `/dashboard/programs/fund-request/create/fund-request-preview/[id]/view-all-fund-request` | `programs/fund-request/id/AllFundRequestPreview` | Need to check component |

### ADHOC Management (Uses Consultant Management Components)
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/programs/adhoc-management/create-scope-of-work` | `c&g/contract-management/consultant-management/create/ScopeOfWork` | `@/features/contracts-grants/components/contract-management/consultant-management/create/ScopeOfWork` |
| `/dashboard/programs/adhoc-management/[id]/create-interview` | `c&g/contract-management/consultant-management/id/CreateInterview` | `@/features/contracts-grants/components/contract-management/consultant-management/id/CreateInterview` |
| `/dashboard/programs/adhoc-management/[id]/applicant/create` | `c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff` | `@/features/contracts-grants/components/contract-management/consultant-management/id/applicants/CreateConsultancyStaff` |
| `/dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/details` | `c&g/contract-management/consultant-management/id/applicants/ConsultancyStaffDetails` | `@/features/contracts-grants/components/contract-management/consultant-management/id/applicants/ConsultancyStaffDetails` |
| `/dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/adhoc-interview` | `c&g/contract-management/consultant-management/id/ApplicantInterview` | `@/features/contracts-grants/components/contract-management/consultant-management/id/ApplicantInterview` |
| `/dashboard/programs/adhoc/adhoc-acceptance/details` | `c&g/contract-management/consultant-acceptance/id` | Need to check if component exists |

### Supportive Supervision Plan (SSP)
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/programs/plan/supportive-supervision-plan/[id]/approval-status` | `programs/plan/ssp/[id]/ApprovalStatus` | `@/features/programs/components/plan/ssp/[id]/ApprovalStatus` |
| `/dashboard/programs/plan/supportive-supervision-plan/[id]/evaluation` | `programs/plan/ssp/[id]/EvaluationCriteriaProcess` | `@/features/programs/components/plan/ssp/[id]/EvaluationCriteriaProcess` |
| `/dashboard/programs/plan/supportive-supervision-plan/create/facility&team-composition` | `programs/plan/ssp/Composition` | `@/features/programs/components/plan/ssp/Composition` |
| `/dashboard/programs/plan/supportive-supervision-plan/create/evolution-checklist` | `programs/plan/ssp/EvaluationCheckList` | `@/features/programs/components/plan/ssp/EvaluationCheckList` |
| `/dashboard/programs/plan/supportive-supervsion-plan/[supervisionPlanId]/view-evaluation` | `programs/plan/ssp/[id]/EvaluationDetails` | `@/features/programs/components/plan/ssp/[id]/EvaluationDetails` |

### Stakeholder Management
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/programs/stakeholder-management/analysis&mapping/[id]` | Not found in routes file | Need to check if component exists |
| `/dashboard/programs/stakeholder-management/analysis&mapping/create-analysis/[id]` | Not found in routes file | Need to check if component exists |
| `/dashboard/programs/stakeholder-management/stakeholder-register/edit-stakeholder/[id]` | Not found in routes file | Need to check if component exists |

### Others
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/programs/plan/value-management-plan` | Not found in routes file | Component doesn't exist |
| `/dashboard/programs/payment-request` | Not found in routes file | Need to check if component exists |
| `/dashboard/programs/training-and-procurement` | Not found in routes file | Need to check if component exists |

## 🔴 ADMIN MODULE - Missing Routes

### Inventory Management
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/admin/inventory-management/asset-request/summary` | `admin/asset-request/create` | Need to check component |
| `/dashboard/admin/inventory-management/asset-request/uploads` | `admin/asset-request/create/uploads` | Need to check component |
| `/dashboard/admin/inventory-management/create-assets` | `admin/assets/create` | Need to check component |
| `/dashboard/admin/inventory-management/view-assets` | `admin/assets/id` | Need to check component |
| `/dashboard/admin/inventory-management/good-receive-note/create/uploads` | `admin/good-receive-note/create/uploads` | Need to check component |

### Payment Request
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/admin/payment-request/create/summary` | `admin/payment-request/create` | Need to check component |
| `/dashboard/admin/payment-request/create/uploads` | `admin/payment-request/create/uploads` | Need to check component |

### Overview
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/admin/overview` | `admin/Overview` | Need to check component |

## 🔴 PROCUREMENT MODULE - Missing Routes

### Overview & Reports
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/procurement/overview` | `procurement-management/Overview` | Need to check component |
| `/dashboard/procurement/report` | Not found in routes file | Need to check if component exists |

### Purchase Request
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/procurement/payment-request` | `procurement-management/Payment-request` | Need to check component |
| `/dashboard/procurement/purchase-request/pending` | Not found in routes file | Need to check if component exists |
| `/dashboard/procurement/purchase-request/[id]` | Not found in routes file | Need to check if component exists |
| `/dashboard/procurement/purchase-request/form` | Not found in routes file | Need to check if component exists |

### Procurement Plan
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/procurement/procurement-plan/financial-year` | `procurement-management/procurement-plan/id/financial-year` | Need to check component |
| `/dashboard/procurement/procurement-plan/create/procurement-plan` | `procurement-management/procurement-plan/create-procurement/forms/ProcurementPlansForm` | Need to check component |
| `/dashboard/procurement/procurement-plan/create/procurement-milestones` | `procurement-management/procurement-plan/create-procurement/forms/ProcurementMilestonesForm` | Need to check component |

### RFQ/RFP Solicitation
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/procurement/solicitation/rfq/create/quotation` | `procurement-management/solicitation-management/RFQ/create/Quotation` | Need to check component |
| `/dashboard/procurement/solicitation/rfq/create/items` | `procurement-management/solicitation-management/RFQ/create/Items` | Need to check component |
| `/dashboard/procurement/solicitation/rfq/[id]` | `procurement-management/solicitation-management/RFQ/[id]` | Need to check component |

### Competitive Bid Analysis
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/procurement/competitive-bid-analysis/selection` | `procurement-management/competitive-bid-analysis/Selection` | Need to check component |
| `/dashboard/procurement/competitive-bid-analysis/[id]/check-approval` | `procurement-management/competitive-bid-analysis/[id]/CheckApproval` | Need to check component |
| `/dashboard/procurement/competitive-bid-analysis/[id]/financial-bid-opening` | `procurement-management/competitive-bid-analysis/[id]/FinancialBiding` | Need to check component |
| `/dashboard/procurement/competitive-bid-analysis/[id]/summary-of-technical-prequalification` | `procurement-management/competitive-bid-analysis/[id]/SummaryOfTechnicalPrequalification` | Need to check component |

### Vendor Management
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/procurement/vendor-management/eoi-vendor` | `procurement-management/vendor-management/eoi/EOI-vendor` | Need to check component |

## 🔴 HR MODULE - Missing Routes

### Advertisement/Recruitment
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/hr/advertisement/add-advertisement` | `hr/advertisement/AddAdvertisement` | Need to check component |
| `/dashboard/hr/advertisement/[id]/submitted-applications/[appID]` | `hr/advertisement/id/SubmittedApplicationDetail` | Need to check component |
| `/dashboard/hr/advertisement/[id]/application-form` | `hr/advertisement/id/ApplicationForm` | Need to check component |
| `/dashboard/hr/advertisement/[id]/interview-form/[appID]` | `hr/advertisement/id/InterviewForm` | Need to check component |
| `/dashboard/hr/advertisement/[id]/interview-details/[appID]` | `hr/advertisement/id/InterviewDetail` | Need to check component |

### Onboarding
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/hr/onboarding/start-onboarding/[id]` | `hr/onboarding/start-onboarding/index` | Need to check component |
| `/dashboard/hr/onboarding/add-employee/employee-information/[id]` | `hr/onboarding/add-employee/EmployeeInformation` | Need to check component |
| `/dashboard/hr/onboarding/add-employee/additional-information/[id]` | `hr/onboarding/add-employee/AdditionalInformation` | Need to check component |
| `/dashboard/hr/onboarding/add-employee/beneficiary-designation/[id]` | `hr/onboarding/add-employee/Beneficiary` | Need to check component |
| `/dashboard/hr/onboarding/add-employee/id-card-information/[id]` | `hr/onboarding/add-employee/IdCardInformation` | Need to check component |
| `/dashboard/hr/onboarding/add-employee/salary-account-details/[id]` | `hr/onboarding/add-employee/Salary` | Need to check component |
| `/dashboard/hr/onboarding/add-employee/pension-scheme-enrolment/[id]` | `hr/onboarding/add-employee/Pension` | Need to check component |

### Workforce
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/hr/workforce-database/create` | `hr/workforce-database/create/index` | Need to check component |
| `/dashboard/hr/workforce-database/[id]` | `hr/workforce-database/id/index` | Need to check component |

### Grievance
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/hr/grievance-management/create` | `hr/grievance-management/form/index` | Need to check component |
| `/dashboard/hr/grievance-management/[id]` | `hr/grievance-management/id/index` | Need to check component |

## 🔴 C&G MODULE - Missing Routes

### Consultancy
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/c-and-g/consultancy/application-details` | `c&g/contract-management/consultant-management/create/ApplicationDetails` | Need to check component |
| `/dashboard/c-and-g/consultancy/create/scope-of-work` | `c&g/contract-management/consultant-management/create/ScopeOfWork` | Need to check component |
| `/dashboard/c-and-g/consultancy/[id]/applicant/create` | `c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff` | Need to check component |

### Facilitator Management
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/c-and-g/facilitator-management/create/application-details` | `c&g/contract-management/consultant-management/create/ApplicationDetails` | Reuses consultant component |
| `/dashboard/c-and-g/facilitator-management/create/scope-of-work` | `c&g/contract-management/consultant-management/create/ScopeOfWork` | Reuses consultant component |
| `/dashboard/c-and-g/facilitator-management/[id]` | `c&g/contract-management/consultant-management/id/ConsultancyDetails` | Reuses consultant component |
| `/dashboard/c-and-g/facilitator-management/[id]/applicant/create` | `c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff` | Reuses consultant component |

### Sub Grant
| Route | Component Path | Component Import |
|-------|---------------|------------------|
| `/dashboard/c-and-g/sub-grant/create-sub-grant` | `c&g/sub-grant/awards/create` | Need to check component |
| `/dashboard/c-and-g/sub-grant/[id]` | `c&g/sub-grant/advert/id` | Need to check component |
| `/dashboard/c-and-g/sub-grant/manual-submission/organization-details/[id]` | `c&g/sub-grant/awards/id/submission/create` | Need to check component |
| `/dashboard/c-and-g/sub-grant/manual-submission/document-upload/[id]` | `c&g/sub-grant/awards/id/submission/create/upload` | Need to check component |

## 📝 IMPLEMENTATION STRATEGY

1. **First Priority - Programs Module (Critical for business)**:
   - Fund Request workflow pages
   - ADHOC management pages (reuse consultant components)
   - SSP evaluation pages
   - Stakeholder management pages

2. **Second Priority - HR Module**:
   - Onboarding workflow pages
   - Advertisement/recruitment detail pages
   - Grievance management pages

3. **Third Priority - Procurement Module**:
   - RFQ/RFP solicitation pages
   - Competitive bid analysis pages
   - Vendor management pages

4. **Fourth Priority - Admin Module**:
   - Payment request workflow
   - Asset management pages
   - Overview dashboard

5. **Fifth Priority - C&G Module**:
   - Facilitator management (reuse consultant components)
   - Sub grant workflow pages

## 🔍 COMPONENTS TO CHECK

Before implementing, we need to verify if these components exist in the new project's features directory:
1. Fund request components in `/src/features/programs/components/fund-request/`
2. SSP components in `/src/features/programs/components/plan/ssp/`
3. HR onboarding components in `/src/features/hr/components/onboarding/`
4. Procurement components in `/src/features/procurement/components/`
5. Admin overview component in `/src/features/admin/components/`