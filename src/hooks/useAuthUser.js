import { useSelector } from "react-redux";

/**
 * @returns {import("../types/user.d.ts").UserData)}
 */
function useAuthUser() {
  return useSelector((state) => state.global.authUser);
}

export default useAuthUser;
