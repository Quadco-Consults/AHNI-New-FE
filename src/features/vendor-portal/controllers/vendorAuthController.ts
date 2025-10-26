import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import AxiosWithoutToken from "@/constants/api_management/MyHttpHelper";
import { VendorLoginCredentials, VendorAuthResponse, VendorPortalUser } from "../types/vendor-auth";

// Vendor authentication endpoints
const VENDOR_AUTH_ENDPOINTS = {
  LOGIN: "/procurements/vendors/portal-auth/",
  PROFILE: "/procurements/vendors/portal-profile/",
  REFRESH: "/procurements/vendors/portal-refresh/",
  LOGOUT: "/procurements/vendors/portal-logout/",
};

// Vendor Portal Authentication Utilities
export const VendorAuthUtils = {
  getVendorToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vendor_access_token');
    }
    return null;
  },

  setVendorToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendor_access_token', token);
    }
  },

  removeVendorToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vendor_access_token');
      localStorage.removeItem('vendor_user');
    }
  },

  getVendorUser: (): VendorPortalUser | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('vendor_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setVendorUser: (user: VendorPortalUser): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendor_user', JSON.stringify(user));
    }
  },

  isVendorAuthenticated: (): boolean => {
    return !!VendorAuthUtils.getVendorToken();
  },
};

// Vendor Login Hook
export const useVendorLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: VendorLoginCredentials): Promise<VendorAuthResponse> => {
      const response = await AxiosWithoutToken.post(VENDOR_AUTH_ENDPOINTS.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data: VendorAuthResponse) => {
      VendorAuthUtils.setVendorToken(data.access_token);
      VendorAuthUtils.setVendorUser(data.vendor as VendorPortalUser);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['vendor-profile'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-rfqs'] });
    },
    onError: (error: any) => {
      console.error('Vendor login error:', error);
      VendorAuthUtils.removeVendorToken();
    }
  });
};

// Vendor Profile Hook
export const useVendorProfile = () => {
  return useQuery({
    queryKey: ['vendor-profile'],
    queryFn: async (): Promise<VendorPortalUser> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(VENDOR_AUTH_ENDPOINTS.PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const vendorUser = response.data.data || response.data;
      VendorAuthUtils.setVendorUser(vendorUser);
      return vendorUser;
    },
    enabled: VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Vendor Logout Hook
export const useVendorLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const token = VendorAuthUtils.getVendorToken();
      if (token) {
        try {
          await AxiosWithToken.post(VENDOR_AUTH_ENDPOINTS.LOGOUT, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.warn('Logout API call failed, proceeding with local cleanup:', error);
        }
      }
    },
    onSettled: () => {
      // Always clear local storage and queries, regardless of API success
      VendorAuthUtils.removeVendorToken();
      queryClient.clear();
    },
  });
};

// Check if vendor is eligible for RFQ
export const useVendorRFQEligibility = (rfqId: string) => {
  return useQuery({
    queryKey: ['vendor-rfq-eligibility', rfqId],
    queryFn: async () => {
      const token = VendorAuthUtils.getVendorToken();
      const response = await AxiosWithToken.get(`/procurements/rfq/${rfqId}/vendor-eligibility/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!rfqId && VendorAuthUtils.isVendorAuthenticated(),
  });
};