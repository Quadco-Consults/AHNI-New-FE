import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TSolicitationQuotationFormData } from "definations/procurement-validator";
import {
  SolicitationResponse,
  SolicitationSubmissionData,
} from "../types/solicitation";
import { TResponse } from "definations/index";

const BASE_URL = "/procurements/manaul-bid/"; // Note: Backend has typo "manaul" instead of "manual"

// ===== VENDOR BID SUBMISSIONS HOOKS =====

// Get Solicitation Submission by Solicitation ID
export const useGetSolicitationSubmission = (
  solicitationId: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<SolicitationSubmissionData>>({
    queryKey: ["solicitation-submission", solicitationId],
    queryFn: async () => {
      try {
        // Try the correct backend endpoints (note: backend has typo "manaul")
        const possibleEndpoints = [
          `${BASE_URL}by-solicitation/${solicitationId}/`, // Primary endpoint for filtering by solicitation
          `${BASE_URL}`, // Get all submissions and filter client-side
          `${BASE_URL}?solicitation=${solicitationId}`, // Query parameter approach
        ];

        console.log("🔍 Trying to fetch bid submissions for solicitation:", solicitationId);

        // Try each endpoint in sequence
        for (let i = 0; i < possibleEndpoints.length; i++) {
          try {
            console.log(`🔍 Trying endpoint ${i + 1}:`, possibleEndpoints[i]);
            const response = await AxiosWithToken.get(possibleEndpoints[i]);
            console.log(`✅ Success! Endpoint ${i + 1} returned data:`, response.data);

            // If we get all submissions (endpoint 2), filter by solicitation
            if (i === 1 && response.data?.data?.results) {
              const filteredResults = response.data.data.results.filter(
                (submission: any) => submission.solicitation?.id === solicitationId
              );
              console.log(`🔍 Filtered ${filteredResults.length} submissions for solicitation:`, solicitationId);
              return {
                ...response.data,
                data: {
                  ...response.data.data,
                  results: filteredResults
                }
              };
            }

            return response.data;
          } catch (error) {
            console.log(`⚠️ Endpoint ${i + 1} failed:`, error);
            if (i === possibleEndpoints.length - 1) {
              // This is the last endpoint, throw the error
              throw error;
            }
            // Continue to next endpoint
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("🔥 All Solicitation Submission API endpoints failed:", {
          solicitationId: solicitationId,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
          fullError: error
        });
        throw new Error(
          `API Error: ${axiosError.response?.status || 'Unknown'} - ${
            (axiosError.response?.data as any)?.message ||
            axiosError.message ||
            'Failed to fetch bid submissions'
          }`
        );
      }
    },
    enabled: enabled && !!solicitationId,
    refetchOnWindowFocus: false,
  });
};

// Create Solicitation Submission
export const useCreateSolicitationSubmission = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SolicitationResponse,
    Error,
    any
  >({
    endpoint: BASE_URL,
    queryKey: ["solicitation-submissions"],
    isAuth: true,
    method: "POST",
  });

  const createSolicitationSubmission = async (details: any) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Solicitation submission create error:", error);
      throw error;
    }
  };

  return { createSolicitationSubmission, data, isLoading, isSuccess, error };
};

// Get All Vendor Bid Submissions
export const useGetVendorBidSubmissions = (params?: {
  page?: number;
  size?: number;
  search?: string;
  enabled?: boolean;
}) => {
  const { page = 1, size = 20, search = "", enabled = true } = params || {};

  return useQuery<TResponse<SolicitationSubmissionData>>({
    queryKey: ["vendor-bid-submissions", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search },
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

// Legacy exports for backward compatibility
export const useGetSolicitationSubmissionQuery = useGetSolicitationSubmission;
export const useCreateSolicitationSubmissionMutation = useCreateSolicitationSubmission;