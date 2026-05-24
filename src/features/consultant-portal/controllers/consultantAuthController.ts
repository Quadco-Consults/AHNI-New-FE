import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import AxiosWithoutToken from "@/constants/api_management/MyHttpHelper";
import { ConsultantLoginCredentials, ConsultantAuthResponse, ConsultantPortalUser } from "../types/consultant-auth";

// Consultant authentication endpoints
const CONSULTANT_AUTH_ENDPOINTS = {
  LOGIN: "/consultant-portal/auth/login/",
  PROFILE: "/consultant-portal/auth/profile/",
  REFRESH: "/consultant-portal/auth/token/refresh/",
  LOGOUT: "/consultant-portal/auth/logout/",
  PASSWORD_CHANGE: "/consultant-portal/auth/password/change/",
};

// Consultant Portal Authentication Utilities
export const ConsultantAuthUtils = {
  getConsultantToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('consultant_access_token');
    }
    return null;
  },

  setConsultantToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('consultant_access_token', token);
    }
  },

  getConsultantRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('consultant_refresh_token');
    }
    return null;
  },

  setConsultantRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('consultant_refresh_token', token);
    }
  },

  removeConsultantToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('consultant_access_token');
      localStorage.removeItem('consultant_refresh_token');
      localStorage.removeItem('consultant_user');
    }
  },

  getConsultantUser: (): ConsultantPortalUser | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('consultant_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setConsultantUser: (user: ConsultantPortalUser): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('consultant_user', JSON.stringify(user));
    }
  },

  isConsultantAuthenticated: (): boolean => {
    return !!ConsultantAuthUtils.getConsultantToken();
  },

  getConsultantData: (): any => {
    // Return user data from localStorage for display purposes
    const user = ConsultantAuthUtils.getConsultantUser();
    return user || { full_name: 'Consultant', email: 'consultant@company.com' };
  },
};

// Consultant Login Hook
export const useConsultantLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: ConsultantLoginCredentials): Promise<ConsultantAuthResponse> => {
      try {
        const response = await AxiosWithoutToken.post(CONSULTANT_AUTH_ENDPOINTS.LOGIN, credentials);
        return response.data;
      } catch (error: any) {
        // If backend credentials are invalid, provide helpful error message
        if (error?.response?.status === 401) {
          throw new Error('Invalid credentials. Please check your email and password.');
        }
        if (error?.response?.status === 403) {
          throw new Error(error?.response?.data?.message || 'Access denied. Please contact support.');
        }
        throw error;
      }
    },
    onSuccess: (data: any) => {
      console.log('🎉 Consultant Login Success - Raw Data:', data);

      // Handle API response format
      const responseData = data.status ? data.data : data;

      console.log('🔧 Processing consultant auth data:', {
        hasAccessToken: !!responseData.access_token,
        hasConsultantData: !!responseData.consultant,
        consultantData: responseData.consultant,
        fullResponseData: responseData
      });

      // Store tokens
      ConsultantAuthUtils.setConsultantToken(responseData.access_token);
      ConsultantAuthUtils.setConsultantRefreshToken(responseData.refresh_token);
      console.log('✅ Consultant tokens stored');

      // Store consultant user info
      if (responseData.consultant) {
        ConsultantAuthUtils.setConsultantUser(responseData.consultant as ConsultantPortalUser);
        console.log('✅ Consultant user data stored:', ConsultantAuthUtils.getConsultantUser());
      } else {
        console.log('⚠️ No consultant data found in response');
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['consultant-profile'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-payment-requests'] });

      console.log('🚀 Consultant login setup complete - ready for redirect to /consultant-portal/dashboard');
    },
    onError: (error: any) => {
      console.error('Consultant login error:', error);
      ConsultantAuthUtils.removeConsultantToken();
    }
  });
};

// Consultant Profile Hook
export const useConsultantProfile = () => {
  return useQuery({
    queryKey: ['consultant-profile'],
    queryFn: async (): Promise<ConsultantPortalUser> => {
      const token = ConsultantAuthUtils.getConsultantToken();
      if (!token) {
        throw new Error('No consultant token found');
      }

      console.log('🔍 Consultant Profile Debug:', {
        tokenExists: !!token,
        tokenPrefix: token?.substring(0, 20) + '...',
        nodeEnv: process.env.NODE_ENV
      });

      try {
        console.log('🌐 Calling backend for consultant profile...');
        const response = await ConsultantAxiosWithToken.get(CONSULTANT_AUTH_ENDPOINTS.PROFILE);

        console.log('📡 Profile API Response:', response.data);

        // Handle API response format
        const responseData = response.data;
        const consultantUser = responseData.status ? responseData.data : responseData.data || responseData;

        if (!consultantUser) {
          throw new Error('No consultant data found in response');
        }

        ConsultantAuthUtils.setConsultantUser(consultantUser);
        console.log('✅ Consultant profile loaded successfully:', consultantUser);
        return consultantUser;
      } catch (error: any) {
        console.error('❌ Consultant profile API error:', error);

        const status = error?.response?.status;
        const errorData = error?.response?.data;

        // Handle 403 permission errors - use stored profile if available
        if (status === 403) {
          console.warn('🔒 Profile API permission denied - using stored profile');

          const storedUser = ConsultantAuthUtils.getConsultantUser();
          if (storedUser) {
            console.log('✅ Using stored consultant profile as fallback for 403 error');
            return storedUser;
          }
        }

        // For other errors, try stored user data
        const storedUser = ConsultantAuthUtils.getConsultantUser();
        if (storedUser && status !== 401) {
          console.log('🔄 Using stored consultant profile as fallback');
          return storedUser;
        }

        throw error;
      }
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;

      // Don't retry on authentication errors
      if (status === 401) {
        ConsultantAuthUtils.removeConsultantToken();
        return false;
      }

      // Don't retry on permission errors - use fallback instead
      if (status === 403) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

// Consultant Logout Hook
export const useConsultantLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const refreshToken = ConsultantAuthUtils.getConsultantRefreshToken();
      if (refreshToken) {
        try {
          await ConsultantAxiosWithToken.post(CONSULTANT_AUTH_ENDPOINTS.LOGOUT, {
            refresh_token: refreshToken
          });
        } catch (error) {
          console.warn('Logout API call failed, proceeding with local cleanup:', error);
        }
      }
    },
    onSettled: () => {
      // Always clear local storage and queries, regardless of API success
      ConsultantAuthUtils.removeConsultantToken();
      queryClient.clear();
    },
  });
};

// Consultant Password Change Hook
export const useConsultantPasswordChange = () => {
  return useMutation({
    mutationFn: async (passwords: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }): Promise<any> => {
      const response = await ConsultantAxiosWithToken.post(
        CONSULTANT_AUTH_ENDPOINTS.PASSWORD_CHANGE,
        passwords
      );
      return response.data;
    },
  });
};
