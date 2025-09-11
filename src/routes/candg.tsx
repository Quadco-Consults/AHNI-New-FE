import { lazy } from "react";
import { CG_ROUTES } from "constants/RouterConstants";

export const candg = [
    {
        path: CG_ROUTES.OVERVIEW,
        element: lazy(() => import("pages/protectedPages/c&g")),
    },

    {
        path: CG_ROUTES.DONOR_DATABSE,
        element: lazy(() => import("pages/protectedPages/c&g/donor-database")),
    },

    {
        path: CG_ROUTES.VIEW_DONOR_DATABASE,
        element: lazy(
            () => import("pages/protectedPages/c&g/donor-database/id")
        ),
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
        path: CG_ROUTES.CREATE_AGREEMENT_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/agreement/create/summary"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_AGREEMENT_UPLOADS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/agreement/uploads"
                )
        ),
    },

    {
        path: CG_ROUTES.GRANT_DETAILS,
        element: lazy(() => import("pages/protectedPages/c&g/grant/id")),
    },

    // sub grant
    {
        path: CG_ROUTES.SUBGRANT_ADVERT,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards")
        ),
    },
    {
        path: CG_ROUTES.CREATE_SUBGRANT_ADVERT,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards/create")
        ),
    },

    {
        path: CG_ROUTES.SUBGRANT_ADVERT_DETAILS,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/awards/id")
        ),
    },

    {
        path: CG_ROUTES.PRE_AWARD_ASSESSMENT,
        element: lazy(
            () =>
                import("pages/protectedPages/c&g/sub-grant/preaward-assessment")
        ),
    },

    {
        path: CG_ROUTES.SUBGRANT_CREATE_PRE_AWARD_ASSESSMENT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awards/id/CreatePreAwardAssessment"
                )
        ),
    },

    {
        path: CG_ROUTES.START_PRE_AWARD_ASSESSMENT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/preaward-assessment/PreAwardAssessment"
                )
        ),
    },

    {
        path: CG_ROUTES.AWARDED_BENEFICIARIES,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/sub-grant/awarded-beneficiaries"
                )
        ),
    },

    {
        path: CG_ROUTES.SUBGRANT_AWARD,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/advert")
        ),
    },

    {
        path: CG_ROUTES.SUBGRANT_AWARD_DETAILS,
        element: lazy(
            () => import("pages/protectedPages/c&g/sub-grant/advert/id")
        ),
    },

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
                    "features/contracts-grants/components/contract-management/consultant-management/create/ApplicationDetails"
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
        path: CG_ROUTES.FACILITATOR_ADVERT,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultant-management"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_FACILITATOR_ADVERT_DETAILS,
        element: lazy(
            () =>
                import(
                    "features/contracts-grants/components/contract-management/consultant-management/create/ApplicationDetails"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_FACILITATOR_ADVERT_WORK_SCOPE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultant-management/create/ScopeOfWork"
                )
        ),
    },

    {
        path: CG_ROUTES.FACILITATOR_ADVERT_DETAILS,
        element: lazy(
            () =>
                import(
                    "features/contracts-grants/components/contract-management/consultant-management/id/ConsultancyDetails"
                )
        ),
    },

    {
        path: CG_ROUTES.FACILITATOR_DATABASE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultancy-database/"
                )
        ),
    },

    {
        path: CG_ROUTES.CG_MODULES,
        element: lazy(() => import("pages/protectedPages/modules/c&g/index")),
    },

    {
        path: CG_ROUTES.CONSULTANCY_DATABASE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultancy-database/index"
                )
        ),
    },

    {
        path: CG_ROUTES.CONSULTANT_ACCEPTANCE,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultant-acceptance/"
                )
        ),
    },

    {
        path: CG_ROUTES.CONSULTANT_ACCEPTANCE_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/consultant-acceptance/id"
                )
        ),
    },

    {
        path: CG_ROUTES.CONTRACT_REQUEST,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/contract-request"
                )
        ),
    },

    {
        path: CG_ROUTES.CREATE_CONTRACT_REQUEST,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/contract-request/create"
                )
        ),
    },

    {
        path: CG_ROUTES.CONTRACT_REQUEST_DETAILS,
        element: lazy(
            () =>
                import(
                    "pages/protectedPages/c&g/contract-management/contract-request/id"
                )
        ),
    },
];
