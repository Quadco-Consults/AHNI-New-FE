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

// Filter parameters interface (with grantId requirement)
interface ObligationFilterParams {
  grantId: string;
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

// ===== OBLIGATION HOOKS =====

// Get All Obligations (Paginated) - for a specific grant
export const useGetAllObligations = ({
  grantId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: ObligationFilterParams) => {
  return useQuery<PaginatedResponse<IObligationPaginatedData>>({
    queryKey: ["obligations", grantId, page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/projects/${grantId}/obligations/`, {
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
    enabled: enabled && !!grantId,
    refetchOnWindowFocus: false,
  });
};

// Create Obligation for a specific grant
export const useCreateObligation = (grantId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IObligationSingleData,
    Error,
    TObligationFormData
  >({
    endpoint: `/projects/${grantId}/obligations/`,
    queryKey: ["obligations", "grants"],
    isAuth: true,
    method: "POST",
  });

  const createObligation = async (details: TObligationFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Obligation create error:", error);
    }
  };

  return { createObligation, data, isLoading, isSuccess, error };
};

// Update Obligation for a specific grant
export const useUpdateObligation = (grantId: string, obligationId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IObligationSingleData,
    Error,
    TObligationFormData
  >({
    endpoint: `/projects/${grantId}/obligations/${obligationId}/`,
    queryKey: ["obligations", "grants"],
    isAuth: true,
    method: "PUT",
  });

  const updateObligation = async (details: TObligationFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Obligation update error:", error);
    }
  };

  return { updateObligation, data, isLoading, isSuccess, error };
};

// Delete Obligation for a specific grant
export const useDeleteObligation = (grantId: string, obligationId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IObligationSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `/projects/${grantId}/obligations/${obligationId}/`,
    queryKey: ["obligations", "grants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteObligation = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Obligation delete error:", error);
    }
  };

  return { deleteObligation, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllObligationsQuery = useGetAllObligations;
export const useCreateObligationMutation = useCreateObligation;
export const useModifyObligationMutation = useUpdateObligation;
export const useDeleteObligationMutation = useDeleteObligation;

// Missing named export
export const useModifyObligation = useUpdateObligation;