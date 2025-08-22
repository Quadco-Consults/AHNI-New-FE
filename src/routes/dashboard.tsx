import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";
import { Navigate } 

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
