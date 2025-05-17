export const AuthRoutes = {
  LOGIN: "/auth/login",
};

export const AdminRoutes = {
  OVERVIEW: "/admin/overview",

  // CONSUMABLE
  INDEX_CONSUMABLE: "/admin/inventory-management/consumable",
  CREATE_CONSUMABLE: "/admin/inventory-management/create",
  VIEW_CONSUMABLE: "/admin/inventory-management/consumables/:id",

  // ASSET REQUEST
  ASSETS_REQUEST: "/admin/inventory-management/asset-request",
  ASSETS_REQUEST_CREATE: "/admin/inventory-management/asset-request/summary",
  ASSETS_REQUEST_UPLOAD: "/admin/inventory-management/asset-request/uploads",
  ASSETS_REQUEST_VIEW: "/admin/inventory-management/asset-request/:id",

  // VEHICLE REQUEST
  INDEX_VEHICLE_REQUEST: "/admin/fleet-management/vehicle-request",
  CREATE_VEHICLE_REQUEST: "/admin/fleet-management/vehicle-request/create",
  VIEW_VEHICLE_REQUEST: "/admin/fleet-management/vehicle-request/:id",

  // VEHICLE MAINTENANCE
  INDEX_VEHICLE_MAINTENANCE: "/admin/fleet-management/vehicle-maintenance",
  CREATE_VEHICLE_MAINTENANCE:
    "/admin/fleet-management/vehicle-maintenance-create",
  VIEW_VEHICLE_MAINTENANCE: "/admin/fleet-management/vehicle-maintenance/:id",

  // FUEL CONSUMPTION RECORD
  INDEX_FUEL_CONSUMPTION: "/admin/fleet-management/fuel-request",
  CREATE_FUEL_CONSUMPTION: "/admin/fleet-management/fuel-request/create",
  VIEW_FUEL_CONSUMPTION: "/admin/fleet-management/fuel-request/:id",

  // FACILITY MAINTENANCE TICKET
  INDEX_FACILITY_MAINTENANCE: "/admin/facility-management/facility-maintenance",
  CREATE_FACILITY_MAINTENANCE:
    "/admin/facility-management/facility-maintenance/create",
  VIEW_FACILITY_MAINTENANCE:
    "/admin/facility-management/facility-maintenance/:id",

  // PAYMENT REQUEST
  INDEX_PAYMENT_REQUEST: "/admin/payment-request",
  CREATE_PAYMENT_REQUEST_SUMMARY: "/admin/payment-request/create/summary",
  CREATE_PAYMENT_REQUEST_UPLOADS: "/admin/payment-request/create/uploads",
  VIEW_PAYMENT_REQUEST: "/admin/payment-request/:id",

  // AGREEMENT
  AGREEMENT: "/admin/agreements/",

  // ASSET MAINTENANCE
  INDEX_ASSET_MAINTENANCE: "/admin/asset-maintenance",
  CREATE_ASSET_MAINTENANCE: "/admin/asset-maintenance/create",
  VIEW_ASSET_MAINTENANCE: "/admin/asset-maintenance/:id",

  // EXPENSE AUTHORIZATION
  EXPENSE_AUTHORIZATION: "/admin/expense-authorization",
  EXPENSE_AUTHORIZATION_CREATE: "/admin/expense-authorization/create",
  EXPENSE_AUTHORIZATION_DETAIL: "/admin/expense-authorization/:id",

  // TRAVEL EXPENSE REPORT
  TRAVEL_EXPENSE_REPORT: "/admin/travel-expenses-report",
  TRAVEL_EXPENSE_REPORT_CREATE: "/admin/travel-expenses-report/create",
  TRAVEL_EXPENSE_REPORT_DETAIL: "/admin/travel-expenses-report/:id",

  // ---------------------

  GRN: "/admin/inventory-management/good-receive-note",
  GRN_CREATE: "/admin/inventory-management/good-receive-note/create",
  GRN_DETAIL: "/admin/inventory-management/good-receive-note/:id",
  ITEM_REQUISITION: "/admin/inventory-management/item-requisition",
  ITEM_REQUISITION_DETAIL: "/admin/inventory-management/item-requisition/:id",
  CREATE_ITEM_REQUISITION:
    "/admin/inventory-management/item-requisition/create",
  ASSETS: "/admin/inventory-management/assets",

  CreateAssets: "/admin/inventory-management/create-assets",
  ViewAssets: "/admin/inventory-management/view-assets",

  HMO: "/admin/agrements/HM0",
  SLA: "/admin/agrements/SLA",
  Security: "/admin/agrements/security",
  Insurance: "/admin/agrements/insurance",
  Ticketing: "/admin/agrements/ticketing",
  ViewAggrement: "/admin/agrements/View-Aggrement",

  // starting new import

  //rfq routes
  RFQ: "/admin/solicitation/rfq",
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
};

