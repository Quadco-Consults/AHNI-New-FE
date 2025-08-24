import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  CategoryData, 
  CategoryFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllCategoriesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<CategoryData>>({
    queryKey: ["categories", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/category/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CategoryData,
    Error,
    CategoryFormValues
  >({
    endpoint: "/config/category/",
    queryKey: ["categories"],
    isAuth: true,
    method: "POST",
  });

  const createCategory = async (details: CategoryFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Category creation error:", error);
    }
  };

  return { createCategory, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CategoryData,
    Error,
    CategoryFormValues
  >({
    endpoint: "/config/category/",
    queryKey: ["categories"],
    isAuth: true,
    method: "PATCH",
  });

  const updateCategory = async (id: string, details: CategoryFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/config/category/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Category update error:", error);
      throw error;
    }
  };

  return { updateCategory, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CategoryData,
    Error,
    Record<string, never>
  >({
    endpoint: "/config/category/",
    queryKey: ["categories"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCategory = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/category/${id}`);
      return response.data;
    } catch (error) {
      console.error("Category delete error:", error);
      throw error;
    }
  };

  return { deleteCategory, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllCategories = useGetAllCategoriesManager;
export const useGetAllCategoriesQuery = useGetAllCategoriesManager;

export const useAddCategoryMutation = () => {
  const { createCategory, data, isLoading, isSuccess, error } = CreateCategoryManager();
  return [createCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateCategoryMutation = () => {
  const { updateCategory, data, isLoading, isSuccess, error } = UpdateCategoryManager();
  return [
    (params: { id: string; body: CategoryFormValues }) => updateCategory(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteCategoryMutation = () => {
  const { deleteCategory, data, isLoading, isSuccess, error } = DeleteCategoryManager();
  return [deleteCategory, { data, isLoading, isSuccess, error }] as const;
};

// Default export for backward compatibility
const CategoryAPI = {
  useGetAllCategoriesManager,
  CreateCategoryManager,
  UpdateCategoryManager,
  DeleteCategoryManager,
  useGetAllCategories,
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
};

export default CategoryAPI;