import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  AssetClassificationData, 
  AssetClassificationFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllAssetClassificationsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<AssetClassificationData>>({
    queryKey: ["asset-classifications", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/admins/inventory/asset-classifications/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateAssetClassificationManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetClassificationData,
    Error,
    AssetClassificationFormValues
  >({
    endpoint: "/admins/inventory/asset-classifications/",
    queryKey: ["asset-classifications"],
    isAuth: true,
    method: "POST",
  });

  const createAssetClassification = async (details: AssetClassificationFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset classification creation error:", error);
    }
  };

  return { createAssetClassification, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateAssetClassificationManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetClassificationData,
    Error,
    AssetClassificationFormValues
  >({
    endpoint: "/admins/inventory/asset-classifications/",
    queryKey: ["asset-classifications"],
    isAuth: true,
    method: "PUT",
  });

  const updateAssetClassification = async (id: string, details: AssetClassificationFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/admins/inventory/asset-classifications/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Asset classification update error:", error);
      throw error;
    }
  };

  return { updateAssetClassification, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteAssetClassificationManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetClassificationData,
    Error,
    Record<string, never>
  >({
    endpoint: "/admins/inventory/asset-classifications/",
    queryKey: ["asset-classifications"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssetClassification = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/admins/inventory/asset-classifications/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Asset classification delete error:", error);
      throw error;
    }
  };

  return { deleteAssetClassification, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllAssetClassificationsQuery = useGetAllAssetClassificationsManager;

export const useCreateAssetClassificationMutation = () => {
  const { createAssetClassification, data, isLoading, isSuccess, error } = CreateAssetClassificationManager();
  return [createAssetClassification, { data, isLoading, isSuccess, error }] as const;
};

export const useEditAssetClassificationMutation = () => {
  const { updateAssetClassification, data, isLoading, isSuccess, error } = UpdateAssetClassificationManager();
  return [
    (params: { id: string; body: AssetClassificationFormValues }) => updateAssetClassification(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteAssetClassificationMutation = () => {
  const { deleteAssetClassification, data, isLoading, isSuccess, error } = DeleteAssetClassificationManager();
  return [deleteAssetClassification, { data, isLoading, isSuccess, error }] as const;
};

// Additional missing exports
export const useGetAllAssetClassifications = useGetAllAssetClassificationsManager;
export const useCreateAssetClassification = CreateAssetClassificationManager;
export const useEditAssetClassification = UpdateAssetClassificationManager;