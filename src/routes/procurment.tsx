import { RouteEnum } from "constants/RouterConstants";
import { lazy } from "react";

export const procurment = [
  {
    path: RouteEnum.OVERVIEW,
    element: lazy(
      () => import("pages/protectedPages/procurement-management/Overview")
    ),
  },
  {
    path: RouteEnum.COMPETITIVE_SELECTION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/Selection"
        )
    ),
  },
  {
    path: RouteEnum.EOI_VENDOR,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/eoi/EOI-vendor"
        )
    ),
  },
  {
    path: RouteEnum.EOI,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/eoi/EOI"
        )
    ),
  },
  {
    path: RouteEnum.EOI_VIEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/eoi/id"
        )
    ),
  },
  {
    path: RouteEnum.PAYMENT_REQUEST,
    element: lazy(
      () =>
        import("pages/protectedPages/procurement-management/Payment-request")
    ),
  },
  {
    path: RouteEnum.PROCUREMENT_PLAN,
    element: lazy(
      () =>
        import("pages/protectedPages/procurement-management/procurement-plan/")
    ),
  },
  {
    path: RouteEnum.PROCUREMENT_PLAN_FINANCIAL_YEAR,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/procurement-plan/id/financial-year"
        )
    ),
  },
  {
    path: RouteEnum.PROCUREMENT_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/procurement-plan/id"
        )
    ),
  },
  {
    path: RouteEnum.CREATE_PROCUREMENT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/procurement-plan/create-procurement/forms/ProcurementPlansForm"
        )
    ),
  },
  {
    path: RouteEnum.CREATE_PROCUREMENT_MILESTONE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/procurement-plan/create-procurement/forms/ProcurementMilestonesForm"
        )
    ),
  },

  // {
  //   path: RouteEnum.PROCUREMENT_PLAN_TRACKER,
  //   element: lazy(
  //     () =>
  //       import(
  //         "pages/protectedPages/procurement-management/Procurement-plan-tracker"
  //       )
  //   ),
  // },
  {
    path: RouteEnum.PROCUREMENT_TRACKER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/procurement-tracker"
        )
    ),
  },
  {
    path: RouteEnum.PURCHASE_REQUEST,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/index"
        )
    ),
  },
  {
    path: RouteEnum.PENDING_PURCHASE_REQUEST,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/PurchaseRequest"
        )
    ),
  },
  {
    path: RouteEnum.CREATE_PURCHASE_REQUEST,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/create-purchase-request/index"
        )
    ),
  },
  {
    path: RouteEnum.CREATE_SAMPLE_MEMO,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/activity-memo/index"
        )
    ),
  },
  {
    path: RouteEnum.SAMPLE_PREVIEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/activity-memo/preview"
        )
    ),
  },
  {
    path: RouteEnum.PREVIEW_LETTER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/activity-memo/preview-letter"
        )
    ),
  },
  {
    path: RouteEnum.FINAL_PREVIEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/activity-memo/final-preview"
        )
    ),
  },

  {
    path: RouteEnum.PURCHASE_REQUEST_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/id/"
        )
    ),
  },
  {
    path: RouteEnum.PURCHASE_REQUEST_FORM,
    element: lazy(
      () =>
        import(
          // "pages/protectedPages/procurement-management/purchase-request/create-purchase-request/index"

          "pages/protectedPages/procurement-management/purchase-request/create-purchase-request/request-form"
        )
    ),
  },
  {
    path: RouteEnum.CREATE_PURCHASE_REQUEST,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-request/create-purchase-request"
        )
    ),
  },
  {
    path: RouteEnum.REPORT,
    element: lazy(
      () => import("pages/protectedPages/procurement-management/Report")
    ),
  },

  // RFQ

  {
    path: RouteEnum.RFQ_VENDOR,
    element: lazy(
      () => import("pages/protectedPages/procurement-management/RFQ-vendor")
    ),
  },
  {
    path: RouteEnum.RFQ,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ"
        )
    ),
  },

  {
    path: RouteEnum.RFQ_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/[id]"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_DETAILS_BID_SUBMISSION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/[id]/Manual-bid-submission"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_CREATE_QUOTATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/create/Quotation"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_CREATE_QUOTATION_OPEN_TENDER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/create/Quotation"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_CREATE_ITEMS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/create/Items"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_CREATE_CBA,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/create/CreateCBA"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_COMPETITIVE_BID_ANALYSIS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/start-competitiveBidAnalysis"
        )
    ),
  },
  {
    path: RouteEnum.COMPETITIVE_BID_ANALYSIS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/index"
        )
    ),
  },
  {
    path: RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/index"
        )
    ),
  },
  {
    path: RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/CheckApproval"
        )
    ),
  },

  {
    path: RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_START,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/TechnicalPrequalificationSheet"
        )
    ),
  },
  {
    path: RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_FINANCIAL_BID_OPENING,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/FinancialBiding"
        )
    ),
  },
  {
    path: RouteEnum.SUMMARY_OF_TECHNICAL_PREQUALIFICATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/SummaryOfTechnicalPrequalification"
        )
    ),
  },

  // RFP
  {
    path: RouteEnum.RFP,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFP"
        )
    ),
  },

  {
    path: RouteEnum.RFP_CREATE_PROPOSAL,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFP/create/Proposal"
        )
    ),
  },
  {
    path: RouteEnum.RFP_CREATE_UPLOADS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFP/create/Uploads"
        )
    ),
  },

  {
    path: RouteEnum.RFP_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFP/[id]/index"
        )
    ),
  },
  // Vendor Management
  {
    path: RouteEnum.VENDOR_MANAGEMENT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/prequalification"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_REGISTRATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/vendor-registration/Registration"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_COMPANY,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/vendor-registration/Company"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_TECHNICAL,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/vendor-registration/Technical"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_QUESTIONER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/vendor-registration/Questionier"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_ATTESTATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/vendor-registration/Attestation"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_UPLOAD,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/vendor-registration/Upload"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_MANAGEMENT_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/prequalification/id"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_MANAGEMENT_START_PREQUALIFICATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/prequalification/id/Start-prequalification"
        )
    ),
  },
  {
    path: RouteEnum.PRICE_INTELLIGENCE,
    element: lazy(
      () =>
        import("pages/protectedPages/procurement-management/Price-intelligence")
    ),
  },
  {
    path: RouteEnum.PURCHASE_ORDER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-order/index"
        )
    ),
  },
  {
    path: RouteEnum.PURCHASE_ORDER_ID,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-order/[id]/"
        )
    ),
  },
  {
    path: RouteEnum.PURCHASE_ORDER_ID_TERMS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-order/[id]/TermsAndConditions"
        )
    ),
  },
  {
    path: RouteEnum.PURCHASE_ORDER_NEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/purchase-order/PurchaseOrderNew"
        )
    ),
  },
  {
    path: RouteEnum.SUBMISSION_OF_BIDS,
    element: lazy(
      () =>
        import("pages/protectedPages/procurement-management/Submission-of-bids")
    ),
  },
  {
    path: RouteEnum.SUPPLIER_DATABASE,
    element: lazy(
      () =>
        import("pages/protectedPages/procurement-management/Supplier-database")
    ),
  },
  {
    path: RouteEnum.VENDOR_PERFORMANCE_EVALUATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-performance/index"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_PERFORMANCE_EVALUATION_ID,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-performance/id/index"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_PERFORMANCE_EVALUATION_FORM,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-performance/form/index"
        )
    ),
  },

  {
    path: RouteEnum.VENDOR_PERFORMANCE_START_EVALUATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-performance/id/InterviewForm"
        )
    ),
  },
];
