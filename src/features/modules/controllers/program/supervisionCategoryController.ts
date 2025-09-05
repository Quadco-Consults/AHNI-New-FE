import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  SupervisionCategoryData, 
  SupervisionCategoryFormValues 
} from "../../types/program";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllSupervisionCategoriesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<SupervisionCategoryData>>({
    queryKey: ["supervisionCategories", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/programs/supervision-evaluation-category/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateSupervisionCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupervisionCategoryData,
    Error,
    SupervisionCategoryFormValues
  >({
    endpoint: "/programs/supervision-evaluation-category/",
    queryKey: ["supervisionCategories"],
    isAuth: true,
    method: "POST",
  });

  const createSupervisionCategory = async (details: SupervisionCategoryFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supervision category creation error:", error);
    }
  };

  return { createSupervisionCategory, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateSupervisionCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupervisionCategoryData,
    Error,
    SupervisionCategoryFormValues
  >({
    endpoint: "/programs/supervision-evaluation-category/",
    queryKey: ["supervisionCategories"],
    isAuth: true,
    method: "PATCH",
  });

  const updateSupervisionCategory = async (id: string, details: SupervisionCategoryFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/programs/supervision-evaluation-category/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Supervision category update error:", error);
      throw error;
    }
  };

  return { updateSupervisionCategory, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteSupervisionCategoryManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupervisionCategoryData,
    Error,
    Record<string, never>
  >({
    endpoint: "/programs/supervision-evaluation-category/",
    queryKey: ["supervisionCategories"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSupervisionCategory = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/programs/supervision-evaluation-category/${id}`);
      return response.data;
    } catch (error) {
      console.error("Supervision category delete error:", error);
      throw error;
    }
  };

  return { deleteSupervisionCategory, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllSupervisionCategoryQuery = useGetAllSupervisionCategoriesManager;
export const useGetAllSupervisionCategory = useGetAllSupervisionCategoriesManager;

export const useAddSupervisionCategoryMutation = () => {
  const { createSupervisionCategory, data, isLoading, isSuccess, error } = CreateSupervisionCategoryManager();
  return [createSupervisionCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateSupervisionCategoryMutation = () => {
  const { updateSupervisionCategory, data, isLoading, isSuccess, error } = UpdateSupervisionCategoryManager();
  return [
    (params: { id: string; body: SupervisionCategoryFormValues }) => updateSupervisionCategory(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteSupervisionCategoryMutation = () => {
  const { deleteSupervisionCategory, data, isLoading, isSuccess, error } = DeleteSupervisionCategoryManager();
  return [deleteSupervisionCategory, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteSupervisionCategory = () => {
  const { deleteSupervisionCategory, data, isLoading, isSuccess, error } = DeleteSupervisionCategoryManager();
  return [deleteSupervisionCategory, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports - RTK Query style
export const useAddSupervisionCategory = useAddSupervisionCategoryMutation;
export const useUpdateSupervisionCategory = useUpdateSupervisionCategoryMutation;
export const useGetAllSupervisionCategoryController = useGetAllSupervisionCategoriesManager;