import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TSupervisionPlanPaginatedData,
  TSSPCompositionFormValues,
  TSupervisionPlanSingleData,
} from "../types/program/plan/supervision-plan/supervision-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/programs/plans/supportive-supervision/";

// ===== SUPERVISION PLAN HOOKS =====

// Get All Supervision Plans
export const useGetAllSupervisionPlan = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TSupervisionPlanPaginatedData>>({
    queryKey: ["supervision-plans", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search },
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

// Get Single Supervision Plan
export const useGetSingleSupervisionPlan = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TSupervisionPlanSingleData>>({
    queryKey: ["supervision-plan", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Supervision Plan
export const useCreateSupervisionPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TSupervisionPlanPaginatedData,
    Error,
    TSSPCompositionFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["supervision-plans"],
    isAuth: true,
    method: "POST",
  });

  const createSupervisionPlan = async (details: TSSPCompositionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supervision plan create error:", error);
    }
  };

  return { createSupervisionPlan, data, isLoading, isSuccess, error };
};

// Modify Supervision Plan
export const useModifySupervisionPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TSupervisionPlanSingleData,
    Error,
    TSSPCompositionFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["supervision-plans", "supervision-plan"],
    isAuth: true,
    method: "PUT",
  });

  const modifySupervisionPlan = async (details: TSSPCompositionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supervision plan modify error:", error);
    }
  };

  return { modifySupervisionPlan, data, isLoading, isSuccess, error };
};

// Delete Supervision Plan
export const useDeleteSupervisionPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TSupervisionPlanSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["supervision-plans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSupervisionPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Supervision plan delete error:", error);
    }
  };

  return { deleteSupervisionPlan, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateSupervisionPlanMutation = useCreateSupervisionPlan;
export const useGetAllSupervisionPlanQuery = useGetAllSupervisionPlan;
export const useGetSingleSupervisionPlanQuery = useGetSingleSupervisionPlan;
export const useModifySupervisionPlanMutation = useModifySupervisionPlan;
export const useDeleteSupervisionPlanMutation = useDeleteSupervisionPlan;

// Missing named export
export const useCreateSupervisionPlanController = useCreateSupervisionPlan;