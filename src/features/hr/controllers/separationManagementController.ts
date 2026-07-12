import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  SeparationManagement,
  SeparationManagementCreate,
  SeparationManagementUpdate
} from "../types/separation-management";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Paginated Response interface
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next: string | null;
      next_page_number: number | null;
      previous: string | null;
      previous_page_number: number | null;
    };
    results: T[];
  };
}

// Filter parameters interface
interface SeparationManagementFilterParams {
  search?: string;
  status?: string;
  exit_method?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/separation-management/";

// ===== SEPARATION MANAGEMENT HOOKS =====

// Get All Separation Management Records
export const useGetSeparationManagement = ({
  search = "",
  status = "",
  exit_method = "",
  page = 1,
  size = 20,
  enabled = true,
}: SeparationManagementFilterParams = {}) => {
  return useQuery<PaginatedResponse<SeparationManagement>>({
    queryKey: ["separation-management", page, size, search, status, exit_method],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(exit_method && { exit_method }),
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

// Get Separation Management by ID
export const useGetSeparationManagementById = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<SeparationManagement>>({
    queryKey: ["separation-management", id],
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

// Create Separation Management
export const useCreateSeparationManagement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SeparationManagement,
    Error,
    SeparationManagementCreate
  >({
    endpoint: BASE_URL,
    queryKey: ["separation-management"],
    isAuth: true,
    method: "POST",
  });

  const createSeparationManagement = async (details: SeparationManagementCreate) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Separation management create error:", error);
      throw error;
    }
  };

  return { createSeparationManagement, data, isLoading, isSuccess, error };
};

// Update Separation Management
export const useUpdateSeparationManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SeparationManagement,
    Error,
    SeparationManagementUpdate
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["separation-management", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateSeparationManagement = async (details: SeparationManagementUpdate) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Separation management update error:", error);
      throw error;
    }
  };

  return { updateSeparationManagement, data, isLoading, isSuccess, error };
};

// Delete Separation Management
export const useDeleteSeparationManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["separation-management"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSeparationManagement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Separation management delete error:", error);
      throw error;
    }
  };

  return { deleteSeparationManagement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetSeparationManagementQuery = useGetSeparationManagement;
export const useCreateSeparationManagementMutation = useCreateSeparationManagement;
export const useUpdateSeparationManagementMutation = useUpdateSeparationManagement;
export const useDeleteSeparationManagementMutation = useDeleteSeparationManagement;
