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
];
