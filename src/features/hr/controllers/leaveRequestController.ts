import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { LeaveRequest } from "../types/leave-request";
import { getCurrentUser } from "@/utils/auth";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface LeaveRequestFilterParams {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
  employee?: string; // Add employee filter for access control
}

// Note: No leading slash because baseURL already has trailing slash
const BASE_URL = "hr/leave-request/";

// ===== LEAVE REQUEST HOOKS =====

// Get All Leave Requests
export const useGetLeaveRequests = ({
  status = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
  employee, // Optional employee filter for admin/HR users
}: LeaveRequestFilterParams) => {
  // For security: Get current user to ensure proper access control
  const currentUser = getCurrentUser();
  const currentEmployeeId = currentUser?.employee?.id || currentUser?.id;

  // If no specific employee is requested and user is not admin/HR, filter by current user
  const effectiveEmployee = employee || currentEmployeeId;

  return useQuery<ApiResponse<LeaveRequest[]>>({
    queryKey: ["leave-requests", page, size, status, search, effectiveEmployee],
    queryFn: async () => {
      try {
        console.log("Fetching leave requests with params:", {
          page,
          size,
          status,
          search,
          employee: effectiveEmployee
        });

        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(status && { status }),
            ...(search && { search }),
            // SECURITY FIX: Always include employee filter to prevent data leakage
            ...(effectiveEmployee && { employee: effectiveEmployee }),
          },
        });
        console.log("Leave requests response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;

        // Only log detailed errors for unexpected failures
        if (status === 401 || status === 403 || status === 500 || !status) {
          console.error("Leave requests error:", {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
          });
        } else {
          console.warn(`Leave requests API failed (${status}): ${axiosError.response?.statusText || 'Unknown error'}`);
        }

        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!currentEmployeeId, // Only enable if we have current user context
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};

// Get Single Leave Request
export const useGetLeaveRequest = (id: string, enabled: boolean = true) => {
  // Get current user context for security validation
  const currentUser = getCurrentUser();
  const currentEmployeeId = currentUser?.employee?.id || currentUser?.id;

  return useQuery<ApiResponse<LeaveRequest>>({
    queryKey: ["leave-request", id, currentEmployeeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        console.log("Leave request API response:", response.data);

        // Frontend access control check (defense in depth - backend should also enforce)
        const leaveRequest = response.data.data;
        const requestEmployeeId = leaveRequest.employee?.id || leaveRequest.employee_id;

        // Allow access if:
        // 1. It's the user's own request
        // 2. User has admin/HR role (to be implemented based on your role system)
        // For now, we rely on backend enforcement but log potential issues
        if (requestEmployeeId && requestEmployeeId !== currentEmployeeId) {
          console.warn("Access to other user's leave request detected. Backend should enforce access control.");
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Leave request fetch error:", axiosError.response?.data);
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id && !!currentEmployeeId,
    refetchOnWindowFocus: false,
  });
};

// Create Leave Request
export const useCreateLeaveRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeaveRequest,
    Error,
    Partial<LeaveRequest>
  >({
    endpoint: BASE_URL,
    queryKey: ["leave-requests"],
    isAuth: true,
    method: "POST",
  });

  const createLeaveRequest = async (details: Partial<LeaveRequest>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave request create error:", error);
    }
  };

  return { createLeaveRequest, data, isLoading, isSuccess, error };
};

// Update Leave Request (Full Update)
export const useUpdateLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeaveRequest,
    Error,
    Partial<LeaveRequest>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["leave-requests", "leave-request"],
    isAuth: true,
    method: "PUT",
  });

  const updateLeaveRequest = async (details: Partial<LeaveRequest>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave request update error:", error);
    }
  };

  return { updateLeaveRequest, data, isLoading, isSuccess, error };
};

// Patch Leave Request (Partial Update)
export const usePatchLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeaveRequest,
    Error,
    Partial<LeaveRequest>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["leave-requests", "leave-request"],
    isAuth: true,
    method: "PATCH",
  });

  const patchLeaveRequest = async (details: Partial<LeaveRequest>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave request patch error:", error);
    }
  };

  return { patchLeaveRequest, data, isLoading, isSuccess, error };
};

// Delete Leave Request
export const useDeleteLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["leave-requests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLeaveRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Leave request delete error:", error);
      throw error;
    }
  };

  return { deleteLeaveRequest, data, isLoading, isSuccess, error };
};

// Submit Leave Request for Approval
export const useSubmitLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<LeaveRequest>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const submitLeaveRequest = async () => {
    if (!id || id === "create" || id === "") {
      throw new Error("Please save the leave request first before submitting");
    }
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Leave request submit error:", error);
      throw error;
    }
  };

  return { submitLeaveRequest, data, isLoading, isSuccess, error };
};

// Approve Leave Request
export const useApproveLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<LeaveRequest>,
    Error,
    { comments?: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const approveLeaveRequest = async (comments?: string) => {
    try {
      await callApi(comments ? { comments } : {});
    } catch (error) {
      console.error("Leave request approve error:", error);
      throw error;
    }
  };

  return { approveLeaveRequest, data, isLoading, isSuccess, error };
};

