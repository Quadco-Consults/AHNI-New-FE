export const AuthRoutes = {
  LOGIN: "/auth/login",
};

export const AdminRoutes = {
  OVERVIEW: "/dashboard/admin/overview",

  // CONSUMABLE
  INDEX_CONSUMABLE: "/dashboard/admin/inventory-management/consumable",
  CREATE_CONSUMABLE: "/dashboard/admin/inventory-management/consumable/create",
  VIEW_CONSUMABLE:
    "/dashboard/admin/inventory-management/consumable/:id/details",

  // ASSET REQUEST
  ASSETS_REQUEST: "/dashboard/admin/inventory-management/asset-request",
  ASSETS_REQUEST_CREATE:
    "/dashboard/admin/inventory-management/asset-request/summary",
  ASSETS_REQUEST_UPLOAD:
    "/dashboard/admin/inventory-management/asset-request/uploads",
  ASSETS_REQUEST_VIEW: "/dashboard/admin/asset-request/:id",

  // ASSETS
  ASSETS: "/dashboard/admin/assets",
  CREATE_ASSETS: "/dashboard/admin/assets/create",
  VIEW_ASSETS: "/dashboard/admin/assets/:id/details",

  // VEHICLE REQUEST
  INDEX_VEHICLE_REQUEST: "/dashboard/admin/fleet-management/vehicle-request",
  CREATE_VEHICLE_REQUEST:
    "/dashboard/admin/fleet-management/vehicle-request/create",
  VIEW_VEHICLE_REQUEST: "/dashboard/admin/fleet-management/vehicle-request/:id",

  // VEHICLE
  INDEX_VEHICLE: "/dashboard/admin/fleet-management/vehicle",
  CREATE_VEHICLE: "/dashboard/admin/fleet-management/vehicle/create",
  VIEW_VEHICLE: "/dashboard/admin/fleet-management/vehicle/:id/details",

  // VEHICLE MAINTENANCE
  INDEX_VEHICLE_MAINTENANCE:
    "/dashboard/admin/fleet-management/vehicle-maintenance",
  CREATE_VEHICLE_MAINTENANCE:
    "/dashboard/admin/fleet-management/vehicle-maintenance/create",
  VIEW_VEHICLE_MAINTENANCE:
    "/dashboard/admin/fleet-management/vehicle-maintenance/:id",

  // FUEL CONSUMPTION RECORD
  INDEX_FUEL_CONSUMPTION: "/dashboard/admin/fleet-management/fuel-request",
  CREATE_FUEL_CONSUMPTION:
    "/dashboard/admin/fleet-management/fuel-request/create",
  VIEW_FUEL_CONSUMPTION: "/dashboard/admin/fleet-management/fuel-request/:id",

  // FACILITY MANAGEMENT
  INDEX_FACILITY_MANAGEMENT: "/dashboard/admin/facility-management",
  CREATE_FACILITY_MANAGEMENT: "/dashboard/admin/facility-management/create",
  VIEW_FACILITY_MANAGEMENT: "/dashboard/admin/facility-management/:id/details",

  // FACILITY MAINTENANCE TICKET
  INDEX_FACILITY_MAINTENANCE:
    "/dashboard/admin/facility-management/facility-maintenance",
  CREATE_FACILITY_MAINTENANCE:
    "/dashboard/admin/facility-management/facility-maintenance/create",
  VIEW_FACILITY_MAINTENANCE:
    "/dashboard/admin/facility-management/facility-maintenance/:id",

  // PAYMENT REQUEST
  INDEX_PAYMENT_REQUEST: "/dashboard/admin/payment-request",
  CREATE_PAYMENT_REQUEST_SUMMARY: "/dashboard/admin/payment-request/create",
  CREATE_PAYMENT_REQUEST_UPLOADS:
    "/dashboard/admin/payment-request/create/uploads",
  VIEW_PAYMENT_REQUEST: "/dashboard/admin/payment-request/:id",

  // AGREEMENT
  AGREEMENT: "/dashboard/admin/agreement",

  // ASSET MAINTENANCE
  INDEX_ASSET_MAINTENANCE: "/dashboard/admin/asset-maintenance",
  CREATE_ASSET_MAINTENANCE: "/dashboard/admin/asset-maintenance/create",
  VIEW_ASSET_MAINTENANCE: "/dashboard/admin/asset-maintenance/:id",

  // EXPENSE AUTHORIZATION
  EXPENSE_AUTHORIZATION: "/dashboard/admin/expense-authorization",
  EXPENSE_AUTHORIZATION_CREATE: "/dashboard/admin/expense-authorization/create",
  EXPENSE_AUTHORIZATION_DETAIL: "/dashboard/admin/expense-authorization",

  // TRAVEL EXPENSE REPORT
  TRAVEL_EXPENSE_REPORT: "/dashboard/admin/travel-expenses-report",
  TRAVEL_EXPENSE_REPORT_CREATE:
    "/dashboard/admin/travel-expenses-report/create",
  TRAVEL_EXPENSE_REPORT_DETAIL: "/dashboard/admin/travel-expenses-report/:id",

  // ---------------------

  /* GOOD RECEIVE NOTES START */
  GRN: "/dashboard/admin/inventory-management/good-receive-note",
  GRN_CREATE_SUMMARY:
    "/dashboard/admin/inventory-management/good-receive-note/create",
  GRN_CREATE_UPLOADS: "/dashboard/admin/good-receive-note/create/uploads",
  GRN_DETAIL: "/dashboard/admin/good-receive-note/:id",
  /* GOOD RECEIVE NOTES END */

  ITEM_REQUISITION: "/dashboard/admin/inventory-management/item-requisition",
  ITEM_REQUISITION_DETAIL:
    "/dashboard/admin/inventory-management/item-requisition/:id",
  CREATE_ITEM_REQUISITION: "/dashboard/admin/item-requisition/create",
  // "/dashboard/admin/inventory-management/item-requisition/create",

  INVENTORY_ASSETS: "/dashboard/admin/inventory-management/assets",

  HMO: "/dashboard/admin/agreement/hmo",
  SLA: "/dashboard/admin/agreement/sla",
  Security: "/dashboard/admin/agreement/security",
  Insurance: "/dashboard/admin/agreement/insurance",
  Ticketing: "/dashboard/admin/agreement/ticketing",
  ViewAggrement: "/dashboard/admin/agreement/view",

  //rfq routes
  RFQ: "/dashboard/admin/solicitation-management/rfq",
  RFQ_CREATE_QUOTATION: "/dashboard/admin/solicitation/rfq/create/quotation",
  RFQ_CREATE_ITEMS: "/dashboard/admin/solicitation/rfq/create/items",
  RFQ_DETAILS: "/dashboard/admin/solicitation/rfq/:id",
  RFQ_CREATE_CBA: "/dashboard/admin/solicitation/rfq/create/create-cba",
  RFQ_COMPETITIVE_BID_ANALYSIS:
    "/dashboard/admin/solicitation/rfq/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION:
    "/dashboard/admin/solicitation/rfq/:id/manual-bid-submission",
  RFQ_VENDOR: "/dashboard/admin/rfq-vendor",
  RFQ_CREATE_QUOTATION_OPEN_TENDER:
    "/dashboard/procurement/solicitation-management/rfq/create/quotation/:id",

  //purchase order routes
  PURCHASE_ORDER: "/dashboard/admin/purchase-order",
  PURCHASE_ORDER_ID: "/dashboard/admin/purchase-order/:id",
  PURCHASE_ORDER_ID_TERMS:
    "/dashboard/admin/purchase-order/:id/terms-and-conditions",
  PURCHASE_ORDER_NEW: "/dashboard/admin/purchase-order-new",

  SUBMISSION_OF_BIDS: "/dashboard/admin/submission-of-bids",
  PRICE_INTELLIGENCE: "/dashboard/admin/price-intelligence",

  //competitive bid analysis routes
  COMPETITIVE_BID_ANALYSIS: "/dashboard/admin/competitive-bid-analysis",
  COMPETITIVE_BID_ANALYSIS_DETAILS:
    "/dashboard/admin/competitive-bid-analysis/:id",
  COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK:
    "/dashboard/admin/competitive-bid-analysis/:id/check-approval",
  COMPETITIVE_BID_ANALYSIS_DETAILS_START:
    "/dashboard/admin/competitive-bid-analysis/:id/start/:appID",
  COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING:
    "/dashboard/admin/competitive-bid-analysis/:id/financial-bid-opening",
  SUMMARY_OF_TECHNICAL_PREQUALIFICATION:
    "/dashboard/admin/competitive-bid-analysis/:id/summary-of-technical-prequalification",

  //ending

  ADMIN_TRACKER: "/dashboard/admin/admin-tracker",
};

