import { AdminRoutes, RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";
import { Navigate } from "react-router-dom";

export const adminRoutes = [
    {
        path: "*",
        element: <Navigate to={RouteEnum.DASHBOARD} />,
    },

    // CONSUMABLE
    {
        path: AdminRoutes.INDEX_CONSUMABLE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/inventory-management/consumable"
                )
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
                import(
                    "pages/protectedPages/admin/inventory-management/consumable/id"
                )
        ),
    },

    // VEHICLE REQUEST
    {
        path: AdminRoutes.INDEX_VEHICLE_REQUEST,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/fleet-management/vehicle-request"
                )
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
                import(
                    "pages/protectedPages/admin/fleet-management/vehicle-request/id"
                )
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
            () =>
                import(
                    "pages/protectedPages/admin/fleet-management/fuel-request"
                )
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
                import(
                    "pages/protectedPages/admin/fleet-management/fuel-request/id"
                )
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
        element: lazy(
            () => import("pages/protectedPages/admin/payment-request")
        ),
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
            () =>
                import(
                    "pages/protectedPages/admin/payment-request/create/uploads"
                )
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
        element: lazy(
            () => import("pages/protectedPages/admin/asset-maintenance")
        ),
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
            () =>
                import("pages/protectedPages/admin/expense-authorization/index")
        ),
    },
    {
        path: AdminRoutes.EXPENSE_AUTHORIZATION_CREATE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/expense-authorization/create"
                )
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
            () =>
                import(
                    "pages/protectedPages/admin/travel-expenses-report/index"
                )
        ),
    },

    {
        path: AdminRoutes.TRAVEL_EXPENSE_REPORT_CREATE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/travel-expenses-report/create"
                )
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
        element: lazy(() => import("pages/protectedPages/admin/assets/view")),
    },

    {
        path: AdminRoutes.Agrements,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/Lease")
        ),
    },
    {
        path: AdminRoutes.AgrementsCreeate,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/CreateAgreement")
        ),
    },
    {
        path: AdminRoutes.SLA,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/Lease")
        ),
    },
    {
        path: AdminRoutes.HMO,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/Lease")
        ),
    },
    {
        path: AdminRoutes.Insurance,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/Lease")
        ),
    },
    {
        path: AdminRoutes.Security,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/Lease")
        ),
    },
    {
        path: AdminRoutes.Ticketing,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/Lease")
        ),
    },
    {
        path: AdminRoutes.ViewAggrement,
        element: lazy(
            () => import("pages/protectedPages/admin/Agreement/ViewAgreement")
        ),
    },

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
        path: AdminRoutes.ASSETS_REQUEST_VIEW,
        element: lazy(
            () => import("pages/protectedPages/admin/asset-request/view")
        ),
    },
    {
        path: AdminRoutes.GRN,
        element: lazy(
            () => import("pages/protectedPages/admin/good-receive-note/index")
        ),
    },
    {
        path: AdminRoutes.GRN_CREATE,
        element: lazy(
            () => import("pages/protectedPages/admin/good-receive-note/create")
        ),
    },
    {
        path: AdminRoutes.GRN_DETAIL,
        element: lazy(
            () => import("pages/protectedPages/admin/good-receive-note/id")
        ),
    },
];
