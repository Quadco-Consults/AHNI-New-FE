import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  FacilityData, 
  FacilityFormValues 
} from "../../types/program";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllFacilitiesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<FacilityData>>({
    queryKey: ["facilities", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/programs/facility/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Facility
export const useGetSingleFacilityManager = (id: string, enabled = true) => {
  return useQuery<TResponse<FacilityData>>({
    queryKey: ["facility", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/programs/facility/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateFacilityManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FacilityData,
    Error,
    FacilityFormValues
  >({
    endpoint: "/programs/facility/",
    queryKey: ["facilities"],
    isAuth: true,
    method: "POST",
  });

  const createFacility = async (details: FacilityFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Facility creation error:", error);
    }
  };

  return { createFacility, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateFacilityManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FacilityData,
    Error,
    FacilityFormValues
  >({
    endpoint: "/programs/facility/",
    queryKey: ["facilities", "facility"],
    isAuth: true,
    method: "PATCH",
  });

  const updateFacility = async (id: string, details: FacilityFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/programs/facility/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Facility update error:", error);
      throw error;
    }
  };

  return { updateFacility, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteFacilityManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    FacilityData,
    Error,
    Record<string, never>
  >({
    endpoint: "/programs/facility/",
    queryKey: ["facilities"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteFacility = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/programs/facility/${id}`);
      return response.data;
    } catch (error) {
      console.error("Facility delete error:", error);
      throw error;
    }
  };

  return { deleteFacility, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllFacilityQuery = useGetAllFacilitiesManager;
export const useGetAllFacility = useGetAllFacilitiesManager;
export const useGetSingleFacilityQuery = useGetSingleFacilityManager;
export const useLazyGetSingleFacilityQuery = useGetSingleFacilityManager;

export const useAddFacilityMutation = () => {
  const { createFacility, data, isLoading, isSuccess, error } = CreateFacilityManager();
  return [createFacility, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateFacilityMutation = () => {
  const { updateFacility, data, isLoading, isSuccess, error } = UpdateFacilityManager();
  return [
    (params: { id: string; body: FacilityFormValues }) => updateFacility(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteFacilityMutation = () => {
  const { deleteFacility, data, isLoading, isSuccess, error } = DeleteFacilityManager();
  return [deleteFacility, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteFacility = () => {
  const { deleteFacility, data, isLoading, isSuccess, error } = DeleteFacilityManager();
  return [deleteFacility, { data, isLoading, isSuccess, error }] as const;
};

export const useGetAllFacilities = useGetAllFacilitiesManager;

// Missing named exports - RTK Query style
export const useAddFacility = useAddFacilityMutation;
export const useUpdateFacility = useUpdateFacilityMutation;
export const useLazyGetSingleFacility = useGetSingleFacilityManager;