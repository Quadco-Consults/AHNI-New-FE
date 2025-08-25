import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { PrequalificationStagesSchema } from "definations/procurement-validator";
import {
  PrequalificationStagesData,
  PrequalificationStagesResponse,
  PrequalificationStagesResultsData,
} from "../types/prequalification-stages";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/config/prequalification-stages/";

// ===== PREQUALIFICATION STAGES HOOKS =====

// Get All Prequalification Stages
export const useGetAllPrequalificationStages = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<PrequalificationStagesData>>({
    queryKey: ["prequalification-stages", page, size, search, status],
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

// Get Single Prequalification Stage
export const useGetSinglePrequalificationStage = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<PrequalificationStagesResultsData>>({
    queryKey: ["prequalification-stage", id],
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

// Create Prequalification Stage
export const useCreatePrequalificationStage = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationStagesResponse,
    Error,
    z.infer<typeof PrequalificationStagesSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["prequalification-stages"],
    isAuth: true,
    method: "POST",
  });

  const createPrequalificationStage = async (
    details: z.infer<typeof PrequalificationStagesSchema>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification stage create error:", error);
    }
  };

  return { createPrequalificationStage, data, isLoading, isSuccess, error };
};

// Update Prequalification Stage (Full Update)
export const useUpdatePrequalificationStage = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationStagesResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["prequalification-stages", "prequalification-stage"],
    isAuth: true,
    method: "PUT",
  });

  const updatePrequalificationStage = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification stage update error:", error);
    }
  };

  return { updatePrequalificationStage, data, isLoading, isSuccess, error };
};

// Modify Prequalification Stage (Partial Update)
export const useModifyPrequalificationStage = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PrequalificationStagesResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["prequalification-stages", "prequalification-stage"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyPrequalificationStage = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Prequalification stage modify error:", error);
    }
  };

  return { modifyPrequalificationStage, data, isLoading, isSuccess, error };
};

// Delete Prequalification Stage
export const useDeletePrequalificationStage = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["prequalification-stages"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePrequalificationStage = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Prequalification stage delete error:", error);
    }
  };

  return { deletePrequalificationStage, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetPrequalificationStagesQuery = useGetAllPrequalificationStages;
export const useGetPrequalificationStageQuery = useGetSinglePrequalificationStage;
export const useCreatePrequalificationStageMutation = useCreatePrequalificationStage;
export const useUpdatePrequalificationStageMutation = useUpdatePrequalificationStage;
export const useModifyPrequalificationStageMutation = useModifyPrequalificationStage;
export const useDeletePrequalificationStageMutation = useDeletePrequalificationStage;