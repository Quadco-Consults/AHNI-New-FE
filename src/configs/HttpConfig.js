import axios from "axios";
import { EnvVarEnum } from "constants/Global";

export const CoreHttp = axios.create({
  baseURL: EnvVarEnum.CORE_API_BASE_URL,
});

export default CoreHttp;
