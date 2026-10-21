/**
 * Final Candidate Score Controllers
 * Combines Aptitude Test (60%) + Interview (40%) for final evaluation
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type {
  FinalCandidateScore,
  FinalScoreReport,
  FinalScoreStatistics,
  CalculateFinalScoreForm,
  BulkCalculateFinalScoreForm,
  UpdateFinalScoreForm,
} from "../types";

const BASE_URL = "/hr/jobs/final-scores";

// ==================== Get Final Scores ====================

export const useGetFinalScores = (filters?: {
  application?: string;
  recommendation?: string;
  advertisement?: string;
}, enabled = true) => {
  return useQuery({
    queryKey: ["final-scores", filters],
    queryFn: async () => {
      let url = `${BASE_URL}/`;
      const params = new URLSearchParams();

      if (filters?.application) params.append("application", filters.application);
      if (filters?.recommendation) params.append("recommendation", filters.recommendation);
      if (filters?.advertisement) params.append("advertisement", filters.advertisement);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await apiClient.get(url);
      return response.data;
    },
    enabled,
  });
};

export const useGetFinalScore = (scoreId: string, enabled = true) => {
  return useQuery({
    queryKey: ["final-score", scoreId],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/${scoreId}/`);
      return response.data;
    },
    enabled: enabled && !!scoreId,
  });
};

export const useGetFinalScoreByApplication = (applicationId: string, enabled = true) => {
  return useQuery({
    queryKey: ["final-score-by-application", applicationId],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/?application=${applicationId}`);
      // Return first result since there's only one final score per application
      return response.data?.data?.[0] || null;
    },
    enabled: enabled && !!applicationId,
  });
};

// ==================== Calculate Final Scores ====================

export const useCalculateFinalScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CalculateFinalScoreForm) => {
      const response = await apiClient.post(`${BASE_URL}/calculate/`, data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["final-scores"] });
      queryClient.invalidateQueries({
        queryKey: ["final-score-by-application", response.data?.application]
      });
      toast.success(response.message || "Final score calculated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to calculate final score");
    },
  });
};

export const useBulkCalculateFinalScores = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkCalculateFinalScoreForm) => {
      const response = await apiClient.post(`${BASE_URL}/bulk-calculate/`, data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["final-scores"] });
      const metadata = response.metadata;
      const successCount = metadata?.total_calculated || 0;
      const errorCount = metadata?.total_errors || 0;

      if (errorCount > 0) {
        toast.warning(
          `Calculated ${successCount} scores successfully. ${errorCount} errors occurred.`
        );
      } else {
        toast.success(`Successfully calculated ${successCount} final scores`);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to bulk calculate final scores");
    },
  });
};

// ==================== Update Final Score ====================

export const useUpdateFinalScore = (scoreId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFinalScoreForm) => {
      const response = await apiClient.patch(`${BASE_URL}/${scoreId}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["final-scores"] });
      queryClient.invalidateQueries({ queryKey: ["final-score", scoreId] });
      toast.success("Final score updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update final score");
    },
  });
};

// ==================== Reports & Statistics ====================

export const useGetFinalScoreReport = (scoreId: string, enabled = true) => {
  return useQuery({
    queryKey: ["final-score-report", scoreId],
    queryFn: async () => {
      const response = await apiClient.get(`${BASE_URL}/${scoreId}/report/`);
      return response.data;
    },
    enabled: enabled && !!scoreId,
  });
};

export const useGetFinalScoreStatistics = (advertisementId?: string, enabled = true) => {
  return useQuery({
    queryKey: ["final-score-statistics", advertisementId],
    queryFn: async () => {
      const url = advertisementId
        ? `${BASE_URL}/statistics/?advertisement_id=${advertisementId}`
        : `${BASE_URL}/statistics/`;
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled,
  });
};

// ==================== Download Report ====================

export const useDownloadFinalScoreReport = () => {
  return useMutation({
    mutationFn: async (scoreId: string) => {
      const response = await apiClient.get(`${BASE_URL}/${scoreId}/report/`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `final-score-report-${scoreId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response.data;
    },
    onSuccess: () => {
      toast.success("Report downloaded successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to download report");
    },
  });
};
