import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

const BASE_URL = "hr/leave-balance/";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Leave Balance interface
export interface LeaveBalance {
  id: string;
  employee: string;
  leave_type: {
    id: string;
    name: string;
  };
  year: number;
  entitled: number;
  used: number;
  pending: number;
  available: number;
  carried_forward: number;
}

// Get all leave balances (for admin)
export const useGetAllLeaveBalances = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}) => {
  return useQuery<ApiResponse<LeaveBalance[]>>({
    queryKey: ["all-leave-balances", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
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

// Get leave balance by employee
export const useGetEmployeeLeaveBalance = (employeeId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<LeaveBalance[]>>({
    queryKey: ["employee-leave-balance", employeeId],
    queryFn: async () => {
      try {
        // Try both employee_id and employee as query params (backend may use either)
        const response = await AxiosWithToken.get(`${BASE_URL}`, {
          params: {
            employee: employeeId,
          }
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching employee leave balance:", error);
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!employeeId,
    refetchOnWindowFocus: false,
  });
};

// Create/Assign Leave Balance
export const useAssignLeaveBalance = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeaveBalance,
    Error,
    {
      employee: string;
      leave_type_id: string;
      year: number;
      entitled: number;
    }
  >({
    endpoint: BASE_URL,
    queryKey: ["all-leave-balances"],
    isAuth: true,
    method: "POST",
  });

  const assignLeaveBalance = async (details: {
    employee: string;
    leave_type: string;
    year: number;
    entitled: number;
  }) => {
    try {
      // Try with leave_type (not leave_type_id) to avoid serializer dotted-source error
      const response = await AxiosWithToken.post(BASE_URL, {
        employee: details.employee,
        leave_type: details.leave_type,
        year: details.year,
        entitled: details.entitled,
      });
      return response.data;
    } catch (error) {
      console.error("Leave balance assign error:", error);
      throw error;
    }
  };

  return { assignLeaveBalance, data, isLoading, isSuccess, error };
};

// Update Leave Balance
export const useUpdateLeaveBalance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LeaveBalance,
    Error,
    {
      entitled?: number;
      carried_forward?: number;
    }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["all-leave-balances", "employee-leave-balance"],
    isAuth: true,
    method: "PATCH",
  });

  const updateLeaveBalance = async (details: {
    entitled?: number;
    carried_forward?: number;
  }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Leave balance update error:", error);
      throw error;
    }
  };

  return { updateLeaveBalance, data, isLoading, isSuccess, error };
};

// Delete Leave Balance
export const useDeleteLeaveBalance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["all-leave-balances"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLeaveBalance = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Leave balance delete error:", error);
      throw error;
    }
  };

  return { deleteLeaveBalance, data, isLoading, isSuccess, error };
};
