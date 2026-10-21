/**
 * Public Test Taking Controllers
 * For applicants to access and complete tests via unique tokens
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { PublicTestDetail, SubmitTestAnswersForm } from "../types";

const BASE_URL = "/public/hr/test";

// Get test details by access token (no authentication required)
export const useGetPublicTest = (token: string, enabled = true) => {
  return useQuery({
    queryKey: ["public-test", token],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/${token}/`);
      return response.data;
    },
    enabled: enabled && !!token,
    retry: false, // Don't retry on invalid tokens
  });
};

// Start test (marks as IN_PROGRESS)
export const useStartTest = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`${BASE_URL}/${token}/start/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-test", token] });
      toast.success("Test started. Good luck!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start test");
    },
  });
};

// Submit test answers
export const useSubmitTest = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitTestAnswersForm) => {
      const response = await apiClient.post(`${BASE_URL}/${token}/submit/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-test", token] });
      toast.success("Test submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit test");
    },
  });
};

// Save progress (auto-save answers without submitting)
export const useSaveTestProgress = (token: string) => {
  return useMutation({
    mutationFn: async (data: Partial<SubmitTestAnswersForm>) => {
      const response = await apiClient.post(`${BASE_URL}/${token}/save-progress/`, data);
      return response.data;
    },
    onError: (error: any) => {
      console.error("Failed to save progress:", error);
      // Don't show toast for auto-save failures to avoid annoying users
    },
  });
};
