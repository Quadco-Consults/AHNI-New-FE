import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TConsumableFormValues,
  TConsumablePaginatedData,
  TConsumableSingleData,
} from "../types/inventory-management/consumable";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/admins/inventory/consumables/";
const ENHANCED_CONSUMABLES_URL = "/config/items/consumables/";

// ===== CONSUMABLE HOOKS =====

// Enhanced consumables query with store-aware filtering and expansion
export interface EnhancedConsumablesRequest extends TRequest {
  expand?: string; // Expand related fields
  category?: string; // Filter by category ID
  location?: string; // Filter by location ID (HQ users only)
  stock_status?: "OUT_OF_STOCK" | "CRITICAL" | "LOW" | "OK"; // Filter by stock status
  enabled?: boolean;
}

// Get All Enhanced Consumables (with store_stocks expansion)
export const useGetAllEnhancedConsumables = ({
  page = 1,
  size = 20,
  search = "",
  expand = "store_stocks",
  category = "",
  location = "",
  stock_status,
  enabled = true,
}: EnhancedConsumablesRequest) => {
  return useQuery<TPaginatedResponse<TConsumablePaginatedData>>({
    queryKey: ["enhanced-consumables", page, size, search, expand, category, location, stock_status],
    queryFn: async () => {
      try {
        const params: Record<string, any> = {
          page,
          size,
          search,
          expand,
        };

        // Add optional filters
        if (category) params.category = category;
        if (location) params.location = location;
        if (stock_status) params.stock_status = stock_status;

        const response = await AxiosWithToken.get(ENHANCED_CONSUMABLES_URL, { params });
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

// Get All Consumables (Original - for backward compatibility)
export const useGetAllConsumables = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TConsumablePaginatedData>>({
    queryKey: ["consumables", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Single Consumable
export const useGetSingleConsumable = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<TConsumableSingleData>>({
    queryKey: ["consumable", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Get All Consumable Stock Cards (Transaction History Only)
export const useGetAllConsumableStockCards = (
  id: string,
  enabled: boolean = true,
  storeId?: string // Optional: filter by specific store
) => {
  return useQuery<TResponse<any>>({
    queryKey: ["consumable-stock-cards", id, storeId],
    queryFn: async () => {
      try {
        // Get stock movements (transaction history) - this is what a stock card should show
        const params: any = {
          item: id,
          expand: 'item_detail,created_by,updated_by,store_detail,purchase_order',
          ordering: '-created_datetime' // Show latest transactions first
        };

        // Filter by specific store if provided
        if (storeId) {
          params.store = storeId;
        }

        console.log("🔍 Stock Movements API Request:", {
          endpoint: '/stock-movements/',
          params,
          itemId: id,
          storeId: storeId || 'ALL'
        });

        const response = await AxiosWithToken.get(`/stock-movements/`, { params });

        console.log("🔍 Stock Movements API Response:", {
          status: response.status,
          dataStructure: response.data,
          resultsCount: response.data?.data?.data?.results?.length || response.data?.data?.results?.length || 0
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Stock movements API error:", {
          error,
          message: (axiosError.response?.data as any)?.message,
          status: axiosError.response?.status,
          endpoint: `/stock-movements/?item=${id}`
        });
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Consumable
export const useCreateConsumable = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TConsumableSingleData,
    Error,
    TConsumableFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["consumables"],
    isAuth: true,
    method: "POST",
  });

  const createConsumable = async (details: TConsumableFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consumable create error:", error);
    }
  };

  return { createConsumable, data, isLoading, isSuccess, error };
};

// Edit Consumable
export const useEditConsumable = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TConsumableSingleData,
    Error,
    TConsumableFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consumables", "consumable"],
    isAuth: true,
    method: "PUT",
  });

  const editConsumable = async (details: TConsumableFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consumable edit error:", error);
    }
  };

  return { editConsumable, data, isLoading, isSuccess, error };
};

// Delete Consumable
export const useDeleteConsumable = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TConsumableSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["consumables"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteConsumable = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Consumable delete error:", error);
    }
  };

  return { deleteConsumable, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllConsumablesQuery = useGetAllConsumables;
export const useGetAllEnhancedConsumablesQuery = useGetAllEnhancedConsumables;
export const useGetSingleConsumableQuery = useGetSingleConsumable;
export const useGetAllConsumableStockCardsQuery = useGetAllConsumableStockCards;
export const useCreateConsumableMutation = useCreateConsumable;
export const useEditConsumableMutation = useEditConsumable;
export const useDeleteConsumableMutation = useDeleteConsumable;