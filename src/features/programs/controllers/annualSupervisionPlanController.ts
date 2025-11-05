import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IAnnualSupervisionPlan,
  IPlannedVisit,
  IAnnualPlanDashboardData,
  ICreateAnnualPlanRequest,
  IUpdatePlannedVisitRequest,
  IUploadValidationResult,
  IUploadProcessingResult,
} from "../types/annual-supervision-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// Base URLs for API endpoints
const ANNUAL_PLAN_BASE_URL = "programs/annual-supervision-plans/";
const PLANNED_VISIT_BASE_URL = "programs/planned-visits/";

// ===== ANNUAL SUPERVISION PLAN ENDPOINTS =====

// Get All Annual Plans
export const useGetAllAnnualPlans = (params: {
  page?: number;
  page_size?: number;
  search?: string;
  financial_year?: string;
  status?: string;
} = {}) => {
  const {
    page = 1,
    page_size = 20,
    search = "",
    financial_year = "",
    status = "",
  } = params;

  return useQuery<TPaginatedResponse<IAnnualSupervisionPlan>>({
    queryKey: ["annual-supervision-plans", page, page_size, search, financial_year, status],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(ANNUAL_PLAN_BASE_URL, {
          params: { page, page_size, search, financial_year, status },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Single Annual Plan
export const useGetSingleAnnualPlan = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<IAnnualSupervisionPlan>>({
    queryKey: ["annual-supervision-plan", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${ANNUAL_PLAN_BASE_URL}${id}/`);
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

// Get Current Active Annual Plan
export const useGetCurrentAnnualPlan = (financialYearId?: string) => {
  return useQuery<TResponse<IAnnualSupervisionPlan>>({
    queryKey: ["current-annual-plan", financialYearId],
    queryFn: async () => {
      try {
        const params = financialYearId ? { financial_year: financialYearId } : {};
        const response = await AxiosWithToken.get(`${ANNUAL_PLAN_BASE_URL}current/`, { params });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Annual Plan Dashboard
export const useGetAnnualPlanDashboard = (financialYearId?: string) => {
  return useQuery<TResponse<IAnnualPlanDashboardData>>({
    queryKey: ["annual-plan-dashboard", financialYearId],
    queryFn: async () => {
      try {
        const params = financialYearId ? { financial_year: financialYearId } : {};
        const response = await AxiosWithToken.get(`${ANNUAL_PLAN_BASE_URL}dashboard/`, { params });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Validate Excel Upload
export const useValidateExcelUpload = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<IUploadValidationResult> => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await AxiosWithToken.post(
          `${ANNUAL_PLAN_BASE_URL}validate-upload/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Validation error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to validate upload file"
        );
      }
    },
  });
};

// Create Annual Plan with Excel Upload
export const useCreateAnnualPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateAnnualPlanRequest): Promise<IUploadProcessingResult> => {
      try {
        const formData = new FormData();
        formData.append('financial_year_id', data.financial_year_id);
        formData.append('title', data.title);
        if (data.description) {
          formData.append('description', data.description);
        }
        formData.append('upload_file', data.upload_file);

        const response = await AxiosWithToken.post(ANNUAL_PLAN_BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        console.error("Annual plan creation error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create annual plan"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plans"] });
      queryClient.invalidateQueries({ queryKey: ["current-annual-plan"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
    },
  });
};

// Update Annual Plan
export const useUpdateAnnualPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<IAnnualSupervisionPlan>) => {
      try {
        const response = await AxiosWithToken.put(`${ANNUAL_PLAN_BASE_URL}${id}/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Annual plan update error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update annual plan"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plans"] });
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plan", id] });
      queryClient.invalidateQueries({ queryKey: ["current-annual-plan"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
    },
  });
};

// Delete Annual Plan
export const useDeleteAnnualPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.delete(`${ANNUAL_PLAN_BASE_URL}${id}/`);
        return response.data;
      } catch (error: any) {
        console.error("Annual plan delete error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete annual plan"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plans"] });
      queryClient.invalidateQueries({ queryKey: ["current-annual-plan"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
    },
  });
};

// Activate Annual Plan
export const useActivateAnnualPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/activate/`);
        return response.data;
      } catch (error: any) {
        console.error("Annual plan activation error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to activate annual plan"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plans"] });
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plan", id] });
      queryClient.invalidateQueries({ queryKey: ["current-annual-plan"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
    },
  });
};

// Download Excel Template
export const useDownloadExcelTemplate = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${ANNUAL_PLAN_BASE_URL}download-template/`,
          {
            responseType: 'blob',
          }
        );

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'annual-supervision-plan-template.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
      } catch (error: any) {
        console.error("Template download error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to download template"
        );
      }
    },
  });
};

// ===== PLANNED VISIT ENDPOINTS =====

// Get Planned Visits for Annual Plan
export const useGetPlannedVisits = (annualPlanId: string, params: {
  page?: number;
  page_size?: number;
  status?: string;
  location?: string;
  quarter?: string;
} = {}) => {
  const {
    page = 1,
    page_size = 50,
    status = "",
    location = "",
    quarter = "",
  } = params;

  return useQuery<TPaginatedResponse<IPlannedVisit>>({
    queryKey: ["planned-visits", annualPlanId, page, page_size, status, location, quarter],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(PLANNED_VISIT_BASE_URL, {
          params: {
            annual_plan: annualPlanId,
            page,
            page_size,
            status,
            location,
            quarter
          },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!annualPlanId,
    refetchOnWindowFocus: false,
  });
};

// Get Available Planned Visits for Site Visit Creation
export const useGetAvailablePlannedVisits = (locationId?: string, visitType?: string) => {
  return useQuery<TPaginatedResponse<IPlannedVisit>>({
    queryKey: ["available-planned-visits", locationId, visitType],
    queryFn: async () => {
      try {
        const params: any = { status: 'PLANNED' };
        if (locationId) params.location = locationId;
        if (visitType) params.visit_type = visitType;

        const response = await AxiosWithToken.get(`${PLANNED_VISIT_BASE_URL}available/`, {
          params,
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Update Planned Visit with Site Visit Details
export const useUpdatePlannedVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IUpdatePlannedVisitRequest) => {
      try {
        const response = await AxiosWithToken.put(`${PLANNED_VISIT_BASE_URL}${id}/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Planned visit update error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update planned visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-visits"] });
      queryClient.invalidateQueries({ queryKey: ["available-planned-visits"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
    },
  });
};

// Link Site Visit to Planned Visit
export const useLinkSiteVisitToPlannedVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { planned_visit_id: string; site_visit_id: string }) => {
      try {
        const response = await AxiosWithToken.post(
          `${PLANNED_VISIT_BASE_URL}${data.planned_visit_id}/link-site-visit/`,
          { site_visit_id: data.site_visit_id }
        );
        return response.data;
      } catch (error: any) {
        console.error("Site visit linking error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to link site visit to planned visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-visits"] });
      queryClient.invalidateQueries({ queryKey: ["available-planned-visits"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
    },
  });
};

// Complete Planned Visit
export const useCompletePlannedVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { evaluation_required?: boolean; evaluation_categories?: string[] }) => {
      try {
        const response = await AxiosWithToken.post(
          `${PLANNED_VISIT_BASE_URL}${id}/complete/`,
          data
        );
        return response.data;
      } catch (error: any) {
        console.error("Planned visit completion error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to complete planned visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planned-visits"] });
      queryClient.invalidateQueries({ queryKey: ["annual-plan-dashboard"] });
    },
  });
};

// Get My Planned Visits (as team member or lead)
export const useGetMyPlannedVisits = () => {
  return useQuery<TPaginatedResponse<IPlannedVisit>>({
    queryKey: ["my-planned-visits"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${PLANNED_VISIT_BASE_URL}my-visits/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// All exports are already handled individually above