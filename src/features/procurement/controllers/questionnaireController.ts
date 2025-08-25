import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { QuestionairSchema } from "definations/procurement-validator";
import {
  QuestionairData,
  QuestionairResponse,
} from "../types/questionairs";
import { TBasePaginatedResponse } from "definations/auth/auth";
import { TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/questionaire/";

// ===== QUESTIONNAIRE HOOKS =====

// Get All Questionnaires
export const useGetAllQuestionnaires = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  enabled = true,
}: TRequest & { enabled?: boolean }) => {
  return useQuery<TBasePaginatedResponse<QuestionairData>>({
    queryKey: ["questionnaires", page, size, search, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Questionnaire
export const useGetSingleQuestionnaire = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<QuestionairData>>({
    queryKey: ["questionnaire", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!id,
    refetchOnWindowFocus: false,
  });
};

// Create Questionnaire
export const useCreateQuestionnaire = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    QuestionairResponse,
    Error,
    z.infer<typeof QuestionairSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["questionnaires"],
    isAuth: true,
    method: "POST",
  });

  const createQuestionnaire = async (details: z.infer<typeof QuestionairSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Questionnaire create error:", error);
    }
  };

  return { createQuestionnaire, data, isLoading, isSuccess, error };
};

// Update Questionnaire (Full Update)
export const useUpdateQuestionnaire = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    QuestionairResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["questionnaires", "questionnaire"],
    isAuth: true,
    method: "PUT",
  });

  const updateQuestionnaire = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Questionnaire update error:", error);
    }
  };

  return { updateQuestionnaire, data, isLoading, isSuccess, error };
};

// Modify Questionnaire (Partial Update)
export const useModifyQuestionnaire = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    QuestionairResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["questionnaires", "questionnaire"],
    isAuth: true,
    method: "PATCH",
  });

  const modifyQuestionnaire = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Questionnaire modify error:", error);
    }
  };

  return { modifyQuestionnaire, data, isLoading, isSuccess, error };
};

// Delete Questionnaire
export const useDeleteQuestionnaire = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["questionnaires"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteQuestionnaire = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Questionnaire delete error:", error);
    }
  };

  return { deleteQuestionnaire, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetQuestionairsQuery = useGetAllQuestionnaires;
export const useGetQuestionairs = useGetAllQuestionnaires;
export const useGetQuestionairQuery = useGetSingleQuestionnaire;
export const useCreateQuestionairMutation = useCreateQuestionnaire;
export const useUpdateQuestionairMutation = useUpdateQuestionnaire;
export const useModifyQuestionairMutation = useModifyQuestionnaire;
export const useDeleteQuestionairMutation = useDeleteQuestionnaire;

// Default export for backward compatibility
const QuestionairAPI = {
  useGetAllQuestionnaires,
  useGetSingleQuestionnaire,
  useCreateQuestionnaire,
  useUpdateQuestionnaire,
  useModifyQuestionnaire,
  useDeleteQuestionnaire,
  useGetQuestionairsQuery,
  useGetQuestionairs,
  useGetQuestionairQuery,
  useCreateQuestionairMutation,
  useUpdateQuestionairMutation,
  useModifyQuestionairMutation,
  useDeleteQuestionairMutation,
};

export default QuestionairAPI;