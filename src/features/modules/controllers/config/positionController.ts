import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  PositionData, 
  PositionFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllPositionsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<PositionData>>({
    queryKey: ["positions", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/positions/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreatePositionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PositionData,
    Error,
    PositionFormValues
  >({
    endpoint: "/config/positions/",
    queryKey: ["positions"],
    isAuth: true,
    method: "POST",
  });

  const createPosition = async (details: PositionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Position creation error:", error);
    }
  };

  return { createPosition, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdatePositionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PositionData,
    Error,
    PositionFormValues
  >({
    endpoint: "/config/positions/",
    queryKey: ["positions"],
    isAuth: true,
    method: "PUT",
  });

  const updatePosition = async (id: string, details: PositionFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/config/positions/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Position update error:", error);
      throw error;
    }
  };

  return { updatePosition, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeletePositionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PositionData,
    Error,
    Record<string, never>
  >({
    endpoint: "/config/positions/",
    queryKey: ["positions"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePosition = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/positions/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Position delete error:", error);
      throw error;
    }
  };

  return { deletePosition, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllPositionsQuery = useGetAllPositionsManager;

export const useAddPositionMutation = () => {
  const { createPosition, data, isLoading, isSuccess, error } = CreatePositionManager();
  return [createPosition, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdatePositionMutation = () => {
  const { updatePosition, data, isLoading, isSuccess, error } = UpdatePositionManager();
  return [
    (params: { id: string; body: PositionFormValues }) => updatePosition(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeletePositionMutation = () => {
  const { deletePosition, data, isLoading, isSuccess, error } = DeletePositionManager();
  return [deletePosition, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports
export const useGetAllPositions = useGetAllPositionsManager;
export const useGetPositionPaginate = useGetAllPositionsManager;