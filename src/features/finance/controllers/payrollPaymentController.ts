/**
 * Payroll Payment Controller
 *
 * React Query hooks for Finance to process HR-approved payrolls.
 */

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PendingPayroll,
  PayrollDetails,
  ProcessPayrollPaymentRequest,
  ProcessPayrollPaymentResponse,
  PayrollPaymentSummary,
} from "../types/payroll-payment.types";

const BASE_URL = "/finance/payroll-payments/";

// ===== GET OPERATIONS =====

/**
 * Get all pending payrolls (Finance queue)
 */
export const useGetPendingPayrolls = () => {
  return useQuery<{ status: string; data: PendingPayroll[] }>({
    queryKey: ["pending-payrolls"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
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
 * Get payroll details
 */
export const useGetPayrollDetails = (id: string, enabled: boolean = true) => {
  return useQuery<{ status: string; data: PayrollDetails }>({
    queryKey: ["payroll-details", id],
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
 * Get payroll payment summary
 */
export const useGetPayrollPaymentSummary = () => {
  return useQuery<{ status: string; data: PayrollPaymentSummary }>({
    queryKey: ["payroll-payment-summary"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}summary/`);
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

// ===== PROCESS PAYMENT OPERATION =====

/**
 * Process payroll payment
 */
export const useProcessPayrollPayment = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ProcessPayrollPaymentResponse,
    Error,
    ProcessPayrollPaymentRequest
  >({
    endpoint: "",
    queryKey: ["pending-payrolls", "payment-disbursements"],
    isAuth: true,
    method: "POST",
  });

  const processPayment = async (
    payrollBatchId: string,
    paymentData: ProcessPayrollPaymentRequest
  ) => {
    try {
      console.log("Processing payroll payment:", payrollBatchId, paymentData);
      await callApi({
        endpoint: `${BASE_URL}${payrollBatchId}/process_payment/`,
        data: paymentData,
      });
    } catch (err) {
      console.error("Error processing payroll payment:", err);
      throw err;
    }
  };

  return {
    processPayment,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

// ===== HELPER FUNCTIONS =====

/**
 * Format payroll month for display
 */
export const formatPayrollMonth = (month: string): string => {
  // Convert "2026-01" to "January 2026"
  const [year, monthNum] = month.split("-");
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Calculate total allocated across projects
 */
export const calculateTotalAllocated = (
  projectBreakdown: { allocated_amount: number }[]
): number => {
  return projectBreakdown.reduce(
    (sum, item) => sum + item.allocated_amount,
    0
  );
};

/**
 * Get payroll status badge color
 */
export const getPayrollStatusColor = (
  status: string
): "default" | "warning" | "success" => {
  switch (status) {
    case "approved":
      return "warning";
    case "paid":
      return "success";
    default:
      return "default";
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Get project allocation summary text
 */
export const getProjectAllocationSummary = (
  projectBreakdown: { project_code: string; percentage: number }[]
): string => {
  if (!projectBreakdown || projectBreakdown.length === 0) {
    return "No project allocations";
  }

  if (projectBreakdown.length === 1) {
    return `100% ${projectBreakdown[0].project_code}`;
  }

  return projectBreakdown
    .map((p) => `${p.percentage.toFixed(0)}% ${p.project_code}`)
    .join(", ");
};

/**
 * Validate payment data before submission
 */
export const validatePaymentData = (
  data: ProcessPayrollPaymentRequest
): string[] => {
  const errors: string[] = [];

  if (!data.payment_date) {
    errors.push("Payment date is required");
  }

  if (!data.bank_account_id) {
    errors.push("Bank account is required");
  }

  if (!data.payment_reference || data.payment_reference.trim() === "") {
    errors.push("Payment reference is required");
  }

  // Validate date is not in the future
  const paymentDate = new Date(data.payment_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (paymentDate > today) {
    errors.push("Payment date cannot be in the future");
  }

  return errors;
};
