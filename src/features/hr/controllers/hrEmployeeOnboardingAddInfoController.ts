import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { HrEmergencyResults } from "../types/employee-onboarding";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface HrEmergencyFilterParams {
  employee?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/employees/emergency-contacts/";

// ===== HR EMERGENCY CONTACTS HOOKS =====

// Get HR Emergency List
export const useGetHrEmergencyList = ({
  employee = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: HrEmergencyFilterParams = {}) => {
  return useQuery<ApiResponse<{ results: HrEmergencyResults[] }>>({
    queryKey: ["hr-emergency-list", employee, search, page, size],
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

// Get Single HR Emergency Contact
export const useGetHrEmergency = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<HrEmergencyResults>>({
    queryKey: ["hr-emergency", id],
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

// Create HR Emergency Contact
export const useCreateHrEmergency = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrEmergencyResults,
    Error,
    Partial<HrEmergencyResults>
  >({
    endpoint: BASE_URL,
    queryKey: ["hr-emergency-list"],
    isAuth: true,
    method: "POST",
  });

  const createHrEmergency = async (details: Partial<HrEmergencyResults>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR emergency contact create error:", error);
    }
  };

  return { createHrEmergency, data, isLoading, isSuccess, error };
};

// Update HR Emergency Contact
export const useUpdateHrEmergency = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HrEmergencyResults,
    Error,
    Partial<HrEmergencyResults>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["hr-emergency-list", "hr-emergency"],
    isAuth: true,
    method: "PUT",
  });

  const updateHrEmergency = async (details: Partial<HrEmergencyResults>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR emergency contact update error:", error);
    }
  };

  return { updateHrEmergency, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetHrEmergencyListQuery = useGetHrEmergencyList;
export const useGetHrEmergencyQuery = useGetHrEmergency;
export const useCreateHrEmergencyMutation = useCreateHrEmergency;
export const useUpdateHrEmergencyMutation = useUpdateHrEmergency;