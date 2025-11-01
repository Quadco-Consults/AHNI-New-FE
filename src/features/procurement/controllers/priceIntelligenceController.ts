import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PriceIntelligenceDetail,
  PriceIntelligenceList,
} from "../types/price-intelligence";
import { TRequest, TResponse } from "definations/index";

const BASE_URL = "procurements/price-intelligence/";

// ===== PRICE INTELLIGENCE HOOKS =====

// Get All Price Intelligence (List view)
export const useGetAllPriceIntelligence = ({
  page = 1,
  size = 10, // Match backend default page size
  search = "",
  category = "",
  enabled = true,
}: TRequest & { category?: string; enabled?: boolean }) => {
  return useQuery<TResponse<{ results: PriceIntelligenceList[]; pagination?: any }>>({
    queryKey: ["price-intelligence", page, size, search, category],
    queryFn: async () => {
      try {
        // Build params object, only include category if it's not empty
        const params: any = { page, size };
        if (search) params.search = search;
        // Try item__category parameter (Django ORM lookup pattern)
        if (category) params['item__category'] = category;

        console.log('🔍 Price Intelligence API Request:', {
          url: BASE_URL,
          params,
          categoryValue: category,
          categoryType: typeof category,
          fullUrl: `${BASE_URL}?${new URLSearchParams(params).toString()}`
        });

        const response = await AxiosWithToken.get(BASE_URL, { params });

        // Debug log in development
        console.log('🔍 Price Intelligence API Response:', {
          status: response.data?.status,
          message: response.data?.message,
          resultsCount: response.data?.data?.results?.length || 0,
          totalCount: response.data?.data?.pagination?.count || 0,
          requestParams: params,
          firstItem: response.data?.data?.results?.[0]
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error('🔍 Price Intelligence API Error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          params: { page, size, search, category }
        });
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
    // Enhanced retry and caching logic
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
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