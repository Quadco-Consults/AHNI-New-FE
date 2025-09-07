import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IFacilityMaintenancePaginatedData,
  IFacilityMaintenanceSingleData,
  TFacilityMaintenanceFormValues,
} from "../types/facility-management/facility-maintenance";

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
interface FacilityMaintenanceFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/facilities/maintenance/tickets/";

// ===== FACILITY MAINTENANCE HOOKS =====

// Get All Facility Maintenance (Paginated)
export const useGetAllFacilityMaintenance = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: FacilityMaintenanceFilterParams) => {
  return useQuery<PaginatedResponse<IFacilityMaintenancePaginatedData>>({
    queryKey: ["facilityMaintenance", page, size, search, status],
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
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Facility Maintenance
export const useGetSingleFacilityMaintenance = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IFacilityMaintenanceSingleData>>({
    queryKey: ["facilityMaintenance", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Facility Maintenance
export const useCreateFacilityMaintenance = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilityMaintenanceSingleData,
    Error,
    TFacilityMaintenanceFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["facilityMaintenance"],
    isAuth: true,
    method: "POST",
  });

  const createFacilityMaintenance = async (
    details: TFacilityMaintenanceFormValues
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facility maintenance create error:", error);
    }
  };

  return { createFacilityMaintenance, data, isLoading, isSuccess, error };
};

// Edit Facility Maintenance (Full Update)
export const useModifyFacilityMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilityMaintenanceSingleData,
    Error,
    TFacilityMaintenanceFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["facilityMaintenance", "facilityMaintenanceItem"],
    isAuth: true,
    method: "PUT",
  });

  const modifyFacilityMaintenance = async (
    details: TFacilityMaintenanceFormValues
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facility maintenance modify error:", error);
    }
  };

  return { modifyFacilityMaintenance, data, isLoading, isSuccess, error };
};

// Delete Facility Maintenance
export const useDeleteFacilityMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilityMaintenanceSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["facilityMaintenance"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFacilityMaintenance = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Facility maintenance delete error:", error);
    }
  };

  return { deleteFacilityMaintenance, data, isLoading, isSuccess, error };
};

// ===== FACILITY MAINTENANCE APPROVAL HOOKS =====

// Review Facility Maintenance
export const useReviewFacilityMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilityMaintenanceSingleData,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["facilityMaintenance", "facilityMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const reviewFacilityMaintenance = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facility maintenance review error:", error);
    }
  };

  return { reviewFacilityMaintenance, data, isLoading, isSuccess, error };
};

// Authorize Facility Maintenance
export const useAuthorizeFacilityMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilityMaintenanceSingleData,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["facilityMaintenance", "facilityMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const authorizeFacilityMaintenance = async (details: {
    comments: string;
  }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facility maintenance authorize error:", error);
    }
  };

  return { authorizeFacilityMaintenance, data, isLoading, isSuccess, error };
};

// Approve Facility Maintenance
export const useApproveFacilityMaintenance = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilityMaintenanceSingleData,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["facilityMaintenance", "facilityMaintenanceItem"],
    isAuth: true,
    method: "POST",
  });

  const approveFacilityMaintenance = async (details: { comments: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facility maintenance approve error:", error);
    }
  };

  return { approveFacilityMaintenance, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllFacilityMaintenanceQuery = useGetAllFacilityMaintenance;
export const useGetSingleFacilityMaintenanceQuery =
  useGetSingleFacilityMaintenance;
export const useCreateFacilityMaintenanceMutation =
  useCreateFacilityMaintenance;
export const useModifyFacilityMaintenanceMutation =
  useModifyFacilityMaintenance;
export const useDeleteFacilityMaintenanceMutation =
  useDeleteFacilityMaintenance;
