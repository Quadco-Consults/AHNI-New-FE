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
interface FuelConsumptionFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  vendor?: string;
  location?: string;
  driver?: string;
  asset?: string;
  enabled?: boolean;
}

// Approval payload interface
interface ApprovalPayload {
  comments?: string;
}

const BASE_URL = "/admins/fleets/fuel-consumptions/";

// ===== FUEL CONSUMPTION HOOKS =====

// Get All Fuel Consumptions (Paginated)
export const useGetAllFuelConsumptions = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  date_from = "",
  date_to = "",
  vendor = "",
  location = "",
  driver = "",
  asset = "",
  enabled = true,
}: FuelConsumptionFilterParams) => {
  return useQuery<PaginatedResponse<IFuelRequestPaginatedData>>({
    queryKey: [
      "fuelConsumptions",
      page,
      size,
      search,
      status,
      date_from,
      date_to,
      vendor,
      location,
      driver,
      asset,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(date_from && { date_from }),
            ...(date_to && { date_to }),
            ...(vendor && { vendor }),
            ...(location && { location }),
            ...(driver && { driver }),
            ...(asset && { asset }),
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

// Get Single Fuel Consumption
export const useGetSingleFuelConsumption = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IFuelRequestSingleData>>({
    queryKey: ["fuelConsumption", id],
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

// Create Fuel Consumption
export const useCreateFuelConsumption = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    TFuelRequestFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["fuelConsumptions"],
    isAuth: true,
    method: "POST",
  });

  const createFuelConsumption = async (details: TFuelRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fuel consumption create error:", error);
    }
  };

  return { createFuelConsumption, data, isLoading, isSuccess, error };
};

// Edit Fuel Consumption (Full Update)
export const useEditFuelConsumption = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    TFuelRequestFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fuelConsumptions", "fuelConsumptionItem"],
    isAuth: true,
    method: "PUT",
  });

  const editFuelConsumption = async (details: TFuelRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fuel consumption edit error:", error);
    }
  };

  return { editFuelConsumption, data, isLoading, isSuccess, error };
};

// Delete Fuel Consumption
export const useDeleteFuelConsumption = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["fuelConsumptions"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFuelConsumption = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Fuel consumption delete error:", error);
    }
  };

  return { deleteFuelConsumption, data, isLoading, isSuccess, error };
};

// Approve Fuel Consumption
export const useApproveFuelConsumption = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["fuelConsumptions", "fuelConsumptionItem"],
    isAuth: true,
    method: "POST",
  });

  const approveFuelConsumption = async (details: ApprovalPayload = {}) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fuel consumption approve error:", error);
    }
  };

  return { approveFuelConsumption, data, isLoading, isSuccess, error };
};

// Reject Fuel Consumption
export const useRejectFuelConsumption = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFuelRequestSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["fuelConsumptions", "fuelConsumptionItem"],
    isAuth: true,
    method: "POST",
  });

  const rejectFuelConsumption = async (details: ApprovalPayload = {}) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Fuel consumption reject error:", error);
    }
  };

  return { rejectFuelConsumption, data, isLoading, isSuccess, error };
};

// Get Fuel Consumption Totals
export const useGetFuelConsumptionTotals = (
  filters: {
    vendor?: string;
    vehicle?: string;
    location?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  } = {}
) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  return useQuery({
    queryKey: ["fuelConsumptionTotals", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}totals/?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Fuel consumption totals error:", error);
        throw error;
      }
    },
  });
};

// Get Vendor Fuel Statistics
export const useGetVendorFuelStatistics = (
  vendorId: string,
  filters: {
    date_from?: string;
    date_to?: string;
  } = {}
) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  return useQuery({
    queryKey: ["vendorFuelStatistics", vendorId, filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}vendor/${vendorId}/statistics/?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Vendor fuel statistics error:", error);
        throw error;
      }
    },
    enabled: !!vendorId,
  });
};

// Get Vendor Fuel Purchases
export const useGetVendorFuelPurchases = (
  vendorId: string,
  filters: {
    date_from?: string;
    date_to?: string;
    page?: number;
    size?: number;
  } = {}
) => {
  const { page = 1, size = 20, ...otherFilters } = filters;
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());

  Object.entries(otherFilters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  return useQuery({
    queryKey: ["vendorFuelPurchases", vendorId, filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}vendor/${vendorId}/purchases/?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("Vendor fuel purchases error:", error);
        throw error;
      }
    },
    enabled: !!vendorId,
  });
};

// Get Vehicle Fuel History
export const useGetVehicleFuelHistory = (
  vehicleId: string,
  enabled: boolean = true
) => {
  return useQuery<PaginatedResponse<IFuelRequestPaginatedData>>({
    queryKey: ["vehicleFuelHistory", vehicleId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}vehicle/${vehicleId}/history/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!vehicleId,
    refetchOnWindowFocus: false,
  });
};

// Get Unique Vendors from Fuel Consumption Records
export const useGetFuelVendors = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["fuelVendors"],
    queryFn: async () => {
      try {
        // Fetch all fuel consumption records with a large page size to get all records
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page: 1, size: 1000 }, // Increase size to get more records
        });

        const fuelRecords = response.data.data.results;

        // Extract unique vendors
        const vendorMap = new Map();

        fuelRecords.forEach((record: IFuelRequestPaginatedData) => {
          if (record.vendor && !vendorMap.has(record.vendor.id)) {
            vendorMap.set(record.vendor.id, {
              id: record.vendor?.id,
              name: record.vendor?.name, // Use vendor field as name
              company_name: record.vendor?.name,
              recordCount: 1,
              amount: record.amount,
              quantity: record?.quantity,
              status: record?.status,
              request_id: record?.id,
            });
          } else if (record.vendor && vendorMap.has(record.vendor.id)) {
            const existingVendor = vendorMap.get(record.vendor.id);
            existingVendor.recordCount++;
          }
        });

        return {
          status: true,
          message: "Fuel vendors retrieved successfully",
          data: {
            results: Array.from(vendorMap.values()),
            pagination: {
              count: vendorMap.size,
              page: 1,
              page_size: vendorMap.size,
              total_pages: 1,
            },
          },
        };
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

// Legacy exports for backward compatibility
export const useGetAllFuelConsumptionsQuery = useGetAllFuelConsumptions;
export const useGetSingleFuelConsumptionQuery = useGetSingleFuelConsumption;
export const useCreateFuelConsumptionMutation = useCreateFuelConsumption;
export const useEditFuelConsumptionMutation = useEditFuelConsumption;
export const useDeleteFuelConsumptionMutation = useDeleteFuelConsumption;
export const useApproveFuelConsumptionMutation = useApproveFuelConsumption;
export const useRejectFuelConsumptionMutation = useRejectFuelConsumption;
