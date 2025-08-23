# MISSING ROUTES - Complete Analysis

## 🔴 ADMIN MODULE - MISSING ROUTES

### Inventory Management
- ❌ `/dashboard/admin/inventory-management/create` (CREATE_CONSUMABLE - wrong path, have `/consumable/create`)
- ❌ `/dashboard/admin/inventory-management/consumables/[id]` (VIEW_CONSUMABLE - have `/consumable/[id]`)
- ❌ `/dashboard/admin/inventory-management/asset-request/summary` (ASSETS_REQUEST_CREATE)
- ❌ `/dashboard/admin/inventory-management/asset-request/uploads` (ASSETS_REQUEST_UPLOAD)
- ❌ `/dashboard/admin/inventory-management/create-assets` (CreateAssets)
- ❌ `/dashboard/admin/inventory-management/view-assets` (ViewAssets)
- ❌ `/dashboard/admin/inventory-management/good-receive-note/create/uploads` (GRN_CREATE_UPLOADS)

### Fleet Management
- ❌ `/dashboard/admin/fleet-management/vehicle-maintenance-create` (CREATE_VEHICLE_MAINTENANCE - wrong path)

### Payment Request
- ❌ `/dashboard/admin/payment-request/create/summary` (CREATE_PAYMENT_REQUEST_SUMMARY)
- ❌ `/dashboard/admin/payment-request/create/uploads` (CREATE_PAYMENT_REQUEST_UPLOADS)

### Agreements
- ❌ `/dashboard/admin/agreements` (AGREEMENT - have `/agreement` without 's')
- ❌ `/dashboard/admin/agrements/HM0` (HMO - typo in original)
- ❌ `/dashboard/admin/agrements/SLA` (SLA)
- ❌ `/dashboard/admin/agrements/security` (Security)
- ❌ `/dashboard/admin/agrements/insurance` (Insurance)
- ❌ `/dashboard/admin/agrements/ticketing` (Ticketing)
- ❌ `/dashboard/admin/agrements/View-Aggrement` (ViewAggrement)

### Solicitation/RFQ
- ❌ `/dashboard/admin/solicitation/rfq` (RFQ - different from what exists)
- ❌ `/dashboard/admin/solicitation/rfq/create/quotation` (RFQ_CREATE_QUOTATION)
- ❌ `/dashboard/admin/solicitation/rfq/create/items` (RFQ_CREATE_ITEMS)
- ❌ `/dashboard/admin/solicitation/rfq/[id]` (RFQ_DETAILS)
- ❌ `/dashboard/admin/solicitation/rfq/create/create-cba` (RFQ_CREATE_CBA)
- ❌ `/dashboard/admin/solicitation/rfq/competitive-bid-analysis/[id]` (RFQ_COMPETITIVE_BID_ANALYSIS)
- ❌ `/dashboard/admin/solicitation/rfq/[id]/manual-bid-submission` (RFQ_DETAILS_BID_SUBMISSION)
- ❌ `/dashboard/admin/rfq-vendor` (RFQ_VENDOR)

### Purchase Order
- ❌ `/dashboard/admin/purchase-order` (PURCHASE_ORDER)
- ❌ `/dashboard/admin/purchase-order/[id]` (PURCHASE_ORDER_ID)
- ❌ `/dashboard/admin/purchase-order/[id]/terms-and-conditions` (PURCHASE_ORDER_ID_TERMS)
- ❌ `/dashboard/admin/purchase-order-new` (PURCHASE_ORDER_NEW)

### Others
- ❌ `/dashboard/admin/submission-of-bids` (SUBMISSION_OF_BIDS)
- ❌ `/dashboard/admin/price-intelligence` (PRICE_INTELLIGENCE)
- ❌ `/dashboard/admin/overview` (OVERVIEW)

### Competitive Bid Analysis
- ❌ `/dashboard/admin/competitive-bid-analysis` (COMPETITIVE_BID_ANALYSIS)
- ❌ `/dashboard/admin/competitive-bid-analysis/[id]` (COMPETITIVE_BID_ANALYSIS_DETAILS)
- ❌ `/dashboard/admin/competitive-bid-analysis/[id]/check-approval` (COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK)
- ❌ `/dashboard/admin/competitive-bid-analysis/[id]/start/[appID]` (COMPETITIVE_BID_ANALYSIS_DETAILS_START)
- ❌ `/dashboard/admin/competitive-bid-analysis/[id]/financial-bid-opening` (COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING)
- ❌ `/dashboard/admin/competitive-bid-analysis/[id]/summary-of-technical-prequalification` (SUMMARY_OF_TECHNICAL_PREQUALIFICATION)

