import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IMultiAwardApiResponse,
  ISubGrantOverview,
  IAwardedPartnersApiResponse,
  IAwardFinancialSummaryResponse,
  TCreateMultiAwardFormData,
  TUpdateAwardFormData,
} from "../types/multi-award";

// ===== API BASE URLS =====
// Note: AxiosWithToken already includes /api/v1/ in baseURL, so we don't need to repeat it
const SUBGRANT_BASE_URL = "contract-grants/sub-grants";
const MULTI_AWARD_BASE_URL = "contract-grants/sub-grants/multi-awards";

// ===== QUERY HOOKS =====

/**
 * Get all awards for a specific subgrant
 */
export const useGetSubGrantAwards = (subGrantId: string) => {
  return useQuery<IMultiAwardApiResponse>({
    queryKey: ["subgrant-awards", subGrantId],
    queryFn: async () => {
      try {
        const url = `${SUBGRANT_BASE_URL}/${subGrantId}/awards/`;
        console.log("🔍 ATTEMPTING AWARDS API CALL:", {
          url,
          subGrantId,
          fullUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
        });

        const response = await AxiosWithToken.get(url);
        console.log("✅ AWARDS API SUCCESS:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ AWARDS API ERROR:", {
          url: `${SUBGRANT_BASE_URL}/${subGrantId}/awards/`,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
          fullError: axiosError
        });

        // For 500 errors or when the endpoint is not available, try fallback approach
        if (axiosError.response?.status === 500 || axiosError.response?.status === 404) {
          console.log("🔄 Primary endpoint failed, trying fallback approach...");
          try {
            // Try the older endpoint pattern as fallback
            const fallbackResponse = await AxiosWithToken.get("/contract-grants/sub-grant-awards/", {
              params: { sub_grant: subGrantId },
            });

            if (fallbackResponse.data?.status) {
              console.log("✅ Fallback API succeeded");
              // Transform the response to match the expected format
              return {
                status: fallbackResponse.data.status,
                message: fallbackResponse.data.message,
                data: fallbackResponse.data.data?.results || fallbackResponse.data.data || []
              };
            }
          } catch (fallbackError) {
            console.log("❌ Fallback also failed:", fallbackError);
          }
        }

        throw new Error(
          "Failed to fetch subgrant awards: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get overview/summary data for a subgrant's multi-award structure
 */
export const useGetSubGrantOverview = (subGrantId: string) => {
  return useQuery<{ status: string; message: string; data: ISubGrantOverview }>({
    queryKey: ["subgrant-overview", subGrantId],
    queryFn: async () => {
      try {
        const url = `${SUBGRANT_BASE_URL}/${subGrantId}/awards/subgrant_overview/`;
        console.log("🔍 ATTEMPTING OVERVIEW API CALL:", {
          url,
          subGrantId,
          fullUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
        });

        const response = await AxiosWithToken.get(url);
        console.log("✅ OVERVIEW API SUCCESS:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ OVERVIEW API ERROR:", {
          url: `${SUBGRANT_BASE_URL}/${subGrantId}/awards/subgrant_overview/`,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
          fullError: axiosError
        });
        throw new Error(
          "Failed to fetch subgrant overview: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get details for a specific award within a subgrant
 */
export const useGetAwardDetails = (subGrantId: string, awardId: string) => {
  return useQuery({
    queryKey: ["award-details", subGrantId, awardId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${SUBGRANT_BASE_URL}/${subGrantId}/awards/${awardId}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch award details: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId && !!awardId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get financial summary for a specific award
 */
export const useGetAwardFinancialSummary = (subGrantId: string, awardId: string) => {
  return useQuery<IAwardFinancialSummaryResponse>({
    queryKey: ["award-financial-summary", subGrantId, awardId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${SUBGRANT_BASE_URL}/${subGrantId}/awards/${awardId}/financial_summary/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch award financial summary: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId && !!awardId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get all awarded partners across all subgrants (for awarded beneficiaries page)
 */
export const useGetAllAwardedPartners = (filters?: {
  page?: number;
  size?: number;
  search?: string;
  location?: string;
  status?: string;
}) => {
  return useQuery<IAwardedPartnersApiResponse>({
    queryKey: ["all-awarded-partners", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.size) params.append('size', filters.size.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.status) params.append('status', filters.status);

        const queryString = params.toString();
        const url = `${MULTI_AWARD_BASE_URL}/all_awarded_partners/${queryString ? '?' + queryString : ''}`;

        console.log("🔍 ALL AWARDED PARTNERS API CALL:", {
          url,
          fullUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
          filters
        });

        const response = await AxiosWithToken.get(url);
        console.log("✅ ALL AWARDED PARTNERS API SUCCESS:", response.data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ ALL AWARDED PARTNERS API ERROR:", {
          url: `${MULTI_AWARD_BASE_URL}/all_awarded_partners/`,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message
        });
        throw new Error(
          "Failed to fetch awarded partners: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: false, // Temporarily disable this query since endpoint doesn't exist yet
    refetchOnWindowFocus: false,
  });
};

// ===== MUTATION HOOKS =====

/**
 * Create multiple awards for a subgrant
 */
export const useCreateMultipleAwards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: TCreateMultiAwardFormData) => {
      try {
        const response = await AxiosWithToken.post(
          `${SUBGRANT_BASE_URL}/${formData.subgrant_id}/awards/`,
          formData
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to create awards: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["subgrant-awards", variables.subgrant_id] });
      queryClient.invalidateQueries({ queryKey: ["subgrant-overview", variables.subgrant_id] });
      queryClient.invalidateQueries({ queryKey: ["all-awarded-partners"] });
    },
  });
};

/**
 * Update a specific award
 */
export const useUpdateAward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subGrantId,
      awardId,
      formData
    }: {
      subGrantId: string;
      awardId: string;
      formData: TUpdateAwardFormData;
    }) => {
      try {
        const response = await AxiosWithToken.put(
          `${SUBGRANT_BASE_URL}/${subGrantId}/awards/${awardId}/`,
          formData
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to update award: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["award-details", variables.subGrantId, variables.awardId] });
      queryClient.invalidateQueries({ queryKey: ["subgrant-awards", variables.subGrantId] });
      queryClient.invalidateQueries({ queryKey: ["subgrant-overview", variables.subGrantId] });
      queryClient.invalidateQueries({ queryKey: ["all-awarded-partners"] });
    },
  });
};

/**
 * Delete a specific award
 */
export const useDeleteAward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subGrantId,
      awardId
    }: {
      subGrantId: string;
      awardId: string;
    }) => {
      try {
        const response = await AxiosWithToken.delete(
          `${SUBGRANT_BASE_URL}/${subGrantId}/awards/${awardId}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to delete award: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["award-details", variables.subGrantId, variables.awardId] });
      queryClient.invalidateQueries({ queryKey: ["subgrant-awards", variables.subGrantId] });
      queryClient.invalidateQueries({ queryKey: ["subgrant-overview", variables.subGrantId] });
      queryClient.invalidateQueries({ queryKey: ["all-awarded-partners"] });
    },
  });
};

// ===== FINANCIAL TRACKING HOOKS =====

/**
 * Get obligations filtered by award
 */
export const useGetObligationsByAward = (subGrantId: string, awardId?: string) => {
  return useQuery({
    queryKey: ["obligations", subGrantId, awardId],
    queryFn: async () => {
      try {
        const params = awardId ? `?award_id=${awardId}` : '';
        const response = await AxiosWithToken.get(
          `${SUBGRANT_BASE_URL}/${subGrantId}/obligations/${params}`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch obligations: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get expenditures filtered by award
 */
export const useGetExpendituresByAward = (subGrantId: string, awardId?: string) => {
  return useQuery({
    queryKey: ["expenditures", subGrantId, awardId],
    queryFn: async () => {
      try {
        const params = awardId ? `?award_id=${awardId}` : '';
        const response = await AxiosWithToken.get(
          `${SUBGRANT_BASE_URL}/${subGrantId}/expenditures/${params}`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch expenditures: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get disbursements filtered by award
 */
export const useGetDisbursementsByAward = (subGrantId: string, awardId?: string) => {
  return useQuery({
    queryKey: ["disbursements", subGrantId, awardId],
    queryFn: async () => {
      try {
        const params = awardId ? `?award_id=${awardId}` : '';
        const response = await AxiosWithToken.get(
          `${SUBGRANT_BASE_URL}/${subGrantId}/disbursements/${params}`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Failed to fetch disbursements: " +
          (axiosError.response?.data as any)?.message || axiosError.message
        );
      }
    },
    enabled: !!subGrantId,
    refetchOnWindowFocus: false,
  });
};