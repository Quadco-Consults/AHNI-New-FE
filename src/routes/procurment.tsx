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
    path: RouteEnum.COMPETITIVE_ANALYSIS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/competitive-bid-analysis/Competitive-analysis"
        )
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
          "pages/protectedPages/procurement-management/vendor-management/EOI-vendor"
        )
    ),
  },
  {
    path: RouteEnum.EOI,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/EOI"
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
        import("pages/protectedPages/procurement-management/Procurement-plan")
    ),
  },
  {
    path: RouteEnum.PROCUREMENT_PLAN_TRACKER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/Procurement-plan-tracker"
        )
    ),
  },
  {
    path: RouteEnum.PURCHASE_REQUEST,
    element: lazy(
      () =>
        import("pages/protectedPages/procurement-management/Purchase-request")
    ),
  },
  {
    path: RouteEnum.REPORT,
    element: lazy(
      () => import("pages/protectedPages/procurement-management/Report")
    ),
  },
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
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/RFQ"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/RFQ-details"
        )
    ),
  },
  {
    path: RouteEnum.RFQ_DETAILS_BID_SUBMISSION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/RFQ/Manual-bid-submission"
        )
    ),
  },
  {
    path: RouteEnum.OPEN_TENDER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/National-tender"
        )
    ),
  },
  {
    path: RouteEnum.SINGLE_SOURCING,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/solicitation-management/Single-sourcing"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_MANAGEMENT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/Prequalification"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_MANAGEMENT_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/Prequalification-details"
        )
    ),
  },
  {
    path: RouteEnum.VENDOR_MANAGEMENT_START_PREQUALIFICATION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/vendor-management/Start-prequalification"
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
      () => import("pages/protectedPages/procurement-management/Purchase-order")
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
];
