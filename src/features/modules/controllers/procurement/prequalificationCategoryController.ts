import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  PrequalificationCategoryData, 
  PrequalificationCategoryFormValues 
} from "../../types/procurement";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllPrequalificationCategoriesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<PrequalificationCategoryData>>({
    queryKey: ["prequalificationCategories", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/prequalification_category/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreatePrequalificationCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCategoryData,
    Error,
    PrequalificationCategoryFormValues
  >({
    endpoint: "/procurements/prequalification_category/",
    queryKey: ["prequalificationCategories"],
    isAuth: true,
    method: "POST",
  });

  const createPrequalificationCategory = async (details: PrequalificationCategoryFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification category creation error:", error);
    }
  };

  return { createPrequalificationCategory, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdatePrequalificationCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCategoryData,
    Error,
    PrequalificationCategoryFormValues
  >({
    endpoint: "/procurements/prequalification_category/",
    queryKey: ["prequalificationCategories"],
    isAuth: true,
    method: "PATCH",
  });

  const updatePrequalificationCategory = async (id: string, details: PrequalificationCategoryFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/procurements/prequalification_category/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Prequalification category update error:", error);
      throw error;
    }
  };

  return { updatePrequalificationCategory, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeletePrequalificationCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCategoryData,
    Error,
    Record<string, never>
  >({
    endpoint: "/procurements/prequalification_category/",
    queryKey: ["prequalificationCategories"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePrequalificationCategory = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/procurements/prequalification_category/${id}`);
      return response.data;
    } catch (error) {
      console.error("Prequalification category delete error:", error);
      throw error;
    }
  };

  return { deletePrequalificationCategory, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllPrequalificationCategoryQuery = useGetAllPrequalificationCategoriesManager;
export const useGetAllPrequalificationCategory = useGetAllPrequalificationCategoriesManager;

export const useAddPrequalificationCategoryMutation = () => {
  const { createPrequalificationCategory, data, isLoading, isSuccess, error } = CreatePrequalificationCategoryManager();
  return [createPrequalificationCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdatePrequalificationCategoryMutation = () => {
  const { updatePrequalificationCategory, data, isLoading, isSuccess, error } = UpdatePrequalificationCategoryManager();
  return [
    (params: { id: string; body: PrequalificationCategoryFormValues }) => updatePrequalificationCategory(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeletePrequalificationCategoryMutation = () => {
  const { deletePrequalificationCategory, data, isLoading, isSuccess, error } = DeletePrequalificationCategoryManager();
  return [deletePrequalificationCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useDeletePrequalificationCategory = DeletePrequalificationCategoryManager;

// Missing named exports - RTK Query style
export const useAddPrequalificationCategory = useAddPrequalificationCategoryMutation;
export const useUpdatePrequalificationCategory = useUpdatePrequalificationCategoryMutation;