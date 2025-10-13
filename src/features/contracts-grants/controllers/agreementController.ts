import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IAgreementPaginatedData,
  IAgreementSingleData,
  TAgreementFormData,
} from "../types/contract-management/agreement";

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
interface AgreementFilterParams {
  page?: number;
  size?: number;
  search?: string;
  type?: string;
  enabled?: boolean;
}

const BASE_URL = "/contract-grants/agreements/"; // From original service

// ===== AGREEMENT HOOKS =====

// Get All Agreements (Paginated)
export const useGetAllAgreements = ({
  page = 1,
  size = 20,
  search = "",
  type = "",
  enabled = true,
}: AgreementFilterParams) => {
  return useQuery<PaginatedResponse<IAgreementPaginatedData>>({
    queryKey: ["agreements", page, size, search, type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(type && { type }),
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

// Get Single Agreement
export const useGetSingleAgreement = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<IAgreementSingleData>>({
    queryKey: ["agreement", id],
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

// Create Agreement
export const useCreateAgreement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAgreementSingleData,
    Error,
    TAgreementFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["agreements"],
    isAuth: true,
    method: "POST",
  });

  const createAgreement = async (details: TAgreementFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Agreement create error:", error);
    }
  };

  return { createAgreement, data, isLoading, isSuccess, error };
};

// Update Agreement
export const useUpdateAgreement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAgreementSingleData,
    Error,
    TAgreementFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "PUT",
  });

  const updateAgreement = async (details: TAgreementFormData) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Agreement update error:", error);
    }
  };

  return { updateAgreement, data, isLoading, isSuccess, error };
};

// Delete Agreement
export const useDeleteAgreement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IAgreementSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["agreements"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteAgreement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Agreement delete error:", error);
    }
  };

  return { deleteAgreement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllAgreementsQuery = useGetAllAgreements;
export const useGetSingleAgreementQuery = useGetSingleAgreement;
export const useCreateAgreementMutation = useCreateAgreement;
export const useModifyAgreementMutation = useUpdateAgreement;
export const useDeleteAgreementMutation = useDeleteAgreement;

// Missing named export
export const useModifyAgreement = useUpdateAgreement;

// Upload Contract Document
export const useUploadContractDocument = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    FormData
  >(({
    endpoint: `${BASE_URL}${agreementId}/upload-document/`,
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "POST",
  }));

  const uploadDocument = async (formData: FormData) => {
    try {
      await callApi(formData);
    } catch (error) {
      console.error("Document upload error:", error);
    }
  };

  return { uploadDocument, data, isLoading, isSuccess, error };
};

// Submit Agreement for Approval
export const useSubmitAgreement = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    Record<string, never>
  >(({
    endpoint: `${BASE_URL}${agreementId}/submit/`,
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "POST",
  }));

  const submitAgreement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Agreement submit error:", error);
    }
  };

  return { submitAgreement, data, isLoading, isSuccess, error };
};

// Create Contract Modification (Extension)
// Note: Backend uses /extend/ endpoint for extensions and direct amendment creation for other types
export const useCreateContractModification = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    any
  >(({
    endpoint: `${BASE_URL}${agreementId}/extend/`, // Using existing extend endpoint
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "POST",
  }));

  const createModification = async (modificationData: any) => {
    try {
      await callApi(modificationData);
    } catch (error) {
      console.error("Contract modification error:", error);
    }
  };

  return { createModification, data, isLoading, isSuccess, error };
};

// Get Agreement Documents
export const useGetAgreementDocuments = (agreementId: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ["agreement-documents", agreementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${agreementId}/documents/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!agreementId,
    refetchOnWindowFocus: false,
  });
};

// Delete Contract Document
export const useDeleteContractDocument = (agreementId: string, documentId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    Record<string, never>
  >(({
    endpoint: `${BASE_URL}${agreementId}/documents/${documentId}/`,
    queryKey: ["agreements", "agreement", "agreement-documents"],
    isAuth: true,
    method: "DELETE",
  }));

  const deleteDocument = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Document delete error:", error);
    }
  };

  return { deleteDocument, data, isLoading, isSuccess, error };
};

// Approve Agreement
export const useApproveAgreement = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    Record<string, never>
  >(({
    endpoint: `${BASE_URL}${agreementId}/approve_agreement/`,
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "POST",
  }));

  const approveAgreement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Agreement approval error:", error);
    }
  };

  return { approveAgreement, data, isLoading, isSuccess, error };
};

// Reject Agreement
export const useRejectAgreement = (agreementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    { reason: string }
  >(({
    endpoint: `${BASE_URL}${agreementId}/reject/`,
    queryKey: ["agreements", "agreement"],
    isAuth: true,
    method: "POST",
  }));

  const rejectAgreement = async (reason: string) => {
    try {
      await callApi({ reason });
    } catch (error) {
      console.error("Agreement rejection error:", error);
    }
  };

  return { rejectAgreement, data, isLoading, isSuccess, error };
};