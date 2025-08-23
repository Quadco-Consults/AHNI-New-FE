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
  ASSETS_REQUEST_VIEW:
    "/dashboard/admin/inventory-management/asset-request/:id",

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
  CREATE_PAYMENT_REQUEST_SUMMARY:
    "/dashboard/admin/payment-request/create/summary",
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
  EXPENSE_AUTHORIZATION_DETAIL: "/dashboard/admin/expense-authorization/:id",

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
  GRN_CREATE_UPLOADS:
    "/dashboard/admin/inventory-management/good-receive-note/create/uploads",
  GRN_DETAIL: "/dashboard/admin/inventory-management/good-receive-note/:id",
  /* GOOD RECEIVE NOTES END */

  ITEM_REQUISITION: "/dashboard/admin/inventory-management/item-requisition",
  ITEM_REQUISITION_DETAIL:
    "/dashboard/admin/inventory-management/item-requisition/:id",
  CREATE_ITEM_REQUISITION:
    "/dashboard/admin/inventory-management/item-requisition/create",

  INVENTORY_ASSETS: "/dashboard/admin/inventory-management/assets",

  HMO: "/dashboard/admin/agreement/hmo",
  SLA: "/dashboard/admin/agreement/sla",
  Security: "/dashboard/admin/agreement/security",
  Insurance: "/dashboard/admin/agreement/insurance",
  Ticketing: "/dashboard/admin/agreement/ticketing",
  ViewAggrement: "/dashboard/admin/agreement/view",

  //rfq routes
  RFQ: "/dashboard/admin/solicitation-management/rfq",
  RFQ_CREATE_QUOTATION: "/admin/solicitation/rfq/create/quotation",
  RFQ_CREATE_ITEMS: "/admin/solicitation/rfq/create/items",
  RFQ_DETAILS: "/admin/solicitation/rfq/:id",
  RFQ_CREATE_CBA: "/admin/solicitation/rfq/create/create-cba",
  RFQ_COMPETITIVE_BID_ANALYSIS:
    "/admin/solicitation/rfq/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION:
    "/admin/solicitation/rfq/:id/manual-bid-submission",
  RFQ_VENDOR: "/admin/rfq-vendor",
  RFQ_CREATE_QUOTATION_OPEN_TENDER:
    "/procurement-management/solicitation/rfq/create/quotation/:id",
  //purchase order routes
  PURCHASE_ORDER: "/admin/purchase-order",
  PURCHASE_ORDER_ID: "/admin/purchase-order/:id",
  PURCHASE_ORDER_ID_TERMS: "/admin/purchase-order/:id/terms-and-conditions",
  PURCHASE_ORDER_NEW: "/admin/purchase-order-new",

  SUBMISSION_OF_BIDS: "/admin/submission-of-bids",
  PRICE_INTELLIGENCE: "/admin/price-intelligence",

  //competitive bid analysis routes
  COMPETITIVE_BID_ANALYSIS: "/admin/competitive-bid-analysis",
  COMPETITIVE_BID_ANALYSIS_DETAILS: "/admin/competitive-bid-analysis/:id",
  COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK:
    "/admin/competitive-bid-analysis/:id/check-approval",
  COMPETITIVE_BID_ANALYSIS_DETAILS_START:
    "/admin/competitive-bid-analysis/:id/start/:appID",
  COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING:
    "/admin/competitive-bid-analysis/:id/financial-bid-opening",
  SUMMARY_OF_TECHNICAL_PREQUALIFICATION:
    "/admin/competitive-bid-analysis/:id/summary-of-technical-prequalification",

  //ending

  ADMIN_TRACKER: "/admin/admin-tracker",
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

  PROCUREMENT_PAYMENT_REQUEST: "/dashboard/procurement/payment-request",

  //purchase request routes
  PURCHASE_REQUEST: "/dashboard/procurement/purchase-request",
  PENDING_PURCHASE_REQUEST: "/dashboard/procurement/purchase-request/pending",
  PURCHASE_REQUEST_DETAILS:
    "/dashboard/procurement/purchase-request/:id/details",
  PURCHASE_REQUEST_FORM: "/dashboard/procurement/purchase-request/form",
  CREATE_PURCHASE_REQUEST: "/dashboard/procurement/purchase-request/create",
  CREATE_SAMPLE_MEMO: "/dashboard/procurement/purchase-request/activity-memo",
  SAMPLE_PREVIEW: "/dashboard/procurement/purchase-request/sample-preview",
  PREVIEW_LETTER: "/dashboard/procurement/purchase-request/preview-letter",
  FINAL_PREVIEW: "/dashboard/procurement/purchase-request/final-preview",

  //purchase order routes
  PURCHASE_ORDER: "/dashboard/procurement/purchase-order",
  PURCHASE_ORDER_DETAILS: "/dashboard/procurement/purchase-order/:id/details",
  CREATE_PURCHASE_ORDER: "/dashboard/procurement/purchase-order/create",

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
  RFQ: "/procurement-management/solicitation/rfq",
  RFQ_CREATE_QUOTATION:
    "/procurement-management/solicitation/rfq/create/quotation",
  RFQ_CREATE_ITEMS: "/procurement-management/solicitation/rfq/create/items",
  RFQ_DETAILS: "/procurement-management/solicitation/rfq/:id",
  RFQ_CREATE_CBA:
    "/procurement-management/solicitation/rfq/create/create-cba/:id",
  RFQ_COMPETITIVE_BID_ANALYSIS:
    "/procurement-management/solicitation/rfq/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION:
    "/procurement-management/solicitation/rfq/:id/manual-bid-submission",
  RFQ_VENDOR: "/procurement-management/rfq-vendor",
  RFQ_CREATE_QUOTATION_OPEN_TENDER:
    "/procurement-management/solicitation/rfq/create/quotation/:id",

  // rfp routes
  RFP: "/procurement-management/solicitation/rfp",
  RFP_CREATE_PROPOSAL:
    "/procurement-management/solicitation/rfp/create/proposal",
  RFP_CREATE_UPLOADS: "/procurement-management/solicitation/rfp/create/uploads",
  RFP_DETAILS: "/procurement-management/solicitation/rfp/:id",
  RFP_DETAILS_BID_SUBMISSION:
    "/procurement-management/solicitation/rfp/:id/manual-bid-submission",
  RFP_VENDOR: "/procurement-management/rfp-vendor",
  RFP_CREATE_PROPOSAL_OPEN_TENDER:
    "/procurement-management/solicitation/rfp/create/proposal/:id",

  //competitive bid analysis routes
  COMPETITIVE_BID_ANALYSIS: "/procurement-management/competitive-bid-analysis",
  COMPETITIVE_BID_ANALYSIS_DETAILS:
    "/procurement-management/competitive-bid-analysis/:id",
  COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK:
    "/procurement-management/competitive-bid-analysis/:id/check-approval",
  COMPETITIVE_BID_ANALYSIS_DETAILS_START:
    "/procurement-management/competitive-bid-analysis/:id/start/:appID",
  COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING:
    "/procurement-management/competitive-bid-analysis/:id/financial-bid-opening",
  SUMMARY_OF_TECHNICAL_PREQUALIFICATION:
    "/procurement-management/competitive-bid-analysis/:id/summary-of-technical-prequalification",
  //eoi routes
  EOI: "/procurement-management/vendor-management/eoi",
  EOI_VIEW: "/procurement-management/vendor-management/eoi/:id",
  EOI_VENDOR: "/procurement-management/vendor-management/eoi-vendor",

  //vendor-management routes
  VENDOR_MANAGEMENT:
    "/procurement-management/vendor-management/prequalification",
  VENDOR_REGISTRATION:
    "/procurement-management/vendor-management/vendor-registration",
  VENDOR_COMPANY: "/procurement-management/vendor-management/the-company",
  VENDOR_TECHNICAL:
    "/procurement-management/vendor-management/technical-capacity",
  VENDOR_QUESTIONER: "/procurement-management/vendor-management/questionnaire",
  VENDOR_ATTESTATION: "/procurement-management/vendor-management/attestation",
  VENDOR_UPLOAD: "/procurement-management/vendor-management/upload",
  VENDOR_MANAGEMENT_DETAILS:
    "/procurement-management/vendor-management/prequalification/:id",
  VENDOR_MANAGEMENT_START_PREQUALIFICATION:
    "/procurement-management/vendor-management/prequalification/:id/start-prequalification",

  //purchase order routes
  PURCHASE_ORDER: "/procurement-management/purchase-order",
  PURCHASE_ORDER_ID: "/procurement-management/purchase-order/:id",
  PURCHASE_ORDER_ID_TERMS:
    "/procurement-management/purchase-order/:id/terms-and-conditions",
  PURCHASE_ORDER_NEW: "/procurement-management/purchase-order-new",

  SUBMISSION_OF_BIDS: "/procurement-management/submission-of-bids",
  PRICE_INTELLIGENCE: "/procurement-management/price-intelligence",

  //supplier database routes
  SUPPLIER_DATABASE: "/procurement-management/supplier-database",
  SUPPLIER_DATABASE_DETAIL: "/procurement-management/supplier-database/:id",

  // vendor performance evaluation
  VENDOR_PERFORMANCE_EVALUATION:
    "/procurement-management/vendor-performance-evaluation",

  VENDOR_PERFORMANCE_EVALUATION_ID:
    "/procurement-management/vendor-performance-evaluation/:id",

  VENDOR_PERFORMANCE_START_EVALUATION:
    "/procurement-management/vendor-performance-evaluation/:id/form",

  VENDOR_PERFORMANCE_EVALUATION_FORM:
    "/procurement-management/vendor-performance-evaluation/form",

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
  PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT:
    "/dashboard/programs/plan/supportive-supervision-plan/:id/evaluation-criteria-process",
  PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION:
    "/dashboard/programs/plan/supportive-supervision-plan/composition",
  PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST:
    "/dashboard/programs/plan/supportive-supervision-plan/evaluation-checklist",

  PROGRAM_FUND_REQUEST: "/dashboard/programs/fund-request",
  PROGRAM_FUND_REQUEST_DETAILS: "/dashboard/programs/fund-request/:id/",
  PROGRAM_FUND_REQUEST_CREATE:
    "/dashboard/programs/fund-request/create/project-details",
  PROGRAM_FUND_REQUEST_FUND_SUMMARY:
    "/dashboard/programs/fund-request/create/fund-request-summary",
  PROGRAM_FUND_REQUEST_PREVIEW:
    "/dashboard/programs/fund-request/create/fund-request-preview",

  PROGRAM_FUND_REQUEST_VIEW_ACTIVITY:
    "/dashboard/programs/fund-request/create/fund-request-preview/:id/fund-request-activity",

  PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS:
    "/dashboard/programs/fund-request/create/fund-request-preview/:id/view-all-fund-request",

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
  CREATE_SUBGRANT_ADVERT: "/dashboard/c-and-g/sub-grant/create",
  SUBGRANT_ADVERT_DETAILS: "/dashboard/c-and-g/sub-grant/:id/details",
  SUBGRANT_CREATE_PRE_AWARD_ASSESSMENT:
    "/c-and-g/sub-grant/:id/create-pre-award-assessment",
  CREATE_SUBGRANT_SUBMISSION_DETAILS:
    "/c-and-g/sub-grant/manual-submission/organization-details/:id",
  CREATE_SUBGRANT_SUBMISSION_UPLOADS:
    "/c-and-g/sub-grant/manual-submission/document-upload/:id",
  SUBGRANT_SUBMISSION_DETAILS:
    "/c-and-g/sub-grant/:subGrantId/submission/:partnerSubId",

  PRE_AWARD_ASSESSMENT: "/c-and-g/sub-grant/preaward-assessment",

  START_PRE_AWARD_ASSESSMENT:
    "/c-and-g/sub-grant/:subGrantId/submission/:partnerSubId/preaward-assessment",

  SUBGRANT_AWARD: "/c-and-g/sub-grant/awards",
  SUBGRANT_AWARD_DETAILS: "/c-and-g/sub-grant/awards/:id",
  /* SUB GRANT */

  // close out
  CLOSE_OUT: "/c-and-g/close-out-plan",
  CLOSE_OUT_DETAILS: "/c-and-g/close-out-plan/details/:id",
  NEW_CLOSE_OUT_PLAN: "/c-and-g/close-out-plan/new-close-out-plan",

  // CONTRACT MANAGEMENT
  AGREEMENT: "/c-and-g/agreements",
  CREATE_AGREEMENT_DETAILS: "/c-and-g/agreements/create/summary",
  CREATE_AGREEMENT_UPLOADS: "/c-and-g/agreements/create/uploads",
  // -------------

  // CONSULTANCY
  CONSULTANCY: "/c-and-g/consultancy",
  CREATE_CONSULTANCY_DETAILS: "/c-and-g/consultancy/application-details",
  CREATE_CONSULTANCY_WORK_SCOPE: "/c-and-g/consultancy/create/scope-of-work",
  CONSULTANCY_DETAILS: "/c-and-g/consultancy/:id",
  CREATE_CONSULTANCY_APPLICANT: "/c-and-g/consultancy/:id/applicant/create",

  CONSULTANCY_APPLICATION_DETAILS:
    "/api/v1/contract-grants/consultancy-applications_details/:id",
  CONSULTANCY_SHORTLIST_METRIC:
    "/api/v1/consultancy/shortlisted-applications-metrics/:id",
  CONSULTANCY_SLA: "/c-and-g/consultancy/sla",

  CONSULTANT_ACCEPTANCE: "/c-and-g/consultant/consultance-acceptance",
  CONSULTANT_ACCEPTANCE_DETAILS:
    "/c-and-g/consultant/consultance-acceptance/details",

  // CONSULTANCY REPORT
  CONSULTANCY_REPORT: "/c-and-g/consultancy-report",
  CREATE_CONSULTANCY_REPORT: "/c-and-g/consultancy-report/create/",
  CONSULTANCY_REPORT_DETAILS: "/c-and-g/consultancy-report/:id/",

  /* FACILITATOR MANAGEMENT */
  FACILITATOR_ADVERT: "/c-and-g/facilitator-management",
  CREATE_FACILITATOR_ADVERT_DETAILS:
    "/c-and-g/facilitator-management/create/application-details",
  CREATE_FACILITATOR_ADVERT_WORK_SCOPE:
    "/c-and-g/facilitator-management/create/scope-of-work",
  FACILITATOR_ADVERT_DETAILS: "/c-and-g/facilitator-management/:id",
  CREATE_FACILITATOR_ADVERT_APPLICANT:
    "/c-and-g/facilitator-management/:id/applicant/create",
  FACILITATOR_DATABASE: "/c-and-g/facilitator-database",
  /* FACILITATOR MANAGEMENT */

  CG_MODULES: "/modules/c-and-g",

  AWARDED_BENEFICIARIES: "/c-and-g/awarded-beneficiaries",

  CONSULTANCY_DATABASE: "/c-and-g/consultancy-database",

  CONTRACT_REQUEST: "/c-and-g/contract-request/",
  CREATE_CONTRACT_REQUEST: "/c-and-g/contract-request/create-contract-request",
  CONTRACT_REQUEST_DETAILS: "/c-and-g/contract-request/:id/",
};

