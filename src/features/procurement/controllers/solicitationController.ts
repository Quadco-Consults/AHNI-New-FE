import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TSolicitationQuotationFormData } from "@/features/procurement/types/procurement-validator";
import {
  ISolicitationRFQData,
  SolicitationResponse,
  SolicitationSubmissionData,
} from "../types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/solicitations/";

// ===== SOLICITATION HOOKS =====

// Get All Solicitations
export const useGetAllSolicitations = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  request_type,
  enabled = true,
}: TRequest & { request_type?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<ISolicitationRFQData>>({
    queryKey: ["solicitations", page, size, search, status, request_type],
    queryFn: async () => {
      try {
        const params: any = { page, size, search, status };
        if (request_type) {
          params.request_type = request_type;
        }

        const response = await AxiosWithToken.get(BASE_URL, {
          params,
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

// Get Single Solicitation
export const useGetSingleSolicitation = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<ISolicitationRFQData>>({
    queryKey: ["solicitation", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}`);
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

// Get Passed Solicitation
export const useGetPassedSolicitation = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<SolicitationSubmissionData>({
    queryKey: ["passed-solicitation", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/by-solicitation/${id}/?status=PASSED`
        );
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

// Create Solicitation
export const useCreateSolicitation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SolicitationResponse,
    Error,
    TSolicitationQuotationFormData
  >({
    endpoint: BASE_URL,
    queryKey: ["solicitations"],
    isAuth: true,
    method: "POST",
  });

  const createSolicitation = async (
    details: TSolicitationQuotationFormData
  ) => {
    try {
      const res = await callApi(details);
      return res;
    } catch (error) {
      console.error("Solicitation create error:", error);
    }
  };

  return { createSolicitation, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllSolicitationsQuery = useGetAllSolicitations;
export const useGetSingleSolicitationQuery = useGetSingleSolicitation;
export const useGetPassedSolicitationQuery = useGetPassedSolicitation;
export const useCreateSolicitationMutation = useCreateSolicitation;

// Missing named export
export const useGetSolicitationById = useGetSingleSolicitation;
