export const AuthRoutes = {
  LOGIN: "/auth/login",
};

export const AdminRoutes = {
  OVERVIEW: "/admin/overview",
  CONSUMABLES: "/admin/inventory-managment/consumables",
  CONSUMABLES_VIEW: "/admin/inventory-managment/consumables/view",
  ASSETS: "/admin/inventory-managment/assets",
  CREateConsumables: "/admin/inventory-managment/create-consumables",
  CreateAssets: "/admin/inventory-managment/create-assets",
  ViewAssets: "/admin/inventory-managment/view-assets",
  VehicleRequest: "/admin/fleet-managment/vehichle-request",
  VehicleMaitenance: "/admin/fleet-managment/vehicle-maintenance",
  FuelConsumptions: "/admin/fleet-managment/fuel-request",
  FuelView: "/admin/fleet-managment/fuel/View-Fuel",
  FuelCreate: "/admin/fleet-managment/fuel-request/create",
  NewVehicleRequest: "/admin/fleet-managment/new-vehicle-request",
  ViewVehicleRequest: "/admin/fleet-managment/vehicle",
  Facilities: "/admin/facilities/facilities-list",
  FacilitiesTicket: "/admin/facilities/facilities-ticket",
  FacilitiesView: "/admin/facilities/facilities-view",
  PaymentRequest: "/admin/payment-request/payment-list",
  PaymentRequestCreate: "/admin/payment-request/Create-Payment",
  PaymentRequestView: "/admin/payment-request/View-Payment",
  Agrements: "/admin/agrements",
  AgrementsCreeate: "/admin/agrements/create",
  HMO: "/admin/agrements/HM0",
  SLA: "/admin/agrements/SLA",
  Security: "/admin/agrements/security",
  Insurance: "/admin/agrements/insurance",
  Ticketing: "/admin/agrements/ticketing",
  ViewAggrement: "/admin/agrements/View-Aggrement",
};

