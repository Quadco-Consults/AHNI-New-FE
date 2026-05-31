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

// Deduction Setting interfaces
export interface IDeductionSetting {
  id: string;
  payment_type: "CONSULTANT" | "ADHOC_STAFF" | "VENDOR" | "PURCHASE_ORDER" | "FACILITATOR";
  payment_type_display: string;
  deduction_name: string;
  amount: string | number;
  is_active: boolean;
  description?: string;
  created_datetime: string;
  updated_datetime: string;
  created_by_name?: string;
  updated_by_name?: string;
}

export interface IDeductionSettingFormData {
  payment_type: string;
  deduction_name: string;
  amount: number | string;
  is_active?: boolean;
  description?: string;
}

// Filter parameters interface
interface DeductionSettingsFilterParams {
  page?: number;
  size?: number;
  payment_type?: string;
  is_active?: boolean;
  enabled?: boolean;
}

const BASE_URL = "/admins/deduction-settings/";

// ===== DEDUCTION SETTINGS HOOKS =====

// Get All Deduction Settings (Paginated)
export const useGetAllDeductionSettings = ({
  page = 1,
  size = 20,
  payment_type,
  is_active,
  enabled = true,
}: DeductionSettingsFilterParams = {}) => {
  return useQuery<PaginatedResponse<IDeductionSetting>>({
    queryKey: ["deductionSettings", page, size, payment_type, is_active],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(payment_type && { payment_type }),
            ...(is_active !== undefined && { is_active }),
          },
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Deduction Settings API Error:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
        });
        throw new Error(
          "Database Error: Failed to fetch deduction settings data."
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 5000,
  });
};

// Get Single Deduction Setting
export const useGetSingleDeductionSetting = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IDeductionSetting>>({
    queryKey: ["deductionSetting", id],
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

// Create Deduction Setting
export const useCreateDeductionSetting = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeductionSetting,
    Error,
    IDeductionSettingFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["deductionSettings"],
    isAuth: true,
    method: "POST",
  });

  const createDeductionSetting = async (details: IDeductionSettingFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Deduction setting create error:", error);
    }
  };

  return { createDeductionSetting, data, isLoading, isSuccess, error };
};

// Update Deduction Setting
export const useUpdateDeductionSetting = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeductionSetting,
    Error,
    IDeductionSettingFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["deductionSettings", "deductionSetting"],
    isAuth: true,
    method: "PATCH",
  });

  const updateDeductionSetting = async (details: IDeductionSettingFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Deduction setting update error:", error);
    }
  };

  return { updateDeductionSetting, data, isLoading, isSuccess, error };
};

// Delete Deduction Setting
export const useDeleteDeductionSetting = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDeductionSetting,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["deductionSettings"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDeductionSetting = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Deduction setting delete error:", error);
    }
  };

  return { deleteDeductionSetting, data, isLoading, isSuccess, error };
};

// Get default deduction for a payment type (helper function)
export const useGetDefaultDeduction = (paymentType: string) => {
  return useQuery<number>({
    queryKey: ["defaultDeduction", paymentType],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            payment_type: paymentType,
            is_active: true,
            size: 100, // Get all active deductions for this type
          },
        });

        // Sum all active deductions for this payment type
        const deductions = response.data?.data?.results || [];
        return deductions.reduce(
          (sum: number, item: IDeductionSetting) => sum + Number(item.amount),
          0
        );
      } catch (error) {
        console.error("Default deduction calculation error:", error);
        return 0;
      }
    },
    enabled: !!paymentType,
    refetchOnWindowFocus: false,
  });
};
