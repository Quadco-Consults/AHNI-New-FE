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

  // sub grant
  {
    path: CandGRoutes.SUB_GRANT,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/SubGrant")),
  },
  {
    path: CandGRoutes.NEW_SUB_GRANT,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/NewSubGrant")),
  },
  {
    path: CandGRoutes.SUB_GRANT_DETAILS,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/SubGrantDetails")),
  },
  {
    path: CandGRoutes.MANUAL_SUB_GRANT_SUBMISSION,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/ManualSubGrantSubmission")),
  },
  {
    path: CandGRoutes.MANUAL_SUB_GRANT_SUBMISSION_DOCS,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/ManualSubmissionDocumentUpload")),
  },
  {
    path: CandGRoutes.SUBMITTED_APPLICATIONS,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/SubmittedApplications")),
  },
  //////pre awrd assessments
  {
    path: CandGRoutes.PRE_AWARD_ASSESSMENT,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessment")),
  },
  {
    path: CandGRoutes.PRE_AWARD_ASSESSMENT_SINGLE,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentSingle")),
  },
  {
    path: CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_1,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep1")),
  },
  {
    path: CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_2,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep2")),
  },
  {
    path: CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_3,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep3")),
  },
  {
    path: CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_4,
    element: lazy(() => import("pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep4")),
  },

  // close out
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
