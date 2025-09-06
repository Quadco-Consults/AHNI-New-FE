import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import {
  VendorPrequalificationData,
  VendorPrequalificationResponse,
  VendorPrequalificationSchema,
} from "../types/vendor-prequalification";
import { TPaginatedResponse, TRequest } from "definations/index";

const BASE_URL = "/procurements/vendor-prequalification/";

// ===== VENDOR PREQUALIFICATION HOOKS =====

// Get All Vendor Prequalifications
export const useGetAllVendorPrequalifications = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
  vendor,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<VendorPrequalificationData>>({
    queryKey: ["vendor-prequalifications", page, size, search, status, vendor],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status, vendor },
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

// Create Vendor Prequalification
export const useCreateVendorPrequalification = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    VendorPrequalificationResponse,
    Error,
    z.infer<typeof VendorPrequalificationSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["vendor-prequalifications"],
    isAuth: true,
    method: "POST",
  });

  const createVendorPrequalification = async (
    details: z.infer<typeof VendorPrequalificationSchema>
  ) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Vendor prequalification create error:", error);
    }
  };

  return { createVendorPrequalification, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetVendorPrequalificationsQuery =
  useGetAllVendorPrequalifications;
export const useCreateVendorPrequalificationMutation =
  useCreateVendorPrequalification;
