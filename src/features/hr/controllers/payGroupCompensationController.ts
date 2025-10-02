import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { PayGroupCompensation } from "../types/pay-group-compensation";

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

const BASE_URL = "/hr/employee-benefits/pay-group-compensations/";

// Get All Pay Group Compensations
export const useGetPayGroupCompensations = (enabled: boolean = true) => {
  return useQuery<PaginatedResponse<PayGroupCompensation>>({
    queryKey: ["pay-group-compensations"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
        return response.data as PaginatedResponse<PayGroupCompensation>;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Pay Group Compensation by ID
export const useGetPayGroupCompensationById = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PayGroupCompensation>>({
    queryKey: ["pay-group-compensation", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data as ApiResponse<PayGroupCompensation>;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Get Pay Group Compensation by Pay Group ID
export const useGetPayGroupCompensationByPayGroup = (payGroupId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PayGroupCompensation>>({
    queryKey: ["pay-group-compensation-by-group", payGroupId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}by-pay-group/${payGroupId}/`);
        return response.data as ApiResponse<PayGroupCompensation>;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!payGroupId,
    refetchOnWindowFocus: false,
  });
};

// Create Pay Group Compensation
export const useCreatePayGroupCompensation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PayGroupCompensation,
    Error,
    Partial<PayGroupCompensation>
  >({
    endpoint: BASE_URL,
    queryKey: ["pay-group-compensations"],
    isAuth: true,
    method: "POST",
  });

  const createPayGroupCompensation = async (details: Partial<PayGroupCompensation>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Pay group compensation create error:", error);
    }
  };

  return { createPayGroupCompensation, data, isLoading, isSuccess, error };
};

// Update Pay Group Compensation
export const useUpdatePayGroupCompensation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PayGroupCompensation,
    Error,
    Partial<PayGroupCompensation>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["pay-group-compensations", "pay-group-compensation", id],
    isAuth: true,
    method: "PATCH",
  });

  const updatePayGroupCompensation = async (details: Partial<PayGroupCompensation>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Pay group compensation update error:", error);
    }
  };

  return { updatePayGroupCompensation, data, isLoading, isSuccess, error };
};

// Delete Pay Group Compensation
export const useDeletePayGroupCompensation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PaginatedResponse<PayGroupCompensation>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["pay-group-compensations"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePayGroupCompensation = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Pay group compensation delete error:", error);
    }
  };

  return { deletePayGroupCompensation, data, isLoading, isSuccess, error };
};
