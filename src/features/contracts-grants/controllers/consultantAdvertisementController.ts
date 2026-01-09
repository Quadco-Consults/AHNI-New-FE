import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  IConsultantPaginatedData,
  IConsultantSingleData,
  TConsultantanagementDetailsFormData,
  TScopeOfWorkFormData,
} from "../types/contract-management/consultancy-management/consultancy-management";

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
interface ConsultantAdvertisementFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  type?: "CONSULTANT" | "ADHOC" | "FACILITATOR";
  ordering?: string;
  enabled?: boolean;
}

// Combined form data interface for creation
interface TConsultantAdvertisementCreateFormData
  extends TConsultantanagementDetailsFormData,
    TScopeOfWorkFormData {}

// Combined form data interface for updates
interface TConsultantAdvertisementUpdateFormData
  extends TConsultantanagementDetailsFormData,
    TScopeOfWorkFormData {}

const BASE_URL = "/contract-grants/consultants/";

// ===== CONSULTANT ADVERTISEMENT HOOKS =====

// Get All Consultant Advertisements (Paginated)
export const useGetAllConsultantAdvertisements = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  type,
  ordering = "-created_datetime",
  enabled = true,
}: ConsultantAdvertisementFilterParams) => {
  return useQuery<PaginatedResponse<IConsultantPaginatedData>>({
    queryKey: ["consultantAdvertisements", page, size, search, status, type, ordering],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ordering,
            ...(search && { search }),
            ...(status && { status }),
            ...(type && { type }),
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
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

// Get Single Consultant Advertisement
export const useGetSingleConsultantAdvertisement = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IConsultantSingleData>>({
    queryKey: ["consultantAdvertisement", id],
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

// Create Consultant Advertisement
export const useCreateConsultantAdvertisement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (details: TConsultantAdvertisementCreateFormData) => {
      const response = await AxiosWithToken.post(BASE_URL, details);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate both consultant and adhoc advertisement caches
      // This ensures new advertisements show up regardless of type
      queryClient.invalidateQueries({ queryKey: ["consultantAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data?.message || "Advertisement created successfully!");
    },
    onError: (error: AxiosError) => {
      console.error("Consultant advertisement create error:", error);
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to create advertisement";
      toast.error(errorMessage);
    },
  });

  const createConsultantAdvertisement = async (
    details: TConsultantAdvertisementCreateFormData
  ) => {
    try {
      await mutation.mutateAsync(details);
    } catch (error) {
      console.error("Consultant advertisement create error:", error);
      throw error;
    }
  };

  return {
    createConsultantAdvertisement,
    data: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

// Update Consultant Advertisement
export const useUpdateConsultantAdvertisement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultantSingleData,
    Error,
    TConsultantAdvertisementUpdateFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultantAdvertisements", "consultantAdvertisement"],
    isAuth: true,
    method: "PUT",
  });

  const updateConsultantAdvertisement = async (
    details: TConsultantAdvertisementUpdateFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultant advertisement update error:", error);
    }
  };

  return { updateConsultantAdvertisement, data, isLoading, isSuccess, error };
};

// Patch Update Consultant Advertisement
export const usePatchConsultantAdvertisement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultantSingleData,
    Error,
    Partial<TConsultantAdvertisementUpdateFormData>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultantAdvertisements", "consultantAdvertisement"],
    isAuth: true,
    method: "PATCH",
  });

  const patchConsultantAdvertisement = async (
    details: Partial<TConsultantAdvertisementUpdateFormData>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultant advertisement patch error:", error);
    }
  };

  return { patchConsultantAdvertisement, data, isLoading, isSuccess, error };
};

// Delete Consultant Advertisement
export const useDeleteConsultantAdvertisement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultantSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultantAdvertisements"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteConsultantAdvertisement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Consultant advertisement delete error:", error);
    }
  };

  return { deleteConsultantAdvertisement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllConsultantAdvertisementsQuery =
  useGetAllConsultantAdvertisements;
export const useGetSingleConsultantAdvertisementQuery =
  useGetSingleConsultantAdvertisement;
export const useCreateConsultantAdvertisementMutation =
  useCreateConsultantAdvertisement;
export const useUpdateConsultantAdvertisementMutation =
  useUpdateConsultantAdvertisement;
export const usePatchConsultantAdvertisementMutation =
  usePatchConsultantAdvertisement;
export const useDeleteConsultantAdvertisementMutation =
  useDeleteConsultantAdvertisement;
