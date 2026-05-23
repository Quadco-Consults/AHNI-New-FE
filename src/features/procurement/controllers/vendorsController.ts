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

const BASE_URL = "procurements/vendors/";

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

        // Handle 404 specifically for vendor not found
        if (axiosError.response?.status === 404) {
          console.warn(`Vendor with ID ${id} not found (404)`);
          const notFoundError = new Error(`Vendor with ID ${id} was not found in the system`);
          (notFoundError as any).status = 404;
          (notFoundError as any).response = { status: 404 };
          throw notFoundError;
        }

        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if ((error as any)?.status === 404 || (error as any)?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
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
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Vendor create error:", error);
      throw error; // Re-throw error so it can be handled by the caller
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
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Vendor update error:", error);
      throw error; // Re-throw error so it can be handled by the caller
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

// Bulk Upload Vendors
export const useBulkUploadVendors = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}bulk-upload/`,
    queryKey: ["vendors", "vendor-list"],
    isAuth: true,
    method: "POST",
  });

  const bulkUploadVendors = async (vendors: any[]) => {
    try {
      const result = await callApi({ vendors });
      return result;
    } catch (error) {
      console.error("Bulk upload error:", error);
      throw error;
    }
  };

  return { bulkUploadVendors, data, isLoading, isSuccess, error };
};

// Get Vendor Activity History
export const useGetVendorActivity = (vendorId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any>>({
    queryKey: ["vendor-activity", vendorId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${vendorId}/activity/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: enabled && !!vendorId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Assign Vendor to Current User
export const useAssignVendor = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<VendorsResultsData>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/assign/`,
    queryKey: ["vendors", "vendor-list", "vendor"],
    isAuth: true,
    method: "POST",
  });

  const assignVendor = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Vendor assign error:", error);
      throw error;
    }
  };

  return { assignVendor, data, isLoading, isSuccess, error };
};

// Unassign Vendor
export const useUnassignVendor = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<VendorsResultsData>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/unassign/`,
    queryKey: ["vendors", "vendor-list", "vendor"],
    isAuth: true,
    method: "POST",
  });

  const unassignVendor = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Vendor unassign error:", error);
      throw error;
    }
  };

  return { unassignVendor, data, isLoading, isSuccess, error };
};

// Blacklist Vendor
export const useBlacklistVendor = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<VendorsResultsData>,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/blacklist/`,
    queryKey: ["vendors", "vendor-list", "vendor"],
    isAuth: true,
    method: "POST",
  });

  const blacklistVendor = async (details: { reason: string; comments?: string }) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Vendor blacklist error:", error);
      throw error;
    }
  };

  return { blacklistVendor, data, isLoading, isSuccess, error };
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
  useGetVendorActivity,
  useCreateVendor,
  useUpdateVendor,
  useModifyVendor,
  useDeleteVendor,
  useBulkUploadVendors,
  useAssignVendor,
  useUnassignVendor,
  useBlacklistVendor,
  // Legacy naming for component compatibility
  useGetVendorsQuery: useGetVendors,
  useGetVendorListQuery: useGetVendorList,
  useGetVendorQuery: useGetVendor,
};

export default VendorsAPI;
