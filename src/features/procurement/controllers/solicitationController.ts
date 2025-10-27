import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import Axios from "@/constants/api_management/MyHttpHelper";
import { AxiosError } from "axios";
import { TSolicitationQuotationFormData } from "@/features/procurement/types/procurement-validator";
import {
  ISolicitationRFQData,
  SolicitationResponse,
  SolicitationSubmissionData,
} from "../types/solicitation";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "procurements/solicitations/";

// ===== SOLICITATION HOOKS =====

// Get All Solicitations
export const useGetAllSolicitations = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  request_type,
  job_category,
  enabled = true,
}: TRequest & { request_type?: string; job_category?: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<ISolicitationRFQData>>({
    queryKey: ["solicitations", page, size, search, status, request_type, job_category],
    queryFn: async () => {
      try {
        const params: any = { page, size, search, status };
        if (request_type) {
          params.request_type = request_type;
        }
        if (job_category) {
          params.job_category = job_category;
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
      console.log("🌐 API Controller - Sending solicitation data:", details);
      console.log("🔍 API Controller - Selected vendors field check:", {
        selected_vendors: details.selected_vendors,
        tender_type: details.tender_type,
        vendorCount: details.selected_vendors?.length || 0,
        hasVendors: !!(details.selected_vendors && details.selected_vendors.length > 0),
        allKeys: Object.keys(details)
      });

      const res = await callApi(details);

      console.log("📥 API Response received:", res);
      console.log("🔍 API Response - Selected vendors in response:", {
        selected_vendors: (res as any)?.data?.selected_vendors,
        selected_vendors_details: (res as any)?.data?.selected_vendors_details,
        vendorCount: (res as any)?.data?.selected_vendors?.length || 0,
        allKeysInResponse: res?.data ? Object.keys(res.data) : []
      });

      return res;
    } catch (error) {
      console.error("Solicitation create error:", error);
    }
  };

  return { createSolicitation, data, isLoading, isSuccess, error };
};

// Get Single Public Opportunity (EOI or RFQ) - without authentication
export const useGetPublicOpportunity = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<any>>({
    queryKey: ["public-opportunity", id],
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

// Legacy exports for backward compatibility
export const useGetAllSolicitationsQuery = useGetAllSolicitations;
export const useGetSingleSolicitationQuery = useGetSingleSolicitation;
export const useGetPassedSolicitationQuery = useGetPassedSolicitation;
export const useCreateSolicitationMutation = useCreateSolicitation;

// Missing named export
export const useGetSolicitationById = useGetSingleSolicitation;
