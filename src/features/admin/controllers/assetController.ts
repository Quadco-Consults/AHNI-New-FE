import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TAssetFormValues,
  TAssetPaginatedData,
  TAssetSingleData,
} from "../types/inventory-management/asset";

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
interface AssetFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  category?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/inventory/assets/";

// ===== ASSET HOOKS =====

// Get All Assets (Paginated)
export const useGetAllAssets = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  category = "",
  enabled = true,
}: AssetFilterParams) => {
  return useQuery<PaginatedResponse<TAssetPaginatedData>>({
    queryKey: ["assets", page, size, search, status, category],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(category && { category }),
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

// Get Single Asset
export const useGetSingleAsset = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<TAssetSingleData>>({
    queryKey: ["asset", id],
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

// Create Asset
export const useCreateAsset = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TAssetSingleData,
    Error,
    TAssetFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["assets"],
    isAuth: true,
    method: "POST",
  });

  const createAsset = async (details: TAssetFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset create error:", error);
    }
  };

  return { createAsset, data, isLoading, isSuccess, error };
};

// Edit Asset (Full Update)
export const useEditAsset = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TAssetSingleData,
    Error,
    TAssetFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["assets", "asset"],
    isAuth: true,
    method: "PUT",
  });

  const editAsset = async (details: TAssetFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset edit error:", error);
    }
  };

  return { editAsset, data, isLoading, isSuccess, error };
};

// Delete Asset
export const useDeleteAsset = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TAssetSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["assets"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAsset = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Asset delete error:", error);
    }
  };

  return { deleteAsset, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllAssetsQuery = useGetAllAssets;
export const useGetSingleAssetQuery = useGetSingleAsset;
export const useCreateAssetMutation = useCreateAsset;
export const useEditAssetMutation = useEditAsset;
export const useDeleteAssetMutation = useDeleteAsset;