export const RouteEnum = {
  // MODULES
  MODULES_PROJECTS: "/dashboard/modules/project",
  MODULES_PROGRAMS: "/dashboard/modules/programs",
  MODULES_ADMIN: "/dashboard/modules/admin",
  MODULES_CONFIG: "/dashboard/modules/config",
  MODULES_PROCUREMENT: "/dashboard/modules/procurement",
  MODULES_FINANCE: "/dashboard/modules/finance",
  MODULES_HR: "/dashboard/modules/hr",

  // ----------------------------
  //projects routes
  PROJECTS: "/dashboard/projects",
  PROJECTS_DETAILS: "/dashboard/projects/:id",
  PROJECTS_CREATE_SUMMARY: "/dashboard/projects/create/summary",
  PROJECTS_CREATE_UPLOADS: "/dashboard/projects/create/uploads",
  PROJECTS_EDIT_SUMMARY: "/dashboard/projects/:id/create/summary",
  PROJECTS_EDIT_UPLOADS: "/dashboard/projects/:id/create/uploads",
  // PROJECTS_CREATE_PERFORMANCE: "/projects/create/performance",

  /* -------------------------------------------- */

  // procurement routes
  DASHBOARD: "/dashboard",

  PROCUREMENT_OVERVIEW: "/dashboard/procurement/overview",

  COMPETITIVE_SELECTION:
    "/dashboard/procurement/competitive-bid-analysis/selection",

  // Competitive Bid Analysis routes
  PROCUREMENT_COMPETITIVE_BID_ANALYSIS:
    "/dashboard/procurement/competitive-bid-analysis",
  PROCUREMENT_CBA_DETAILS:
    "/dashboard/procurement/competitive-bid-analysis/:id",
  PROCUREMENT_CBA_CHECK_APPROVAL:
    "/dashboard/procurement/competitive-bid-analysis/:id/check-approval",
  PROCUREMENT_CBA_START:
    "/dashboard/procurement/competitive-bid-analysis/:id/start/:appID",
  PROCUREMENT_CBA_FINANCIAL_BID_OPENING:
    "/dashboard/procurement/competitive-bid-analysis/:id/financial-bid-opening",
  PROCUREMENT_CBA_TECHNICAL_PREQUALIFICATION:
    "/dashboard/procurement/competitive-bid-analysis/:id/summary-of-technical-prequalification",
  PROCUREMENT_CBA_REPORT:
    "/dashboard/procurement/competitive-bid-analysis/:id/report",

  PROCUREMENT_PAYMENT_REQUEST: "/dashboard/procurement/payment-request",

  //purchase request routes
  PURCHASE_REQUEST: "/dashboard/procurement/purchase-request",
  PENDING_PURCHASE_REQUEST: "/dashboard/procurement/purchase-request/pending",
  PURCHASE_REQUEST_DETAILS:
    "/dashboard/procurement/purchase-request/:id/details",
  PURCHASE_REQUEST_FORM: "/dashboard/procurement/purchase-request/form",
  CREATE_PURCHASE_REQUEST: "/dashboard/procurement/purchase-request/create",
  EDIT_PURCHASE_REQUEST: "/dashboard/procurement/purchase-request/:id/edit",
  CREATE_SAMPLE_MEMO: "/dashboard/procurement/purchase-request/activity-memo",
  SAMPLE_PREVIEW: "/dashboard/procurement/purchase-request/sample-preview",
  PREVIEW_LETTER: "/dashboard/procurement/purchase-request/preview-letter",
  FINAL_PREVIEW: "/dashboard/procurement/purchase-request/final-preview",

  // Unified Approval System
  UNIFIED_APPROVALS: "/dashboard/procurement/approvals",

  //purchase order routes
  PURCHASE_ORDER: "/dashboard/procurement/purchase-order",
  PURCHASE_ORDER_DETAILS: "/dashboard/procurement/purchase-order/:id/details",
  CREATE_PURCHASE_ORDER: "/dashboard/procurement/purchase-order/create",
  EDIT_PURCHASE_ORDER: "/dashboard/procurement/purchase-order/:id/edit",
  PURCHASE_ORDER_TERMS: "/dashboard/procurement/purchase-order/:id/terms-and-conditions",

  //procurement routes
  PROCUREMENT_PLAN: "/dashboard/procurement/procurement-plan",
  PROCUREMENT_PLAN_FINANCIAL_YEAR:
    "/dashboard/procurement/procurement-plan/financial-year",
  PROCUREMENT_DETAILS: "/dashboard/procurement/procurement-plan/:id",
  CREATE_PROCUREMENT:
    "/dashboard/procurement/procurement-plan/create/procurement-plan",
  CREATE_PROCUREMENT_MILESTONE:
    "/dashboard/procurement/procurement-plan/create/procurement-milestones",
  PROCUREMENT_TRACKER: "/dashboard/procurement/procurement-tracker",

  //rfq routes
  RFQ: "/dashboard/procurement/solicitation-management/rfq",
  RFQ_CREATE_QUOTATION:
    "/dashboard/procurement/solicitation-management/rfq/create/quotation",
  RFQ_CREATE_ITEMS:
    "/dashboard/procurement/solicitation-management/rfq/create/items",
  RFQ_DETAILS: "/dashboard/procurement/solicitation-management/rfq/:id",
  RFQ_CREATE_CBA:
    "/dashboard/procurement/solicitation-management/rfq/create/create-cba?id=:id",
  RFQ_COMPETITIVE_BID_ANALYSIS:
    "/dashboard/procurement/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION:
    "/dashboard/procurement/solicitation-management/rfq/:id/manual-bid-submission",
  RFQ_VENDOR: "/dashboard/procurement/rfq-vendor",
  RFQ_CREATE_QUOTATION_OPEN_TENDER:
    "/dashboard/procurement/solicitation-management/rfq/create/quotation/:id",

  // rfp routes
  RFP: "/dashboard/procurement-management/solicitation/rfp",
  RFP_CREATE_PROPOSAL:
    "/dashboard/procurement-management/solicitation/rfp/create/proposal",
  RFP_CREATE_UPLOADS:
    "/dashboard/procurement-management/solicitation/rfp/create/uploads",
  RFP_DETAILS: "/dashboard/procurement-management/solicitation/rfp/:id",
  RFP_DETAILS_BID_SUBMISSION:
    "/dashboard/procurement-management/solicitation/rfp/:id/manual-bid-submission",
  RFP_VENDOR: "/dashboard/procurement-management/rfp-vendor",
  RFP_CREATE_PROPOSAL_OPEN_TENDER:
    "/dashboard/procurement-management/solicitation/rfp/create/proposal/:id",

  //competitive bid analysis routes
  COMPETITIVE_BID_ANALYSIS:
    "/dashboard/procurement-management/competitive-bid-analysis",
  COMPETITIVE_BID_ANALYSIS_DETAILS:
    "/dashboard/procurement-management/competitive-bid-analysis/:id",
  COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK:
    "/dashboard/procurement-management/competitive-bid-analysis/:id/check-approval",
  COMPETITIVE_BID_ANALYSIS_DETAILS_START:
    "/dashboard/procurement-management/competitive-bid-analysis/:id/start/:appID",
  COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING:
    "/dashboard/procurement-management/competitive-bid-analysis/:id/financial-bid-opening",
  SUMMARY_OF_TECHNICAL_PREQUALIFICATION:
    "/dashboard/procurement-management/competitive-bid-analysis/:id/summary-of-technical-prequalification",
  //eoi routes
  EOI: "/dashboard/procurement-management/vendor-management/eoi",
  EOI_VIEW: "/dashboard/procurement-management/vendor-management/eoi/:id",
  EOI_VENDOR: "/dashboard/procurement-management/vendor-management/eoi-vendor",

  //vendor-management routes
  VENDOR_MANAGEMENT:
    "/dashboard/procurement/vendor-management/prequalification",
  VENDOR_REGISTRATION:
    "/dashboard/procurement/vendor-management/vendor-registration",
  VENDOR_COMPANY: "/dashboard/procurement/vendor-management/the-company",
  VENDOR_TECHNICAL:
    "/dashboard/procurement/vendor-management/technical-capacity",
  VENDOR_QUESTIONER: "/dashboard/procurement/vendor-management/questionnaire",
  VENDOR_ATTESTATION: "/dashboard/procurement/vendor-management/attestation",
  VENDOR_UPLOAD: "/dashboard/procurement/vendor-management/upload",
  VENDOR_MANAGEMENT_DETAILS:
    "/dashboard/procurement/vendor-management/prequalification/:id",
  VENDOR_MANAGEMENT_START_PREQUALIFICATION:
    "/dashboard/procurement/vendor-management/prequalification/:id/start-prequalification",

  //purchase order routes
  // PURCHASE_ORDER: "/dashboard/procurement-management/purchase-order",
  PURCHASE_ORDER_ID: "/dashboard/procurement-management/purchase-order/:id",
  PURCHASE_ORDER_ID_TERMS:
    "/dashboard/procurement-management/purchase-order/:id/terms-and-conditions",
  PURCHASE_ORDER_NEW: "/dashboard/procurement-management/purchase-order-new",

  SUBMISSION_OF_BIDS: "/dashboard/procurement-management/submission-of-bids",
  PRICE_INTELLIGENCE: "/dashboard/procurement-management/price-intelligence",

  //supplier database routes
  SUPPLIER_DATABASE: "/dashboard/procurement-management/supplier-database",
  SUPPLIER_DATABASE_DETAIL:
    "/dashboard/procurement-management/supplier-database/:id",

  // vendor performance evaluation
  VENDOR_PERFORMANCE_EVALUATION: "/dashboard/procurement/vendor-performance",

  VENDOR_PERFORMANCE_EVALUATION_ID:
    "/dashboard/procurement/vendor-performance/:id",

  VENDOR_PERFORMANCE_START_EVALUATION:
    "/dashboard/procurement/vendor-performance/:id/form",

  VENDOR_PERFORMANCE_EVALUATION_FORM:
    "/dashboard/procurement/vendor-performance/form",

  //program routes
  PROGRAM_WORK_PLAN: "/dashboard/programs/plan/work-plan",
  PROGRAM_WORK_PLAN_DETAILS: "/dashboard/programs/plan/work-plan/:id",

  PROGRAM_ACTIVITY: "/dashboard/programs/plan/activity-plan",
  PROGRAM_CREATE_ACTIVITY_PLAN: "/dashboard/programs/plan/activity-plan/create",

  PROGRAM_ACTIVITY_TRACKER: "/dashboard/programs/plan/activity-tracker",
  PROGRAM_ACTIVITY_TRACKER_DETAILS:
    "/dashboard/programs/plan/activity-tracker/:id",
  PROGRAM_ACTIVITY_TRACKER_CREATE:
    "/dashboard/programs/plan/activity-tracker/create",

  PROGRAM_RISK_MANAGEMENT: "/dashboard/programs/plan/risk-management-plan",
  PROGRAM_RISK_MANAGEMENT_CREATE:
    "/dashboard/programs/plan/risk-management-plan/create",
  PROGRAM_VALUE_MANAGEMENT: "/dashboard/programs/plan/value-management-plan",
  PROGRAM_SUPPORTIVE_SUPERVISION:
    "/dashboard/programs/plan/supportive-supervision-plan",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS:
    "/dashboard/programs/plan/supportive-supervision-plan/:id",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL:
    "/dashboard/programs/plan/supportive-supervision-plan/:id/approval-status",
  // PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT:
  //   "/dashboard/programs/plan/supportive-supervision-plan/:id/evaluation-criteria-process",
  PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT:
    "/dashboard/programs/plan/supportive-supervision-plan/:id/evaluation",
  PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION:
    "/dashboard/programs/plan/supportive-supervision-plan/create/composition",

  PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST:
    "/dashboard/programs/plan/supportive-supervision-plan/create/checklist",

  PROGRAM_FUND_REQUEST: "/dashboard/programs/fund-request",
  PROGRAM_FUND_REQUEST_DETAILS: "/dashboard/programs/fund-request/:id/",
  PROGRAM_FUND_REQUEST_CREATE: "/dashboard/programs/fund-request/create/",
  PROGRAM_FUND_REQUEST_EDIT: "/dashboard/programs/fund-request/:id/edit",
  PROGRAM_FUND_REQUEST_FUND_SUMMARY:
    "/dashboard/programs/fund-request/create/fund-request-summary",
  PROGRAM_FUND_REQUEST_PREVIEW:
    "/dashboard/programs/fund-request/create/fund-request-preview",

  PROGRAM_FUND_REQUEST_VIEW_ACTIVITY:
    // "/dashboard/programs/fund-request/create/fund-request-preview/:id/fund-request-activity",
    "/dashboard/programs/fund-request/:id/activity",

  PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS:
    "/dashboard/programs/fund-request/:id/all-requests",

  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS:
    "/dashboard/programs/stakeholder-management/analysis&mapping",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_DETAILS:
    "/dashboard/programs/stakeholder-management/analysis&mapping/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_CREATE:
    "/dashboard/programs/stakeholder-management/analysis&mapping/create",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER:
    "/dashboard/programs/stakeholder-management/stakeholder-register",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE:
    "/dashboard/programs/stakeholder-management/stakeholder-register/create",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_EDIT:
    "/dashboard/programs/stakeholder-management/stakeholder-register/edit/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_DETAILS:
    "/dashboard/programs/stakeholder-management/stakeholder-register/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN:
    "/dashboard/programs/stakeholder-management/engagement-plan",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_CREATE:
    "/dashboard/programs/stakeholder-management/engagement-plan/create",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_DETAILS:
    "/dashboard/programs/stakeholder-management/engagement-plan/:id",
  PROGRAM_REPORT: "/dashboard/programs/reports",
  PROGRAM_PAYMENT_REQUEST: "/dashboard/programs/payment-request",

  TRAINING: "/dashboard/programs/training-and-procurement",
  REPORT: "/procurement-management/report",

  // users
  USERS: "/users",
  CREATE_USERS: "/users/create",
  AUTHORIZATION: "/authorization",

  NOTIFICATIONS: "/notifications",
  SUPPORT: "/support",
  SUPPORT_DETAILS: "/support/:id",
  ACCOUNT: "/account",

  // Audit
  AUDIT_LOG: "/audit-log",
};

