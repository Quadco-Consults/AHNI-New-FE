import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  StateData,
  StateFormValues,
  StateResultsData
} from "@/features/admin/types/config/state";
import {
  FilterParams,
  TPaginatedResponse,
  TResponse,
  ApiResponse
} from "../../types";

const BASE_URL = "/config/states/";

// ===== ENHANCED STATE HOOKS =====

// GET Operations (Queries)
export const useGetAllStatesManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<ApiResponse<TPaginatedResponse<StateResultsData>>>({
    queryKey: ["states", page, size, search],
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

// GET Single State
export const useGetSingleStateManager = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<StateData>>({
    queryKey: ["state", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateStateManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StateData,
    Error,
    StateFormValues
  >({
    endpoint: "config/states/",
    queryKey: ["states"],
    isAuth: true,
    method: "POST",
  });

  const createState = async (details: StateFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("State creation error:", error);
    }
  };

  return { createState, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateStateManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StateData,
    Error,
    StateFormValues
  >({
    endpoint: "config/states/",
    queryKey: ["states", "state"],
    isAuth: true,
    method: "PATCH",
  });

  const updateState = async (id: string, details: StateFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`${BASE_URL}${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("State update error:", error);
      throw error;
    }
  };

  return { updateState, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteStateManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    StateData,
    Error,
    Record<string, never>
  >({
    endpoint: "config/states/",
    queryKey: ["states"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteState = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`${BASE_URL}${id}`);
      return response.data;
    } catch (error) {
      console.error("State delete error:", error);
      throw error;
    }
  };

  return { deleteState, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllStatesQuery = useGetAllStatesManager;
export const useGetAllStates = useGetAllStatesManager;
export const useGetSingleStateQuery = useGetSingleStateManager;

export const useAddStateMutation = () => {
  const { createState, data, isLoading, isSuccess, error } = CreateStateManager();
  return [createState, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateStateMutation = () => {
  const { updateState, data, isLoading, isSuccess, error } = UpdateStateManager();
  return [
    (params: { id: string; body: StateFormValues }) => updateState(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteStateMutation = () => {
  const { deleteState, data, isLoading, isSuccess, error } = DeleteStateManager();
  return [deleteState, { data, isLoading, isSuccess, error }] as const;
};

// ===== LEGACY HOOKS (for backward compatibility) =====

// Original simple states hook - returns array of state names only
export const useGetStates = (enabled: boolean = true) => {
  return useQuery<string[]>({
    queryKey: ["states-simple"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
        // If the response is paginated, extract just the names
        if (response.data?.data?.results) {
          return response.data.data.results.map((state: StateData) => state.name);
        }
        // If it's a simple array, return as is
        return response.data;
      } catch (error) {
        console.error("States fetch error:", error);
        throw error;
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Maintain legacy exports
export const useGetStatesQuery = useGetStates;