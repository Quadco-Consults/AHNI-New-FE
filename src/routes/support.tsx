import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const support = [
    {
        path: RouteEnum.SUPPORT,
        element: lazy(() => import("pages/protectedPages/support/index")),
    },
    {
        path: RouteEnum.SUPPORT_DETAILS,
        element: lazy(() => import("pages/protectedPages/support/id/index")),
    },
];