export const CG_ROUTES = {
  OVERVIEW: "/dashboard/c-and-g/overview",

  /* DONOR DATABASE */
  DONOR_DATABSE: "/dashboard/c-and-g/donor-database",
  VIEW_DONOR_DATABASE: "/dashboard/c-and-g/donor-database/:id",
  /* DONOR DATABASE */

  GRANT: "/dashboard/c-and-g/grant",
  CREATE_GRANT: "/dashboard/c-and-g/grant/create",
  GRANT_DETAILS: "/dashboard/c-and-g/grant/:id/details",

  /* SUB GRANT */
  SUBGRANT_ADVERT: "/dashboard/c-and-g/sub-grant",
  CREATE_SUBGRANT_ADVERT: "/dashboard/c-and-g/sub-grant/create-sub-grant",
  SUBGRANT_ADVERT_DETAILS: "/dashboard/c-and-g/sub-grant/:id",
  SUBGRANT_CREATE_PRE_AWARD_ASSESSMENT:
    "/dashboard/c-and-g/sub-grant/:id/create-pre-award-assessment",
  CREATE_SUBGRANT_SUBMISSION_DETAILS:
    "/dashboard/c-and-g/sub-grant/manual-submission/organization-details/:id",
  CREATE_SUBGRANT_SUBMISSION_UPLOADS:
    "/dashboard/c-and-g/sub-grant/manual-submission/document-upload/:id",
  SUBGRANT_SUBMISSION_DETAILS:
    "/dashboard/c-and-g/sub-grant/:subGrantId/submission/:partnerSubId",

  PRE_AWARD_ASSESSMENT: "/dashboard/c-and-g/sub-grant/preaward-assessment",

  START_PRE_AWARD_ASSESSMENT:
    "/dashboard/c-and-g/sub-grant/:subGrantId/submission/:partnerSubId/preaward-assessment",

  SUBGRANT_AWARD: "/dashboard/c-and-g/sub-grant/awards",
  SUBGRANT_AWARD_DETAILS: "/dashboard/c-and-g/sub-grant/awards/:id",
  /* SUB GRANT */

  // close out
  CLOSE_OUT: "/dashboard/c-and-g/close-out-plan",
  CLOSE_OUT_DETAILS: "/dashboard/c-and-g/close-out-plan/details/:id",
  NEW_CLOSE_OUT_PLAN: "/dashboard/c-and-g/close-out-plan/new-close-out-plan",

  // CONTRACT MANAGEMENT
  AGREEMENT: "/dashboard/c-and-g/agreements",
  CREATE_AGREEMENT: "/dashboard/c-and-g/agreements/create",
  CREATE_AGREEMENT_DETAILS: "/dashboard/c-and-g/agreements/create/summary",
  CREATE_AGREEMENT_UPLOADS: "/dashboard/c-and-g/agreements/create/uploads",
  // -------------

  // CONSULTANCY
  CONSULTANCY: "/dashboard/c-and-g/consultancy",
  CREATE_CONSULTANCY_DETAILS:
    "/dashboard/c-and-g/consultancy/application-details",
  CREATE_CONSULTANCY_WORK_SCOPE:
    "/dashboard/c-and-g/consultancy/create/scope-of-work",
  CONSULTANCY_DETAILS: "/dashboard/c-and-g/consultancy/:id/details",
  CREATE_CONSULTANCY_APPLICANT:
    "/dashboard/c-and-g/consultancy/:id/applicant/create",
  CREATE_CONSULTANCY_INTERVIEW:
    "/dashboard/c-and-g/consultancy/:id/create-interview",

  CONSULTANCY_APPLICATION_DETAILS:
    "/api/v1/contract-grants/consultancy-applications_details/:id",
  CONSULTANCY_SHORTLIST_METRIC:
    "/api/v1/consultancy/shortlisted-applications-metrics/:id",
  CONSULTANCY_SLA: "/dashboard/c-and-g/consultancy/sla",

  CONSULTANT_ACCEPTANCE: "/dashboard/c-and-g/consultant/consultance-acceptance",
  CONSULTANT_ACCEPTANCE_DETAILS:
    "/dashboard/c-and-g/consultant/consultance-acceptance/details",

  // CONSULTANCY REPORT
  CONSULTANCY_REPORT: "/dashboard/c-and-g/consultancy-report",
  CREATE_CONSULTANCY_REPORT: "/dashboard/c-and-g/consultancy-report/create/",
  CONSULTANCY_REPORT_DETAILS: "/dashboard/c-and-g/consultancy-report/:id/",

  /* FACILITATOR MANAGEMENT */
  FACILITATOR_ADVERT: "/dashboard/c-and-g/facilitator-management",
  CREATE_FACILITATOR_ADVERT_DETAILS:
    "/dashboard/c-and-g/facilitator-management/create/application-details",
  CREATE_FACILITATOR_ADVERT_WORK_SCOPE:
    "/dashboard/c-and-g/facilitator-management/create/scope-of-work",
  FACILITATOR_ADVERT_DETAILS: "/dashboard/c-and-g/facilitator-management/:id",
  CREATE_FACILITATOR_ADVERT_APPLICANT:
    "/dashboard/c-and-g/facilitator-management/:id/applicant/create",
  FACILITATOR_DATABASE: "/dashboard/c-and-g/facilitator-database",
  /* FACILITATOR MANAGEMENT */

  CG_MODULES: "/modules/dashboard/c-and-g",

  AWARDED_BENEFICIARIES: "/dashboard/c-and-g/awarded-beneficiaries",

  CONSULTANCY_DATABASE: "/dashboard/c-and-g/consultancy-database",

  CONTRACT_REQUEST: "/dashboard/c-and-g/contract-request/",
  CREATE_CONTRACT_REQUEST:
    "/dashboard/c-and-g/contract-request/create-contract-request",
  CONTRACT_REQUEST_DETAILS: "/dashboard/c-and-g/contract-request/:id/",
};