export const RouteEnum = {
  // MODULES
  MODULES_PROJECTS: "/modules/project",
  MODULES_PROGRAMS: "/modules/program",
  MODULES_ADMIN: "/modules/admin",
  MODULES_CONFIG: "/modules/config",
  MODULES_PROCUREMENT: "/modules/procurement",
  MODULES_FINANCE: "/modules/finance",
  MODULES_HR: "/modules/hr",

  // ----------------------------
  //projects routes
  PROJECTS: "/projects",
  PROJECTS_DETAILS: "/projects/:id",
  PROJECTS_CREATE_SUMMARY: "/projects/create/summary",
  PROJECTS_CREATE_UPLOADS: "/projects/create/uploads",
  PROJECTS_EDIT_SUMMARY: "/projects/:id/create/summary",
  PROJECTS_EDIT_UPLOADS: "/projects/:id/create/uploads",
  // PROJECTS_CREATE_PERFORMANCE: "/projects/create/performance",

  /* -------------------------------------------- */

  // procurement routes
  DASHBOARD: "/",

  OVERVIEW: "/procurement-management/overview",

  COMPETITIVE_SELECTION:
    "/procurement-management/competitive-bid-analysis/selection",

  PAYMENT_REQUEST: "/procurement-management/payment-request",

  //purchase request routes
  PURCHASE_REQUEST: "/procurement-management/purchase-request",
  PURCHASE_REQUEST_DETAILS: "/procurement-management/purchase-request/:id",
  PURCHASE_REQUEST_FORM: "/procurement-management/purchase-request/form",
  CREATE_PURCHASE_REQUEST: "/procurement-management/create-purchase-request",
  CREATE_SAMPLE_MEMO: "/procurement-management/purchase-request/activity-memo",
  SAMPLE_PREVIEW: "/procurement-management/purchase-request/sample-preview",
  PREVIEW_LETTER: "/procurement-management/purchase-request/preview-letter",
  FINAL_PREVIEW: "/procurement-management/purchase-request/final-preview",

  //procurement routes
  PROCUREMENT_PLAN: "/procurement-management/procurement-plan",
  PROCUREMENT_PLAN_FINANCIAL_YEAR:
    "/procurement-management/procurement-plan/financial-year",
  PROCUREMENT_DETAILS: "/procurement-management/procurement-plan/:id",
  CREATE_PROCUREMENT:
    "/procurement-management/procurement-plan/create/procurement-plan",
  CREATE_PROCUREMENT_MILESTONE:
    "/procurement-management/procurement-plan/create/procurement-milestones",
  PROCUREMENT_TRACKER: "/procurement-management/procurement-tracker",

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
  PROGRAM_WORK_PLAN: "/program/plan/work-plan",
  PROGRAM_WORK_PLAN_DETAILS: "/program/plan/work-plan/:id",

  PROGRAM_ACTIVITY: "/program/plan/activity",
  PROGRAM_CREATE_ACTIVITY_PLAN: "/program/plan/create-activity-plan",

  PROGRAM_ACTIVITY_TRACKER: "/program/plan/activity-tracker",
  PROGRAM_ACTIVITY_TRACKER_CREATE:
    "/program/plan/activity-tracker/create-activity-tracker",

  PROGRAM_RISK_MANAGEMENT: "/program/plan/risk-management-plan",
  PROGRAM_RISK_MANAGEMENT_CREATE:
    "/program/plan/risk-management-plan/create-risk-management",
  PROGRAM_VALUE_MANAGEMENT: "/program/plan/value-management-plan",
  PROGRAM_SUPPORTIVE_SUPERVISION: "/program/plan/supportive-supervision-plan",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS:
    "/program/plan/supportive-supervision-plan/:id",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL:
    "/program/plan/supportive-supervision-plan/:id/approval-status",
  PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT:
    "/program/plan/supportive-supervision-plan/:id/evaluation",
  PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION:
    "/program/plan/supportive-supervision-plan/create/facility&team-composition",
  PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST:
    "/program/plan/supportive-supervision-plan/create/evolution-checklist",

  PROGRAM_FUND_REQUEST: "/program/fund-request",
  PROGRAM_FUND_REQUEST_DETAILS: "/program/fund-request/:id/",
  PROGRAM_FUND_REQUEST_CREATE: "/program/fund-request/create/project-details",
  PROGRAM_FUND_REQUEST_FUND_SUMMARY:
    "/program/fund-request/create/fund-request-summary",
  PROGRAM_FUND_REQUEST_PREVIEW:
    "/program/fund-request/create/fund-request-preview",

  PROGRAM_FUND_REQUEST_VIEW_ACTIVITY:
    "/program/fund-request/create/fund-request-preview/:id/fund-request-activity",

  PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS:
    "/program/fund-request/create/fund-request-preview/:id/view-all-fund-request",

  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS:
    "/program/stakeholder-management/analysis&mapping",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_DETAILS:
    "/program/stakeholder-management/analysis&mapping/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_CREATE:
    "/program/stakeholder-management/analysis&mapping/create-analysis/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER:
    "/program/stakeholder-management/stakeholder-register",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE:
    "/program/stakeholder-management/stakeholder-register/create-stakeholder",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_EDIT:
    "/program/stakeholder-management/stakeholder-register/edit-stakeholder/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_DETAILS:
    "/program/stakeholder-management/stakeholder-register/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN:
    "/program/stakeholder-management/engagement-plan",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_CREATE:
    "/program/stakeholder-management/engagement-plan/create-engagement-plan",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_DETAILS:
    "/program/stakeholder-management/engagement-plan/:id",
  PROGRAM_REPORT: "/program/reports",
  PROGRAM_PAYMENT_REQUEST: "/program/payment-request",

  TRAINING: "/program/training-and-procurement",
  REPORT: "/procurement-management/report",

  // users
  USERS: "/users",
  CREATE_USERS: "/users/create",
  AUTHORIZATION: "/authorization",

  // PROGRAM_OVERVIEW: "/program/overview",
  // PROGRAM_OVERVIEW: "/program/overview",

  NOTIFICATIONS: "/notifications",
  SUPPORT: "/support",
  SUPPORT_DETAILS: "/support/:id",
  ACCOUNT: "/account",
};

