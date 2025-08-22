import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IFuelRequestPaginatedData,
  IFuelRequestSingleData,
  TFuelRequestFormValues,
} from "../types/fleet-management/fuel-request";

// API Response interfaces
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    results: T[];
  };
}

// Filter parameters interface
interface FuelRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  asset?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/fleets/fuel-consumptions/";

// ===== FUEL REQUEST HOOKS =====

// Get All Fuel Requests (Paginated)
export const useGetAllFuelRequests = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  asset = "",
  enabled = true,
}: FuelRequestFilterParams) => {
  return useQuery<PaginatedResponse<IFuelRequestPaginatedData>>({
    queryKey: ["fuelRequests", page, size, search, status, asset],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(asset && { asset }),
          },
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

// Get Single Fuel Request
export const useGetSingleFuelRequest = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IFuelRequestSingleData>>({
    queryKey: ["fuelRequest", id],
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

// Create Fuel Request
export const useCreateFuelRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    TFuelRequestFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["fuelRequests"],
    isAuth: true,
    method: "POST",
  });

  const createFuelRequest = async (details: TFuelRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fuel request create error:", error);
    }
  };

  return { createFuelRequest, data, isLoading, isSuccess, error };
};

// Edit Fuel Request (Full Update)
export const useModifyFuelRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    TFuelRequestFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fuelRequests", "fuelRequest"],
    isAuth: true,
    method: "PUT",
  });

  const modifyFuelRequest = async (details: TFuelRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fuel request modify error:", error);
    }
  };

  return { modifyFuelRequest, data, isLoading, isSuccess, error };
};

// Delete Fuel Request
export const useDeleteFuelRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["fuelRequests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFuelRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Fuel request delete error:", error);
    }
  };

  return { deleteFuelRequest, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllFuelRequestsQuery = useGetAllFuelRequests;
export const useGetSingleFuelRequestQuery = useGetSingleFuelRequest;
export const useCreateFuelRequestMutation = useCreateFuelRequest;
export const useModifyFuelRequestMutation = useModifyFuelRequest;
export const useDeleteFuelRequestMutation = useDeleteFuelRequest;