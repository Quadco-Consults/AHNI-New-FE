import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  ModuleData,
  ModuleFormValues
} from "../../types/project";
import {
  FilterParams,
  TPaginatedResponse,
  TResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllModulesManager = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<ModuleData>>({
    queryKey: ["modules", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/projects/modules/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// GET Single Module
export const useGetSingleModuleManager = (id: string, enabled = true) => {
  return useQuery<TResponse<ModuleData>>({
    queryKey: ["module", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/projects/modules/${id}/`);
      return response.data;
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateModuleManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ModuleData,
    Error,
    ModuleFormValues
  >({
    endpoint: "projects/modules/",
    queryKey: ["modules"],
    isAuth: true,
    method: "POST",
  });

  const createModule = async (details: ModuleFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Module creation error:", error);
    }
  };

  return { createModule, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateModuleManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ModuleData,
    Error,
    ModuleFormValues
  >({
    endpoint: "projects/modules/",
    queryKey: ["modules", "module"],
    isAuth: true,
    method: "PATCH",
  });

  const updateModule = async (id: string, details: ModuleFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/projects/modules/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Module update error:", error);
      throw error;
    }
  };

  return { updateModule, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteModuleManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ModuleData,
    Error,
    Record<string, never>
  >({
    endpoint: "projects/modules/",
    queryKey: ["modules"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteModule = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/projects/modules/${id}`);
      return response.data;
    } catch (error) {
      console.error("Module delete error:", error);
      throw error;
    }
  };

  return { deleteModule, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllModuleQuery = useGetAllModulesManager;
export const useGetAllModules = useGetAllModulesManager;
export const useGetSingleModuleQuery = useGetSingleModuleManager;

export const useAddModuleMutation = () => {
  const { createModule, data, isLoading, isSuccess, error } = CreateModuleManager();
  return [createModule, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateModuleMutation = () => {
  const { updateModule, data, isLoading, isSuccess, error } = UpdateModuleManager();
  return [
    (params: { id: string; body: ModuleFormValues }) => updateModule(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteModuleMutation = () => {
  const { deleteModule, data, isLoading, isSuccess, error } = DeleteModuleManager();
  return [deleteModule, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteModule = () => {
  const { deleteModule, data, isLoading, isSuccess, error } = DeleteModuleManager();
  return [deleteModule, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports - RTK Query style
export const useAddModule = useAddModuleMutation;
export const useUpdateModule = useUpdateModuleMutation;
export const useGetSingleModule = useGetSingleModuleManager;
