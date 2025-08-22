import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Compensation } from "../types/compensation";

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

const BASE_URL = "/hr/employee-benefits/compensations/";

// ===== COMPENSATION HOOKS =====

// Get All Compensations
export const useGetCompensations = (enabled: boolean = true) => {
  return useQuery<PaginatedResponse<Compensation>>({
    queryKey: ["compensations"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
        return response.data as PaginatedResponse<Compensation>;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Create Compensation
export const useCreateCompensation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Compensation,
    Error,
    Partial<Compensation>
  >({
    endpoint: BASE_URL,
    queryKey: ["compensations"],
    isAuth: true,
    method: "POST",
  });

  const createCompensation = async (details: Partial<Compensation>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Compensation create error:", error);
    }
  };

  return { createCompensation, data, isLoading, isSuccess, error };
};

// Delete Compensation
export const useDeleteCompensation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PaginatedResponse<Compensation>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["compensations"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCompensation = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Compensation delete error:", error);
    }
  };

  return { deleteCompensation, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetCompensationsQuery = useGetCompensations;
export const useCreateCompensationMutation = useCreateCompensation;
export const useDeleteCompensationMutation = useDeleteCompensation;