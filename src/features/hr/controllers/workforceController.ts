import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  WorkforceBankAccount,
  WorkforcePension,
  WorkforceQualificationResult,
  WorkforceResults,
} from "../types/workforce";
import {
  WorkforceBankAccountFormValues,
  WorkforcePensionFormValues,
} from "../types/hr-validator";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/hr/employees";

// ===== WORKFORCE HOOKS =====

// Get All Workforces
export const useGetWorkforces = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<WorkforceResults[]>>({
    queryKey: ["workforces", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search },
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

// Get Single Workforce
export const useGetWorkforce = (id: string, enabled: boolean = true) => {
  return useQuery<WorkforceResults>({
    queryKey: ["workforce", id],
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

// Get Workforce Qualifications
export const useGetWorkforceQualifications = (id: string, enabled: boolean = true) => {
  return useQuery<WorkforceQualificationResult[]>({
    queryKey: ["workforce-qualifications", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}/qualifications/${id}`);
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

// Get Workforce Pension
export const useGetWorkforcePension = (id: string, enabled: boolean = true) => {
  return useQuery<WorkforcePension>({
    queryKey: ["workforce-pension", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}/pension-funds/${id}`);
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

// Get Workforce Bank Account
export const useGetWorkforceBankAccount = (id: string, enabled: boolean = true) => {
  return useQuery<WorkforceBankAccount>({
    queryKey: ["workforce-bank-account", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}/bank-account/${id}`);
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

// Create Workforce
export const useCreateWorkforce = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceResults,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["workforces"],
    isAuth: true,
    method: "POST",
  });

  const createWorkforce = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce create error:", error);
    }
  };

  return { createWorkforce, data, isLoading, isSuccess, error };
};

// Update Workforce
export const useUpdateWorkforce = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceResults,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["workforces", "workforce"],
    isAuth: true,
    method: "PATCH",
  });

  const updateWorkforce = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce update error:", error);
    }
  };

  return { updateWorkforce, data, isLoading, isSuccess, error };
};

// Update Workforce Additional Info
export const useUpdateWorkforceAdditionalInfo = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceResults,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/additional-info/`,
    queryKey: ["workforces", "workforce"],
    isAuth: true,
    method: "PATCH",
  });

  const updateWorkforceAdditionalInfo = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce additional info update error:", error);
    }
  };

  return { updateWorkforceAdditionalInfo, data, isLoading, isSuccess, error };
};

// Create Workforce Pension
export const useCreateWorkforcePension = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforcePension,
    Error,
    WorkforcePensionFormValues
  >({
    endpoint: `${BASE_URL}/pension-funds/${id}`,
    queryKey: ["workforces", "workforce-pension"],
    isAuth: true,
    method: "POST",
  });

  const createWorkforcePension = async (details: WorkforcePensionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce pension create error:", error);
    }
  };

  return { createWorkforcePension, data, isLoading, isSuccess, error };
};

// Create Workforce Bank Account
export const useCreateWorkforceBankAccount = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforceBankAccount,
    Error,
    WorkforceBankAccountFormValues
  >({
    endpoint: `${BASE_URL}${id}/bank-account/`,
    queryKey: ["workforces", "workforce-bank-account"],
    isAuth: true,
    method: "POST",
  });

  const createWorkforceBankAccount = async (details: WorkforceBankAccountFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce bank account create error:", error);
    }
  };

  return { createWorkforceBankAccount, data, isLoading, isSuccess, error };
};

// Create Workforce Qualification
export const useCreateWorkforceQualification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    WorkforcePension,
    Error,
    FormData
  >({
    endpoint: `${BASE_URL}${id}/qualifications/`,
    queryKey: ["workforces", "workforce-qualifications"],
    isAuth: true,
    method: "POST",
    contentType: null, // For FormData
  });

  const createWorkforceQualification = async (details: FormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Workforce qualification create error:", error);
    }
  };

  return { createWorkforceQualification, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetWorkforcesQuery = useGetWorkforces;
export const useGetWorkforceQuery = useGetWorkforce;
export const useGetWorkforceQualificationsQuery = useGetWorkforceQualifications;
export const useGetWorkforcePensionQuery = useGetWorkforcePension;
export const useGetWorkforceBankAccountQuery = useGetWorkforceBankAccount;
export const useCreateWorkforceMutation = useCreateWorkforce;
export const useUpdateWorkforceMutation = useUpdateWorkforce;
export const useUpdateWorkforceAdditionalInfoMutation = useUpdateWorkforceAdditionalInfo;
export const useCreateWorkforcePensionMutation = useCreateWorkforcePension;
export const useCreateWorkforceBankAccountMutation = useCreateWorkforceBankAccount;
export const useCreateWorkforceQualificationMutation = useCreateWorkforceQualification;