export const CG_ROUTES = {
  OVERVIEW: "/c-and-g/overview",
  GRANT: "/c-and-g/grant",
  GRANT_CREATE: "/c-and-g/create-grant",
  GRANT_DETAILS: "/c-and-g/grant-details/:id",

  SUBGRANT: "/c-and-g/sub-grant",
  CREATE_SUBGRANT_AWARD: "/c-and-g/sub-grant/create-sub-grant",
  SUBGRANT_AWARD_DETAILS: "/c-and-g/sub-grant/:id",
  CREATE_SUBGRANT_SUBMISSION_DETAILS:
    "/c-and-g/sub-grant/manual-submission/organization-details/:id",
  CREATE_SUBGRANT_SUBMISSION_UPLOADS:
    "/c-and-g/sub-grant/manual-submission/document-upload/:id",
  SUBGRANT_SUBMISSION_DETAILS:
    "/c-and-g/sub-grant/:subGrantId/submission/:partnerSubId",

  PREAWARD_ASSESSMENT:
    "/c-and-g/sub-grant/:subGrantId/submission/:partnerSubId/preaward-assessment",

  // close out
  CLOSE_OUT: "/c-and-g/close-out-plan",
  CLOSE_OUT_DETAILS: "/c-and-g/close-out-plan/details/:id",
  NEW_CLOSE_OUT_PLAN: "/c-and-g/close-out-plan/new-close-out-plan",

  // CONTRACT MANAGEMENT
  AGREEMENT: "/c-and-g/agreements",
  CREATE_AGREEMENT: "/c-and-g/agreements/create",
  // -------------

  // CONSULTANCY
  CONSULTANCY: "/c-and-g/consultancy",
  CREATE_CONSULTANCY_DETAILS: "/c-and-g/consultancy/create/application-details",
  CREATE_CONSULTANCY_WORK_SCOPE: "/c-and-g/consultancy/create/scope-of-work",
  CONSULTANCY_DETAILS: "/c-and-g/consultancy/:id",
  CREATE_CONSULTANCY_APPLICANT: "/c-and-g/consultancy/:id/applicant/create",

  CONSULTANCY_APPLICATION_DETAILS:
    "/api/v1/contract-grants/consultancy-applications_details/:id",
  CONSULTANCY_SHORTLIST_METRIC:
    "/api/v1/consultancy/shortlisted-applications-metrics/:id",
  CONSULTANCY_SLA: "/c-and-g/consultancy/sla",
  //   OVERVIEW: "/c-and-g/overview",

  // CONSULTANCY REPORT
  CONSULTANCY_REPORT: "/c-and-g/consultancy-report",
  CREATE_CONSULTANCY_REPORT: "/c-and-g/consultancy-report/create/",
  CONSULTANCY_REPORT_DETAILS: "/c-and-g/consultancy-report/:id/",

  // FACILITATOR MANAGEMENT
  FACILITATOR: "/c-and-g/facilitators",
  CREATE_FACILITATOR_DETAILS: "/c-and-g/facilitator/create/application-details",
  CREATE_FACILITATOR_WORK_SCOPE: "/c-and-g/facilitator/create/scope-of-work",
  FACILITATOR_DETAILS: "/c-and-g/facilitator/:id",

  CG_MODULES: "/modules/c-and-g",
};

