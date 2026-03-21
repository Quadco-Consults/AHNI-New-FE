import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TActivityCostSheet,
  TActivityCostSheetCreate,
  TActivityCostSheetUpdate,
  TActivityCostSheetListResponse,
  TActivityCostSheetStats,
  TActivityCostSheetSummary,
} from "../types/activity-cost-sheet";
import { TRequest, TResponse } from "definations/index";

// ===== ACTIVITY COST SHEET HOOKS =====

/**
 * Get all activity cost sheets with filtering
 */
export const useGetAllActivityCostSheets = ({
  page = 1,
  size = 100,
  search = "",
  activity = "",
  work_plan = "",
  enabled = true,
}: TRequest & {
  activity?: string;
  work_plan?: string;
  enabled?: boolean;
}) => {
  return useQuery<TActivityCostSheetListResponse>({
    queryKey: [
      "activity-cost-sheets",
      page,
      size,
      search,
      activity,
      work_plan,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/plans/activity-cost-sheets/", {
          params: {
            page,
            size,
            search,
            activity,
            work_plan,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch cost sheets"
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
};

/**
 * Get cost sheets for a specific activity
 */
export const useGetActivityCostSheets = (
  activityId?: string,
  activityPlanId?: string,
  enabled: boolean = true
) => {
  const identifier = activityId || activityPlanId;
  const queryParam = activityId ? "activity" : "activity_plan";

  return useQuery<TActivityCostSheetListResponse>({
    queryKey: ["activity-cost-sheets", queryParam, identifier],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/plans/activity-cost-sheets/", {
          params: {
            [queryParam]: identifier,
            size: 1000, // Get all for the activity
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch cost sheets"
        );
      }
    },
    enabled: enabled && !!identifier,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get single activity cost sheet
 */
export const useGetSingleActivityCostSheet = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<TActivityCostSheet>>({
    queryKey: ["activity-cost-sheet", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/programs/plans/activity-cost-sheets/${id}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch cost sheet"
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get cost sheet statistics
 */
export const useGetCostSheetStats = (workPlanId?: string, enabled: boolean = true) => {
  return useQuery<TResponse<TActivityCostSheetStats>>({
    queryKey: ["activity-cost-sheet-stats", workPlanId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/programs/plans/activity-cost-sheets/stats/", {
          params: workPlanId ? { work_plan: workPlanId } : {},
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "Failed to fetch stats"
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Create activity cost sheet
 */
export const useCreateActivityCostSheet = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityCostSheet,
    Error,
    TActivityCostSheetCreate
  >({
    endpoint: "programs/plans/activity-cost-sheets/",
    queryKey: ["activity-cost-sheets"],
    isAuth: true,
    method: "POST",
  });

  const createCostSheet = async (details: TActivityCostSheetCreate) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity cost sheet create error:", error);
      throw error;
    }
  };

  return { createCostSheet, data, isLoading, isSuccess, error };
};

/**
 * Edit/Update activity cost sheet
 */
export const useEditActivityCostSheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityCostSheet,
    Error,
    TActivityCostSheetUpdate
  >({
    endpoint: `/programs/plans/activity-cost-sheets/${id}/`,
    queryKey: ["activity-cost-sheets", "activity-cost-sheet"],
    isAuth: true,
    method: "PUT",
  });

  const editCostSheet = async (details: TActivityCostSheetUpdate) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Activity cost sheet edit error:", error);
      throw error;
    }
  };

  return { editCostSheet, data, isLoading, isSuccess, error };
};

/**
 * Delete activity cost sheet
 */
export const useDeleteActivityCostSheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TActivityCostSheet,
    Error,
    Record<string, never>
  >({
    endpoint: `/programs/plans/activity-cost-sheets/${id}/`,
    queryKey: ["activity-cost-sheets"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCostSheet = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Activity cost sheet delete error:", error);
      throw error;
    }
  };

  return { deleteCostSheet, data, isLoading, isSuccess, error };
};

/**
 * Calculate total cost for an activity's cost sheets
 */
export function calculateActivityCostSheetTotal(costSheets: TActivityCostSheet[]): number {
  return costSheets.reduce((sum, sheet) => sum + sheet.total_cost_ngn, 0);
}

/**
 * Get cost sheet summary for an activity
 */
export function getCostSheetSummary(
  activityId: string,
  activityNumber: string,
  activityName: string,
  budgetTotal: number,
  costSheets: TActivityCostSheet[]
): TActivityCostSheetSummary {
  const costSheetTotal = calculateActivityCostSheetTotal(costSheets);
  const variance = budgetTotal - costSheetTotal;
  const variancePercentage = budgetTotal > 0 ? (variance / budgetTotal) * 100 : 0;
  const hasCostSheet = costSheets.length > 0;

  let validationStatus: 'VALIDATED' | 'REVIEW' | 'MISMATCH' | 'MISSING' = 'MISSING';
  if (hasCostSheet) {
    const absVariancePercentage = Math.abs(variancePercentage);
    if (absVariancePercentage < 0.01) {
      validationStatus = 'VALIDATED';
    } else if (absVariancePercentage < 5) {
      validationStatus = 'REVIEW';
    } else {
      validationStatus = 'MISMATCH';
    }
  }

  return {
    activity_id: activityId,
    activity_number: activityNumber,
    activity_name: activityName,
    total_budget_ngn: budgetTotal,
    cost_sheet_total_ngn: costSheetTotal,
    variance_ngn: variance,
    variance_percentage: variancePercentage,
    cost_sheets_count: costSheets.length,
    has_cost_sheet: hasCostSheet,
    validation_status: validationStatus,
  };
}

/**
 * Bulk upload activity cost sheets from Excel file (single activity)
 */
export const useUploadActivityCostSheets = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    FormData
  >({
    endpoint: "programs/plans/activity-cost-sheets/bulk-upload/",
    queryKey: ["activity-cost-sheets"],
    isAuth: true,
    method: "POST",
  });

  const uploadCostSheets = async (details: {
    activity: string;
    file: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append("activity", details.activity);
      formData.append("file", details.file);

      console.log("📤 Uploading cost sheets:", {
        activity: details.activity,
        fileName: details.file.name,
        fileSize: details.file.size,
        fileType: details.file.type,
      });

      await callApi(formData);
    } catch (error) {
      console.error("Cost sheet upload error:", error);
      throw error;
    }
  };

  return { uploadCostSheets, data, isLoading, isSuccess, error };
};

/**
 * Bulk upload cost sheets for entire work plan (multiple activities)
 */
export const useUploadWorkPlanCostSheets = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    FormData
  >({
    endpoint: "programs/plans/activity-cost-sheets/bulk-upload-workplan/",
    queryKey: ["activity-cost-sheets"],
    isAuth: true,
    method: "POST",
  });

  const uploadWorkPlanCostSheets = async (details: {
    work_plan: string;
    file: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append("work_plan", details.work_plan);
      formData.append("file", details.file);

      console.log("📤 Uploading work plan cost sheets:", {
        work_plan: details.work_plan,
        fileName: details.file.name,
        fileSize: details.file.size,
        fileType: details.file.type,
      });

      await callApi(formData);
    } catch (error) {
      console.error("Work plan cost sheet upload error:", error);
      throw error;
    }
  };

  return { uploadWorkPlanCostSheets, data, isLoading, isSuccess, error };
};

// Mutation aliases for consistency
export const useCreateActivityCostSheetMutation = useCreateActivityCostSheet;
export const useEditActivityCostSheetMutation = useEditActivityCostSheet;
export const useDeleteActivityCostSheetMutation = useDeleteActivityCostSheet;
export const useUploadActivityCostSheetsMutation = useUploadActivityCostSheets;
export const useUploadWorkPlanCostSheetsMutation = useUploadWorkPlanCostSheets;
