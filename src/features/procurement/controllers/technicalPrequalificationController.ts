/**
 * API Controller for Technical Prequalification (National Open Tender RFQs)
 * Connects to backend endpoints in modules/procurements/endpoints/cba/technical_prequalification.py
 */

import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  TechnicalCriteriaLibrary,
  TechnicalPrequalificationCriteria,
  VendorTechnicalEvaluation,
  TechnicalPrequalificationSummary,
  TechnicalEvaluationMatrixResponse,
  InitializeCriteriaPayload,
  BulkEvaluationPayload,
  ShortlistResponse,
  CompleteEvaluationResponse,
} from "../types/technical-prequalification";
import { TResponse, TPaginatedResponse } from "definitions/index";

const BASE_URL = "procurements/";

// ===== CRITERIA LIBRARY HOOKS =====

/**
 * Get technical criteria library (master list of reusable criteria)
 */
export const useGetCriteriaLibrary = (params?: {
  category?: string;
  is_active?: boolean;
  commonly_used?: boolean;
  enabled?: boolean;
}) => {
  const { category, is_active, commonly_used, enabled = true } = params || {};

  return useQuery<TPaginatedResponse<TechnicalCriteriaLibrary>>({
    queryKey: ["technical-criteria-library", category, is_active, commonly_used],
    queryFn: async () => {
      try {
        const queryParams: any = {};
        if (category) queryParams.category = category;
        if (is_active !== undefined) queryParams.is_active = is_active;
        if (commonly_used !== undefined) queryParams.commonly_used = commonly_used;

        const response = await AxiosWithToken.get(`${BASE_URL}technical-criteria-library/`, {
          params: queryParams,
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

/**
 * Get list of unique criteria categories
 */
export const useGetCriteriaCategories = (enabled: boolean = true) => {
  return useQuery<TResponse<{ categories: string[] }>>({
    queryKey: ["technical-criteria-categories"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-criteria-library/categories/`);
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

/**
 * Create new criteria in library
 */
export const useCreateCriteriaLibrary = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    Omit<TechnicalCriteriaLibrary, 'id' | 'created_datetime' | 'modified_datetime'>
  >({
    endpoint: `${BASE_URL}technical-criteria-library/`,
    queryKey: ["technical-criteria-library"],
    isAuth: true,
    method: "POST",
  });

  const createCriteriaLibrary = async (details: Omit<TechnicalCriteriaLibrary, 'id' | 'created_datetime' | 'modified_datetime'>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Create criteria library error:", error);
      throw error;
    }
  };

  return { createCriteriaLibrary, data, isLoading, isSuccess, error };
};

// ===== CBA CRITERIA HOOKS =====

/**
 * Get technical criteria selected for a specific CBA
 */
export const useGetCriteriaForCba = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<TechnicalPrequalificationCriteria>>({
    queryKey: ["technical-prequalification-criteria", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-prequalification-criteria/`, {
          params: { cba: cbaId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Initialize criteria for a CBA from library + custom criteria
 */
export const useInitializeCriteriaFromLibrary = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    InitializeCriteriaPayload
  >({
    endpoint: `${BASE_URL}technical-prequalification-criteria/initialize-from-library/`,
    queryKey: ["technical-prequalification-criteria"],
    isAuth: true,
    method: "POST",
  });

  const initializeCriteria = async (details: InitializeCriteriaPayload) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Initialize criteria error:", error);
      throw error;
    }
  };

  return { initializeCriteria, data, isLoading, isSuccess, error };
};

// ===== EVALUATION HOOKS =====

/**
 * Get all technical evaluations for a CBA
 */
export const useGetEvaluationsForCba = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<VendorTechnicalEvaluation>>({
    queryKey: ["technical-evaluation", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-evaluation/`, {
          params: { cba: cbaId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get evaluations for a specific bid submission
 */
export const useGetEvaluationsForBid = (bidSubmissionId: string, enabled: boolean = true) => {
  return useQuery<TPaginatedResponse<VendorTechnicalEvaluation>>({
    queryKey: ["technical-evaluation-bid", bidSubmissionId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-evaluation/`, {
          params: { bid_submission: bidSubmissionId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!bidSubmissionId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Bulk update evaluations for multiple vendors/criteria
 */
export const useBulkEvaluate = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    any,
    Error,
    BulkEvaluationPayload
  >({
    endpoint: `${BASE_URL}technical-evaluation/bulk-evaluate/`,
    queryKey: ["technical-evaluation"],
    isAuth: true,
    method: "POST",
  });

  const bulkEvaluate = async (details: BulkEvaluationPayload) => {
    try {
      const result = await callApi(details);
      return result;
    } catch (error) {
      console.error("Bulk evaluate error:", error);
      throw error;
    }
  };

  return { bulkEvaluate, data, isLoading, isSuccess, error };
};

// ===== EVALUATION MATRIX HOOKS =====

/**
 * Get complete technical evaluation matrix for a CBA
 * Returns vendors × criteria grid with all evaluations
 */
export const useGetEvaluationMatrix = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<TechnicalEvaluationMatrixResponse>>({
    queryKey: ["technical-evaluation-matrix", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-evaluation-matrix/${cbaId}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Mark technical evaluation as complete and move to shortlisting
 */
export const useCompleteEvaluation = (cbaId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<CompleteEvaluationResponse>,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}technical-evaluation-matrix/${cbaId}/complete-evaluation/`,
    queryKey: ["technical-evaluation-matrix", "technical-evaluation"],
    isAuth: true,
    method: "POST",
  });

  const completeEvaluation = async () => {
    try {
      const result = await callApi({} as Record<string, never>);
      return result;
    } catch (error) {
      console.error("Complete evaluation error:", error);
      throw error;
    }
  };

  return { completeEvaluation, data, isLoading, isSuccess, error };
};

// ===== SHORTLIST HOOKS =====

/**
 * Get all vendors and their shortlist status for a CBA
 */
export const useGetShortlist = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<ShortlistResponse>>({
    queryKey: ["technical-shortlist", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-shortlist/`, {
          params: { cba: cbaId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Get only shortlisted vendors for a CBA
 */
export const useGetShortlistedOnly = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<{
    count: number;
    vendors: TechnicalPrequalificationSummary[];
  }>>({
    queryKey: ["technical-shortlist-only", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}technical-shortlist/shortlisted-only/`, {
          params: { cba: cbaId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled && !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// ===== EXPORTS =====

const TechnicalPrequalificationAPI = {
  // Criteria library
  useGetCriteriaLibrary,
  useGetCriteriaCategories,
  useCreateCriteriaLibrary,
  // CBA criteria
  useGetCriteriaForCba,
  useInitializeCriteriaFromLibrary,
  // Evaluations
  useGetEvaluationsForCba,
  useGetEvaluationsForBid,
  useBulkEvaluate,
  // Matrix
  useGetEvaluationMatrix,
  useCompleteEvaluation,
  // Shortlist
  useGetShortlist,
  useGetShortlistedOnly,
};

export default TechnicalPrequalificationAPI;
