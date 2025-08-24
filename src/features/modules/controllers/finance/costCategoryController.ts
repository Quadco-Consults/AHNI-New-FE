import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  CostCategoryData, 
  CostCategoryFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllCostCategoriesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<CostCategoryData>>({
    queryKey: ["cost-categories", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/cost-categories/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Cost Category
export const useGetSingleCostCategoryManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<CostCategoryData>>({
    queryKey: ["cost-category", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/finance/cost-categories/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateCostCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostCategoryData,
    Error,
    CostCategoryFormValues
  >({
    endpoint: "/finance/cost-categories/",
    queryKey: ["cost-categories"],
    isAuth: true,
    method: "POST",
  });

  const createCostCategory = async (details: CostCategoryFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Cost category creation error:", error);
    }
  };

  return { createCostCategory, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateCostCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostCategoryData,
    Error,
    CostCategoryFormValues
  >({
    endpoint: "/finance/cost-categories/",
    queryKey: ["cost-categories", "cost-category"],
    isAuth: true,
    method: "PUT",
  });

  const updateCostCategory = async (id: string, details: CostCategoryFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/cost-categories/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Cost category update error:", error);
      throw error;
    }
  };

  return { updateCostCategory, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteCostCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostCategoryData,
    Error,
    Record<string, never>
  >({
    endpoint: "/finance/cost-categories/",
    queryKey: ["cost-categories"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCostCategory = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/cost-categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Cost category delete error:", error);
      throw error;
    }
  };

  return { deleteCostCategory, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllCostCategories = useGetAllCostCategoriesManager;
export const useGetAllCostCategoriesQuery = useGetAllCostCategoriesManager;
export const useGetSingleCostCategoryQuery = useGetSingleCostCategoryManager;

export const useAddCostCategoryMutation = () => {
  const { createCostCategory, data, isLoading, isSuccess, error } = CreateCostCategoryManager();
  return [createCostCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateCostCategoryMutation = () => {
  const { updateCostCategory, data, isLoading, isSuccess, error } = UpdateCostCategoryManager();
  return [
    (params: { id: number; body: CostCategoryFormValues }) => updateCostCategory(params.id.toString(), params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteCostCategoryMutation = () => {
  const { deleteCostCategory, data, isLoading, isSuccess, error } = DeleteCostCategoryManager();
  return [deleteCostCategory, { data, isLoading, isSuccess, error }] as const;
};

// Missing named export
export const useGetSingleCostCategory = useGetSingleCostCategoryManager;