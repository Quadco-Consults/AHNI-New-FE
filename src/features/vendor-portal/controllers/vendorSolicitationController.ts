/**
 * Vendor Portal RFQ/RFP Controller
 *
 * Handles vendor-specific solicitation viewing and bid submissions
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

interface ApiResponse<TData = unknown> {
  status?: boolean;
  message: string;
  data: TData;
}

export interface VendorSolicitation {
  id: string;
  rfq_id?: string;
  rfp_id?: string;
  title: string;
  description: string;
  request_type: 'RFQ' | 'RFP';
  tender_type: string;
  status: 'OPEN' | 'CLOSED';
  opening_date: string;
  closing_date: string;
  categories: Array<{ id: string; name: string }>;
  items_count: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  is_new: boolean;
  has_submitted: boolean;
  days_remaining: number;
  eoi_tender?: {
    id: string;
    name: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

export interface VendorBidSubmission {
  id: string;
  solicitation: {
    id: string;
    title: string;
    rfq_id: string;
    status: string;
    closing_date: string;
  };
  total_amount: number;
  currency: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  delivery_time: string;
  validity_period: string;
  submitted_at: string;
  can_edit: boolean;
  items_count: number;
}

export interface BidItem {
  solicitation_item_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  delivery_time: string;
  specifications: string;
}

export interface CreateBidPayload {
  solicitation_id: string;
  total_amount: number;
  currency: string;
  delivery_time: string;
  validity_period: string;
  payment_terms?: string;
  warranty_period?: string;
  technical_specifications?: string;
  bid_items: BidItem[];
}

const BASE_URL = "/vendor-portal";

export const useGetVendorSolicitations = (filters?: {
  tender_type?: string;
  request_type?: string;
  category?: string;
  closing_soon?: boolean;
  search?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.tender_type) params.append('tender_type', filters.tender_type);
  if (filters?.request_type) params.append('request_type', filters.request_type);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.closing_soon) params.append('closing_soon', 'true');
  if (filters?.search) params.append('search', filters.search);

  return useQuery<ApiResponse<{ results: VendorSolicitation[]; summary: any }>>({
    queryKey: ['vendor-solicitations', filters],
    queryFn: async () => {
      const url = `${BASE_URL}/rfqs/${params.toString() ? '?' + params.toString() : ''}`;
      const response = await AxiosWithToken.get(url);
      return response.data;
    },
  });
};

export const useGetVendorSolicitation = (solicitationId: string, enabled = true) => {
  return useQuery<ApiResponse<VendorSolicitation>>({
    queryKey: ['vendor-solicitation', solicitationId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}/rfqs/${solicitationId}/`);
      return response.data;
    },
    enabled: enabled && !!solicitationId,
  });
};

export const useGetVendorBids = (filters?: {
  status?: string;
  solicitation?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.solicitation) params.append('solicitation', filters.solicitation);

  return useQuery<ApiResponse<{ results: VendorBidSubmission[]; summary: any }>>({
    queryKey: ['vendor-bids', filters],
    queryFn: async () => {
      const url = `${BASE_URL}/bid-submissions/${params.toString() ? '?' + params.toString() : ''}`;
      const response = await AxiosWithToken.get(url);
      return response.data;
    },
  });
};

export const useGetVendorBid = (bidId: string, enabled = true) => {
  return useQuery<ApiResponse<VendorBidSubmission>>({
    queryKey: ['vendor-bid', bidId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}/bid-submissions/${bidId}/`);
      return response.data;
    },
    enabled: enabled && !!bidId,
  });
};

export const useCreateBid = () => {
  return useMutation<ApiResponse<VendorBidSubmission>, AxiosError, CreateBidPayload>({
    mutationFn: async (bidData) => {
      const response = await AxiosWithToken.post(`${BASE_URL}/bid-submissions/`, bidData);
      return response.data;
    },
  });
};

export const useUpdateBid = (bidId: string) => {
  return useMutation<ApiResponse<VendorBidSubmission>, AxiosError, Partial<CreateBidPayload>>({
    mutationFn: async (bidData) => {
      const response = await AxiosWithToken.put(`${BASE_URL}/bid-submissions/${bidId}/`, bidData);
      return response.data;
    },
  });
};

export const useSubmitBid = (bidId: string) => {
  return useMutation<ApiResponse<VendorBidSubmission>, AxiosError>({
    mutationFn: async () => {
      const response = await AxiosWithToken.post(`${BASE_URL}/bid-submissions/${bidId}/submit/`);
      return response.data;
    },
  });
};

export default {
  useGetVendorSolicitations,
  useGetVendorSolicitation,
  useGetVendorBids,
  useGetVendorBid,
  useCreateBid,
  useUpdateBid,
  useSubmitBid,
};
