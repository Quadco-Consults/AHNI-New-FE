import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { Compensation } from "../types/compensation";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Paginated Response interface
interface TPaginatedResponse<T> {
  number_of_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    next_page_number: number | null;
    previous: string | null;
    previous_page_number: number | null;
  };
}

// Filter parameters interface
interface CompensationSpreadFilterParams {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/employee-benefits/employee-compensation-spread/";

// ===== COMPENSATION SPREAD HOOKS =====

// Get All Compensation Spreads
export const useGetCompensationsSpread = ({
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: CompensationSpreadFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<Compensation>>>({
    queryKey: ["compensations-spread", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
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

// Create Compensation Spread
export const useCreateCompensationSpread = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    Compensation,
    Error,
    Partial<Compensation>
  >({
    endpoint: BASE_URL,
    queryKey: ["compensations-spread"],
    isAuth: true,
    method: "POST",
  });

  const createCompensationSpread = async (details: Partial<Compensation>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Compensation spread create error:", error);
    }
  };

  return { createCompensationSpread, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetCompensationsSpreadQuery = useGetCompensationsSpread;
export const useCreateCompensationSpreadMutation = useCreateCompensationSpread;