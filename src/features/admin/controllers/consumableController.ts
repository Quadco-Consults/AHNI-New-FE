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

// ===== CONSUMABLE HOOKS =====

// Get All Consumables
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

// Get All Consumable Stock Cards
export const useGetAllConsumableStockCards = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<any>>({
    queryKey: ["consumable-stock-cards", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/config/items/${id}/stock-cards/`);
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
export const useGetSingleConsumableQuery = useGetSingleConsumable;
export const useGetAllConsumableStockCardsQuery = useGetAllConsumableStockCards;
export const useCreateConsumableMutation = useCreateConsumable;
export const useEditConsumableMutation = useEditConsumable;
export const useDeleteConsumableMutation = useDeleteConsumable;