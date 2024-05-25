import { dashboard } from "./dashboard";
import { procurment } from "./procurment";
import { adminRoutes } from "./admin";
import { program } from "./program";
import { configureRoutes } from "utils/RouteUtils";

const getRoutes = function getRoutes() {
  return configureRoutes([
    ...dashboard,
    ...procurment,
    ...adminRoutes,
    ...program,
  ]);
};

export default getRoutes;
