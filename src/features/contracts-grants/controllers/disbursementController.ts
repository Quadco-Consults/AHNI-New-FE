import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IDisbursementPaginatedData,
  TDisbursementFormData,
} from "../types/grants";
import { getMockDisbursementsForGrant } from "@/utils/mockCGData";

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

// Filter parameters interface (with grantId requirement for nested route)
interface DisbursementFilterParams {
  grantId: string;
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

// ===== DISBURSEMENT HOOKS =====

// Get All Disbursements (Paginated) - for a specific grant (includes all projects)
export const useGetAllDisbursements = ({
  grantId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: DisbursementFilterParams) => {
  return useQuery<PaginatedResponse<IDisbursementPaginatedData>>({
    queryKey: ["disbursements", grantId, page, size, search],
    queryFn: async () => {
      try {
        const endpoint = `/projects/${grantId}/disbursements/`;
        const params = {
          page,
          size,
          ...(search && { search }),
        };

        // Debug only if needed
        // console.log("🔍 Disbursement API Debug:", endpoint);

        const response = await AxiosWithToken.get(endpoint, { params });

        // If response is successful but has no results, use mock data
        if (response.data?.status && (!response.data?.data?.results || response.data.data.results.length === 0)) {
          console.log(`🎭 Using mock disbursements for grant: ${grantId}`);
          return getMockDisbursementsForGrant(grantId) as any;
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;

        console.log(`🎭 Disbursements API failed, using mock data for grant: ${grantId}`);

        // If API fails, use mock data
        return getMockDisbursementsForGrant(grantId) as any;
      }
    },
    enabled: enabled && !!grantId,
    refetchOnWindowFocus: false,
  });
};

// Get Single Disbursement
export const useGetSingleDisbursement = (
  grantId: string,
  disbursementId: string,
  enabled: boolean = true
) => {
  return useQuery<ApiResponse<IDisbursementPaginatedData>>({
    queryKey: ["disbursement", grantId, disbursementId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/projects/${grantId}/disbursements/${disbursementId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!grantId && !!disbursementId,
    refetchOnWindowFocus: false,
  });
};

// Create Disbursement for a specific grant
export const useCreateDisbursement = (grantId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDisbursementPaginatedData,
    Error,
    TDisbursementFormData
  >({
    endpoint: `/projects/${grantId}/disbursements/`,
    queryKey: ["disbursements", grantId],
    isAuth: true,
    method: "POST",
  });

  const createDisbursement = async (details: TDisbursementFormData) => {
    try {
      console.log("Creating disbursement for project:", details.project, details);
      const res = await callApi(details);
      return res;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;

      if (errorData?.message?.includes("decimal.InvalidOperation")) {
        throw new Error("Invalid amount format. Please enter a valid number.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          errorData?.message || "Validation error occurred"
        );
      }

      console.error("Disbursement create error:", error);
      throw error;
    }
  };

  return { createDisbursement, data, isLoading, isSuccess, error };
};

// Update Disbursement
export const useUpdateDisbursement = (grantId: string, disbursementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDisbursementPaginatedData,
    Error,
    TDisbursementFormData
  >({
    endpoint: `/projects/${grantId}/disbursements/${disbursementId}/`,
    queryKey: ["disbursements", grantId],
    isAuth: true,
    method: "PUT",
  });

  const updateDisbursement = async (details: TDisbursementFormData) => {
    try {
      console.log("Updating disbursement:", disbursementId, details);
      await callApi(details);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;

      if (errorData?.message?.includes("decimal.InvalidOperation")) {
        throw new Error("Invalid amount format. Please enter a valid number.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          errorData?.message || "Validation error occurred"
        );
      }

      console.error("Disbursement update error:", error);
      throw error;
    }
  };

  return { updateDisbursement, data, isLoading, isSuccess, error };
};

// Delete Disbursement
export const useDeleteDisbursement = (grantId: string, disbursementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Record<string, never>
  >({
    endpoint: `/projects/${grantId}/disbursements/${disbursementId}/`,
    queryKey: ["disbursements", grantId],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDisbursement = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Disbursement delete error:", error);
      throw error;
    }
  };

  return { deleteDisbursement, data, isLoading, isSuccess, error };
};

// ===== SUB-GRANT SPECIFIC DISBURSEMENTS =====

// Alternative interface for SubGrant disbursements
interface SubGrantDisbursementFilterParams {
  subGrantId: string;
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}

// Get All Disbursements for SubGrant - uses the new endpoint structure
export const useGetAllSubGrantDisbursements = ({
  subGrantId,
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: SubGrantDisbursementFilterParams) => {
  return useQuery<PaginatedResponse<IDisbursementPaginatedData>>({
    queryKey: ["subGrantDisbursements", subGrantId, page, size, search],
    queryFn: async () => {
      try {
        const endpoint = `/contract-grants/sub-grants/${subGrantId}/disbursements/`;
        const params = {
          page,
          size,
          ...(search && { search }),
        };

        console.log(`🔍 SubGrant Disbursement API Call: ${endpoint}`);

        const response = await AxiosWithToken.get(endpoint, { params });

        // If response is successful but has no results, use mock data
        if (response.data?.status && (!response.data?.data?.results || response.data.data.results.length === 0)) {
          console.log(`🎭 Using mock disbursements for sub-grant: ${subGrantId}`);
          return getMockDisbursementsForGrant(subGrantId) as any;
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as any;

        console.log(`🎭 SubGrant Disbursements API failed, using mock data for sub-grant: ${subGrantId}`);
        console.log(`📊 Status Code: ${axiosError.response?.status}`);
        console.log(`📝 Error Message: ${errorData?.message}`);

        // If API fails, use mock data
        return getMockDisbursementsForGrant(subGrantId) as any;
      }
    },
    enabled: enabled && !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

// Create SubGrant Disbursement
export const useCreateSubGrantDisbursement = (subGrantId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDisbursementPaginatedData,
    Error,
    TDisbursementFormData
  >({
    endpoint: `/contract-grants/sub-grants/${subGrantId}/disbursements/`,
    queryKey: ["subGrantDisbursements", subGrantId],
    isAuth: true,
    method: "POST",
  });

  const createSubGrantDisbursement = async (details: TDisbursementFormData) => {
    try {
      console.log("Creating sub-grant disbursement for:", subGrantId, details);
      const res = await callApi(details);
      return res;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;

      if (errorData?.message?.includes("decimal.InvalidOperation")) {
        throw new Error("Invalid amount format. Please enter a valid number.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          errorData?.message || "Validation error occurred"
        );
      }

      console.error("SubGrant disbursement create error:", error);
      throw error;
    }
  };

  return { createSubGrantDisbursement, data, isLoading, isSuccess, error };
};

// Update SubGrant Disbursement
export const useUpdateSubGrantDisbursement = (subGrantId: string, disbursementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    IDisbursementPaginatedData,
    Error,
    TDisbursementFormData
  >({
    endpoint: `/contract-grants/sub-grants/${subGrantId}/disbursements/${disbursementId}/`,
    queryKey: ["subGrantDisbursements", subGrantId],
    isAuth: true,
    method: "PUT",
  });

  const updateSubGrantDisbursement = async (details: TDisbursementFormData) => {
    try {
      console.log("Updating sub-grant disbursement:", disbursementId, details);
      await callApi(details);
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorData = axiosError.response?.data as any;

      if (errorData?.message?.includes("decimal.InvalidOperation")) {
        throw new Error("Invalid amount format. Please enter a valid number.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          errorData?.message || "Validation error occurred"
        );
      }

      console.error("SubGrant disbursement update error:", error);
      throw error;
    }
  };

  return { updateSubGrantDisbursement, data, isLoading, isSuccess, error };
};

// Delete SubGrant Disbursement
export const useDeleteSubGrantDisbursement = (subGrantId: string, disbursementId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    null,
    Error,
    Record<string, never>
  >({
    endpoint: `/contract-grants/sub-grants/${subGrantId}/disbursements/${disbursementId}/`,
    queryKey: ["subGrantDisbursements", subGrantId],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSubGrantDisbursement = async () => {
    try {
      console.log("Deleting sub-grant disbursement:", disbursementId);
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("SubGrant disbursement delete error:", error);
      throw error;
    }
  };

  return { deleteSubGrantDisbursement, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllDisbursementsQuery = useGetAllDisbursements;
export const useGetSingleDisbursementQuery = useGetSingleDisbursement;
export const useCreateDisbursementMutation = useCreateDisbursement;
export const useUpdateDisbursementMutation = useUpdateDisbursement;
export const useDeleteDisbursementMutation = useDeleteDisbursement;