import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { LotsSchema } from "definations/procurement-validator";
import {
  LotsData,
  LotsResponse,
  LotsResultsData,
} from "../types/lots";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/lots/";

// ===== LOTS HOOKS =====

// Get All Lots
export const useGetAllLots = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<LotsData>>({
    queryKey: ["lots", page, size, search, status],
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

// Get Lot List (for dropdown/selection)
export const useGetLotList = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery<LotsResultsData[]>({
    queryKey: ["lot-list"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
        return response.data.results || response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Lot
export const useGetSingleLot = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<LotsResultsData>>({
    queryKey: ["lot", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Create Lot
export const useCreateLot = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LotsResponse,
    Error,
    z.infer<typeof LotsSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["lots"],
    isAuth: true,
    method: "POST",
  });

  const createLot = async (details: z.infer<typeof LotsSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Lot create error:", error);
    }
  };

  return { createLot, data, isLoading, isSuccess, error };
};

// Update Lot (Full Update)
export const useUpdateLot = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LotsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["lots", "lot"],
    isAuth: true,
    method: "PUT",
  });

  const updateLot = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Lot update error:", error);
    }
  };

  return { updateLot, data, isLoading, isSuccess, error };
};

// Modify Lot (Partial Update)
export const useModifyLot = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LotsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["lots", "lot"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyLot = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Lot modify error:", error);
    }
  };

  return { modifyLot, data, isLoading, isSuccess, error };
};

// Delete Lot
export const useDeleteLot = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["lots"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLot = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Lot delete error:", error);
    }
  };

  return { deleteLot, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetLotsQuery = useGetAllLots;
export const useGetLotListQuery = useGetLotList;
export const useGetLotQuery = useGetSingleLot;
export const useCreateLotMutation = useCreateLot;
export const useUpdateLotMutation = useUpdateLot;
export const useModifyLotMutation = useModifyLot;
export const useDeleteLotMutation = useDeleteLot;