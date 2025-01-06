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
        path: AdminRoutes.Facilities,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/FacilitiesManagment/Facilties"
                )
        ),
    },
    {
        path: AdminRoutes.FacilitiesTicket,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/FacilitiesManagment/FacilitiesMaintanance"
                )
        ),
    },
    {
        path: AdminRoutes.FacilitiesView,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/FacilitiesManagment/FacilitiesView"
                )
        ),
    },
    {
        path: AdminRoutes.PaymentRequest,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/PaymentRequest/PaymentRequestList"
                )
        ),
    },
    {
        path: AdminRoutes.PaymentRequestCreate,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/PaymentRequest/PaymentRequestCreate"
                )
        ),
    },
    {
        path: AdminRoutes.PaymentRequestUpload,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/PaymentRequest/FileUploadRequest"
                )
        ),
    },
    {
        path: AdminRoutes.PaymentRequestView,
        element: lazy(
            () =>
                import("pages/protectedPages/admin/PaymentRequest/PaymentView")
        ),
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
        element: lazy(
            () => import("pages/protectedPages/admin/asset-requests")
        ),
    },
    {
        path: AdminRoutes.ASSETS_REQUEST_CREATE,
        element: lazy(
            () => import("pages/protectedPages/admin/asset-requests/create")
        ),
    },
    {
        path: AdminRoutes.ASSETS_REQUEST_VIEW,
        element: lazy(
            () => import("pages/protectedPages/admin/asset-requests/view")
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
            () => import("pages/protectedPages/admin/good-receive-note/id/view")
        ),
    },
    {
        path: AdminRoutes.EXPENSE_AUTHORIZATION,
        element: lazy(
            () =>
                import("pages/protectedPages/admin/ExpenseAuthorization/index")
        ),
    },
    {
        path: AdminRoutes.EXPENSE_AUTHORIZATION_CREATE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/ExpenseAuthorization/ExpenseAuthorizationCreate"
                )
        ),
    },

    {
        path: AdminRoutes.EXPENSE_AUTHORIZATION_DETAIL,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/ExpenseAuthorization/id/index"
                )
        ),
    },

    // ---------------------------------------
    {
        path: AdminRoutes.TravelExpensesReportHome,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/admin/travel-expenses-report/index"
                )
        ),
    },
];
