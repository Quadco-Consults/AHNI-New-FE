import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TWorkPlanTrackerData,
  TWorkPlanTrackerFormValues,
} from "../types/activity-tracker";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// ===== ACTIVITY TRACKER HOOKS =====

// Get All Activity Trackers
export const useGetAllActivityTrackers = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  work_plan__id = "",
  enabled = true,
}: TRequest & {
  status?: string;
  work_plan__id?: string;
  enabled?: boolean
}) => {
  return useQuery<TPaginatedResponse<TWorkPlanTrackerData>>({
    queryKey: ["activity-trackers", page, size, search, status, work_plan__id],
    queryFn: async () => {
      try {
        const params: any = { page, size, search };
        if (status) params.status = status;
        // Try multiple filter parameter names for work plan filtering
        // Backend might use different naming conventions
        if (work_plan__id) {
          params.work_plan_activity__work_plan = work_plan__id; // Filter through activity relationship
          params.work_plan__id = work_plan__id; // Also try direct filter
          params.work_plan = work_plan__id; // Also try simple name
        }

        console.log("🔍 Activity Tracker API params:", params);

        const response = await AxiosWithToken.get("/programs/plans/works/trackers/", {
          params,
        });

        console.log("📊 Activity Tracker API response:", {
          total: response.data?.data?.pagination?.count || response.data?.count,
          results: response.data?.data?.results?.length || response.data?.results?.length
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

// Get Single Activity Tracker
export const useGetSingleActivityTracker = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TWorkPlanTrackerData>>({
    queryKey: ["activity-tracker", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/programs/plans/works/trackers/${id}/`);
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

// Get Activity Tracker by Activity ID
export const useGetActivityTrackerByActivityId = (activityId: string, enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<TWorkPlanTrackerData>>({
    queryKey: ["activity-tracker-by-activity", activityId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/plans/works/trackers/", {
          params: { work_plan_activity: activityId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!activityId,
    refetchOnWindowFocus: false,
  });
};

// Create Activity Tracker
export const useCreateActivityTracker = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanTrackerData,
    Error,
    TWorkPlanTrackerFormValues
  >({
    endpoint: "programs/plans/activity-trackers/",
    queryKey: ["activity-trackers"],
    isAuth: true,
    method: "POST",
  });

  const createActivityTracker = async (details: TWorkPlanTrackerFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity tracker create error:", error);
    }
  };

  return { createActivityTracker, data, isLoading, isSuccess, error };
};

// Update Activity Tracker
export const useUpdateActivityTracker = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanTrackerData,
    Error,
    TWorkPlanTrackerFormValues
  >({
    endpoint: `/programs/plans/works/trackers/${id}/`,
    queryKey: ["activity-trackers", "activity-tracker"],
    isAuth: true,
    method: "PUT",
  });

  const updateActivityTracker = async (details: TWorkPlanTrackerFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity tracker update error:", error);
    }
  };

  return { updateActivityTracker, data, isLoading, isSuccess, error };
};

// Patch Activity Tracker (for partial updates)
export const usePatchActivityTracker = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanTrackerData,
    Error,
    Partial<TWorkPlanTrackerFormValues>
  >({
    endpoint: `/programs/plans/works/trackers/${id}/`,
    queryKey: ["activity-trackers", "activity-tracker"],
    isAuth: true,
    method: "PATCH",
  });

  const patchActivityTracker = async (details: Partial<TWorkPlanTrackerFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity tracker patch error:", error);
    }
  };

  return { patchActivityTracker, data, isLoading, isSuccess, error };
};

// Patch Work Plan Tracker Status
export const usePatchWorkPlanTracker = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanTrackerData,
    Error,
    { status: string }
  >({
    endpoint: `/programs/plans/works/trackers/${id}/`,
    queryKey: ["activity-trackers", "activity-tracker"],
    isAuth: true,
    method: "PUT",
  });

  const patchWorkPlanTracker = async (details: { status: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Work plan tracker patch error:", error);
    }
  };

  return { patchWorkPlanTracker, data, isLoading, isSuccess, error };
};

// Delete Activity Tracker
export const useDeleteActivityTracker = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanTrackerData,
    Error,
    Record<string, never>
  >({
    endpoint: `/programs/plans/works/trackers/${id}/`,
    queryKey: ["activity-trackers"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteActivityTracker = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Activity tracker delete error:", error);
    }
  };

  return { deleteActivityTracker, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateActivityTrackerMutation = useCreateActivityTracker;
export const useGetAllActivityTrackerQuery = useGetAllActivityTrackers;
export const useGetSingleActivityTrackerQuery = useGetSingleActivityTracker;
export const useUpdateActivityTrackerMutation = useUpdateActivityTracker;
export const usePatchWorkPlanTrackerMutation = usePatchWorkPlanTracker;
export const useDeleteActivityTrackerMutation = useDeleteActivityTracker;