## 🔴 PROCUREMENT MODULE - MISSING ROUTES

- ❌ `/dashboard/procurement/overview` (OVERVIEW)
- ❌ `/dashboard/procurement/competitive-bid-analysis/selection` (COMPETITIVE_SELECTION)
- ❌ `/dashboard/procurement/payment-request` (PAYMENT_REQUEST)
- ❌ `/dashboard/procurement/purchase-request/pending` (PENDING_PURCHASE_REQUEST)
- ❌ `/dashboard/procurement/purchase-request/[id]` (PURCHASE_REQUEST_DETAILS)
- ❌ `/dashboard/procurement/purchase-request/form` (PURCHASE_REQUEST_FORM)
- ❌ `/dashboard/procurement/create-purchase-request` (CREATE_PURCHASE_REQUEST)
- ❌ `/dashboard/procurement/purchase-request/activity-memo` (CREATE_SAMPLE_MEMO)
- ❌ `/dashboard/procurement/purchase-request/sample-preview` (SAMPLE_PREVIEW)
- ❌ `/dashboard/procurement/purchase-request/preview-letter` (PREVIEW_LETTER)
- ❌ `/dashboard/procurement/purchase-request/final-preview` (FINAL_PREVIEW)
- ❌ `/dashboard/procurement/procurement-plan/financial-year` (PROCUREMENT_PLAN_FINANCIAL_YEAR)
- ❌ `/dashboard/procurement/procurement-plan/create/procurement-plan` (CREATE_PROCUREMENT)
- ❌ `/dashboard/procurement/procurement-plan/create/procurement-milestones` (CREATE_PROCUREMENT_MILESTONE)
- ❌ `/dashboard/procurement/solicitation/rfq/create/quotation` (RFQ_CREATE_QUOTATION)
- ❌ `/dashboard/procurement/solicitation/rfq/create/items` (RFQ_CREATE_ITEMS)
- ❌ `/dashboard/procurement/solicitation/rfq/[id]` (RFQ_DETAILS)
- ❌ `/dashboard/procurement/solicitation/rfq/create/create-cba/[id]` (RFQ_CREATE_CBA)
- ❌ `/dashboard/procurement/solicitation/rfq/competitive-bid-analysis/[id]` (RFQ_COMPETITIVE_BID_ANALYSIS)
- ❌ `/dashboard/procurement/solicitation/rfq/[id]/manual-bid-submission` (RFQ_DETAILS_BID_SUBMISSION)
- ❌ `/dashboard/procurement/rfq-vendor` (RFQ_VENDOR)
- ❌ `/dashboard/procurement/solicitation/rfq/create/quotation/[id]` (RFQ_CREATE_QUOTATION_OPEN_TENDER)
- ❌ `/dashboard/procurement/solicitation/rfp/create/proposal` (RFP_CREATE_PROPOSAL)
- ❌ `/dashboard/procurement/solicitation/rfp/create/uploads` (RFP_CREATE_UPLOADS)
- ❌ `/dashboard/procurement/solicitation/rfp/[id]` (RFP_DETAILS)
- ❌ `/dashboard/procurement/solicitation/rfp/[id]/manual-bid-submission` (RFP_DETAILS_BID_SUBMISSION)
- ❌ `/dashboard/procurement/rfp-vendor` (RFP_VENDOR)
- ❌ `/dashboard/procurement/solicitation/rfp/create/proposal/[id]` (RFP_CREATE_PROPOSAL_OPEN_TENDER)
- ❌ `/dashboard/procurement/competitive-bid-analysis/[id]/check-approval` (COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK)
- ❌ `/dashboard/procurement/competitive-bid-analysis/[id]/start/[appID]` (COMPETITIVE_BID_ANALYSIS_DETAILS_START)
- ❌ `/dashboard/procurement/competitive-bid-analysis/[id]/financial-bid-opening` (COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING)
- ❌ `/dashboard/procurement/competitive-bid-analysis/[id]/summary-of-technical-prequalification` (SUMMARY_OF_TECHNICAL_PREQUALIFICATION)
- ❌ `/dashboard/procurement/vendor-management/eoi-vendor` (EOI_VENDOR)
- ❌ `/dashboard/procurement/vendor-management/the-company` (VENDOR_COMPANY)
- ❌ `/dashboard/procurement/vendor-management/technical-capacity` (VENDOR_TECHNICAL)
- ❌ `/dashboard/procurement/vendor-management/questionnaire` (VENDOR_QUESTIONER)
- ❌ `/dashboard/procurement/vendor-management/attestation` (VENDOR_ATTESTATION)
- ❌ `/dashboard/procurement/vendor-management/upload` (VENDOR_UPLOAD)
- ❌ `/dashboard/procurement/vendor-management/prequalification/[id]/start-prequalification` (VENDOR_MANAGEMENT_START_PREQUALIFICATION)
- ❌ `/dashboard/procurement/purchase-order/[id]` (PURCHASE_ORDER_ID)
- ❌ `/dashboard/procurement/purchase-order/[id]/terms-and-conditions` (PURCHASE_ORDER_ID_TERMS)
- ❌ `/dashboard/procurement/purchase-order-new` (PURCHASE_ORDER_NEW)
- ❌ `/dashboard/procurement/submission-of-bids` (SUBMISSION_OF_BIDS)
- ❌ `/dashboard/procurement/supplier-database/[id]` (SUPPLIER_DATABASE_DETAIL)
- ❌ `/dashboard/procurement/vendor-performance-evaluation` (VENDOR_PERFORMANCE_EVALUATION - have vendor-performance)
- ❌ `/dashboard/procurement/report` (REPORT)

