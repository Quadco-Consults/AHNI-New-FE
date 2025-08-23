import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  AssetConditionData, 
  AssetConditionFormValues 
} from "../../types/admin";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllAssetConditionsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<AssetConditionData>>({
    queryKey: ["assetConditions", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/admins/inventory/asset-conditions/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateAssetConditionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetConditionData,
    Error,
    AssetConditionFormValues
  >({
    endpoint: "/admins/inventory/asset-conditions/",
    queryKey: ["assetConditions"],
    isAuth: true,
    method: "POST",
  });

  const createAssetCondition = async (details: AssetConditionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset condition creation error:", error);
    }
  };

  return { createAssetCondition, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateAssetConditionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetConditionData,
    Error,
    AssetConditionFormValues
  >({
    endpoint: "/admins/inventory/asset-conditions/",
    queryKey: ["assetConditions"],
    isAuth: true,
    method: "PATCH",
  });

  const updateAssetCondition = async (id: string, details: AssetConditionFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/admins/inventory/asset-conditions/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Asset condition update error:", error);
      throw error;
    }
  };

  return { updateAssetCondition, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteAssetConditionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    AssetConditionData,
    Error,
    Record<string, never>
  >({
    endpoint: "/admins/inventory/asset-conditions/",
    queryKey: ["assetConditions"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssetCondition = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/admins/inventory/asset-conditions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Asset condition delete error:", error);
      throw error;
    }
  };

  return { deleteAssetCondition, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllAssetConditionQuery = useGetAllAssetConditionsManager;

export const useAddAssetConditionMutation = () => {
  const { createAssetCondition, data, isLoading, isSuccess, error } = CreateAssetConditionManager();
  return [createAssetCondition, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateAssetConditionMutation = () => {
  const { updateAssetCondition, data, isLoading, isSuccess, error } = UpdateAssetConditionManager();
  return [
    (params: { id: string; body: AssetConditionFormValues }) => updateAssetCondition(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteAssetConditionMutation = () => {
  const { deleteAssetCondition, data, isLoading, isSuccess, error } = DeleteAssetConditionManager();
  return [deleteAssetCondition, { data, isLoading, isSuccess, error }] as const;
};

// Additional missing exports
export const useGetAllAssetConditions = useGetAllAssetConditionsManager;