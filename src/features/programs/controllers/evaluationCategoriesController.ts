import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  EvaluationCategoryData,
  EvaluationCategoryResponse,
  EvaluationCategorySchema,
} from "../types/evaluation-category";
import { z } from "zod";

const BASE_URL = "/programs/evaluation-categories/";

// ===== EVALUATION CATEGORIES HOOKS =====

// Get All Evaluation Categories
export const useGetEvaluationCategories = (enabled: boolean = true) => {
  return useQuery<EvaluationCategoryData[]>({
    queryKey: ["evaluation-categories"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
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

// Get Single Evaluation Category
export const useGetEvaluationCategory = (id: string, enabled: boolean = true) => {
  return useQuery<EvaluationCategoryData>({
    queryKey: ["evaluation-category", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Get Evaluation Category Criteria
export const useGetEvaluationCategoryCriteria = (id: string, enabled: boolean = true) => {
  return useQuery<any>({
    queryKey: ["evaluation-category-criteria", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}criteria/${id}/`);
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

// Create Evaluation Category Criteria
export const useCreateEvaluationCategoryCriteria = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EvaluationCategoryResponse,
    Error,
    z.infer<typeof EvaluationCategorySchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["evaluation-categories"],
    isAuth: true,
    method: "POST",
  });

  const createEvaluationCategoryCriteria = async (details: z.infer<typeof EvaluationCategorySchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Evaluation category criteria create error:", error);
    }
  };

  return { createEvaluationCategoryCriteria, data, isLoading, isSuccess, error };
};

// Update Evaluation Category Criteria
export const useUpdateEvaluationCategoryCriteria = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EvaluationCategoryResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["evaluation-categories"],
    isAuth: true,
    method: "PUT",
  });

  const updateEvaluationCategoryCriteria = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Evaluation category criteria update error:", error);
    }
  };

  return { updateEvaluationCategoryCriteria, data, isLoading, isSuccess, error };
};

// Modify Evaluation Category Criteria (PATCH)
export const useModifyEvaluationCategoryCriteria = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EvaluationCategoryResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["evaluation-categories"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyEvaluationCategoryCriteria = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Evaluation category criteria modify error:", error);
    }
  };

  return { modifyEvaluationCategoryCriteria, data, isLoading, isSuccess, error };
};

// Delete Evaluation Category Criteria
export const useDeleteEvaluationCategoryCriteria = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["evaluation-categories"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteEvaluationCategoryCriteria = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Evaluation category criteria delete error:", error);
    }
  };

  return { deleteEvaluationCategoryCriteria, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetEvaluationCategoriesQuery = useGetEvaluationCategories;
export const useGetEvaluationCategoryQuery = useGetEvaluationCategory;
export const useGetEvaluationCategoryCriteriaQuery = useGetEvaluationCategoryCriteria;
export const useCreateEvaluationCategoryCriteriaMutation = useCreateEvaluationCategoryCriteria;
export const useUpdateEvaluationCategoryCriteriaMutation = useUpdateEvaluationCategoryCriteria;
export const useModifyEvaluationCategoryCriteriaMutation = useModifyEvaluationCategoryCriteria;
export const useDeleteEvaluationCategoryCriteriaMutation = useDeleteEvaluationCategoryCriteria;