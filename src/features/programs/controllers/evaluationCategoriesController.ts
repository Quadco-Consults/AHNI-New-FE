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

const BASE_URL = "programs/supervision-evaluation-category/";

// ===== EVALUATION CATEGORIES HOOKS =====

// Get All Evaluation Categories
export const useGetEvaluationCategories = (enabled: boolean = true) => {
  return useQuery<EvaluationCategoryData[]>({
    queryKey: ["supervision-evaluation-categories"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page: 1,
            size: 2000000,
            search: ""
          }
        });
        console.log("📊 Categories API Response:", response.data);

        // Handle the API response structure: {status, message, data: {results: [...], count: ...}}
        // The actual categories array is in response.data.data.results
        const responseData = response.data;

        // Check for nested data.results structure (most common)
        if (responseData?.data?.results && Array.isArray(responseData.data.results)) {
          console.log("✅ Found categories in data.results:", responseData.data.results.length);
          return responseData.data.results;
        }

        // Check for direct results in data object
        if (responseData?.results && Array.isArray(responseData.results)) {
          console.log("✅ Found categories in results:", responseData.results.length);
          return responseData.results;
        }

        // Check if data itself is an array
        if (responseData?.data && Array.isArray(responseData.data)) {
          console.log("✅ Found categories in data array:", responseData.data.length);
          return responseData.data;
        }

        // Check if response is directly an array
        if (Array.isArray(responseData)) {
          console.log("✅ Found categories as direct array:", responseData.length);
          return responseData;
        }

        console.warn("⚠️ Unexpected categories response structure:", responseData);
        console.warn("⚠️ Available keys:", responseData ? Object.keys(responseData) : 'no data');
        if (responseData?.data) {
          console.warn("⚠️ Data keys:", Object.keys(responseData.data));
        }
        return [];
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Categories API Error:", axiosError.response?.data);
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
        console.log("📊 Single Category API Response:", response.data);

        // Handle different possible response structures
        if (response.data?.data) {
          return response.data.data;
        } else {
          return response.data;
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Single Category API Error:", axiosError.response?.data);
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
        // Use the correct criteria endpoint with category filter
        const response = await AxiosWithToken.get("programs/supervision-evaluation-criteria/", {
          params: {
            page: 1,
            size: 20,
            search: "",
            evaluation_category: id  // Use evaluation_category as shown in network logs
          }
        });
        console.log(`📊 Criteria API Response for category ${id}:`, response.data);

        // Handle different possible response structures
        if (response.data?.data?.results) {
          return response.data.data.results;
        } else if (response.data?.results) {
          return response.data.results;
        } else if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          console.warn(`Unexpected criteria response structure for category ${id}:`, response.data);
          return response.data;
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`Criteria API Error for category ${id}:`, axiosError.response?.data);
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