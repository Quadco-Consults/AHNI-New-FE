import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IStoreTransferPaginatedData,
  IStoreTransferSingleData,
  StoreTransferFilterParams,
  StoreTransferPaginatedResponse,
  StoreTransferSingleResponse,
  TStoreTransferFormValues,
} from "../types/inventory-management/store-transfer";

const BASE_URL = "/admins/inventory/store-transfers/";

// ===== STORE TRANSFER HOOKS =====

// Get All Store Transfers (Paginated)
export const useGetAllStoreTransfers = ({
  page = 1,
  size = 20,
  search = "",
  source_store = "",
  destination_store = "",
  status = "",
  created_by = "",
  enabled = true,
}: StoreTransferFilterParams = {}) => {
  return useQuery<StoreTransferPaginatedResponse<IStoreTransferPaginatedData>>({
    queryKey: [
      "store-transfers",
      page,
      size,
      search,
      source_store,
      destination_store,
      status,
      created_by,
    ],
    queryFn: async () => {
      try {
        const params: any = { page, size };

        if (search) params.search = search;
        if (source_store) params.source_store = source_store;
        if (destination_store) params.destination_store = destination_store;
        if (status) params.status = status;
        if (created_by) params.created_by = created_by;

        // Expand store details for better display
        params.expand = "source_store,destination_store,created_by";

        const response = await AxiosWithToken.get(BASE_URL, { params });
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

// Get Single Store Transfer
export const useGetSingleStoreTransfer = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<StoreTransferSingleResponse>({
    queryKey: ["store-transfer", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`, {
          params: {
            expand:
              "source_store,source_store.location,source_store.store_keeper," +
              "destination_store,destination_store.location,destination_store.store_keeper," +
              "items,items.item,items.item.category," +
              "created_by,approved_by,rejected_by,shipped_by,received_by",
          },
        });
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

// Get Transfers by Source Store
export const useGetTransfersBySourceStore = (
  storeId: string,
  enabled: boolean = true
) => {
  return useQuery<StoreTransferPaginatedResponse<IStoreTransferPaginatedData>>({
    queryKey: ["store-transfers-by-source", storeId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(BASE_URL, {
        params: {
          source_store: storeId,
          size: 1000,
          expand: "destination_store",
        },
      });
      return response.data;
    },
    enabled: enabled && !!storeId,
    refetchOnWindowFocus: false,
  });
};

// Get Transfers by Destination Store
export const useGetTransfersByDestinationStore = (
  storeId: string,
  enabled: boolean = true
) => {
  return useQuery<StoreTransferPaginatedResponse<IStoreTransferPaginatedData>>({
    queryKey: ["store-transfers-by-destination", storeId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(BASE_URL, {
        params: {
          destination_store: storeId,
          size: 1000,
          expand: "source_store",
        },
      });
      return response.data;
    },
    enabled: enabled && !!storeId,
    refetchOnWindowFocus: false,
  });
};

// Get Pending Transfers (for approvals)
export const useGetPendingStoreTransfers = (enabled: boolean = true) => {
  return useQuery<StoreTransferPaginatedResponse<IStoreTransferPaginatedData>>({
    queryKey: ["store-transfers-pending"],
    queryFn: async () => {
      const response = await AxiosWithToken.get(BASE_URL, {
        params: {
          status: "pending",
          size: 1000,
          expand: "source_store,destination_store,created_by",
        },
      });
      return response.data;
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Create Store Transfer
export const useCreateStoreTransfer = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    TStoreTransferFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "POST",
  });

  const createStoreTransfer = async (details: TStoreTransferFormValues) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Store transfer create error:", error);
      throw error;
    }
  };

  return { createStoreTransfer, data, isLoading, isSuccess, error };
};

// Update Store Transfer
export const useUpdateStoreTransfer = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    Partial<TStoreTransferFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "PATCH",
  });

  const updateStoreTransfer = async (
    details: Partial<TStoreTransferFormValues>
  ) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Store transfer update error:", error);
      throw error;
    }
  };

  return { updateStoreTransfer, data, isLoading, isSuccess, error };
};

// Delete Store Transfer
export const useDeleteStoreTransfer = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteStoreTransfer = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Store transfer delete error:", error);
      throw error;
    }
  };

  return { deleteStoreTransfer, data, isLoading, isSuccess, error };
};

// Approve Store Transfer
export const useApproveStoreTransfer = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    { comment?: string; approved_quantities?: { item_id: string; quantity: number }[] }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "POST",
  });

  const approveStoreTransfer = async (
    comment?: string,
    approvedQuantities?: { item_id: string; quantity: number }[]
  ) => {
    try {
      const payload: any = {};
      if (comment) payload.comment = comment;
      if (approvedQuantities) payload.approved_quantities = approvedQuantities;

      const result = await callApi(payload);
      return result;
    } catch (error) {
      console.error("Store transfer approve error:", error);
      throw error;
    }
  };

  return { approveStoreTransfer, data, isLoading, isSuccess, error };
};

// Reject Store Transfer
export const useRejectStoreTransfer = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    { rejection_reason: string }
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "POST",
  });

  const rejectStoreTransfer = async (rejectionReason: string) => {
    try {
      const result = await callApi({ rejection_reason: rejectionReason });
      return result;
    } catch (error) {
      console.error("Store transfer reject error:", error);
      throw error;
    }
  };

  return { rejectStoreTransfer, data, isLoading, isSuccess, error };
};

// Mark as Shipped
export const useMarkStoreTransferAsShipped = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    { comment?: string; shipped_quantities?: { item_id: string; quantity: number }[] }
  >({
    endpoint: `${BASE_URL}${id}/mark-shipped/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "POST",
  });

  const markAsShipped = async (
    comment?: string,
    shippedQuantities?: { item_id: string; quantity: number }[]
  ) => {
    try {
      const payload: any = {};
      if (comment) payload.comment = comment;
      if (shippedQuantities) payload.shipped_quantities = shippedQuantities;

      const result = await callApi(payload);
      return result;
    } catch (error) {
      console.error("Store transfer mark shipped error:", error);
      throw error;
    }
  };

  return { markAsShipped, data, isLoading, isSuccess, error };
};

// Mark as Received
export const useMarkStoreTransferAsReceived = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    { comment?: string; received_quantities?: { item_id: string; quantity: number }[] }
  >({
    endpoint: `${BASE_URL}${id}/mark-received/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "POST",
  });

  const markAsReceived = async (
    comment?: string,
    receivedQuantities?: { item_id: string; quantity: number }[]
  ) => {
    try {
      const payload: any = {};
      if (comment) payload.comment = comment;
      if (receivedQuantities) payload.received_quantities = receivedQuantities;

      const result = await callApi(payload);
      return result;
    } catch (error) {
      console.error("Store transfer mark received error:", error);
      throw error;
    }
  };

  return { markAsReceived, data, isLoading, isSuccess, error };
};

// Cancel Store Transfer
export const useCancelStoreTransfer = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IStoreTransferSingleData,
    Error,
    { cancellation_reason: string }
  >({
    endpoint: `${BASE_URL}${id}/cancel/`,
    queryKey: ["store-transfers"],
    isAuth: true,
    method: "POST",
  });

  const cancelStoreTransfer = async (cancellationReason: string) => {
    try {
      const result = await callApi({ cancellation_reason: cancellationReason });
      return result;
    } catch (error) {
      console.error("Store transfer cancel error:", error);
      throw error;
    }
  };

  return { cancelStoreTransfer, data, isLoading, isSuccess, error };
};