## 🔴 PROGRAMS MODULE - MISSING ROUTES

### Fund Request
- ❌ `/dashboard/programs/fund-request/[id]` (PROGRAM_FUND_REQUEST_DETAILS)
- ❌ `/dashboard/programs/fund-request/create/project-details` (PROGRAM_FUND_REQUEST_CREATE)
- ❌ `/dashboard/programs/fund-request/create/fund-request-summary` (PROGRAM_FUND_REQUEST_FUND_SUMMARY)
- ❌ `/dashboard/programs/fund-request/create/fund-request-preview` (PROGRAM_FUND_REQUEST_PREVIEW)
- ❌ `/dashboard/programs/fund-request/create/fund-request-preview/[id]/fund-request-activity` (PROGRAM_FUND_REQUEST_VIEW_ACTIVITY)
- ❌ `/dashboard/programs/fund-request/create/fund-request-preview/[id]/view-all-fund-request` (PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS)

### Activity Plan
- ❌ `/dashboard/programs/plan/create-activity-plan` (PROGRAM_CREATE_ACTIVITY_PLAN - have different path)
- ❌ `/dashboard/programs/plan/activity-tracker/create-activity-tracker` (PROGRAM_ACTIVITY_TRACKER_CREATE - have different path)

### Risk Management
- ❌ `/dashboard/programs/plan/risk-management-plan/create-risk-management` (PROGRAM_RISK_MANAGEMENT_CREATE - have different path)

### Value Management
- ❌ `/dashboard/programs/plan/value-management-plan` (PROGRAM_VALUE_MANAGEMENT)

### Supportive Supervision
- ❌ `/dashboard/programs/plan/supportive-supervision-plan/[id]/approval-status` (PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL)
- ❌ `/dashboard/programs/plan/supportive-supervision-plan/[id]/evaluation` (PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT)
- ❌ `/dashboard/programs/plan/supportive-supervision-plan/create/facility&team-composition` (PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION)
- ❌ `/dashboard/programs/plan/supportive-supervision-plan/create/evolution-checklist` (PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST)
- ❌ `/dashboard/programs/plan/supportive-supervsion-plan/[supervisionPlanId]/view-evaluation` (SUPERVISION_PLAN_EVALUATION_DETAILS - typo)

