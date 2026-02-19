import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { useState } from "react";
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
      is_unplanned,
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
    // Improved caching strategy for timesheet activity plans
    staleTime: 30000, // 30 seconds - consider data stale quickly
    cacheTime: 300000, // 5 minutes - keep in cache but refetch when stale
    // Retry failed requests with exponential backoff
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    endpoint: "programs/plans/activity/",
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

// Create Unplanned Activity
export const useCreateUnplannedActivity = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityPlanData,
    Error,
    TActivityPlanFormValues
  >({
    endpoint: "programs/plans/activities/create-unplanned/",
    queryKey: ["activity-plans", "unplanned-activities"],
    isAuth: true,
    method: "POST",
  });

  const createUnplannedActivity = async (details: TActivityPlanFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Unplanned activity create error:", error);
    }
  };

  return { createUnplannedActivity, data, isLoading, isSuccess, error };
};

// Upload Activity Plan
export const useUploadActivityPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);

  const uploadActivityPlan = async (details: {
    project: string;
    file: File;
    financialYear: string;
    workPlanId?: string;
    activityType?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("project", details.project);
      formData.append("financial_year", details.financialYear);  // ← REQUIRED FIELD ADDED!
      formData.append("file", details.file);

      // Add optional parameters
      if (details.workPlanId) {
        formData.append("work_plan", details.workPlanId);
      }
      if (details.activityType) {
        formData.append("activity_type", details.activityType);
      }

      console.log("📤 Uploading activity plan with FormData:");
      console.log("- Project:", details.project);
      console.log("- Financial Year:", details.financialYear);  // ← ADD THIS LOG
      console.log("- File:", details.file.name, details.file.size, "bytes");
      console.log("- Work Plan ID:", details.workPlanId || "Not provided");
      console.log("- Activity Type:", details.activityType || "Not specified");

      // Use direct AxiosWithToken call instead of useApiManager
      const response = await AxiosWithToken.post(
        "/programs/plans/activity/sheet/upload/",
        formData,
        {
          headers: {
            // Don't set Content-Type manually - let browser set it with boundary
          },
        }
      );

      console.log("✅ Upload successful:", response.data);
      setData(response.data);
      setIsSuccess(true);
      return response.data;

    } catch (error: any) {
      console.error("❌ Activity plan upload error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadActivityPlan, data, isLoading, isSuccess, error };
};

// Bulk Upload Unplanned Activities
export const useBulkUploadUnplannedActivities = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    FormData
  >({
    endpoint: "programs/unplanned-activities/bulk-create/",
    queryKey: ["activity-plans", "unplanned-activities"],
    isAuth: true,
    method: "POST",
    contentType: null, // For FormData
  });

  const bulkUploadUnplannedActivities = async (formData: FormData) => {
    try {
      await callApi(formData as any);
    } catch (error) {
      console.error("Unplanned activities bulk upload error:", error);
    }
  };

  return { bulkUploadUnplannedActivities, data, isLoading, isSuccess, error };
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

// Update Activity Plan Status
export const useUpdateActivityPlanStatus = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityPlanData,
    Error,
    { status: string }
  >({
    endpoint: `/programs/plans/activity/${id}/`,
    queryKey: ["activity-plans", "activity-plan"],
    isAuth: true,
    method: "PATCH",
  });

  const updateStatus = async (status: string) => {
    try {
      await callApi({ status });
    } catch (error) {
      console.error("Activity plan status update error:", error);
      throw error;
    }
  };

  return { updateStatus, data, isLoading, isSuccess, error };
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
    endpoint: "activities/download/",
    queryKey: [],
    isAuth: true,
    method: "GET" as any, // Note: This is a special case for download
    showSuccessToast: false,
  });

  const downloadActivityPlans = async (params: any) => {
    try {
      // For file downloads, we need to handle this differently
      // Using the same pattern as template and upload endpoints
      const response = await AxiosWithToken.get(
        "/programs/plans/activity/sheet/download/",
        {
          params: { ...params, format: "csv" },
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