export const HrRoutes = {
  ADVERTISEMENT: "/dashboard/hr/advertisement",
  ADVERTISEMENT_ADD: "/dashboard/hr/advertisement/add-advertisement",
  ADVERTISEMENT_DETAIL: "/dashboard/hr/advertisement/:id",
  ADVERTISEMENT_DETAIL_SUB_APP:
    "/dashboard/hr/advertisement/:id/submitted-applications/:appID",
  ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION:
    "/dashboard/hr/advertisement/:id/application-form",

  ADVERTISEMENT_INTERVIEW_FORM:
    "/dashboard/hr/advertisement/:id/interview-form/:appID",

  ADVERTISEMENT_INTERVIEW_DETAILS:
    "/dashboard/hr/advertisement/:id/interview-details/:appID",

  SELECTION: "hr/selection",
  ONBOARDING: "/dashboard/hr/onboarding",
  ONBOARDING_START: "/dashboard/hr/onboarding/start-onboarding/:id/",
  ONBOARDING_ADD_EMPLOYEE_INFO:
    "/dashboard/hr/onboarding/add-employee/employee-information/:id/",
  ONBOARDING_ADD_EMPLOYEE_ADD:
    "/dashboard/hr/onboarding/add-employee/additional-information/:id/",
  ONBOARDING_ADD_EMPLOYEE_BENEFICIARY:
    "/dashboard/hr/onboarding/add-employee/beneficiary-designation/:id/",
  ONBOARDING_ADD_EMPLOYEE_ID_CARD:
    "/dashboard/hr/onboarding/add-employee/id-card-information/:id/",
  ONBOARDING_ADD_EMPLOYEE_SALARY:
    "/dashboard/hr/onboarding/add-employee/salary-account-details/:id/",
  ONBOARDING_ADD_EMPLOYEE_PENSION:
    "/dashboard/hr/onboarding/add-employee/pension-scheme-enrolment/:id/",
  WORKFORCE_NEED_ANALYSIS: "/dashboard/hr/workforce-need-analysis",
  WORKFORCE_NEED_ANALYSIS_CREATE:
    "/dashboard/hr/workforce-need-analysis/create",
  WORKFORCE_DATABASE: "/dashboard/hr/workforce-database",
  WORKFORCE_DATABASE_CREATE: "/dashboard/hr/workforce-database/create",
  WORKFORCE_DATABASE_DETAIL: "/dashboard/hr/workforce-database/:id",
  PERFORMANCE_MANAGEMENT: "/dashboard/hr/performance-management",
  PERFORMANCE_MANAGEMENT_CREATE: "/dashboard/hr/performance-management/create",
  PERFORMANCE_MANAGEMENT_DETAIL: "/dashboard/hr/performance-management/:id",
  EMPLOYEE_BENEFITS_COMPENSATION: "/dashboard/hr/employee-benefit/compensation",
  EMPLOYEE_BENEFITS_COMPENSATION_SPREAD:
    "/dashboard/hr/employee-benefit/compensation-spread",
  EMPLOYEE_BENEFITS_COMPENSATION_CREATE:
    "/dashboard/hr/employee-benefit/compensation/create",
  EMPLOYEE_BENEFITS_PAY_ROLL: "/dashboard/hr/employee-benefit/pay-roll",
  EMPLOYEE_BENEFITS_PAY_ROLL_INFO:
    "/dashboard/hr/employee-benefit/pay-roll/:id",
  EMPLOYEE_BENEFITS_PAY_ROLL_CREATE:
    "/dashboard/hr/employee-benefit/pay-roll/create",
  EMPLOYEE_BENEFITS_PAY_GROUP: "/dashboard/hr/employee-benefit/pay-group",
  SEPARATION_MANAGEMENT: "/dashboard/hr/separation-management",
  SEPARATION_MANAGEMENT_CREATE: "/dashboard/hr/separation-management/create",
  SEPARATION_MANAGEMENT_DETAIL: "/dashboard/hr/separation-management/:id",
  GRIEVANCE_MANAGEMENT: "/dashboard/hr/grievance-management",
  GRIEVANCE_MANAGEMENT_CREATE: "/dashboard/hr/grievance-management/create",
  GRIEVANCE_MANAGEMENT_DETAILS: "/dashboard/hr/grievance-management/:id",
  LEAVE_MANAGEMENT_REQUEST_LEAVE:
    "/dashboard/hr/leave-management/request-leave",
  LEAVE_MANAGEMENT_LEAVE_LIST: "/dashboard/hr/leave-management/leave-list",
  LEAVE_MANAGEMENT_ASSIGN_LEAVE: "/dashboard/hr/leave-management/assign-leave",
  LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL:
    "/dashboard/hr/leave-management/leave-list/:id",
  LEAVE_MANAGEMENT_LEAVE_SETTINGS: "hr/leave-management/leave-settings",
  TIMESHEET_MANAGEMENT: "/dashboard/hr/timesheet-management",
  TIMESHEET_MANAGEMENT_DETAIL: "/dashboard/hr/timesheet-management/:id",
  TIMESHEET_MANAGEMENT_DETAIL_CREATE:
    "/dashboard/hr/timesheet-management/:id/create",
  TIMESHEET_MANAGEMENT_CREATE:
    "/dashboard/hr/timesheet-management/create-timesheet-management",
};

