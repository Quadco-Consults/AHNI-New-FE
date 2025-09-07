import useApiManager from "@/constants/mainController";
import { useQuery } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { z } from "zod";
import { 
  SignatureBlock, 
  ApprovalWorkflow,
  SignatureSubmissionPayload,
  SignatureWorkflowStatus 
} from "../types/cba";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "/procurements/cba-signature-workflow/";

// ===== SIGNATURE WORKFLOW HOOKS =====

// Get CBA Signature Workflow Status
export const useCbaSignatureWorkflow = (cbaId: string, enabled: boolean = true) => {
  return useQuery<TResponse<ApprovalWorkflow>>({
    queryKey: ["cba-signature-workflow", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${cbaId}/status/`);
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

// Submit Signature for CBA
export const useSubmitCbaSignature = (cbaId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<SignatureBlock>,
    Error,
    SignatureSubmissionPayload
  >({
    endpoint: `${BASE_URL}${cbaId}/sign/`,
    queryKey: ["cba-signature-workflow"],
    isAuth: true,
    method: "POST",
  });

  const submitSignature = async (details: SignatureSubmissionPayload) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA signature submission error:", error);
    }
  };

  return { submitSignature, data, isLoading, isSuccess, error };
};

// Get Workflow Status
export const useCbaWorkflowStatus = (cbaId: string) => {
  return useQuery<TResponse<SignatureWorkflowStatus>>({
    queryKey: ["cba-workflow-status", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${cbaId}/workflow-status/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!cbaId,
    refetchOnWindowFocus: false,
  });
};

// Approve CBA Workflow Step
export const useApproveCbaWorkflowStep = (cbaId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<ApprovalWorkflow>,
    Error,
    {
      step: 'prepared' | 'reviewed' | 'authorized' | 'approved' | 'committee';
      remarks?: string;
      signature?: string;
    }
  >({
    endpoint: `${BASE_URL}${cbaId}/approve-step/`,
    queryKey: ["cba-signature-workflow"],
    isAuth: true,
    method: "POST",
  });

  const approveWorkflowStep = async (details: {
    step: 'prepared' | 'reviewed' | 'authorized' | 'approved' | 'committee';
    remarks?: string;
    signature?: string;
  }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA workflow step approval error:", error);
    }
  };

  return { approveWorkflowStep, data, isLoading, isSuccess, error };
};

// Reject CBA Workflow Step
export const useRejectCbaWorkflowStep = (cbaId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    TResponse<ApprovalWorkflow>,
    Error,
    {
      step: 'prepared' | 'reviewed' | 'authorized' | 'approved' | 'committee';
      rejection_reason: string;
    }
  >({
    endpoint: `${BASE_URL}${cbaId}/reject-step/`,
    queryKey: ["cba-signature-workflow"],
    isAuth: true,
    method: "POST",
  });

  const rejectWorkflowStep = async (details: {
    step: 'prepared' | 'reviewed' | 'authorized' | 'approved' | 'committee';
    rejection_reason: string;
  }) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("CBA workflow step rejection error:", error);
    }
  };

  return { rejectWorkflowStep, data, isLoading, isSuccess, error };
};

// Default export for backward compatibility
const SignatureWorkflowAPI = {
  useCbaSignatureWorkflow,
  useSubmitCbaSignature,
  useCbaWorkflowStatus,
  useApproveCbaWorkflowStep,
  useRejectCbaWorkflowStep,
};

export default SignatureWorkflowAPI;