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

const BASE_URL = "/procurements/manaul-bid/";

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
        const response = await AxiosWithToken.get(
          `${BASE_URL}by-solicitation/${solicitationId}/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
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
    TSolicitationQuotationFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["solicitation-submissions"],
    isAuth: true,
    method: "POST",
  });

  const createSolicitationSubmission = async (
    details: TSolicitationQuotationFormData
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Solicitation submission create error:", error);
    }
  };

  return { createSolicitationSubmission, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetSolicitationSubmissionQuery = useGetSolicitationSubmission;
export const useCreateSolicitationSubmissionMutation = useCreateSolicitationSubmission;