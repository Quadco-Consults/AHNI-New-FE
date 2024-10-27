import { AdminRoutes, RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";
import { Navigate } from "react-router-dom";

export const adminRoutes = [
  {
    path: "*",
    element: <Navigate to={RouteEnum.DASHBOARD} />,
  },
  {
    path: AdminRoutes.OVERVIEW,
    element: lazy(() => import("pages/protectedPages/admin/Overview")),
  },
  {
    path: AdminRoutes.CONSUMABLES,
    element: lazy(() => import("pages/protectedPages/admin/Consumables")),
  },
  {
    path: AdminRoutes.ITEM_REQUISITION,
    element: lazy(
      () => import("pages/protectedPages/admin/ItemRequisition/index")
    ),
  },
  {
    path: AdminRoutes.ITEM_REQUISITION_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/admin/ItemRequisition/id/index")
    ),
  },
  {
    path: AdminRoutes.CREATE_ITEM_REQUISITION,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/ItemRequisition/CreateItemRequisition"
        )
    ),
  },
  {
    path: AdminRoutes.ASSETS,
    element: lazy(() => import("pages/protectedPages/admin/Assets")),
  },
  {
    path: AdminRoutes.CREateConsumables,
    element: lazy(() => import("pages/protectedPages/admin/CreateConsumables")),
  },
  {
    path: AdminRoutes.CONSUMABLES_VIEW,
    element: lazy(() => import("pages/protectedPages/admin/ViewConsumables")),
  },
  {
    path: AdminRoutes.CreateAssets,
    element: lazy(() => import("pages/protectedPages/admin/AddAssets")),
  },
  {
    path: AdminRoutes.ViewAssets,
    element: lazy(() => import("pages/protectedPages/admin/ViewAssets")),
  },
  {
    path: AdminRoutes.VehicleRequest,
    element: lazy(
      () => import("pages/protectedPages/admin/FleetManagment/VehicleRequest")
    ),
  },
  {
    path: AdminRoutes.VehicleMaitenance,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/admin/FleetManagment/VehicleMaintenanceTable"
        )
    ),
  },
  {
    path: AdminRoutes.VehicleMaitenanceCreate,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/FleetManagment/VehichleMaitanace")
    ),
  },
  {
    path: AdminRoutes.FuelConsumptions,
    element: lazy(
      () => import("pages/protectedPages/admin/FleetManagment/FuelConsumption")
    ),
  },
  {
    path: AdminRoutes.FuelCreate,
    element: lazy(
      () => import("pages/protectedPages/admin/FleetManagment/CreateFuelRecord")
    ),
  },
  {
    path: AdminRoutes.FuelView,
    element: lazy(
      () => import("pages/protectedPages/admin/FleetManagment/ViewFuel")
    ),
  },
  {
    path: AdminRoutes.FuelViewDetail,
    element: lazy(
      () => import("pages/protectedPages/admin/FleetManagment/FuelTableDetail")
    ),
  },
  {
    path: AdminRoutes.NewVehicleRequest,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/FleetManagment/NewVehicleRequest")
    ),
  },
  {
    path: AdminRoutes.ViewVehicleRequest,
    element: lazy(
      () => import("pages/protectedPages/admin/FleetManagment/ViewVehicle")
    ),
  },
  {
    path: AdminRoutes.Facilities,
    element: lazy(
      () => import("pages/protectedPages/admin/FacilitiesManagment/Facilties")
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
        import("pages/protectedPages/admin/FacilitiesManagment/FacilitiesView")
    ),
  },
  {
    path: AdminRoutes.PaymentRequest,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/PaymentRequest/PaymentRequestList")
    ),
  },
  {
    path: AdminRoutes.PaymentRequestCreate,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/PaymentRequest/PaymentRequestCreate")
    ),
  },
  {
    path: AdminRoutes.PaymentRequestUpload,
    element: lazy(
      () =>
        import("pages/protectedPages/admin/PaymentRequest/FileUploadRequest")
    ),
  },
  {
    path: AdminRoutes.PaymentRequestView,
    element: lazy(
      () => import("pages/protectedPages/admin/PaymentRequest/PaymentView")
    ),
  },
  {
    path: AdminRoutes.Agrements,
    element: lazy(() => import("pages/protectedPages/admin/Agreement/Lease")),
  },
  {
    path: AdminRoutes.AgrementsCreeate,
    element: lazy(
      () => import("pages/protectedPages/admin/Agreement/CreateAgreement")
    ),
  },
  {
    path: AdminRoutes.SLA,
    element: lazy(() => import("pages/protectedPages/admin/Agreement/Lease")),
  },
  {
    path: AdminRoutes.HMO,
    element: lazy(() => import("pages/protectedPages/admin/Agreement/Lease")),
  },
  {
    path: AdminRoutes.Insurance,
    element: lazy(() => import("pages/protectedPages/admin/Agreement/Lease")),
  },
  {
    path: AdminRoutes.Security,
    element: lazy(() => import("pages/protectedPages/admin/Agreement/Lease")),
  },
  {
    path: AdminRoutes.Ticketing,
    element: lazy(() => import("pages/protectedPages/admin/Agreement/Lease")),
  },
  {
    path: AdminRoutes.ViewAggrement,
    element: lazy(
      () => import("pages/protectedPages/admin/Agreement/ViewAgreement")
    ),
  },
  {
    path: AdminRoutes.ASSET_MAINTENANCE,
    element: lazy(() => import("pages/protectedPages/admin/AssetMaintenance")),
  },
  {
    path: AdminRoutes.ASSET_MAINTENANCE_VIEW,
    element: lazy(
      () => import("pages/protectedPages/admin/AssetMaintenanceView")
    ),
  },
  {
    path: AdminRoutes.ASSET_MAINTENANCE_CREATE,
    element: lazy(
      () => import("pages/protectedPages/admin/AssetMaintenanceCreate")
    ),
  },
  {
    path: AdminRoutes.ASSETS_REQUEST,
    element: lazy(() => import("pages/protectedPages/admin/AssestRequest")),
  },
  {
    path: AdminRoutes.ASSETS_REQUEST_CREATE,
    element: lazy(() => import("pages/protectedPages/admin/AddAssetRequest")),
  },
  {
    path: AdminRoutes.ASSETS_REQUEST_VIEW,
    element: lazy(() => import("pages/protectedPages/admin/ViewAssetRequest")),
  },
  {
    path: AdminRoutes.GRN,
    element: lazy(() => import("pages/protectedPages/admin/GRN/index")),
  },
  {
    path: AdminRoutes.GRN_CREATE,
    element: lazy(() => import("pages/protectedPages/admin/GRN/CreateGRN")),
  },
  {
    path: AdminRoutes.GRN_DETAIL,
    element: lazy(() => import("pages/protectedPages/admin/GRN/id/index")),
  },
  {
    path: AdminRoutes.EXPENSE_AUTHORIZATION,
    element: lazy(
      () => import("pages/protectedPages/admin/ExpenseAuthorization/index")
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
      () => import("pages/protectedPages/admin/ExpenseAuthorization/id/index")
    ),
  },
];
