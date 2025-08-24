import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TWorkPlanPaginatedResponse,
  TWorkPlanSingleResponse,
} from "../types/work-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/programs/plans/works/";

// ===== WORK PLAN HOOKS =====

// Download Work Plan Template
export const useDownloadWorkPlanTemplate = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["work-plan-template"],
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
        link.setAttribute("download", "work-plan-template.xlsx");
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

// Get All Work Plans
export const useGetAllWorkPlan = ({
  page = 1,
  size = 20,
  search = "",
  project_title = "",
  enabled = true,
}: TRequest & { project_title?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TWorkPlanPaginatedResponse>>({
    queryKey: ["work-plans", page, size, search, project_title],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            search,
            ...(project_title && { project_title }),
          },
        });
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

// Get Single Work Plan
export const useGetSingleWorkPlan = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TWorkPlanSingleResponse>>({
    queryKey: ["work-plan", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get Single Work Plan Activity
export const useGetSingleWorkPlanActivity = (
  workPlanId: string,
  activityId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["work-plan-activity", workPlanId, activityId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${workPlanId}/activities/${activityId}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!workPlanId && !!activityId,
    refetchOnWindowFocus: false,
  });
};

// Update Work Plan Activity
export const useUpdateWorkPlanActivity = (
  workPlanId: string,
  activityId: string
) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${workPlanId}/activities/${activityId}/`,
    queryKey: ["work-plan-activity", workPlanId, activityId],
    isAuth: true,
    method: "PATCH",
  });

  const updateWorkPlanActivity = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Work plan activity update error:", error);
    }
  };

  return { updateWorkPlanActivity, data, isLoading, isSuccess, error };
};

// Upload Work Plan
export const useUploadWorkPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    { project: string; financial_year: string; file: File }
  >({
    endpoint: `${BASE_URL}sheet/upload/`,
    queryKey: ["work-plans"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const uploadWorkPlan = async (details: {
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
      console.error("Work plan upload error:", error);
    }
  };

  return { uploadWorkPlan, data, isLoading, isSuccess, error };
};

// Delete Work Plan
export const useDeleteWorkPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanSingleResponse,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["work-plans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteWorkPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Work plan delete error:", error);
    }
  };

  return { deleteWorkPlan, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useLazyDownloadWorkPlanTemplateQuery = useDownloadWorkPlanTemplate;
export const useDownloadWorkPlanTemplateQuery = useDownloadWorkPlanTemplate;
export const useUploadWorkPlanMutation = useUploadWorkPlan;
export const useGetAllWorkPlanQuery = useGetAllWorkPlan;
export const useGetSingleWorkPlanQuery = useGetSingleWorkPlan;
export const useGetSingleWorkPlanActivityQuery = useGetSingleWorkPlanActivity;
export const useUpdateWorkPlanActivityMutation = useUpdateWorkPlanActivity;
export const useDeleteWorkPlanMutation = useDeleteWorkPlan;
