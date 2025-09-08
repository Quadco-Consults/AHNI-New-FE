import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PriceIntelligenceDetail,
  PriceIntelligenceList,
} from "../types/price-intelligence";
import { TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/price-intelligence/";

// ===== PRICE INTELLIGENCE HOOKS =====

// Get All Price Intelligence (List view)
export const useGetAllPriceIntelligence = ({
  page = 1,
  size = 20,
  search = "",
  category = "",
  enabled = true,
}: TRequest & { category?: string; enabled?: boolean }) => {
  return useQuery<TResponse<{ results: PriceIntelligenceList[]; pagination?: any }>>({
    queryKey: ["price-intelligence", page, size, search, category],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, category },
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

// Get Single Price Intelligence with History
export const useGetSinglePriceIntelligence = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery<TResponse<PriceIntelligenceDetail>>({
    queryKey: ["price-intelligence", id],
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

// Legacy exports for backward compatibility
export const useGetPriceIntelligencesQuery = useGetAllPriceIntelligence;
export const useGetPriceIntelligenceQuery = useGetSinglePriceIntelligence;