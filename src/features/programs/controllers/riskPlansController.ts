import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  RiskPlansData,
  RiskPlansResultsData,
  RiskPlansResponse,
} from "../types/risk-plans";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TRiskManagementPlanData, TRiskPlanManagementFormValues } from "definations/program-validator";

const BASE_URL = "/programs/plans/risk-management/";

// ===== RISK PLANS HOOKS =====

// Get All Risk Management Plans
export const useGetAllRiskManagementPlans = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TRiskManagementPlanData>>({
    queryKey: ["risk-management-plans", page, size, search],
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

// Get Single Risk Plan Management
export const useGetSingleRiskPlanManagement = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TRiskManagementPlanData>>({
    queryKey: ["risk-management-plan", id],
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

// Create Risk Management Plan
export const useCreateRiskManagementPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TRiskManagementPlanData,
    Error,
    TRiskPlanManagementFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["risk-management-plans"],
    isAuth: true,
    method: "POST",
  });

  const createRiskManagementPlan = async (details: TRiskPlanManagementFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Risk management plan create error:", error);
    }
  };

  return { createRiskManagementPlan, data, isLoading, isSuccess, error };
};

// Update Risk Management Plan
export const useUpdateRiskManagementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TRiskManagementPlanData,
    Error,
    TRiskPlanManagementFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["risk-management-plans", "risk-management-plan"],
    isAuth: true,
    method: "PUT",
  });

  const updateRiskManagementPlan = async (details: TRiskPlanManagementFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Risk management plan update error:", error);
    }
  };

  return { updateRiskManagementPlan, data, isLoading, isSuccess, error };
};

// Patch Risk Management Plan
export const usePatchRiskManagementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TRiskManagementPlanData,
    Error,
    { risk_status: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["risk-management-plans", "risk-management-plan"],
    isAuth: true,
    method: "PATCH",
  });

  const patchRiskManagementPlan = async (details: { risk_status: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Risk management plan patch error:", error);
    }
  };

  return { patchRiskManagementPlan, data, isLoading, isSuccess, error };
};

// Delete Risk Management Plan
export const useDeleteRiskManagementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TRiskManagementPlanData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["risk-management-plans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteRiskManagementPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Risk management plan delete error:", error);
    }
  };

  return { deleteRiskManagementPlan, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateRiskManagementPlanMutation = useCreateRiskManagementPlan;
export const useGetAllRiskManagementPlansQuery = useGetAllRiskManagementPlans;
export const useGetSingleRiskPlanManagementQuery = useGetSingleRiskPlanManagement;
export const useUpdateRiskManagementPlanMutation = useUpdateRiskManagementPlan;
export const usePatchRiskManagementPlanMutation = usePatchRiskManagementPlan;
export const useDeleteRiskManagementPlanMutation = useDeleteRiskManagementPlan;

// Missing named export
export const useCreateRiskManagementPlanController = useCreateRiskManagementPlan;