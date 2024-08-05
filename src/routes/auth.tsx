import { AuthRoutes } from "constants/RouterConstants";

import { lazy } from "react";

export const auth = [
  {
    path: AuthRoutes.LOGIN,
    element: lazy(() => import("pages/Auth/Login")),
  },
];
