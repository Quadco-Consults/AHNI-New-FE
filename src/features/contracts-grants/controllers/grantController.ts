import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IGrantPaginatedData,
  IGrantSingleData,
  TGrantFormData,
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

// Filter parameters interface
interface GrantFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/projects/"; // As per original service

// ===== GRANT HOOKS =====

// Get All Grants (Paginated)
export const useGetAllGrants = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: GrantFilterParams) => {
  return useQuery<PaginatedResponse<IGrantPaginatedData>>({
    queryKey: ["grants", page, size, search, status],
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

// Get Single Grant
export const useGetSingleGrant = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IGrantSingleData>>({
    queryKey: ["grant", id],
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

// Create Grant
export const useCreateGrant = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGrantSingleData,
    Error,
    TGrantFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["grants"],
    isAuth: true,
    method: "POST",
  });

  const createGrant = async (details: TGrantFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grant create error:", error);
    }
  };

  return { createGrant, data, isLoading, isSuccess, error };
};

// Create Modification
export const useCreateModification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGrantSingleData,
    Error,
    TGrantFormData
  >({
    endpoint: `${BASE_URL}${id}/modifications/`,
    queryKey: ["grants", "grant"],
    isAuth: true,
    method: "POST",
  });

  const createModification = async (details: TGrantFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grant modification create error:", error);
    }
  };

  return { createModification, data, isLoading, isSuccess, error };
};

// Modify Grant (Partial Update)
export const useModifyGrant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGrantSingleData,
    Error,
    TGrantFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grants", "grant"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyGrant = async (details: TGrantFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grant modify error:", error);
    }
  };

  return { modifyGrant, data, isLoading, isSuccess, error };
};

// Delete Grant
export const useDeleteGrant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGrantSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["grants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteGrant = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Grant delete error:", error);
    }
  };

  return { deleteGrant, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllGrantsQuery = useGetAllGrants;
export const useGetSingleGrantQuery = useGetSingleGrant;
export const useCreateGrantMutation = useCreateGrant;
export const useCreateModificationMutation = useCreateModification;
export const useModifyGrantMutation = useModifyGrant;
export const useDeleteGrantMutation = useDeleteGrant;