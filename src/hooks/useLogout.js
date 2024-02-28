import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "configs/StoreActionConfig";
import CoreTwoFactorApi from "apis/CoreTwoFactorApi";

function useLogout() {
  const dispatch = useDispatch();

  const [logoutTwoFactorMutation, logoutTwoFactorMutationResult] =
    CoreTwoFactorApi.useLogoutTwoFactorMutation();

  const logout = useCallback(
    function logout() {
      return dispatch(logoutAction());
    },
    [dispatch]
  );

  return { logout, logoutTwoFactorMutation, logoutTwoFactorMutationResult };
}

export default useLogout;
