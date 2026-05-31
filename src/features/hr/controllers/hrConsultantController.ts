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
    pagination: {
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

// Consultant interface matching backend model
export interface HRConsultant {
  id: number;
  name: string;
  phone_number: string;
  designation: string;
  location: string;
  cluster: number;
  cluster_name?: string;
  cluster_code?: string;
  project: string;
  requesting_unit: string;
  month: string;
  start_date: string;
  end_date: string;
  total_working_days: number;
  days_worked: number;
  days_remaining: number;
  daily_rate: string;
  contract_amount: string;
  amount_paid: string;
  balance: string;
  payment_dates: string;
  status: string;
  remarks: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  sort_code: string;
  created_at: string;
  updated_at: string;
}

// Filter parameters interface
interface HRConsultantFilterParams {
  page?: number;
  size?: number;
  search?: string;
  cluster_id?: string;
  location?: string;
  status?: string;
  active_only?: boolean;
  enabled?: boolean;
}

const BASE_URL = "hr/consultants/";

// ===== HR CONSULTANT HOOKS =====

// Get All HR Consultants (Paginated)
export const useGetAllHRConsultants = ({
  page = 1,
  size = 20,
  search = "",
  cluster_id = "",
  location = "",
  status = "",
  active_only = true,
  enabled = true,
}: HRConsultantFilterParams) => {
  return useQuery<PaginatedResponse<HRConsultant>>({
    queryKey: [
      "hrConsultants",
      page,
      size,
      search,
      cluster_id,
      location,
      status,
      active_only,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(cluster_id && { cluster_id }),
            ...(location && { location }),
            ...(status && { status }),
            ...(active_only && { active_only: 'true' }),
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

// Get Single HR Consultant
export const useGetSingleHRConsultant = (
  id: string | number,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<HRConsultant>>({
    queryKey: ["hrConsultant", id],
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

// Create HR Consultant
export const useCreateHRConsultant = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HRConsultant,
    Error,
    Partial<HRConsultant>
  >({
    endpoint: BASE_URL,
    queryKey: ["hrConsultants"],
    isAuth: true,
    method: "POST",
  });

  const createHRConsultant = async (details: Partial<HRConsultant>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR Consultant create error:", error);
    }
  };

  return { createHRConsultant, data, isLoading, isSuccess, error };
};

// Update HR Consultant
export const useUpdateHRConsultant = (id: string | number) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HRConsultant,
    Error,
    Partial<HRConsultant>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["hrConsultants", "hrConsultant"],
    isAuth: true,
    method: "PATCH",
  });

  const updateHRConsultant = async (details: Partial<HRConsultant>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("HR Consultant update error:", error);
    }
  };

  return { updateHRConsultant, data, isLoading, isSuccess, error };
};

// Delete HR Consultant
export const useDeleteHRConsultant = (id: string | number) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HRConsultant,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["hrConsultants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteHRConsultant = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("HR Consultant delete error:", error);
    }
  };

  return { deleteHRConsultant, data, isLoading, isSuccess, error };
};
