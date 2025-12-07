import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosWithToken } from "@/constants/api_management/MyHttpHelperWithToken";
import {
  RFQDistributionCriteria,
  RFQDistributionResult,
  VendorEligibility,
  RFQNotification,
  RFQAdvertisement,
  RFQSolicitationType
} from "../types/rfq-distribution";

// RFQ Distribution endpoints
const RFQ_DISTRIBUTION_ENDPOINTS = {
  ANALYZE_ELIGIBILITY: "/procurements/rfq/analyze-vendor-eligibility/",
  DISTRIBUTE_RFQ: "/procurements/rfq/distribute/",
  GET_ELIGIBLE_VENDORS: "/procurements/rfq/:rfqId/eligible-vendors/",
  GET_DISTRIBUTION_STATUS: "/procurements/rfq/:rfqId/distribution-status/",
  RESEND_NOTIFICATIONS: "/procurements/rfq/:rfqId/resend-notifications/",
  GET_VENDOR_NOTIFICATIONS: "/vendors/notifications/",
  MARK_NOTIFICATION_READ: "/vendors/notifications/:notificationId/read/",
  PREQUALIFIED_VENDORS: "/procurements/vendors/prequalified/",
  VENDOR_CATEGORIES: "/procurements/vendors/categories/",
};

// Analyze vendor eligibility for an RFQ
export const useAnalyzeVendorEligibility = () => {
  return useMutation({
    mutationFn: async (criteria: RFQDistributionCriteria): Promise<VendorEligibility[]> => {
      const response = await AxiosWithToken.post(
        RFQ_DISTRIBUTION_ENDPOINTS.ANALYZE_ELIGIBILITY,
        criteria
      );
      return response.data.data || response.data;
    },
    onError: (error: any) => {
      console.error('Vendor eligibility analysis error:', error);
    }
  });
};

// Distribute RFQ to eligible vendors
export const useDistributeRFQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      rfq_id: string;
      distribution_criteria: RFQDistributionCriteria;
      advertisement_data: RFQAdvertisement;
      send_email: boolean;
      send_portal_notification: boolean;
    }): Promise<RFQDistributionResult> => {
      const response = await AxiosWithToken.post(
        RFQ_DISTRIBUTION_ENDPOINTS.DISTRIBUTE_RFQ,
        params
      );
      return response.data.data || response.data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['rfq-distribution-status'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-notifications'] });
    },
    onError: (error: any) => {
      console.error('RFQ distribution error:', error);
    }
  });
};

