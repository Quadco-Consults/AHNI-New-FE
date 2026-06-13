import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TResponse } from "definitions/index";

// Types
export interface CostSheetTracker {
  id: string;
  cost_sheet: string;
  cost_sheet_data?: {
    id: string;
    description: string;
    units: number;
    days: number;
    frequency: number;
    rate_ngn: number;
    total_cost_ngn: number;
    comments?: string;
  };
  status: "NOT_DONE" | "IN_PROGRESS" | "DONE" | "ON_HOLD" | "CANCELLED";
  percentage_achievement: number;
  amount_expended_ngn: number;
  achieved_results?: string;
  comments?: string;
  completion_date?: string;
  budget_variance: number;
  budget_variance_percentage: number;
  is_over_budget: boolean;
  is_on_track: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface ActivityRollup {
  avg_achievement: number;
  total_expended: number;
  total_budget: number;
  overall_status: string;
  completed_count: number;
  total_count: number;
}

interface CreateUpdateTrackerPayload {
  cost_sheet?: string;
  status?: string;
  percentage_achievement?: number;
  amount_expended_ngn?: number;
  achieved_results?: string;
  comments?: string;
  completion_date?: string;
}

// ===== COST SHEET TRACKER HOOKS =====

/**
 * Fetch all cost sheet trackers for a specific activity (planned or unplanned)
 * @param activityId - The ID of the activity or activity plan
 * @param enabled - Whether the query should be enabled
 * @param isUnplanned - Whether this is an unplanned activity (activity_plan) or planned (work_plan_activity)
 */
export const useCostSheetTrackersByActivity = (
  activityId: string,
  enabled = true,
  isUnplanned = false
) => {
  return useQuery<TResponse<CostSheetTracker[]>>({
    queryKey: ["cost-sheet-trackers", isUnplanned ? "activity-plan" : "activity", activityId],
    queryFn: async () => {
      try {
        // For unplanned activities, use activity_plan query parameter
        // For planned activities, use the existing activity endpoint
        const endpoint = isUnplanned
          ? `/programs/plan/cost-sheet-trackers/activity-plan/${activityId}/`
          : `/programs/plan/cost-sheet-trackers/activity/${activityId}/`;

        const response = await AxiosWithToken.get(endpoint);
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

/**
 * Fetch aggregated rollup metrics for an activity
 */
export const useActivityRollup = (activityId: string, enabled = true) => {
  return useQuery<TResponse<ActivityRollup>>({
    queryKey: ["cost-sheet-trackers", "rollup", activityId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/programs/plan/cost-sheet-trackers/activity-rollup/${activityId}/`
        );
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

/**
 * Create a single cost sheet tracker
 */
export const useCreateCostSheetTracker = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostSheetTracker,
    Error,
    CreateUpdateTrackerPayload
  >({
    endpoint: "programs/plan/cost-sheet-trackers/",
    queryKey: ["cost-sheet-trackers"],
    isAuth: true,
    method: "POST",
  });

  const createCostSheetTracker = async (details: CreateUpdateTrackerPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Cost sheet tracker create error:", error);
    }
  };

  return { createCostSheetTracker, data, isLoading, isSuccess, error };
};

/**
 * Update an existing cost sheet tracker
 */
export const useUpdateCostSheetTracker = () => {
  const { callApi, isLoading, isSuccess, error, data, mutateAsync } = useApiManager<
    CostSheetTracker,
    Error,
    CreateUpdateTrackerPayload & { id: string }
  >({
    endpoint: "programs/plan/cost-sheet-trackers/",
    queryKey: ["cost-sheet-trackers"],
    isAuth: true,
    method: "PATCH",
    useDynamicEndpoint: true, // This allows us to dynamically set the endpoint with ID
  });

  const updateCostSheetTracker = async ({ id, data: updateData }: { id: string; data: CreateUpdateTrackerPayload }) => {
    try {
      // Manually construct the request since we need dynamic endpoint
      const response = await AxiosWithToken.patch(
        `/programs/plan/cost-sheet-trackers/${id}/`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Cost sheet tracker update error:", error);
      throw error;
    }
  };

  return {
    updateCostSheetTracker,
    mutateAsync: updateCostSheetTracker,
    data,
    isLoading: isLoading,
    isPending: isLoading,
    isSuccess,
    error
  };
};

/**
 * Quick update for common fields (status, achievement, expenditure)
 */
export const useQuickUpdateTracker = () => {
  const updateTracker = async ({
    id,
    status,
    percentage_achievement,
    amount_expended_ngn,
  }: {
    id: string;
    status?: string;
    percentage_achievement?: number;
    amount_expended_ngn?: number;
  }) => {
    try {
      const response = await AxiosWithToken.patch(
        `/programs/plan/cost-sheet-trackers/${id}/quick-update/`,
        { status, percentage_achievement, amount_expended_ngn }
      );
      return response.data;
    } catch (error) {
      console.error("Quick update error:", error);
      throw error;
    }
  };

  return {
    mutateAsync: updateTracker,
    isPending: false, // We don't track loading state for direct async calls
  };
};

/**
 * Bulk create trackers for all cost sheets of an activity
 */
export const useBulkCreateTrackers = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { created: number; message: string },
    Error,
    { activity_id?: string; activity_plan_id?: string }
  >({
    endpoint: "programs/plan/cost-sheet-trackers/bulk-create/",
    queryKey: ["cost-sheet-trackers"],
    isAuth: true,
    method: "POST",
  });

  const bulkCreate = async (activityId: string, isUnplanned = false) => {
    try {
      const payload = isUnplanned
        ? { activity_plan_id: activityId }
        : { activity_id: activityId };
      await callApi(payload);
    } catch (error) {
      console.error("Bulk create error:", error);
      throw error;
    }
  };

  return {
    mutateAsync: bulkCreate,
    isPending: isLoading,
    isLoading,
    isSuccess,
    error,
    data,
  };
};

/**
 * Delete a cost sheet tracker
 */
export const useDeleteCostSheetTracker = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    CostSheetTracker,
    Error,
    Record<string, never>
  >({
    endpoint: `/programs/plan/cost-sheet-trackers/${id}/`,
    queryKey: ["cost-sheet-trackers"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCostSheetTracker = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Cost sheet tracker delete error:", error);
    }
  };

  return { deleteCostSheetTracker, data, isLoading, isSuccess, error };
};
