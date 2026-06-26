/**
 * Expense Recovery Controller
 *
 * React Query hooks for expense recovery and vendor bill management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  VendorBill,
  VendorBillFilters,
  CreateRecoveryInvoiceRequest,
  RecoveryInvoice,
  ExpenseRecoveryStats,
} from "../types/expense-recovery.types";

// API endpoints
const VENDOR_BILLS_ENDPOINT = "/finance/vendor-bills";
const RECOVERY_INVOICE_ENDPOINT = "/finance/expense-recovery/create-from-vendor-bill";

// Query keys
export const expenseRecoveryKeys = {
  all: ["expense-recovery"] as const,
  vendorBills: () => [...expenseRecoveryKeys.all, "vendor-bills"] as const,
  vendorBillsList: (filters: any) =>
    [...expenseRecoveryKeys.vendorBills(), { filters }] as const,
  vendorBill: (id: string) =>
    [...expenseRecoveryKeys.vendorBills(), id] as const,
  stats: () => [...expenseRecoveryKeys.all, "stats"] as const,
};

// ===== GET OPERATIONS =====

/**
 * Get vendor bills for expense recovery
 */
export const useGetVendorBills = (filters?: VendorBillFilters) => {
  return useQuery<{
    status: string;
    data: VendorBill[];
    pagination?: { page: number; size: number; total: number; pages: number };
  }>({
    queryKey: expenseRecoveryKeys.vendorBillsList(filters),
    queryFn: async () => {
      try {
        const params = new URLSearchParams();

        if (filters?.has_recovery_invoice !== undefined)
          params.append(
            "has_recovery_invoice",
            filters.has_recovery_invoice.toString()
          );
        if (filters?.service_type)
          params.append("service_type", filters.service_type);
        if (filters?.vendor_id) params.append("vendor_id", filters.vendor_id);
        if (filters?.start_date) params.append("start_date", filters.start_date);
        if (filters?.end_date) params.append("end_date", filters.end_date);
        if (filters?.search) params.append("search", filters.search);
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.page_size)
          params.append("page_size", filters.page_size.toString());

        const response = await AxiosWithToken.get(
          `${VENDOR_BILLS_ENDPOINT}?${params.toString()}`
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
 * Get single vendor bill details
 */
export const useGetVendorBill = (id: string, enabled: boolean = true) => {
  return useQuery<{ status: string; data: VendorBill }>({
    queryKey: expenseRecoveryKeys.vendorBill(id),
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${VENDOR_BILLS_ENDPOINT}/${id}/`
        );
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
 * Get expense recovery statistics
 */
export const useGetExpenseRecoveryStats = () => {
  return useQuery<{ status: string; data: ExpenseRecoveryStats }>({
    queryKey: expenseRecoveryKeys.stats(),
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${VENDOR_BILLS_ENDPOINT}/stats/`
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

// ===== MUTATION OPERATIONS =====

/**
 * Create recovery invoice from vendor bill
 */
export const useCreateRecoveryInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; data: RecoveryInvoice },
    AxiosError,
    CreateRecoveryInvoiceRequest
  >({
    mutationFn: async (data: CreateRecoveryInvoiceRequest) => {
      try {
        const response = await AxiosWithToken.post(
          RECOVERY_INVOICE_ENDPOINT,
          data
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: expenseRecoveryKeys.vendorBills(),
      });
      queryClient.invalidateQueries({
        queryKey: expenseRecoveryKeys.stats(),
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
