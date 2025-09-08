import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TExpenseAuthorizationFormData,
  IExpenseAuthorizationPaginatedData,
  IExpenseAuthorizationSingleData,
} from "../types/expense-authorization";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/admins/authorization/expenses/";

// ===== EXPENSE AUTHORIZATION HOOKS =====

// Get All Expense Authorizations
export const useGetAllExpenseAuthorizations = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IExpenseAuthorizationPaginatedData>>({
    queryKey: ["expense-authorizations", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Expense Authorization
export const useGetSingleExpenseAuthorization = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<IExpenseAuthorizationSingleData>>({
    queryKey: ["expense-authorization", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Expense Authorization
export const useCreateExpenseAuthorization = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    TExpenseAuthorizationFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["expense-authorizations"],
    isAuth: true,
    method: "POST",
  });

  const createExpenseAuthorization = async (
    details: TExpenseAuthorizationFormData
  ) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Expense authorization create error:", error);
    }
  };

  return { createExpenseAuthorization, data, isLoading, isSuccess, error };
};

// Update Expense Authorization
export const useModifyExpenseAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    TExpenseAuthorizationFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["expense-authorizations"],
    isAuth: true,
    method: "PUT",
  });

  const modifyExpenseAuthorization = async (
    details: TExpenseAuthorizationFormData
  ) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Expense authorization update error:", error);
    }
  };

  return { modifyExpenseAuthorization, data, isLoading, isSuccess, error };
};

// Delete Expense Authorization
export const useDeleteExpenseAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["expense-authorizations"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteExpenseAuthorization = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Expense authorization delete error:", error);
    }
  };

  return { deleteExpenseAuthorization, data, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW HOOKS =====

// Review Expense Authorization
export const useReviewExpenseAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["expense-authorization", id],
    isAuth: true,
    method: "POST",
  });

  const reviewExpenseAuthorization = async (comments: string) => {
    try {
      const res = await callApi({ comments });
      return res;
    } catch (error) {
      console.error("Expense authorization review error:", error);
      throw error;
    }
  };

  return { reviewExpenseAuthorization, data, isLoading, isSuccess, error };
};

// Authorize Expense Authorization
export const useAuthorizeExpenseAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["expense-authorization", id],
    isAuth: true,
    method: "POST",
  });

  const authorizeExpenseAuthorization = async (comments: string) => {
    try {
      const res = await callApi({ comments });
      return res;
    } catch (error) {
      console.error("Expense authorization authorize error:", error);
      throw error;
    }
  };

  return { authorizeExpenseAuthorization, data, isLoading, isSuccess, error };
};

// Approve Expense Authorization
export const useApproveExpenseAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["expense-authorization", id],
    isAuth: true,
    method: "POST",
  });

  const approveExpenseAuthorization = async (comments: string) => {
    try {
      const res = await callApi({ comments });
      return res;
    } catch (error) {
      console.error("Expense authorization approve error:", error);
      throw error;
    }
  };

  return { approveExpenseAuthorization, data, isLoading, isSuccess, error };
};

// Security Clearance Expense Authorization
export const useSecurityClearanceExpenseAuthorization = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExpenseAuthorizationSingleData>,
    Error,
    { comments?: string; status: "CLEARED" | "REJECTED" }
  >({
    endpoint: `${BASE_URL}${id}/security-clearance/`,
    queryKey: ["expense-authorization", id],
    isAuth: true,
    method: "POST",
  });

  const securityClearanceExpenseAuthorization = async (status: "CLEARED" | "REJECTED", comments?: string) => {
    try {
      const res = await callApi({ status, comments });
      return res;
    } catch (error) {
      console.error("Expense authorization security clearance error:", error);
      throw error;
    }
  };

  return { securityClearanceExpenseAuthorization, data, isLoading, isSuccess, error };
};

// Maintain legacy exports for backward compatibility
export const useGetAllExpenseAuthorizationsQuery =
  useGetAllExpenseAuthorizations;
export const useGetSingleExpenseAuthorizationQuery =
  useGetSingleExpenseAuthorization;
export const useCreateExpenseAuthorizationMutation =
  useCreateExpenseAuthorization;
export const useModifyExpenseAuthorizationMutation =
  useModifyExpenseAuthorization;
export const useDeleteExpenseAuthorizationMutation =
  useDeleteExpenseAuthorization;