/* *************** PROGRAM ROUTES *************** */
export enum ProgramRoutes {
  SUPERVISION_PLAN_EVALUATION_DETAILS = "/dashboard/programs/plan/supportive-supervision-plan/:supervisionPlanId/view-evaluation/",

  ADHOC_MANAGEMENT = "/dashboard/programs/adhoc-management/",
  CREATE_ADHOC_DETAILS = "/dashboard/programs/adhoc-management/create-adhoc-details/",
  CREATE_ADHOC_WORK_SCOPE = "/dashboard/programs/adhoc-management/create-scope-of-work/",
  ADHOC_DETAILS = "/dashboard/programs/adhoc-management/:id/details/",
  CREATE_ADHOC_INTERVIEW = "/dashboard/programs/adhoc-management/:id/create-interview/",
  CREATE_ADHOC_APPLICANT = "/dashboard/programs/adhoc-management/:id/applicant/create/",
  ADHOC_APPLICANT_DETAILS = "/dashboard/programs/adhoc-management/:adhocId/applicant/:applicantId/details/",
  ADHOC_APPLICANT_INTERVIEW = "/dashboard/programs/adhoc-management/:adhocId/applicant/:applicantId/adhoc-interview/",
  ADHOC_DATABASE = "/dashboard/programs/adhoc-database/",

  ADHOC_ACCEPTANCE = "/dashboard/programs/adhoc/adhoc-acceptance",
  ADHOC_ACCEPTANCE_DETAILS = "/dashboard/programs/adhoc/adhoc-acceptance/details",
}
