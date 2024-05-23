import { configureRoutes } from "utils/RouterUtils";
import { dashboard } from "./dashboard";
import { procurment } from "./procurment";
import { adminRoutes } from "./admin";

const getRoutes = function getRoutes() {
  return configureRoutes([...dashboard, ...procurment, ...adminRoutes]);
};

export default getRoutes;
