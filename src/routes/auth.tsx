import { AuthRoutes, RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";
import { Navigate } from "react-router-dom";

export const auth = [
  {
    path: AuthRoutes.LOGIN,
    element: lazy(() => import("pages/Auth/Login")),
  },
];
