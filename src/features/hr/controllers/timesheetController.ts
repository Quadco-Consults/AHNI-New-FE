import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import type {
  Timesheet,
  CreateTimesheetRequest,
  UpdateTimesheetRequest,
  SubmitTimesheetRequest,
  ApproveTimesheetRequest,
  RejectTimesheetRequest,
  TimesheetValidationResponse,
  BlockedDatesResponse,
  TimesheetDashboardResponse,
} from "@/features/hr/types/timesheet";

// Backend API base URL (matches backend documentation)
// Note: No leading slash because baseURL already has trailing slash
const BASE_URL = "hr/time-sheet/time-sheet/";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Paginated Response interface
interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    pagination: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next: string | null;
      next_page_number: number | null;
      previous: string | null;
      previous_page_number: number | null;
    };
    results: T[];
  };
}

// Filter parameters interface (matches backend query params)
interface TimesheetFilterParams {
  page?: number;
  page_size?: number;
  employee?: string; // UUID filter
  status?: "draft" | "submitted" | "approved" | "rejected";
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  is_submitted?: boolean;
  is_approved?: boolean;
  approver?: string; // UUID filter
  search?: string; // Search by employee name
  enabled?: boolean;
}

// ===== TIMESHEET HOOKS =====

// Get All Timesheets
export const useGetTimesheets = ({
  page = 1,
  page_size = 20,
  employee,
  status,
  start_date,
  end_date,
  is_submitted,
  is_approved,
  approver,
  search,
  enabled = true,
}: TimesheetFilterParams = {}) => {
  return useQuery<PaginatedResponse<Timesheet>>({
    queryKey: ["timesheets", page, page_size, employee, status, start_date, end_date, is_submitted, is_approved, approver, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            page_size,
            ...(employee && { employee }),
            ...(status && { status }),
            ...(start_date && { start_date }),
            ...(end_date && { end_date }),
            ...(is_submitted !== undefined && { is_submitted }),
            ...(is_approved !== undefined && { is_approved }),
            ...(approver && { approver }),
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

// Get Single Timesheet
export const useGetTimesheetById = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<Timesheet>>({
    queryKey: ["timesheet", id],
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

// Create Timesheet
export const useCreateTimesheet = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<Timesheet>,
    Error,
    CreateTimesheetRequest
  >({
    endpoint: BASE_URL,
    queryKey: ["timesheets"],
    isAuth: true,
    method: "POST",
  });

  const createTimesheet = async (details: CreateTimesheetRequest) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Timesheet create error:", error);
      throw error;
    }
  };

  return { createTimesheet, data, isLoading, isSuccess, error };
};

// Update Timesheet
export const useUpdateTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<Timesheet>,
    Error,
    UpdateTimesheetRequest
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "PATCH",
  });

  const updateTimesheet = async (details: UpdateTimesheetRequest) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Timesheet update error:", error);
      throw error;
    }
  };

  return { updateTimesheet, data, isLoading, isSuccess, error };
};

// Submit Timesheet for Approval
export const useSubmitTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<Timesheet>,
    Error,
    SubmitTimesheetRequest
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "POST",
  });

  const submitTimesheet = async (approver_id?: string) => {
    try {
      await callApi(approver_id ? { approver_id } : {});
    } catch (error) {
      console.error("Timesheet submit error:", error);
      throw error;
    }
  };

  return { submitTimesheet, data, isLoading, isSuccess, error };
};

// Approve Timesheet
export const useApproveTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<Timesheet>,
    Error,
    ApproveTimesheetRequest
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "POST",
  });

  const approveTimesheet = async (comments?: string) => {
    try {
      await callApi(comments ? { comments } : {});
    } catch (error) {
      console.error("Timesheet approve error:", error);
      throw error;
    }
  };

  return { approveTimesheet, data, isLoading, isSuccess, error };
};

// Reject Timesheet
export const useRejectTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<Timesheet>,
    Error,
    RejectTimesheetRequest
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["timesheets", id],
    isAuth: true,
    method: "POST",
  });

  const rejectTimesheet = async (reason: string, comments?: string) => {
    try {
      await callApi({ reason, ...(comments && { comments }) });
    } catch (error) {
      console.error("Timesheet reject error:", error);
      throw error;
    }
  };

  return { rejectTimesheet, data, isLoading, isSuccess, error };
};

// Delete Timesheet
export const useDeleteTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["timesheets"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteTimesheet = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Timesheet delete error:", error);
      throw error;
    }
  };

  return { deleteTimesheet, data, isLoading, isSuccess, error };
};

// Validate Timesheet (before submit)
export const useValidateTimesheet = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TimesheetValidationResponse,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/validate/`,
    queryKey: ["timesheet-validate", id],
    isAuth: true,
    method: "POST",
  });

  const validateTimesheet = async () => {
    try {
      await callApi({} as Record<string, never>);
      return data;
    } catch (error) {
      console.error("Timesheet validation error:", error);
      throw error;
    }
  };

  return { validateTimesheet, data, isLoading, isSuccess, error };
};

// Get Blocked Dates for a Timesheet
export const useGetBlockedDates = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<BlockedDatesResponse>>({
    queryKey: ["timesheet-blocked-dates", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/blocked_dates/`);
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

// Get Timesheet Dashboard
export const useGetTimesheetDashboard = (enabled: boolean = true) => {
  return useQuery<TimesheetDashboardResponse>({
    queryKey: ["timesheet-dashboard"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}dashboard/`);
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

// Legacy exports for backward compatibility
export const useGetTimesheetsQuery = useGetTimesheets;
export const useGetTimesheetQuery = useGetTimesheetById;
export const useCreateTimesheetMutation = useCreateTimesheet;
export const useUpdateTimesheetMutation = useUpdateTimesheet;
export const useSubmitTimesheetMutation = useSubmitTimesheet;
export const useApproveTimesheetMutation = useApproveTimesheet;
export const useRejectTimesheetMutation = useRejectTimesheet;
export const useDeleteTimesheetMutation = useDeleteTimesheet;
