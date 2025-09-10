import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TFundRequestPaginatedResponse,
  TFundRequestResponseData,
} from "../types/fund-request";
import {
  TFundRequestFormValues,
  TFundRequestWithActivitiesFormValues,
} from "definations/program-validator";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface FundRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  project?: string;
  status?:
    | "PENDING"
    | "REVIEWED"
    | "ADMIN_APPROVED"
    | "MANAGER_APPROVED"
    | "REJECTED";
  month?: string;
  year?: number;
  type?: string;
  enabled?: boolean;
}

const BASE_URL = "/programs/fund-requests/";

// ===== FUND REQUEST HOOKS =====

// Get All Fund Requests (Paginated)
export const useGetAllFundRequests = ({
  page = 1,
  size = 20,
  search = "",
  project,
  status,
  month,
  year,
  type,
  enabled = true,
}: FundRequestFilterParams) => {
  return useQuery<TFundRequestPaginatedResponse>({
    queryKey: [
      "fund-requests",
      page,
      size,
      search,
      project,
      status,
      month,
      year,
      type,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(project && { project }),
            ...(status && { status }),
            ...(month && { month }),
            ...(year && { year }),
            ...(type && { type }),
            ...(search && { search }),
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
    enabled: enabled && (!!project || !!status),
    refetchOnWindowFocus: false,
  });
};

// Get Single Fund Request
export const useGetSingleFundRequest = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<TFundRequestResponseData>>({
    queryKey: ["fund-request", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Get Pending Fund Requests (for project office review)
export const useGetPendingFundRequests = ({
  page = 1,
  size = 20,
  project,
  enabled = true,
}: Omit<FundRequestFilterParams, "status">) => {
  return useGetAllFundRequests({
    page,
    size,
    project,
    status: "PENDING",
    enabled,
  });
};

// Create Fund Request
export const useCreateFundRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    TFundRequestFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "POST",
  });

  const createFundRequest = async (details: TFundRequestFormValues) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Fund request create error:", error);
    }
  };

  return { createFundRequest, data, isLoading, isSuccess, error };
};

// Update Fund Request (Full Update)
export const useUpdateFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    TFundRequestWithActivitiesFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "PUT",
  });

  const updateFundRequest = async (
    details: TFundRequestWithActivitiesFormValues
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        // Handle validation errors (budget exceeded, etc.)
        throw new Error(
          (axiosError.response?.data as any)?.message ||
            "Validation error occurred"
        );
      }
      console.error("Fund request update error:", error);
      throw error;
    }
  };

  return { updateFundRequest, data, isLoading, isSuccess, error };
};

// Partial Update Fund Request (PATCH)
export const usePatchFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Partial<TFundRequestWithActivitiesFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "PATCH",
  });

  const patchFundRequest = async (
    details: Partial<TFundRequestWithActivitiesFormValues>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        // Handle validation errors (budget exceeded, etc.)
        throw new Error(
          (axiosError.response?.data as any)?.message ||
            "Validation error occurred"
        );
      }
      console.error("Fund request patch error:", error);
      throw error;
    }
  };

  return { patchFundRequest, data, isLoading, isSuccess, error };
};

// Specific Budget Update Hook
export const useUpdateFundRequestBudget = (id: string) => {
  const { patchFundRequest, isLoading, isSuccess, error } =
    usePatchFundRequest(id);

  const updateBudget = async (newBudget: string) => {
    await patchFundRequest({ available_balance: newBudget });
  };

  return { updateBudget, isLoading, isSuccess, error };
};

// Delete Fund Request
export const useDeleteFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFundRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Fund request delete error:", error);
    }
  };

  return { deleteFundRequest, data, isLoading, isSuccess, error };
};

// ===== FUND REQUEST APPROVAL HOOKS =====

interface FundRequestApprovalPayload {
  status: string;
  comments?: string;
}

// Review Fund Request (PENDING → REVIEWED)
export const useReviewFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TFundRequestResponseData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["fund-requests", "fund-request"],
    isAuth: true,
    method: "POST",
  });

  const reviewFundRequest = async ({ actionType, formData }) => {
    try {
      await callApi({
        status: actionType,
        comments: formData?.comments,
      } as Record<string, never>);
    } catch (error) {
      console.error("Fund request review error:", error);
      throw error;
    }
  };

  return { reviewFundRequest, data, isLoading, isSuccess, error };
};

// Approve Fund Request (Multi-level approvals)
export const useApproveFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TFundRequestResponseData,
    Error,
    FundRequestApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["fund-requests", "fund-request"],
    isAuth: true,
    method: "POST",
  });

  const approveFundRequest = async (status: string, comments?: string) => {
    try {
      await callApi({ status, ...(comments && { comments }) });
    } catch (error) {
      console.error("Fund request approval error:", error);
      throw error;
    }
  };

  return { approveFundRequest, data, isLoading, isSuccess, error };
};

// Helper hook to get available actions based on current status
export const useFundRequestActions = (currentStatus: string) => {
  const getAvailableActions = () => {
    switch (currentStatus) {
      case "PENDING":
        return [
          {
            action: "LOCATION_REVIEW",
            label: "Location Review",
            requiresStatus: true,
            status: "LOCATION_REVIEWED",
          },
          {
            action: "REJECT",
            label: "Reject",
            requiresStatus: true,
            status: "REJECTED",
          },
        ];

      case "LOCATION_REVIEWED":
        return [
          {
            action: "LOCATION_AUTHORIZE",
            label: "Location Authorize",
            requiresStatus: true,
            status: "LOCATION_AUTHORIZED",
          },
          {
            action: "REJECT",
            label: "Reject",
            requiresStatus: true,
            status: "REJECTED",
          },
        ];

      case "LOCATION_AUTHORIZED":
        return [
          {
            action: "HQ_REVIEW",
            label: "HQ Review",
            requiresStatus: true,
            status: "HQ_REVIEWED",
          },
          {
            action: "REJECT",
            label: "Reject",
            requiresStatus: true,
            status: "REJECTED",
          },
        ];

      case "HQ_REVIEWED":
        return [
          {
            action: "HQ_AUTHORIZE",
            label: "HQ Authorize",
            requiresStatus: true,
            status: "HQ_AUTHORIZED",
          },
          {
            action: "REJECT",
            label: "Reject",
            requiresStatus: true,
            status: "REJECTED",
          },
        ];

      case "HQ_AUTHORIZED":
        return [
          {
            action: "HQ_APPROVE",
            label: "HQ Final Approve",
            requiresStatus: true,
            status: "HQ_APPROVED",
          },
          {
            action: "REJECT",
            label: "Reject",
            requiresStatus: true,
            status: "REJECTED",
          },
        ];

      case "HQ_APPROVED":
        return []; // Final status, no actions

      default:
        return [];
    }
  };

  return { getAvailableActions };
};

// Legacy exports for backward compatibility
export const useGetAllFundRequestsQuery = useGetAllFundRequests;
export const useGetSingleFundRequestQuery = useGetSingleFundRequest;
export const useCreateFundRequestMutation = useCreateFundRequest;
export const useUpdateFundRequestMutation = useUpdateFundRequest;
export const usePatchFundRequestMutation = usePatchFundRequest;
export const useUpdateFundRequestBudgetMutation = useUpdateFundRequestBudget;
export const useDeleteFundRequestMutation = useDeleteFundRequest;
