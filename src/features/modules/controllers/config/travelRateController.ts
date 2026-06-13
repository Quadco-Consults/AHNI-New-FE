import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { ITravelRate, TravelRateFormData } from "@/features/admin/types/config/travel-rate";
import { TPaginatedResponse, TRequest, TResponse } from "definitions/index";
import { AxiosError } from "axios";

// Helper function to transform backend response to frontend format
const transformTravelRateResponse = (rate: any): ITravelRate => {
  return {
    ...rate,
    // Map backend fields to frontend expected fields
    accommodation_rate: rate.lodging_rate || rate.accommodation_rate || 0,
    meal_allowance: rate.mie_rate || rate.meal_allowance || 0,
    // Map mie_rate to per_diem_rate for table display
    per_diem_rate: rate.mie_rate || rate.per_diem_rate || 0,
    // Handle state relationship - backend returns state object with name and code
    state: rate.state?.name || rate.state_name || rate.state || '',
    state_name: rate.state?.name || rate.state_name || rate.state || '',
    state_code: rate.state?.code || rate.state_code || '',
    // Fill in missing frontend fields with defaults
    location: rate.state?.name || rate.state_name || rate.location || '',
    country: rate.country || 'Nigeria',
    transport_allowance: rate.transport_allowance || 0,
    currency: rate.currency || 'NGN',
    category: rate.category || 'Local',
    staff_level: rate.staff_level || '',
    notes: rate.notes || '',
    expiry_date: rate.expiry_date || '',
    created_by: rate.created_by || '',
  };
};

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
        const response = await AxiosWithToken.get("/config/travel-rates/", {
          params: { page, size, search },
        });

        // Transform the response data
        const transformedData = {
          ...response.data,
          data: {
            ...response.data.data,
            results: response.data.data.results.map(transformTravelRateResponse)
          }
        };

        return transformedData;
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
        const response = await AxiosWithToken.get(`/config/travel-rates/${id}/`);

        // Transform the single travel rate response
        const transformedData = {
          ...response.data,
          data: transformTravelRateResponse(response.data.data)
        };

        return transformedData;
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
    endpoint: "/config/travel-rates/",
    queryKey: "travel-rates",
    isAuth: true,
    method: "POST",
  });

  const createTravelRate = async (details: TravelRateFormData & { stateId?: string }) => {
    try {
      // Get state ID by name if not provided
      let stateId = details.stateId;
      if (!stateId && details.state) {
        // Need to get state ID from the states API
        try {
          const statesResponse = await AxiosWithToken.get("/config/states/", {
            params: { page: 1, size: 50, search: details.state }
          });
          const matchingState = statesResponse.data?.data?.results?.find(
            (s: any) => s.name === details.state
          );
          stateId = matchingState?.id;
        } catch (error) {
          console.error("Failed to find state ID:", error);
          throw new Error(`State "${details.state}" not found`);
        }
      }

      // Transform frontend data to backend format
      const transformedDetails = {
        state: stateId, // Send state ID instead of name
        lodging_rate: details.accommodation_rate,
        mie_rate: details.meal_allowance,
        effective_date: details.effective_date,
        // Optional fields if provided
        ...(details.notes && { notes: details.notes }),
        ...(details.is_active !== undefined && { is_active: details.is_active }),
      };

      const response = await callApi(transformedDetails as any);
      return response;
    } catch (error) {
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
    endpoint: `/config/travel-rates/${id}/`,
    queryKey: ["travel-rates", "travel-rate"],
    isAuth: true,
    method: "PUT",
  });

  const updateTravelRate = async (details: Partial<TravelRateFormData> & { stateId?: string }) => {
    try {
      // Get state ID by name if not provided
      let stateId = details.stateId;
      if (!stateId && details.state) {
        try {
          const statesResponse = await AxiosWithToken.get("/config/states/", {
            params: { page: 1, size: 50, search: details.state }
          });
          const matchingState = statesResponse.data?.data?.results?.find(
            (s: any) => s.name === details.state
          );
          stateId = matchingState?.id;
        } catch (error) {
          console.error("Failed to find state ID:", error);
          throw new Error(`State "${details.state}" not found`);
        }
      }

      // Transform frontend data to backend format
      const transformedDetails: any = {};

      // Map required fields if present
      if (stateId) transformedDetails.state = stateId; // Send state ID
      if ('accommodation_rate' in details) transformedDetails.lodging_rate = details.accommodation_rate;
      if ('meal_allowance' in details) transformedDetails.mie_rate = details.meal_allowance;
      if ('effective_date' in details) transformedDetails.effective_date = details.effective_date;

      // Map optional fields if present
      if ('notes' in details && details.notes) transformedDetails.notes = details.notes;
      if ('is_active' in details) transformedDetails.is_active = details.is_active;

      await callApi(transformedDetails as any);
    } catch (error) {
      throw error;
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
    endpoint: `/config/travel-rates/${id}/`,
    queryKey: ["travel-rates"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteTravelRate = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      throw error;
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