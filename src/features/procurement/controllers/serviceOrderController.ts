import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  IServiceOrderPaginatedData,
  IServiceOrderSingleData,
} from "../types/service-order";
import { TPaginatedResponse, TRequest, TResponse } from "definitions/index";
import { ServiceOrderSchema } from "../types/procurement-validator";

const BASE_URL = "procurements/service-order/";

// ===== SERVICE ORDER HOOKS =====

// Get All Service Orders
export const useGetAllServiceOrders = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IServiceOrderPaginatedData>>({
    queryKey: ["service-orders", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
        });
        return response.data.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError.response?.data as any)?.message;

        // Handle specific backend field error
        if (errorMessage?.includes("Cannot resolve keyword 'vendor_name'")) {
          throw new Error(
            "Backend search configuration error. Please contact the system administrator to fix the vendor search field."
          );
        }

        throw new Error("Sorry: " + errorMessage);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Service Order
export const useGetSingleServiceOrder = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<IServiceOrderSingleData>>({
    queryKey: ["service-order", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Service Order
export const useCreateServiceOrder = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    z.infer<typeof ServiceOrderSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["service-orders"],
    isAuth: true,
    method: "POST",
  });

  const createServiceOrder = async (
    details: z.infer<typeof ServiceOrderSchema>
  ) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Service order create error:", error);
    }
  };

  return { createServiceOrder, data, isLoading, isSuccess, error };
};

// Update Service Order (Full Update)
export const useUpdateServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["service-orders", "service-order"],
    isAuth: true,
    method: "PUT",
  });

  const updateServiceOrder = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Service order update error:", error);
    }
  };

  return { updateServiceOrder, data, isLoading, isSuccess, error };
};

// Modify Service Order (Partial Update)
export const useModifyServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["service-orders", "service-order"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyServiceOrder = async (details: any) => {
    try {
      const response = await callApi(details);
      console.log("✅ Service order modify response:", response);
      return response;
    } catch (error) {
      console.error("❌ Service order modify error:", error);
      throw error;
    }
  };

  return { modifyServiceOrder, data, isLoading, isSuccess, error };
};

// Delete Service Order
export const useDeleteServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["service-orders"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteServiceOrder = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Service order delete error:", error);
    }
  };

  return { deleteServiceOrder, data, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW HOOKS =====

// Review Service Order (First approval step)
export const useReviewServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["service-orders", "service-order"],
    isAuth: true,
    method: "POST",
  });

  const reviewServiceOrder = async () => {
    try {
      const response = await callApi({} as Record<string, never>);
      return response;
    } catch (error) {
      console.error("Service order review error:", error);
      throw error;
    }
  };

  return { reviewServiceOrder, data, isLoading, isSuccess, error };
};

// Authorize Service Order (Second approval step)
export const useAuthorizeServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["service-orders", "service-order"],
    isAuth: true,
    method: "POST",
  });

  const authorizeServiceOrder = async () => {
    try {
      const response = await callApi({} as Record<string, never>);
      return response;
    } catch (error) {
      console.error("Service order authorize error:", error);
      throw error;
    }
  };

  return { authorizeServiceOrder, data, isLoading, isSuccess, error };
};

// Approve Service Order (Third approval step)
export const useApproveServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["service-orders", "service-order"],
    isAuth: true,
    method: "POST",
  });

  const approveServiceOrder = async () => {
    try {
      const response = await callApi({} as Record<string, never>);
      return response;
    } catch (error) {
      console.error("Service order approve error:", error);
      throw error;
    }
  };

  return { approveServiceOrder, data, isLoading, isSuccess, error };
};

// Agree/Accept Service Order (Final step)
export const useAgreeServiceOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IServiceOrderSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/agree/`,
    queryKey: ["service-orders", "service-order"],
    isAuth: true,
    method: "POST",
  });

  const agreeServiceOrder = async () => {
    try {
      const response = await callApi({} as Record<string, never>);
      return response;
    } catch (error) {
      console.error("Service order agree error:", error);
      throw error;
    }
  };

  return { agreeServiceOrder, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllServiceOrdersQuery = useGetAllServiceOrders;
export const useGetSingleServiceOrderQuery = useGetSingleServiceOrder;
export const useCreateServiceOrderMutation = useCreateServiceOrder;
export const useUpdateServiceOrderMutation = useUpdateServiceOrder;
export const useModifyServiceOrderMutation = useModifyServiceOrder;
export const useDeleteServiceOrderMutation = useDeleteServiceOrder;
