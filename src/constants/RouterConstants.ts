export const AuthRoutes = {
  LOGIN: "/auth/login",
};

export const AdminRoutes = {
  OVERVIEW: "/admin/overview",

  // CONSUMABLE
  INDEX_CONSUMABLE: "/admin/inventory-management/consumable",
  CREATE_CONSUMABLE: "/admin/inventory-management/create",
  VIEW_CONSUMABLE: "/admin/inventory-management/consumables/:id",

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
  CREATE_PAYMENT_REQUEST: "/admin/payment-request/create",
  // PaymentRequestUpload: "/admin/payment-request/file-updload",
  VIEW_PAYMENT_REQUEST: "/admin/payment-request/:id",

  // ASSET MAINTENANCE
  INDEX_ASSET_MAINTENANCE: "/admin/asset-maintenance",
  CREATE_ASSET_MAINTENANCE: "/admin/asset-maintenance/create",
  VIEW_ASSET_MAINTENANCE: "/admin/asset-maintenance/:id",

  // ---------------------

  EXPENSE_AUTHORIZATION: "/admin/expense-authorization",
  EXPENSE_AUTHORIZATION_CREATE: "/admin/expense-authorization/create",
  EXPENSE_AUTHORIZATION_DETAIL: "/admin/expense-authorization/:id",

  GRN: "/admin/inventory-management/good-receive-note",
  GRN_CREATE: "/admin/inventory-management/good-receive-note/create",
  GRN_DETAIL: "/admin/inventory-management/good-receive-note/:id",
  ITEM_REQUISITION: "/admin/inventory-management/item-requisition",
  ITEM_REQUISITION_DETAIL: "/admin/inventory-management/item-requisition/:id",
  CREATE_ITEM_REQUISITION:
    "/admin/inventory-management/item-requisition/create",
  ASSETS: "/admin/inventory-management/assets",
  ASSETS_REQUEST: "/admin/inventory-management/assets-request",
  ASSETS_REQUEST_CREATE: "/admin/inventory-management/assets-request/create",
  ASSETS_REQUEST_VIEW: "/admin/inventory-management/assets-request-view",

  CreateAssets: "/admin/inventory-management/create-assets",
  ViewAssets: "/admin/inventory-management/view-assets",

  Agrements: "/admin/agrements",
  AgrementsCreeate: "/admin/agrements/create",
  HMO: "/admin/agrements/HM0",
  SLA: "/admin/agrements/SLA",
  Security: "/admin/agrements/security",
  Insurance: "/admin/agrements/insurance",
  Ticketing: "/admin/agrements/ticketing",
  ViewAggrement: "/admin/agrements/View-Aggrement",

  // ----------------------------------------
  TravelExpensesReportHome: "/admin/travel-expenses-report",
};

export const RouteEnum = {
  // MODULES
  MODULES_PROJECTS: "/modules/project",
  MODULES_PROGRAMS: "/modules/program",
  MODULES_ADMIN: "/modules/admin",
  MODULES_CONFIG: "/modules/config",
  MODULES_PROCUREMENT: "/modules/procurement",
  MODULES_FINANCE: "/modules/finance",

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
  CREATE_SAMPLE_MEMO: "/procurement-management/purchase-request/sample-memo",
  SAMPLE_PREVIEW: "/procurement-management/purchase-request/sample-preview",
  PREVIEW_LETTER: "/procurement-management/purchase-request/preview-letter",
  FINAL_PREVIEW: "/procurement-management/purchase-request/final-preview",

  //procurement routes
  PROCUREMENT_PLAN: "/procurement-management/procurement-plan",
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
  RFQ_CREATE_CBA: "/procurement-management/solicitation/rfq/:id/create-cba",
  RFQ_COMPETITIVE_BID_ANALYSIS:
    "/procurement-management/solicitation/rfq/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION:
    "/procurement-management/solicitation/rfq/:id/manual-bid-submission",
  RFQ_VENDOR: "/procurement-management/rfq-vendor",

  //competitive bid analysis routes
  COMPETITIVE_BID_ANALYSIS: "/procurement-management/competitive-bid-analysis",
  COMPETITIVE_BID_ANALYSIS_DETAILS:
    "/procurement-management/competitive-bid-analysis/:id",
  COMPETITIVE_BID_ANALYSIS_DETAILS_START:
    "/procurement-management/competitive-bid-analysis/:id/start",

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
  PURCHASE_ORDER_NEW: "/procurement-management/purchase-order-new",

  SUBMISSION_OF_BIDS: "/procurement-management/submission-of-bids",
  PRICE_INTELLIGENCE: "/procurement-management/price-intelligence",

  //supplier database routes
  SUPPLIER_DATABASE: "/procurement-management/supplier-database",
  SUPPLIER_DATABASE_DETAIL: "/procurement-management/supplier-database/:id",

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
};

