import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import { ConsultantAuthUtils } from "./consultantAuthController";
import {
  PaymentRequestListResponse,
  PaymentRequestDetailResponse,
  PaymentRequestStatisticsResponse,
  CreatePaymentRequestData,
} from "../types/payment-request";

// Payment request endpoints
const PAYMENT_REQUEST_ENDPOINTS = {
  LIST: "/contract-grants/consultant-portal/payment-requests/",
  DETAIL: (id: string) => `/contract-grants/consultant-portal/payment-requests/${id}/`,
  STATISTICS: "/contract-grants/consultant-portal/payment-requests/statistics/",
  UPLOAD_DOCUMENT: (id: string) => `/contract-grants/consultant-portal/payment-requests/${id}/upload-document/`,
};

// List Payment Requests Hook
export const usePaymentRequests = (page: number = 1, pageSize: number = 20, status?: string) => {
  return useQuery({
    queryKey: ['consultant-payment-requests', page, pageSize, status],
    queryFn: async (): Promise<PaymentRequestListResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (status) {
        params.append('status', status);
      }

      const response = await ConsultantAxiosWithToken.get(
        `${PAYMENT_REQUEST_ENDPOINTS.LIST}?${params.toString()}`
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get Payment Request Detail Hook
export const usePaymentRequestDetail = (id: string) => {
  return useQuery({
    queryKey: ['consultant-payment-request-detail', id],
    queryFn: async (): Promise<PaymentRequestDetailResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        PAYMENT_REQUEST_ENDPOINTS.DETAIL(id)
      );
      return response.data;
    },
    enabled: !!id && ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get Payment Request Statistics Hook
export const usePaymentRequestStatistics = () => {
  return useQuery({
    queryKey: ['consultant-payment-request-statistics'],
    queryFn: async (): Promise<PaymentRequestStatisticsResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        PAYMENT_REQUEST_ENDPOINTS.STATISTICS
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create Payment Request Hook
export const useCreatePaymentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentRequestData): Promise<any> => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('payment_reason', data.payment_reason);
      formData.append('payment_date', data.payment_date);
      formData.append('amount', data.amount.toString());
      formData.append('document', data.document);

      const response = await ConsultantAxiosWithToken.post(
        PAYMENT_REQUEST_ENDPOINTS.LIST,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['consultant-payment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-payment-request-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-dashboard'] });
    },
  });
};

// Upload Additional Document Hook
export const useUploadPaymentRequestDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentRequestId, document }: { paymentRequestId: string; document: File }): Promise<any> => {
      const formData = new FormData();
      formData.append('document', document);

      const response = await ConsultantAxiosWithToken.post(
        PAYMENT_REQUEST_ENDPOINTS.UPLOAD_DOCUMENT(paymentRequestId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['consultant-payment-request-detail', variables.paymentRequestId] });
    },
  });
};
