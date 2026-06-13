import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  PriceIntelligenceDetail,
  PriceIntelligenceList,
  MarketItemCreate,
  MarketItemResponse,
} from "../types/price-intelligence";
import { TRequest, TResponse } from "definitions/index";

const BASE_URL = "procurements/price-intelligence/";
const MARKET_ITEM_URL = "procurements/market-item/";

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

// ===== MARKET ITEM HOOKS =====

// Get All Market Items
export const useGetMarketItems = ({
  page = 1,
  size = 10,
  enabled = true,
}: TRequest & { enabled?: boolean } = {}) => {
  return useQuery<TResponse<{ results: MarketItemResponse[]; pagination?: any }>>({
    queryKey: ["market-items", page, size],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(MARKET_ITEM_URL, {
          params: { page, size },
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

// Create Market Item
export const useCreateMarketItem = () => {
  const queryClient = useQueryClient();

  return useMutation<TResponse<MarketItemResponse>, Error, MarketItemCreate>({
    mutationFn: async (data: MarketItemCreate) => {
      try {
        const response = await AxiosWithToken.post(MARKET_ITEM_URL, data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      // Invalidate price intelligence queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["price-intelligence"] });
      queryClient.invalidateQueries({ queryKey: ["market-items"] });
    },
  });
};

// Update Market Item
export const useUpdateMarketItem = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<TResponse<MarketItemResponse>, Error, Partial<MarketItemCreate>>({
    mutationFn: async (data: Partial<MarketItemCreate>) => {
      try {
        const response = await AxiosWithToken.patch(`${MARKET_ITEM_URL}${id}/`, data);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-intelligence"] });
      queryClient.invalidateQueries({ queryKey: ["market-items"] });
    },
  });
};

// Delete Market Item
export const useDeleteMarketItem = () => {
  const queryClient = useQueryClient();

  return useMutation<TResponse<void>, Error, string>({
    mutationFn: async (id: string) => {
      try {
        const response = await AxiosWithToken.delete(`${MARKET_ITEM_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-intelligence"] });
      queryClient.invalidateQueries({ queryKey: ["market-items"] });
    },
  });
};