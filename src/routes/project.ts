import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const project = [
  {
    path: RouteEnum.PROJECTS,
    element: lazy(() => import("pages/protectedPages/projects/index")),
  },
  {
    path: RouteEnum.PROJECTS_DETAILS,
    element: lazy(() => import("pages/protectedPages/projects/[id]/index")),
  },
];
