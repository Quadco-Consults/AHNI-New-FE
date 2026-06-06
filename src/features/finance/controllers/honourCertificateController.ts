import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  HonourCertificate,
  CreateHonourCertificateRequest,
  UpdateHonourCertificateRequest,
  ApprovalAction,
  MarkPaidRequest,
  HonourCertificateFilters,
  HonourCertificateSummary,
  HonourCertificateMetadata,
  HonourCertificateApiResponse,
  ExportOptions
} from "../types/honour-certificate.types";

const BASE_URL = "/finance/honour-certificates/";

// ===== HONOUR CERTIFICATE CRUD OPERATIONS =====

/**
 * Get all honour certificates with filtering
 */
export const useGetHonourCertificates = (filters?: HonourCertificateFilters & { page?: number; size?: number }) => {
  return useQuery<HonourCertificateApiResponse<HonourCertificate[]>>({
    queryKey: ["honour-certificates", filters],
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

/**
 * Get single honour certificate
 */
export const useGetHonourCertificate = (id: string, enabled: boolean = true) => {
  return useQuery<HonourCertificateApiResponse<HonourCertificate>>({
    queryKey: ["honour-certificate", id],
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

/**
 * Create honour certificate
 */
export const useCreateHonourCertificate = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HonourCertificateApiResponse<HonourCertificate>,
    Error,
    CreateHonourCertificateRequest
  >({
    endpoint: BASE_URL,
    queryKey: ["honour-certificates"],
    isAuth: true,
    method: "POST",
  });

  const createCertificate = async (certificateData: CreateHonourCertificateRequest) => {
    try {
      console.log("Creating honour certificate:", certificateData);

      // Prepare form data if attachments are included
      const formData = new FormData();

      // Add all certificate fields
      Object.entries(certificateData).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value)) {
          // Handle file attachments
          value.forEach((file: File) => {
            formData.append('attachments', file);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await callApi(certificateData);
      console.log("Honour certificate created:", result);
      return result;
    } catch (error) {
      console.error("Honour certificate creation error:", error);
      throw error;
    }
  };

  return { createCertificate, data, isLoading, isSuccess, error };
};

/**
 * Update honour certificate
 */
export const useUpdateHonourCertificate = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    HonourCertificateApiResponse<HonourCertificate>,
    Error,
    UpdateHonourCertificateRequest
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["honour-certificates", "honour-certificate"],
    isAuth: true,
    method: "PATCH",
  });

  const updateCertificate = async (certificateData: UpdateHonourCertificateRequest) => {
    try {
      console.log("Updating honour certificate:", id, certificateData);
      const result = await callApi(certificateData);
      console.log("Honour certificate updated:", result);
      return result;
    } catch (error) {
      console.error("Honour certificate update error:", error);
      throw error;
    }
  };

  return { updateCertificate, data, isLoading, isSuccess, error };
};

/**
 * Delete honour certificate
 */
export const useDeleteHonourCertificate = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    HonourCertificateApiResponse<null>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["honour-certificates"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteCertificate = async () => {
    try {
      console.log("Deleting honour certificate:", id);
      const result = await callApi();
      console.log("Honour certificate deleted");
      return result;
    } catch (error) {
      console.error("Honour certificate deletion error:", error);
      throw error;
    }
  };

  return { deleteCertificate, isLoading, isSuccess, error };
};

// ===== APPROVAL WORKFLOW OPERATIONS =====

/**
 * Submit honour certificate for approval
 */
export const useSubmitHonourCertificate = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    HonourCertificateApiResponse<HonourCertificate>,
    Error,
    void
  >({
    endpoint: `${BASE_URL}${id}/submit/`,
    queryKey: ["honour-certificates", "honour-certificate"],
    isAuth: true,
    method: "POST",
  });

  const submitForApproval = async () => {
    try {
      console.log("Submitting honour certificate for approval:", id);
      const result = await callApi();
      console.log("Honour certificate submitted for approval");
      return result;
    } catch (error) {
      console.error("Honour certificate submission error:", error);
      throw error;
    }
  };

  return { submitForApproval, isLoading, isSuccess, error };
};

/**
 * Approve/Reject honour certificate
 */
export const useApproveHonourCertificate = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    HonourCertificateApiResponse<HonourCertificate>,
    Error,
    ApprovalAction
  >({
    endpoint: `${BASE_URL}${id}/approve/`,
    queryKey: ["honour-certificates", "honour-certificate"],
    isAuth: true,
    method: "POST",
  });

  const processApproval = async (approvalData: ApprovalAction) => {
    try {
      console.log("Processing approval for honour certificate:", id, approvalData);
      const result = await callApi(approvalData);
      console.log("Honour certificate approval processed:", result);
      return result;
    } catch (error) {
      console.error("Honour certificate approval error:", error);
      throw error;
    }
  };

  return { processApproval, isLoading, isSuccess, error };
};

/**
 * Mark honour certificate as paid
 */
export const useMarkHonourCertificateAsPaid = (id: string) => {
  const { callApi, isLoading, isSuccess, error } = useApiManager<
    HonourCertificateApiResponse<HonourCertificate>,
    Error,
    MarkPaidRequest
  >({
    endpoint: `${BASE_URL}${id}/mark-paid/`,
    queryKey: ["honour-certificates", "honour-certificate"],
    isAuth: true,
    method: "POST",
  });

  const markAsPaid = async (paymentData?: MarkPaidRequest) => {
    try {
      console.log("Marking honour certificate as paid:", id, paymentData);
      const result = await callApi(paymentData || {});
      console.log("Honour certificate marked as paid");
      return result;
    } catch (error) {
      console.error("Honour certificate payment marking error:", error);
      throw error;
    }
  };

  return { markAsPaid, isLoading, isSuccess, error };
};

// ===== MY PENDING APPROVALS =====

/**
 * Get honour certificates pending my approval
 */
export const useGetMyPendingCertificateApprovals = (enabled: boolean = true) => {
  return useQuery<HonourCertificateApiResponse<HonourCertificate[]>>({
    queryKey: ["my-pending-certificate-approvals"],
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

/**
 * Get summary statistics
 */
export const useGetHonourCertificateSummary = (filters?: HonourCertificateFilters) => {
  return useQuery<HonourCertificateApiResponse<HonourCertificateSummary>>({
    queryKey: ["honour-certificate-summary", filters],
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

/**
 * Export honour certificates to Excel/PDF
 */
export const useExportHonourCertificates = () => {
  const exportCertificates = async (options: ExportOptions) => {
    try {
      console.log("Exporting honour certificates:", options);
      const response = await AxiosWithToken.post(`${BASE_URL}export/`, options, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `honour-certificates-${timestamp}.${options.format}`);

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

  return { exportCertificates };
};

/**
 * Download honour certificate PDF
 */
export const useDownloadHonourCertificate = () => {
  const downloadCertificate = async (id: string) => {
    try {
      console.log("Downloading certificate:", id);
      const response = await AxiosWithToken.get(`${BASE_URL}${id}/download-certificate/`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Get filename from response headers or generate one
      const contentDisposition = response.headers['content-disposition'];
      let filename = `honour-certificate-${id}.pdf`;

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

// ===== METADATA =====

/**
 * Get metadata for honour certificates (projects, departments, etc.)
 */
export const useGetHonourCertificateMetadata = () => {
  return useQuery<HonourCertificateApiResponse<HonourCertificateMetadata>>({
    queryKey: ["honour-certificate-metadata"],
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

// ===== HELPER FUNCTIONS =====

/**
 * Get status badge color
 */
export const getCertificateStatusColor = (
  status: string
): "default" | "warning" | "success" | "destructive" => {
  switch (status) {
    case "draft":
      return "default";
    case "pending_approval":
      return "warning";
    case "approved":
      return "success";
    case "paid":
      return "success";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

/**
 * Format service type label
 */
export const formatServiceType = (type: string): string => {
  const types: Record<string, string> = {
    facilitation: "Facilitation",
    training: "Training",
    consultation: "Consultation",
    volunteer_allowance: "Volunteer Allowance",
  };
  return types[type] || type;
};

/**
 * Format currency amount
 */
export const formatCurrencyAmount = (
  amount: number,
  currency: string = "NGN"
): string => {
  const currencySymbol = currency === "NGN" ? "₦" : "$";
  return `${currencySymbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