// Get eligible vendors for a specific RFQ
export const useRFQEligibleVendors = (rfqId: string) => {
  return useQuery({
    queryKey: ['rfq-eligible-vendors', rfqId],
    queryFn: async (): Promise<VendorEligibility[]> => {
      const endpoint = RFQ_DISTRIBUTION_ENDPOINTS.GET_ELIGIBLE_VENDORS.replace(':rfqId', rfqId);
      const response = await AxiosWithToken.get(endpoint);
      return response.data.data || response.data;
    },
    enabled: !!rfqId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get distribution status for an RFQ
export const useRFQDistributionStatus = (rfqId: string) => {
  return useQuery({
    queryKey: ['rfq-distribution-status', rfqId],
    queryFn: async (): Promise<RFQDistributionResult> => {
      const endpoint = RFQ_DISTRIBUTION_ENDPOINTS.GET_DISTRIBUTION_STATUS.replace(':rfqId', rfqId);
      const response = await AxiosWithToken.get(endpoint);
      return response.data.data || response.data;
    },
    enabled: !!rfqId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Resend failed notifications
export const useResendRFQNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      rfq_id: string;
      vendor_ids?: string[];
      notification_type?: 'EMAIL' | 'PORTAL' | 'BOTH';
    }): Promise<RFQDistributionResult> => {
      const endpoint = RFQ_DISTRIBUTION_ENDPOINTS.RESEND_NOTIFICATIONS.replace(':rfqId', params.rfq_id);
      const response = await AxiosWithToken.post(endpoint, {
        vendor_ids: params.vendor_ids,
        notification_type: params.notification_type
      });
      return response.data.data || response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfq-distribution-status', variables.rfq_id] });
    }
  });
};

// Get vendor notifications (for vendor portal)
export const useVendorNotifications = () => {
  return useQuery({
    queryKey: ['vendor-notifications'],
    queryFn: async (): Promise<RFQNotification[]> => {
      const response = await AxiosWithToken.get(RFQ_DISTRIBUTION_ENDPOINTS.GET_VENDOR_NOTIFICATIONS);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      const endpoint = RFQ_DISTRIBUTION_ENDPOINTS.MARK_NOTIFICATION_READ.replace(':notificationId', notificationId);
      await AxiosWithToken.patch(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-notifications'] });
    }
  });
};

// Get prequalified vendors by category
export const usePrequalifiedVendors = (categories?: string[]) => {
  return useQuery({
    queryKey: ['prequalified-vendors', categories],
    queryFn: async (): Promise<VendorEligibility[]> => {
      const params = categories ? { categories: categories.join(',') } : {};
      const response = await AxiosWithToken.get(RFQ_DISTRIBUTION_ENDPOINTS.PREQUALIFIED_VENDORS, { params });
      return response.data.data || response.data;
    },
    enabled: true,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get vendor categories with vendor counts
export const useVendorCategories = () => {
  return useQuery({
    queryKey: ['vendor-categories'],
    queryFn: async (): Promise<Array<{ category: string; total_vendors: number; prequalified_vendors: number }>> => {
      const response = await AxiosWithToken.get(RFQ_DISTRIBUTION_ENDPOINTS.VENDOR_CATEGORIES);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Utility functions for distribution logic
export const RFQDistributionUtils = {
  // Determine eligible vendors based on solicitation type
  filterVendorsBySolicitation: (
    vendors: VendorEligibility[],
    solicitationType: RFQSolicitationType,
    selectedVendors?: string[]
  ): VendorEligibility[] => {
    switch (solicitationType) {
      case 'LIMITED_SOLICITATION':
        // All prequalified vendors in the category
        return vendors.filter(vendor =>
          vendor.qualification_status === 'PREQUALIFIED' && vendor.is_eligible
        );

      case 'CLOSED_SOLICITATION':
        // Only selected prequalified vendors
        return vendors.filter(vendor =>
          vendor.qualification_status === 'PREQUALIFIED' &&
          vendor.is_eligible &&
          selectedVendors?.includes(vendor.vendor_id)
        );

      case 'SINGLE_SOURCING':
        // One specific prequalified vendor
        return vendors.filter(vendor =>
          vendor.qualification_status === 'PREQUALIFIED' &&
          vendor.is_eligible &&
          selectedVendors?.includes(vendor.vendor_id)
        ).slice(0, 1);

      case 'NATIONAL_OPEN_TENDER':
        // Handled by EOI system, not direct distribution
        return [];

      default:
        return [];
    }
  },

  // Generate distribution summary
  generateDistributionSummary: (vendors: VendorEligibility[]) => {
    const summary = {
      by_category: {} as Record<string, number>,
      by_geographical_area: {} as Record<string, number>,
      by_qualification_score: {} as Record<string, number>
    };

    vendors.forEach(vendor => {
      // Count by categories
      vendor.approved_categories.forEach(category => {
        summary.by_category[category] = (summary.by_category[category] || 0) + 1;
      });

      // Count by geographical area
      vendor.geographical_coverage.forEach(area => {
        summary.by_geographical_area[area] = (summary.by_geographical_area[area] || 0) + 1;
      });

      // Count by qualification score ranges
      if (vendor.qualification_score !== undefined) {
        const scoreRange = vendor.qualification_score >= 80 ? 'High (80-100)' :
                          vendor.qualification_score >= 60 ? 'Medium (60-79)' : 'Low (0-59)';
        summary.by_qualification_score[scoreRange] = (summary.by_qualification_score[scoreRange] || 0) + 1;
      }
    });

    return summary;
  },

  // Validate distribution criteria
  validateDistributionCriteria: (criteria: RFQDistributionCriteria): string[] => {
    const errors: string[] = [];

    if (!criteria.categories || criteria.categories.length === 0) {
      errors.push('At least one category must be specified');
    }

    if (criteria.solicitation_type === 'CLOSED_SOLICITATION' || criteria.solicitation_type === 'SINGLE_SOURCING') {
      if (!criteria.selected_vendors || criteria.selected_vendors.length === 0) {
        errors.push('Selected vendors must be specified for closed solicitation and single sourcing');
      }
    }

    if (criteria.solicitation_type === 'SINGLE_SOURCING') {
      if (criteria.selected_vendors && criteria.selected_vendors.length > 1) {
        errors.push('Single sourcing can only have one selected vendor');
      }
    }

    return errors;
  },

  // Get solicitation type display name
  getSolicitationTypeDisplayName: (type: RFQSolicitationType): string => {
    switch (type) {
      case 'LIMITED_SOLICITATION':
        return 'Limited Solicitation';
      case 'CLOSED_SOLICITATION':
        return 'Closed Solicitation';
      case 'SINGLE_SOURCING':
        return 'Single Sourcing';
      case 'NATIONAL_OPEN_TENDER':
        return 'National Open Tender';
      default:
        return type;
    }
  }
};