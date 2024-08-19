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
];
