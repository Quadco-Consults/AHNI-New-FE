import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  VendorsDocumentData,
  VendorsDocumentResponse,
  VendorsDocumentResultsData,
} from "../types/vendors-document";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/vendor-documents/";

// ===== VENDOR DOCUMENTS HOOKS =====

// Get All Vendor Documents
export const useGetAllVendorDocuments = ({
  page = 1,
  size = 20,
  search = "",
  vendor = "",
  enabled = true,
}: TRequest & { vendor?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<VendorsDocumentData>>({
    queryKey: ["vendor-documents", page, size, search, vendor],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, vendor },
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

// Get Single Vendor Document
export const useGetSingleVendorDocument = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<VendorsDocumentResultsData>>({
    queryKey: ["vendor-document", id],
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

// Create Vendor Document
export const useCreateVendorDocument = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsDocumentResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["vendor-documents"],
    isAuth: true,
    method: "POST",
  });

  const createVendorDocument = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor document create error:", error);
    }
  };

  return { createVendorDocument, data, isLoading, isSuccess, error };
};

// Update Vendor Document (Full Update)
export const useUpdateVendorDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsDocumentResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-documents", "vendor-document"],
    isAuth: true,
    method: "PUT",
  });

  const updateVendorDocument = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor document update error:", error);
    }
  };

  return { updateVendorDocument, data, isLoading, isSuccess, error };
};

// Modify Vendor Document (Partial Update)
export const useModifyVendorDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorsDocumentResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-documents", "vendor-document"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyVendorDocument = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor document modify error:", error);
    }
  };

  return { modifyVendorDocument, data, isLoading, isSuccess, error };
};

// Delete Vendor Document
export const useDeleteVendorDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["vendor-documents"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteVendorDocument = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Vendor document delete error:", error);
    }
  };

  return { deleteVendorDocument, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetVendorDocumentsQuery = useGetAllVendorDocuments;
export const useGetVendorDocumentQuery = useGetSingleVendorDocument;
export const useCreateVendorDocumentMutation = useCreateVendorDocument;
export const useUpdateVendorDocumentMutation = useUpdateVendorDocument;
export const useModifyVendorDocumentMutation = useModifyVendorDocument;
export const useDeleteVendorDocumentMutation = useDeleteVendorDocument;

// Default export for backward compatibility
const VendorsDocumentAPI = {
  useGetAllVendorDocuments,
  useGetSingleVendorDocument,
  useCreateVendorDocument,
  useUpdateVendorDocument,
  useModifyVendorDocument,
  useDeleteVendorDocument,
  useGetVendorDocumentsQuery,
  useGetVendorDocumentQuery,
  useCreateVendorDocumentMutation,
  useUpdateVendorDocumentMutation,
  useModifyVendorDocumentMutation,
  useDeleteVendorDocumentMutation,
};

export default VendorsDocumentAPI;