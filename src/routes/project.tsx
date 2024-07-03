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
  {
    path: RouteEnum.PROJECTS_CREATE_SUMMARY,
    element: lazy(
      () => import("pages/protectedPages/projects/create-project/Summary")
    ),
  },
  // {
  //   path: RouteEnum.PROJECTS_CREATE_PERFORMANCE,
  //   element: lazy(
  //     () => import("pages/protectedPages/projects/create-project/Performance")
  //   ),
  // },
  {
    path: RouteEnum.PROJECTS_CREATE_UPLOADS,
    element: lazy(
      () => import("pages/protectedPages/projects/create-project/Uploads")
    ),
  },
  {
    path: RouteEnum.PROJECTS_EDIT_SUMMARY,
    element: lazy(
      () => import("pages/protectedPages/projects/edit-project/Summary")
    ),
  },
  {
    path: RouteEnum.PROJECTS_EDIT_UPLOADS,
    element: lazy(
      () => import("pages/protectedPages/projects/edit-project/Uploads")
    ),
  },
];
