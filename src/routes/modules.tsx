import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const modules = [
  {
    path: RouteEnum.MODULES_PROJECTS,
    element: lazy(() => import("pages/protectedPages/modules/projects/Projects")),
  },
  {
    path: RouteEnum.MODULES_PROGRAMS,
    element: lazy(() => import("pages/protectedPages/modules/programs/Programs")),
  },
  {
    path: RouteEnum.MODULES_ADMIN,
    element: lazy(() => import("pages/protectedPages/modules/admin/Admin")),
  },
  {
    path: RouteEnum.MODULES_CONFIG,
    element: lazy(() => import("pages/protectedPages/modules/config/Config")),
  },
  {
    path: RouteEnum.MODULES_PROCUREMENT,
    element: lazy(() => import("pages/protectedPages/modules/procurement/Procurement")),
  },
];
