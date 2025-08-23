import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  AssetTypeData, 
  AssetTypeFormValues 
} from "../../types/admin";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllAssetTypesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<AssetTypeData>>({
    queryKey: ["assetTypes", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/admins/inventory/asset-types/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateAssetTypeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetTypeData,
    Error,
    AssetTypeFormValues
  >({
    endpoint: "/admins/inventory/asset-types/",
    queryKey: ["assetTypes"],
    isAuth: true,
    method: "POST",
  });

  const createAssetType = async (details: AssetTypeFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset type creation error:", error);
    }
  };

  return { createAssetType, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateAssetTypeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetTypeData,
    Error,
    AssetTypeFormValues
  >({
    endpoint: "/admins/inventory/asset-types/",
    queryKey: ["assetTypes"],
    isAuth: true,
    method: "PATCH",
  });

  const updateAssetType = async (id: string, details: AssetTypeFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/admins/inventory/asset-types/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Asset type update error:", error);
      throw error;
    }
  };

  return { updateAssetType, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteAssetTypeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetTypeData,
    Error,
    Record<string, never>
  >({
    endpoint: "/admins/inventory/asset-types/",
    queryKey: ["assetTypes"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssetType = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/admins/inventory/asset-types/${id}`);
      return response.data;
    } catch (error) {
      console.error("Asset type delete error:", error);
      throw error;
    }
  };

  return { deleteAssetType, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllAssetTypeQuery = useGetAllAssetTypesManager;

export const useAddAssetTypeMutation = () => {
  const { createAssetType, data, isLoading, isSuccess, error } = CreateAssetTypeManager();
  return [createAssetType, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateAssetTypeMutation = () => {
  const { updateAssetType, data, isLoading, isSuccess, error } = UpdateAssetTypeManager();
  return [
    (params: { id: string; body: AssetTypeFormValues }) => updateAssetType(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteAssetTypeMutation = () => {
  const { deleteAssetType, data, isLoading, isSuccess, error } = DeleteAssetTypeManager();
  return [deleteAssetType, { data, isLoading, isSuccess, error }] as const;
};

// Additional missing exports
export const useGetAllAssetTypes = useGetAllAssetTypesManager;