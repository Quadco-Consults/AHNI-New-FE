import { useSelector } from "react-redux";

/**
 * @returns {import("configs/TenantConfig").Tenant}
 */
function useTenant() {
  return useSelector((state) => state.global.tenant);
}

export default useTenant;
