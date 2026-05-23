import { useQuery } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import { ConsultantAuthUtils } from "./consultantAuthController";
import {
  DeliverablesListResponse,
  DeliverableDetailResponse,
  DeliverableOverviewResponse,
} from "../types/deliverable";

// Deliverables endpoints
const DELIVERABLES_ENDPOINTS = {
  LIST: "/contract-grants/consultant-portal/deliverables/",
  DETAIL: (id: string) => `/contract-grants/consultant-portal/deliverables/${id}/`,
  OVERVIEW: "/contract-grants/consultant-portal/deliverables/overview/",
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
