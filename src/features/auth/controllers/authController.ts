import useApiManager from "@/constants/mainController";
import { ILoginData, TLoginFormValues } from "../types/auth";
import { setAccessToken, setCurrentUser } from "@/utils/auth";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/auth/authSlice";

// Additional types for authenticated password change
interface AuthChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ===== AUTHENTICATION HOOKS =====

// Login
export const useLogin = () => {
  const dispatch = useAppDispatch();

  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ILoginData,
    Error,
    TLoginFormValues
  >({
    endpoint: "auth/login/",
    isAuth: false,
    method: "POST",
    showSuccessToast: false, // Handle login success in component
  });

  const login = async (details: TLoginFormValues) => {
    try {
      const response = await callApi(details);

      // Store in localStorage (for backward compatibility)
      if (response.data?.access_token) {
        setAccessToken(response.data.access_token);

        if (response.data?.user) {
          // Store complete user object with merged permissions and roles
          const completeUserData = {
            ...response.data.user,
            // Ensure we have the employee structure for department-based features
            employee: response.data.user?.employee || {
              department: response.data.user?.department || null,
              position: response.data.user?.position || null,
              location: response.data.user?.location || null
            },
            // Include permissions and roles from both sources
            permissions: response.data.permissions || response.data.user?.permissions || [],
            roles: response.data.roles || response.data.user?.roles || []
          };

          console.log('💾 STORING USER DATA:', {
            userId: completeUserData.id,
            permissionsCount: completeUserData.permissions?.length || 0,
            rolesCount: completeUserData.roles?.length || 0,
            department: completeUserData.employee?.department?.name || completeUserData.department?.name || 'none'
          });

          setCurrentUser(completeUserData);
        }
      }

      // IMPORTANT: Dispatch to Redux store
      if (response.data) {
        console.log('🚀 RAW LOGIN RESPONSE:', JSON.stringify(response.data, null, 2));
        console.log('🔍 PERMISSIONS CHECK:', {
          hasPermissions: !!response.data.permissions,
          permissionsType: typeof response.data.permissions,
          permissionsLength: response.data.permissions?.length || 0,
          userPermissions: response.data.user?.permissions || 'none',
          fullUser: response.data.user
        });

        dispatch(setAuth({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          isAuthenticated: true,
          loading: false,
          user: {
            ...response.data.user,
            // Ensure we have the employee structure for department-based features
            employee: response.data.user?.employee || {
              department: response.data.user?.department || null,
              position: response.data.user?.position || null,
              location: response.data.user?.location || null
            }
          },
          permissions: response.data.permissions || response.data.user?.permissions || [], // Try multiple locations
          roles: response.data.roles || response.data.user?.roles || []
        }));
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return { login, data, isLoading, isSuccess, error };
};

// Forgot Password
export const useForgotPassword = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { email: string }
  >({
    endpoint: "auth/password/reset/",
    isAuth: false,
    method: "POST",
  });

  const forgotPassword = async (details: { email: string }) => {
    try {
      const response = await callApi(details);
      return response;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  return { forgotPassword, data, isLoading, isSuccess, error };
};

// Change Password (Reset with OTP)
export const useChangePassword = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    {
      email: string | null;
      otp: string;
      new_password: string;
      confirm_password: string;
    }
  >({
    endpoint: "auth/password/reset/confirm/",
    isAuth: false,
    method: "POST",
  });

  const changePassword = async (details: {
    email: string | null;
    otp: string;
    new_password: string;
    confirm_password: string;
  }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Change password error:", error);
    }
  };

  return { changePassword, data, isLoading, isSuccess, error };
};

// Authenticated Change Password
export const useAuthChangePassword = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }
  >({
    endpoint: "auth/password/change/",
    isAuth: true,
    method: "POST",
  });

  const authChangePassword = async (details: AuthChangePasswordRequest) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Auth change password error:", error);
    }
  };

  return { authChangePassword, data, isLoading, isSuccess, error };
};

// ===== HELPER FUNCTIONS =====
// All auth utility functions are now in @/utils/auth

// Maintain legacy exports for backward compatibility
export const useLoginMutation = useLogin;
export const useForgotPasswordMutation = useForgotPassword;
export const useChangePasswordMutation = useChangePassword;
export const useAuthChangePasswordMutation = useAuthChangePassword;