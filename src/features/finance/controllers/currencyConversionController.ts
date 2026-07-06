/**
 * Currency Conversion Controller
 * React Query hooks for USD → NGN currency conversions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  CurrencyConversion,
  CreateCurrencyConversion,
  CompleteCurrencyConversion,
  CurrencyConversionFilters,
  CurrencyConversionSummary,
} from "../types/currency-conversion.types";

const BASE_URL = "/finance/";

// ===== CURRENCY CONVERSION HOOKS =====

/**
 * Get all currency conversions
 */
export const useGetCurrencyConversions = (filters?: CurrencyConversionFilters) => {
  return useQuery<{ status: string; data: { results: CurrencyConversion[]; pagination?: any } }>({
    queryKey: ["currency-conversions", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}currency-conversions/`, {
          params: filters,
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch currency conversions"
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single currency conversion
 */
export const useGetCurrencyConversion = (id: string, enabled: boolean = true) => {
  return useQuery<{ status: string; data: CurrencyConversion }>({
    queryKey: ["currency-conversion", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}currency-conversions/${id}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch currency conversion"
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create currency conversion
 */
export const useCreateCurrencyConversion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; data: CurrencyConversion },
    Error,
    CreateCurrencyConversion
  >({
    mutationFn: async (conversionData: CreateCurrencyConversion) => {
      try {
        const response = await AxiosWithToken.post(
          `${BASE_URL}currency-conversions/`,
          conversionData
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          (axiosError.response?.data as any)?.error ||
          (axiosError.response?.data as any)?.message ||
          "Failed to create currency conversion"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-conversions"] });
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });
};

/**
 * Complete currency conversion
 * This will update bank account balances and create journal entries
 */
export const useCompleteCurrencyConversion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; data: CurrencyConversion },
    Error,
    CompleteCurrencyConversion
  >({
    mutationFn: async ({ conversion_id }: CompleteCurrencyConversion) => {
      try {
        const response = await AxiosWithToken.post(
          `${BASE_URL}currency-conversions/${conversion_id}/complete/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          (axiosError.response?.data as any)?.error ||
          (axiosError.response?.data as any)?.message ||
          "Failed to complete currency conversion"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-conversions"] });
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
};

/**
 * Cancel currency conversion
 */
export const useCancelCurrencyConversion = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; data: CurrencyConversion },
    Error,
    string
  >({
    mutationFn: async (conversionId: string) => {
      try {
        const response = await AxiosWithToken.post(
          `${BASE_URL}currency-conversions/${conversionId}/cancel/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          (axiosError.response?.data as any)?.error ||
          (axiosError.response?.data as any)?.message ||
          "Failed to cancel currency conversion"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-conversions"] });
    },
  });
};

/**
 * Get currency conversion summary/statistics
 */
export const useGetCurrencyConversionSummary = (filters?: CurrencyConversionFilters) => {
  return useQuery<{ status: string; data: CurrencyConversionSummary }>({
    queryKey: ["currency-conversion-summary", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}currency-conversions/summary/`,
          { params: filters }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch conversion summary"
        );
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== UTILITY FUNCTIONS =====

/**
 * Format conversion number
 */
export const formatConversionNumber = (number: string): string => {
  return number || "N/A";
};

/**
 * Get status color
 */
export const getConversionStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default"; // Green
    case "draft":
      return "secondary"; // Blue
    case "cancelled":
      return "destructive"; // Red
    default:
      return "outline";
  }
};

/**
 * Get status display text
 */
export const getConversionStatusDisplay = (status: string): string => {
  switch (status.toLowerCase()) {
    case "completed":
      return "Completed";
    case "draft":
      return "Draft";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

/**
 * Calculate NGN equivalent
 */
export const calculateNGNEquivalent = (usdAmount: string, exchangeRate: string): string => {
  const usd = parseFloat(usdAmount) || 0;
  const rate = parseFloat(exchangeRate) || 0;
  return (usd * rate).toFixed(2);
};

/**
 * Calculate net NGN deposited
 */
export const calculateNetNGN = (ngnEquivalent: string, bankCharges: string): string => {
  const equivalent = parseFloat(ngnEquivalent) || 0;
  const charges = parseFloat(bankCharges) || 0;
  return (equivalent - charges).toFixed(2);
};

/**
 * Format currency amount
 */
export const formatCurrencyAmount = (amount: string | number, currency: string = "NGN"): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const symbol = currency === "NGN" ? "₦" : "$";
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
  return `${symbol}${formatted}`;
};
