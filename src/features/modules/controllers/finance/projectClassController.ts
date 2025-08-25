import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  ProjectClassData, 
  ProjectClassFormValues 
} from "../../types/finance";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

export const useGetAllProjectClassesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<ProjectClassData>>({
    queryKey: ["project-classes", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/finance/project-classes/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

export const CreateProjectClassManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ProjectClassData,
    Error,
    ProjectClassFormValues
  >({
    endpoint: "/finance/project-classes/",
    queryKey: ["project-classes"],
    isAuth: true,
    method: "POST",
  });

  const createProjectClass = async (details: ProjectClassFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Project class creation error:", error);
    }
  };

  return { createProjectClass, data, isLoading, isSuccess, error };
};

export const UpdateProjectClassManager = () => {
  const updateProjectClass = async (id: string, details: ProjectClassFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/finance/project-classes/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Project class update error:", error);
      throw error;
    }
  };

  return { updateProjectClass };
};

export const DeleteProjectClassManager = () => {
  const deleteProjectClass = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/finance/project-classes/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Project class delete error:", error);
      throw error;
    }
  };

  return { deleteProjectClass };
};

// Backward compatibility exports
export const useGetAllProjectClassesQuery = useGetAllProjectClassesManager;

export const useAddProjectClassMutation = () => {
  const { createProjectClass, data, isLoading, isSuccess, error } = CreateProjectClassManager();
  return [createProjectClass, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateProjectClassMutation = () => {
  const { updateProjectClass } = UpdateProjectClassManager();
  return [(params: { id: number; body: ProjectClassFormValues }) => updateProjectClass(params.id.toString(), params.body), { isLoading: false }] as const;
};

export const useDeleteProjectClassMutation = () => {
  const { deleteProjectClass } = DeleteProjectClassManager();
  return [deleteProjectClass, { isLoading: false }] as const;
};