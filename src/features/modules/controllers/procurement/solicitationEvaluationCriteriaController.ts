import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  SolicitationEvaluationCriteriaData, 
  SolicitationEvaluationCriteriaFormValues 
} from "../../types/procurement";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllSolicitationEvaluationCriteriaManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<SolicitationEvaluationCriteriaData>>({
    queryKey: ["solicitationEvaluationCriteria", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/evaluation-criteria/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateSolicitationEvaluationCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SolicitationEvaluationCriteriaData,
    Error,
    SolicitationEvaluationCriteriaFormValues
  >({
    endpoint: "/procurements/evaluation-criteria/",
    queryKey: ["solicitationEvaluationCriteria"],
    isAuth: true,
    method: "POST",
  });

  const createSolicitationEvaluationCriteria = async (details: SolicitationEvaluationCriteriaFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Solicitation evaluation criteria creation error:", error);
    }
  };

  return { createSolicitationEvaluationCriteria, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateSolicitationEvaluationCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SolicitationEvaluationCriteriaData,
    Error,
    SolicitationEvaluationCriteriaFormValues
  >({
    endpoint: "/procurements/evaluation-criteria/",
    queryKey: ["solicitationEvaluationCriteria"],
    isAuth: true,
    method: "PATCH",
  });

  const updateSolicitationEvaluationCriteria = async (id: string, details: SolicitationEvaluationCriteriaFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/procurements/evaluation-criteria/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Solicitation evaluation criteria update error:", error);
      throw error;
    }
  };

  return { updateSolicitationEvaluationCriteria, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteSolicitationEvaluationCriteriaManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SolicitationEvaluationCriteriaData,
    Error,
    Record<string, never>
  >({
    endpoint: "/procurements/evaluation-criteria/",
    queryKey: ["solicitationEvaluationCriteria"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSolicitationEvaluationCriteria = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/procurements/evaluation-criteria/${id}`);
      return response.data;
    } catch (error) {
      console.error("Solicitation evaluation criteria delete error:", error);
      throw error;
    }
  };

  return { deleteSolicitationEvaluationCriteria, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllSolicitationEvaluationCriteriaQuery = useGetAllSolicitationEvaluationCriteriaManager;
export const useGetAllSolicitationEvaluationCriteria = useGetAllSolicitationEvaluationCriteriaManager;

export const useAddSolicitationEvaluationCriteriaMutation = () => {
  const { createSolicitationEvaluationCriteria, data, isLoading, isSuccess, error } = CreateSolicitationEvaluationCriteriaManager();
  return [createSolicitationEvaluationCriteria, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateSolicitationEvaluationCriteriaMutation = () => {
  const { updateSolicitationEvaluationCriteria, data, isLoading, isSuccess, error } = UpdateSolicitationEvaluationCriteriaManager();
  return [
    (params: { id: string; body: SolicitationEvaluationCriteriaFormValues }) => updateSolicitationEvaluationCriteria(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteSolicitationEvaluationCriteriaMutation = () => {
  const { deleteSolicitationEvaluationCriteria, data, isLoading, isSuccess, error } = DeleteSolicitationEvaluationCriteriaManager();
  return [deleteSolicitationEvaluationCriteria, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteSolicitationEvaluationCriteria = DeleteSolicitationEvaluationCriteriaManager;