import { dashboard } from "./dashboard";
import { procurment } from "./procurment";
import { adminRoutes } from "./admin";
import { program } from "./program";
import { configureRoutes } from "utils/RouteUtils";
import { project } from "./project";
import { users } from "./users";
import { candg } from "./candg";
import { modules } from "./modules";
import { hr } from "./hr";
import { notification } from "./notification";
import { support } from "./support";
import { account } from "./account";

const getRoutes = function getRoutes() {
    return configureRoutes([
        ...dashboard,
        ...procurment,
        ...adminRoutes,
        ...program,
        ...project,
        ...users,
        ...candg,
        ...modules,
        ...hr,
        ...notification,
        ...support,
        ...account,
    ]);
};

export default getRoutes;
