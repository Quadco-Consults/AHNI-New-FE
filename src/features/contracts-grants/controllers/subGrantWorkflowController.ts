import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";

const BASE_URL = "/contract-grants/sub-grants/workflow/";

// ===== WORKFLOW STATUS =====

export const useGetWorkflowStatus = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["subGrantWorkflow", id, "status"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/status/`);
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

// ===== PUBLISH SUB-GRANT =====

export const usePublishSubGrant = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/publish/`,
    queryKey: ["subGrants", "subGrant", id],
    isAuth: true,
    method: "POST",
  });

  const publishSubGrant = async () => {
    try {
      return await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Publish sub-grant error:", error);
      throw error;
    }
  };

  return { publishSubGrant, data, isLoading, isSuccess, error };
};

// ===== OPEN SUBMISSIONS =====

export const useOpenSubmissions = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/open-submissions/`,
    queryKey: ["subGrants", "subGrant", id],
    isAuth: true,
    method: "POST",
  });

  const openSubmissions = async () => {
    try {
      return await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Open submissions error:", error);
      throw error;
    }
  };

  return { openSubmissions, data, isLoading, isSuccess, error };
};

// ===== CLOSE SUBMISSIONS =====

export const useCloseSubmissions = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager({
    endpoint: `${BASE_URL}${id}/close-submissions/`,
    queryKey: ["subGrants", "subGrant", id],
    isAuth: true,
    method: "POST",
  });

  const closeSubmissions = async () => {
    try {
      return await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Close submissions error:", error);
      throw error;
    }
  };

  return { closeSubmissions, data, isLoading, isSuccess, error };
};

// ===== SHORTLIST SUBMISSIONS (BULK) =====

interface ShortlistPayload {
  submission_ids: string[];
}

export const useShortlistSubmissions = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    ShortlistPayload
  >({
    endpoint: `${BASE_URL}${id}/shortlist/`,
    queryKey: ["subGrants", "subGrant", id, "submissions"],
    isAuth: true,
    method: "POST",
  });

  const shortlistSubmissions = async (payload: ShortlistPayload) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Shortlist submissions error:", error);
      throw error;
    }
  };

  return { shortlistSubmissions, data, isLoading, isSuccess, error };
};

// ===== CREATE ASSESSMENT COMMITTEE =====

interface CreateCommitteePayload {
  committee_member_ids: string[];
  chairperson_id: string;
  assessment_deadline: string;
}

export const useCreateCommittee = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    CreateCommitteePayload
  >({
    endpoint: `${BASE_URL}${id}/create-committee/`,
    queryKey: ["subGrants", "subGrant", id],
    isAuth: true,
    method: "POST",
  });

  const createCommittee = async (payload: CreateCommitteePayload) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Create committee error:", error);
      throw error;
    }
  };

  return { createCommittee, data, isLoading, isSuccess, error };
};

// ===== MAKE AWARD DECISION =====

interface MakeAwardPayload {
  awarded_submission_id: string;
  award_amount_usd: string;
  award_amount_ngn: string;
  award_date: string;
  award_justification: string;
  special_conditions?: string;
}

export const useMakeAward = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    MakeAwardPayload
  >({
    endpoint: `${BASE_URL}${id}/make-award/`,
    queryKey: ["subGrants", "subGrant", id],
    isAuth: true,
    method: "POST",
  });

  const makeAward = async (payload: MakeAwardPayload) => {
    try {
      return await callApi(payload);
    } catch (error) {
      console.error("Make award error:", error);
      throw error;
    }
  };

  return { makeAward, data, isLoading, isSuccess, error };
};

// Default export
const SubGrantWorkflowAPI = {
  useGetWorkflowStatus,
  usePublishSubGrant,
  useOpenSubmissions,
  useCloseSubmissions,
  useShortlistSubmissions,
  useCreateCommittee,
  useMakeAward,
};

export default SubGrantWorkflowAPI;
