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
];
