import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ISubGrantSubmissionPaginatedData,
  ISubGrantSubmissionSingleData,
  TSubGrantSubmissionFormData,
} from "../types/contract-management/sub-grant/sub-grant";

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
interface SubGrantSubmissionFilterParams {
  page?: number;
  size?: number;
  search?: string;
  sub_grant?: string;
  enabled?: boolean;
}

// Extended form data interface for creation/updates with sub_grant
interface TSubGrantSubmissionCreateUpdateFormData extends TSubGrantSubmissionFormData {
  sub_grant: string;
}

const BASE_URL = "/contract-grants/sub-grants/submissions/"; // From original service

// ===== SUB GRANT SUBMISSION HOOKS =====

// Get All Sub Grant Submissions (Paginated)
export const useGetAllSubGrantSubmissions = ({
  page = 1,
  size = 20,
  search = "",
  sub_grant = "",
  enabled = true,
}: SubGrantSubmissionFilterParams) => {
  return useQuery<PaginatedResponse<ISubGrantSubmissionPaginatedData>>({
    queryKey: ["subGrantSubmissions", page, size, search, sub_grant],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(sub_grant && { sub_grant }),
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

// Get Single Sub Grant Submission
export const useGetSingleSubGrantSubmission = (submissionId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<ISubGrantSubmissionSingleData>>({
    queryKey: ["subGrantSubmission", submissionId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${submissionId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!submissionId,
    refetchOnWindowFocus: false,
  });
};

// Create Sub Grant Submission
export const useCreateSubGrantSubmission = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantSubmissionSingleData,
    Error,
    TSubGrantSubmissionCreateUpdateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["subGrantSubmissions"],
    isAuth: true,
    method: "POST",
  });

  const createSubGrantSubmission = async (details: TSubGrantSubmissionCreateUpdateFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub grant submission create error:", error);
    }
  };

  return { createSubGrantSubmission, data, isLoading, isSuccess, error };
};

// Update Sub Grant Submission
export const useUpdateSubGrantSubmission = (submissionId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TSubGrantSubmissionFormData,
    Error,
    TSubGrantSubmissionCreateUpdateFormData
  >({
    endpoint: `${BASE_URL}${submissionId}/`,
    queryKey: ["subGrantSubmissions", "subGrantSubmission"],
    isAuth: true,
    method: "PUT",
  });

  const updateSubGrantSubmission = async (details: TSubGrantSubmissionCreateUpdateFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Sub grant submission update error:", error);
    }
  };

  return { updateSubGrantSubmission, data, isLoading, isSuccess, error };
};

// Delete Sub Grant Submission
export const useDeleteSubGrantSubmission = (submissionId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISubGrantSubmissionSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${submissionId}/`,
    queryKey: ["subGrantSubmissions"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSubGrantSubmission = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Sub grant submission delete error:", error);
    }
  };

  return { deleteSubGrantSubmission, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllSubGrantManualSubQuery = useGetAllSubGrantSubmissions;
export const useGetSingleSubGrantManualSubQuery = useGetSingleSubGrantSubmission;
export const useCreateSubGrantManualSubMutation = useCreateSubGrantSubmission;
export const useModifySubGrantManualSubMutation = useUpdateSubGrantSubmission;
export const useDeleteSubGrantManualSubMutation = useDeleteSubGrantSubmission;

// Missing named exports
export const useCreateSubGrantManualSub = useCreateSubGrantSubmission;
export const useModifySubGrantManualSub = useUpdateSubGrantSubmission;
export const useGetSingleSubGrantManualSub = useGetSingleSubGrantSubmission;
export const useGetAllSubGrantManualSub = useGetAllSubGrantSubmissions;
export const useDeleteSubGrantManualSub = useDeleteSubGrantSubmission;