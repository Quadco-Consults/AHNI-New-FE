import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  LevelData, 
  LevelFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllLevelsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<LevelData>>({
    queryKey: ["levels", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/level/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateLevelManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LevelData,
    Error,
    LevelFormValues
  >({
    endpoint: "/config/level/",
    queryKey: ["levels"],
    isAuth: true,
    method: "POST",
  });

  const createLevel = async (details: LevelFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Level creation error:", error);
    }
  };

  return { createLevel, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateLevelManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LevelData,
    Error,
    LevelFormValues
  >({
    endpoint: "/config/level/",
    queryKey: ["levels"],
    isAuth: true,
    method: "PUT",
  });

  const updateLevel = async (id: string, details: LevelFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/config/level/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Level update error:", error);
      throw error;
    }
  };

  return { updateLevel, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteLevelManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    LevelData,
    Error,
    Record<string, never>
  >({
    endpoint: "/config/level/",
    queryKey: ["levels"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteLevel = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/level/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Level delete error:", error);
      throw error;
    }
  };

  return { deleteLevel, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllLevelsQuery = useGetAllLevelsManager;

export const useAddLevelMutation = () => {
  const { createLevel, data, isLoading, isSuccess, error } = CreateLevelManager();
  return [createLevel, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateLevelMutation = () => {
  const { updateLevel, data, isLoading, isSuccess, error } = UpdateLevelManager();
  return [
    (params: { id: string; body: LevelFormValues }) => updateLevel(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteLevelMutation = () => {
  const { deleteLevel, data, isLoading, isSuccess, error } = DeleteLevelManager();
  return [deleteLevel, { data, isLoading, isSuccess, error }] as const;
};