import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import Axios from "@/constants/api_management/MyHttpHelper";
import { AxiosError } from "axios";
import { useGetPublicOpportunity } from "./solicitationController";
import {
  EOIData,
  EOIResponse,
  EOIResultsData,
} from "../types/eoi";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "procurements/eoi/";

// ===== EOI HOOKS =====

// Get All EOIs
export const useGetAllEois = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
  ordering = "-created_datetime", // Order by newest first
}: TRequest & { enabled?: boolean; ordering?: string }) => {
  return useQuery<TPaginatedResponse<EOIData>>({
    queryKey: ["eois", page, size, search, status, ordering],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: {
            page,
            size,
            search,
            status,
            ...(ordering && { ordering })
          },
        });
        console.log("EOI API response:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch when component mounts to ensure fresh data
    staleTime: 0, // Consider data stale immediately to ensure fresh data when navigating back
  });
};

// Get Single EOI
export const useGetSingleEoi = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<EOIResultsData>>({
    queryKey: ["eoi", id],
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

// Get All Public Opportunities (EOI, RFQ, RFP) - without authentication
export const useGetPublicEois = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  opportunity_type = "",
  enabled = true,
}: TRequest & { opportunity_type?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<EOIData>>({
    queryKey: ["public-opportunities", page, size, search, status, opportunity_type],
    queryFn: async () => {
      try {
        const params: any = { page, size, search, status };
        if (opportunity_type) {
          params.opportunity_type = opportunity_type;
        }

        const response = await Axios.get("public/opportunities/", {
          params,
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

// Get Single Public EOI (without authentication)
export const useGetPublicEoi = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<EOIResultsData>>({
    queryKey: ["public-eoi", id],
    queryFn: async () => {
      try {
        const response = await Axios.get(`public/opportunities/${id}/`);
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

// Create EOI
export const useCreateEoi = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EOIResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: undefined, // Disable auto-invalidation, we'll do it manually in the component
    isAuth: true,
    method: "POST",
    contentType: null, // This allows multipart/form-data for file uploads
    showSuccessToast: false, // Disable auto toast to handle it in component
  });

  const createEoi = async (details: any) => {
    console.log("Creating EOI with data:", details);
    console.log("Is FormData?", details instanceof FormData);
    if (details instanceof FormData) {
      console.log("FormData entries in controller:");
      for (let [key, value] of details.entries()) {
        console.log(key, value);
      }
    }
    // Don't catch the error - let it propagate to the component
    const result = await callApi(details);
    console.log("callApi returned:", result);
    return result;
  };

  return { createEoi, data, isLoading, isSuccess, error };
};

// Update EOI (Full Update)
export const useUpdateEoi = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EOIResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: undefined, // Disable auto-invalidation, we'll do it manually in the component
    isAuth: true,
    method: "PUT",
    showSuccessToast: false, // Disable auto toast to handle it in component
  });

  const updateEoi = async (details: any) => {
    // Don't catch the error - let it propagate to the component
    const result = await callApi(details);
    console.log("updateEoi callApi returned:", result);
    return result;
  };

  return { updateEoi, data, isLoading, isSuccess, error };
};

// Modify EOI (Partial Update)
export const useModifyEoi = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    EOIResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["eois", "eoi"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyEoi = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("EOI modify error:", error);
    }
  };

  return { modifyEoi, data, isLoading, isSuccess, error };
};

// Delete EOI
export const useDeleteEoi = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["eois"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteEoi = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("EOI delete error:", error);
    }
  };

  return { deleteEoi, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetEoisQuery = useGetAllEois;
export const useGetEoiQuery = useGetSingleEoi;
export const useCreateEoiMutation = useCreateEoi;
export const useUpdateEoiMutation = useUpdateEoi;
export const useModifyEoiMutation = useModifyEoi;
export const useDeleteEoiMutation = useDeleteEoi;

// Submit EOI Response/Submission
export const useSubmitEOIResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (responseData: {
      eoi_id: string;
      company_info: {
        company_name: string;
        contact_person: string;
        email: string;
        phone: string;
        business_registration_number?: string;
        tax_identification?: string;
        business_address?: string;
        years_in_business?: number;
        annual_turnover?: number;
        certifications?: string[];
      };
      technical_proposal?: {
        relevant_experience: string;
        proposed_approach: string;
        implementation_timeline?: string;
        team_composition?: string;
      };
      financial_proposal?: {
        bid_amount?: number;
        cost_breakdown?: string;
      };
      documents?: File[];
    }) => {
      const formData = new FormData();

      // Add basic fields
      formData.append('eoi_id', responseData.eoi_id);
      formData.append('company_info', JSON.stringify(responseData.company_info));

      if (responseData.technical_proposal) {
        formData.append('technical_proposal', JSON.stringify(responseData.technical_proposal));
      }

      if (responseData.financial_proposal) {
        formData.append('financial_proposal', JSON.stringify(responseData.financial_proposal));
      }

      // Add documents
      responseData.documents?.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });

      const response = await AxiosWithToken.post(
        `${BASE_URL}/eoi/${responseData.eoi_id}/submissions/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['eoi-submissions', variables.eoi_id] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] }); // Refresh vendors if auto-registration
    },
    onError: (error: any) => {
      console.error('EOI submission error:', error);
    },
  });
};

// Get EOI Submissions
export const useGetEOISubmissions = (eoiId: string) => {
  return useQuery({
    queryKey: ['eoi-submissions', eoiId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}/eoi/${eoiId}/submissions/`);
      return response.data;
    },
    enabled: !!eoiId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Default API object export
const EoiAPI = {
  useGetAllEois,
  useGetSingleEoi,
  useGetPublicEois,
  useGetPublicEoi,
  useGetPublicOpportunity, // Unified public API for EOI and RFQ
  useCreateEoi,
  useUpdateEoi,
  useModifyEoi,
  useDeleteEoi,
  useSubmitEOIResponse,
  useGetEOISubmissions,
  // Legacy naming for component compatibility
  useGetEoi: useGetSingleEoi,
  useGetEois: useGetAllEois,
};

export default EoiAPI;