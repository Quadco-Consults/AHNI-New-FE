import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { VendorsResponse, VendorsResultsData } from "../types/vendors";

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
interface VendorFilterParams {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
  status?: string;
  approved_categories?: string;
}

const BASE_URL = "/procurements/vendors/";

// ===== VENDOR HOOKS =====

// Get All Vendors (Paginated)
export const useGetVendors = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
  status = "",
  approved_categories = "",
}: VendorFilterParams) => {
  return useQuery<PaginatedResponse<VendorsResultsData>>({
    queryKey: ["vendors", page, size, search, status, approved_categories],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            status,
            ...(search && { search }),
            approved_categories,
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

// Get Vendor List (Non-paginated)
export const useGetVendorList = (enabled: boolean = true) => {
  return useQuery<ApiResponse<VendorsResultsData[]>>({
    queryKey: ["vendor-list"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
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

// Get Single Vendor
export const useGetVendor = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<VendorsResultsData>>({
    queryKey: ["vendor", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Create Vendor
export const useCreateVendor = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["vendors", "vendor-list"],
    isAuth: true,
    method: "POST",
  });

  const createVendor = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor create error:", error);
    }
  };

  return { createVendor, data, isLoading, isSuccess, error };
};

// Update Vendor (Full Update)
export const useUpdateVendor = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendors", "vendor-list", "vendor"],
    isAuth: true,
    method: "PUT",
  });

  const updateVendor = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor update error:", error);
    }
  };

  return { updateVendor, data, isLoading, isSuccess, error };
};

// Modify Vendor (Partial Update)
export const useModifyVendor = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendors", "vendor-list", "vendor"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyVendor = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor modify error:", error);
    }
  };

  return { modifyVendor, data, isLoading, isSuccess, error };
};

// Delete Vendor
export const useDeleteVendor = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendors", "vendor-list"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteVendor = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Vendor delete error:", error);
    }
  };

  return { deleteVendor, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetVendorsQuery = useGetVendors;
export const useGetVendorListQuery = useGetVendorList;
export const useGetVendorQuery = useGetVendor;
export const useCreateVendorMutation = useCreateVendor;
export const useUpdateVendorMutation = useUpdateVendor;
export const useModifyVendorMutation = useModifyVendor;
export const useDeleteVendorMutation = useDeleteVendor;

// Default API object export
const VendorsAPI = {
  useGetVendors,
  useGetVendorList,
  useGetVendor,
  useCreateVendor,
  useUpdateVendor,
  useModifyVendor,
  useDeleteVendor,
  // Legacy naming for component compatibility
  useGetVendorsQuery: useGetVendors,
  useGetVendorListQuery: useGetVendorList,
  useGetVendorQuery: useGetVendor,
};

export default VendorsAPI;
