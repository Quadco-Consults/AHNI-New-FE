import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IVehicleRequestPaginatedData,
  IVehicleSingleData,
  TVehicleRequestFormValues,
  VehicleRequestApprovalPayload,
} from "../types/fleet-management/vehicle-request";

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
interface VehicleRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/fleets/vehicles/requests/";

// ===== VEHICLE REQUEST HOOKS =====

// Get All Vehicle Request (Paginated)
export const useGetAllVehicleRequest = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: VehicleRequestFilterParams) => {
  return useQuery<PaginatedResponse<IVehicleRequestPaginatedData>>({
    queryKey: ["vehicleRequest", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
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

// Get Single Vehicle Request
export const useGetSingleVehicleRequest = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IVehicleSingleData>>({
    queryKey: ["vehicleRequest", id],
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

// Create Vehicle Request
export const useCreateVehicleRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleSingleData,
    Error,
    TVehicleRequestFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["vehicleRequest"],
    isAuth: true,
    method: "POST",
  });

  const createVehicleRequest = async (details: TVehicleRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle request create error:", error);
    }
  };

  return { createVehicleRequest, data, isLoading, isSuccess, error };
};

// Edit Vehicle Request (Full Update)
export const useEditVehicleRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleSingleData,
    Error,
    TVehicleRequestFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vehicleRequest", "vehicleRequestItem"],
    isAuth: true,
    method: "PUT",
  });

  const editVehicleRequest = async (details: TVehicleRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle request edit error:", error);
    }
  };

  return { editVehicleRequest, data, isLoading, isSuccess, error };
};

// Delete Vehicle Request
export const useDeleteVehicleRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["vehicleRequest"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteVehicleRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Vehicle request delete error:", error);
    }
  };

  return { deleteVehicleRequest, data, isLoading, isSuccess, error };
};

// Approve Vehicle Request
export const useApproveVehicleRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleSingleData,
    Error,
    VehicleRequestApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["vehicleRequest", "vehicleRequestItem"],
    isAuth: true,
    method: "POST",
  });

  const approveVehicleRequest = async (details: VehicleRequestApprovalPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle request approval error:", error);
    }
  };

  return { approveVehicleRequest, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllVehicleRequestQuery = useGetAllVehicleRequest;
export const useGetSingleVehicleRequestQuery = useGetSingleVehicleRequest;
export const useCreateVehicleRequestMutation = useCreateVehicleRequest;
export const useEditVehicleRequestMutation = useEditVehicleRequest;
export const useDeleteVehicleRequestMutation = useDeleteVehicleRequest;
export const useApproveVehicleRequestMutation = useApproveVehicleRequest;