import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { WorkforcePensionFormValues } from "../types/hr-validator";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface EmployeeOnboardingPensionFilterParams {
  status?: string;
  search?: string;
  employee?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/employees/pension-funds/";

// ===== EMPLOYEE ONBOARDING PENSION HOOKS =====

// Get Employee Onboarding Pension
export const useGetEmployeeOnboardingPension = ({
  status = "",
  search = "",
  employee = "",
  page = 1,
  size = 20,
  enabled = true,
}: EmployeeOnboardingPensionFilterParams = {}) => {
  return useQuery<ApiResponse<WorkforcePensionFormValues[]>>({
    queryKey: ["employee-onboarding-pension", status, search, employee, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(status && { status }),
            ...(search && { search }),
            ...(employee && { employee }),
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

// Get Single Employee Onboarding Pension
export const useGetEmployeeOnboardingPensionQuery = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<WorkforcePensionFormValues>>({
    queryKey: ["employee-onboarding-pension-single", id],
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

// Create Employee Onboarding Pension
export const useCreateEmployeeOnboardingPension = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforcePensionFormValues,
    Error,
    Partial<WorkforcePensionFormValues>
  >({
    endpoint: BASE_URL,
    queryKey: ["employee-onboarding-pension"],
    isAuth: true,
    method: "POST",
  });

  const createEmployeeOnboardingPension = async (details: Partial<WorkforcePensionFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding pension create error:", error);
    }
  };

  return { createEmployeeOnboardingPension, data, isLoading, isSuccess, error };
};

// Update Employee Onboarding Pension
export const useUpdateEmployeeOnboardingPension = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforcePensionFormValues,
    Error,
    Partial<WorkforcePensionFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-pension", "employee-onboarding-pension-single"],
    isAuth: true,
    method: "PUT",
  });

  const updateEmployeeOnboardingPension = async (details: Partial<WorkforcePensionFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding pension update error:", error);
    }
  };

  return { updateEmployeeOnboardingPension, data, isLoading, isSuccess, error };
};

// Patch Employee Onboarding Pension
export const usePatchEmployeeOnboardingPension = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforcePensionFormValues,
    Error,
    Partial<WorkforcePensionFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-pension", "employee-onboarding-pension-single"],
    isAuth: true,
    method: "PATCH",
  });

  const patchEmployeeOnboardingPension = async (details: Partial<WorkforcePensionFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding pension patch error:", error);
    }
  };

  return { patchEmployeeOnboardingPension, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateEmployeeOnboardingPensionMutation = useCreateEmployeeOnboardingPension;
export const useGetEmployeeOnboardingPensionQueryQuery = useGetEmployeeOnboardingPensionQuery;
export const usePatchEmployeeOnboardingPensionMutation = usePatchEmployeeOnboardingPension;
export const useUpdateEmployeeOnboardingPensionMutation = useUpdateEmployeeOnboardingPension;