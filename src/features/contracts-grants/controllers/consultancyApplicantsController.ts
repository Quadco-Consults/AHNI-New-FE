import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IConsultancyStaffPaginatedData,
  IConsultancyStaffSingleData,
  TConsultancyStaffFormData,
  TExistingApplicantFormData,
} from "../types/contract-management/consultancy-management/consultancy-application";

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
    pagination: {
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
interface ConsultancyApplicantsFilterParams {
  page?: number;
  size?: number;
  search?: string;
  consultants?: string;
  consultant_id?: string;
  status?: string;
  enabled?: boolean;
}

// Extended form data interface for creation with documents
interface TConsultancyStaffCreateFormData extends TConsultancyStaffFormData {
  documents: { name: string; document: any }[];
}

// Extended form data interface for updates with documents
interface TConsultancyStaffUpdateFormData extends TConsultancyStaffFormData {
  documents: { name: string; document: any }[];
}

const BASE_URL = "/contract-grants/consultancy/applicants/"; // From original service

// ===== CONSULTANCY APPLICANTS HOOKS =====

// Get All Consultancy Staff (Paginated)
export const useGetAllConsultancyApplicants = ({
  page = 1,
  size = 20,
  search = "",
  consultants = "",
  consultant_id = "",
  enabled = true,
  status,
}: ConsultancyApplicantsFilterParams) => {
  return useQuery<PaginatedResponse<IConsultancyStaffPaginatedData>>({
    queryKey: [
      "consultancyApplicants",
      page,
      size,
      search,
      consultants,
      consultant_id,
      status,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(consultants && { consultants }),
            ...(consultant_id && { consultant_id }),
            status,
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

// Get Single Consultancy Staff
export const useGetSingleConsultancyApplicant = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IConsultancyStaffSingleData>>({
    queryKey: ["consultancyApplicant", id],
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

// Create Consultancy Staff
export const useCreateConsultancyApplicant = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyStaffSingleData,
    Error,
    TConsultancyStaffCreateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["consultancyApplicants"],
    isAuth: true,
    method: "POST",
  });

  const createConsultancyApplicant = async (
    details: TConsultancyStaffCreateFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultancy applicant create error:", error);
    }
  };

  return { createConsultancyApplicant, data, isLoading, isSuccess, error };
};

// Create Existing Applicant Staff
export const useCreateExistingConsultancyApplicant = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyStaffSingleData,
    Error,
    TExistingApplicantFormData
  >({
    endpoint: `${BASE_URL}existing/`,
    queryKey: ["consultancyApplicants"],
    isAuth: true,
    method: "POST",
  });

  const createExistingConsultancyApplicant = async (
    details: TExistingApplicantFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Existing consultancy applicant create error:", error);
    }
  };

  return {
    createExistingConsultancyApplicant,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Update Consultancy Staff
export const useUpdateConsultancyApplicant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyStaffSingleData,
    Error,
    TConsultancyStaffUpdateFormData
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultancyApplicants", "consultancyApplicant"],
    isAuth: true,
    method: "PATCH",
  });

  const updateConsultancyApplicant = async (
    details: TConsultancyStaffUpdateFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Consultancy applicant update error:", error);
    }
  };

  return { updateConsultancyApplicant, data, isLoading, isSuccess, error };
};

// Delete Consultancy Staff
export const useDeleteConsultancyApplicant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IConsultancyStaffSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["consultancyApplicants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteConsultancyApplicant = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Consultancy applicant delete error:", error);
    }
  };

  return { deleteConsultancyApplicant, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility with RTK Query naming
export const useGetAllConsultancyStaffs = useGetAllConsultancyApplicants;
export const useGetAllConsultancyStaffsQuery = useGetAllConsultancyApplicants;
export const useGetSingleConsultancyStaff = useGetSingleConsultancyApplicant;
export const useGetSingleConsultancyStaffQuery =
  useGetSingleConsultancyApplicant;
export const useCreateConsultancyStaffMutation = useCreateConsultancyApplicant;
export const useCreateExistingApplicantStaffMutation =
  useCreateExistingConsultancyApplicant;
export const useModifyConsultancyStaffMutation = useUpdateConsultancyApplicant;
export const useDeleteConsultancyStaffMutation = useDeleteConsultancyApplicant;
