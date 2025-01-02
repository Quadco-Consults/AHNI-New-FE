import { RouteEnum } from "constants/RouterConstants";

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
            () =>
                import("pages/protectedPages/programs/plan/work-plan/id/index")
        ),
    },

    {
        path: RouteEnum.PROGRAM_ACTIVITY,
        element: lazy(
            () =>
                import("pages/protectedPages/programs/plan/activity-plan/index")
        ),
    },

    {
        path: RouteEnum.PROGRAM_CREATE_ACTIVITY_PLAN,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/programs/plan/activity-plan//CreateActivityPlan"
                )
        ),
    },
    {
        path: RouteEnum.PROGRAM_ACTIVITY_TRACKER,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/programs/plan/activity-tracker/index"
                )
        ),
    },
    {
        path: RouteEnum.PROGRAM_ACTIVITY_TRACKER_CREATE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/programs/plan/activity-tracker/create-activity-tracker"
                )
        ),
    },
    {
        path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION,
        element: lazy(
            () => import("pages/protectedPages/programs/plan/ssp/index")
        ),
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
                    "pages/protectedPages/programs/plan/ssp/[id]/CoreManagementSystems"
                )
        ),
    },
    {
        path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/programs/plan/ssp/[id]/ApprovalStatus"
                )
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
            () => import("pages/protectedPages/programs/plan/ssp/Checklist")
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
            () =>
                import(
                    "pages/protectedPages/programs/fund-request/Create-fund-request"
                )
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
            () =>
                import(
                    "pages/protectedPages/programs/fund-request/Fund-summary"
                )
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
            () =>
                import(
                    "pages/protectedPages/programs/plan/risk-management/index"
                )
        ),
    },
    {
        path: RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/programs/plan/risk-management/Create-risk-management"
                )
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
                    "pages/protectedPages/programs/stakeholder-management/register/Create-register"
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
                    "pages/protectedPages/programs/stakeholder-management/engagement/Create-engagement"
                )
        ),
    },
    {
        path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/programs/stakeholder-management/engagement/[id]/index"
                )
        ),
    },
];
