import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { LeaveRequest } from "../types/leave-request";

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
}: LeaveRequestFilterParams) => {
  return useQuery<ApiResponse<LeaveRequest[]>>({
    queryKey: ["leave-requests", page, size, status, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(status && { status }),
            ...(search && { search }),
          },
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

// Get Single Leave Request
export const useGetLeaveRequest = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<LeaveRequest>>({
    queryKey: ["leave-request", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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
      employeeId: string;
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
    employeeId: string;
    leaveTypeId: string;
    fromDate: string;
    toDate: string;
    duration: string;
  }) => {
    try {
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

// Get Leave Balances
export const useGetLeaveBalances = (employeeId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["leave-balances", employeeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`hr/leave-balance/?employee=${employeeId}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!employeeId,
    refetchOnWindowFocus: false,
  });
};

// Get Leave Dashboard
export const useGetLeaveDashboard = (employeeId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any>>({
    queryKey: ["leave-dashboard", employeeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}dashboard/?employeeId=${employeeId}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!employeeId,
    refetchOnWindowFocus: false,
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
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
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