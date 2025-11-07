import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  IAnnualSupervisionPlan,
  IPlannedVisit,
  IAnnualPlanDashboardData,
  ICreateAnnualPlanRequest,
  ICreateAnnualPlanManualRequest,
  IUpdatePlannedVisitRequest,
  IUploadValidationResult,
  IUploadProcessingResult,
} from "../types/annual-supervision-plan";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// Fallback template creation function
const createFallbackTemplate = () => {
  console.log('📝 Creating fallback Excel template...');

  // Create CSV content with the required columns
  const csvContent = `Location Name,Location Code,Facility Name,Visit Type,Requires Evaluation,Preferred Quarter,Duration (Days)
"Sample Location 1","LOC001","Sample Facility 1","SUPPORTIVE_SUPERVISION","YES","Q1","3"
"Sample Location 2","LOC002","Sample Facility 2","INTEGRATED_SUPPORTIVE_SUPERVISION","NO","Q2","5"
"Sample Location 3","LOC003","Sample Facility 3","SUPPORTIVE_SUPERVISION","YES","Q3","2"`;

  // Create a blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'annual-supervision-plan-template.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  console.log('✅ Fallback CSV template downloaded successfully');
  return { success: true, filename: 'annual-supervision-plan-template.csv', fallback: true };
};

