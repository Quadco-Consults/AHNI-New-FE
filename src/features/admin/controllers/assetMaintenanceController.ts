import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TAssetMaintenanceFormData,
  IAssetMaintenancePaginatedData,
  IAssetMaintenanceSingleData,
} from "../types/asset-maintenance";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/admins/assets/maintenance/";

// ===== ASSET MAINTENANCE HOOKS =====

// Get All Asset Maintenance
export const useGetAllAssetMaintenance = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IAssetMaintenancePaginatedData>>({
    queryKey: ["asset-maintenance", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Single Asset Maintenance
export const useGetSingleAssetMaintenance = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IAssetMaintenanceSingleData>>({
    queryKey: ["asset-maintenance", id],
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

// Create Asset Maintenance
export const useCreateAssetMaintenance = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IAssetMaintenanceSingleData>,
    Error,
    TAssetMaintenanceFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["asset-maintenance"],
    isAuth: true,
    method: "POST",
  });

  const createAssetMaintenance = async (details: TAssetMaintenanceFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset maintenance create error:", error);
    }
  };

  return { createAssetMaintenance, data, isLoading, isSuccess, error };
};

// Update Asset Maintenance
export const useModifyAssetMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IAssetMaintenanceSingleData>,
    Error,
    TAssetMaintenanceFormData
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["asset-maintenance"],
    isAuth: true,
    method: "PUT",
  });

  const modifyAssetMaintenance = async (details: TAssetMaintenanceFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset maintenance update error:", error);
    }
  };

  return { modifyAssetMaintenance, data, isLoading, isSuccess, error };
};

// Delete Asset Maintenance
export const useDeleteAssetMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IAssetMaintenanceSingleData>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["asset-maintenance"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssetMaintenance = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Asset maintenance delete error:", error);
    }
  };

  return { deleteAssetMaintenance, data, isLoading, isSuccess, error };
};

// ===== ASSET MAINTENANCE APPROVAL HOOKS =====

// Review Asset Maintenance
export const useReviewAssetMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IAssetMaintenanceSingleData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["asset-maintenance", "assetMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const reviewAssetMaintenance = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset maintenance review error:", error);
    }
  };

  return { reviewAssetMaintenance, data, isLoading, isSuccess, error };
};

// Authorize Asset Maintenance
export const useAuthorizeAssetMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IAssetMaintenanceSingleData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["asset-maintenance", "assetMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const authorizeAssetMaintenance = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset maintenance authorize error:", error);
    }
  };

  return { authorizeAssetMaintenance, data, isLoading, isSuccess, error };
};

// Approve Asset Maintenance
export const useApproveAssetMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IAssetMaintenanceSingleData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["asset-maintenance", "assetMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const approveAssetMaintenance = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset maintenance approve error:", error);
    }
  };

  return { approveAssetMaintenance, data, isLoading, isSuccess, error };
};

// Maintain legacy exports for backward compatibility
export const useGetAllAssetMaintenanceQuery = useGetAllAssetMaintenance;
export const useGetSingleAssetMaintenanceQuery = useGetSingleAssetMaintenance;
export const useCreateAssetMaintenanceMutation = useCreateAssetMaintenance;
export const useModifyAssetMaintenanceMutation = useModifyAssetMaintenance;
export const useDeleteAssetMaintenanceMutation = useDeleteAssetMaintenance;