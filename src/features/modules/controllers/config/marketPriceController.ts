import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  MarketPriceData, 
  MarketPriceFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

const BASE_URL = "/procurements/market-item/";

// GET Operations (Queries)
export const useGetAllMarketPricesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<MarketPriceData>>({
    queryKey: ["market-prices", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get(BASE_URL, {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateMarketPriceManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    MarketPriceData,
    Error,
    MarketPriceFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["market-prices"],
    isAuth: true,
    method: "POST",
  });

  const createMarketPrice = async (details: MarketPriceFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Market price creation error:", error);
    }
  };

  return { createMarketPrice, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateMarketPriceManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    MarketPriceData,
    Error,
    MarketPriceFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["market-prices"],
    isAuth: true,
    method: "PATCH",
  });

  const updateMarketPrice = async (id: string, details: MarketPriceFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Market price update error:", error);
      throw error;
    }
  };

  return { updateMarketPrice, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteMarketPriceManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    MarketPriceData,
    Error,
    Record<string, never>
  >({
    endpoint: BASE_URL,
    queryKey: ["market-prices"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteMarketPrice = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`${BASE_URL}${id}`);
      return response.data;
    } catch (error) {
      console.error("Market price delete error:", error);
      throw error;
    }
  };

  return { deleteMarketPrice, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllMarketPricesQuery = useGetAllMarketPricesManager;
export const useGetAllMarketPrices = useGetAllMarketPricesManager;

export const useAddMarketPriceMutation = () => {
  const { createMarketPrice, data, isLoading, isSuccess, error } = CreateMarketPriceManager();
  return [createMarketPrice, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateMarketPriceMutation = () => {
  const { updateMarketPrice, data, isLoading, isSuccess, error } = UpdateMarketPriceManager();
  return [
    (params: { id: string; body: MarketPriceFormValues }) => updateMarketPrice(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteMarketPriceMutation = () => {
  const { deleteMarketPrice, data, isLoading, isSuccess, error } = DeleteMarketPriceManager();
  return [deleteMarketPrice, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteMarketPrice = () => {
  const { deleteMarketPrice, data, isLoading, isSuccess, error } = DeleteMarketPriceManager();
  return [deleteMarketPrice, { data, isLoading, isSuccess, error }] as const;
};