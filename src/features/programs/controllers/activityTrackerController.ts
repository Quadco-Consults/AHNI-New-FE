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
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TWorkPlanTrackerData>>({
    queryKey: ["activity-trackers", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/plans/works/trackers/", {
          params: { page, size, search, status },
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

// Create Activity Tracker
export const useCreateActivityTracker = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TWorkPlanTrackerData,
    Error,
    TWorkPlanTrackerFormValues
  >({
    endpoint: "/programs/plans/activity-trackers/",
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