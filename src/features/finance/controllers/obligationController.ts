import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  Obligation,
  CreateObligationRequest,
  UpdateObligationRequest,
  ApproveObligationRequest,
  LiquidateObligationRequest,
  CancelObligationRequest,
  ObligationFilters,
  ObligationSummary,
  ObligationMetadata,
  ObligationApiResponse,
  ExportOptions
} from "../types/obligation.types";

const BASE_URL = "/finance/obligations/";

// ===== OBLIGATION CRUD OPERATIONS =====

/**
 * Get all obligations with filtering
 */
export const useGetObligations = (filters?: ObligationFilters & { page?: number; size?: number }) => {
  return useQuery<ObligationApiResponse<Obligation[]>>({
    queryKey: ["obligations", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page: filters?.page || 1,
            size: filters?.size || 20,
            ...filters
          }
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single obligation
 */
export const useGetObligation = (id: string, enabled: boolean = true) => {
  return useQuery<ObligationApiResponse<Obligation>>({
    queryKey: ["obligation", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create obligation
 */
export const useCreateObligation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ObligationApiResponse<Obligation>,
    Error,
    CreateObligationRequest
  >({
    endpoint: BASE_URL,
    queryKey: ["obligations"],
    isAuth: true,
    method: "POST",
  });

  const createObligation = async (obligationData: CreateObligationRequest) => {
    try {
      console.log("Creating obligation:", obligationData);

      // Prepare form data if attachments are included
      const formData = new FormData();

      // Add all obligation fields
      Object.entries(obligationData).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value)) {
          // Handle file attachments
          value.forEach((file: File) => {
            formData.append('attachments', file);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await callApi(obligationData);
      console.log("Obligation created:", result);
      return result;
    } catch (error) {
      console.error("Obligation creation error:", error);
      throw error;
    }
  };

  return { createObligation, data, isLoading, isSuccess, error };
};

/**
 * Update obligation
 */
export const useUpdateObligation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ObligationApiResponse<Obligation>,
    Error,
    UpdateObligationRequest
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["obligations", "obligation"],
    isAuth: true,
    method: "PATCH",
  });

  const updateObligation = async (obligationData: UpdateObligationRequest) => {
    try {
      console.log("Updating obligation:", id, obligationData);
      const result = await callApi(obligationData);
      console.log("Obligation updated:", result);
      return result;
    } catch (error) {
      console.error("Obligation update error:", error);
      throw error;
    }
  };

  return { updateObligation, data, isLoading, isSuccess, error };
};

/**
 * Delete obligation
 */
export const useDeleteObligation = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ObligationApiResponse<null>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["obligations"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteObligation = async () => {
    try {
      console.log("Deleting obligation:", id);
      const result = await callApi();
      console.log("Obligation deleted");
      return result;
    } catch (error) {
      console.error("Obligation deletion error:", error);
      throw error;
    }
  };

  return { deleteObligation, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW OPERATIONS =====

/**
 * Submit obligation for approval
 */
export const useSubmitObligation = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ObligationApiResponse<Obligation>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["obligations", "obligation"],
    isAuth: true,
    method: "POST",
  });

  const submitForApproval = async () => {
    try {
      console.log("Submitting obligation for approval:", id);
      const result = await callApi();
      console.log("Obligation submitted for approval");
      return result;
    } catch (error) {
      console.error("Obligation submission error:", error);
      throw error;
    }
  };

  return { submitForApproval, isLoading, isSuccess, error };
};

/**
 * Approve/Reject obligation
 */
export const useApproveObligation = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ObligationApiResponse<Obligation>,
    Error,
    ApproveObligationRequest
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["obligations", "obligation"],
    isAuth: true,
    method: "POST",
  });

  const processApproval = async (approvalData: ApproveObligationRequest) => {
    try {
      console.log("Processing approval for obligation:", id, approvalData);
      const result = await callApi(approvalData);
      console.log("Obligation approval processed:", result);
      return result;
    } catch (error) {
      console.error("Obligation approval error:", error);
      throw error;
    }
  };

  return { processApproval, isLoading, isSuccess, error };
};

// ===== LIQUIDATION OPERATIONS =====

/**
 * Liquidate obligation (record payment against it)
 */
