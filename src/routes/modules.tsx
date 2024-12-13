import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const modules = [
  {
    path: RouteEnum.MODULES_PROJECTS,
    element: lazy(() => import("pages/protectedPages/modules/projects")),
  },

  {
    path: RouteEnum.MODULES_PROGRAMS,
    element: lazy(() => import("pages/protectedPages/modules/programs")),
  },
  
  {
    path: RouteEnum.MODULES_ADMIN,
    element: lazy(() => import("pages/protectedPages/modules/admin")),
  },
  
  {
    path: RouteEnum.MODULES_CONFIG,
    element: lazy(() => import("pages/protectedPages/modules/config/Config")),
  },
  {
    path: RouteEnum.MODULES_PROCUREMENT,
    element: lazy(() => import("pages/protectedPages/modules/procurement/Procurement")),
  },
  {
    path: RouteEnum.MODULES_FINANCE,
    element: lazy(() => import("pages/protectedPages/modules/finance/Finance")),
  },
];
