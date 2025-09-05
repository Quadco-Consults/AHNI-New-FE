import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IVehicleMaintenancePaginatedData,
  IVehicleMaintenanceSingleData,
  TVehicleMaintenanceFormValues,
} from "../types/fleet-management/vehicle-maintenance";

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
interface VehicleMaintenanceFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/fleets/vehicles/maintenance/tickets/";

// ===== VEHICLE MAINTENANCE HOOKS =====

// Get All Vehicle Maintenance (Paginated)
export const useGetAllVehicleMaintenance = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: VehicleMaintenanceFilterParams) => {
  return useQuery<PaginatedResponse<IVehicleMaintenancePaginatedData>>({
    queryKey: ["vehicleMaintenance", page, size, search, status],
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

// Get Single Vehicle Maintenance
export const useGetSingleVehicleMaintenance = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IVehicleMaintenanceSingleData>>({
    queryKey: ["vehicleMaintenance", id],
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

// Create Vehicle Maintenance
export const useCreateVehicleMaintenance = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleMaintenanceSingleData,
    Error,
    TVehicleMaintenanceFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["vehicleMaintenance"],
    isAuth: true,
    method: "POST",
  });

  const createVehicleMaintenance = async (details: TVehicleMaintenanceFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle maintenance create error:", error);
    }
  };

  return { createVehicleMaintenance, data, isLoading, isSuccess, error };
};

// Edit Vehicle Maintenance (Full Update)
export const useEditVehicleMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleMaintenanceSingleData,
    Error,
    TVehicleMaintenanceFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vehicleMaintenance", "vehicleMaintenanceItem"],
    isAuth: true,
    method: "PUT",
  });

  const editVehicleMaintenance = async (details: TVehicleMaintenanceFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle maintenance edit error:", error);
    }
  };

  return { editVehicleMaintenance, data, isLoading, isSuccess, error };
};

// Delete Vehicle Maintenance
export const useDeleteVehicleMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleMaintenanceSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vehicleMaintenance"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteVehicleMaintenance = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Vehicle maintenance delete error:", error);
    }
  };

  return { deleteVehicleMaintenance, data, isLoading, isSuccess, error };
};

// Approval interface
interface ApprovalPayload {
  comments: string;
}

// Review Vehicle Maintenance (PENDING → REVIEWED)
export const useReviewVehicleMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleMaintenanceSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["vehicleMaintenance", "vehicleMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const reviewVehicleMaintenance = async (details: ApprovalPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle maintenance review error:", error);
    }
  };

  return { reviewVehicleMaintenance, data, isLoading, isSuccess, error };
};

// Authorize Vehicle Maintenance (REVIEWED → AUTHORIZED)
export const useAuthorizeVehicleMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleMaintenanceSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["vehicleMaintenance", "vehicleMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const authorizeVehicleMaintenance = async (details: ApprovalPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle maintenance authorize error:", error);
    }
  };

  return { authorizeVehicleMaintenance, data, isLoading, isSuccess, error };
};

// Approve Vehicle Maintenance (AUTHORIZED → APPROVED)
export const useApproveVehicleMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IVehicleMaintenanceSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["vehicleMaintenance", "vehicleMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const approveVehicleMaintenance = async (details: ApprovalPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vehicle maintenance approve error:", error);
    }
  };

  return { approveVehicleMaintenance, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllVehicleMaintenanceQuery = useGetAllVehicleMaintenance;
export const useGetSingleVehicleMaintenanceQuery = useGetSingleVehicleMaintenance;
export const useCreateVehicleMaintenanceMutation = useCreateVehicleMaintenance;
export const useEditVehicleMaintenanceMutation = useEditVehicleMaintenance;
export const useDeleteVehicleMaintenanceMutation = useDeleteVehicleMaintenance;