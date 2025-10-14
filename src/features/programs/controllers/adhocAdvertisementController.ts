import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  IAdhocAdvertisement,
  IAdhocAdvertisementCreatePayload,
  IAdhocAdvertisementFilterParams,
} from "../types/adhoc-management";

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

const BASE_URL = "programs/adhoc/advertisements/";

// ===== QUERY HOOKS =====

/**
 * Get All Adhoc Advertisements (Paginated)
 * @description Fetches list of adhoc job advertisements with filtering
 */
export const useGetAllAdhocAdvertisements = ({
  page = 1,
  size = 20,
  search = "",
  status,
  project,
  location,
  is_active,
  date_from,
  date_to,
  enabled = true,
}: IAdhocAdvertisementFilterParams) => {
  return useQuery<PaginatedResponse<IAdhocAdvertisement>>({
    queryKey: [
      "adhocAdvertisements",
      page,
      size,
      search,
      status,
      project,
      location,
      is_active,
      date_from,
      date_to,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
            ...(project && { project }),
            ...(location && { location }),
            ...(is_active !== undefined && { is_active }),
            ...(date_from && { date_from }),
            ...(date_to && { date_to }),
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch advertisements: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Single Adhoc Advertisement
 * @description Fetches detailed information about a specific advertisement
 */
export const useGetSingleAdhocAdvertisement = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IAdhocAdvertisement>>({
    queryKey: ["adhocAdvertisement", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch advertisement: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Active Adhoc Advertisements
 * @description Fetches only currently active/published advertisements
 */
export const useGetActiveAdhocAdvertisements = ({
  page = 1,
  size = 20,
  enabled = true,
}: {
  page?: number;
  size?: number;
  enabled?: boolean;
}) => {
  return useQuery<PaginatedResponse<IAdhocAdvertisement>>({
    queryKey: ["activeAdhocAdvertisements", page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}active/`, {
          params: { page, size },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch active advertisements: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get Advertisement Statistics
 * @description Fetches statistics for a specific advertisement (applicants, hired, etc.)
 */
export const useGetAdvertisementStatistics = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["adhocAdvertisementStats", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/statistics/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch statistics: " +
            ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// ===== MUTATION HOOKS =====

/**
 * Create Adhoc Advertisement
 * @description Creates a new adhoc job advertisement (usually from approved requisition)
 */
export const useCreateAdhocAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IAdhocAdvertisementCreatePayload) => {
      const response = await AxiosWithToken.post(BASE_URL, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement created successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to create advertisement";
      toast.error(errorMessage);
    },
  });
};

/**
 * Update Adhoc Advertisement
 * @description Updates an existing adhoc advertisement
 */
export const useUpdateAdhocAdvertisement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<IAdhocAdvertisementCreatePayload>) => {
      const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisement", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement updated successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to update advertisement";
      toast.error(errorMessage);
    },
  });
};

/**
 * Delete Adhoc Advertisement
 * @description Deletes an adhoc advertisement (usually only for drafts)
 */
export const useDeleteAdhocAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`${BASE_URL}${id}/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement deleted successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to delete advertisement";
      toast.error(errorMessage);
    },
  });
};

// ===== ACTION HOOKS =====

/**
 * Publish Advertisement
 * @description Changes advertisement status from DRAFT to PUBLISHED
 */
export const usePublishAdvertisement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/publish/`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisement", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement published successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to publish advertisement";
      toast.error(errorMessage);
    },
  });
};

/**
 * Close Advertisement
 * @description Closes an advertisement (stops accepting applications)
 */
export const useCloseAdvertisement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reason?: string) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/close/`, {
        reason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisement", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement closed successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to close advertisement";
      toast.error(errorMessage);
    },
  });
};

/**
 * Reopen Advertisement
 * @description Reopens a closed advertisement
 */
export const useReopenAdvertisement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (new_deadline: string) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/reopen/`, {
        new_deadline,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisement", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement reopened successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to reopen advertisement";
      toast.error(errorMessage);
    },
  });
};

/**
 * Cancel Advertisement
 * @description Cancels an advertisement permanently
 */
export const useCancelAdvertisement = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cancellation_reason: string) => {
      const response = await AxiosWithToken.post(`${BASE_URL}${id}/cancel/`, {
        cancellation_reason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisements"] });
      queryClient.invalidateQueries({ queryKey: ["adhocAdvertisement", id] });
      queryClient.invalidateQueries({ queryKey: ["activeAdhocAdvertisements"] });
      toast.success(data.message || "Advertisement cancelled successfully!");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || "Failed to cancel advertisement";
      toast.error(errorMessage);
    },
  });
};
