import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { PrequalificationCriteriaSchema } from "definations/procurement-validator";
import {
  PrequalificationCriteriaData,
  PrequalificationCriteriaResponse,
  PrequalificationCriteriaResultsData,
} from "../types/prequalification-criteria";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/prequalification_criteria/";

// ===== PREQUALIFICATION CRITERIA HOOKS =====

// Get All Prequalification Criteria
export const useGetAllPrequalificationCriteria = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<PrequalificationCriteriaData>>({
    queryKey: ["prequalification-criteria", page, size, search, status],
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

// Get Single Prequalification Criteria
export const useGetSinglePrequalificationCriteria = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<PrequalificationCriteriaResultsData>>({
    queryKey: ["prequalification-criteria", id],
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

// Create Prequalification Criteria
export const useCreatePrequalificationCriteria = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCriteriaResponse,
    Error,
    z.infer<typeof PrequalificationCriteriaSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["prequalification-criteria"],
    isAuth: true,
    method: "POST",
  });

  const createPrequalificationCriteria = async (
    details: z.infer<typeof PrequalificationCriteriaSchema>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification criteria create error:", error);
    }
  };

  return { createPrequalificationCriteria, data, isLoading, isSuccess, error };
};

// Update Prequalification Criteria (Full Update)
export const useUpdatePrequalificationCriteria = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCriteriaResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["prequalification-criteria", "prequalification-criteria"],
    isAuth: true,
    method: "PUT",
  });

  const updatePrequalificationCriteria = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification criteria update error:", error);
    }
  };

  return { updatePrequalificationCriteria, data, isLoading, isSuccess, error };
};

// Modify Prequalification Criteria (Partial Update)
export const useModifyPrequalificationCriteria = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationCriteriaResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["prequalification-criteria", "prequalification-criteria"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyPrequalificationCriteria = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification criteria modify error:", error);
    }
  };

  return { modifyPrequalificationCriteria, data, isLoading, isSuccess, error };
};

// Delete Prequalification Criteria
export const useDeletePrequalificationCriteria = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["prequalification-criteria"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePrequalificationCriteria = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Prequalification criteria delete error:", error);
    }
  };

  return { deletePrequalificationCriteria, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetPrequalificationCriterialQuery = useGetAllPrequalificationCriteria;
export const useGetPrequalificationCriteriaQuery = useGetSinglePrequalificationCriteria;
export const useCreatePrequalificationCriteriaMutation = useCreatePrequalificationCriteria;
export const useUpdatePrequalificationCriteriaMutation = useUpdatePrequalificationCriteria;
export const useModifyPrequalificationCriteriaMutation = useModifyPrequalificationCriteria;
export const useDeletePrequalificationCriteriaMutation = useDeletePrequalificationCriteria;