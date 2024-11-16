import { RouteEnum } from "constants/RouterConstants";

import { lazy } from "react";

export const notification = [
    {
        path: RouteEnum.NOTIFICATIONS,
        element: lazy(() => import("pages/protectedPages/notifications/index")),
    },
];
