import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const users = [
  {
    path: RouteEnum.USERS,
    element: lazy(() => import("pages/protectedPages/Users/UsersList")),
  },
  {
    path: RouteEnum.CREATE_USERS,
    element: lazy(() => import("pages/protectedPages/Users/CreateUsers")),
  },
  {
    path: RouteEnum.AUTHORIZATION,
    element: lazy(() => import("pages/protectedPages/Users/Authorization")),
  },
  {
    path: RouteEnum.AUDIT_LOG,
    element: lazy(() => import("pages/protectedPages/audit-log/index")),
  },
];
