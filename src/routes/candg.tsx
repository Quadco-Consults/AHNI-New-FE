import { lazy } from "react";
import { CG_ROUTES } from "constants/RouterConstants";

export const candg = [
    {
        path: CG_ROUTES.OVERVIEW,
        element: lazy(() => import("pages/protectedPages/c&g")),
    },

    {
        path: CG_ROUTES.GRANT,
        element: lazy(() => import("pages/protectedPages/c&g/grant")),
    },

    {
        path: CG_ROUTES.GRANT_CREATE,
        element: lazy(() => import("pages/protectedPages/c&g/grant/create")),
    },

    {
        path: CG_ROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/submission/create"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_SUBGRANT_SUBMISSION_UPLOADS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/submission/create/upload"
                )
        ),
    },

    {
        path: CG_ROUTES.SUBGRANT_SUBMISSION_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/submission/id/Layout"
                )
        ),
    },

    // -----------------------

    {
        path: CG_ROUTES.AGREEMENT,
        element: lazy(
            () =>
                import("pages/protectedPages/c&g/contract-management/agreement")
        ),
    },

    {
        path: CG_ROUTES.CREATE_AGREEMENT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/agreement/create"
                )
        ),
    },

    {
        path: CG_ROUTES.GRANT_DETAILS,
        element: lazy(() => import("pages/protectedPages/c&g/grant/id")),
    },

    // sub grant
    {
        path: CG_ROUTES.SUBGRANT,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards")
        ),
    },
    {
        path: CG_ROUTES.CREATE_SUBGRANT_AWARD,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards/create")
        ),
    },
    {
        path: CG_ROUTES.SUBGRANT_AWARD_DETAILS,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards/id")
        ),
    },

    {
        path: CG_ROUTES.PREAWARD_ASSESSMENT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/submission/id/preaward-assessment"
                )
        ),
    },

    // {
    //     path: CG_ROUTES.PRE_AWARD_ASSESSMENT_SINGLE,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentSingle"
    //             )
    //     ),
    // },

    // {
    //     path: CG_ROUTES.PRE_AWARD_ASSESSMENT_STEP_1,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep1"
    //             )
    //     ),
    // },
    // {
    //     path: CG_ROUTES.PRE_AWARD_ASSESSMENT_STEP_2,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep2"
    //             )
    //     ),
    // },
    // {
    //     path: CG_ROUTES.PRE_AWARD_ASSESSMENT_STEP_3,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep3"
    //             )
    //     ),
    // },
    // {
    //     path: CG_ROUTES.PRE_AWARD_ASSESSMENT_STEP_4,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep4"
    //             )
    //     ),
    // },

    // close out
    {
        path: CG_ROUTES.CLOSE_OUT,
        element: lazy(() => import("pages/protectedPages/c&g/closeout-plan")),
    },

    {
        path: CG_ROUTES.NEW_CLOSE_OUT_PLAN,
        element: lazy(
            () => import("pages/protectedPages/c&g/closeout-plan/create")
        ),
    },

    {
        path: CG_ROUTES.CLOSE_OUT_DETAILS,
        element: lazy(
            () => import("pages/protectedPages/c&g/closeout-plan/id")
        ),
    },

    // ------------------------

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
                    "pages/protectedPages/c&g/contract-management/consultant-management/create/ApplicationDetails"
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
                    "pages/protectedPages/c&g/contract-management/consultant-management/id/ConsultancyDetails"
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
        path: CG_ROUTES.CONSULTANCY_SHORTLIST_METRIC,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/candg/consultancy/ConsultancyShortlisMetric"
                )
        ),
    },

    /* CONSULTANCY REPORT */
    {
        path: CG_ROUTES.CONSULTANCY_REPORT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultancy-report/"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_CONSULTANCY_REPORT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultancy-report/create"
                )
        ),
    },

    {
        path: CG_ROUTES.CONSULTANCY_REPORT_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultancy-report/id"
                )
        ),
    },

    // FACILITATOR MANAGEMENT
    {
        path: CG_ROUTES.FACILITATOR,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/facilitator-management/"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_FACILITATOR_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/facilitator-management/create/ApplicationDetails"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_FACILITATOR_WORK_SCOPE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/facilitator-management/create/ScopeOfWork"
                )
        ),
    },

    {
        path: CG_ROUTES.FACILITATOR_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/facilitator-management/id/FacilitatorDetails"
                )
        ),
    },

    // sla
    {
        path: CG_ROUTES.CONSULTANCY_SLA,
        element: lazy(() => import("pages/protectedPages/candg/sla/SLA")),
    },

    {
        path: CG_ROUTES.CG_MODULES,
        element: lazy(() => import("pages/protectedPages/modules/c&g/index")),
    },
];
