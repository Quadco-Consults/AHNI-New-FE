import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { VendorAuthUtils } from "./vendorAuthController";
import { VendorPortalStats, VendorRFQAccess, VendorCategory } from "../types/vendor-auth";

// Debug helper to log API response structure
const logAPIResponse = (endpoint: string, response: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 API Debug - ${endpoint}:`, {
      status: response?.status,
      data: response?.data,
      structure: Object.keys(response?.data || {}),
    });
  }
};

// RFQ interfaces for new API
interface RFQItem {
  id: string;
  item_name: string;
  description: string;
  quantity: number;
  specification: string;
}

interface EOIInfo {
  id: string;
  eoi_number: string;
  name: string;
  type: string;
  categories: VendorCategory[];
}

interface VendorRFQ {
  id: string;
  rfq_id: string;
  title: string;
  background: string;
  status: string;
  tender_type: string;
  request_type: string;
  procurement_type: string;
  opening_date: string;
  closing_date: string;
  days_remaining: number;
  urgency: string;
  eoi: EOIInfo;
  items_count: number;
  items_preview: RFQItem[];
  vendor_eligible: boolean;
  has_submitted_bid: boolean;
  can_submit_bid: boolean;
  specification_document?: string;
  created_datetime: string;
  is_new: boolean;
}

// Dashboard data interfaces
interface DashboardOverview {
  vendor_summary: {
    company_name: string;
    status: string;
    approved_categories: string[];
    registration_date: string;
  };
  opportunities: {
    available_rfqs: number;
    closing_soon: number;
    new_this_week: number;
  };
  bid_submissions: {
    submitted: number;
    under_evaluation: number;
    awarded: number;
    unsuccessful: number;
  };
  purchase_orders: {
    active: number;
    total_value: number;
    pending_delivery: number;
  };
  recent_activities: Array<{
    id: string;
    type: string;
    title: string;
    date: string;
    status: string;
  }>;
}

// Vendor dashboard endpoints - Updated to match API documentation
const VENDOR_DASHBOARD_ENDPOINTS = {
  DASHBOARD: "/vendor/dashboard/",
  STATS: "/vendor/dashboard/quick-stats/",
  AVAILABLE_RFQS: "/vendor/available-rfqs/",
  SUBMISSIONS: "/vendor/bid-submissions/",
  NOTIFICATIONS: "/vendor/notifications/",
};

// Vendor Dashboard Overview Hook - New comprehensive dashboard API
export const useVendorDashboardOverview = () => {
  return useQuery({
    queryKey: ['vendor-dashboard-overview'],
    queryFn: async (): Promise<DashboardOverview> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(VENDOR_DASHBOARD_ENDPOINTS.DASHBOARD, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log API response for debugging
      logAPIResponse('DASHBOARD', response);

      // Handle new API response format
      return response.data.status === 'success' ? response.data.data : response.data;
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

// Vendor Dashboard Statistics Hook
export const useVendorDashboardStats = () => {
  return useQuery({
    queryKey: ['vendor-dashboard-stats'],
    queryFn: async (): Promise<VendorPortalStats> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Development mode: return mock data for mock token
      if (process.env.NODE_ENV === 'development' && token.startsWith('mock_access_token_')) {
        const mockStats: VendorPortalStats = {
          total_rfqs_available: 15,
          submitted_bids: 12,
          pending_evaluations: 3,
          awarded_contracts: 3,
          success_rate: 75
        };
        return mockStats;
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

// Vendor Available RFQs Hook - Updated for new API
export const useVendorAvailableRFQs = (params?: {
  tender_type?: string;
  category?: string;
  closing_soon?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['vendor-available-rfqs', params],
    queryFn: async (): Promise<{
      count: number;
      summary: {
        total_available: number;
        closing_soon: number;
        new_rfqs: number;
        submitted_bids: number;
      };
      results: VendorRFQ[];
    }> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      // Development mode: return mock data for mock token
      if (process.env.NODE_ENV === 'development' && token.startsWith('mock_access_token_')) {
        const mockRFQs: VendorRFQ[] = [
          {
            id: 'rfq_1',
            rfq_id: 'RFQ-2024-001',
            title: 'Medical Equipment Procurement',
            background: 'Procurement of essential medical equipment for health facilities across Nigeria',
            status: 'OPEN',
            tender_type: 'GOODS',
            request_type: 'Public',
            procurement_type: 'Open Tender',
            opening_date: '2024-12-01T00:00:00Z',
            closing_date: '2024-12-25T23:59:59Z',
            days_remaining: 18,
            urgency: 'medium',
            eoi: {
              id: 'eoi_1',
              eoi_number: 'EOI-2024-001',
              name: 'Medical Equipment EOI',
              type: 'GOODS',
              categories: [
                { id: '1', name: 'Medical Equipment' },
                { id: '2', name: 'Healthcare Supplies' }
              ]
            },
            items_count: 15,
            items_preview: [
              {
                id: 'item_1',
                item_name: 'Digital X-Ray Machine',
                description: 'High-resolution digital X-ray machine',
                quantity: 5,
                specification: 'Latest technology with DICOM compatibility'
              }
            ],
            vendor_eligible: true,
            has_submitted_bid: false,
            can_submit_bid: true,
            specification_document: '/docs/medical-equipment-specs.pdf',
            created_datetime: '2024-12-01T10:00:00Z',
            is_new: true
          },
          {
            id: 'rfq_2',
            rfq_id: 'RFQ-2024-002',
            title: 'Office Supplies and Stationery',
            background: 'Annual procurement of office supplies for AHNI headquarters and regional offices',
            status: 'OPEN',
            tender_type: 'GOODS',
            request_type: 'Public',
            procurement_type: 'Open Tender',
            opening_date: '2024-11-25T00:00:00Z',
            closing_date: '2024-12-20T23:59:59Z',
            days_remaining: 13,
            urgency: 'medium',
            eoi: {
              id: 'eoi_2',
              eoi_number: 'EOI-2024-002',
              name: 'Office Supplies EOI',
              type: 'GOODS',
              categories: [
                { id: '2', name: 'Office Supplies' }
              ]
            },
            items_count: 25,
            items_preview: [
              {
                id: 'item_2',
                item_name: 'A4 Paper',
                description: 'High-quality A4 printing paper',
                quantity: 1000,
                specification: '80gsm, white, 500 sheets per ream'
              }
            ],
            vendor_eligible: true,
            has_submitted_bid: true,
            can_submit_bid: false,
            created_datetime: '2024-11-25T10:00:00Z',
            is_new: false
          }
        ];

        return {
          count: mockRFQs.length,
          summary: {
            total_available: 15,
            closing_soon: 3,
            new_rfqs: 2,
            submitted_bids: 1
          },
          results: mockRFQs
        };
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.tender_type) queryParams.append('tender_type', params.tender_type);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.closing_soon) queryParams.append('closing_soon', 'true');
      if (params?.search) queryParams.append('search', params.search);

      const url = `${VENDOR_DASHBOARD_ENDPOINTS.AVAILABLE_RFQS}${queryParams.toString() ? `?${queryParams}` : ''}`;

      const response = await AxiosWithToken.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log API response for debugging
      logAPIResponse('AVAILABLE_RFQS', response);

      return response.data;
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

// Get Vendor Categories Hook
export const useVendorCategories = () => {
  return useQuery({
    queryKey: ['vendor-categories'],
    queryFn: async (): Promise<Array<VendorCategory & { rfq_count: number }>> => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(`${VENDOR_DASHBOARD_ENDPOINTS.AVAILABLE_RFQS}/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: VendorAuthUtils.isVendorAuthenticated(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
        return false;
      }
      return failureCount < 3;
    },
  });
};

// RFQ Summary Statistics Hook
export const useRFQSummary = () => {
  return useQuery({
    queryKey: ['rfq-summary'],
    queryFn: async () => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(`${VENDOR_DASHBOARD_ENDPOINTS.AVAILABLE_RFQS}/summary/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
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

// Specific RFQ Details Hook - Updated to new API
export const useVendorRFQDetails = (rfqId: string) => {
  return useQuery({
    queryKey: ['vendor-rfq-details', rfqId],
    queryFn: async () => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.get(`${VENDOR_DASHBOARD_ENDPOINTS.AVAILABLE_RFQS}/${rfqId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
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

// Mark Notification as Read Hook
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const token = VendorAuthUtils.getVendorToken();
      if (!token) {
        throw new Error('No vendor token found');
      }

      const response = await AxiosWithToken.patch(
        `/procurements/vendors/notifications/${notificationId}/mark-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['vendor-notifications'] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        VendorAuthUtils.removeVendorToken();
      }
    },
  });
};