export const HrRoutes = {
  ADVERTISEMENT: "/dashboard/hr/advertisement",
  ADVERTISEMENT_ADD: "/dashboard/hr/advertisement/add-advertisement",
  ADVERTISEMENT_DETAIL: "/dashboard/hr/advertisement/:id",
  ADVERTISEMENT_DETAIL_SUB_APP:
    "/hr/advertisement/:id/submitted-applications/:appID",
  ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION:
    "/hr/advertisement/:id/application-form",

  ADVERTISEMENT_INTERVIEW_FORM: "/hr/advertisement/:id/interview-form/:appID",

  ADVERTISEMENT_INTERVIEW_DETAILS:
    "/hr/advertisement/:id/interview-details/:appID",

  SELECTION: "hr/selection",
  ONBOARDING: "/dashboard/hr/onboarding",
  CREATE_ONBOARDING: "/dashboard/hr/onboarding/create",
  ONBOARDING_DETAILS: "/dashboard/hr/onboarding/:id/details",
  ONBOARDING_START: "/dashboard/hr/onboarding/start-onboarding/:id/",
  ONBOARDING_ADD_EMPLOYEE_INFO:
    "/hr/onboarding/add-employee/employee-information/:id/",
  ONBOARDING_ADD_EMPLOYEE_ADD:
    "/hr/onboarding/add-employee/additional-information/:id/",
  ONBOARDING_ADD_EMPLOYEE_BENEFICIARY:
    "/hr/onboarding/add-employee/beneficiary-designation/:id/",
  ONBOARDING_ADD_EMPLOYEE_ID_CARD:
    "/hr/onboarding/add-employee/id-card-information/:id/",
  ONBOARDING_ADD_EMPLOYEE_SALARY:
    "/hr/onboarding/add-employee/salary-account-details/:id/",
  ONBOARDING_ADD_EMPLOYEE_PENSION:
    "/hr/onboarding/add-employee/pension-scheme-enrolment/:id/",
  WORKFORCE_NEED_ANALYSIS: "/hr/workforce-need-analysis",
  WORKFORCE_NEED_ANALYSIS_CREATE: "/hr/workforce-need-analysis/create",
  WORKFORCE_DATABASE: "/dashboard/hr/workforce-database",
  WORKFORCE_DATABASE_CREATE: "/dashboard/hr/workforce-database/employee/create",
  WORKFORCE_DATABASE_DETAIL: "/dashboard/hr/workforce-database/employee/:id/details",
  PERFORMANCE_MANAGEMENT: "/hr/performance-management",
  PERFORMANCE_MANAGEMENT_CREATE: "/hr/performance-management/create",
  PERFORMANCE_MANAGEMENT_DETAIL: "/hr/performance-management/:id",
  EMPLOYEE_BENEFITS_COMPENSATION: "/dashboard/hr/employee-benefit/compensation",
  EMPLOYEE_BENEFITS_COMPENSATION_SPREAD: "/dashboard/hr/employee-benefit/compensation-spread",
  EMPLOYEE_BENEFITS_COMPENSATION_CREATE: "/dashboard/hr/employee-benefit/compensation/create",
  EMPLOYEE_BENEFITS_PAY_ROLL: "/dashboard/hr/employee-benefit/pay-roll",
  EMPLOYEE_BENEFITS_PAY_ROLL_INFO: "/dashboard/hr/employee-benefit/pay-roll/:id",
  EMPLOYEE_BENEFITS_PAY_ROLL_CREATE: "/dashboard/hr/employee-benefit/pay-roll/create",
  EMPLOYEE_BENEFITS_PAY_GROUP: "/dashboard/hr/employee-benefit/pay-group",
  SEPARATION_MANAGEMENT: "/hr/separation-management",
  SEPARATION_MANAGEMENT_CREATE: "/hr/separation-management/create",
  SEPARATION_MANAGEMENT_DETAIL: "/hr/separation-management/:id",
  GRIEVANCE_MANAGEMENT: "/dashboard/hr/grievance-management",
  GRIEVANCE_MANAGEMENT_CREATE: "/dashboard/hr/grievance-management/create",
  GRIEVANCE_MANAGEMENT_DETAILS: "/dashboard/hr/grievance-management/:id/details",
  LEAVE_MANAGEMENT: "/dashboard/hr/leave-management",
  LEAVE_MANAGEMENT_CREATE: "/dashboard/hr/leave-management/create",
  LEAVE_MANAGEMENT_DETAILS: "/dashboard/hr/leave-management/:id/details",
  LEAVE_MANAGEMENT_ASSIGNMENT: "/dashboard/hr/leave-management/assignment",
  LEAVE_MANAGEMENT_REQUEST_LEAVE: "/dashboard/hr/leave-management/request-leave",
  LEAVE_MANAGEMENT_LEAVE_LIST: "/dashboard/hr/leave-management/leave-list",
  LEAVE_MANAGEMENT_ASSIGN_LEAVE: "/dashboard/hr/leave-management/assign-leave",
  LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL: "/dashboard/hr/leave-management/leave-list/:id",
  LEAVE_MANAGEMENT_LEAVE_SETTINGS: "hr/leave-management/leave-settings",
  TIMESHEET_MANAGEMENT: "/hr/timesheet-management",
  TIMESHEET_MANAGEMENT_DETAIL: "/hr/timesheet-management/:id",
  TIMESHEET_MANAGEMENT_DETAIL_CREATE: "/hr/timesheet-management/:id/create",
  TIMESHEET_MANAGEMENT_CREATE:
    "/hr/timesheet-management/create-timesheet-management",
};

