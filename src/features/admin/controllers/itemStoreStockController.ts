import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TItemStoreStockFormValues,
  TItemStoreStockData,
  TStockMovementData,
  TStoreStockSummary,
  ItemStoreStockApiResponse,
  ItemStoreStockPaginatedResponse,
  ItemStoreStockFilterParams,
} from "../types/inventory-management/item-store-stock";

const BASE_URL = "/admins/inventory/item-store-stocks/";

// ===== ITEM STORE STOCK HOOKS =====

// Get All Item Store Stocks (Paginated)
export const useGetAllItemStoreStocks = ({
  page = 1,
  size = 20,
  search = "",
  store = "",
  item = "",
  stock_alert,
  enabled = true,
}: ItemStoreStockFilterParams = {}) => {
  return useQuery<ItemStoreStockPaginatedResponse<TItemStoreStockData>>({
    queryKey: ["item-store-stocks", page, size, search, store, item, stock_alert],
    queryFn: async () => {
      try {
        const params: any = { page, size };

        if (search) params.search = search;
        if (store) params.store = store;
        if (item) params.item = item;
        if (stock_alert) params.stock_alert = stock_alert;

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

// Get Item Stock Across All Stores
export const useGetItemStocksByItem = (
  itemId: string,
  enabled: boolean = true
) => {
  return useQuery<ItemStoreStockPaginatedResponse<TItemStoreStockData>>({
    queryKey: ["item-stocks-by-item", itemId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            item: itemId,
            size: 1000, // Get all stores for this item
            expand: "store,store.location",
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
    enabled: enabled && !!itemId,
    refetchOnWindowFocus: false,
  });
};

// Get Store Inventory (All Items in a Store)
export const useGetStoreInventory = (
  storeId: string,
  enabled: boolean = true
) => {
  return useQuery<ItemStoreStockPaginatedResponse<TItemStoreStockData>>({
    queryKey: ["store-inventory", storeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            store: storeId,
            size: 1000, // Get all items in this store
            expand: "item,item.category",
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
    enabled: enabled && !!storeId,
    refetchOnWindowFocus: false,
  });
};

// Get Single Item Store Stock
export const useGetSingleItemStoreStock = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ItemStoreStockApiResponse<TItemStoreStockData>>({
    queryKey: ["item-store-stock", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`, {
          params: {
            expand: "item,item.category,store,store.location,store.store_keeper",
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

// Get Low Stock Items by Store
export const useGetLowStockItems = (
  storeId?: string,
  enabled: boolean = true
) => {
  return useQuery<ItemStoreStockPaginatedResponse<TItemStoreStockData>>({
    queryKey: ["low-stock-items", storeId],
    queryFn: async () => {
      try {
        const params: any = {
          stock_alert: "LOW,CRITICAL,OUT_OF_STOCK",
          size: 1000,
          expand: "item,store",
        };

        if (storeId) params.store = storeId;

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

// Get Store Stock Summary
export const useGetStoreStockSummary = (
  storeId: string,
  enabled: boolean = true
) => {
  return useQuery<ItemStoreStockApiResponse<TStoreStockSummary>>({
    queryKey: ["store-stock-summary", storeId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}summary/`,
          {
            params: { store: storeId },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!storeId,
    refetchOnWindowFocus: false,
  });
};

// Get Stock Movement History
export const useGetStockMovementHistory = (
  itemStoreStockId: string,
  enabled: boolean = true
) => {
  return useQuery<ItemStoreStockPaginatedResponse<TStockMovementData>>({
    queryKey: ["stock-movement-history", itemStoreStockId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${itemStoreStockId}/movements/`,
          {
            params: {
              size: 100, // Last 100 movements
            },
          }
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!itemStoreStockId,
    refetchOnWindowFocus: false,
  });
};

// Create Item Store Stock (Manual Stock Entry)
export const useCreateItemStoreStock = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemStoreStockData,
    Error,
    TItemStoreStockFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["item-store-stocks"],
    isAuth: true,
    method: "POST",
  });

  const createItemStoreStock = async (details: TItemStoreStockFormValues) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Item store stock create error:", error);
      throw error;
    }
  };

  return { createItemStoreStock, data, isLoading, isSuccess, error };
};

// Update Item Store Stock
export const useUpdateItemStoreStock = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemStoreStockData,
    Error,
    Partial<TItemStoreStockFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["item-store-stocks", "item-store-stock"],
    isAuth: true,
    method: "PATCH",
  });

  const updateItemStoreStock = async (
    details: Partial<TItemStoreStockFormValues>
  ) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Item store stock update error:", error);
      throw error;
    }
  };

  return { updateItemStoreStock, data, isLoading, isSuccess, error };
};

// Adjust Stock (Manual Adjustment)
export const useAdjustStock = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemStoreStockData,
    Error,
    { quantity_adjustment: number; remark: string }
  >({
    endpoint: `${BASE_URL}${id}/adjust/`,
    queryKey: ["item-store-stocks"],
    isAuth: true,
    method: "POST",
  });

  const adjustStock = async (quantityAdjustment: number, remark: string) => {
    try {
      const result = await callApi({
        quantity_adjustment: quantityAdjustment,
        remark,
      });
      return result;
    } catch (error) {
      console.error("Stock adjustment error:", error);
      throw error;
    }
  };

  return { adjustStock, data, isLoading, isSuccess, error };
};

// Delete Item Store Stock
export const useDeleteItemStoreStock = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TItemStoreStockData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["item-store-stocks"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteItemStoreStock = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Item store stock delete error:", error);
      throw error;
    }
  };

  return { deleteItemStoreStock, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllItemStoreStocksQuery = useGetAllItemStoreStocks;
export const useGetItemStocksByItemQuery = useGetItemStocksByItem;
export const useGetStoreInventoryQuery = useGetStoreInventory;
export const useGetSingleItemStoreStockQuery = useGetSingleItemStoreStock;
export const useGetLowStockItemsQuery = useGetLowStockItems;
export const useGetStoreStockSummaryQuery = useGetStoreStockSummary;
export const useGetStockMovementHistoryQuery = useGetStockMovementHistory;
export const useCreateItemStoreStockMutation = useCreateItemStoreStock;
export const useUpdateItemStoreStockMutation = useUpdateItemStoreStock;
export const useAdjustStockMutation = useAdjustStock;
export const useDeleteItemStoreStockMutation = useDeleteItemStoreStock;
