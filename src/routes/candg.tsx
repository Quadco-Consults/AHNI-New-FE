import { lazy } from "react";
import { CandGRoutes } from "constants/RouterConstants";

export const candg = [
  {
    path: CandGRoutes.OVERVIEW,
    element: lazy(() => import("pages/protectedPages/candg/Overview")),
  },
  {
    path: CandGRoutes.GRANT,
    element: lazy(() => import("pages/protectedPages/candg/grant/Grant")),
  },
  {
    path: CandGRoutes.NEW_GRANT,
    element: lazy(() => import("pages/protectedPages/candg/grant/NewGrant")),
  },
  {
    path: CandGRoutes.GRANT_DETAILS,
    element: lazy(() => import("pages/protectedPages/candg/grant/GrantDetails")),
  },
  {
    path: CandGRoutes.CLOSE_OUT,
    element: lazy(() => import("pages/protectedPages/candg/closeout/CloseOut")),
  },

  {
    path: CandGRoutes.CLOSE_OUT_DETAILS,
    element: lazy(() => import("pages/protectedPages/candg/closeout/CloseOutDetails")),
  },
  {
    path: CandGRoutes.NEW_CLOSE_OUT_PLAN,
    element: lazy(() => import("pages/protectedPages/candg/closeout/NewCloseOutPlan")),
  },
  {
    path: CandGRoutes.CONSULTANCY,
    element: lazy(() => import("pages/protectedPages/candg/consultancy/Consultancy")),
  },
  {
    path: CandGRoutes.NEW_CONSULTANCY,
    element: lazy(() => import("pages/protectedPages/candg/consultancy/CreateNewConsultancy")),
  },
  {
    path: CandGRoutes.NEW_CONSULTANCY_SCOPE,
    element: lazy(() => import("pages/protectedPages/candg/consultancy/ScopeOfWork")),
  },
  {
    path: CandGRoutes.CONSULTANCY_DETAILS,
    element: lazy(() => import("pages/protectedPages/candg/consultancy/ConsultancyDetails")),
  },
  // sla
  {
    path: CandGRoutes.CONSULTANCY_SLA,
    element: lazy(() => import("pages/protectedPages/candg/sla/SLA")),
  },
];
