import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IAgreementPaginatedData,
  IAgreementSingleData,
  TAgreementFormData,
} from "../types/contract-management/agreement";

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
interface AgreementFilterParams {
  page?: number;
  size?: number;
  search?: string;
  type?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/agreements/"; // From original service

// ===== AGREEMENT HOOKS =====

// Get All Agreements (Paginated)
export const useGetAllAgreements = ({
  page = 1,
  size = 20,
  search = "",
  type = "",
  enabled = true,
}: AgreementFilterParams) => {
  return useQuery<PaginatedResponse<IAgreementPaginatedData>>({
    queryKey: ["agreements", page, size, search, type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(type && { type }),
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

// Get Single Agreement
export const useGetSingleAgreement = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IAgreementSingleData>>({
    queryKey: ["agreement", id],
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

// Create Agreement
export const useCreateAgreement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAgreementSingleData,
    Error,
    TAgreementFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["agreements"],
    isAuth: true,
    method: "POST",
  });

  const createAgreement = async (details: TAgreementFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Agreement create error:", error);
    }
  };

  return { createAgreement, data, isLoading, isSuccess, error };
};

// Update Agreement
export const useUpdateAgreement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAgreementSingleData,
    Error,
    TAgreementFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "PUT",
  });

  const updateAgreement = async (details: TAgreementFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Agreement update error:", error);
    }
  };

  return { updateAgreement, data, isLoading, isSuccess, error };
};

// Delete Agreement
export const useDeleteAgreement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAgreementSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["agreements"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAgreement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Agreement delete error:", error);
    }
  };

  return { deleteAgreement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllAgreementsQuery = useGetAllAgreements;
export const useGetSingleAgreementQuery = useGetSingleAgreement;
export const useCreateAgreementMutation = useCreateAgreement;
export const useModifyAgreementMutation = useUpdateAgreement;
export const useDeleteAgreementMutation = useDeleteAgreement;

// Missing named export
export const useModifyAgreement = useUpdateAgreement;