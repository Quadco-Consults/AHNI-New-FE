import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
// import { PurchaseOrderSchema } from "definations/procurement-validator";
import {
  IPurchaseOrderPaginatedData,
  IPurchaseOrderSingleData,
} from "../types/purchase-order";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { PurchaseOrderSchema } from "../types/procurement-validator";

const BASE_URL = "/procurements/purchase-order/";

// ===== PURCHASE ORDER HOOKS =====

// Get All Purchase Orders
export const useGetAllPurchaseOrders = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IPurchaseOrderPaginatedData>>({
    queryKey: ["purchase-orders", page, size, search, status],
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

// Get Single Purchase Order
export const useGetSinglePurchaseOrder = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<IPurchaseOrderSingleData>>({
    queryKey: ["purchase-order", id],
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

// Create Purchase Order
export const useCreatePurchaseOrder = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPurchaseOrderSingleData,
    Error,
    z.infer<typeof PurchaseOrderSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["purchase-orders"],
    isAuth: true,
    method: "POST",
  });

  const createPurchaseOrder = async (
    details: z.infer<typeof PurchaseOrderSchema>
  ) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Purchase order create error:", error);
    }
  };

  return { createPurchaseOrder, data, isLoading, isSuccess, error };
};

// Update Purchase Order (Full Update)
export const useUpdatePurchaseOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPurchaseOrderSingleData,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["purchase-orders", "purchase-order"],
    isAuth: true,
    method: "PUT",
  });

  const updatePurchaseOrder = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Purchase order update error:", error);
    }
  };

  return { updatePurchaseOrder, data, isLoading, isSuccess, error };
};

// Modify Purchase Order (Partial Update)
export const useModifyPurchaseOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPurchaseOrderSingleData,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["purchase-orders", "purchase-order"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyPurchaseOrder = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Purchase order modify error:", error);
    }
  };

  return { modifyPurchaseOrder, data, isLoading, isSuccess, error };
};

// Delete Purchase Order
export const useDeletePurchaseOrder = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["purchase-orders"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePurchaseOrder = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Purchase order delete error:", error);
    }
  };

  return { deletePurchaseOrder, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllPurchaseOrdersQuery = useGetAllPurchaseOrders;
export const useGetSinglePurchaseOrderQuery = useGetSinglePurchaseOrder;
export const useCreatePurchaseOrderMutation = useCreatePurchaseOrder;
export const useUpdatePurchaseOrderMutation = useUpdatePurchaseOrder;
export const useModifyPurchaseOrderMutation = useModifyPurchaseOrder;
export const useDeletePurchaseOrderMutation = useDeletePurchaseOrder;
