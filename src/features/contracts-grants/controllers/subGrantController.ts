import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ISubGrantPaginatedData,
  ISubGrantSingleData,
  TSubGrantFormData,
} from "../types/contract-management/sub-grant/sub-grant";

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
interface SubGrantFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/sub-grants/"; // From original service

// ===== SUB GRANT HOOKS =====

// Get All Sub Grants (Paginated)
export const useGetAllSubGrants = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: SubGrantFilterParams) => {
  return useQuery<PaginatedResponse<ISubGrantPaginatedData>>({
    queryKey: ["subGrants", page, size, search, status],
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

// Get Single Sub Grant
export const useGetSingleSubGrant = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ISubGrantSingleData>>({
    queryKey: ["subGrant", id],
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

// Create Sub Grant
export const useCreateSubGrant = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantSingleData,
    Error,
    TSubGrantFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["subGrants"],
    isAuth: true,
    method: "POST",
  });

  const createSubGrant = async (details: TSubGrantFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub grant create error:", error);
    }
  };

  return { createSubGrant, data, isLoading, isSuccess, error };
};

// Update Sub Grant
export const useUpdateSubGrant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantSingleData,
    Error,
    TSubGrantFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["subGrants", "subGrant"],
    isAuth: true,
    method: "PUT",
  });

  const updateSubGrant = async (details: TSubGrantFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub grant update error:", error);
    }
  };

  return { updateSubGrant, data, isLoading, isSuccess, error };
};

// Delete Sub Grant
export const useDeleteSubGrant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["subGrants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSubGrant = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Sub grant delete error:", error);
    }
  };

  return { deleteSubGrant, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllSubGrantsQuery = useGetAllSubGrants;
export const useGetSingleSubGrantQuery = useGetSingleSubGrant;
export const useCreateSubGrantMutation = useCreateSubGrant;
export const useModifySubGrantMutation = useUpdateSubGrant;
export const useDeleteSubGrantMutation = useDeleteSubGrant;

// Missing named export
export const useModifySubGrant = useUpdateSubGrant;