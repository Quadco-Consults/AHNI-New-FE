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
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS,
    element: lazy(() => import("pages/protectedPages/programs/ssp/[id]/index")),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT,
    element: lazy(
      () =>
        import("pages/protectedPages/programs/ssp/[id]/CoreManagementSystems")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_GUIDELINE,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/Guideline")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MONITORING,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/Monitoring")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_ASSESS,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/Assess-monthly")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_TX_NEW,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/TX-new")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_SERVICE_DELIVERY,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/Service-delivery")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_PREVENTION,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/Prevention")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL,
    element: lazy(
      () => import("pages/protectedPages/programs/ssp/[id]/ApprovalStatus")
    ),
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
  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_PROJECT_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/programs/fund-request/Project-details")
    ),
  },
  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_FUND_SUMMARY,
    element: lazy(
      () => import("pages/protectedPages/programs/fund-request/Fund-summary")
    ),
  },
  {
    path: RouteEnum.PROGRAM_RISK_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/programs/risk-management/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/risk-management/Create-risk-management"
        )
    ),
  },
];
