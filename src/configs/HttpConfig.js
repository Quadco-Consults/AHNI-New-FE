import axios from "axios";
import { EnvVarEnum } from "constants/Global";

export const AHNIHttp = axios.create({
  baseURL: EnvVarEnum.AHNI_API_BASE_URL,
});

export default AHNIHttp;
