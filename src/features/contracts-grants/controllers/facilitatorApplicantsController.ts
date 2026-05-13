import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IFacilitatorApplicantPaginatedData,
  IFacilitatorApplicantSingleData,
  TFacilitatorApplicantFormData,
} from "../types/contract-management/facilitator-management/facilitator-application";

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
interface FacilitatorApplicantsFilterParams {
  page?: number;
  size?: number;
  search?: string;
  facilitator_id?: string; // For backward compatibility
  facilitators?: string; // Many-to-many field (preferred)
  status?: string;
  enabled?: boolean;
}

// Extended form data interface for creation
interface TFacilitatorApplicantCreateFormData extends TFacilitatorApplicantFormData {
  facilitator_id: string;
}

const BASE_URL = "/contract-grants/facilitator/applicants/"; // Following consultancy pattern

// ===== FACILITATOR APPLICANTS HOOKS =====

// Get All Facilitator Applicants (Paginated)
export const useGetAllFacilitatorApplicants = ({
  page = 1,
  size = 20,
  search = "",
  facilitator_id = "",
  facilitators = "",
  status = "",
  enabled = true,
}: FacilitatorApplicantsFilterParams) => {
  return useQuery<PaginatedResponse<IFacilitatorApplicantPaginatedData>>({
    queryKey: [
      "facilitatorApplicants",
      page,
      size,
      search,
      facilitator_id,
      facilitators,
      status,
    ],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            ...(search && { search }),
            ...(facilitators && { facilitators }), // Use facilitators if provided
            ...(facilitator_id && !facilitators && { facilitator_id }), // Fallback to facilitator_id
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

// Get Single Facilitator Applicant
export const useGetSingleFacilitatorApplicant = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IFacilitatorApplicantSingleData>>({
    queryKey: ["facilitatorApplicant", id],
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

// Create Facilitator Applicant
export const useCreateFacilitatorApplicant = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilitatorApplicantSingleData,
    Error,
    TFacilitatorApplicantCreateFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["facilitatorApplicants"],
    isAuth: true,
    method: "POST",
  });

  const createFacilitatorApplicant = async (
    details: TFacilitatorApplicantCreateFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facilitator applicant create error:", error);
    }
  };

  return { createFacilitatorApplicant, data, isLoading, isSuccess, error };
};

// Update Facilitator Applicant
export const useUpdateFacilitatorApplicant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilitatorApplicantSingleData,
    Error,
    Partial<TFacilitatorApplicantFormData>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["facilitatorApplicants", "facilitatorApplicant"],
    isAuth: true,
    method: "PATCH",
  });

  const updateFacilitatorApplicant = async (
    details: Partial<TFacilitatorApplicantFormData>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facilitator applicant update error:", error);
    }
  };

  return { updateFacilitatorApplicant, data, isLoading, isSuccess, error };
};

// Update Facilitator Applicant Status (for select/reject actions)
export const useUpdateFacilitatorApplicantStatus = () => {
  const updateFacilitatorApplicantStatus = async (
    applicantId: string,
    action: "SELECTED" | "REJECTED"
  ) => {
    try {
      // Map frontend status to backend status
      // Backend uses "APPROVED" instead of "SELECTED"
      const backendStatus = action === "SELECTED" ? "APPROVED" : "REJECTED";

      console.log("🔍 Updating facilitator applicant status:", {
        applicantId,
        frontendAction: action,
        backendStatus: backendStatus,
        endpoint: `${BASE_URL}${applicantId}/`,
        payload: { status: backendStatus }
      });

      const response = await AxiosWithToken.patch(`${BASE_URL}${applicantId}/`, {
        status: backendStatus
      });

      console.log("✅ Status update successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Facilitator applicant status update error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);

      // Re-throw with more context
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.response?.data?.detail
        || error.message
        || "Failed to update status";

      throw new Error(errorMessage);
    }
  };

  return { updateFacilitatorApplicantStatus, isLoading: false, isSuccess: false, error: null };
};

// Delete Facilitator Applicant
export const useDeleteFacilitatorApplicant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IFacilitatorApplicantSingleData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["facilitatorApplicants"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFacilitatorApplicant = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Facilitator applicant delete error:", error);
    }
  };

  return { deleteFacilitatorApplicant, data, isLoading, isSuccess, error };
};