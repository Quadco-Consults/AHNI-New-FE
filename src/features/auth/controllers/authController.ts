import useApiManager from "@/constants/mainController";
import { ILoginData, TLoginFormValues } from "../types/auth";
import { setAccessToken, setCurrentUser } from "@/utils/auth";

// Additional types for authenticated password change
interface AuthChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ===== AUTHENTICATION HOOKS =====

// Login
export const useLogin = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ILoginData,
    Error,
    TLoginFormValues
  >({
    endpoint: "/auth/login/",
    isAuth: false,
    method: "POST",
    showSuccessToast: false, // Handle login success in component
  });

  const login = async (details: TLoginFormValues) => {
    try {
      const response = await callApi(details);
      // Store token and user data using utilities
      if (response.data?.access_token) {
        setAccessToken(response.data.access_token);
        
        if (response.data?.user) {
          setCurrentUser(response.data.user);
        }
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
    endpoint: "/auth/password/reset/",
    isAuth: false,
    method: "POST",
  });

  const forgotPassword = async (details: { email: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Forgot password error:", error);
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
    endpoint: "/auth/password/reset/confirm/",
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
    endpoint: "/auth/password/change/",
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