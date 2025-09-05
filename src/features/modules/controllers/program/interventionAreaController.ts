import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  InterventionAreaData, 
  InterventionAreaFormValues 
} from "../../types/program";
import { 
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllInterventionAreasManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<InterventionAreaData>>({
    queryKey: ["interventionAreas", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/intervention-areas/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Intervention Area
export const useGetSingleInterventionAreaManager = (id: string, enabled = true) => {
  return useQuery<TResponse<InterventionAreaData>>({
    queryKey: ["interventionArea", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/procurements/intervention-areas/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateInterventionAreaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    InterventionAreaData,
    Error,
    InterventionAreaFormValues
  >({
    endpoint: "/procurements/intervention-areas/",
    queryKey: ["interventionAreas"],
    isAuth: true,
    method: "POST",
  });

  const createInterventionArea = async (details: InterventionAreaFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Intervention area creation error:", error);
    }
  };

  return { createInterventionArea, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateInterventionAreaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    InterventionAreaData,
    Error,
    InterventionAreaFormValues
  >({
    endpoint: "/procurements/intervention-areas/",
    queryKey: ["interventionAreas", "interventionArea"],
    isAuth: true,
    method: "PATCH",
  });

  const updateInterventionArea = async (id: string, details: InterventionAreaFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/procurements/intervention-areas/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Intervention area update error:", error);
      throw error;
    }
  };

  return { updateInterventionArea, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteInterventionAreaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    InterventionAreaData,
    Error,
    Record<string, never>
  >({
    endpoint: "/procurements/intervention-areas/",
    queryKey: ["interventionAreas"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteInterventionArea = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/procurements/intervention-areas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Intervention area delete error:", error);
      throw error;
    }
  };

  return { deleteInterventionArea, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllInterventionAreaQuery = useGetAllInterventionAreasManager;
export const useGetAllInterventionAreas = useGetAllInterventionAreasManager;
export const useGetSingleInterventionAreaQuery = useGetSingleInterventionAreaManager;

export const useAddInterventionAreaMutation = () => {
  const { createInterventionArea, data, isLoading, isSuccess, error } = CreateInterventionAreaManager();
  return [createInterventionArea, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateInterventionAreaMutation = () => {
  const { updateInterventionArea, data, isLoading, isSuccess, error } = UpdateInterventionAreaManager();
  return [
    (params: { id: string; body: InterventionAreaFormValues }) => updateInterventionArea(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteInterventionAreaMutation = () => {
  const { deleteInterventionArea, data, isLoading, isSuccess, error } = DeleteInterventionAreaManager();
  return [deleteInterventionArea, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteInterventionArea = () => {
  const { deleteInterventionArea, data, isLoading, isSuccess, error } = DeleteInterventionAreaManager();
  return [deleteInterventionArea, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports - RTK Query style
export const useAddInterventionArea = useAddInterventionAreaMutation;
export const useUpdateInterventionArea = useUpdateInterventionAreaMutation;
export const useGetSingleInterventionArea = useGetSingleInterventionAreaManager;