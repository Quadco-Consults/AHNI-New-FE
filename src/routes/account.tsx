import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const account = [
    {
        path: RouteEnum.ACCOUNT,
        element: lazy(() => import("pages/protectedPages/account/index")),
    },
    
];
