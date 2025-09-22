import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { EmployeeOnboarding } from "../types/employee-onboarding";

const BASE_URL = "/hr/employees/";

// ===== EMPLOYEE ONBOARDING HOOKS =====

// Get All Employee Onboardings
export const useGetEmployeeOnboardings = ({
  status = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["employee-onboardings", page, size, status, search],
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

// Get Single Employee Onboarding
export const useGetEmployeeOnboarding = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["employee-onboarding", id],
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

// Get Employee Onboarding by Application ID
export const useGetEmployeeOnboardingByApplication = (applicationId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["employee-onboarding-by-application", applicationId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            application: applicationId,
            page: 1,
            size: 1,
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!applicationId,
    refetchOnWindowFocus: false,
  });
};

// Get Employee Identity Card
export const useGetEmployeeIdentityCard = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["employee-identity-card", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/hr/employees/${id}/identity-card/`);
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

// Create Employee Onboarding
export const useCreateEmployeeOnboarding = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboarding,
    Error,
    Partial<EmployeeOnboarding>
  >({
    endpoint: BASE_URL,
    queryKey: ["employee-onboardings"],
    isAuth: true,
    method: "POST",
  });

  const createEmployeeOnboarding = async (details: Partial<EmployeeOnboarding>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding create error:", error);
    }
  };

  return { createEmployeeOnboarding, data, isLoading, isSuccess, error };
};

// Update Employee Onboarding (Full Update)
export const useUpdateEmployeeOnboarding = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboarding,
    Error,
    Partial<EmployeeOnboarding>
  >({
    endpoint: `${BASE_URL}/`,
    queryKey: ["employee-onboardings", "employee-onboarding"],
    isAuth: true,
    method: "PUT",
  });

  const updateEmployeeOnboarding = async (details: Partial<EmployeeOnboarding>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Employee onboarding update error:", error);
    }
  };

  return { updateEmployeeOnboarding, data, isLoading, isSuccess, error };
};

// Patch Employee Onboarding (Partial Update)
export const usePatchEmployeeOnboarding = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboarding,
    Error,
    Partial<EmployeeOnboarding>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboardings", "employee-onboarding"],
    isAuth: true,
    method: "PATCH",
  });

  const patchEmployeeOnboarding = async (details: Partial<EmployeeOnboarding>) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Employee onboarding patch error:", error);
      throw error; // Re-throw so calling code can handle the error
    }
  };

  return { patchEmployeeOnboarding, data, isLoading, isSuccess, error };
};

// Delete Employee Onboarding
export const useDeleteEmployeeOnboarding = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EmployeeOnboarding,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["employee-onboardings"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteEmployeeOnboarding = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Employee onboarding delete error:", error);
    }
  };

  return { deleteEmployeeOnboarding, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetEmployeeOnboardingsQuery = useGetEmployeeOnboardings;
export const useGetEmployeeOnboardingQuery = useGetEmployeeOnboarding;
export const useGetEmployeeIdentityCardQuery = useGetEmployeeIdentityCard;
export const useCreateEmployeeOnboardingMutation = useCreateEmployeeOnboarding;
export const useUpdateEmployeeOnboardingMutation = useUpdateEmployeeOnboarding;
export const usePatchEmployeeOnboardingMutation = usePatchEmployeeOnboarding;
export const useDeleteEmployeeOnboardingMutation = useDeleteEmployeeOnboarding;