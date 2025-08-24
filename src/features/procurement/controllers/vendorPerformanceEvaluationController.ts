import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { VendorsResponse } from "../types/vendors";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/vendor-evaluation/";

// ===== VENDOR PERFORMANCE EVALUATION HOOKS =====

// Get All Vendor Evaluations
export const useGetAllVendorEvaluations = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<any>>({
    queryKey: ["vendor-evaluations", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
        });
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

// Get Vendor List (for dropdown/selection)
export const useGetVendorList = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery<any[]>({
    queryKey: ["vendor-evaluation-list"],
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

// Get Single Vendor Evaluation
export const useGetSingleVendorEvaluation = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<any>>({
    queryKey: ["vendor-evaluation", id],
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

// Create Vendor Evaluation
export const useCreateVendorEvaluation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["vendor-evaluations"],
    isAuth: true,
    method: "POST",
  });

  const createVendorEvaluation = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor evaluation create error:", error);
    }
  };

  return { createVendorEvaluation, data, isLoading, isSuccess, error };
};

// Submit Vendor Evaluation by ID
export const useSubmitVendorEvaluation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["vendor-evaluations"],
    isAuth: true,
    method: "PATCH",
  });

  const submitVendorEvaluation = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor evaluation submit error:", error);
    }
  };

  return { submitVendorEvaluation, data, isLoading, isSuccess, error };
};

// Update Vendor Evaluation (Full Update)
export const useUpdateVendorEvaluation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-evaluations", "vendor-evaluation"],
    isAuth: true,
    method: "PUT",
  });

  const updateVendorEvaluation = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor evaluation update error:", error);
    }
  };

  return { updateVendorEvaluation, data, isLoading, isSuccess, error };
};

// Modify Vendor Evaluation (Partial Update)
export const useModifyVendorEvaluation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-evaluations", "vendor-evaluation"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyVendorEvaluation = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor evaluation modify error:", error);
    }
  };

  return { modifyVendorEvaluation, data, isLoading, isSuccess, error };
};

// Delete Vendor Evaluation
export const useDeleteVendorEvaluation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-evaluations"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteVendorEvaluation = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Vendor evaluation delete error:", error);
    }
  };

  return { deleteVendorEvaluation, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetVendorsEvaluationQuery = useGetAllVendorEvaluations;
export const useGetVendorListQuery = useGetVendorList;
export const useGetVendorEvaluationQuery = useGetSingleVendorEvaluation;
export const useCreateVendorEvaluationMutation = useCreateVendorEvaluation;
export const useCreateVendorEvaluationByIdMutation = useSubmitVendorEvaluation;
export const useUpdateVendorMutation = useUpdateVendorEvaluation;
export const useModifyVendorMutation = useModifyVendorEvaluation;
export const useDeleteVendorEvaluationMutation = useDeleteVendorEvaluation;

// Default export for backward compatibility
const VendorsEvaluaionAndPerformanceAPI = {
  useGetAllVendorEvaluations,
  useGetVendorList,
  useGetSingleVendorEvaluation,
  useCreateVendorEvaluation,
  useSubmitVendorEvaluation,
  useUpdateVendorEvaluation,
  useModifyVendorEvaluation,
  useDeleteVendorEvaluation,
  useGetVendorsEvaluationQuery,
  useGetVendorListQuery,
  useGetVendorEvaluationQuery,
  useCreateVendorEvaluationMutation,
  useCreateVendorEvaluationByIdMutation,
  useUpdateVendorMutation,
  useModifyVendorMutation,
  useDeleteVendorEvaluationMutation,
};

export default VendorsEvaluaionAndPerformanceAPI;