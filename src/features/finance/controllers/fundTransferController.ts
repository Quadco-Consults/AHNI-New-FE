/**
 * Fund Transfer Controller
 * React Query hooks for internal fund transfers between bank accounts
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  FundTransfer,
  CreateFundTransfer,
  CreateFundDistribution,
  FundDistributionResult,
  TransferHistory,
  TransferHistoryFilters,
  ProjectAccounts,
} from "../types/fund-transfer.types";

const BASE_URL = "/finance/fund-transfers/";

// ===== FUND TRANSFER HOOKS =====

/**
 * Create single fund transfer
 */
export const useCreateFundTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; data: FundTransfer } | FundTransfer,
    Error,
    CreateFundTransfer
  >({
    mutationFn: async (transferData: CreateFundTransfer) => {
      try {
        const response = await AxiosWithToken.post(
          `${BASE_URL}transfer/`,
          transferData
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          (axiosError.response?.data as any)?.error ||
          (axiosError.response?.data as any)?.message ||
          "Failed to create fund transfer"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
};

/**
 * Create batch fund distribution to multiple locations
 */
export const useCreateFundDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: string; data: FundDistributionResult } | FundDistributionResult,
    Error,
    CreateFundDistribution
  >({
    mutationFn: async (distributionData: CreateFundDistribution) => {
      try {
        const response = await AxiosWithToken.post(
          `${BASE_URL}distribute/`,
          distributionData
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          (axiosError.response?.data as any)?.error ||
          (axiosError.response?.data as any)?.message ||
          "Failed to create fund distribution"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
    },
  });
};

/**
 * Get transfer history for an account
 */
export const useGetTransferHistory = (filters: TransferHistoryFilters, enabled: boolean = true) => {
  return useQuery<TransferHistory>({
    queryKey: ["transfer-history", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}history/`, {
          params: filters,
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch transfer history"
        );
      }
    },
    enabled: enabled && !!filters.account_id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get project account structure
 */
export const useGetProjectAccounts = (projectId: string, enabled: boolean = true) => {
  return useQuery<ProjectAccounts>({
    queryKey: ["project-accounts", projectId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}project-accounts/`, {
          params: { project_id: projectId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch project accounts"
        );
      }
    },
    enabled: enabled && !!projectId,
    refetchOnWindowFocus: false,
  });
};

// ===== UTILITY FUNCTIONS =====

/**
 * Format transfer reference
 */
export const formatTransferReference = (reference: string): string => {
  return reference || "N/A";
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

/**
 * Validate transfer amount
 */
export const validateTransferAmount = (
  amount: string,
  fromAccountBalance: string
): { isValid: boolean; error?: string } => {
  const transferAmount = parseFloat(amount);
  const balance = parseFloat(fromAccountBalance);

  if (isNaN(transferAmount) || transferAmount <= 0) {
    return { isValid: false, error: "Amount must be greater than zero" };
  }

  if (transferAmount > balance) {
    return { isValid: false, error: "Insufficient balance" };
  }

  return { isValid: true };
};

/**
 * Calculate total distribution amount
 */
export const calculateTotalDistribution = (distributions: { account_id: string; amount: string }[]): number => {
  return distributions.reduce((sum, dist) => sum + (parseFloat(dist.amount) || 0), 0);
};

/**
 * Validate distribution
 */
export const validateDistribution = (
  distributions: { account_id: string; amount: string }[],
  mainAccountBalance: string
): { isValid: boolean; error?: string } => {
  if (!distributions || distributions.length === 0) {
    return { isValid: false, error: "At least one distribution is required" };
  }

  const total = calculateTotalDistribution(distributions);
  const balance = parseFloat(mainAccountBalance);

  if (total <= 0) {
    return { isValid: false, error: "Total distribution amount must be greater than zero" };
  }

  if (total > balance) {
    return {
      isValid: false,
      error: `Total distribution (${formatCurrencyAmount(total, "NGN")}) exceeds available balance (${formatCurrencyAmount(balance, "NGN")})`
    };
  }

  // Check for duplicate accounts
  const accountIds = distributions.map(d => d.account_id);
  const uniqueAccountIds = new Set(accountIds);
  if (accountIds.length !== uniqueAccountIds.size) {
    return { isValid: false, error: "Cannot distribute to the same account multiple times" };
  }

  // Check for invalid amounts
  const hasInvalidAmount = distributions.some(d => {
    const amount = parseFloat(d.amount);
    return isNaN(amount) || amount <= 0;
  });
  if (hasInvalidAmount) {
    return { isValid: false, error: "All distribution amounts must be greater than zero" };
  }

  return { isValid: true };
};
