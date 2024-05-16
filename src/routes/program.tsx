import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const program = [
  {
    path: RouteEnum.PROGRAM_WORK_PLAN,
    element: lazy(
      () => import("pages/protectedPages/programs/work-plan/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_WORK_PLAN_DETAILS,
    element: lazy(
      () => import("pages/protectedPages/programs/work-plan/id/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_ACTIVITY,
    element: lazy(() => import("pages/protectedPages/programs/Activity-plan")),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION,
    element: lazy(() => import("pages/protectedPages/programs/ssp/index")),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/Composition")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST,
    element: lazy(() => import("pages/protectedPages/programs/ssp/Checklist")),
  },
  {
    path: RouteEnum.PROGRAM_FUND_REQUEST,
    element: lazy(
      () => import("pages/protectedPages/programs/fund-request/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_DETAILS,
    element: lazy(
      () => import("pages/protectedPages/programs/fund-request/id/index")
    ),
  },
];
