/**
 * Payment Disbursement Controller
 *
 * React Query hooks for payment disbursement management.
 */

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PaymentDisbursement,
  PaymentDisbursementDetails,
  CreatePaymentDisbursement,
  UpdateDisbursementStatus,
  DisbursementStatistics,
  PendingPaymentRequest,
  PaymentDisbursementFilters,
  PaymentDisbursementResponse,
} from "../types/payment-disbursement.types";

const BASE_URL = "/finance/payment-disbursements/";

// ===== GET OPERATIONS =====

/**
 * Get all payment disbursements with filtering
 */
export const useGetPaymentDisbursements = (
  filters?: PaymentDisbursementFilters & { page?: number; size?: number }
) => {
  return useQuery<{
    status: string;
    data: PaymentDisbursement[];
    pagination?: { page: number; size: number; total: number; pages: number };
  }>({
    queryKey: ["payment-disbursements", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page: filters?.page || 1,
            size: filters?.size || 20,
            ...filters,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single payment disbursement details
 */
export const useGetPaymentDisbursement = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<{ status: string; data: PaymentDisbursementDetails }>({
    queryKey: ["payment-disbursement", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get pending payment requests (Finance queue)
 */
export const useGetPendingPaymentRequests = () => {
  return useQuery<{ status: string; data: PendingPaymentRequest[] }>({
    queryKey: ["pending-payment-requests"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}pending_payment_requests/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get disbursement statistics
 */
export const useGetDisbursementStatistics = () => {
  return useQuery<{ status: string; data: DisbursementStatistics }>({
    queryKey: ["disbursement-statistics"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}statistics/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== CREATE/UPDATE OPERATIONS =====

/**
 * Create payment disbursement
 */
export const useCreatePaymentDisbursement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: PaymentDisbursementDetails },
    Error,
    CreatePaymentDisbursement
  >({
    endpoint: BASE_URL,
    queryKey: ["payment-disbursements"],
    isAuth: true,
    method: "POST",
  });

  const createDisbursement = async (disbursementData: CreatePaymentDisbursement) => {
    try {
      console.log("Creating payment disbursement:", disbursementData);
      await callApi({ data: disbursementData });
    } catch (err) {
      console.error("Error creating disbursement:", err);
      throw err;
    }
  };

  return {
    createDisbursement,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Update disbursement status
 */
export const useUpdateDisbursementStatus = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: PaymentDisbursementDetails },
    Error,
    UpdateDisbursementStatus
  >({
    endpoint: "",
    queryKey: ["payment-disbursements"],
    isAuth: true,
    method: "POST",
  });

  const updateStatus = async (
    disbursementId: string,
    statusData: UpdateDisbursementStatus
  ) => {
    try {
      console.log("Updating disbursement status:", disbursementId, statusData);
      await callApi({
        endpoint: `${BASE_URL}${disbursementId}/update_status/`,
        data: statusData,
      });
    } catch (err) {
      console.error("Error updating disbursement status:", err);
      throw err;
    }
  };

  return {
    updateStatus,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== HELPER FUNCTIONS =====

/**
 * Get disbursement status badge color
 */
export const getDisbursementStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "PROCESSING":
      return "warning";
    case "COMPLETED":
      return "success";
    case "FAILED":
    case "REVERSED":
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};

/**
 * Get payment type icon/badge color
 */
export const getPaymentTypeColor = (
  type: string
): "default" | "secondary" | "outline" => {
  switch (type) {
    case "PAYROLL":
      return "secondary";
    case "PAYMENT_REQUEST":
      return "default";
    case "PETTY_CASH":
    case "HONOUR_CERTIFICATE":
      return "outline";
    default:
      return "default";
  }
};

/**
 * Format disbursement number for display
 */
export const formatDisbursementNumber = (number: string): string => {
  return number || "N/A";
};

/**
 * Format currency amount
 */
export const formatCurrencyAmount = (
  amount: number,
  currency: string = "NGN"
): string => {
  const currencySymbol = currency === "NGN" ? "₦" : "$";
  return `${currencySymbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