export const CandGRoutes = {
  OVERVIEW: "/c-and-g/overview",
  GRANT: "/c-and-g/grant",
  AGREEMENT: "/c-and-g/agreement",
  NEW_GRANT: "/c-and-g/new-grant",
  GRANT_DETAILS: "/c-and-g/grant-details/:id",
  // sub grant
  SUB_GRANT: "/c-and-g/sub-grant",
  NEW_SUB_GRANT: "/c-and-g/sub-grant/new",
  SUB_GRANT_DETAILS: "/c-and-g/sub-grant-details/:id",
  MANUAL_SUB_GRANT_SUBMISSION:
    "/c-and-g/sub-grant/manual-submission/organization-details/:id",
  MANUAL_SUB_GRANT_SUBMISSION_DOCS:
    "/c-and-g/sub-grant/manual-submission/document-upload/:id",
  SUBMITTED_APPLICATIONS: "/c-and-g/sub-grant/submitted-applications/:id",
  ////// pre award assessment
  PRE_AWARD_ASSESSMENT: "/c-and-g/sub-grant/pre-award-assessment",
  PRE_AWARD_ASSESSMENT_SINGLE: "/c-and-g/sub-grant/pre-award-assessment/:id",
  PRE_AWARD_ASSESSMENT_STEP_1: "/c-and-g/sub-grant/pre-award-assessment_1/:id",
  PRE_AWARD_ASSESSMENT_STEP_2: "/c-and-g/sub-grant/pre-award-assessment_2/:id",
  PRE_AWARD_ASSESSMENT_STEP_3:
    "/c-and-g/sub-grant/pre-award-assessment_3/:id/:result",
  PRE_AWARD_ASSESSMENT_STEP_4: "/c-and-g/sub-grant/pre-award-assessment_3/:id",

  // close out
  CLOSE_OUT: "/c-and-g/close-out-plan",
  CLOSE_OUT_DETAILS: "/c-and-g/close-out-plan/details/:id",
  NEW_CLOSE_OUT_PLAN: "/c-and-g/close-out-plan/new-grant",

  // consultancy
  CONSULTANCY: "/c-and-g/consultancy",
  NEW_CONSULTANCY:
    "/c-and-g/consultancy/create-new-consultancy/application-details",
  NEW_CONSULTANCY_SCOPE:
    "/c-and-g/consultancy/create-new-consultancy/scope-of-work",
  CONSULTANCY_DETAILS: "/c-and-g/consultancy/details/:id",
  ADD_CONSULTANCY_APPLICATION:
    "/api/v1/contract-grants/consultancy-applications/:id",
  CONSULTANCY_APPLICATION_DETAILS:
    "/api/v1/contract-grants/consultancy-applications_details/:id",
  CONSULTANCY_SHORTLIST_METRIC:
    "/api/v1/consultancy/shortlisted-applications-metrics/:id",
  CONSULTANCY_SLA: "/c-and-g/consultancy/sla",
  //   OVERVIEW: "/c-and-g/overview",
};

export const HrRoutes = {
  ADVERTISEMENT: "/hr/advertisement",
  ADVERTISEMENT_ADD: "/hr/advertisement/add-advertisement",
  ADVERTISEMENT_DETAIL: "/hr/advertisement/:id",
  ADVERTISEMENT_DETAIL_SUB_APP:
    "/hr/advertisement/:id/submitted-applications/:appID",
  ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION:
    "/hr/advertisement/:id/application-form",

  ADVERTISEMENT_INTERVIEW_FORM: "/hr/advertisement/:id/interview-form",
  ONBOARDING: "/hr/onboarding",
  ONBOARDING_START: "/hr/onboarding/start-onboarding",
  ONBOARDING_ADD_EMPLOYEE_INFO:
    "/hr/onboarding/add-employee/employee-information",
  ONBOARDING_ADD_EMPLOYEE_ADD:
    "/hr/onboarding/add-employee/additional-information",
  ONBOARDING_ADD_EMPLOYEE_BENEFICIARY:
    "/hr/onboarding/add-employee/beneficiary-designation",
  ONBOARDING_ADD_EMPLOYEE_ID_CARD:
    "/hr/onboarding/add-employee/id-card-information",
  ONBOARDING_ADD_EMPLOYEE_SALARY:
    "/hr/onboarding/add-employee/salary-account-details",
  ONBOARDING_ADD_EMPLOYEE_PENSION:
    "/hr/onboarding/add-employee/pension-scheme-enrolment",
  WORKFORCE_DATABASE: "/hr/workforce-database",
  WORKFORCE_DATABASE_DETAIL: "/hr/workforce-database/:id",
  PERFORMANCE_MANAGEMENT: "/hr/performance-management",
  EMPLOYEE_BENEFITS: "/hr/employee_benefit",
  SEPARATION_MANAGEMENT: "/hr/separation-management",
  SEPARATION_MANAGEMENT_CREATE: "/hr/separation-management/create",
  SEPARATION_MANAGEMENT_DETAIL: "/hr/separation-management/:id",
  GRIEVANCE_MANAGEMENT: "/hr/grievance-management",
  LEAVE_MANAGEMENT: "/hr/leave-management",
  TIMESHEET_MANAGEMENT: "/hr/timesheet-management",
  TIMESHEET_MANAGEMENT_DETAIL: "/hr/timesheet-management/:id",
  TIMESHEET_MANAGEMENT_DETAIL_CREATE: "/hr/timesheet-management/:id/create",
  TIMESHEET_MANAGEMENT_CREATE:
    "/hr/timesheet-management/create-timesheet-management",
};
