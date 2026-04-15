import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ItemData, ItemFormValues } from "../../types/config";
import { FilterParams, TPaginatedResponse, TResponse, ApiResponse } from "../../types";

// Extended filter params to support category name filtering
interface ExtendedFilterParams extends FilterParams {
  category__name?: string;
  expand?: string;
  enabled?: boolean;
  _timestamp?: number; // For cache busting
  parent_category?: string; // Filter by parent category name (e.g., "Consumables")
  parent_category_id?: string; // Filter by parent category UUID
}

// GET Operations (Queries)
export const useGetAllItemsManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
  category,
  category__job_category,
  category__name,
  expand,
  _timestamp,
  parent_category,
  parent_category_id,
}: ExtendedFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<ItemData>>>({
    queryKey: ["items", page, size, search, category, category__job_category, category__name, expand, _timestamp, parent_category, parent_category_id],
    queryFn: async () => {
      console.log("🔍 ITEMS API - RECEIVED PARAMS:", {
        page,
        size,
        search,
        searchType: typeof search,
        searchLength: search?.length,
        category,
        category__name,
      });

      const params = {
        page,
        size,
        search,
        category,
        category__job_category,
        ...(category__name && { category__name }),
        ...(expand && { expand }),
        ...(parent_category && { parent_category }),
        ...(parent_category_id && { parent_category_id }),
      };

      console.log("🔍 ITEMS API - FINAL PARAMS OBJECT:", params);
      console.log("🔍 ITEMS API - AXIOS REQUEST URL:", "config/items/");
      console.log("🔍 ITEMS API - EXPAND PARAM:", expand);

      const response = await AxiosWithToken.get("config/items/", {
        params,
      });

      console.log("🔍 ITEMS API - RESPONSE:", {
        count: response.data?.data?.pagination?.count || response.data?.data?.count,
        resultsLength: response.data?.data?.results?.length,
      });

      // Debug first item to check store_stocks structure
      if (response.data?.data?.results && response.data.data.results.length > 0) {
        const firstItem = response.data.data.results[0];
        console.log("🔍 ITEMS API - FIRST ITEM FROM BACKEND:", {
          name: firstItem.name,
          store_stocks: firstItem.store_stocks,
          store_stocks_type: typeof firstItem.store_stocks,
          has_store_stocks: !!firstItem.store_stocks,
        });
      }

      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 0, // Data is immediately stale
    cacheTime: 0, // Don't cache results
  });
};

// GET Single Item
export const useGetSingleItemManager = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<ItemData>>({
    queryKey: ["item", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`config/items/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateItemManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ItemData,
    Error,
    ItemFormValues
  >({
    endpoint: "config/items/",
    queryKey: ["items"],
    isAuth: true,
    method: "POST",
  });

  const createItem = async (details: ItemFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Item creation error:", error);
    }
  };

  return { createItem, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateItemManager = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ItemData,
    Error,
    ItemFormValues
  >({
    endpoint: `/config/items/${id}/`,
    queryKey: ["items", "item"],
    isAuth: true,
    method: "PATCH",
  });

  const updateItem = async (details: ItemFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Item update error:", error);
      throw error;
    }
  };

  return { updateItem, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteItemManager = () => {
  const { isLoading, isSuccess, error, data } = useApiManager<
    ItemData,
    Error,
    Record<string, never>
  >({
    endpoint: "config/items/",
    queryKey: ["items", "item"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteItem = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`config/items/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Item delete error:", error);
      throw error;
    }
  };

  return { deleteItem, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllItemsQuery = useGetAllItemsManager;
export const useGetAllItems = useGetAllItemsManager;
export const useGetSingleItemQuery = useGetSingleItemManager;

export const useAddItemMutation = () => {
  const { createItem, data, isLoading, isSuccess, error } = CreateItemManager();
  return [createItem, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateItemMutation = () => {
  // Use AxiosWithToken directly instead of UpdateItemManager
  // because UpdateItemManager requires ID upfront
  const updateItem = async (params: { id: string; body: ItemFormValues }) => {
    try {
      const response = await AxiosWithToken.patch(`config/items/${params.id}/`, params.body);
      return response.data;
    } catch (error) {
      console.error("Item update error:", error);
      throw error;
    }
  };

  return [updateItem, { data: undefined, isLoading: false, isSuccess: false, error: undefined }] as const;
};

export const useDeleteItemMutation = () => {
  const { deleteItem, data, isLoading, isSuccess, error } = DeleteItemManager();
  return [deleteItem, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteItem = () => {
  const { deleteItem, data, isLoading, isSuccess, error } = DeleteItemManager();
  return [deleteItem, { data, isLoading, isSuccess, error }] as const;
};

// Bulk Upload Operations
export const useBulkUploadItems = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    FormData
  >({
    endpoint: "config/items/bulk-upload/",
    queryKey: ["items"],
    isAuth: true,
    method: "POST",
    contentType: null, // Let browser set correct multipart/form-data boundary
  });

  const bulkUploadItems = async (file: File) => {
    try {
      console.log('🚀 Bulk upload starting for file:', file.name, file.size, 'bytes');
      const formData = new FormData();
      formData.append("file", file);
      // Category is now included in the CSV file, not sent separately
      const result = await callApi(formData);
      console.log('✅ Bulk upload API response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("❌ Bulk upload error:", error);
      throw error;
    }
  };

  return { bulkUploadItems, data, isLoading, isSuccess, error };
};

// Extended filter params for consumables endpoint
interface ConsumablesFilterParams extends ExtendedFilterParams {
  location?: string;
  stock_status?: string;
}

// GET Consumables with location-aware filtering
export const useGetConsumablesQuery = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
  expand,
  category,
  location,
  stock_status,
}: ConsumablesFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<ItemData>>>({
    queryKey: ["consumables", page, size, search, expand, category, location, stock_status],
    queryFn: async () => {
      const params = {
        page,
        size,
        search,
        ...(expand && { expand }),
        ...(category && { category }),
        ...(location && { location }),
        ...(stock_status && { stock_status }),
      };

      const response = await AxiosWithToken.get("config/items/consumables/", {
        params,
      });

      // Remote API returns triple-nested structure: response.data.data.data
      // Unwrap to match expected format: { data: { results, pagination } }
      const actualData = response.data?.data?.data;

      return {
        status: true,
        message: "Consumables retrieved successfully",
        data: actualData
      };
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Additional missing exports
export const useGetSingleItem = useGetSingleItemManager;
export const useAddItem = CreateItemManager;
export const useUpdateItem = UpdateItemManager;
