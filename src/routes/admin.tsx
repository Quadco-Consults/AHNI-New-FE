import { RouteEnum, AdminRoutes } from "constants/RouterConstants";

import { lazy } from "react";
import { Navigate } from "react-router-dom"; 

export const adminRoutes = [
  {
    path: "*",
    element: <Navigate href={RouteEnum.DASHBOARD} />,
  },

  // CONSUMABLE
  {
    path: AdminRoutes.INDEX_CONSUMABLE,
    element: lazy(
      () => import("pages/protectedPages/admin/inventory-management/consumable")
    ),
  },

  {
    path: AdminRoutes.CREATE_CONSUMABLE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/inventory-management/consumable/create"
        )
    ),
  },

  {
    path: AdminRoutes.VIEW_CONSUMABLE,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/inventory-management/consumable/id")
    ),
  },

  // ASSET REQUEST
  {
    path: AdminRoutes.ASSETS_REQUEST,
    element: lazy(() => import("pages/protectedPages/admin/asset-request")),
  },
  {
    path: AdminRoutes.ASSETS_REQUEST_CREATE,
    element: lazy(
      () => import("pages/protectedPages/admin/asset-request/create")
    ),
  },
  {
    path: AdminRoutes.ASSETS_REQUEST_UPLOAD,
    element: lazy(
      () => import("pages/protectedPages/admin/asset-request/create/uploads")
    ),
  },
  {
    path: AdminRoutes.ASSETS_REQUEST_VIEW,
    element: lazy(() => import("pages/protectedPages/admin/asset-request/id")),
  },

  //starting of import

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

  // {
  //     path: RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_START,
  //     element: lazy(
  //         () =>
  //             import(
  //                 "pages/protectedPages/procurement-management/competitive-bid-analysis/[id]/technicalPrequalificationSheet"
  //             )
  //     ),
  // },

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

  //ending of import

  // VEHICLE REQUEST
  {
    path: AdminRoutes.INDEX_VEHICLE_REQUEST,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/fleet-management/vehicle-request")
    ),
  },

  {
    path: AdminRoutes.CREATE_VEHICLE_REQUEST,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/fleet-management/vehicle-request/create"
        )
    ),
  },
  {
    path: AdminRoutes.VIEW_VEHICLE_REQUEST,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/fleet-management/vehicle-request/id")
    ),
  },

  // VEHICLE MAINTENANCE TICKET
  {
    path: AdminRoutes.INDEX_VEHICLE_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/fleet-management/vehicle-maintenance/index"
        )
    ),
  },
  {
    path: AdminRoutes.CREATE_VEHICLE_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/fleet-management/vehicle-maintenance/create"
        )
    ),
  },

  // FUEL CONSUMPTION RECORD
  {
    path: AdminRoutes.INDEX_FUEL_CONSUMPTION,
    element: lazy(
      () => import("pages/protectedPages/admin/fleet-management/fuel-request")
    ),
  },

  {
    path: AdminRoutes.CREATE_FUEL_CONSUMPTION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/fleet-management/fuel-request/create"
        )
    ),
  },

  {
    path: AdminRoutes.VIEW_FUEL_CONSUMPTION,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/fleet-management/fuel-request/id")
    ),
  },

  // FACILITY MAINTENANCE
  {
    path: AdminRoutes.INDEX_FACILITY_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/facility-management/facility-maintenance"
        )
    ),
  },
  {
    path: AdminRoutes.CREATE_FACILITY_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/facility-management/facility-maintenance/create"
        )
    ),
  },
  {
    path: AdminRoutes.VIEW_FACILITY_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/facility-management/facility-maintenance/id"
        )
    ),
  },

  // PAYMENT REQUEST
  {
    path: AdminRoutes.INDEX_PAYMENT_REQUEST,
    element: lazy(() => import("pages/protectedPages/admin/payment-request")),
  },

  {
    path: AdminRoutes.CREATE_PAYMENT_REQUEST_SUMMARY,
    element: lazy(
      () => import("pages/protectedPages/admin/payment-request/create")
    ),
  },

  {
    path: AdminRoutes.CREATE_PAYMENT_REQUEST_UPLOADS,
    element: lazy(
      () => import("pages/protectedPages/admin/payment-request/create/uploads")
    ),
  },

  {
    path: AdminRoutes.VIEW_PAYMENT_REQUEST,
    element: lazy(
      () => import("pages/protectedPages/admin/payment-request/id")
    ),
  },

  // ASSET MAINTENANCE
  {
    path: AdminRoutes.INDEX_ASSET_MAINTENANCE,
    element: lazy(() => import("pages/protectedPages/admin/asset-maintenance")),
  },

  {
    path: AdminRoutes.CREATE_ASSET_MAINTENANCE,
    element: lazy(
      () => import("pages/protectedPages/admin/asset-maintenance/create")
    ),
  },

  {
    path: AdminRoutes.VIEW_ASSET_MAINTENANCE,
    element: lazy(
      () => import("pages/protectedPages/admin/asset-maintenance/id")
    ),
  },

  {
    path: AdminRoutes.EXPENSE_AUTHORIZATION,
    element: lazy(
      () => import("pages/protectedPages/admin/expense-authorization/index")
    ),
  },
  {
    path: AdminRoutes.EXPENSE_AUTHORIZATION_CREATE,
    element: lazy(
      () => import("pages/protectedPages/admin/expense-authorization/create")
    ),
  },

  {
    path: AdminRoutes.EXPENSE_AUTHORIZATION_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/admin/expense-authorization/id")
    ),
  },

  {
    path: AdminRoutes.TRAVEL_EXPENSE_REPORT,
    element: lazy(
      () => import("pages/protectedPages/admin/travel-expenses-report/index")
    ),
  },

  {
    path: AdminRoutes.TRAVEL_EXPENSE_REPORT_CREATE,
    element: lazy(
      () => import("pages/protectedPages/admin/travel-expenses-report/create")
    ),
  },

  {
    path: AdminRoutes.TRAVEL_EXPENSE_REPORT_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/admin/travel-expenses-report/id")
    ),
  },

  // -----------------------------------------------------------------
  {
    path: AdminRoutes.OVERVIEW,
    element: lazy(() => import("pages/protectedPages/admin/Overview")),
  },

  {
    path: AdminRoutes.ITEM_REQUISITION,
    element: lazy(
      () => import("pages/protectedPages/admin/item-requisition/index")
    ),
  },
  {
    path: AdminRoutes.ITEM_REQUISITION_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/admin/item-requisition/id/index")
    ),
  },
  {
    path: AdminRoutes.CREATE_ITEM_REQUISITION,
    element: lazy(
      () => import("pages/protectedPages/admin/item-requisition/create")
    ),
  },
  {
    path: AdminRoutes.ASSETS,
    element: lazy(() => import("pages/protectedPages/admin/assets")),
  },

  {
    path: AdminRoutes.CreateAssets,
    element: lazy(() => import("pages/protectedPages/admin/assets/create")),
  },
  {
    path: AdminRoutes.ViewAssets,
    element: lazy(() => import("pages/protectedPages/admin/assets/id")),
  },

  //   {
  //     path: AdminRoutes.AGREEMENT,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement/index")),
  //   },

  //   {
  //     path: AdminRoutes.SLA,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement")),
  //   },
  //   {
  //     path: AdminRoutes.HMO,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement")),
  //   },
  //   {
  //     path: AdminRoutes.Insurance,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement")),
  //   },
  //   {
  //     path: AdminRoutes.Security,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement")),
  //   },
  //   {
  //     path: AdminRoutes.Ticketing,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement")),
  //   },
  //   {
  //     path: AdminRoutes.ViewAggrement,
  //     element: lazy(() => import("pages/protectedPages/admin/agreement/id")),
  //   },

  {
    path: AdminRoutes.VIEW_VEHICLE_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/fleet-management/vehicle-maintenance/id"
        )
    ),
  },
  {
    path: AdminRoutes.CREATE_VEHICLE_MAINTENANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/fleet-management/vehicle-maintenance/create"
        )
    ),
  },

  {
    path: AdminRoutes.GRN,
    element: lazy(
      () => import("pages/protectedPages/admin/good-receive-note/index")
    ),
  },
  {
    path: AdminRoutes.GRN_CREATE_SUMMARY,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/good-receive-note/create/summary")
    ),
  },

  {
    path: AdminRoutes.GRN_CREATE_UPLOADS,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/good-receive-note/create/uploads")
    ),
  },

  {
    path: AdminRoutes.GRN_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/admin/good-receive-note/id")
    ),
  },

  {
    path: AdminRoutes.ADMIN_TRACKER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/procurement-management/procurement-tracker"
        )
    ),
  },
];
