import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { EmployeeOnboardingQualifications } from "../types/employee-onboarding";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface EmployeeOnboardingQualificationsFilterParams {
  status?: string;
  search?: string;
  employee?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/employees/qualifications/";

// ===== EMPLOYEE ONBOARDING QUALIFICATIONS HOOKS =====

// Get Employee Onboarding Qualifications List
export const useGetEmployeeOnboardingQualificationsList = ({
  status = "",
  search = "",
  employee = "",
  page = 1,
  size = 20,
  enabled = true,
}: EmployeeOnboardingQualificationsFilterParams = {}) => {
  return useQuery<ApiResponse<{ results: EmployeeOnboardingQualifications[] }>>({
    queryKey: ["employee-onboarding-qualifications-list", status, search, employee, page, size],
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

// Get Single Employee Onboarding Qualifications
export const useGetEmployeeOnboardingQualifications = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<EmployeeOnboardingQualifications>>({
    queryKey: ["employee-onboarding-qualifications", id],
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

// Create Employee Onboarding Qualifications
export const useCreateEmployeeOnboardingQualifications = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboardingQualifications,
    Error,
    Partial<EmployeeOnboardingQualifications>
  >({
    endpoint: BASE_URL,
    queryKey: ["employee-onboarding-qualifications-list"],
    isAuth: true,
    method: "POST",
  });

  const createEmployeeOnboardingQualifications = async (details: Partial<EmployeeOnboardingQualifications>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Employee onboarding qualifications create error:", error);
      throw error; // Re-throw so calling code can handle the error
    }
  };

  return { createEmployeeOnboardingQualifications, data, isLoading, isSuccess, error };
};

// Update Employee Onboarding Qualifications
export const useUpdateEmployeeOnboardingQualifications = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboardingQualifications,
    Error,
    Partial<EmployeeOnboardingQualifications>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-qualifications-list", "employee-onboarding-qualifications"],
    isAuth: true,
    method: "PUT",
  });

  const updateEmployeeOnboardingQualifications = async (details: Partial<EmployeeOnboardingQualifications>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding qualifications update error:", error);
    }
  };

  return { updateEmployeeOnboardingQualifications, data, isLoading, isSuccess, error };
};

// Patch Employee Onboarding Qualifications
export const usePatchEmployeeOnboardingQualifications = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboardingQualifications,
    Error,
    Partial<EmployeeOnboardingQualifications>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-qualifications-list", "employee-onboarding-qualifications"],
    isAuth: true,
    method: "PATCH",
  });

  const patchEmployeeOnboardingQualifications = async (details: Partial<EmployeeOnboardingQualifications>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding qualifications patch error:", error);
    }
  };

  return { patchEmployeeOnboardingQualifications, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateEmployeeOnboardingQualificationsMutation = useCreateEmployeeOnboardingQualifications;
export const useGetEmployeeOnboardingQualificationsQuery = useGetEmployeeOnboardingQualifications;
export const useGetEmployeeOnboardingQualificationsListQuery = useGetEmployeeOnboardingQualificationsList;
export const usePatchEmployeeOnboardingQualificationsMutation = usePatchEmployeeOnboardingQualifications;
export const useUpdateEmployeeOnboardingQualificationsMutation = useUpdateEmployeeOnboardingQualifications;