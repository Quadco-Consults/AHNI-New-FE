import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IFacilitatorPaginatedData,
  IFacilitatorSingleData,
  TFacilitatorManagementDetailsFormData,
  TFacilitatorScopeOfWorkFormData,
} from "../types/contract-management/facilitator-management";

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

// Filter parameters interface
interface FacilitatorManagementFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

// Combined form data interface for creation/updates
interface TFacilitatorCreateUpdateFormData extends TFacilitatorManagementDetailsFormData, TFacilitatorScopeOfWorkFormData {}

const BASE_URL = "/contract-grants/facilitators/"; // From original service

// ===== FACILITATOR MANAGEMENT HOOKS =====

// Get All Facilitators (Paginated)
export const useGetAllFacilitators = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: FacilitatorManagementFilterParams) => {
  return useQuery<PaginatedResponse<IFacilitatorPaginatedData>>({
    queryKey: ["facilitators", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Facilitator
export const useGetSingleFacilitator = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IFacilitatorSingleData>>({
    queryKey: ["facilitator", id],
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

// Create Facilitator
export const useCreateFacilitator = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilitatorSingleData,
    Error,
    TFacilitatorCreateUpdateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["facilitators"],
    isAuth: true,
    method: "POST",
  });

  const createFacilitator = async (details: TFacilitatorCreateUpdateFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facilitator create error:", error);
    }
  };

  return { createFacilitator, data, isLoading, isSuccess, error };
};

// Update Facilitator
export const useUpdateFacilitator = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilitatorSingleData,
    Error,
    TFacilitatorCreateUpdateFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["facilitators", "facilitator"],
    isAuth: true,
    method: "PUT",
  });

  const updateFacilitator = async (details: TFacilitatorCreateUpdateFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facilitator update error:", error);
    }
  };

  return { updateFacilitator, data, isLoading, isSuccess, error };
};

// Delete Facilitator
export const useDeleteFacilitator = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilitatorSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["facilitators"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFacilitator = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Facilitator delete error:", error);
    }
  };

  return { deleteFacilitator, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllFacilitatorsQuery = useGetAllFacilitators;
export const useGetSingleFacilitatorQuery = useGetSingleFacilitator;
export const useCreateFacilitatorMutation = useCreateFacilitator;
export const useModifyFacilitatorMutation = useUpdateFacilitator;
export const useDeleteFacilitatorMutation = useDeleteFacilitator;