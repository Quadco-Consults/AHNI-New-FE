import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PettyCashRequest,
  CreatePettyCashRequest,
  UpdatePettyCashRequest,
  ApprovalAction,
  PettyCashFilters,
  PettyCashSummary,
  PettyCashAuthorizer,
  PettyCashApiResponse,
  ExportOptions
} from "../types/petty-cash.types";

const BASE_URL = "/finance/petty-cash/";

// ===== PETTY CASH CRUD OPERATIONS =====

// Get All Petty Cash Requests
export const useGetPettyCashRequests = (filters?: PettyCashFilters & { page?: number; size?: number }) => {
  return useQuery<PettyCashApiResponse<PettyCashRequest[]>>({
    queryKey: ["petty-cash-requests", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page: filters?.page || 1,
            size: filters?.size || 20,
            ...filters
          }
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Single Petty Cash Request
export const useGetPettyCashRequest = (id: string, enabled: boolean = true) => {
  return useQuery<PettyCashApiResponse<PettyCashRequest>>({
    queryKey: ["petty-cash-request", id],
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

// Create Petty Cash Request
export const useCreatePettyCashRequest = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PettyCashApiResponse<PettyCashRequest>,
    Error,
    CreatePettyCashRequest
  >({
    endpoint: BASE_URL,
    queryKey: ["petty-cash-requests"],
    isAuth: true,
    method: "POST",
  });

  const createRequest = async (requestData: CreatePettyCashRequest) => {
    try {
      console.log("Creating petty cash request:", requestData);

      // Prepare form data if attachments are included
      const formData = new FormData();

      // Add all request fields
      Object.entries(requestData).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value)) {
          // Handle file attachments
          value.forEach((file: File) => {
            formData.append('attachments', file);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await callApi(requestData);
      console.log("Petty cash request created:", result);
      return result;
    } catch (error) {
      console.error("Petty cash creation error:", error);
      throw error;
    }
  };

  return { createRequest, data, isLoading, isSuccess, error };
};

// Update Petty Cash Request
export const useUpdatePettyCashRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PettyCashApiResponse<PettyCashRequest>,
    Error,
    UpdatePettyCashRequest
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["petty-cash-requests", "petty-cash-request"],
    isAuth: true,
    method: "PATCH",
  });

  const updateRequest = async (requestData: UpdatePettyCashRequest) => {
    try {
      console.log("Updating petty cash request:", id, requestData);
      const result = await callApi(requestData);
      console.log("Petty cash request updated:", result);
      return result;
    } catch (error) {
      console.error("Petty cash update error:", error);
      throw error;
    }
  };

  return { updateRequest, data, isLoading, isSuccess, error };
};

// Delete Petty Cash Request
export const useDeletePettyCashRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    PettyCashApiResponse<null>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["petty-cash-requests"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteRequest = async () => {
    try {
      console.log("Deleting petty cash request:", id);
      const result = await callApi();
      console.log("Petty cash request deleted");
      return result;
    } catch (error) {
      console.error("Petty cash deletion error:", error);
      throw error;
    }
  };

  return { deleteRequest, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW OPERATIONS =====

// Submit for Approval
export const useSubmitPettyCashForApproval = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    PettyCashApiResponse<PettyCashRequest>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["petty-cash-requests", "petty-cash-request"],
    isAuth: true,
    method: "POST",
  });

  const submitForApproval = async () => {
    try {
      console.log("Submitting petty cash request for approval:", id);
      const result = await callApi();
      console.log("Petty cash request submitted for approval");
      return result;
    } catch (error) {
      console.error("Petty cash submission error:", error);
      throw error;
    }
  };

  return { submitForApproval, isLoading, isSuccess, error };
};

// Approve/Reject Petty Cash Request
export const useApprovePettyCashRequest = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    PettyCashApiResponse<PettyCashRequest>,
    Error,
    ApprovalAction
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["petty-cash-requests", "petty-cash-request"],
    isAuth: true,
    method: "POST",
  });

  const processApproval = async (approvalData: ApprovalAction) => {
    try {
      console.log("Processing approval for petty cash request:", id, approvalData);
      const result = await callApi(approvalData);
      console.log("Petty cash approval processed:", result);
      return result;
    } catch (error) {
      console.error("Petty cash approval error:", error);
      throw error;
    }
  };

  return { processApproval, isLoading, isSuccess, error };
};

