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
import { nigerianStates } from "@/lib/index";

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
    endpoint: "config/locations/",
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
    endpoint: "config/locations/",
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
    endpoint: "config/locations/",
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

// ============================================
// SPECIALIZED LOCATION HOOKS FOR DIFFERENT CONTEXTS
// ============================================

/**
 * Hook for AHNI office locations only (excludes states)
 * Use this for: Asset creation, general forms, inventory management
 */
export const useGetAHNIOfficeLocations = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<LocationResultsData>>>({
    queryKey: ["ahni-office-locations", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/locations/", {
        params: { page, size, search }
      });

      // Filter out entries that are just state names (not actual AHNI offices)
      if (response.data?.data?.results) {
        const filteredResults = response.data.data.results.filter((location: any) => {
          // Exclude if the location name is just a Nigerian state name
          return !nigerianStates.includes(location.name);
        });

        response.data.data.results = filteredResults;
      }

      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for site visit locations (includes states + facilities + AHNI offices)
 * Use this for: Site visit creation, travel planning
 */
export const useGetSiteVisitLocations = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<{data: {results: Array<{id: string, name: string, type: string}>}}>({
    queryKey: ["site-visit-locations", page, size, search],
    queryFn: async () => {
      // Combine multiple location sources
      const [locationsResponse, facilitiesResponse] = await Promise.all([
        AxiosWithToken.get("/config/locations/", { params: { page, size, search } }),
        AxiosWithToken.get("/programs/facility/", { params: { page, size, search } }).catch(() => ({ data: { data: { results: [] } } }))
      ]);

      const combinedResults: Array<{id: string, name: string, type: string}> = [];

      // Add Nigerian states
      const filteredStates = nigerianStates.filter(state =>
        search ? state.toLowerCase().includes(search.toLowerCase()) : true
      );
      filteredStates.forEach(state => {
        combinedResults.push({
          id: `state_${state.replace(/\s+/g, '_').toLowerCase()}`,
          name: state,
          type: 'state'
        });
      });

      // Add AHNI office locations
      if (locationsResponse.data?.data?.results) {
        locationsResponse.data.data.results.forEach((location: any) => {
          // Only include if it's not just a state name
          if (!nigerianStates.includes(location.name)) {
            combinedResults.push({
              id: location.id,
              name: location.name,
              type: 'office'
            });
          }
        });
      }

      // Add facilities
      if (facilitiesResponse.data?.data?.results) {
        facilitiesResponse.data.data.results.forEach((facility: any) => {
          combinedResults.push({
            id: facility.id,
            name: facility.name,
            type: 'facility'
          });
        });
      }

      return {
        data: {
          results: combinedResults
        }
      };
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};