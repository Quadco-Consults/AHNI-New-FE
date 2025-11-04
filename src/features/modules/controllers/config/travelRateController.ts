import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ITravelRate, TravelRateFormData } from "@/features/admin/types/config/travel-rate";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";
import { AxiosError } from "axios";

// GET Operations (Queries)
export const useGetAllTravelRatesManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<ITravelRate>>({
    queryKey: ["travel-rates", page, size, search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("/travel-rates/", {
          params: { page, size, search },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          throw new Error("Travel rates API endpoint not found");
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

export const useGetAllTravelRatesQuery = useGetAllTravelRatesManager;

// GET Single Travel Rate
export const useGetSingleTravelRateManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<ITravelRate>>({
    queryKey: ["travel-rate", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/travel-rates/${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          throw new Error("Travel rates API endpoint not found");
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

export const useGetSingleTravelRateQuery = useGetSingleTravelRateManager;

// POST/PUT/DELETE Operations (Mutations)
export const useCreateTravelRateMutation = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<ITravelRate>,
    Error,
    TravelRateFormData
  >({
    endpoint: "/travel-rates/",
    queryKey: "travel-rates",
    isAuth: true,
    method: "POST",
  });

  const createTravelRate = async (details: TravelRateFormData) => {
    try {
      const response = await callApi(details);
      return response;
    } catch (error) {
      console.error("Travel Rate create error:", error);
      throw error;
    }
  };

  return { createTravelRate, data, isLoading, isSuccess, error };
};

export const useUpdateTravelRateMutation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<ITravelRate>,
    Error,
    Partial<TravelRateFormData>
  >({
    endpoint: `/travel-rates/${id}/`,
    queryKey: ["travel-rates", "travel-rate"],
    isAuth: true,
    method: "PUT",
  });

  const updateTravelRate = async (details: Partial<TravelRateFormData>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Travel Rate update error:", error);
    }
  };

  return { updateTravelRate, data, isLoading, isSuccess, error };
};

export const useDeleteTravelRateMutation = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<ITravelRate>,
    Error,
    Record<string, never>
  >({
    endpoint: `/travel-rates/${id}/`,
    queryKey: ["travel-rates"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteTravelRate = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Travel Rate delete error:", error);
    }
  };

  return { deleteTravelRate, data, isLoading, isSuccess, error };
};

// RTK Query style mutations for backward compatibility
export const useAddTravelRateMutation = () => {
  const { createTravelRate, data, isLoading, isSuccess, error } = useCreateTravelRateMutation();
  return [createTravelRate, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateTravelRateRTKMutation = () => {
  const { updateTravelRate, data, isLoading, isSuccess, error } = useUpdateTravelRateMutation("");
  return [
    (params: { id: string; body: Partial<TravelRateFormData> }) => updateTravelRate(params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};