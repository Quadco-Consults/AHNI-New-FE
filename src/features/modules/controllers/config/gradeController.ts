import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  GradeData, 
  GradeFormValues 
} from "../../types/config";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllGradesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<GradeData>>({
    queryKey: ["grades", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/config/grade/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateGradeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GradeData,
    Error,
    GradeFormValues
  >({
    endpoint: "/config/grade/",
    queryKey: ["grades"],
    isAuth: true,
    method: "POST",
  });

  const createGrade = async (details: GradeFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Grade creation error:", error);
    }
  };

  return { createGrade, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateGradeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GradeData,
    Error,
    GradeFormValues
  >({
    endpoint: "/config/grade/",
    queryKey: ["grades"],
    isAuth: true,
    method: "PUT",
  });

  const updateGrade = async (id: string, details: GradeFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/config/grade/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Grade update error:", error);
      throw error;
    }
  };

  return { updateGrade, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteGradeManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    GradeData,
    Error,
    Record<string, never>
  >({
    endpoint: "/config/grade/",
    queryKey: ["grades"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteGrade = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/config/grade/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Grade delete error:", error);
      throw error;
    }
  };

  return { deleteGrade, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllGrades = useGetAllGradesManager;
export const useGetAllGradesQuery = useGetAllGradesManager;

export const useAddGradeMutation = () => {
  const { createGrade, data, isLoading, isSuccess, error } = CreateGradeManager();
  return [createGrade, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateGradeMutation = () => {
  const { updateGrade, data, isLoading, isSuccess, error } = UpdateGradeManager();
  return [
    (params: { id: string; body: GradeFormValues }) => updateGrade(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteGradeMutation = () => {
  const { deleteGrade, data, isLoading, isSuccess, error } = DeleteGradeManager();
  return [deleteGrade, { data, isLoading, isSuccess, error }] as const;
};