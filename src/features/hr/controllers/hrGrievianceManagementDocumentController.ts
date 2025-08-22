import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { GrievianceManagementDocument } from "../types/grieviance-management";

// API Response interface
interface ApiResponse<TData = unknown> {
  status: boolean;
  message: string;
  data: TData;
}

// Filter parameters interface
interface GrievianceManagementDocumentFilterParams {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

const BASE_URL = "hr/grievances/complaints/documents/";

// ===== GRIEVANCE MANAGEMENT DOCUMENT HOOKS =====

// Get Grievance Management Documents
export const useGetGrievianceManagementDocuments = ({
  status = "",
  search = "",
  page = 1,
  size = 20,
  enabled = true,
}: GrievianceManagementDocumentFilterParams = {}) => {
  return useQuery<ApiResponse<GrievianceManagementDocument[]>>({
    queryKey: ["grievance-management-documents", status, search, page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(status && { status }),
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

// Get Single Grievance Management Document
export const useGetGrievianceManagementDocument = (id: string, enabled: boolean = true) => {
  return useQuery<ApiResponse<GrievianceManagementDocument>>({
    queryKey: ["grievance-management-document", id],
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

// Create Grievance Management Document
export const useCreateGrievianceManagementDocument = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagementDocument,
    Error,
    Partial<GrievianceManagementDocument>
  >({
    endpoint: BASE_URL,
    queryKey: ["grievance-management-documents"],
    isAuth: true,
    method: "POST",
  });

  const createGrievianceManagementDocument = async (details: Partial<GrievianceManagementDocument>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grievance management document create error:", error);
    }
  };

  return { createGrievianceManagementDocument, data, isLoading, isSuccess, error };
};

// Update Grievance Management Document
export const useUpdateGrievianceManagementDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagementDocument,
    Error,
    Partial<GrievianceManagementDocument>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grievance-management-documents", "grievance-management-document"],
    isAuth: true,
    method: "PUT",
  });

  const updateGrievianceManagementDocument = async (details: Partial<GrievianceManagementDocument>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grievance management document update error:", error);
    }
  };

  return { updateGrievianceManagementDocument, data, isLoading, isSuccess, error };
};

// Patch Grievance Management Document
export const usePatchGrievianceManagementDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagementDocument,
    Error,
    Partial<GrievianceManagementDocument>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grievance-management-documents", "grievance-management-document"],
    isAuth: true,
    method: "PATCH",
  });

  const patchGrievianceManagementDocument = async (details: Partial<GrievianceManagementDocument>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grievance management document patch error:", error);
    }
  };

  return { patchGrievianceManagementDocument, data, isLoading, isSuccess, error };
};

// Delete Grievance Management Document
export const useDeleteGrievianceManagementDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GrievianceManagementDocument,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["grievance-management-documents"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteGrievianceManagementDocument = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Grievance management document delete error:", error);
    }
  };

  return { deleteGrievianceManagementDocument, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useCreateGrievianceManagementDocumentMutation = useCreateGrievianceManagementDocument;
export const useGetGrievianceManagementDocumentQuery = useGetGrievianceManagementDocument;
export const useGetGrievianceManagementDocumentsQuery = useGetGrievianceManagementDocuments;
export const useUpdateGrievianceManagementDocumentMutation = useUpdateGrievianceManagementDocument;
export const useDeleteGrievianceManagementDocumentMutation = useDeleteGrievianceManagementDocument;