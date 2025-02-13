import { lazy } from "react";
import { CG_GROUTES } from "constants/RouterConstants";

export const candg = [
    {
        path: CG_GROUTES.OVERVIEW,
        element: lazy(() => import("pages/protectedPages/c&g")),
    },

    {
        path: CG_GROUTES.GRANT,
        element: lazy(() => import("pages/protectedPages/c&g/grant")),
    },

    {
        path: CG_GROUTES.GRANT_CREATE,
        element: lazy(() => import("pages/protectedPages/c&g/grant/create")),
    },

    {
        path: CG_GROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/CreatePartnerSubmissionDetails"
                )
        ),
    },

    {
        path: CG_GROUTES.CREATE_SUBGRANT_SUBMISSION_UPLOADS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/CreatePartnerSubmissionUploads"
                )
        ),
    },

    {
        path: CG_GROUTES.SUBGRANT_SUBMISSION_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/PartnerSubmissionDetailsWrapper"
                )
        ),
    },

    // -----------------------

    {
        path: CG_GROUTES.AGREEMENT,
        element: lazy(
            () =>
                import("pages/protectedPages/c&g/contract-management/agreement")
        ),
    },

    {
        path: CG_GROUTES.CREATE_AGREEMENT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/agreement/create"
                )
        ),
    },

    {
        path: CG_GROUTES.GRANT_DETAILS,
        element: lazy(() => import("pages/protectedPages/c&g/grant/id")),
    },

    // sub grant
    {
        path: CG_GROUTES.SUBGRANT,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards")
        ),
    },
    {
        path: CG_GROUTES.CREATE_SUBGRANT_AWARD,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards/create")
        ),
    },
    {
        path: CG_GROUTES.SUBGRANT_AWARD_DETAILS,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards/id")
        ),
    },

    {
        path: CG_GROUTES.PREAWARD_ASSESSMENT,
        element: lazy(
            () =>
                import("pages/protectedPages/c&g/sub-grant/preaward-assessment")
        ),
    },

    // {
    //     path: CG_GROUTES.PRE_AWARD_ASSESSMENT_SINGLE,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentSingle"
    //             )
    //     ),
    // },

    // {
    //     path: CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_1,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep1"
    //             )
    //     ),
    // },
    // {
    //     path: CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_2,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep2"
    //             )
    //     ),
    // },
    // {
    //     path: CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_3,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep3"
    //             )
    //     ),
    // },
    // {
    //     path: CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_4,
    //     element: lazy(
    //         () =>
    //             import(
    //                 "pages/protectedPages/candg/subGrant/preAwardAssessments/PreAwardAssessmentStep4"
    //             )
    //     ),
    // },

    // close out
    {
        path: CG_GROUTES.CLOSE_OUT,
        element: lazy(
            () => import("pages/protectedPages/candg/closeout/CloseOut")
        ),
    },

    {
        path: CG_GROUTES.CLOSE_OUT_DETAILS,
        element: lazy(
            () => import("pages/protectedPages/candg/closeout/CloseOutDetails")
        ),
    },
    {
        path: CG_GROUTES.NEW_CLOSE_OUT_PLAN,
        element: lazy(
            () => import("pages/protectedPages/candg/closeout/NewCloseOutPlan")
        ),
    },
    {
        path: CG_GROUTES.CONSULTANCY,
        element: lazy(
            () => import("pages/protectedPages/candg/consultancy/Consultancy")
        ),
    },
    {
        path: CG_GROUTES.NEW_CONSULTANCY,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/candg/consultancy/CreateNewConsultancy"
                )
        ),
    },
    {
        path: CG_GROUTES.NEW_CONSULTANCY_SCOPE,
        element: lazy(
            () => import("pages/protectedPages/candg/consultancy/ScopeOfWork")
        ),
    },
    {
        path: CG_GROUTES.CONSULTANCY_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/candg/consultancy/ConsultancyDetails"
                )
        ),
    },
    {
        path: CG_GROUTES.ADD_CONSULTANCY_APPLICATION,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/candg/consultancy/AddConsultancyApplication"
                )
        ),
    },
    {
        path: CG_GROUTES.CONSULTANCY_APPLICATION_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/candg/consultancy/ConsultancyApplicationDetails"
                )
        ),
    },
    {
        path: CG_GROUTES.CONSULTANCY_SHORTLIST_METRIC,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/candg/consultancy/ConsultancyShortlisMetric"
                )
        ),
    },
    // sla
    {
        path: CG_GROUTES.CONSULTANCY_SLA,
        element: lazy(() => import("pages/protectedPages/candg/sla/SLA")),
    },
];