export const RouteEnum = {
  // procurement routes
  DASHBOARD: "/",

  OVERVIEW: "/procurement-management/overview",

  COMPETITIVE_SELECTION: "/procurement-management/competitive-bid-analysis/selection",

  PAYMENT_REQUEST: "/procurement-management/payment-request",

  //purchase request routes
  PURCHASE_REQUEST: "/procurement-management/purchase-request",
  PURCHASE_REQUEST_DETAILS: "/procurement-management/purchase-request/:id",
  CREATE_PURCHASE_REQUEST: "/procurement-management/create-purchase-request",

  //procurement routes
  PROCUREMENT_PLAN: "/procurement-management/procurement-plan",
  PROCUREMENT_DETAILS: "/procurement-management/procurement-plan/:id",
  CREATE_PROCUREMENT: "/procurement-management/procurement-plan/create/procurement-plan",
  CREATE_PROCUREMENT_MILESTONE: "/procurement-management/procurement-plan/create/procurement-milestones",
  PROCUREMENT_TRACKER: "/procurement-management/procurement-tracker",
  PROCUREMENT_TRACKER_DETAIL: "/procurement-management/procurement-tracker/:id",

  //rfq routes
  RFQ: "/procurement-management/solicitation/rfq",
  RFQ_CREATE_QUOTATION: "/procurement-management/solicitation/rfq/create/quotation",
  RFQ_CREATE_ITEMS: "/procurement-management/solicitation/rfq/create/items",
  RFQ_DETAILS: "/procurement-management/solicitation/rfq/:id",
  RFQ_CREATE_CBA: "/procurement-management/solicitation/rfq/:id/create-cba",
  RFQ_COMPETITIVE_BID_ANALYSIS: "/procurement-management/solicitation/rfq/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION: "/procurement-management/solicitation/rfq/:id/manual-bid-submission",
  RFQ_VENDOR: "/procurement-management/rfq-vendor",

  //competitive bid analysis routes
  COMPETITIVE_BID_ANALYSIS: "/procurement-management/competitive-bid-analysis",
  COMPETITIVE_BID_ANALYSIS_DETAILS: "/procurement-management/competitive-bid-analysis/:id",
  COMPETITIVE_BID_ANALYSIS_DETAILS_START: "/procurement-management/competitive-bid-analysis/:id/start",

  //eoi routes
  EOI: "/procurement-management/vendor-management/eoi",
  EOI_VIEW: "/procurement-management/vendor-management/eoi/:id",
  EOI_VENDOR: "/procurement-management/vendor-management/eoi-vendor",

  //vendor-management routes
  VENDOR_MANAGEMENT: "/procurement-management/vendor-management/prequalification",
  VENDOR_REGISTRATION: "/procurement-management/vendor-management/vendor-registration",
  VENDOR_COMPANY: "/procurement-management/vendor-management/the-company",
  VENDOR_TECHNICAL: "/procurement-management/vendor-management/technical-capacity",
  VENDOR_QUESTIONER: "/procurement-management/vendor-management/questionnaire",
  VENDOR_ATTESTATION: "/procurement-management/vendor-management/attestation",
  VENDOR_UPLOAD: "/procurement-management/vendor-management/upload",
  VENDOR_MANAGEMENT_DETAILS: "/procurement-management/vendor-management/prequalification/:id",
  VENDOR_MANAGEMENT_START_PREQUALIFICATION: "/procurement-management/vendor-management/prequalification/:id/start-prequalification",

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
  PROGRAM_WORK_PLAN_DETAILS: "/program/plan/work-plan/:partner_id/:project_id/:financial_year",
  PROGRAM_ACTIVITY: "/program/plan/activity",
  PROGRAM_RISK_MANAGEMENT: "/program/plan/risk-management-plan",
  PROGRAM_RISK_MANAGEMENT_CREATE: "/program/plan/risk-management-plan/create-risk-management",
  PROGRAM_VALUE_MANAGEMENT: "/program/plan/value-management-plan",
  PROGRAM_SUPPORTIVE_SUPERVISION: "/program/plan/supportive-supervision-plan",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS: "/program/plan/supportive-supervision-plan/:id",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL: "/program/plan/supportive-supervision-plan/:id/approval-status",
  PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT: "/program/plan/supportive-supervision-plan/:id/evaluation",
  PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION: "/program/plan/supportive-supervision-plan/create/facility&team-composition",
  PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST: "/program/plan/supportive-supervision-plan/create/evolution-checklist",
  PROGRAM_FUND_REQUEST: "/program/fund-request",
  PROGRAM_FUND_REQUEST_DETAILS: "/program/fund-request/:id/:month_year",
  PROGRAM_FUND_REQUEST_CREATE: "/program/fund-request/create/project-details",
  PROGRAM_FUND_REQUEST_FUND_SUMMARY: "/program/fund-request/create/fund-request-summary",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS: "/program/stakeholder-management/analysis&mapping",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_DETAILS: "/program/stakeholder-management/analysis&mapping/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_CREATE: "/program/stakeholder-management/analysis&mapping/create-analysis/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER: "/program/stakeholder-management/stakeholder-register",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE: "/program/stakeholder-management/stakeholder-register/create-stakeholder",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_EDIT: "/program/stakeholder-management/stakeholder-register/edit-stakeholder/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_DETAILS: "/program/stakeholder-management/stakeholder-register/:id",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN: "/program/stakeholder-management/engagement-plan",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_CREATE: "/program/stakeholder-management/engagement-plan/create-stakeholder",
  PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_DETAILS: "/program/stakeholder-management/engagement-plan/:id",
  PROGRAM_REPORT: "/program/reports",
  PROGRAM_PAYMENT_REQUEST: "/program/payment-request",

  //projects routes
  PROJECTS: "/projects",
  PROJECTS_DETAILS: "/projects/:id",
  PROJECTS_CREATE_SUMMARY: "/projects/create-projects/summary",
  PROJECTS_CREATE_UPLOADS: "/projects/create-projects/uploads",
  PROJECTS_EDIT_SUMMARY: "/projects/:id/edit-projects/summary",
  PROJECTS_EDIT_UPLOADS: "/projects/:id/edit-projects/uploads",
  // PROJECTS_CREATE_PERFORMANCE: "/projects/create-projects/performance",

  TRAINING: "/program/training-and-procurement",
  REPORT: "/procurement-management/report",

  // users
  USERS: "/users",
  CREATE_USERS: "/users/create",
  AUTHORIZATION: "/authorization",

  // modules
  MODULES_PROJECTS: "/modules-projects",
  MODULES_PROGRAMS: "/modules-programs",

  // PROGRAM_OVERVIEW: "/program/overview",
  // PROGRAM_OVERVIEW: "/program/overview",
};

export const CandGRoutes = {
  OVERVIEW: "/c-and-g/overview",
  GRANT: "/c-and-g/grant",
  NEW_GRANT: "/c-and-g/new-grant",
  GRANT_DETAILS: "/c-and-g/grant-details/:id",
  // sub grant
  SUB_GRANT: "/c-and-g/sub-grant",
  NEW_SUB_GRANT: "/c-and-g/sub-grant/new",
  SUB_GRANT_DETAILS: "/c-and-g/sub-grant-details/:id",
  MANUAL_SUB_GRANT_SUBMISSION: "/c-and-g/sub-grant/manual-submission/organization-details/:id",
  MANUAL_SUB_GRANT_SUBMISSION_DOCS: "/c-and-g/sub-grant/manual-submission/document-upload/:id",
  SUBMITTED_APPLICATIONS: "/c-and-g/sub-grant/submitted-applications/:id",
  // close out
  CLOSE_OUT: "/c-and-g/close-out-plan",
  CLOSE_OUT_DETAILS: "/c-and-g/close-out-plan/details/:id",
  NEW_CLOSE_OUT_PLAN: "/c-and-g/close-out-plan/new-grant",
  CONSULTANCY: "/c-and-g/consultancy",
  NEW_CONSULTANCY: "/c-and-g/consultancy/create-new-consultancy/application-details",
  NEW_CONSULTANCY_SCOPE: "/c-and-g/consultancy/create-new-consultancy/scope-of-work",
  CONSULTANCY_DETAILS: "/c-and-g/consultancy/details/:id",
  CONSULTANCY_SLA: "/c-and-g/consultancy/sla",
  //   OVERVIEW: "/c-and-g/overview",
};
