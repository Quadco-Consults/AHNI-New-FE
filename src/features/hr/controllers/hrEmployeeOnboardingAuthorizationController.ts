import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { HrSystemAuthorization } from "../types/employee-onboarding";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface SystemAuthorizationFilterParams {
  employee?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/employees/system-authorization/";

// ===== SYSTEM AUTHORIZATION HOOKS =====

// Get System Authorization List
export const useGetSystemAuthorizationList = ({
  employee = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: SystemAuthorizationFilterParams = {}) => {
  return useQuery<ApiResponse<{ results: HrSystemAuthorization[] }>>({
    queryKey: ["system-authorization-list", employee, search, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(employee && { employee }),
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

// Get Single System Authorization
export const useGetSystemAuthorization = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<HrSystemAuthorization>>({
    queryKey: ["system-authorization", id],
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

// Create System Authorization
export const useCreateSystemAuthorization = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrSystemAuthorization,
    Error,
    Partial<HrSystemAuthorization>
  >({
    endpoint: BASE_URL,
    queryKey: ["system-authorization-list"],
    isAuth: true,
    method: "POST",
  });

  const createSystemAuthorization = async (details: Partial<HrSystemAuthorization>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("System authorization create error:", error);
    }
  };

  return { createSystemAuthorization, data, isLoading, isSuccess, error };
};

// Update System Authorization
export const useUpdateSystemAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrSystemAuthorization,
    Error,
    Partial<HrSystemAuthorization>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["system-authorization-list", "system-authorization"],
    isAuth: true,
    method: "PUT",
  });

  const updateSystemAuthorization = async (details: Partial<HrSystemAuthorization>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("System authorization update error:", error);
    }
  };

  return { updateSystemAuthorization, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetSystemAuthorizationListQuery = useGetSystemAuthorizationList;
export const useGetSystemAuthorizationQuery = useGetSystemAuthorization;
export const useCreateSystemAuthorizationMutation = useCreateSystemAuthorization;
export const useUpdateSystemAuthorizationMutation = useUpdateSystemAuthorization;