import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import AxiosWithoutToken from "@/constants/api_management/MyHttpHelper";
import { VendorLoginCredentials, VendorAuthResponse, VendorPortalUser } from "../types/vendor-auth";

// Vendor authentication endpoints - Updated to match API documentation
const VENDOR_AUTH_ENDPOINTS = {
  LOGIN: "/vendor/auth/login/",
  PROFILE: "/vendor/auth/profile/",
  REFRESH: "/vendor/auth/refresh/",
  LOGOUT: "/vendor/auth/logout/",
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

  getVendorData: (): any => {
    // Return user data from localStorage for display purposes
    const user = VendorAuthUtils.getVendorUser();
    return user || { company_name: 'Vendor Company', email: 'vendor@company.com' };
  },
};

// Vendor Login Hook
export const useVendorLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: VendorLoginCredentials): Promise<VendorAuthResponse> => {
      // Development mode: allow mock login for testing
      if (process.env.NODE_ENV === 'development' && credentials.email === 'test@vendor.com' && credentials.password === 'test123') {
        // Mock successful login response
        return {
          status: 'success',
          message: 'Login successful',
          data: {
            access_token: 'mock_access_token_' + Date.now(),
            refresh_token: 'mock_refresh_token_' + Date.now(),
            user: {
              id: 'mock_user_id',
              email: 'test@vendor.com',
              vendor: {
                id: 'mock_vendor_id',
                company_name: 'Test Vendor Company',
                status: 'Approved' as const,
                is_active: true,
                approved_categories: [
                  { id: '1', name: 'Information Technology' },
                  { id: '2', name: 'Office Supplies' },
                  { id: '3', name: 'Consulting Services' }
                ]
              }
            }
          }
        };
      }

      const response = await AxiosWithoutToken.post(VENDOR_AUTH_ENDPOINTS.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data: any) => {
      // Handle new API response format
      const responseData = data.status === 'success' ? data.data : data;
      VendorAuthUtils.setVendorToken(responseData.access_token);

      // Store vendor user info from the nested structure
      if (responseData.user?.vendor) {
        VendorAuthUtils.setVendorUser(responseData.user.vendor as VendorPortalUser);
      }

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

      // Development mode: return mock data for mock token
      if (process.env.NODE_ENV === 'development' && token.startsWith('mock_access_token_')) {
        const mockProfile: VendorPortalUser = {
          id: 'mock_vendor_id',
          company_name: 'Test Vendor Company',
          email: 'test@vendor.com',
          phone_number: '+1 234 567 8900',
          status: 'Approved' as const,
          is_active: true,
          approved_categories: [
            { id: '1', name: 'Information Technology' },
            { id: '2', name: 'Office Supplies' },
            { id: '3', name: 'Consulting Services' }
          ],
          submitted_categories: [
            { id: '1', name: 'Information Technology' },
            { id: '2', name: 'Office Supplies' },
            { id: '3', name: 'Consulting Services' }
          ],
          type_of_business: 'Limited Liability Company',
          registration_date: '2023-01-15T10:00:00Z',
          last_login: new Date().toISOString(),
          active_rfqs: ['rfq_1', 'rfq_2'],
          submitted_bids: 12,
          awarded_contracts: 3,
          prequalification_summary: {
            total_categories_applied: 5,
            categories_approved: 3,
            categories_rejected: 1,
            approval_rate: 75
          }
        };
        VendorAuthUtils.setVendorUser(mockProfile);
        return mockProfile;
      }

      const response = await AxiosWithToken.get(VENDOR_AUTH_ENDPOINTS.PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle new API response format
      const responseData = response.data;
      const vendorUser = responseData.status === 'success' ? responseData.data.vendor : responseData.data || responseData;
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