import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TActivityPlanData,
  TActivityPlanFormValues,
} from "../types/activity-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// ===== ACTIVITY PLAN HOOKS =====

// Get All Activity Plans
export const useGetAllActivityPlans = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
  urgency_level,
  is_unplanned,
  month,
  financial_year,
  project,
  work_plan,
  approval_status,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TActivityPlanData>>({
    queryKey: [
      "activity-plans",
      page,
      size,
      search,
      status,
      urgency_level,
      month,
      financial_year,
      project,
      work_plan,
      approval_status,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/plans/activity/", {
          params: {
            page,
            size,
            search,
            status,
            urgency_level,
            is_unplanned,
            month,
            financial_year,
            project,
            work_plan,
            approval_status,
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

// Get Single Activity Plan
export const useGetSingleActivityPlan = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<TActivityPlanData>>({
    queryKey: ["activity-plan", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/programs/plans/activity/${id}`
        );
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

// Download Activity Plan Template
export const useDownloadActivityPlanTemplate = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["activity-plan-template"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          "/programs/plans/activity/sheet/template/",
          {
            responseType: "blob",
          }
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "activity-plan-template.xlsx");
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

// Create Activity Plan
export const useCreateActivityPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityPlanData,
    Error,
    TActivityPlanFormValues
  >({
    endpoint: "/programs/plans/activity/",
    queryKey: ["activity-plans"],
    isAuth: true,
    method: "POST",
  });

  const createActivityPlan = async (details: TActivityPlanFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity plan create error:", error);
    }
  };

  return { createActivityPlan, data, isLoading, isSuccess, error };
};

// Upload Activity Plan
export const useUploadActivityPlan = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    { project: string; file: File }
  >({
    endpoint: "/programs/plans/activity/sheet/upload/",
    queryKey: ["activity-plans"],
    isAuth: true,
    method: "POST",
    contentType: null, // For FormData
  });

  const uploadActivityPlan = async (details: {
    project: string;
    file: File;
  }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("project", details.project);
      formData.append("file", details.file);

      await callApi(formData as any);
    } catch (error) {
      console.error("Activity plan upload error:", error);
    }
  };

  return { uploadActivityPlan, data, isLoading, isSuccess, error };
};

// Edit Activity Plan
export const useEditActivityPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityPlanData,
    Error,
    TActivityPlanFormValues
  >({
    endpoint: `/programs/plans/activity/${id}/`,
    queryKey: ["activity-plans", "activity-plan"],
    isAuth: true,
    method: "PUT",
  });

  const editActivityPlan = async (details: TActivityPlanFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity plan edit error:", error);
    }
  };

  return { editActivityPlan, data, isLoading, isSuccess, error };
};

// Delete Activity Plan
export const useDeleteActivityPlan = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityPlanData,
    Error,
    Record<string, never>
  >({
    endpoint: `/programs/plans/activity/${id}`,
    queryKey: ["activity-plans"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteActivityPlan = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Activity plan delete error:", error);
    }
  };

  return { deleteActivityPlan, data, isLoading, isSuccess, error };
};

// Download Activities
export const useDownloadActivities = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Blob,
    Error,
    any
  >({
    endpoint: "/activities/download/",
    queryKey: [],
    isAuth: true,
    method: "GET" as any, // Note: This is a special case for download
    showSuccessToast: false,
  });

  const downloadActivityPlans = async (params: any) => {
    try {
      // For file downloads, we need to handle this differently
      const response = await AxiosWithToken.get(
        "/programs/plans/activity/download/?format=csv",
        {
          params,
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "activity_plan.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      console.error("Download activities error:", error);
      throw error;
    }
  };

  return { downloadActivityPlans, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllActivityPlansQuery = useGetAllActivityPlans;
export const useGetSingleActivityPlanQuery = useGetSingleActivityPlan;
export const useDownloadActivityPlanTemplateQuery =
  useDownloadActivityPlanTemplate;
export const useLazyDownloadActivityPlanTemplateQuery =
  useDownloadActivityPlanTemplate; // Note: lazy queries work differently in TanStack Query
export const useCreateActivityPlanMutation = useCreateActivityPlan;
export const useUploadActivityPlanMutation = useUploadActivityPlan;
export const useEditActivityPlanMutation = useEditActivityPlan;
export const useDeleteActivityPlanMutation = useDeleteActivityPlan;
export const useDownloadActivityPlansMutation = useDownloadActivities;
