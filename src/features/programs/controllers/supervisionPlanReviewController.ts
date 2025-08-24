import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ISupervisionPlanReviewPaginatedData,
  ISupervisionPlanReviewSingleData,
  TSupervisionPlanReviewFormData,
} from "../types/program/plan/supervision-plan/supervision-plan-review";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/programs/plans/supportive-supervision/";

// ===== SUPERVISION PLAN REVIEW HOOKS =====

// Get All Supervision Plan Reviews
export const useGetAllSupervisionPlanReviews = ({
  planId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { planId: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<ISupervisionPlanReviewPaginatedData>>({
    queryKey: ["supervision-plan-reviews", planId, page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${planId}/reviews/`, {
          params: { page, size, search },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!planId,
    refetchOnWindowFocus: false,
  });
};

// Get Single Supervision Plan Review
export const useGetSingleSupervisionPlanReview = (
  planId: string, 
  reviewId: string, 
  enabled: boolean = true
) => {
  return useQuery<TResponse<ISupervisionPlanReviewSingleData>>({
    queryKey: ["supervision-plan-review", planId, reviewId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${planId}/reviews/${reviewId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!planId && !!reviewId,
    refetchOnWindowFocus: false,
  });
};

// Create Supervision Plan Review
export const useCreateSupervisionPlanReview = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISupervisionPlanReviewSingleData,
    Error,
    TSupervisionPlanReviewFormData
  >({
    endpoint: `${BASE_URL}${id}/reviews/`,
    queryKey: ["supervision-plan-reviews"],
    isAuth: true,
    method: "POST",
  });

  const createSupervisionPlanReview = async (details: TSupervisionPlanReviewFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supervision plan review create error:", error);
    }
  };

  return { createSupervisionPlanReview, data, isLoading, isSuccess, error };
};

// Modify Supervision Plan Review
export const useModifySupervisionPlanReview = (planId: string, reviewId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISupervisionPlanReviewSingleData,
    Error,
    TSupervisionPlanReviewFormData
  >({
    endpoint: `${BASE_URL}${planId}/reviews/${reviewId}/`,
    queryKey: ["supervision-plan-reviews", "supervision-plan-review"],
    isAuth: true,
    method: "PATCH",
  });

  const modifySupervisionPlanReview = async (details: TSupervisionPlanReviewFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supervision plan review modify error:", error);
    }
  };

  return { modifySupervisionPlanReview, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateSupervisionPlanReviewMutation = useCreateSupervisionPlanReview;
export const useGetAllSupervisionPlanReviewsQuery = useGetAllSupervisionPlanReviews;
export const useGetSingleSupervisionPlanReviewQuery = useGetSingleSupervisionPlanReview;
export const useModifySupervisionPlanReviewMutation = useModifySupervisionPlanReview;

// Missing named export
export const useCreateSupervisionPlanReviewController = useCreateSupervisionPlanReview;