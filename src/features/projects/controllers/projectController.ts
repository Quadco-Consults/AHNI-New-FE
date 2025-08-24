import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TProjectFormValues, IProjectSingleData } from "../types/project";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/projects/";

// ===== PROJECT HOOKS =====

// Get All Projects
export const useGetAllProjects = ({
  page = 1,
  size = 20,
  search = "",
  has_fund_requests,
  enabled = true,
}: TRequest & { has_fund_requests?: boolean; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<IProjectSingleData>>({
    queryKey: ["projects", page, size, search, has_fund_requests],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, has_fund_requests },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Project
export const useGetSingleProject = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IProjectSingleData>>({
    queryKey: ["project", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Project
export const useAddProject = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    TProjectFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["projects"],
    isAuth: true,
    method: "POST",
  });

  const addProject = async (details: TProjectFormValues) => {
    try {
      const response = await callApi(details);
      return response;
    } catch (error) {
      console.error("Project create error:", error);
      throw error;
    }
  };

  return { addProject, data, isLoading, isSuccess, error };
};

// Update Project
export const useUpdateProject = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["projects", "project"],
    isAuth: true,
    method: "PUT",
  });

  const updateProject = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Project update error:", error);
    }
  };

  return { updateProject, data, isLoading, isSuccess, error };
};

// Patch Project (Status Update)
export const usePatchProject = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    { status: string }
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["projects", "project"],
    isAuth: true,
    method: "PATCH",
  });

  const patchProject = async (details: { status: string }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Project patch error:", error);
    }
  };

  return { patchProject, data, isLoading, isSuccess, error };
};

// Delete Project
export const useDeleteProject = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<IProjectSingleData>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["projects"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteProject = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Project delete error:", error);
    }
  };

  return { deleteProject, data, isLoading, isSuccess, error };
};

// Missing named export - Partners function (placeholder)
export const useGetAllPartners = ({
  page = 1,
  size = 20,
  search = "",
  enabled = true,
} = {}) => {
  // This function might need to be implemented based on the actual API endpoint for partners
  // For now, returning an empty query as a placeholder
  return useQuery({
    queryKey: ["partners", page, size, search],
    queryFn: async () => {
      // Placeholder implementation - may need actual API endpoint
      const response = await AxiosWithToken.get("/projects/partners/", {
        params: { page, size, search },
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// Maintain legacy exports for backward compatibility
export const useGetAllProjectsQuery = useGetAllProjects;
export const useGetSingleProjectQuery = useGetSingleProject;
export const useAddProjectMutation = useAddProject;
export const useUpdateProjectMutation = useUpdateProject;
export const usePatchProjectMutation = usePatchProject;
export const useDeleteProjectMutation = useDeleteProject;
