import { configureRoutes } from "utils/RouterUtils";
import { dashboard } from "./dashboard";
import { procurment } from "./procurment";

const getRoutes = function getRoutes() {
  return configureRoutes([...dashboard, ...procurment]);
};

export default getRoutes;
