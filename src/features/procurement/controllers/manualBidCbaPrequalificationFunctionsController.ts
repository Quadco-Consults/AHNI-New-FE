import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ManualBidCbaPrequalificationData,
  ManualBidCbaPrequalificationResultsData,
} from "../types/manual-bid-cba-prequalification";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/vendor-bid-prequalification-summary/";

// ===== VENDOR BID PREQUALIFICATION FUNCTIONS HOOKS =====

// Get All Vendor Bid Prequalifications
export const useGetAllVendorBidPrequalifications = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<ManualBidCbaPrequalificationData>>({
    queryKey: ["vendor-bid-prequalifications", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
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

// Get Vendor Bid Prequalification by CBA ID
export const useGetVendorBidPrequalificationByCba = (
  cbaId: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<ManualBidCbaPrequalificationResultsData>>({
    queryKey: ["vendor-bid-prequalification", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}?cba=${cbaId}`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// Legacy exports for backward compatibility
export const useGetVendorBidPrequalificationsQuery = useGetAllVendorBidPrequalifications;
export const useGetVendorBidPrequalificationQuery = useGetVendorBidPrequalificationByCba;