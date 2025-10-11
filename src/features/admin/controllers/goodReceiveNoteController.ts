import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IGoodReceiveNotePaginatedData,
  IGoodReceiveNoteSingleData,
  TGoodReceiveNoteFormValues,
} from "../types/inventory-management/good-receive-note";

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
interface GoodReceiveNoteFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/inventory/good-receive-notes/";

// ===== GOOD RECEIVE NOTE HOOKS =====

// Get All Good Receive Note (Paginated)
export const useGetAllGoodReceiveNote = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: GoodReceiveNoteFilterParams) => {
  return useQuery<PaginatedResponse<IGoodReceiveNotePaginatedData>>({
    queryKey: ["goodReceiveNote", page, size, search, status],
    queryFn: async () => {
      try {
        const params: any = { page, size };

        if (search) params.search = search;

        // Handle status filtering
        if (status === "pending") {
          // For pending: no approved_datetime, no received_datetime, and no rejected_datetime
          // This shows only newly created GRNs that haven't been processed yet
          params.approved_datetime__isnull = true;
          params.received_datetime__isnull = true;
          params.rejected_datetime__isnull = true;
        } else if (status === "approved" || status === "accepted") {
          // For approved/accepted: We want items that have either approved_datetime OR received_datetime
          // Strategy: Fetch all non-pending, non-rejected items
          // This means: exclude items where ALL status fields are null, and exclude rejected
          params.rejected_datetime__isnull = true;

          // Don't add approved_datetime__isnull filter here
          // Instead, we'll rely on excluding pending (done above) and client-side filtering
          // This ensures we get both approved and received items

          // Alternative: If backend supports it, we could use a status field directly
          // But for now, we fetch broadly and filter on client side in the component
        } else if (status === "rejected") {
          // For rejected: has rejected_datetime
          params.rejected_datetime__isnull = false;
        } else if (status) {
          // Fallback to direct status parameter if backend supports it
          params.status = status;
        }

        const response = await AxiosWithToken.get(BASE_URL, { params });
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

// Get Single Good Receive Note
export const useGetSingleGoodReceiveNote = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IGoodReceiveNoteSingleData>>({
    queryKey: ["goodReceiveNote", id],
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

// Create Good Receive Note
export const useCreateGoodReceiveNote = () => {
  const createGoodReceiveNote = async (details: FormData) => {
    try {
      console.log("🔍 CREATE GRN - Sending FormData");

      // Let browser set Content-Type with boundary for multipart/form-data
      const response = await AxiosWithToken.post(BASE_URL, details);
      return response.data;
    } catch (error) {
      console.error("Good receive note create error:", error);
      throw error; // Re-throw to maintain error handling flow
    }
  };

  return { createGoodReceiveNote, isLoading: false };
};

// Modify Good Receive Note (Full Update)
export const useModifyGoodReceiveNote = (id: string) => {
  const modifyGoodReceiveNote = async (details: FormData) => {
    try {
      console.log("🔍 MODIFY GRN - Sending FormData");

      // Let browser set Content-Type with boundary for multipart/form-data
      const response = await AxiosWithToken.put(`${BASE_URL}${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Good receive note modify error:", error);
      throw error;
    }
  };

  return { modifyGoodReceiveNote, isLoading: false };
};

// Delete Good Receive Note
export const useDeleteGoodReceiveNote = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGoodReceiveNoteSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["goodReceiveNote"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteGoodReceiveNote = async () => {
    try {
      const res = await callApi({} as Record<string, never>);
      return res;
    } catch (error) {
      console.error("Good receive note delete error:", error);
    }
  };

  return { deleteGoodReceiveNote, data, isLoading, isSuccess, error };
};

// Mark Good Receive Note as Received
export const useMarkGoodReceiveNoteAsReceived = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGoodReceiveNoteSingleData,
    Error,
    { comments?: string }
  >({
    endpoint: `${BASE_URL}${id}/mark-received/`,
    queryKey: ["goodReceiveNote"],
    isAuth: true,
    method: "PATCH",
  });

  const markGoodReceiveNoteAsReceived = async (comments?: string) => {
    try {
      const payload = {
        ...(comments && { comments }),
      };
      const res = await callApi(payload);
      return res;
    } catch (error) {
      console.error("Good receive note mark as received error:", error);
      throw error;
    }
  };

  return { markGoodReceiveNoteAsReceived, data, isLoading, isSuccess, error };
};

// Approve Good Receive Note
export const useApproveGoodReceiveNote = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGoodReceiveNoteSingleData,
    Error,
    { comments?: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["goodReceiveNote"],
    isAuth: true,
    method: "PATCH", // Backend expects PATCH method
  });

  const approveGoodReceiveNote = async (comments?: string) => {
    try {
      const payload = {
        ...(comments && { comments }),
      };
      const res = await callApi(payload);
      return res;
    } catch (error) {
      console.error("Good receive note approve error:", error);
      throw error;
    }
  };

  return { approveGoodReceiveNote, data, isLoading, isSuccess, error };
};

// Reject Good Receive Note
export const useRejectGoodReceiveNote = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGoodReceiveNoteSingleData,
    Error,
    { rejection_reason?: string }
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["goodReceiveNote"],
    isAuth: true,
    method: "PATCH", // Backend expects PATCH method
  });

  const rejectGoodReceiveNote = async (reason?: string) => {
    try {
      const payload = {
        ...(reason && { rejection_reason: reason }),
      };
      const res = await callApi(payload);
      return res;
    } catch (error) {
      console.error("Good receive note reject error:", error);
      throw error;
    }
  };

  return { rejectGoodReceiveNote, data, isLoading, isSuccess, error };
};

// Download Good Receive Note
export const useDownloadGoodReceiveNote = (id: string) => {
  const downloadGoodReceiveNote = async (format: 'pdf' | 'csv' = 'pdf') => {
    try {
      const response = await AxiosWithToken.get(`${BASE_URL}${id}/download/`, {
        params: { format },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `GRN_${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      console.error("Good receive note download error:", error);
      throw error;
    }
  };

  return { downloadGoodReceiveNote };
};

// Legacy exports for backward compatibility
export const useGetAllGoodReceiveNoteQuery = useGetAllGoodReceiveNote;
export const useGetSingleGoodReceiveNoteQuery = useGetSingleGoodReceiveNote;
export const useCreateGoodReceiveNoteMutation = useCreateGoodReceiveNote;
export const useModifyGoodReceiveNoteMutation = useModifyGoodReceiveNote;
export const useDeleteGoodReceiveNoteMutation = useDeleteGoodReceiveNote;
export const useMarkGoodReceiveNoteAsReceivedMutation = useMarkGoodReceiveNoteAsReceived;
export const useApproveGoodReceiveNoteMutation = useApproveGoodReceiveNote;
export const useRejectGoodReceiveNoteMutation = useRejectGoodReceiveNote;
export const useDownloadGoodReceiveNoteMutation = useDownloadGoodReceiveNote;
