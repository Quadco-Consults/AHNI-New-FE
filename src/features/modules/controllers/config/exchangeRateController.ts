import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { IExchangeRate, ExchangeRateFormData } from "@/features/admin/types/config/exchange-rate";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { AxiosError } from "axios";

// GET Operations (Queries)
export const useGetAllExchangeRatesManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IExchangeRate>>({
    queryKey: ["exchange-rates", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/exchange-rates/", {
          params: { page, size, search },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          throw new Error("Exchange rates API endpoint not found");
        }
        throw new Error(
          "Sorry: " + ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllExchangeRatesQuery = useGetAllExchangeRatesManager;

// GET Single Exchange Rate
export const useGetSingleExchangeRateManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IExchangeRate>>({
    queryKey: ["exchange-rate", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/exchange-rates/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          throw new Error("Exchange rates API endpoint not found");
        }
        throw new Error(
          "Sorry: " + ((axiosError.response?.data as any)?.message || axiosError.message)
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

export const useGetSingleExchangeRateQuery = useGetSingleExchangeRateManager;

// POST/PUT/DELETE Operations (Mutations)
export const useCreateExchangeRateMutation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExchangeRate>,
    Error,
    ExchangeRateFormData
  >({
    endpoint: "/exchange-rates/",
    queryKey: "exchange-rates",
    isAuth: true,
    method: "POST",
  });

  const createExchangeRate = async (details: ExchangeRateFormData) => {
    try {
      const response = await callApi(details);
      return response;
    } catch (error) {
      console.error("Exchange Rate create error:", error);
      throw error;
    }
  };

  return { createExchangeRate, data, isLoading, isSuccess, error };
};

export const useUpdateExchangeRateMutation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExchangeRate>,
    Error,
    Partial<ExchangeRateFormData>
  >({
    endpoint: `/exchange-rates/${id}/`,
    queryKey: ["exchange-rates", "exchange-rate"],
    isAuth: true,
    method: "PUT",
  });

  const updateExchangeRate = async (details: Partial<ExchangeRateFormData>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Exchange Rate update error:", error);
    }
  };

  return { updateExchangeRate, data, isLoading, isSuccess, error };
};

// RTK Query style mutations for backward compatibility
export const useAddExchangeRateMutation = () => {
  const { createExchangeRate, data, isLoading, isSuccess, error } = useCreateExchangeRateMutation();
  return [createExchangeRate, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateExchangeRateRTKMutation = () => {
  const [updateExchangeRate, { data, isLoading, isSuccess, error }] = useUpdateExchangeRateMutation("");
  return [
    (params: { id: string; body: Partial<ExchangeRateFormData> }) => updateExchangeRate(params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteExchangeRateMutation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IExchangeRate>,
    Error,
    Record<string, never>
  >({
    endpoint: `/exchange-rates/${id}/`,
    queryKey: ["exchange-rates"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteExchangeRate = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Exchange Rate delete error:", error);
    }
  };

  return { deleteExchangeRate, data, isLoading, isSuccess, error };
};