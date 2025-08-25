import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { WorkforceBankAccountFormValues } from "../types/hr-validator";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface EmployeeOnboardingBankAccountFilterParams {
  status?: string;
  search?: string;
  employee?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/employees/bank-accounts/";

// ===== EMPLOYEE ONBOARDING BANK ACCOUNT HOOKS =====

// Get Employee Onboarding Bank Account
export const useGetEmployeeOnboardingBankAcct = ({
  status = "",
  search = "",
  employee = "",
  page = 1,
  size = 20,
  enabled = true,
}: EmployeeOnboardingBankAccountFilterParams = {}) => {
  return useQuery<ApiResponse<{ results: WorkforceBankAccountFormValues[] }>>({
    queryKey: ["employee-onboarding-bank-account", status, search, employee, page, size],
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

// Get Single Employee Onboarding Bank Account
export const useGetEmployeeOnboardingBankAcctQuery = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<WorkforceBankAccountFormValues>>({
    queryKey: ["employee-onboarding-bank-account-single", id],
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

// Create Employee Onboarding Bank Account
export const useCreateEmployeeOnboardingBankAcct = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceBankAccountFormValues,
    Error,
    Partial<WorkforceBankAccountFormValues>
  >({
    endpoint: BASE_URL,
    queryKey: ["employee-onboarding-bank-account"],
    isAuth: true,
    method: "POST",
  });

  const createEmployeeOnboardingBankAcct = async (details: Partial<WorkforceBankAccountFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding bank account create error:", error);
    }
  };

  return { createEmployeeOnboardingBankAcct, data, isLoading, isSuccess, error };
};

// Update Employee Onboarding Bank Account
export const useUpdateEmployeeOnboardingBankAcct = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceBankAccountFormValues,
    Error,
    Partial<WorkforceBankAccountFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-bank-account", "employee-onboarding-bank-account-single"],
    isAuth: true,
    method: "PUT",
  });

  const updateEmployeeOnboardingBankAcct = async (details: Partial<WorkforceBankAccountFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding bank account update error:", error);
    }
  };

  return { updateEmployeeOnboardingBankAcct, data, isLoading, isSuccess, error };
};

// Patch Employee Onboarding Bank Account
export const usePatchEmployeeOnboardingBankAcct = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceBankAccountFormValues,
    Error,
    Partial<WorkforceBankAccountFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboarding-bank-account", "employee-onboarding-bank-account-single"],
    isAuth: true,
    method: "PATCH",
  });

  const patchEmployeeOnboardingBankAcct = async (details: Partial<WorkforceBankAccountFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding bank account patch error:", error);
    }
  };

  return { patchEmployeeOnboardingBankAcct, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateEmployeeOnboardingBankAcctMutation = useCreateEmployeeOnboardingBankAcct;
export const useGetEmployeeOnboardingBankAcctQueryQuery = useGetEmployeeOnboardingBankAcctQuery;
export const usePatchEmployeeOnboardingBankAcctMutation = usePatchEmployeeOnboardingBankAcct;
export const useUpdateEmployeeOnboardingBankAcctMutation = useUpdateEmployeeOnboardingBankAcct;