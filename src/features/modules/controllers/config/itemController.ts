import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ItemData, ItemFormValues } from "../../types/config";
import { FilterParams, TPaginatedResponse, TResponse, ApiResponse } from "../../types";

// GET Operations (Queries)
export const useGetAllItemsManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
  category,
  category__job_category,
  expand,
}: FilterParams & { enabled?: boolean; expand?: string } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<ItemData>>>({
    queryKey: ["items", page, size, search, category, category__job_category, expand],
    queryFn: async () => {
      const response = await AxiosWithToken.get("config/items/", {
        params: {
          page,
          size,
          search,
          category,
          category__job_category,
          ...(expand && { expand }),
        },
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
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

// Additional missing exports
export const useGetSingleItem = useGetSingleItemManager;
export const useAddItem = CreateItemManager;
export const useUpdateItem = UpdateItemManager;