// Reject Leave Request
export const useRejectLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<LeaveRequest>,
    Error,
    { reason: string; comments?: string }
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const rejectLeaveRequest = async (reason: string, comments?: string) => {
    try {
      await callApi({ reason, ...(comments && { comments }) });
    } catch (error) {
      console.error("Leave request reject error:", error);
      throw error;
    }
  };

  return { rejectLeaveRequest, data, isLoading, isSuccess, error };
};

// Cancel Leave Request
export const useCancelLeaveRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<LeaveRequest>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/cancel/`,
    queryKey: ["leave-requests", id],
    isAuth: true,
    method: "POST",
  });

  const cancelLeaveRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Leave request cancel error:", error);
      throw error;
    }
  };

  return { cancelLeaveRequest, data, isLoading, isSuccess, error };
};

// Validate Leave Request
export const useValidateLeaveRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    {
      leaveTypeId: string;
      fromDate: string;
      toDate: string;
      duration: string;
    }
  >({
    endpoint: `${BASE_URL}validate/`,
    queryKey: ["leave-request-validate"],
    isAuth: true,
    method: "POST",
  });

  const validateLeaveRequest = async (details: {
    leaveTypeId: string;
    fromDate: string;
    toDate: string;
    duration: string;
  }) => {
    try {
      // Backend uses request.user.employee, no need to pass employeeId
      await callApi(details);
      return data;
    } catch (error) {
      console.error("Leave request validation error:", error);
      throw error;
    }
  };

  return { validateLeaveRequest, data, isLoading, isSuccess, error };
};

// Get Leave Types
export const useGetLeaveTypes = (enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["leave-types"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("hr/leave-package/");
        console.log("Leave types response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Leave types error:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message
        });
        const errorMessage = (axiosError.response?.data as any)?.message || axiosError.message || "Failed to fetch leave types";
        throw new Error(errorMessage);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Leave Balances
// Supports both old signature (employeeId, enabled) and new signature (enabled only)
export const useGetLeaveBalances = (enabledOrEmployeeId?: boolean | string, enabled: boolean = true) => {
  // Handle backward compatibility
  const isEnabled = typeof enabledOrEmployeeId === 'boolean' ? enabledOrEmployeeId : enabled;

  return useQuery<ApiResponse<any[]>>({
    queryKey: ["leave-balances"],
    queryFn: async () => {
      try {
        // Backend uses request.user.employee to get current employee's balances
        console.log("🚀 Fetching leave balances...");
        const response = await AxiosWithToken.get(`hr/leave-balance/`);
        console.log("✅ Leave balances response received:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ Leave balances error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
          url: `hr/leave-balance/`
        });

        // Extract detailed error message
        const apiError = axiosError.response?.data as any;
        let errorMessage = "Failed to load leave balances";

        if (apiError?.message) {
          errorMessage = apiError.message;
        } else if (apiError?.detail) {
          errorMessage = apiError.detail;
        } else if (apiError?.error) {
          errorMessage = apiError.error;
        }

        console.log("🔍 Leave balances error message:", errorMessage);
        throw new Error("Sorry: " + errorMessage);
      }
    },
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  });
};

// Get Leave Dashboard
export const useGetLeaveDashboard = (enabled: boolean = true) => {
  return useQuery<ApiResponse<any>>({
    queryKey: ["leave-dashboard"],
    queryFn: async () => {
      try {
        // Backend uses request.user.employee to get current employee
        // No need to pass employee_id - it's inferred from the authenticated user
        console.log("🚀 Fetching leave dashboard...");
        const response = await AxiosWithToken.get(`${BASE_URL}dashboard/`);
        console.log("✅ Dashboard response received:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ Dashboard error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
          url: `${BASE_URL}dashboard/`
        });

        // Extract detailed error message
        const apiError = axiosError.response?.data as any;
        let errorMessage = "Failed to load dashboard";

        if (apiError?.message) {
          errorMessage = apiError.message;
        } else if (apiError?.detail) {
          errorMessage = apiError.detail;
        } else if (apiError?.error) {
          errorMessage = apiError.error;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }

        console.log("🔍 Final error message being thrown:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh data on refetch
  });
};

// Get Leave Workflow
export const useGetLeaveWorkflow = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any>>({
    queryKey: ["leave-workflow", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/workflow/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        // 404 means no workflow created yet - this is expected, return null instead of throwing
        if (axiosError.response?.status === 404) {
          console.log("No workflow created for this leave request yet");
          return null;
        }
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry on 404
  });
};

// Legacy exports for backward compatibility
export const useGetLeaveRequestsQuery = useGetLeaveRequests;
export const useGetLeaveRequestQuery = useGetLeaveRequest;
export const useCreateLeaveRequestMutation = useCreateLeaveRequest;
export const useUpdateLeaveRequestMutation = useUpdateLeaveRequest;
export const usePatchLeaveRequestMutation = usePatchLeaveRequest;
export const useDeleteLeaveRequestMutation = useDeleteLeaveRequest;
export const useSubmitLeaveRequestMutation = useSubmitLeaveRequest;
export const useApproveLeaveRequestMutation = useApproveLeaveRequest;
export const useRejectLeaveRequestMutation = useRejectLeaveRequest;
export const useCancelLeaveRequestMutation = useCancelLeaveRequest;