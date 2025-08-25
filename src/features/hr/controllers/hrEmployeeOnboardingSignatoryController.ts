import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { EmployeeOnboardingAddSignatory } from "../types/employee-onboarding";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface EmployeeOnboardingSignatoryFilterParams {
  status?: string;
  search?: string;
  employee?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/employees/beneficiaries/signatories/";

// ===== EMPLOYEE ONBOARDING SIGNATORY HOOKS =====

// Get Employee Onboarding Add Signatory
export const useGetEmployeeOnboardingAddSignatory = ({
  status = "",
  search = "",
  employee = "",
  page = 1,
  size = 20,
  enabled = true,
}: EmployeeOnboardingSignatoryFilterParams = {}) => {
  return useQuery<ApiResponse<{ results: EmployeeOnboardingAddSignatory[] }>>({
    queryKey: ["employee-onboarding-signatory", status, search, employee, page, size],
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

// Get Single Employee Onboarding Add Signatory
export const useGetEmployeeOnboardingAddSignatoryQuery = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<EmployeeOnboardingAddSignatory>>({
    queryKey: ["employee-onboarding-signatory-single", id],
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

// Create Employee Onboarding Add Signatory
export const useCreateEmployeeOnboardingAddSignatory = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboardingAddSignatory,
    Error,
    Partial<EmployeeOnboardingAddSignatory>
  >({
    endpoint: BASE_URL,
    queryKey: ["employee-onboarding-signatory"],
    isAuth: true,
    method: "POST",
  });

  const createEmployeeOnboardingAddSignatory = async (details: Partial<EmployeeOnboardingAddSignatory>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding signatory create error:", error);
    }
  };

  return { createEmployeeOnboardingAddSignatory, data, isLoading, isSuccess, error };
};

// Update Employee Onboarding Add Signatory
export const useUpdateEmployeeOnboardingAddSignatory = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboardingAddSignatory,
    Error,
    Partial<EmployeeOnboardingAddSignatory>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-signatory", "employee-onboarding-signatory-single"],
    isAuth: true,
    method: "PUT",
  });

  const updateEmployeeOnboardingAddSignatory = async (details: Partial<EmployeeOnboardingAddSignatory>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding signatory update error:", error);
    }
  };

  return { updateEmployeeOnboardingAddSignatory, data, isLoading, isSuccess, error };
};

// Patch Employee Onboarding Add Signatory
export const usePatchEmployeeOnboardingAddSignatory = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboardingAddSignatory,
    Error,
    Partial<EmployeeOnboardingAddSignatory>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-signatory", "employee-onboarding-signatory-single"],
    isAuth: true,
    method: "PATCH",
  });

  const patchEmployeeOnboardingAddSignatory = async (details: Partial<EmployeeOnboardingAddSignatory>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding signatory patch error:", error);
    }
  };

  return { patchEmployeeOnboardingAddSignatory, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateEmployeeOnboardingAddSignatoryMutation = useCreateEmployeeOnboardingAddSignatory;
export const useGetEmployeeOnboardingAddSignatoryQueryQuery = useGetEmployeeOnboardingAddSignatoryQuery;
export const usePatchEmployeeOnboardingAddSignatoryMutation = usePatchEmployeeOnboardingAddSignatory;
export const useUpdateEmployeeOnboardingAddSignatoryMutation = useUpdateEmployeeOnboardingAddSignatory;