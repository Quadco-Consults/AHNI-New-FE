import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { ISubGrantUploadData } from "../types/contract-management/sub-grant/sub-grant-upload";

// Sub Grant Upload form data type (from modal component)
export interface TSubGrantSubUploadFormData {
  name: string;
  document: FileList | any;
}

// Extended form data interface for creation with sub_grant_submission
interface TSubGrantUploadCreateFormData extends TSubGrantSubUploadFormData {
  sub_grant_submission: string;
}

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
interface SubGrantUploadFilterParams {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/sub-grants/submissions/documents/"; // From original service

// ===== SUB GRANT UPLOAD HOOKS =====

// Get All Sub Grant Uploads (Paginated)
export const useGetAllSubGrantUploads = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: SubGrantUploadFilterParams) => {
  return useQuery<PaginatedResponse<ISubGrantUploadData>>({
    queryKey: ["subGrantUploads", page, size, search],
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

// Create Sub Grant Upload
export const useCreateSubGrantUpload = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantUploadData,
    Error,
    TSubGrantUploadCreateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["subGrantUploads"],
    isAuth: true,
    method: "POST",
  });

  const createSubGrantUpload = async (details: TSubGrantUploadCreateFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub grant upload create error:", error);
    }
  };

  return { createSubGrantUpload, data, isLoading, isSuccess, error };
};

// Delete Sub Grant Upload
export const useDeleteSubGrantUpload = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantUploadData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["subGrantUploads"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSubGrantUpload = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Sub grant upload delete error:", error);
    }
  };

  return { deleteSubGrantUpload, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllSubGrantUploadsQuery = useGetAllSubGrantUploads;
export const useCreateSubGrantUploadMutation = useCreateSubGrantUpload;
export const useDeleteSubGrantUploadMutation = useDeleteSubGrantUpload;