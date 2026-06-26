/**
 * Payment Voucher Controller
 *
 * React Query hooks for payment voucher management.
 */

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PaymentVoucher,
  PaymentVoucherDetails,
  CreatePaymentVoucher,
  UpdatePaymentVoucher,
  UpdatePaymentVoucherStatus,
  CancelPaymentVoucher,
  PaymentVoucherStatistics,
  PaymentVoucherFilters,
} from "../types/payment-voucher.types";

const BASE_URL = "/finance/payment-vouchers/";

// ===== GET OPERATIONS =====

/**
 * Get all payment vouchers with filtering
 */
export const useGetPaymentVouchers = (
  filters?: PaymentVoucherFilters & { page?: number; size?: number }
) => {
  return useQuery<{
    status: string;
    data: PaymentVoucher[];
    pagination?: { page: number; size: number; total: number; pages: number };
  }>({
    queryKey: ["payment-vouchers", filters],
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
 * Get single payment voucher details
 */
export const useGetPaymentVoucher = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<{ status: string; data: PaymentVoucherDetails }>({
    queryKey: ["payment-voucher", id],
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
 * Get payment vouchers by payment request
 */
export const useGetPaymentVouchersByRequest = (paymentRequestId?: string) => {
  return useQuery<{ status: string; data: PaymentVoucher[] }>({
    queryKey: ["payment-vouchers-by-request", paymentRequestId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}by_payment_request/`,
          {
            params: { payment_request_id: paymentRequestId },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: !!paymentRequestId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get payment voucher statistics
 */
export const useGetPaymentVoucherStatistics = () => {
  return useQuery<{ status: string; data: PaymentVoucherStatistics }>({
    queryKey: ["payment-voucher-statistics"],
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
 * Create payment voucher
 */
export const useCreatePaymentVoucher = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: PaymentVoucherDetails },
    Error,
    CreatePaymentVoucher
  >({
    endpoint: BASE_URL,
    queryKey: ["payment-vouchers"],
    isAuth: true,
    method: "POST",
  });

  const createPaymentVoucher = async (voucherData: CreatePaymentVoucher) => {
    try {
      console.log("Creating payment voucher:", voucherData);
      await callApi({ data: voucherData });
    } catch (err) {
      console.error("Error creating payment voucher:", err);
      throw err;
    }
  };

  return {
    createPaymentVoucher,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Update payment voucher
 */
export const useUpdatePaymentVoucher = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: PaymentVoucherDetails },
    Error,
    UpdatePaymentVoucher
  >({
    endpoint: "",
    queryKey: ["payment-vouchers"],
    isAuth: true,
    method: "PATCH",
  });

  const updatePaymentVoucher = async (
    voucherId: string,
    voucherData: UpdatePaymentVoucher
  ) => {
    try {
      console.log("Updating payment voucher:", voucherId, voucherData);
      await callApi({
        endpoint: `${BASE_URL}${voucherId}/`,
        data: voucherData,
      });
    } catch (err) {
      console.error("Error updating payment voucher:", err);
      throw err;
    }
  };

  return {
    updatePaymentVoucher,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Update payment voucher status
 */
export const useUpdatePaymentVoucherStatus = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: PaymentVoucherDetails },
    Error,
    UpdatePaymentVoucherStatus
  >({
    endpoint: "",
    queryKey: ["payment-vouchers"],
    isAuth: true,
    method: "POST",
  });

  const updateStatus = async (
    voucherId: string,
    statusData: UpdatePaymentVoucherStatus
  ) => {
    try {
      console.log("Updating payment voucher status:", voucherId, statusData);
      await callApi({
        endpoint: `${BASE_URL}${voucherId}/update_status/`,
        data: statusData,
      });
    } catch (err) {
      console.error("Error updating payment voucher status:", err);
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

/**
 * Cancel payment voucher
 */
export const useCancelPaymentVoucher = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { status: string; data: PaymentVoucherDetails },
    Error,
    CancelPaymentVoucher
  >({
    endpoint: "",
    queryKey: ["payment-vouchers"],
    isAuth: true,
    method: "POST",
  });

  const cancelPaymentVoucher = async (
    voucherId: string,
    cancelData: CancelPaymentVoucher
  ) => {
    try {
      console.log("Cancelling payment voucher:", voucherId, cancelData);
      await callApi({
        endpoint: `${BASE_URL}${voucherId}/cancel/`,
        data: cancelData,
      });
    } catch (err) {
      console.error("Error cancelling payment voucher:", err);
      throw err;
    }
  };

  return {
    cancelPaymentVoucher,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== HELPER FUNCTIONS =====

/**
 * Get payment voucher status badge color
 */
export const getPaymentVoucherStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "DRAFT":
      return "default";
    case "ISSUED":
      return "warning";
    case "PAID":
      return "success";
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};

/**
 * Get payment method display icon/badge
 */
export const getPaymentMethodColor = (
  method: string
): "default" | "secondary" | "outline" => {
  switch (method) {
    case "BANK_TRANSFER":
      return "default";
    case "CHEQUE":
      return "secondary";
    case "CASH":
      return "outline";
    case "MOBILE_MONEY":
      return "outline";
    default:
      return "default";
  }
};

/**
 * Format payment voucher number for display
 */
export const formatPVNumber = (number: string): string => {
  return number || "N/A";
};

/**
 * Format currency amount
 */
export const formatCurrencyAmount = (amount: number): string => {
  return `₦${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Calculate total deductions
 */
export const calculateTotalDeductions = (voucher: PaymentVoucher): number => {
  return (
    (voucher.total_wht || 0) +
    (voucher.total_vat || 0) +
    (voucher.total_paye || 0) +
    (voucher.total_pension || 0) +
    (voucher.total_nhis || 0)
  );
};

/**
 * Check if payment voucher can be edited
 */
export const canEditPaymentVoucher = (status: string): boolean => {
  return status === "DRAFT";
};

/**
 * Check if payment voucher can be cancelled
 */
export const canCancelPaymentVoucher = (status: string): boolean => {
  return status !== "PAID" && status !== "CANCELLED";
};

/**
 * Download payment voucher as PDF
 */
export const downloadPaymentVoucherPDF = async (
  voucherId: string,
  pvNumber?: string
): Promise<void> => {
  try {
    const response = await AxiosWithToken.get(
      `${BASE_URL}${voucherId}/download_pdf/`,
      {
        responseType: "blob", // Important for binary data
      }
    );

    // Create blob from response
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `PV_${pvNumber || voucherId}.pdf`
    );

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading payment voucher PDF:", error);
    throw error;
  }
};
