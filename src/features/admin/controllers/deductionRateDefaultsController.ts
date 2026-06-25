import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

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

// Deduction Rate Defaults interfaces
export interface IDeductionRateDefaults {
  id: string;
  default_wht_rate: string | number;
  default_pension_rate: string | number;
  default_nhis_rate: string | number;
  effective_date: string;
  is_active: boolean;
  notes?: string;
  created_datetime: string;
  updated_datetime: string;
  created_by_name?: string;
  updated_by_name?: string;
}

export interface IDeductionRateDefaultsFormData {
  default_wht_rate: number | string;
  default_pension_rate: number | string;
  default_nhis_rate: number | string;
  effective_date: string;
  is_active?: boolean;
  notes?: string;
}

// Filter parameters interface
interface DeductionRateDefaultsFilterParams {
  page?: number;
  size?: number;
  is_active?: boolean;
  enabled?: boolean;
}

const BASE_URL = "/admins/deduction-rate-defaults/";

// ===== DEDUCTION RATE DEFAULTS HOOKS =====

// Get All Deduction Rate Defaults (Paginated)
export const useGetAllDeductionRateDefaults = ({
  page = 1,
  size = 20,
  is_active,
  enabled = true,
}: DeductionRateDefaultsFilterParams = {}) => {
  return useQuery<PaginatedResponse<IDeductionRateDefaults>>({
    queryKey: ["deductionRateDefaults", page, size, is_active],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(is_active !== undefined && { is_active }),
          },
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Deduction Rate Defaults API Error:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
        });
        throw new Error(
          "Database Error: Failed to fetch deduction rate defaults data."
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 5000,
  });
};

// Get Single Deduction Rate Defaults
export const useGetSingleDeductionRateDefaults = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IDeductionRateDefaults>>({
    queryKey: ["deductionRateDefaults", id],
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

// Get Active Deduction Rate Defaults
export const useGetActiveDeductionRateDefaults = (enabled: boolean = true) => {
  return useQuery<ApiResponse<IDeductionRateDefaults>>({
    queryKey: ["activeDeductionRateDefaults"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}active/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message || "No active configuration found"
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Create Deduction Rate Defaults
export const useCreateDeductionRateDefaults = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeductionRateDefaults,
    Error,
    IDeductionRateDefaultsFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["deductionRateDefaults"],
    isAuth: true,
    method: "POST",
  });

  const createDeductionRateDefaults = async (details: IDeductionRateDefaultsFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Deduction rate defaults create error:", error);
    }
  };

  return { createDeductionRateDefaults, data, isLoading, isSuccess, error };
};

// Update Deduction Rate Defaults
export const useUpdateDeductionRateDefaults = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeductionRateDefaults,
    Error,
    IDeductionRateDefaultsFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["deductionRateDefaults", "deductionRateDefaults"],
    isAuth: true,
    method: "PATCH",
  });

  const updateDeductionRateDefaults = async (details: IDeductionRateDefaultsFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Deduction rate defaults update error:", error);
    }
  };

  return { updateDeductionRateDefaults, data, isLoading, isSuccess, error };
};

// Delete Deduction Rate Defaults
export const useDeleteDeductionRateDefaults = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeductionRateDefaults,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["deductionRateDefaults"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDeductionRateDefaults = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Deduction rate defaults delete error:", error);
    }
  };

  return { deleteDeductionRateDefaults, data, isLoading, isSuccess, error };
};
