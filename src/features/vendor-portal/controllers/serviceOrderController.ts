import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import VendorAxiosWithToken from "@/constants/api_management/VendorHttpHelper";

// Service Order Types
export interface ServiceOrder {
  id: string;
  service_order_number: string;
  order_date: string;
  status: SOStatus;
  status_info: {
    color: string;
    text: string;
    description: string;
  };
  action_required: {
    required: boolean;
    action?: string;
    message?: string;
  };
  service_type: string;
  service_type_display: string;
  service_description: string;
  is_recurring: boolean;
  service_start_date?: string;
  service_end_date?: string;
  gross_total: string;
  total_vat: string;
  total_wht: string;
  net_payable: string;
  currency: string;
  department?: {
    name: string;
    id: string;
  };
  payment_frequency: string;
  payment_frequency_display: string;
  payment_terms?: string;
  items_count: number;
  items_preview: Array<{
    description: string;
    quantity: number;
    unit_price: string;
  }>;
  approved_by?: string;
  approved_date?: string;
  agreed_by?: string;
  agreed_date?: string;
  created_datetime: string;
  is_new: boolean;
}

export interface ServiceOrderDetails extends ServiceOrder {
  vendor: {
    id: string;
    company_name: string;
    email: string;
    phone_numbers?: string;
    company_address?: string;
    tin?: string;
    account_name?: string;
    account_number?: string;
    bank_name?: string;
  };
  service_items: Array<{
    id: string;
    item?: {
      id: string;
      name: string;
      category?: string;
    };
    description: string;
    quantity: number;
    unit_of_measure?: string;
    unit_price: string;
    total_price: string;
    notes?: string;
  }>;
  vendor_contact_person?: string;
  vendor_contact_phone?: string;
  approval_workflow: {
    reviewed_by?: {
      name: string;
      email: string;
      datetime: string;
    };
    authorized_by?: {
      name: string;
      email: string;
      datetime: string;
    };
    approved_by?: {
      name: string;
      email: string;
      date: string;
    };
    agreed_by?: {
      name: string;
      email: string;
      date: string;
    };
  };
  purchase_request?: {
    id: string;
    ref_number: string;
  };
  funding_source?: {
    id: string;
    name: string;
    description?: string;
  };
  fco_number?: {
    id: string;
    number: string;
  };
  notes?: string;
  last_updated: string;
  vendor_actions: Array<{
    action: string;
    label: string;
    description: string;
  }>;
}

export type SOStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'REVIEWED'
  | 'AUTHORIZED'
  | 'APPROVED'
  | 'AGREED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface SOAcknowledgment {
  so_id: string;
  vendor_notes?: string;
  service_start_confirmation?: string;
}

export interface VendorServiceOrderSummary {
  status_counts: {
    total: number;
    approved: number;
    agreed: number;
    in_progress: number;
    completed: number;
  };
  financial_summary: {
    total_value: string;
    active_value: string;
  };
  recent_sos: number;
  vendor_company: string;
}

// Service Order endpoints
const SO_ENDPOINTS = {
  VENDOR_SOS: "/procurements/vendor/service-orders/",
  SO_DETAILS: "/procurements/vendor/service-orders/:soId/",
  ACKNOWLEDGE_SO: "/procurements/vendor/service-orders/:soId/acknowledge/",
  SO_SUMMARY: "/procurements/vendor/service-order-summary/",
};

// Get vendor's service orders
export const useVendorServiceOrders = (status?: SOStatus) => {
  return useQuery({
    queryKey: ['vendor-service-orders', status],
    queryFn: async (): Promise<{ count: number; results: ServiceOrder[]; summary: any }> => {
      const params = status ? { status } : {};
      const response = await VendorAxiosWithToken.get(SO_ENDPOINTS.VENDOR_SOS, { params });
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get specific SO details
export const useServiceOrderDetails = (soId: string) => {
  return useQuery({
    queryKey: ['service-order-details', soId],
    queryFn: async (): Promise<ServiceOrderDetails> => {
      const endpoint = SO_ENDPOINTS.SO_DETAILS.replace(':soId', soId);
      const response = await VendorAxiosWithToken.get(endpoint);
      return response.data.data || response.data;
    },
    enabled: !!soId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Acknowledge a service order
export const useAcknowledgeServiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (acknowledgment: SOAcknowledgment) => {
      const endpoint = SO_ENDPOINTS.ACKNOWLEDGE_SO.replace(':soId', acknowledgment.so_id);
      const response = await VendorAxiosWithToken.post(endpoint, acknowledgment);
      return response.data.data || response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['vendor-service-orders'] });
      queryClient.invalidateQueries({ queryKey: ['service-order-details', variables.so_id] });
      queryClient.invalidateQueries({ queryKey: ['vendor-service-order-summary'] });
    },
    onError: (error: any) => {
      console.error('SO acknowledgment error:', error);
    }
  });
};

// Get vendor service order summary
export const useVendorServiceOrderSummary = () => {
  return useQuery({
    queryKey: ['vendor-service-order-summary'],
    queryFn: async (): Promise<VendorServiceOrderSummary> => {
      const response = await VendorAxiosWithToken.get(SO_ENDPOINTS.SO_SUMMARY);
      return response.data.data || response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Utility functions for Service Orders
export const SOUtils = {
  getStatusBadgeVariant: (status: SOStatus): "default" | "secondary" | "destructive" | "outline" => {
    const variantMap: Record<SOStatus, "default" | "secondary" | "destructive" | "outline"> = {
      'DRAFT': 'secondary',
      'PENDING': 'outline',
      'REVIEWED': 'default',
      'AUTHORIZED': 'default',
      'APPROVED': 'default',
      'AGREED': 'default',
      'IN_PROGRESS': 'default',
      'COMPLETED': 'secondary',
      'CANCELLED': 'destructive',
    };
    return variantMap[status] || 'outline';
  },

  getStatusDisplayName: (status: SOStatus): string => {
    const nameMap: Record<SOStatus, string> = {
      'DRAFT': 'Draft',
      'PENDING': 'Pending',
      'REVIEWED': 'Reviewed',
      'AUTHORIZED': 'Authorized',
      'APPROVED': 'Approved',
      'AGREED': 'Acknowledged',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
    };
    return nameMap[status] || status;
  },

  formatCurrency: (amount: number | string, currency: string = 'NGN'): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
    }).format(numAmount);
  },

  isSOOverdue: (so: ServiceOrder): boolean => {
    if (!so.service_end_date) return false;
    const endDate = new Date(so.service_end_date);
    const today = new Date();
    return today > endDate && !['COMPLETED', 'CANCELLED'].includes(so.status);
  },

  getDaysUntilEnd: (endDate: string): number => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
};
