import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TEngagementPlanFormValues,
  TEngagementPlanPaginatedData,
  TEngagementPlanSingleData,
} from "../types/engagement-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/programs/stakeholders/engagement-plans/";

// ===== ENGAGEMENT PLAN HOOKS =====

// Get All Engagement Plans
export const useGetAllEngagementPlans = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TEngagementPlanPaginatedData>>({
    queryKey: ["engagement-plans", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search },
        });
        // Transform response to match the service pattern
        return response.data.data || response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Engagement Plan
export const useGetSingleEngagementPlan = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TEngagementPlanSingleData>>({
    queryKey: ["engagement-plan", id],
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

// Create Engagement Plan
export const useCreateEngagementPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TEngagementPlanSingleData,
    Error,
    TEngagementPlanFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["engagement-plans"],
    isAuth: true,
    method: "POST",
  });

  const createEngagementPlan = async (details: TEngagementPlanFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Engagement plan create error:", error);
    }
  };

  return { createEngagementPlan, data, isLoading, isSuccess, error };
};

// Update Engagement Plan
export const useUpdateEngagementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TEngagementPlanSingleData,
    Error,
    TEngagementPlanFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["engagement-plans", "engagement-plan"],
    isAuth: true,
    method: "PUT",
  });

  const updateEngagementPlan = async (details: TEngagementPlanFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Engagement plan update error:", error);
    }
  };

  return { updateEngagementPlan, data, isLoading, isSuccess, error };
};

// Delete Engagement Plan
export const useDeleteEngagementPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TEngagementPlanSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["engagement-plans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteEngagementPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Engagement plan delete error:", error);
    }
  };

  return { deleteEngagementPlan, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateEngagementPlanMutation = useCreateEngagementPlan;
export const useGetAllEngagementPlansQuery = useGetAllEngagementPlans;
export const useGetSingleEngagementPlanQuery = useGetSingleEngagementPlan;
export const useUpdateEngagementPlanMutation = useUpdateEngagementPlan;
export const useDeleteEngagementPlanMutation = useDeleteEngagementPlan;