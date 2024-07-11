import { dashboard } from "./dashboard";
import { procurment } from "./procurment";
import { adminRoutes } from "./admin";
import { program } from "./program";
import { configureRoutes } from "utils/RouteUtils";
import { project } from "./project";
import { users } from "./users";

const getRoutes = function getRoutes() {
  return configureRoutes([
    ...dashboard,
    ...procurment,
    ...adminRoutes,
    ...program,
    ...project,
    ...users,
  ]);
};

export default getRoutes;
