import { useQuery } from "@tanstack/react-query";
import { AxiosWithToken } from "@/constants/api_management/MyHttpHelperWithToken";
import { VendorAuthUtils } from "./vendorAuthController";
import { VendorPortalStats, VendorRFQAccess } from "../types/vendor-auth";

// Vendor dashboard endpoints
const VENDOR_DASHBOARD_ENDPOINTS = {
  STATS: "/procurements/vendors/portal-stats/",
  AVAILABLE_RFQS: "/procurements/vendors/available-rfqs/",
  SUBMISSIONS: "/procurements/vendors/my-submissions/",
  NOTIFICATIONS: "/procurements/vendors/notifications/",
};

// Vendor Dashboard Statistics Hook
export const useVendorDashboardStats = () => {
  return useQuery({
    queryKey: ['vendor-dashboard-stats'],
    queryFn: async (): Promise<VendorPortalStats> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(VENDOR_DASHBOARD_ENDPOINTS.STATS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data || response.data;
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

// Vendor Available RFQs Hook
export const useVendorAvailableRFQs = () => {
  return useQuery({
    queryKey: ['vendor-available-rfqs'],
    queryFn: async (): Promise<VendorRFQAccess[]> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(VENDOR_DASHBOARD_ENDPOINTS.AVAILABLE_RFQS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Vendor Submissions Hook
export const useVendorSubmissions = () => {
  return useQuery({
    queryKey: ['vendor-submissions'],
    queryFn: async () => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(VENDOR_DASHBOARD_ENDPOINTS.SUBMISSIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : data.results || [];
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

// Vendor Notifications Hook
export const useVendorNotifications = () => {
  return useQuery({
    queryKey: ['vendor-notifications'],
    queryFn: async () => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(VENDOR_DASHBOARD_ENDPOINTS.NOTIFICATIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data || response.data;
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Specific RFQ Details Hook
export const useVendorRFQDetails = (rfqId: string) => {
  return useQuery({
    queryKey: ['vendor-rfq-details', rfqId],
    queryFn: async () => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(`/procurements/rfq/${rfqId}/vendor-view/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data || response.data;
    },
    enabled: !!rfqId && VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 10, // 10 minutes for RFQ details
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};