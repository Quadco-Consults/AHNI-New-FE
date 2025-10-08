import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  RiskPlansData,
  RiskPlansResultsData,
  RiskPlansResponse,
} from "../types/risk-plans";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { TRiskManagementPlanData, TRiskPlanManagementFormValues } from "definations/program-validator";

const BASE_URL = "programs/plans/risk-management/";

// ===== RISK PLANS HOOKS =====

// Download Risk Management Plan Template
export const useDownloadRiskManagementPlanTemplate = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["risk-management-plan-template"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}sheet/template/`,
          {
            responseType: "blob",
          }
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "risk-management-plan-template.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

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
export const useGetSingleRiskPlanManagement = (id: string | typeof skipToken, enabled: boolean = true) => {
  return useQuery<TResponse<TRiskManagementPlanData>>({
    queryKey: ["risk-management-plan", id],
    queryFn: async () => {
      if (id === skipToken) {
        throw new Error("No valid ID provided");
      }
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && id !== skipToken && !!id,
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
export const useUpdateRiskManagementPlan = (id: string | typeof skipToken) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TRiskManagementPlanData,
    Error,
    TRiskPlanManagementFormValues
  >({
    endpoint: id !== skipToken ? `${BASE_URL}${id}/` : "",
    queryKey: ["risk-management-plans", "risk-management-plan"],
    isAuth: true,
    method: "PUT",
  });

  const updateRiskManagementPlan = async (details: TRiskPlanManagementFormValues) => {
    if (id === skipToken) {
      console.error("Cannot update risk management plan: no valid ID provided");
      return;
    }

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

// Upload Risk Management Plan
export const useUploadRiskManagementPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    { project: string; financial_year: string; file: File }
  >({
    endpoint: `${BASE_URL}sheet/upload/`,
    queryKey: ["risk-management-plans"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const uploadRiskManagementPlan = async (details: {
    project: string;
    financial_year: string;
    file: File;
  }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("project", details.project);
      formData.append("financial_year", details.financial_year);
      formData.append("file", details.file);

      await callApi(formData as any);
    } catch (error) {
      console.error("Risk management plan upload error:", error);
      throw error;
    }
  };

  return { uploadRiskManagementPlan, data, isLoading, isSuccess, error };
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