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

const BASE_URL = "/hr/leave-request/";

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

// Legacy exports for backward compatibility
export const useGetLeaveRequestsQuery = useGetLeaveRequests;
export const useGetLeaveRequestQuery = useGetLeaveRequest;
export const useCreateLeaveRequestMutation = useCreateLeaveRequest;
export const useUpdateLeaveRequestMutation = useUpdateLeaveRequest;
export const usePatchLeaveRequestMutation = usePatchLeaveRequest;