// Mark as Paid
export const useMarkPettyCashAsPaid = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    PettyCashApiResponse<PettyCashRequest>,
    Error,
    { paymentNotes?: string; receiptNumber?: string }
  >({
    endpoint: `${BASE_URL}${id}/mark-paid/`,
    queryKey: ["petty-cash-requests", "petty-cash-request"],
    isAuth: true,
    method: "POST",
  });

  const markAsPaid = async (paymentData?: { paymentNotes?: string; receiptNumber?: string }) => {
    try {
      console.log("Marking petty cash request as paid:", id, paymentData);
      const result = await callApi(paymentData || {});
      console.log("Petty cash request marked as paid");
      return result;
    } catch (error) {
      console.error("Petty cash payment marking error:", error);
      throw error;
    }
  };

  return { markAsPaid, isLoading, isSuccess, error };
};

// ===== AUTHORIZERS MANAGEMENT =====

// Get Available Authorizers
export const useGetPettyCashAuthorizers = (enabled: boolean = true) => {
  return useQuery<PettyCashApiResponse<PettyCashAuthorizer[]>>({
    queryKey: ["petty-cash-authorizers"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}authorizers/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Get My Pending Approvals
export const useGetMyPendingApprovals = (enabled: boolean = true) => {
  return useQuery<PettyCashApiResponse<PettyCashRequest[]>>({
    queryKey: ["my-pending-approvals"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}my-pending-approvals/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: true,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// ===== REPORTING AND ANALYTICS =====

// Get Summary Statistics
export const useGetPettyCashSummary = (filters?: PettyCashFilters) => {
  return useQuery<PettyCashApiResponse<PettyCashSummary>>({
    queryKey: ["petty-cash-summary", filters],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}summary/`, {
          params: filters
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== EXPORT AND DOWNLOAD =====

// Export to Excel
export const useExportPettyCash = () => {
  const exportToExcel = async (options: ExportOptions) => {
    try {
      console.log("Exporting petty cash data:", options);
      const response = await AxiosWithToken.post(`${BASE_URL}export/`, options, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `petty-cash-export-${timestamp}.${options.format}`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("Export completed successfully");
      return true;
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  };

  return { exportToExcel };
};

// Download Approved Certificate PDF
export const useDownloadCertificate = () => {
  const downloadCertificate = async (id: string) => {
    try {
      console.log("Downloading certificate for request:", id);
      const response = await AxiosWithToken.get(`${BASE_URL}${id}/download-certificate/`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Get filename from response headers or generate one
      const contentDisposition = response.headers['content-disposition'];
      let filename = `petty-cash-certificate-${id}.pdf`;

      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("Certificate downloaded successfully");
      return true;
    } catch (error) {
      console.error("Certificate download error:", error);
      throw error;
    }
  };

  return { downloadCertificate };
};

// ===== BULK OPERATIONS =====

// Bulk Approve
export const useBulkApprovePettyCash = () => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    PettyCashApiResponse<{ processed: number; failed: number }>,
    Error,
    { requestIds: string[]; approvalComments?: string }
  >({
    endpoint: `${BASE_URL}bulk-approve/`,
    queryKey: ["petty-cash-requests"],
    isAuth: true,
    method: "POST",
  });

  const bulkApprove = async (requestIds: string[], approvalComments?: string) => {
    try {
      console.log("Bulk approving petty cash requests:", requestIds);
      const result = await callApi({ requestIds, approvalComments });
      console.log("Bulk approval completed:", result);
      return result;
    } catch (error) {
      console.error("Bulk approval error:", error);
      throw error;
    }
  };

  return { bulkApprove, isLoading, isSuccess, error };
};

// ===== UTILITY FUNCTIONS =====

// Get all active projects, departments, and locations
export const useGetPettyCashMetadata = () => {
  return useQuery<PettyCashApiResponse<{
    projects: string[];
    departments: string[];
    locations: string[];
    accountCodes: Array<{ code: string; description: string }>;
  }>>({
    queryKey: ["petty-cash-metadata"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}metadata/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 300000, // 5 minutes
  });
};