### Stakeholder Management
- ❌ `/dashboard/programs/stakeholder-management/analysis&mapping/[id]` (PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_DETAILS)
- ❌ `/dashboard/programs/stakeholder-management/analysis&mapping/create-analysis/[id]` (PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_CREATE)
- ❌ `/dashboard/programs/stakeholder-management/stakeholder-register/create-stakeholder` (PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE - have different path)
- ❌ `/dashboard/programs/stakeholder-management/stakeholder-register/edit-stakeholder/[id]` (PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_EDIT)
- ❌ `/dashboard/programs/stakeholder-management/engagement-plan/create-engagement-plan` (PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_CREATE - have different path)

### ADHOC Management
- ❌ `/dashboard/programs/adhoc-management/create-scope-of-work` (CREATE_ADHOC_WORK_SCOPE)
- ❌ `/dashboard/programs/adhoc-management/[id]/create-interview` (CREATE_ADHOC_INTERVIEW)
- ❌ `/dashboard/programs/adhoc-management/[id]/applicant/create` (CREATE_ADHOC_APPLICANT)
- ❌ `/dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/details` (ADHOC_APPLICANT_DETAILS)
- ❌ `/dashboard/programs/adhoc-management/[adhocId]/applicant/[applicantId]/adhoc-interview` (ADHOC_APPLICANT_INTERVIEW)
- ❌ `/dashboard/programs/adhoc/adhoc-acceptance/details` (ADHOC_ACCEPTANCE_DETAILS)

### Others
- ❌ `/dashboard/programs/payment-request` (PROGRAM_PAYMENT_REQUEST)
- ❌ `/dashboard/programs/training-and-procurement` (TRAINING)

## 🔴 HR MODULE - MISSING ROUTES

### Advertisement
- ❌ `/dashboard/hr/advertisement/add-advertisement` (ADVERTISEMENT_ADD - have /create)
- ❌ `/dashboard/hr/advertisement/[id]/submitted-applications/[appID]` (ADVERTISEMENT_DETAIL_SUB_APP)
- ❌ `/dashboard/hr/advertisement/[id]/application-form` (ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION)
- ❌ `/dashboard/hr/advertisement/[id]/interview-form/[appID]` (ADVERTISEMENT_INTERVIEW_FORM)
- ❌ `/dashboard/hr/advertisement/[id]/interview-details/[appID]` (ADVERTISEMENT_INTERVIEW_DETAILS)

### Onboarding
- ❌ `/dashboard/hr/onboarding/start-onboarding/[id]` (ONBOARDING_START)
- ❌ `/dashboard/hr/onboarding/add-employee/employee-information/[id]` (ONBOARDING_ADD_EMPLOYEE_INFO)
- ❌ `/dashboard/hr/onboarding/add-employee/additional-information/[id]` (ONBOARDING_ADD_EMPLOYEE_ADD)
- ❌ `/dashboard/hr/onboarding/add-employee/beneficiary-designation/[id]` (ONBOARDING_ADD_EMPLOYEE_BENEFICIARY)
- ❌ `/dashboard/hr/onboarding/add-employee/id-card-information/[id]` (ONBOARDING_ADD_EMPLOYEE_ID_CARD)
- ❌ `/dashboard/hr/onboarding/add-employee/salary-account-details/[id]` (ONBOARDING_ADD_EMPLOYEE_SALARY)
- ❌ `/dashboard/hr/onboarding/add-employee/pension-scheme-enrolment/[id]` (ONBOARDING_ADD_EMPLOYEE_PENSION)

### Workforce
- ❌ `/dashboard/hr/workforce-database/create` (WORKFORCE_DATABASE_CREATE)
- ❌ `/dashboard/hr/workforce-database/[id]` (WORKFORCE_DATABASE_DETAIL)

### Employee Benefits
- ❌ `/dashboard/hr/employee-benefit/compensation/create` (EMPLOYEE_BENEFITS_COMPENSATION_CREATE)

### Grievance
- ❌ `/dashboard/hr/grievance-management/create` (GRIEVANCE_MANAGEMENT_CREATE)
- ❌ `/dashboard/hr/grievance-management/[id]` (GRIEVANCE_MANAGEMENT_DETAILS)

### Leave Management
- ❌ `/dashboard/hr/leave-management/leave-list/[id]` (LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL)
- ❌ `/dashboard/hr/leave-management/leave-settings` (LEAVE_MANAGEMENT_LEAVE_SETTINGS)

