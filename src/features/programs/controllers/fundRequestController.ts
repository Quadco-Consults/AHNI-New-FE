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
  TFundRequestBackendPayload,
  transformFormDataToBackendPayload,
} from "definations/program-validator";
import { handleApiError, createErrorContext } from "@/utils/errorHandlers";

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

// ===== UNIQUE IDENTIFIER SEQUENCE HOOKS =====

// Get Next Sequence Number for Fund Request Identifier
export const useGetNextSequenceNumber = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { next_sequence: number },
    Error,
    {
      project_id: string;
      location_code: string;
      year: number;
      month: number;
    }
  >({
    endpoint: `${BASE_URL}next-sequence/`,
    queryKey: ["fund-requests", "next-sequence"],
    isAuth: true,
    method: "POST",
  });

  const getNextSequence = async (
    projectId: string,
    locationCode: string,
    year: number,
    month: number
  ) => {
    try {
      const response = await callApi({
        project_id: projectId,
        location_code: locationCode,
        year,
        month,
      });
      return response?.data?.next_sequence || 1;
    } catch (error) {
      console.error("Get next sequence error:", error);
      // Fallback to 1 if API call fails
      return 1;
    }
  };

  return { getNextSequence, data, isLoading, isSuccess, error };
};

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
    retry: 3, // Better retry count for network resilience
    staleTime: 30000, // 30 seconds - reasonable for dashboard data
    cacheTime: 300000, // 5 minutes cache for better UX
    queryFn: async () => {
      try {
        // Build params object, excluding undefined/empty values
        const params: Record<string, any> = {
          page,
          size,
        };

        if (project) params.project = project;
        if (status) params.status = status;
        if (month) params.month = month;
        if (year) params.year = year;
        if (type) params.type = type;
        if (search) params.search = search;

        const response = await AxiosWithToken.get(BASE_URL, { params });
        return response.data;
      } catch (error) {
        const axiosError = error as any;

        // Log only for non-permission errors for debugging backend fixes
        if (axiosError.response?.status !== 403) {
          console.group("🔍 Fund Request API Debug");
          console.log("Status:", axiosError.response?.status);
          console.log("URL:", axiosError.config?.url);
          console.log("Response:", axiosError.response?.data);
          console.groupEnd();
        }

        // Show different messages based on actual status
        if (axiosError.response?.status === 401) {
          throw new Error("Authentication required - please log in again");
        } else if (axiosError.response?.status === 403) {
          throw new Error("Access denied - insufficient permissions");
        } else if (axiosError.response?.status === 500) {
          throw new Error("Server error (500) - backend issue");
        } else {
          throw new Error(`API Error (${axiosError.response?.status || 'unknown'}): ${axiosError.message}`);
        }
      }
    },
    enabled: enabled,
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
    TFundRequestBackendPayload
  >({
    endpoint: BASE_URL,
    queryKey: ["fund-requests"],
    isAuth: true,
    method: "POST",
  });

  const createFundRequest = async (details: TFundRequestFormValues & { activities: any[] }) => {
    try {
      // Transform form data to backend payload format
      const backendPayload = transformFormDataToBackendPayload(details);
      console.log("Transformed payload for backend:", backendPayload);

      const res = await callApi(backendPayload);
      return res;
    } catch (error) {
      console.error("Fund request create error:", error);
      throw error;
    }
  };

  return { createFundRequest, data, isLoading, isSuccess, error };
};

// Update Fund Request (Full Update)
export const useUpdateFundRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    TFundRequestBackendPayload
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
      // Transform form data to backend payload format
      const backendPayload = transformFormDataToBackendPayload(details);
      console.log("Transformed update payload for backend:", backendPayload);

      await callApi(backendPayload);
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
    Partial<TFundRequestBackendPayload>
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
      // For partial updates, only transform if we have the full data structure
      let payload: Partial<TFundRequestBackendPayload>;

      if (details.activities) {
        // Full transformation needed when activities are involved
        payload = transformFormDataToBackendPayload(details as TFundRequestWithActivitiesFormValues);
      } else {
        // Simple field updates can be passed through
        payload = details as Partial<TFundRequestBackendPayload>;
      }

      console.log("Transformed patch payload for backend:", payload);
      await callApi(payload);
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

  const reviewFundRequest = async ({
    actionType,
    formData
  }: {
    actionType: string;
    formData?: { comments?: string }
  }) => {
    try {
      await callApi({
        status: actionType,
        comments: formData?.comments,
      } as any);
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
// NOTE: HQ-level approvals (HQ_REVIEWED, HQ_AUTHORIZED, HQ_APPROVED) must be done
// through batch approval endpoints, not individual fund request approvals
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
        // When fund request reaches LOCATION_AUTHORIZED, it's automatically added to a batch
        // HQ approvals must be done through batch approval interface
        return []; // No individual actions available, proceed to batch approval

      case "HQ_REVIEWED":
        // HQ approvals are batch-based, no individual actions
        return [];

      case "HQ_AUTHORIZED":
        // HQ approvals are batch-based, no individual actions
        return [];

      case "HQ_APPROVED":
        return []; // Final status, no actions

      case "REJECTED":
        return []; // Rejected, no further actions

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
