import { configureRoutes } from "utils/RouterUtils";
import { dashboard } from "./dashboard";
import { procurment } from "./procurment";
import { program } from "./program";

const getRoutes = function getRoutes() {
  return configureRoutes([...dashboard, ...procurment, ...program]);
};

export default getRoutes;
