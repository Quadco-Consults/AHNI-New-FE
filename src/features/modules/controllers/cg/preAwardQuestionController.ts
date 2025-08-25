import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { 
  PreAwardQuestionData, 
  PreAwardQuestionFormValues 
} from "../../types/cg";
import { 
  FilterParams,
  TPaginatedResponse
} from "../../types";

// GET Operations (Queries)
export const useGetAllPreAwardQuestionsManager = ({ 
  page = 1, 
  size = 20, 
  search = "",
  enabled = true 
}: FilterParams & { enabled?: boolean } = {}) => {
  return useQuery<TPaginatedResponse<PreAwardQuestionData>>({
    queryKey: ["preAwardQuestions", page, size, search],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/contracts-grants/pre-award-questions/", {
        params: { page, size, search }
      });
      return response.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// CREATE Operations (Mutations)
export const CreatePreAwardQuestionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PreAwardQuestionData,
    Error,
    PreAwardQuestionFormValues
  >({
    endpoint: "/contracts-grants/pre-award-questions/",
    queryKey: ["preAwardQuestions"],
    isAuth: true,
    method: "POST",
  });

  const createPreAwardQuestion = async (details: PreAwardQuestionFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Pre-award question creation error:", error);
    }
  };

  return { createPreAwardQuestion, data, isLoading, isSuccess, error };
};

// UPDATE Operations (Mutations)
export const UpdatePreAwardQuestionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PreAwardQuestionData,
    Error,
    PreAwardQuestionFormValues
  >({
    endpoint: "/contracts-grants/pre-award-questions/",
    queryKey: ["preAwardQuestions"],
    isAuth: true,
    method: "PUT",
  });

  const updatePreAwardQuestion = async (id: string, details: PreAwardQuestionFormValues) => {
    try {
      const response = await AxiosWithToken.put(`/contracts-grants/pre-award-questions/${id}/`, details);
      return response.data;
    } catch (error) {
      console.error("Pre-award question update error:", error);
      throw error;
    }
  };

  return { updatePreAwardQuestion, data, isLoading, isSuccess, error };
};

// DELETE Operations (Mutations)
export const DeletePreAwardQuestionManager = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    PreAwardQuestionData,
    Error,
    Record<string, never>
  >({
    endpoint: "/contracts-grants/pre-award-questions/",
    queryKey: ["preAwardQuestions"],
    isAuth: true,
    method: "DELETE",
  });

  const deletePreAwardQuestion = async (id: string) => {
    try {
      const response = await AxiosWithToken.delete(`/contracts-grants/pre-award-questions/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Pre-award question delete error:", error);
      throw error;
    }
  };

  return { deletePreAwardQuestion, data, isLoading, isSuccess, error };
};

// Backward compatibility exports - RTK Query style
export const createPreAwardQuestion = CreatePreAwardQuestionManager;
export const getAllPreAwardQuestions = useGetAllPreAwardQuestionsManager;
export const modifyPreAwardQuestion = UpdatePreAwardQuestionManager;
export const deletePreAwardQuestion = DeletePreAwardQuestionManager;