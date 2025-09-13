import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IConsultantPaginatedData,
  IConsultantSingleData,
  TConsultantanagementDetailsFormData,
  TScopeOfWorkFormData,
} from "../types/contract-management/consultancy-management/consultancy-management";

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
interface ConsultantManagementFilterParams {
  page?: number;
  size?: number;
  search?: string;
  type?: string;
  enabled?: boolean;
}

// Combined form data interface for creation
interface TConsultantManagementCreateFormData
  extends TConsultantanagementDetailsFormData,
    TScopeOfWorkFormData {
  type: "CONSULTANT" | "ADHOC";
}

// Combined form data interface for updates
interface TConsultantManagementUpdateFormData
  extends TConsultantanagementDetailsFormData,
    TScopeOfWorkFormData {}

const BASE_URL = "/contract-grants/consultancy/applicants/"; // Fixed: Should use consultancy applicants endpoint

// ===== CONSULTANT MANAGEMENT HOOKS =====

// Get All Consultant Managements (Paginated)
export const useGetAllConsultantManagements = ({
  page = 1,
  size = 20,
  search = "",
  type = "",
  enabled = true,
}: ConsultantManagementFilterParams) => {
  return useQuery<PaginatedResponse<IConsultantPaginatedData>>({
    queryKey: ["consultantManagements", page, size, search, type],
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
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get All Existing Consultants (Paginated)
export const useGetAllExistingConsultants = ({
  page = 1,
  size = 20,
  search = "",
  type = "",
  enabled = true,
}: ConsultantManagementFilterParams) => {
  return useQuery<PaginatedResponse<IConsultantPaginatedData>>({
    queryKey: ["existingConsultants", page, size, search, type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}applicants/existing`,
          {
            params: {
              page,
              size,
              ...(search && { search }),
              ...(type && { type }),
            },
          }
        );
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

// Get Single Consultant Management
export const useGetSingleConsultantManagement = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IConsultantSingleData>>({
    queryKey: ["consultantManagement", id],
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

// Create Consultant Management
export const useCreateConsultantManagement = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultantSingleData,
    Error,
    TConsultantManagementCreateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["consultantManagements"],
    isAuth: true,
    method: "POST",
  });

  const createConsultantManagement = async (
    details: TConsultantManagementCreateFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultant management create error:", error);
    }
  };

  return { createConsultantManagement, data, isLoading, isSuccess, error };
};

// Update Consultant Management
export const useUpdateConsultantManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultantSingleData,
    Error,
    TConsultantManagementUpdateFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultantManagements", "consultantManagement"],
    isAuth: true,
    method: "PATCH",
  });

  const updateConsultantManagement = async (
    details: TConsultantManagementUpdateFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultant management update error:", error);
    }
  };

  return { updateConsultantManagement, data, isLoading, isSuccess, error };
};

// Delete Consultant Management
export const useDeleteConsultantManagement = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultantSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultantManagements"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteConsultantManagement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Consultant management delete error:", error);
    }
  };

  return { deleteConsultantManagement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllConsultantManagementsQuery =
  useGetAllConsultantManagements;
export const useGetSingleConsultantManagementQuery =
  useGetSingleConsultantManagement;
export const useGetAllExistingConsultantsQuery = useGetAllExistingConsultants;
export const useCreateConsultantManagementMutation =
  useCreateConsultantManagement;
export const useModifyConsultantManagementMutation =
  useUpdateConsultantManagement;
export const useDeleteConsultantManagementMutation =
  useDeleteConsultantManagement;

// Missing named exports
export const useModifyConsultantManagement = useUpdateConsultantManagement;
export const useGetAllConsultancyStaffs = useGetAllExistingConsultants;
export const useGetSingleConsultancyStaff = useGetSingleConsultantManagement;
export const useCreateExistingApplicantStaff = useCreateConsultantManagement;
export const useCreateConsultancyStaff = useCreateConsultantManagement;
export const useModifyConsultancyStaff = useUpdateConsultantManagement;