/* *************** PROGRAM ROUTES *************** */
export enum ProgramRoutes {
  SUPERVISION_PLAN_EVALUATION_DETAILS = "/dashboard/programs/plan/supportive-supervision-plan/:id/view-evaluation/",

  ADHOC_MANAGEMENT = "/dashboard/programs/adhoc-management/",
  CREATE_ADHOC_DETAILS = "/dashboard/programs/adhoc-management/create-adhoc-details/",
  CREATE_ADHOC_WORK_SCOPE = "/dashboard/programs/adhoc-management/create-scope-of-work/",
  ADHOC_DETAILS = "/dashboard/programs/adhoc-management/:id/details/",
  CREATE_ADHOC_INTERVIEW = "/dashboard/programs/adhoc-management/:id/create-interview/",
  CREATE_ADHOC_APPLICANT = "/dashboard/programs/adhoc-management/:id/applicant/create/",
  ADHOC_APPLICANT_DETAILS = "/dashboard/programs/adhoc-management/:id/applicant/:applicantId/details/",
  ADHOC_APPLICANT_INTERVIEW = "/dashboard/programs/adhoc-management/:id/applicant/:applicantId/adhoc-interview/",
  ADHOC_DATABASE = "/dashboard/programs/adhoc-database/",

  ADHOC_ACCEPTANCE = "/dashboard/programs/adhoc/adhoc-acceptance",
  ADHOC_ACCEPTANCE_DETAILS = "/dashboard/programs/adhoc/adhoc-acceptance/details",
}
