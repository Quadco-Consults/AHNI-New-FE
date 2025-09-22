import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  LocationData,
  LocationFormValues
} from "../../types/config";
import { LocationResultsData } from "@/features/admin/types/configs-types/location";
import {
  FilterParams,
  TPaginatedResponse,
  TResponse,
  ApiResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllLocationsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<LocationResultsData>>>({
    queryKey: ["locations", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/locations/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Location
export const useGetSingleLocationManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<LocationData>>({
    queryKey: ["location", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/config/locations/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateLocationManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LocationData,
    Error,
    LocationFormValues
  >({
    endpoint: "/config/locations/",
    queryKey: ["locations"],
    isAuth: true,
    method: "POST",
  });

  const createLocation = async (details: LocationFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Location creation error:", error);
    }
  };

  return { createLocation, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateLocationManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LocationData,
    Error,
    LocationFormValues
  >({
    endpoint: "/config/locations/",
    queryKey: ["locations", "location"],
    isAuth: true,
    method: "PATCH",
  });

  const updateLocation = async (id: string, details: LocationFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/config/locations/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Location update error:", error);
      throw error;
    }
  };

  return { updateLocation, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteLocationManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LocationData,
    Error,
    Record<string, never>
  >({
    endpoint: "/config/locations/",
    queryKey: ["locations"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLocation = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Location delete error:", error);
      throw error;
    }
  };

  return { deleteLocation, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllLocationsQuery = useGetAllLocationsManager;
export const useGetAllLocations = useGetAllLocationsManager;
export const useGetSingleLocationQuery = useGetSingleLocationManager;

export const useAddLocationMutation = () => {
  const { createLocation, data, isLoading, isSuccess, error } = CreateLocationManager();
  return [createLocation, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateLocationMutation = () => {
  const { updateLocation, data, isLoading, isSuccess, error } = UpdateLocationManager();
  return [
    (params: { id: string; body: LocationFormValues }) => updateLocation(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteLocationMutation = () => {
  const { deleteLocation, data, isLoading, isSuccess, error } = DeleteLocationManager();
  return [deleteLocation, { data, isLoading, isSuccess, error }] as const;
};

// Missing named export
export const useGetLocationList = useGetAllLocationsManager;