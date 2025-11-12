import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IDisbursementPaginatedData,
  TDisbursementFormData,
} from "../types/grants";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// Filter parameters interface (with grantId requirement for nested route)
interface DisbursementFilterParams {
  grantId: string;
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

// ===== DISBURSEMENT HOOKS =====

// Get All Disbursements (Paginated) - for a specific grant (includes all projects)
export const useGetAllDisbursements = ({
  grantId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: DisbursementFilterParams) => {
  return useQuery<PaginatedResponse<IDisbursementPaginatedData>>({
    queryKey: ["disbursements", grantId, page, size, search],
    queryFn: async () => {
      try {
        const endpoint = `/projects/${grantId}/disbursements/`;
        const params = {
          page,
          size,
          ...(search && { search }),
        };

        // Debug only if needed
        // console.log("🔍 Disbursement API Debug:", endpoint);

        const response = await AxiosWithToken.get(endpoint, { params });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;

        console.error("❌ Disbursement API Error:", axiosError.response?.status, axiosError.config?.url);

        // Enhanced error handling for disbursement-specific issues
        if (errorData?.message?.includes("decimal.InvalidOperation")) {
          throw new Error("Backend decimal error: Invalid financial calculations. Check for null/empty values in disbursement amounts.");
        }

        if (errorData?.message?.includes("unsupported operand type")) {
          throw new Error("Backend calculation error: Data type mismatch in financial calculations. Please contact support.");
        }

        if (axiosError.response?.status === 404) {
          throw new Error(`API Endpoint Not Found (404): ${axiosError.config?.url} - Check if disbursement endpoints are properly configured`);
        }

        throw new Error("API Error: " + (errorData?.message || axiosError.message || "Unknown error"));
      }
    },
    enabled: enabled && !!grantId,
    refetchOnWindowFocus: false,
  });
};

// Get Single Disbursement
export const useGetSingleDisbursement = (
  grantId: string,
  disbursementId: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IDisbursementPaginatedData>>({
    queryKey: ["disbursement", grantId, disbursementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/projects/${grantId}/disbursements/${disbursementId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!grantId && !!disbursementId,
    refetchOnWindowFocus: false,
  });
};

// Create Disbursement for a specific grant
export const useCreateDisbursement = (grantId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDisbursementPaginatedData,
    Error,
    TDisbursementFormData
  >({
    endpoint: `/projects/${grantId}/disbursements/`,
    queryKey: ["disbursements", grantId],
    isAuth: true,
    method: "POST",
  });

  const createDisbursement = async (details: TDisbursementFormData) => {
    try {
      console.log("Creating disbursement for project:", details.project, details);
      const res = await callApi(details);
      return res;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;

      if (errorData?.message?.includes("decimal.InvalidOperation")) {
        throw new Error("Invalid amount format. Please enter a valid number.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          errorData?.message || "Validation error occurred"
        );
      }

      console.error("Disbursement create error:", error);
      throw error;
    }
  };

  return { createDisbursement, data, isLoading, isSuccess, error };
};

// Update Disbursement
export const useUpdateDisbursement = (grantId: string, disbursementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDisbursementPaginatedData,
    Error,
    TDisbursementFormData
  >({
    endpoint: `/projects/${grantId}/disbursements/${disbursementId}/`,
    queryKey: ["disbursements", grantId],
    isAuth: true,
    method: "PUT",
  });

  const updateDisbursement = async (details: TDisbursementFormData) => {
    try {
      console.log("Updating disbursement:", disbursementId, details);
      await callApi(details);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;

      if (errorData?.message?.includes("decimal.InvalidOperation")) {
        throw new Error("Invalid amount format. Please enter a valid number.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          errorData?.message || "Validation error occurred"
        );
      }

      console.error("Disbursement update error:", error);
      throw error;
    }
  };

  return { updateDisbursement, data, isLoading, isSuccess, error };
};

// Delete Disbursement
export const useDeleteDisbursement = (grantId: string, disbursementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Record<string, never>
  >({
    endpoint: `/projects/${grantId}/disbursements/${disbursementId}/`,
    queryKey: ["disbursements", grantId],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDisbursement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Disbursement delete error:", error);
      throw error;
    }
  };

  return { deleteDisbursement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllDisbursementsQuery = useGetAllDisbursements;
export const useGetSingleDisbursementQuery = useGetSingleDisbursement;
export const useCreateDisbursementMutation = useCreateDisbursement;
export const useUpdateDisbursementMutation = useUpdateDisbursement;
export const useDeleteDisbursementMutation = useDeleteDisbursement;