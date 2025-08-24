import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  RiskCategoryData, 
  RiskCategoryFormValues 
} from "../../types/program";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllRiskCategoriesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<RiskCategoryData>>({
    queryKey: ["riskCategories", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/programs/risk-category/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateRiskCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RiskCategoryData,
    Error,
    RiskCategoryFormValues
  >({
    endpoint: "/programs/risk-category/",
    queryKey: ["riskCategories"],
    isAuth: true,
    method: "POST",
  });

  const createRiskCategory = async (details: RiskCategoryFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Risk category creation error:", error);
    }
  };

  return { createRiskCategory, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateRiskCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RiskCategoryData,
    Error,
    RiskCategoryFormValues
  >({
    endpoint: "/programs/risk-category/",
    queryKey: ["riskCategories"],
    isAuth: true,
    method: "PATCH",
  });

  const updateRiskCategory = async (id: string, details: RiskCategoryFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/programs/risk-category/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Risk category update error:", error);
      throw error;
    }
  };

  return { updateRiskCategory, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteRiskCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    RiskCategoryData,
    Error,
    Record<string, never>
  >({
    endpoint: "/programs/risk-category/",
    queryKey: ["riskCategories"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteRiskCategory = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/programs/risk-category/${id}`);
      return response.data;
    } catch (error) {
      console.error("Risk category delete error:", error);
      throw error;
    }
  };

  return { deleteRiskCategory, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllRiskCategoryQuery = useGetAllRiskCategoriesManager;
export const useGetAllRiskCategory = useGetAllRiskCategoriesManager;

export const useAddRiskCategoryMutation = () => {
  const { createRiskCategory, data, isLoading, isSuccess, error } = CreateRiskCategoryManager();
  return [createRiskCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateRiskCategoryMutation = () => {
  const { updateRiskCategory, data, isLoading, isSuccess, error } = UpdateRiskCategoryManager();
  return [
    (params: { id: string; body: RiskCategoryFormValues }) => updateRiskCategory(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteRiskCategoryMutation = () => {
  const { deleteRiskCategory, data, isLoading, isSuccess, error } = DeleteRiskCategoryManager();
  return [deleteRiskCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteRiskCategory = () => {
  const { deleteRiskCategory, data, isLoading, isSuccess, error } = DeleteRiskCategoryManager();
  return [deleteRiskCategory, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports
export const useAddRiskCategory = CreateRiskCategoryManager;
export const useUpdateRiskCategory = UpdateRiskCategoryManager;
export const useGetAllRiskCategoryController = useGetAllRiskCategoriesManager;