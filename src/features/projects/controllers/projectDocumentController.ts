import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { TProjectDocumentData } from "../types/project";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/projects/documents/";

// ===== PROJECT DOCUMENT HOOKS =====

// Get All Project Documents
export const useGetAllProjectDocuments = ({
  page = 1,
  size = 20,
  search = "",
  project,
  enabled = true,
}: TRequest & { project: string; enabled?: boolean }) => {
  return useQuery<TPaginatedResponse<TProjectDocumentData>>({
    queryKey: ["project-documents", page, size, search, project],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, project },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!project,
    refetchOnWindowFocus: false,
  });
};

// Create Project Document
export const useCreateProjectDocument = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<TProjectDocumentData>,
    Error,
    FormData
  >({
    endpoint: BASE_URL,
    queryKey: ["project-documents"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const createProjectDocument = async (formData: FormData) => {
    try {
      await callApi(formData);
    } catch (error) {
      console.error("Project document create error:", error);
    }
  };

  return { createProjectDocument, data, isLoading, isSuccess, error };
};

// Delete Project Document
export const useDeleteProjectDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["project-documents"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteProjectDocument = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Project document delete error:", error);
    }
  };

  return { deleteProjectDocument, data, isLoading, isSuccess, error };
};

// Maintain legacy exports for backward compatibility
export const useGetAllProjectDocumentsQuery = useGetAllProjectDocuments;
export const useCreateProjectDocumentMutation = useCreateProjectDocument;
export const useDeleteProjectDocumentMutation = useDeleteProjectDocument;