import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ICloseOutPlanPaginatedData,
  ICloseOutPlanSingleData,
  TCloseOutPlanFormData,
} from "../types/closeout-plan";

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
interface CloseoutPlanFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/closeout/plans/"; // From original service

// ===== CLOSEOUT PLAN HOOKS =====

// Get All Closeout Plans (Paginated)
export const useGetAllCloseoutPlans = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: CloseoutPlanFilterParams) => {
  return useQuery<PaginatedResponse<ICloseOutPlanPaginatedData>>({
    queryKey: ["closeoutPlans", page, size, search, status],
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

// Get Single Closeout Plan
export const useGetSingleCloseoutPlan = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ICloseOutPlanSingleData>>({
    queryKey: ["closeoutPlan", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Closeout Plan
export const useCreateCloseoutPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ICloseOutPlanSingleData,
    Error,
    TCloseOutPlanFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["closeoutPlans"],
    isAuth: true,
    method: "POST",
  });

  const createCloseoutPlan = async (details: TCloseOutPlanFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Closeout plan create error:", error);
    }
  };

  return { createCloseoutPlan, data, isLoading, isSuccess, error };
};

// Update Closeout Plan
export const useUpdateCloseoutPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ICloseOutPlanSingleData,
    Error,
    TCloseOutPlanFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["closeoutPlans", "closeoutPlan"],
    isAuth: true,
    method: "PUT",
  });

  const updateCloseoutPlan = async (details: TCloseOutPlanFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Closeout plan update error:", error);
    }
  };

  return { updateCloseoutPlan, data, isLoading, isSuccess, error };
};

// Delete Closeout Plan
export const useDeleteCloseoutPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ICloseOutPlanSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["closeoutPlans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCloseoutPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Closeout plan delete error:", error);
    }
  };

  return { deleteCloseoutPlan, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllCloseOutPlansQuery = useGetAllCloseoutPlans;
export const useGetSingleCloseOutPlanQuery = useGetSingleCloseoutPlan;
export const useCreateCloseOutPlanMutation = useCreateCloseoutPlan;
export const useModifyCloseOutPlanMutation = useUpdateCloseoutPlan;
export const useDeleteCloseOutPlanMutation = useDeleteCloseoutPlan;

// Missing named export
export const useGetSingleCloseOutPlan = useGetSingleCloseoutPlan;