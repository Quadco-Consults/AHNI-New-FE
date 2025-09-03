import { CG_ROUTES, ProgramRoutes, RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const program = [
  {
    path: RouteEnum.PROGRAM_WORK_PLAN,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/work-plan/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_WORK_PLAN_DETAILS,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/work-plan/id/index")
    ),
  },

  {
    path: RouteEnum.PROGRAM_ACTIVITY,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/activity-plan/index")
    ),
  },

  {
    path: RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/activity-plan/create")
    ),
  },
  {
    path: RouteEnum.PROGRAM_ACTIVITY_TRACKER,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/work-plan-tracker/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_ACTIVITY_TRACKER_DETAILS,
    element: lazy(
      () =>
        import("pages/protectedPages/programs/plan/work-plan-tracker/id/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_ACTIVITY_TRACKER_CREATE,
    element: lazy(
      () =>
        import("pages/protectedPages/programs/plan/work-plan-tracker/create")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION,
    element: lazy(() => import("pages/protectedPages/programs/plan/ssp/index")),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/ssp/[id]/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_MANAGEMENT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/plan/ssp/[id]/EvaluationCriteriaProcess"
        )
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/ssp/[id]/ApprovalStatus")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/ssp/Composition")
    ),
  },
  {
    path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_CHECKLIST,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/ssp/EvaluationCheckList")
    ),
  },

  {
    path: ProgramRoutes.SUPERVISION_PLAN_EVALUATION_DETAILS,
    element: lazy(
      () =>
        import("pages/protectedPages/programs/plan/ssp/[id]/EvaluationDetails")
    ),
  },

  //consultant (adhoc) management
  {
    path: CG_ROUTES.CONSULTANCY,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management"
        )
    ),
  },

  {
    path: CG_ROUTES.CREATE_CONSULTANCY_DETAILS,
    element: lazy(
      () =>
        import(
          "features/contracts-grants/components/contract-management/consultant-management/create/ApplicationDetails"
        )
    ),
  },

  {
    path: CG_ROUTES.CREATE_CONSULTANCY_WORK_SCOPE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/create/ScopeOfWork"
        )
    ),
  },

  {
    path: CG_ROUTES.CONSULTANCY_DETAILS,
    element: lazy(
      () =>
        import(
          "features/contracts-grants/components/contract-management/consultant-management/id/ConsultancyDetails"
        )
    ),
  },
  {
    path: CG_ROUTES.CREATE_CONSULTANCY_APPLICANT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff"
        )
    ),
  },
  {
    path: CG_ROUTES.CONSULTANCY_APPLICATION_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/id/applicants/ConsultancyStaffDetails"
        )
    ),
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
    path: RouteEnum.PROGRAM_FUND_REQUEST_CREATE,
    element: lazy(
      () => import("pages/protectedPages/programs/fund-request/create/index")
    ),
  },

  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_PREVIEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/fund-request/Fund-request-preview"
        )
    ),
  },

  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_FUND_SUMMARY,
    element: lazy(
      () => import("pages/protectedPages/programs/fund-request/create/summary")
    ),
  },

  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/fund-request/id/AllFundRequestPreview"
        )
    ),
  },

  {
    path: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/fund-request/id/ViewFundRequestActivity"
        )
    ),
  },

  {
    path: RouteEnum.PROGRAM_RISK_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/risk-management/index")
    ),
  },
  {
    path: RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE,
    element: lazy(
      () => import("pages/protectedPages/programs/plan/risk-management/create")
    ),
  },
  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/analysis-mapping/index"
        )
    ),
  },

  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/register/index"
        )
    ),
  },
  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/register/create"
        )
    ),
  },

  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/register/[id]/index"
        )
    ),
  },
  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/engagement/index"
        )
    ),
  },
  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_CREATE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/engagement/create"
        )
    ),
  },
  {
    path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/programs/stakeholder-management/engagement/id"
        )
    ),
  },

  /* *************** ADHOC STAFF MANAGEMENT *************** */

  {
    path: ProgramRoutes.ADHOC_MANAGEMENT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management"
        )
    ),
  },

  {
    path: ProgramRoutes.CREATE_ADHOC_DETAILS,
    element: lazy(
      () =>
        import(
          "features/contracts-grants/components/contract-management/consultant-management/create/ApplicationDetails"
        )
    ),
  },

  {
    path: ProgramRoutes.CREATE_ADHOC_WORK_SCOPE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/create/ScopeOfWork"
        )
    ),
  },

  {
    path: ProgramRoutes.ADHOC_DETAILS,
    element: lazy(
      () =>
        import(
          "features/contracts-grants/components/contract-management/consultant-management/id/ConsultancyDetails"
        )
    ),
  },

  {
    path: ProgramRoutes.CREATE_ADHOC_INTERVIEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/id/CreateInterview"
        )
    ),
  },

  {
    path: ProgramRoutes.CREATE_ADHOC_APPLICANT,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/id/applicants/CreateConsultancyStaff"
        )
    ),
  },

  {
    path: ProgramRoutes.ADHOC_APPLICANT_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/id/applicants/ConsultancyStaffDetails"
        )
    ),
  },

  {
    path: ProgramRoutes.ADHOC_APPLICANT_INTERVIEW,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-management/id/ApplicantInterview"
        )
    ),
  },

  {
    path: ProgramRoutes.ADHOC_DATABASE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultancy-database/index"
        )
    ),
  },

  {
    path: ProgramRoutes.ADHOC_ACCEPTANCE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-acceptance/"
        )
    ),
  },

  {
    path: ProgramRoutes.ADHOC_ACCEPTANCE_DETAILS,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/c&g/contract-management/consultant-acceptance/id"
        )
    ),
  },
];