export const HrRoutes = {
  ADVERTISEMENT: "/hr/advertisement",
  ADVERTISEMENT_ADD: "/hr/advertisement/add-advertisement",
  ADVERTISEMENT_DETAIL: "/hr/advertisement/:id",
  ADVERTISEMENT_DETAIL_SUB_APP:
    "/hr/advertisement/:id/submitted-applications/:appID",
  ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION:
    "/hr/advertisement/:id/application-form",

  ADVERTISEMENT_INTERVIEW_FORM: "/hr/advertisement/:id/interview-form/:appID",

  ADVERTISEMENT_INTERVIEW_DETAILS:
    "/hr/advertisement/:id/interview-details/:appID",

  SELECTION: "hr/selection",
  ONBOARDING: "/hr/onboarding",
  ONBOARDING_START: "/hr/onboarding/start-onboarding/:id/",
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
  WORKFORCE_DATABASE: "/hr/workforce-database",
  WORKFORCE_DATABASE_DETAIL: "/hr/workforce-database/:id",
  PERFORMANCE_MANAGEMENT: "/hr/performance-management",
  PERFORMANCE_MANAGEMENT_CREATE: "/hr/performance-management/create",
  PERFORMANCE_MANAGEMENT_DETAIL: "/hr/performance-management/:id",
  EMPLOYEE_BENEFITS_COMPENSATION: "/hr/employee-benefit/compensation",
  EMPLOYEE_BENEFITS_COMPENSATION_CREATE:
    "/hr/employee-benefit/compensation/create",
  EMPLOYEE_BENEFITS_PAY_ROLL: "/hr/employee-benefit/pay-roll",
  EMPLOYEE_BENEFITS_PAY_ROLL_INFO: "/hr/employee-benefit/pay-roll/:id",
  EMPLOYEE_BENEFITS_PAY_ROLL_CREATE: "/hr/employee-benefit/pay-roll/create",
  EMPLOYEE_BENEFITS_PAY_GROUP: "/hr/employee-benefit/pay-group",
  SEPARATION_MANAGEMENT: "/hr/separation-management",
  SEPARATION_MANAGEMENT_CREATE: "/hr/separation-management/create",
  SEPARATION_MANAGEMENT_DETAIL: "/hr/separation-management/:id",
  GRIEVANCE_MANAGEMENT: "/hr/grievance-management",
  GRIEVANCE_MANAGEMENT_CREATE: "/hr/grievance-management/create",
  GRIEVANCE_MANAGEMENT_DETAILS: "/hr/grievance-management/:id",
  LEAVE_MANAGEMENT_REQUEST_LEAVE: "/hr/leave-management/request-leave",
  LEAVE_MANAGEMENT_LEAVE_LIST: "/hr/leave-management/leave-list",
  LEAVE_MANAGEMENT_ASSIGN_LEAVE: "/hr/leave-management/assign-leave",
  LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL: "/hr/leave-management/leave-list/:id",
  LEAVE_MANAGEMENT_LEAVE_SETTINGS: "hr/leave-management/leave-settings",
  TIMESHEET_MANAGEMENT: "/hr/timesheet-management",
  TIMESHEET_MANAGEMENT_DETAIL: "/hr/timesheet-management/:id",
  TIMESHEET_MANAGEMENT_DETAIL_CREATE: "/hr/timesheet-management/:id/create",
  TIMESHEET_MANAGEMENT_CREATE:
    "/hr/timesheet-management/create-timesheet-management",
};

/* *************** PROGRAM ROUTES *************** */
export enum ProgramRoutes {
  SUPERVISION_PLAN_EVALUATION_DETAILS = "/program/plan/supportive-supervsion-plan/:supervisionPlanId/view-evaluation/",

  ADHOC_MANAGEMENT = "/program/adhoc-management/",
  CREATE_ADHOC_DETAILS = "/program/adhoc-management/create-adhoc-details/",
  CREATE_ADHOC_WORK_SCOPE = "/program/adhoc-management/create-scope-of-work/",
  ADHOC_DETAILS = "/program/adhoc-management/:id/details/",
  CREATE_ADHOC_APPLICANT = "/program/adhoc-management/:id/applicant/create/",
  ADHOC_APPLICANT_DETAILS = "/program/adhoc-management/:adhocId/applicant/:applicantId/details/",
}
