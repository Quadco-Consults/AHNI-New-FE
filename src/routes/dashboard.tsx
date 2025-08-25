import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";
import { Navigate } from "react-router-dom"; 

export const dashboard = [
  {
    path: "*",
    element: <Navigate href={RouteEnum.DASHBOARD} />,
  },
  {
    path: RouteEnum.DASHBOARD,
    element: lazy(() => import("pages/protectedPages/dashboard/Dashboard")),
  },
];
