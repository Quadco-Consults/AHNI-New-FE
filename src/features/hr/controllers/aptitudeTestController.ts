/**
 * Aptitude Test Management Controllers
 * Handles test questions, tests, assignments, and grading
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type {
  AptitudeTest,
  TestQuestion,
  ApplicantTestAssignment,
  ApplicantTestResult,
  TestStatistics,
  CreateTestQuestionForm,
  CreateAptitudeTestForm,
  AddQuestionToTestForm,
  BulkAssignTestForm,
  ManualGradeTestForm,
} from "../types";

const BASE_URL = "/hr/jobs";

// ==================== Test Questions ====================

export const useGetTestQuestions = (enabled = true) => {
  return useQuery({
    queryKey: ["test-questions"],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/test-questions/`);
      return response.data;
    },
    enabled,
  });
};

export const useCreateTestQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTestQuestionForm) => {
      const response = await apiClient.post(`${BASE_URL}/test-questions/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-questions"] });
      toast.success("Test question created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create test question");
    },
  });
};

export const useUpdateTestQuestion = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateTestQuestionForm>) => {
      const response = await apiClient.patch(
        `${BASE_URL}/test-questions/${questionId}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-questions"] });
      queryClient.invalidateQueries({ queryKey: ["test-question", questionId] });
      toast.success("Test question updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update test question");
    },
  });
};

export const useDeleteTestQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      await apiClient.delete(`${BASE_URL}/test-questions/${questionId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-questions"] });
      toast.success("Test question deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete test question");
    },
  });
};

// ==================== Aptitude Tests ====================

export const useGetAptitudeTests = (advertisementId?: string, enabled = true) => {
  return useQuery({
    queryKey: ["aptitude-tests", advertisementId],
    queryFn: async () => {
      const url = advertisementId
        ? `${BASE_URL}/aptitude-tests/?advertisement=${advertisementId}`
        : `${BASE_URL}/aptitude-tests/`;
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled,
  });
};

export const useGetAptitudeTest = (testId: string, enabled = true) => {
  return useQuery({
    queryKey: ["aptitude-test", testId],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/aptitude-tests/${testId}/`);
      return response.data;
    },
    enabled: enabled && !!testId,
  });
};

export const useCreateAptitudeTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAptitudeTestForm) => {
      const response = await apiClient.post(`${BASE_URL}/aptitude-tests/`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["aptitude-tests"] });
      toast.success("Aptitude test created successfully");
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create aptitude test");
    },
  });
};

export const useUpdateAptitudeTest = (testId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CreateAptitudeTestForm>) => {
      const response = await apiClient.patch(
        `${BASE_URL}/aptitude-tests/${testId}/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aptitude-tests"] });
      queryClient.invalidateQueries({ queryKey: ["aptitude-test", testId] });
      toast.success("Aptitude test updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update aptitude test");
    },
  });
};

export const useAddQuestionToTest = (testId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddQuestionToTestForm) => {
      const response = await apiClient.post(
        `${BASE_URL}/aptitude-tests/${testId}/add-question/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aptitude-test", testId] });
      toast.success("Question added to test successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add question to test");
    },
  });
};

export const useRemoveQuestionFromTest = (testId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const response = await apiClient.post(
        `${BASE_URL}/aptitude-tests/${testId}/remove-question/`,
        { question_id: questionId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aptitude-test", testId] });
      toast.success("Question removed from test successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to remove question from test");
    },
  });
};

export const usePublishTest = (testId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(
        `${BASE_URL}/aptitude-tests/${testId}/publish/`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aptitude-test", testId] });
      queryClient.invalidateQueries({ queryKey: ["aptitude-tests"] });
      toast.success("Test published successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to publish test");
    },
  });
};

export const useGetTestStatistics = (testId: string, enabled = true) => {
  return useQuery({
    queryKey: ["test-statistics", testId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${BASE_URL}/aptitude-tests/${testId}/statistics/`
      );
      return response.data;
    },
    enabled: enabled && !!testId,
  });
};

// ==================== Test Assignments ====================

export const useGetTestAssignments = (testId?: string, applicantId?: string, enabled = true) => {
  return useQuery({
    queryKey: ["test-assignments", testId, applicantId],
    queryFn: async () => {
      let url = `${BASE_URL}/test-assignments/`;
      const params = new URLSearchParams();
      if (testId) params.append("test", testId);
      if (applicantId) params.append("applicant", applicantId);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await apiClient.get(url);
      return response.data;
    },
    enabled,
  });
};

export const useGetTestAssignment = (assignmentId: string, enabled = true) => {
  return useQuery({
    queryKey: ["test-assignment", assignmentId],
    queryFn: async () => {
      const response = await apiClient.get(
        `${BASE_URL}/test-assignments/${assignmentId}/`
      );
      return response.data;
    },
    enabled: enabled && !!assignmentId,
  });
};

export const useBulkAssignTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkAssignTestForm) => {
      const response = await apiClient.post(
        `${BASE_URL}/test-assignments/bulk-assign/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-assignments"] });
      toast.success("Test assigned to applicants successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign test");
    },
  });
};

export const useResendTestLink = (assignmentId: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(
        `${BASE_URL}/test-assignments/${assignmentId}/resend-link/`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Test link resent successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resend test link");
    },
  });
};

// ==================== Test Results ====================

export const useGetTestResults = (testId?: string, enabled = true) => {
  return useQuery({
    queryKey: ["test-results", testId],
    queryFn: async () => {
      const url = testId
        ? `${BASE_URL}/test-results/?test=${testId}`
        : `${BASE_URL}/test-results/`;
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled,
  });
};

export const useGetTestResult = (resultId: string, enabled = true) => {
  return useQuery({
    queryKey: ["test-result", resultId],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/test-results/${resultId}/`);
      return response.data;
    },
    enabled: enabled && !!resultId,
  });
};

export const useManualGradeTest = (resultId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ManualGradeTestForm) => {
      const response = await apiClient.post(
        `${BASE_URL}/test-results/${resultId}/manual-grade/`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-result", resultId] });
      queryClient.invalidateQueries({ queryKey: ["test-results"] });
      queryClient.invalidateQueries({ queryKey: ["test-assignments"] });
      toast.success("Test graded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to grade test");
    },
  });
};
