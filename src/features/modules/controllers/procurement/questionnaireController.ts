import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  QuestionnaireData, 
  QuestionnaireFormValues 
} from "../../types/procurement";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllQuestionnairesManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<QuestionnaireData>>({
    queryKey: ["questionnaires", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/questionaire/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreateQuestionnaireManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    QuestionnaireData,
    Error,
    QuestionnaireFormValues
  >({
    endpoint: "/procurements/questionaire/",
    queryKey: ["questionnaires"],
    isAuth: true,
    method: "POST",
  });

  const createQuestionnaire = async (details: QuestionnaireFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Questionnaire creation error:", error);
    }
  };

  return { createQuestionnaire, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdateQuestionnaireManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    QuestionnaireData,
    Error,
    QuestionnaireFormValues
  >({
    endpoint: "/procurements/questionaire/",
    queryKey: ["questionnaires"],
    isAuth: true,
    method: "PATCH",
  });

  const updateQuestionnaire = async (id: string, details: QuestionnaireFormValues) => {
    try {
      const response = await AxiosWithToken.patch(`/procurements/questionaire/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Questionnaire update error:", error);
      throw error;
    }
  };

  return { updateQuestionnaire, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeleteQuestionnaireManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    QuestionnaireData,
    Error,
    Record<string, never>
  >({
    endpoint: "/procurements/questionaire/",
    queryKey: ["questionnaires"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteQuestionnaire = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/procurements/questionaire/${id}`);
      return response.data;
    } catch (error) {
      console.error("Questionnaire delete error:", error);
      throw error;
    }
  };

  return { deleteQuestionnaire, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const useGetAllQuestionnairesQuery = useGetAllQuestionnairesManager;
export const useGetAllQuestionnaires = useGetAllQuestionnairesManager;

export const useAddQuestionnaireMutation = () => {
  const { createQuestionnaire, data, isLoading, isSuccess, error } = CreateQuestionnaireManager();
  return [createQuestionnaire, { data, isLoading, isSuccess, error }] as const;
};

export const useUpdateQuestionnaireMutation = () => {
  const { updateQuestionnaire, data, isLoading, isSuccess, error } = UpdateQuestionnaireManager();
  return [
    (params: { id: string; body: QuestionnaireFormValues }) => updateQuestionnaire(params.id, params.body),
    { data, isLoading, isSuccess, error }
  ] as const;
};

export const useDeleteQuestionnaireMutation = () => {
  const { deleteQuestionnaire, data, isLoading, isSuccess, error } = DeleteQuestionnaireManager();
  return [deleteQuestionnaire, { data, isLoading, isSuccess, error }] as const;
};

export const useDeleteQuestionnaire = () => {
  const { deleteQuestionnaire, data, isLoading, isSuccess, error } = DeleteQuestionnaireManager();
  return [deleteQuestionnaire, { data, isLoading, isSuccess, error }] as const;
};

// Missing named exports - RTK Query style
export const useAddQuestionnaire = useAddQuestionnaireMutation;
export const useUpdateQuestionnaire = useUpdateQuestionnaireMutation;