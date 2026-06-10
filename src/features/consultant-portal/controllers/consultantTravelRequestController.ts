import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";
import { AxiosError } from "axios";
import {
  ISiteVisit,
  ICreateSiteVisitRequest,
  TSiteVisitPaginatedData,
} from "@/features/programs/types/site-visit";
import { TPaginatedResponse, TResponse } from "definations/index";

const SITE_VISIT_BASE_URL = "programs/site-visits/";

// ===== GET ALL TRAVEL REQUESTS (for current consultant) =====
export const useGetConsultantTravelRequests = (
  page: number = 1,
  page_size: number = 10,
  search?: string,
  status?: string,
  ordering?: string
) => {
  return useQuery<TPaginatedResponse<TSiteVisitPaginatedData>>({
    queryKey: ["consultant-travel-requests", page, page_size, search, status, ordering],
    queryFn: async () => {
      try {
        const response = await ConsultantAxiosWithToken.get(SITE_VISIT_BASE_URL, {
          params: { page, page_size, search, status, ordering },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch travel requests: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== GET MY VISITS (Team member assignments) =====
export const useGetMyVisits = (
  page: number = 1,
  page_size: number = 10
) => {
  return useQuery({
    queryKey: ["consultant-my-visits", page, page_size],
    queryFn: async () => {
      try {
        const response = await ConsultantAxiosWithToken.get(`${SITE_VISIT_BASE_URL}my_visits/`, {
          params: { page, page_size },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch my visits: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== GET SINGLE TRAVEL REQUEST =====
export const useGetConsultantTravelRequest = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<ISiteVisit>>({
    queryKey: ["consultant-travel-request", id],
    queryFn: async () => {
      try {
        const response = await ConsultantAxiosWithToken.get(`${SITE_VISIT_BASE_URL}${id}/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch travel request details: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};

// ===== CREATE TRAVEL REQUEST =====
export const useCreateConsultantTravelRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateSiteVisitRequest) => {
      try {
        const response = await ConsultantAxiosWithToken.post(SITE_VISIT_BASE_URL, data);
        return response.data;
      } catch (error: any) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError.response?.data as any)?.message || "Failed to create travel request";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultant-travel-requests"] });
      queryClient.invalidateQueries({ queryKey: ["consultant-my-visits"] });
    },
  });
};

// ===== UPDATE TRAVEL REQUEST =====
export const useUpdateConsultantTravelRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ICreateSiteVisitRequest>) => {
      try {
        const response = await ConsultantAxiosWithToken.put(`${SITE_VISIT_BASE_URL}${id}/`, data);
        return response.data;
      } catch (error: any) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError.response?.data as any)?.message || "Failed to update travel request";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultant-travel-requests"] });
      queryClient.invalidateQueries({ queryKey: ["consultant-travel-request", id] });
      queryClient.invalidateQueries({ queryKey: ["consultant-my-visits"] });
    },
  });
};

// ===== DELETE TRAVEL REQUEST =====
export const useDeleteConsultantTravelRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await ConsultantAxiosWithToken.delete(`${SITE_VISIT_BASE_URL}${id}/`);
        return response.data;
      } catch (error: any) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError.response?.data as any)?.message || "Failed to delete travel request";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultant-travel-requests"] });
    },
  });
};

// ===== GET APPROVAL STATUS =====
export const useGetConsultantTravelRequestApprovalStatus = (id: string) => {
  return useQuery({
    queryKey: ["consultant-travel-request-approval-status", id],
    queryFn: async () => {
      try {
        const response = await ConsultantAxiosWithToken.get(`${SITE_VISIT_BASE_URL}${id}/approval_status/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to fetch approval status: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};