export const useLiquidateObligation = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ObligationApiResponse<Obligation>,
    Error,
    LiquidateObligationRequest
  >({
    endpoint: `${BASE_URL}${id}/liquidate/`,
    queryKey: ["obligations", "obligation"],
    isAuth: true,
    method: "POST",
  });

  const liquidate = async (liquidationData: LiquidateObligationRequest) => {
    try {
      console.log("Liquidating obligation:", id, liquidationData);
      const result = await callApi(liquidationData);
      console.log("Obligation liquidated:", result);
      return result;
    } catch (error) {
      console.error("Obligation liquidation error:", error);
      throw error;
    }
  };

  return { liquidate, isLoading, isSuccess, error };
};

/**
 * Cancel obligation
 */
export const useCancelObligation = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    ObligationApiResponse<Obligation>,
    Error,
    CancelObligationRequest
  >({
    endpoint: `${BASE_URL}${id}/cancel/`,
    queryKey: ["obligations", "obligation"],
    isAuth: true,
    method: "POST",
  });

  const cancelObligation = async (cancelData: CancelObligationRequest) => {
    try {
      console.log("Cancelling obligation:", id, cancelData);
      const result = await callApi(cancelData);
      console.log("Obligation cancelled");
      return result;
    } catch (error) {
      console.error("Obligation cancellation error:", error);
      throw error;
    }
  };

  return { cancelObligation, isLoading, isSuccess, error };
};

// ===== MY PENDING APPROVALS =====

/**
 * Get obligations pending my approval
 */
export const useGetMyPendingObligationApprovals = (enabled: boolean = true) => {
  return useQuery<ObligationApiResponse<Obligation[]>>({
    queryKey: ["my-pending-obligation-approvals"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my-pending-approvals/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: true,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// ===== REPORTING AND ANALYTICS =====

/**
 * Get summary statistics
 */
export const useGetObligationSummary = (filters?: ObligationFilters) => {
  return useQuery<ObligationApiResponse<ObligationSummary>>({
    queryKey: ["obligation-summary", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}summary/`, {
          params: filters
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== EXPORT AND DOWNLOAD =====

/**
 * Export obligations to Excel/PDF
 */
export const useExportObligations = () => {
  const exportObligations = async (options: ExportOptions) => {
    try {
      console.log("Exporting obligations:", options);
      const response = await AxiosWithToken.post(`${BASE_URL}export/`, options, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `obligations-${timestamp}.${options.format}`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("Export completed successfully");
      return true;
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  };

  return { exportObligations };
};

// ===== METADATA =====

/**
 * Get metadata for obligations (projects, budget line items, etc.)
 */
export const useGetObligationMetadata = () => {
  return useQuery<ObligationApiResponse<ObligationMetadata>>({
    queryKey: ["obligation-metadata"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}metadata/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });
};

// ===== HELPER FUNCTIONS =====

/**
 * Get status badge color
 */
export const getObligationStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" | "secondary" => {
  switch (status) {
    case "draft":
      return "default";
    case "pending_approval":
      return "warning";
    case "approved":
    case "active":
      return "success";
    case "partially_liquidated":
      return "secondary";
    case "fully_liquidated":
      return "success";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

/**
 * Format obligation type label
 */
export const formatObligationType = (type: string): string => {
  const types: Record<string, string> = {
    purchase_order: "Purchase Order",
    contract: "Contract",
    service_agreement: "Service Agreement",
    grant_commitment: "Grant Commitment",
    other: "Other",
  };
  return types[type] || type;
};

/**
 * Format currency amount
 */
export const formatCurrencyAmount = (
  amount: number | string,
  currency: string = "NGN"
): string => {
  const currencySymbol = currency === "NGN" ? "₦" : "$";

  // Convert to number and handle null/undefined amounts
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (numAmount === null || numAmount === undefined || isNaN(numAmount)) {
    return `${currencySymbol}0.00`;
  }

  return `${currencySymbol}${numAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Calculate liquidation percentage
 */
export const calculateLiquidationPercentage = (
  liquidated: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((liquidated / total) * 100);
};

/**
 * Get approval status badge color
 */
export const getApprovalStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "not_submitted":
      return "default";
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
};
