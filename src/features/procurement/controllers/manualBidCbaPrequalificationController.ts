import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { ManualBidCbaPrequalificationSchema } from "definations/procurement-validator";
import {
  ManualBidCbaPrequalificationData,
  ManualBidCbaPrequalificationResponse,
  ManualBidCbaPrequalificationResultsData,
} from "../types/manual-bid-cba-prequalification";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/manual-bid-cba-prequalification/"; // FIXED SPELLING
const SOLICITATION_URL = "/procurements/manaul-bid/by-solicitation/"; // Note: Backend has typo "manaul" instead of "manual"

// ===== MANUAL BID CBA PREQUALIFICATION HOOKS =====

// Get All Manual Bid CBA Prequalifications
export const useGetAllManualBidCbaPrequalifications = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<ManualBidCbaPrequalificationResultsData>>({
    queryKey: ["manual-bid-cba-prequalifications", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Manual Bid Prequalifications by Solicitation
export const useGetManualBidPrequalificationsBySolicitation = (
  solicitationId: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<ManualBidCbaPrequalificationResultsData>>({
    queryKey: ["manual-bid-prequalifications", solicitationId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${SOLICITATION_URL}${solicitationId}/?status=PASSED`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!solicitationId,
    refetchOnWindowFocus: false,
  });
};

// Get Single Manual Bid CBA Prequalification
export const useGetSingleManualBidCbaPrequalification = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<ManualBidCbaPrequalificationResultsData>>({
    queryKey: ["manual-bid-cba-prequalification", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/procurements/manual-bid-cba-prequalification/${id}/`
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

// Create Manual Bid CBA Prequalification
export const useCreateManualBidCbaPrequalification = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ManualBidCbaPrequalificationResponse,
    Error,
    z.infer<typeof ManualBidCbaPrequalificationSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["manual-bid-cba-prequalifications"],
    isAuth: true,
    method: "POST",
  });

  const createManualBidCbaPrequalification = async (
    details: z.infer<typeof ManualBidCbaPrequalificationSchema>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Manual bid CBA prequalification create error:", error);
    }
  };

  return {
    createManualBidCbaPrequalification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Create Vendor Bid Analysis
export const useCreateVendorBidAnalysis = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ManualBidCbaPrequalificationResponse,
    Error,
    z.infer<typeof ManualBidCbaPrequalificationSchema>
  >({
    endpoint:
      "/procurements/manaul-bid-cba-prequalification/8171e801-1185-4981-af1a-b67d20226c5f/",
    queryKey: ["manual-bid-cba-prequalifications"],
    isAuth: true,
    method: "POST",
  });

  const createVendorBidAnalysis = async (
    details: z.infer<typeof ManualBidCbaPrequalificationSchema>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor bid analysis create error:", error);
    }
  };

  return { createVendorBidAnalysis, data, isLoading, isSuccess, error };
};

// Update Manual Bid CBA Prequalification (Full Update)
export const useUpdateManualBidCbaPrequalification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ManualBidCbaPrequalificationResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: [
      "manual-bid-cba-prequalifications",
      "manual-bid-cba-prequalification",
    ],
    isAuth: true,
    method: "PUT",
  });

  const updateManualBidCbaPrequalification = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Manual bid CBA prequalification update error:", error);
    }
  };

  return {
    updateManualBidCbaPrequalification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Modify Manual Bid CBA Prequalification (Partial Update)
export const useModifyManualBidCbaPrequalification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ManualBidCbaPrequalificationResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: [
      "manual-bid-cba-prequalifications",
      "manual-bid-cba-prequalification",
    ],
    isAuth: true,
    method: "PATCH",
  });

  const modifyManualBidCbaPrequalification = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Manual bid CBA prequalification modify error:", error);
    }
  };

  return {
    modifyManualBidCbaPrequalification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Delete Manual Bid CBA Prequalification
export const useDeleteManualBidCbaPrequalification = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["manual-bid-cba-prequalifications"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteManualBidCbaPrequalification = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Manual bid CBA prequalification delete error:", error);
    }
  };

  return {
    deleteManualBidCbaPrequalification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Legacy exports for backward compatibility
export const useGetManualBidCbaPrequalificationsQuery =
  useGetAllManualBidCbaPrequalifications;
export const useGetManualBidPrequalificationsQuery =
  useGetManualBidPrequalificationsBySolicitation;
export const useGetManualBidCbaPrequalificationQuery =
  useGetSingleManualBidCbaPrequalification;
export const useCreateManualBidCbaPrequalificationMutation =
  useCreateManualBidCbaPrequalification;
export const useCreateVendorBidAnalysisMutation = useCreateVendorBidAnalysis;
export const useUpdateManualBidCbaPrequalificationMutation =
  useUpdateManualBidCbaPrequalification;
export const useModifyManualBidCbaPrequalificationMutation =
  useModifyManualBidCbaPrequalification;
export const useDeleteManualBidCbaPrequalificationMutation =
  useDeleteManualBidCbaPrequalification;

// Default export API object for backward compatibility
const ManualBidCbaPrequalificationAPI = {
  useGetAllManualBidCbaPrequalifications,
  useGetManualBidPrequalificationsBySolicitation,
  useGetSingleManualBidCbaPrequalification,
  useCreateManualBidCbaPrequalification,
  useCreateVendorBidAnalysis,
  useUpdateManualBidCbaPrequalification,
  useModifyManualBidCbaPrequalification,
  useDeleteManualBidCbaPrequalification,
  // Alias methods for CheckApproval component compatibility
  useGetManualBidPrequalifications: useGetSingleManualBidCbaPrequalification,
};

export default ManualBidCbaPrequalificationAPI;
