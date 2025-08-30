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
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(status && { status }),
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
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGoodReceiveNoteSingleData,
    Error,
    TGoodReceiveNoteFormValues | FormData
  >({
    endpoint: BASE_URL,
    queryKey: ["goodReceiveNote"],
    isAuth: true,
    method: "POST",
    contentType: null, // Let browser set content type for FormData
  });

  const createGoodReceiveNote = async (details: TGoodReceiveNoteFormValues | FormData) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Good receive note create error:", error);
    }
  };

  return { createGoodReceiveNote, data, isLoading, isSuccess, error };
};

// Modify Good Receive Note (Full Update)
export const useModifyGoodReceiveNote = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IGoodReceiveNoteSingleData,
    Error,
    TGoodReceiveNoteFormValues | FormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["goodReceiveNote", "goodReceiveNoteItem"],
    isAuth: true,
    method: "PUT",
    contentType: null, // Let browser set content type for FormData
  });

  const modifyGoodReceiveNote = async (details: TGoodReceiveNoteFormValues | FormData) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Good receive note modify error:", error);
    }
  };

  return { modifyGoodReceiveNote, data, isLoading, isSuccess, error };
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

// Legacy exports for backward compatibility
export const useGetAllGoodReceiveNoteQuery = useGetAllGoodReceiveNote;
export const useGetSingleGoodReceiveNoteQuery = useGetSingleGoodReceiveNote;
export const useCreateGoodReceiveNoteMutation = useCreateGoodReceiveNote;
export const useModifyGoodReceiveNoteMutation = useModifyGoodReceiveNote;
export const useDeleteGoodReceiveNoteMutation = useDeleteGoodReceiveNote;
