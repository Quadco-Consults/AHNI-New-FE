import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IPaymentRequestPaginatedData,
  IPaymentRequestSingleData,
  TPaymentRequestFormData,
} from "../types/payment-request";

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
interface PaymentRequestFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  enabled?: boolean;
}

const BASE_URL = "/admins/payments/requests/";

// ===== PAYMENT REQUEST HOOKS =====

// Get All Payment Requests (Paginated)
export const useGetAllPaymentRequests = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: PaymentRequestFilterParams) => {
  return useQuery<PaginatedResponse<IPaymentRequestPaginatedData>>({
    queryKey: ["paymentRequests", page, size, search, status],
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
        console.error("Payment Request API Error:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message
        });
        throw new Error(
          "Database Error: The server is having issues accessing payment request data. This may be due to a database schema mismatch."
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once instead of multiple times
    retryDelay: 5000, // Wait 5 seconds before retry
  });
};

// Get Single Payment Request
export const useGetSinglePaymentRequest = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IPaymentRequestSingleData>>({
    queryKey: ["paymentRequest", id],
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

// Create Payment Request
export const useCreatePaymentRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    TPaymentRequestFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["paymentRequests"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const createPaymentRequest = async (details: TPaymentRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Payment request create error:", error);
    }
  };

  return { createPaymentRequest, data, isLoading, isSuccess, error };
};

// Modify Payment Request (Full Update)
export const useModifyPaymentRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    TPaymentRequestFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["paymentRequests", "paymentRequest"],
    isAuth: true,
    method: "PATCH",
    contentType: "multipart/form-data",
  });

  const modifyPaymentRequest = async (details: TPaymentRequestFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Payment request modify error:", error);
    }
  };

  return { modifyPaymentRequest, data, isLoading, isSuccess, error };
};

// Delete Payment Request
export const useDeletePaymentRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}`,
    queryKey: ["paymentRequests"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePaymentRequest = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Payment request delete error:", error);
    }
  };

  return { deletePaymentRequest, data, isLoading, isSuccess, error };
};

// ===== PAYMENT REQUEST APPROVAL HOOKS =====

interface ApprovalPayload {
  comments: string;
}

// Review Payment Request (PENDING → REVIEWED)
export const useReviewPaymentRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/review/`,
    queryKey: ["paymentRequests", "paymentRequest"],
    isAuth: true,
    method: "POST",
  });

  const reviewPaymentRequest = async (comment: string) => {
    try {
      await callApi({ comments: comment });
    } catch (error) {
      console.error("Payment request review error:", error);
    }
  };

  return { reviewPaymentRequest, data, isLoading, isSuccess, error };
};

// Authorize Payment Request (REVIEWED → AUTHORIZED)
export const useAuthorizePaymentRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/authorize/`,
    queryKey: ["paymentRequests", "paymentRequest"],
    isAuth: true,
    method: "POST",
  });

  const authorizePaymentRequest = async (comment: string) => {
    try {
      await callApi({ comments: comment });
    } catch (error) {
      console.error("Payment request authorize error:", error);
    }
  };

  return { authorizePaymentRequest, data, isLoading, isSuccess, error };
};

// Approve Payment Request (AUTHORIZED → APPROVED)
export const useApprovePaymentRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["paymentRequests", "paymentRequest"],
    isAuth: true,
    method: "POST",
  });

  const approvePaymentRequest = async (comment: string) => {
    try {
      await callApi({ comments: comment });
    } catch (error) {
      console.error("Payment request approve error:", error);
    }
  };

  return { approvePaymentRequest, data, isLoading, isSuccess, error };
};

// Reject Payment Request
export const useRejectPaymentRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IPaymentRequestSingleData,
    Error,
    ApprovalPayload
  >({
    endpoint: `${BASE_URL}${id}/reject/`,
    queryKey: ["paymentRequests", "paymentRequest"],
    isAuth: true,
    method: "POST",
  });

  const rejectPaymentRequest = async (comment: string) => {
    try {
      await callApi({ comments: comment });
    } catch (error) {
      console.error("Payment request reject error:", error);
    }
  };

  return { rejectPaymentRequest, data, isLoading, isSuccess, error };
};

// ===== BULK PAYMENT HOOKS =====

interface BulkPaymentStaffSelection {
  staff_id: string;
  days_in_period?: number;
  daily_rate?: number;
  deduction_amount?: number;
}

interface BulkPaymentPayload {
  payment_type: "CONSULTANT" | "ADHOC_STAFF";
  cluster_id?: string;
  location_id?: string;
  payment_date: string;
  payment_reason: string;
  payment_period_start?: string;
  payment_period_end?: string;
  default_deduction?: number;
  staff_selections: BulkPaymentStaffSelection[];
  reviewer: string;
  authorizer: string;
  approver: string;
}

// Bulk Create Payment Request
export const useBulkCreatePaymentRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { message: string; payment_request: IPaymentRequestSingleData },
    Error,
    BulkPaymentPayload
  >({
    endpoint: `${BASE_URL}bulk-create/`,
    queryKey: ["paymentRequests"],
    isAuth: true,
    method: "POST",
  });

  const bulkCreatePaymentRequest = async (details: BulkPaymentPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Bulk payment request create error:", error);
    }
  };

  return { bulkCreatePaymentRequest, data, isLoading, isSuccess, error };
};

// Download Payment Template
export const useDownloadPaymentTemplate = () => {
  const downloadTemplate = async (params: {
    payment_type: "CONSULTANT" | "ADHOC_STAFF";
    cluster_id?: string;
    location_id?: string;
  }) => {
    try {
      const response = await AxiosWithToken.get(
        `${BASE_URL}download-payment-template/`,
        {
          params,
          responseType: "blob",
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from Content-Disposition header or create default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `bulk_payment_template_${params.payment_type}.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Template download error:", error);
      throw error;
    }
  };

  return { downloadTemplate };
};

// Upload Payment Template
export const useUploadPaymentTemplate = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    { message: string; payment_request: IPaymentRequestSingleData },
    Error,
    FormData
  >({
    endpoint: `${BASE_URL}upload-payment-template/`,
    queryKey: ["paymentRequests"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const uploadTemplate = async (params: {
    file: File;
    payment_type: "CONSULTANT" | "ADHOC_STAFF";
    payment_date: string;
    payment_reason: string;
    reviewer: string;
    authorizer: string;
    approver: string;
  }) => {
    try {
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("payment_type", params.payment_type);
      formData.append("payment_date", params.payment_date);
      formData.append("payment_reason", params.payment_reason);
      formData.append("reviewer", params.reviewer);
      formData.append("authorizer", params.authorizer);
      formData.append("approver", params.approver);

      await callApi(formData);
    } catch (error) {
      console.error("Template upload error:", error);
    }
  };

  return { uploadTemplate, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllPaymentRequestsQuery = useGetAllPaymentRequests;
export const useGetSinglePaymentRequestQuery = useGetSinglePaymentRequest;
export const useCreatePaymentRequestMutation = useCreatePaymentRequest;
export const useModifyPaymentRequestMutation = useModifyPaymentRequest;
export const useDeletePaymentRequestMutation = useDeletePaymentRequest;
export const useRejectPaymentRequestMutation = useRejectPaymentRequest;
