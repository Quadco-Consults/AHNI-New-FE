import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  SupportiveSupervisionData,
  SupportiveSupervisionResponse,
  SupportiveSupervisionEvaluationData,
  EvaluationCriteria,
} from "../types/supportive-supervision";
import {
  SupportiveSupervisionResponseDataSchema,
  SupportiveSupervisionSchema,
} from "definations/program-validator";
import { z } from "zod";

const BASE_URL = "/programs/supportive-supervisions/";

// ===== SUPPORTIVE SUPERVISION HOOKS =====

// Get All Supportive Supervisions
export const useGetSupportiveSupervisions = (enabled: boolean = true) => {
  return useQuery<SupportiveSupervisionData[]>({
    queryKey: ["supportive-supervisions"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL);
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

// Get Supportive Supervisions Evaluation Criteria
export const useGetSupportiveSupervisionsEvaluationCriteria = (enabled: boolean = true) => {
  return useQuery<SupportiveSupervisionEvaluationData[]>({
    queryKey: ["supportive-supervisions-evaluation-criteria"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}evaluation-criteria/`);
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

// Get Single Supportive Supervision
export const useGetSupportiveSupervision = (id: string, enabled: boolean = true) => {
  return useQuery<SupportiveSupervisionData>({
    queryKey: ["supportive-supervision", id],
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

// Get Supportive Supervision Criteria
export const useGetSupportiveSupervisionCriteria = (id: string, enabled: boolean = true) => {
  return useQuery<EvaluationCriteria[]>({
    queryKey: ["supportive-supervision-criteria", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}criteria/${id}/`);
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

// Create Supportive Supervision
export const useCreateSupportiveSupervision = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupportiveSupervisionResponse,
    Error,
    z.infer<typeof SupportiveSupervisionSchema>
  >({
    endpoint: BASE_URL,
    queryKey: ["supportive-supervisions"],
    isAuth: true,
    method: "POST",
  });

  const createSupportiveSupervision = async (details: z.infer<typeof SupportiveSupervisionSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supportive supervision create error:", error);
    }
  };

  return { createSupportiveSupervision, data, isLoading, isSuccess, error };
};

// Create Supportive Supervision Response Data
export const useCreateSupportiveSupervisionResponseData = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupportiveSupervisionResponse,
    Error,
    z.infer<typeof SupportiveSupervisionResponseDataSchema>
  >({
    endpoint: `${BASE_URL}response-data/`,
    queryKey: ["supportive-supervisions"],
    isAuth: true,
    method: "POST",
  });

  const createSupportiveSupervisionResponseData = async (details: z.infer<typeof SupportiveSupervisionResponseDataSchema>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supportive supervision response data create error:", error);
    }
  };

  return { createSupportiveSupervisionResponseData, data, isLoading, isSuccess, error };
};

// Create Supportive Supervision Response Document
export const useCreateSupportiveSupervisionResponseDocument = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupportiveSupervisionResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}response-document/${id}/`,
    queryKey: ["supportive-supervisions"],
    isAuth: true,
    method: "POST",
  });

  const createSupportiveSupervisionResponseDocument = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supportive supervision response document create error:", error);
    }
  };

  return { createSupportiveSupervisionResponseDocument, data, isLoading, isSuccess, error };
};

// Update Supportive Supervision
export const useUpdateSupportiveSupervision = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupportiveSupervisionResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["supportive-supervisions"],
    isAuth: true,
    method: "PUT",
  });

  const updateSupportiveSupervision = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supportive supervision update error:", error);
    }
  };

  return { updateSupportiveSupervision, data, isLoading, isSuccess, error };
};

// Modify Supportive Supervision (PATCH)
export const useModifySupportiveSupervision = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    SupportiveSupervisionResponse,
    Error,
    any
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["supportive-supervisions"],
    isAuth: true,
    method: "PATCH",
  });

  const modifySupportiveSupervision = async (details: any) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Supportive supervision modify error:", error);
    }
  };

  return { modifySupportiveSupervision, data, isLoading, isSuccess, error };
};

// Delete Supportive Supervision
export const useDeleteSupportiveSupervision = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    void,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["supportive-supervisions"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSupportiveSupervision = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Supportive supervision delete error:", error);
    }
  };

  return { deleteSupportiveSupervision, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetSupportiveSupervisionsQuery = useGetSupportiveSupervisions;
export const useGetSupportiveSupervisionsEvaluationCriteriaQuery = useGetSupportiveSupervisionsEvaluationCriteria;
export const useGetSupportiveSupervisionQuery = useGetSupportiveSupervision;
export const useGetSupportiveSupervisionCriteriaQuery = useGetSupportiveSupervisionCriteria;
export const useCreateSupportiveSupervisionMutation = useCreateSupportiveSupervision;
export const useCreateSupportiveSupervisionResponseDataMutation = useCreateSupportiveSupervisionResponseData;
export const useCreateSupportiveSupervisionResponseDocumentMutation = useCreateSupportiveSupervisionResponseDocument;
export const useUpdateSupportiveSupervisionMutation = useUpdateSupportiveSupervision;
export const useModifySupportiveSupervisionMutation = useModifySupportiveSupervision;
export const useDeleteSupportiveSupervisionMutation = useDeleteSupportiveSupervision;