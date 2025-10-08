import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TSupervisionPlanPaginatedData,
  TSSPCompositionFormValues,
  TSupervisionPlanSingleData,
} from "../types/program/plan/supervision-plan/supervision-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "programs/plans/supportive-supervision/";

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

// Approve/Reject Supervision Plan (3-Level Workflow)
export const useApproveSupervisionPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      comments,
    }: {
      action: "approve" | "reject";
      comments?: string;
    }) => {
      try {
        const endpoint = `${BASE_URL}${id}/approve/`;
        console.log('🔵 Approval endpoint:', endpoint);
        console.log('🔵 Request payload:', { action, comments });

        const response = await AxiosWithToken.post(
          endpoint,
          {
            action,
            comments,
          }
        );

        console.log('✅ Approval response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ Approval error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        console.error('❌ Full error data:', JSON.stringify(error.response?.data, null, 2));

        // Check if response is HTML (backend endpoint not deployed)
        const isHtmlResponse = typeof error.response?.data === 'string' &&
          error.response?.data.trim().startsWith('<!DOCTYPE');

        if (error.response?.status === 404) {
          if (isHtmlResponse) {
            throw new Error(
              "The approval endpoint is not yet deployed to the server. Please contact the backend team to deploy the /approve/ endpoint to Heroku."
            );
          }
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Supervision plan not found. It may have been deleted or you don't have permission to access it."
          );
        }
        if (error.response?.status === 403) {
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "You don't have permission to approve this supervision plan at this level."
          );
        }
        if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
              "Cannot approve at this time. Check the approval workflow status."
          );
        }
        throw new Error(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to process approval"
        );
      }
    },
    onSuccess: () => {
      // Refresh supervision plan data
      queryClient.invalidateQueries({ queryKey: ["supervision-plans"] });
      queryClient.invalidateQueries({ queryKey: ["supervision-plan", id] });
    },
  });
};

// Get approval status for a supervision plan
export const useGetSupervisionPlanApprovalStatus = (id: string) => {
  return useQuery({
    queryKey: ["supervision-plan-approval-status", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${id}/approval-status/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};