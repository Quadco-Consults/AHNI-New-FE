import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import { ConsultantAuthUtils } from "./consultantAuthController";
import {
  DeliverablesListResponse,
  DeliverableDetailResponse,
  DeliverableOverviewResponse,
  DeliverableSubmissionResponse,
} from "../types/deliverable";
import { AxiosError } from "axios";

// Deliverables endpoints
const DELIVERABLES_ENDPOINTS = {
  LIST: "/contract-grants/consultant-portal/deliverables/",
  DETAIL: (id: string) => `/contract-grants/consultant-portal/deliverables/${id}/`,
  OVERVIEW: "/contract-grants/consultant-portal/deliverables/overview/",
  SUBMIT: (id: string) => `/contract-grants/consultant-portal/deliverables/${id}/submit/`,
};

// List Deliverables Hook
export const useDeliverables = () => {
  return useQuery({
    queryKey: ['consultant-deliverables'],
    queryFn: async (): Promise<DeliverablesListResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        DELIVERABLES_ENDPOINTS.LIST
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get Deliverable Detail Hook
export const useDeliverableDetail = (id: string) => {
  return useQuery({
    queryKey: ['consultant-deliverable-detail', id],
    queryFn: async (): Promise<DeliverableDetailResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        DELIVERABLES_ENDPOINTS.DETAIL(id)
      );
      return response.data;
    },
    enabled: !!id && ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get Deliverables Overview Hook
export const useDeliverablesOverview = () => {
  return useQuery({
    queryKey: ['consultant-deliverables-overview'],
    queryFn: async (): Promise<DeliverableOverviewResponse> => {
      const response = await ConsultantAxiosWithToken.get(
        DELIVERABLES_ENDPOINTS.OVERVIEW
      );
      return response.data;
    },
    enabled: ConsultantAuthUtils.isConsultantAuthenticated(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Submit Deliverable Hook
interface SubmitDeliverableData {
  submission_notes?: string;
  attachment?: File;
}

export const useSubmitDeliverable = (deliverableId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitDeliverableData): Promise<DeliverableSubmissionResponse> => {
      // Create FormData for file upload
      const formData = new FormData();

      if (data.submission_notes) {
        formData.append('submission_notes', data.submission_notes);
      }

      if (data.attachment) {
        formData.append('attachment', data.attachment);
      }

      const response = await ConsultantAxiosWithToken.post(
        DELIVERABLES_ENDPOINTS.SUBMIT(deliverableId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['consultant-deliverables'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-deliverable-detail', deliverableId] });
      queryClient.invalidateQueries({ queryKey: ['consultant-deliverables-overview'] });
    },
    onError: (error: AxiosError) => {
      console.error('Deliverable submission error:', error);
      throw error;
    },
  });
};
