import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IObligationPaginatedData,
  IObligationSingleData,
  TObligationFormData,
} from "../types/grants";

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
    paginator?: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number?: number | null;
      next?: string | null;
      previous?: string | null;
      previous_page_number?: number | null;
    };
    pagination?: {
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

// Filter parameters interface (with subGrantId requirement)
interface SubGrantObligationFilterParams {
  subGrantId: string;
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

const BASE_URL = "contract-grants/sub-grants/";

// ===== SUB-GRANT OBLIGATION HOOKS =====

// Get All Obligations for a specific sub-grant
export const useGetAllSubGrantObligations = ({
  subGrantId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: SubGrantObligationFilterParams) => {
  return useQuery<PaginatedResponse<IObligationPaginatedData>>({
    queryKey: ["subGrantObligations", subGrantId, page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${subGrantId}/obligations/`, {
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
    enabled: enabled && !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

// Create Obligation for a specific sub-grant
export const useCreateSubGrantObligation = (subGrantId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IObligationSingleData,
    Error,
    TObligationFormData
  >({
    endpoint: `${BASE_URL}${subGrantId}/obligations/`,
    queryKey: ["subGrantObligations", "subGrants"],
    isAuth: true,
    method: "POST",
  });

  const createObligation = async (details: TObligationFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub-grant obligation create error:", error);
    }
  };

  return { createObligation, data, isLoading, isSuccess, error };
};

// Update Obligation for a specific sub-grant
export const useUpdateSubGrantObligation = (subGrantId: string, obligationId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IObligationSingleData,
    Error,
    TObligationFormData
  >({
    endpoint: `${BASE_URL}${subGrantId}/obligations/${obligationId}/`,
    queryKey: ["subGrantObligations", "subGrants"],
    isAuth: true,
    method: "PUT",
  });

  const updateObligation = async (details: TObligationFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub-grant obligation update error:", error);
    }
  };

  return { updateObligation, data, isLoading, isSuccess, error };
};

// Delete Obligation for a specific sub-grant
export const useDeleteSubGrantObligation = (subGrantId: string, obligationId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IObligationSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${subGrantId}/obligations/${obligationId}/`,
    queryKey: ["subGrantObligations", "subGrants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteObligation = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Sub-grant obligation delete error:", error);
    }
  };

  return { deleteObligation, data, isLoading, isSuccess, error };
};
