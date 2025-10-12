import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TStoreFormValues,
  TStorePaginatedData,
  TStoreSingleData,
  StoreApiResponse,
  StorePaginatedResponse,
  StoreFilterParams,
} from "../types/inventory-management/store";

const BASE_URL = "/admins/inventory/stores/";

// ===== STORE HOOKS =====

// Get All Stores (Paginated)
export const useGetAllStores = ({
  page = 1,
  size = 20,
  search = "",
  location = "",
  store_type = "",
  is_active,
  enabled = true,
}: StoreFilterParams = {}) => {
  return useQuery<StorePaginatedResponse<TStorePaginatedData>>({
    queryKey: ["stores", page, size, search, location, store_type, is_active],
    queryFn: async () => {
      try {
        const params: any = {
          page,
          size,
          expand: "location,parent_store,store_keeper" // Request expanded data
        };

        if (search) params.search = search;
        if (location) params.location = location;
        if (store_type) params.store_type = store_type;
        if (is_active !== undefined) params.is_active = is_active;

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

// Get Single Store
export const useGetSingleStore = (id: string, enabled: boolean = true) => {
  return useQuery<StoreApiResponse<TStoreSingleData>>({
    queryKey: ["store", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`, {
          params: {
            expand: "location,parent_store,store_keeper,created_by,updated_by",
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

// Get Stores by Location (for dropdowns)
export const useGetStoresByLocation = (
  locationId: string,
  enabled: boolean = true
) => {
  return useQuery<StorePaginatedResponse<TStorePaginatedData>>({
    queryKey: ["stores-by-location", locationId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            location: locationId,
            is_active: true,
            size: 1000, // Get all active stores for the location
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
    enabled: enabled && !!locationId,
    refetchOnWindowFocus: false,
  });
};

// Get Central Stores Only (for parent store selection)
export const useGetCentralStores = (enabled: boolean = true) => {
  return useQuery<StorePaginatedResponse<TStorePaginatedData>>({
    queryKey: ["central-stores"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            store_type: "CENTRAL",
            is_active: true,
            size: 1000,
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
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Create Store
export const useCreateStore = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TStoreSingleData,
    Error,
    TStoreFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["stores"],
    isAuth: true,
    method: "POST",
  });

  const createStore = async (details: TStoreFormValues) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Store create error:", error);
      throw error;
    }
  };

  return { createStore, data, isLoading, isSuccess, error };
};

// Update Store
export const useUpdateStore = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TStoreSingleData,
    Error,
    TStoreFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stores", "store"],
    isAuth: true,
    method: "PATCH",
  });

  const updateStore = async (details: TStoreFormValues) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Store update error:", error);
      throw error;
    }
  };

  return { updateStore, data, isLoading, isSuccess, error };
};

// Delete Store
export const useDeleteStore = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TStoreSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["stores"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteStore = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Store delete error:", error);
      throw error;
    }
  };

  return { deleteStore, data, isLoading, isSuccess, error };
};

// Activate Store
export const useActivateStore = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TStoreSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/activate/`,
    queryKey: ["stores"],
    isAuth: true,
    method: "POST",
  });

  const activateStore = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Store activate error:", error);
      throw error;
    }
  };

  return { activateStore, data, isLoading, isSuccess, error };
};

// Deactivate Store
export const useDeactivateStore = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TStoreSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/deactivate/`,
    queryKey: ["stores"],
    isAuth: true,
    method: "POST",
  });

  const deactivateStore = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Store deactivate error:", error);
      throw error;
    }
  };

  return { deactivateStore, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllStoresQuery = useGetAllStores;
export const useGetSingleStoreQuery = useGetSingleStore;
export const useCreateStoreMutation = useCreateStore;
export const useUpdateStoreMutation = useUpdateStore;
export const useDeleteStoreMutation = useDeleteStore;
export const useActivateStoreMutation = useActivateStore;
export const useDeactivateStoreMutation = useDeactivateStore;
