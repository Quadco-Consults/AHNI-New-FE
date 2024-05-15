export const RouteEnum = {
  // procurement routes
  DASHBOARD: "/",

  OVERVIEW: "/procurement-management/overview",

  COMPETITIVE_ANALYSIS: "/procurement-management/competitive-bid-analysis/CBA",
  COMPETITIVE_SELECTION:
    "/procurement-management/competitive-bid-analysis/selection",

  PAYMENT_REQUEST: "/procurement-management/payment-request",

  PURCHASE_REQUEST: "/procurement-management/purchase-request",
  PURCHASE_REQUEST_DETAILS: "/procurement-management/purchase-request/:id",
  CREATE_PURCHASE_REQUEST: "/procurement-management/create-purchase-request",

  PROCUREMENT_PLAN: "/procurement-management/procurement-plan",
  PROCUREMENT_DETAILS: "/procurement-management/procurement-plan/:id",
  CREATE_PROCUREMENT:
    "/procurement-management/procurement-plan/create-procurement",
  PROCUREMENT_TRACKER: "/procurement-management/procurement-tracker",
  REPORT: "/procurement-management/report",

  RFQ: "/procurement-management/solicitation/rfq",
  RFQ_DETAILS: "/procurement-management/solicitation/rfq/:id",
  RFQ_COMPETITIVE_BID_ANALYSIS:
    "/procurement-management/solicitation/rfq/competitive-bid-analysis/:id",
  RFQ_DETAILS_BID_SUBMISSION:
    "/procurement-management/solicitation/rfq/:id/manual-bid-submission",
  OPEN_TENDER: "/procurement-management/solicitation/national-open-tender",
  SINGLE_SOURCING: "/procurement-management/solicitation/single-sourcing",

  RFQ_VENDOR: "/procurement-management/rfq-vendor",

  EOI: "/procurement-management/vendor-management/eoi",
  EOI_VIEW: "/procurement-management/vendor-management/eoi/view",
  EOI_VENDOR: "/procurement-management/vendor-management/eoi-vendor",
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
  PURCHASE_ORDER: "/procurement-management/purchase-order",
  PURCHASE_ORDER_NEW: "/procurement-management/purchase-order-new",
  SUBMISSION_OF_BIDS: "/procurement-management/submission-of-bids",
  PRICE_INTELLIGENCE: "/procurement-management/price-intelligence",
  SUPPLIER_DATABASE: "/procurement-management/supplier-database",
  //program routes
  PROGRAM_WORK_PLAN: "/program/plan/work plan",
  PROGRAM_WORK_PLAN_DETAILS: "/program/plan/work plan/:id",
  PROGRAM_ACTIVITY: "/program/plan/activity",
  PROGRAM_RISK_MANAGEMENT: "/program/plan/risk management plan",
  PROGRAM_VALUE_MANAGEMENT: "/program/plan/value management plan",
  PROGRAM_SUPPORTIVE_SUPERVISION: "/program/plan/supportive supervision plan",
  PROGRAM_SUPPORTIVE_SUPERVISION_DETAIL:
    "/program/plan/supportive supervision plan/:id",
  PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION:
    "/program/plan/supportive supervision plan/:id/facility&team-composition",
  PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST:
    "/program/plan/supportive supervision plan/:id/evolution-checklist",
  PROGRAM_FUND_REQUEST: "/program/fund request",
  PROGRAM_REPORT: "/program/reports",
  //projects routes
  PROJECTS: "/program/projects",
  TRAINING: "/program/training-and-procurement",
  PROGRAM_PAYMENT_REQUEST: "/program/payment-request",

  // PROGRAM_OVERVIEW: "/program/overview",
  // PROGRAM_OVERVIEW: "/program/overview",
};