### Timesheet
- ❌ `/dashboard/hr/timesheet-management/[id]/create` (TIMESHEET_MANAGEMENT_DETAIL_CREATE)
- ❌ `/dashboard/hr/timesheet-management/create-timesheet-management` (TIMESHEET_MANAGEMENT_CREATE - have different path)

## 🔴 C&G MODULE - MISSING ROUTES

### Consultancy
- ❌ `/dashboard/c-and-g/consultancy/application-details` (CREATE_CONSULTANCY_DETAILS)
- ❌ `/dashboard/c-and-g/consultancy/create/scope-of-work` (CREATE_CONSULTANCY_WORK_SCOPE)
- ❌ `/dashboard/c-and-g/consultancy/[id]/applicant/create` (CREATE_CONSULTANCY_APPLICANT)
- ❌ `/dashboard/c-and-g/consultancy/sla` (CONSULTANCY_SLA)
- ❌ `/dashboard/c-and-g/consultant/consultance-acceptance/details` (CONSULTANT_ACCEPTANCE_DETAILS)

### Grant
- ❌ `/dashboard/c-and-g/create-grant` (GRANT_CREATE - have /grant/create)
- ❌ `/dashboard/c-and-g/grant-details/[id]` (GRANT_DETAILS - have /grant/[id])

### Sub Grant
- ❌ `/dashboard/c-and-g/sub-grant/create-sub-grant` (CREATE_SUBGRANT_ADVERT)
- ❌ `/dashboard/c-and-g/sub-grant/[id]` (SUBGRANT_ADVERT_DETAILS - conflicts with /sub-grant folder)
- ❌ `/dashboard/c-and-g/sub-grant/[id]/create-pre-award-assessment` (SUBGRANT_CREATE_PRE_AWARD_ASSESSMENT)
- ❌ `/dashboard/c-and-g/sub-grant/manual-submission/organization-details/[id]` (CREATE_SUBGRANT_SUBMISSION_DETAILS)
- ❌ `/dashboard/c-and-g/sub-grant/manual-submission/document-upload/[id]` (CREATE_SUBGRANT_SUBMISSION_UPLOADS)
- ❌ `/dashboard/c-and-g/sub-grant/[subGrantId]/submission/[partnerSubId]` (SUBGRANT_SUBMISSION_DETAILS)
- ❌ `/dashboard/c-and-g/sub-grant/[subGrantId]/submission/[partnerSubId]/preaward-assessment` (START_PRE_AWARD_ASSESSMENT)

### Facilitator Management
- ❌ `/dashboard/c-and-g/facilitator-management/create/application-details` (CREATE_FACILITATOR_ADVERT_DETAILS)
- ❌ `/dashboard/c-and-g/facilitator-management/create/scope-of-work` (CREATE_FACILITATOR_ADVERT_WORK_SCOPE)
- ❌ `/dashboard/c-and-g/facilitator-management/[id]` (FACILITATOR_ADVERT_DETAILS)
- ❌ `/dashboard/c-and-g/facilitator-management/[id]/applicant/create` (CREATE_FACILITATOR_ADVERT_APPLICANT)

## 🔴 PROJECTS MODULE - MISSING ROUTES
- ❌ `/dashboard/projects/[id]/create/summary` (PROJECTS_EDIT_SUMMARY)
- ❌ `/dashboard/projects/[id]/create/uploads` (PROJECTS_EDIT_UPLOADS)
- ❌ `/dashboard/projects/create/summary` (PROJECTS_CREATE_SUMMARY)

## 🔴 OTHERS - MISSING ROUTES
- ❌ `/dashboard/` (DASHBOARD - root dashboard)
- ❌ `/dashboard/users/create` (CREATE_USERS)
- ❌ `/dashboard/support/[id]` (SUPPORT_DETAILS)
- ❌ `/dashboard/account` (ACCOUNT)

## 📊 TOTALS BY MODULE
- **Admin**: 48 missing routes
- **Procurement**: 45 missing routes  
- **Programs**: 28 missing routes
- **HR**: 22 missing routes
- **C&G**: 17 missing routes
- **Projects**: 3 missing routes
- **Others**: 4 missing routes

## 🔴 GRAND TOTAL: 167 MISSING ROUTES