import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IAssetRequestPaginatedData,
  IAssetRequestSingleSData,
  TAssetRequestFormValues,
} from "../types/inventory-management/asset-request";

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
interface AssetRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/inventory/assets/requests/";

// ===== ASSET REQUEST HOOKS =====

// Get All Asset Requests (Paginated)
export const useGetAllAssetRequests = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: AssetRequestFilterParams) => {
  return useQuery<PaginatedResponse<IAssetRequestPaginatedData>>({
    queryKey: ["assetRequests", page, size, search, status],
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

// Get Single Asset Request
export const useGetSingleAssetRequest = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IAssetRequestSingleSData>>({
    queryKey: ["assetRequest", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Create Asset Request
export const useCreateAssetRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAssetRequestSingleSData,
    Error,
    TAssetRequestFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["assetRequests"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const createAssetRequest = async (details: TAssetRequestFormValues) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Asset request create error:", error);
    }
  };

  return { createAssetRequest, data, isLoading, isSuccess, error };
};

// Edit Asset Request (Full Update)
export const useEditAssetRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAssetRequestSingleSData,
    Error,
    TAssetRequestFormValues
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["assetRequests", "assetRequest"],
    isAuth: true,
    method: "PUT",
  });

  const editAssetRequest = async (details: TAssetRequestFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Asset request edit error:", error);
    }
  };

  return { editAssetRequest, data, isLoading, isSuccess, error };
};

// Delete Asset Request
export const useDeleteAssetRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAssetRequestSingleSData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["assetRequests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAssetRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Asset request delete error:", error);
    }
  };

  return { deleteAssetRequest, data, isLoading, isSuccess, error };
};

// Upload Document to Asset Request
export const useUploadAssetRequestDocument = (assetRequestId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<any>,
    Error,
    FormData
  >({
    endpoint: `${BASE_URL}${assetRequestId}/upload-document/`,
    queryKey: ["assetRequests", "documents"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const uploadDocument = async (formData: FormData) => {
    try {
      const response = await callApi(formData);
      return response;
    } catch (error) {
      console.error("Asset request document upload error:", error);
      throw error;
    }
  };

  return { uploadDocument, data, isLoading, isSuccess, error };
};

// Get Asset Request Documents
export const useGetAssetRequestDocuments = (assetRequestId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["assetRequestDocuments", assetRequestId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}${assetRequestId}/documents/`);
      return response.data;
    },
    enabled: enabled && !!assetRequestId,
    refetchOnWindowFocus: false,
  });
};

// ===== APPROVAL WORKFLOW HOOKS =====

// Review Asset Request
export const useReviewAssetRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<IAssetRequestSingleSData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["assetRequests", "assetRequest"],
    isAuth: true,
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
  });

  const reviewAssetRequest = async (comments: string) => {
    try {
      const response = await callApi({ comments });
      return response;
    } catch (error) {
      console.error("Asset request review error:", error);
      throw error;
    }
  };

  return { reviewAssetRequest, data, isLoading, isSuccess, error };
};

// Authorize Asset Request
export const useAuthorizeAssetRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<IAssetRequestSingleSData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["assetRequests", "assetRequest"],
    isAuth: true,
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
  });

  const authorizeAssetRequest = async (comments: string) => {
    try {
      const response = await callApi({ comments });
      return response;
    } catch (error) {
      console.error("Asset request authorize error:", error);
      throw error;
    }
  };

  return { authorizeAssetRequest, data, isLoading, isSuccess, error };
};

// Approve Asset Request
export const useApproveAssetRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ApiResponse<IAssetRequestSingleSData>,
    Error,
    { comments: string }
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["assetRequests", "assetRequest"],
    isAuth: true,
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
  });

  const approveAssetRequest = async (comments: string) => {
    try {
      const response = await callApi({ comments });
      return response;
    } catch (error) {
      console.error("Asset request approve error:", error);
      throw error;
    }
  };

  return { approveAssetRequest, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllAssetRequestsQuery = useGetAllAssetRequests;
export const useGetSingleAssetRequestQuery = useGetSingleAssetRequest;
export const useCreateAssetRequestMutation = useCreateAssetRequest;
export const useEditAssetRequestMutation = useEditAssetRequest;
export const useDeleteAssetRequestMutation = useDeleteAssetRequest;
export const useUploadAssetRequestDocumentMutation = useUploadAssetRequestDocument;
export const useReviewAssetRequestMutation = useReviewAssetRequest;
export const useAuthorizeAssetRequestMutation = useAuthorizeAssetRequest;
export const useApproveAssetRequestMutation = useApproveAssetRequest;
