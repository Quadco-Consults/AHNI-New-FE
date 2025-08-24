import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { PayGroup } from "../types/pay-group";

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
interface PayRollFilterParams {
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "/hr/employee-benefits/payroll/";

// ===== PAY ROLL HOOKS =====

// Get Pay Rolls
export const useGetPayRolls = ({
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: PayRollFilterParams = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<PayGroup>>>({
    queryKey: ["pay-rolls", search, page, size],
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

// Get Single Pay Roll
export const useGetSinglePayroll = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<PayGroup>>({
    queryKey: ["pay-roll", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Create Pay Roll
export const useCreatePayRoll = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PayGroup,
    Error,
    Partial<PayGroup>
  >({
    endpoint: BASE_URL,
    queryKey: ["pay-rolls"],
    isAuth: true,
    method: "POST",
  });

  const createPayRoll = async (details: Partial<PayGroup>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Pay roll create error:", error);
    }
  };

  return { createPayRoll, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetPayRollsQuery = useGetPayRolls;
export const useCreatePayRollMutation = useCreatePayRoll;