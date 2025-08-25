import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  DocumentTypeData, 
  DocumentTypeFormValues 
} from "../../types/project";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllDocumentTypesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<DocumentTypeData>>({
    queryKey: ["documentTypes", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/projects/document-types/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateDocumentTypeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DocumentTypeData,
    Error,
    DocumentTypeFormValues
  >({
    endpoint: "/projects/document-types/",
    queryKey: ["documentTypes"],
    isAuth: true,
    method: "POST",
  });

  const createDocumentType = async (details: DocumentTypeFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Document type creation error:", error);
    }
  };

  return { createDocumentType, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateDocumentTypeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DocumentTypeData,
    Error,
    DocumentTypeFormValues
  >({
    endpoint: "/projects/document-types/",
    queryKey: ["documentTypes"],
    isAuth: true,
    method: "PUT",
  });

  const updateDocumentType = async (id: string, details: DocumentTypeFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/projects/document-types/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Document type update error:", error);
      throw error;
    }
  };

  return { updateDocumentType, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteDocumentTypeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    DocumentTypeData,
    Error,
    Record<string, never>
  >({
    endpoint: "/projects/document-types/",
    queryKey: ["documentTypes"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteDocumentType = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/projects/document-types/${id}`);
      return response.data;
    } catch (error) {
      console.error("Document type delete error:", error);
      throw error;
    }
  };

  return { deleteDocumentType, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllDocumentTypeQuery = useGetAllDocumentTypesManager;
export const useGetAllDocumentTypes = useGetAllDocumentTypesManager;

export const useAddDocumentTypeMutation = () => {
  const { createDocumentType, data, isLoading, isSuccess, error } = CreateDocumentTypeManager();
  return [createDocumentType, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateDocumentTypeMutation = () => {
  const { updateDocumentType, data, isLoading, isSuccess, error } = UpdateDocumentTypeManager();
  return [
    (params: { id: string; body: DocumentTypeFormValues }) => updateDocumentType(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

// Note: Original service has typo "useDeleteDocumentTypeeMutation" - keeping backward compatibility
export const useDeleteDocumentTypeeMutation = () => {
  const { deleteDocumentType, data, isLoading, isSuccess, error } = DeleteDocumentTypeManager();
  return [deleteDocumentType, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteDocumentType = DeleteDocumentTypeManager;

// Additional missing exports
export const useAddDocumentType = useAddDocumentTypeMutation;
export const useUpdateDocumentType = useUpdateDocumentTypeMutation;