// Base URLs for API endpoints (matching backend implementation)
const ANNUAL_PLAN_BASE_URL = "programs/plans/annual-supervision-plans/";
const PLANNED_VISIT_BASE_URL = "programs/plans/planned-visits/";

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
        console.error("Annual supervision plans API error:", error);

        // Handle specific backend errors
        const errorData = axiosError.response?.data as any;
        if (errorData?.message?.includes("'Location' is not defined")) {
          throw new Error("Backend configuration error: Location model not properly imported. Please check the Django backend imports.");
        }

        throw new Error("Sorry: " + (errorData?.message || "Failed to load annual supervision plans"));
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

        // If the endpoint returns 405 Method Not Allowed, skip validation
        if (error.response?.status === 405) {
          console.warn("⚠️ Validation endpoint not available (405), skipping validation step");
          return {
            isValid: true,
            errors: [],
            message: "Validation skipped - endpoint not available"
          };
        }

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
        console.log('🔍 DEBUG: Create Annual Plan Data:', {
          financial_year_id: data.financial_year_id,
          title: data.title,
          description: data.description,
          reviewer_id: data.reviewer_id,
          authorizer_id: data.authorizer_id,
          approver_id: data.approver_id,
          upload_file: data.upload_file?.name
        });

        const formData = new FormData();
        formData.append('financial_year_id', data.financial_year_id);
        formData.append('title', data.title);
        if (data.description) {
          formData.append('description', data.description);
        }

        // Add workflow assignment fields with explicit logging
        console.log('🔍 DEBUG: Assignment field values:', {
          reviewer_id: data.reviewer_id,
          authorizer_id: data.authorizer_id,
          approver_id: data.approver_id
        });

        if (data.reviewer_id && data.reviewer_id !== 'none') {
          formData.append('reviewer_id', data.reviewer_id);
          console.log('✅ Added reviewer_id:', data.reviewer_id);
        }
        if (data.authorizer_id && data.authorizer_id !== 'none') {
          formData.append('authorizer_id', data.authorizer_id);
          console.log('✅ Added authorizer_id:', data.authorizer_id);
        }
        if (data.approver_id && data.approver_id !== 'none') {
          formData.append('approver_id', data.approver_id);
          console.log('✅ Added approver_id:', data.approver_id);
        }

        formData.append('upload_file', data.upload_file);

        // Log what's in formData
        console.log('🔍 DEBUG: FormData contents:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }

        const response = await AxiosWithToken.post(ANNUAL_PLAN_BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('✅ Upload Success response:', response.data);
        console.log('🔍 DEBUG: Created plan assignment fields from upload:', {
          reviewer_id: response.data?.data?.reviewer_id,
          authorizer_id: response.data?.data?.authorizer_id,
          approver_id: response.data?.data?.approver_id,
          reviewer_name: response.data?.data?.reviewer_name,
          authorizer_name: response.data?.data?.authorizer_name,
          approver_name: response.data?.data?.approver_name
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

// Create Annual Plan with Manual Form (JSON for manual endpoint)
export const useCreateAnnualPlanManual = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateAnnualPlanManualRequest): Promise<IAnnualSupervisionPlan> => {
      try {
        console.log('📊 Sending JSON data to manual endpoint:', data);

        // Send JSON data directly to manual endpoint
        const requestData = {
          financial_year_id: data.financial_year_id,
          title: data.title,
          description: data.description || '',
          // Add workflow assignment fields
          reviewer_id: data.reviewer_id || null,
          authorizer_id: data.authorizer_id || null,
          approver_id: data.approver_id || null,
          planned_visits: data.planned_visits.map(visit => {
            // Ensure the 3 required fields are always present and valid
            const mappedVisit = {
              // REQUIRED FIELDS (as per backend specification)
              location_name: visit.location_name || '', // Must be string
              visit_type: visit.visit_type || 'SUPPORTIVE_SUPERVISION', // Must be valid enum
              requires_evaluation: visit.requires_evaluation === "YES" || visit.requires_evaluation === true, // Must be boolean

              // OPTIONAL UUID FIELDS (null if empty, to avoid UUID validation errors)
              location_id: visit.location_id && visit.location_id.trim() !== '' ? visit.location_id : null,
              facility_id: visit.facility_id && visit.facility_id.trim() !== '' ? visit.facility_id : null,

              // OPTIONAL STRING FIELDS (empty string is fine)
              location_code: visit.location_code || '',
              facility_name: visit.facility_name || '',
              preferred_quarter: visit.preferred_quarter || '',

              // OPTIONAL NUMBER FIELD
              duration_days: visit.duration_days || 1
            };

            // Validate that required fields have valid values
            if (!mappedVisit.location_name || mappedVisit.location_name.trim() === '') {
              console.error('❌ Missing required location_name for visit:', visit);
            }
            if (!mappedVisit.visit_type || !['SUPPORTIVE_SUPERVISION', 'INTEGRATED_SUPPORTIVE_SUPERVISION'].includes(mappedVisit.visit_type)) {
              console.error('❌ Invalid visit_type for visit:', visit);
            }
            if (typeof mappedVisit.requires_evaluation !== 'boolean') {
              console.error('❌ Invalid requires_evaluation type for visit:', visit);
            }

            return mappedVisit;
          })
        };

        console.log('📋 JSON request data for manual endpoint:', JSON.stringify(requestData, null, 2));
        console.log('🔗 API URL:', `${ANNUAL_PLAN_BASE_URL}manual/`);

        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}manual/`, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('✅ Success response:', response.data);
        console.log('🔍 DEBUG: Created plan assignment fields:', {
          reviewer_id: response.data?.data?.reviewer_id,
          authorizer_id: response.data?.data?.authorizer_id,
          approver_id: response.data?.data?.approver_id,
          reviewer_name: response.data?.data?.reviewer_name,
          authorizer_name: response.data?.data?.authorizer_name,
          approver_name: response.data?.data?.approver_name
        });
        return response.data;
      } catch (error: any) {
        console.error("❌ Manual creation error:", error);
        console.error("📊 Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          data: error.response?.data,
          headers: error.response?.headers
        });
        console.error("🌐 Request that failed:", {
          url: `${ANNUAL_PLAN_BASE_URL}manual/`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify(data, null, 2)
        });

        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create annual plan manually"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annual-supervision-plans"] });
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

// Submit Plan for Review
export const useSubmitForReview = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/submit-for-review/`);
        return response.data;
      } catch (error: any) {
        console.error("Submit for review error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit plan for review"
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

// Review Annual Plan
export const useReviewAnnualPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { decision: 'APPROVE' | 'REJECT'; comments?: string }) => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/review/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Annual plan review error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to review annual plan"
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

// Submit Plan for Authorization
export const useSubmitForAuthorization = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/submit-for-authorization/`);
        return response.data;
      } catch (error: any) {
        console.error("Submit for authorization error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit plan for authorization"
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

// Authorize Annual Plan
export const useAuthorizeAnnualPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { decision: 'APPROVE' | 'REJECT'; comments?: string }) => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/authorize/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Annual plan authorization error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to authorize annual plan"
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

// Submit Plan for Approval
export const useSubmitForApproval = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/submit-for-approval/`);
        return response.data;
      } catch (error: any) {
        console.error("Submit for approval error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit plan for approval"
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

// Approve Annual Plan
export const useApproveAnnualPlan = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { decision: 'APPROVE' | 'REJECT'; comments?: string }) => {
      try {
        const response = await AxiosWithToken.post(`${ANNUAL_PLAN_BASE_URL}${id}/approve/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Annual plan approval error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to approve annual plan"
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
        console.log('🔄 Starting template download...');
        console.log('📡 API URL:', `${ANNUAL_PLAN_BASE_URL}download-template/`);

        const response = await AxiosWithToken.get(
          `${ANNUAL_PLAN_BASE_URL}download-template/`,
          {
            responseType: 'blob',
          }
        );

        console.log('✅ Template downloaded successfully');
        console.log('📊 Response status:', response.status);
        console.log('📁 Response headers:', response.headers);
        console.log('📝 Blob size:', response.data.size);

        // Check if the response is actually a blob
        if (!response.data || response.data.size === 0) {
          throw new Error('Downloaded file is empty or invalid');
        }

        // Get filename from headers if available
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'annual-supervision-plan-template.xlsx';

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        console.log('📄 Filename:', filename);

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        console.log('🎉 File download initiated successfully');
        return { success: true, filename };
      } catch (error: any) {
        console.error("❌ Template download error:", error);
        console.error("📊 Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });

        // Handle specific error cases
        if (error.response?.status === 404) {
          console.log('⚠️ Backend template endpoint not found, creating fallback template...');
          // Create a fallback template if backend endpoint doesn't exist
          return createFallbackTemplate();
        } else if (error.response?.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        } else if (error.response?.status === 403) {
          throw new Error("Access denied. You don't have permission to download the template.");
        } else if (error.response?.status === 500) {
          throw new Error("Server error. Please try again later or contact support.");
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          throw new Error("Network error. Please check your internet connection.");
        }

        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
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