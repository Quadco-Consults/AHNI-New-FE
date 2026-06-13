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
  ITemplateDownloadResult,
} from "../types/annual-supervision-plan";
import { TPaginatedResponse, TResponse } from "definitions/index";

// Fallback template creation function
const createFallbackTemplate = (): ITemplateDownloadResult => {
  console.log('📝 Creating fallback Excel template...');

  // Create comprehensive CSV content with the required columns and better examples
  const csvContent = `Location Name,Location Code,Facility Name,Visit Type,Requires Evaluation,Preferred Quarter,Duration (Days)
"Regional Hospital North","RHN001","Regional Hospital North Main Building","SUPPORTIVE_SUPERVISION","YES","Q1","3"
"District Health Office East","DHO002","District Health Office East","INTEGRATED_SUPPORTIVE_SUPERVISION","NO","Q2","5"
"Primary Healthcare Center West","PHC003","Primary Healthcare Center West","SUPPORTIVE_SUPERVISION","YES","Q3","2"
"Community Health Post South","CHP004","Community Health Post South","SUPPORTIVE_SUPERVISION","NO","Q4","1"
"Maternal Health Clinic Central","MHC005","Maternal Health Clinic Central","INTEGRATED_SUPPORTIVE_SUPERVISION","YES","Q1","4"`;

  // Create enhanced CSV with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const enhancedCsvContent = BOM + csvContent;

  // Create a blob with CSV content optimized for Excel
  const blob = new Blob([enhancedCsvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  // Create download link with improved handling
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'annual-supervision-plan-template.csv');
    link.style.display = 'none';
    document.body.appendChild(link);

    // Force click and cleanup
    link.click();

    // Cleanup after delay
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (cleanupError) {
        console.warn('⚠️ Cleanup warning:', cleanupError);
      }
    }, 1000);

    console.log('✅ Fallback CSV template downloaded successfully');
    console.log('📋 Template includes 5 sample entries with all required and optional fields');
    console.log('💡 Tip: Save this CSV file and open it in Excel to use as your template');

    return {
      success: true,
      filename: 'annual-supervision-plan-template.csv',
      fallback: true,
      message: 'CSV template downloaded successfully. Open in Excel to edit and save as .xlsx when done.'
    };
  } catch (error: any) {
    console.error('❌ Failed to create fallback template:', error);
    throw new Error('Unable to download template. Please contact support.');
  }
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

  return useQuery<TResponse<TPaginatedResponse<IAnnualSupervisionPlan>>>({
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
        formData.append('upload_file', file);  // Fixed: Use 'upload_file' to match backend expectation

        console.log('🔍 DEBUG: Validating file:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        const response = await AxiosWithToken.post(
          `${ANNUAL_PLAN_BASE_URL}validate-upload/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 seconds timeout for validation
          }
        );

        // Transform backend response to match frontend interface
        const backendData = response.data?.data || response.data;
        console.log('🔍 DEBUG: Backend validation response:', backendData);

        // Extract errors array - handle both object and string formats
        const errors = [];
        if (backendData.errors) {
          for (const error of backendData.errors) {
            if (typeof error === 'string') {
              errors.push(error);
            } else if (error.error) {
              errors.push(error.error);
            } else {
              errors.push(JSON.stringify(error));
            }
          }
        }

        // Extract warnings array
        const warnings = backendData.warnings || [];

        // Transform to frontend interface
        const transformedResponse: IUploadValidationResult = {
          isValid: backendData.is_valid || false,
          errors: errors,
          warnings: warnings,
          validRows: backendData.preview_data || [],
          invalidRows: [], // Backend doesn't seem to provide this in the current format
          totalRows: backendData.total_rows || 0,
          validRowsCount: backendData.valid_rows || 0,
          message: backendData.message || (backendData.is_valid ? 'Validation successful' : 'Validation completed with issues')
        };

        console.log('🔍 DEBUG: Transformed response:', transformedResponse);
        return transformedResponse;
      } catch (error: any) {
        console.error("Validation error:", error);

        // If the endpoint returns 405 Method Not Allowed, skip validation
        if (error.response?.status === 405) {
          console.warn("⚠️ Validation endpoint not available (405), skipping validation step");
          return {
            isValid: true,
            errors: [],
            warnings: [],
            validRows: [],
            invalidRows: [],
            totalRows: 0,
            validRowsCount: 0,
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
    retry: false, // Disable automatic retries to prevent multiple requests
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

        // Debug file before appending to FormData
        console.log('🔍 DEBUG: File before FormData append:', {
          file: data.upload_file,
          name: data.upload_file?.name,
          size: data.upload_file?.size,
          type: data.upload_file?.type,
          lastModified: data.upload_file?.lastModified
        });

        if (!data.upload_file || data.upload_file.size === 0) {
          throw new Error('File is empty or undefined. Please select a valid file.');
        }

        // Additional file validation - try to read a small portion to verify it's readable
        try {
          const fileSlice = data.upload_file.slice(0, 100);
          const arrayBuffer = await fileSlice.arrayBuffer();
          console.log('🔍 File content validation:', {
            firstBytesLength: arrayBuffer.byteLength,
            firstFewBytes: Array.from(new Uint8Array(arrayBuffer.slice(0, 20))).map(b => b.toString(16).padStart(2, '0')).join(' ')
          });
        } catch (readError) {
          console.error('❌ File read validation failed:', readError);
          throw new Error('File appears to be corrupted or unreadable. Please select a different file.');
        }

        formData.append('upload_file', data.upload_file);

        // Log what's in formData
        console.log('🔍 DEBUG: FormData contents:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}:`, {
              name: value.name,
              size: value.size,
              type: value.type,
              lastModified: value.lastModified
            });
          } else {
            console.log(`  ${key}:`, value);
          }
        }

        // Check token before making request
        const token = localStorage.getItem('token');
        console.log('🔍 DEBUG: Token status:', {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN'
        });

        // === COMPREHENSIVE REQUEST DEBUG START ===
        console.log('🔥 ABOUT TO MAKE REQUEST - COMPLETE DEBUG:', {
          url: ANNUAL_PLAN_BASE_URL,
          fullUrl: `${AxiosWithToken.defaults.baseURL || ''}${ANNUAL_PLAN_BASE_URL}`,
          method: 'POST',
          timeout: 120000,
          formDataKeys: Array.from(formData.keys()),
          axiosInstance: 'AxiosWithToken',
          timestamp: new Date().toISOString()
        });

        // Detailed FormData analysis
        console.log('📋 DETAILED FORMDATA ANALYSIS:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  📁 ${key}:`, {
              name: value.name,
              size: value.size,
              type: value.type,
              lastModified: new Date(value.lastModified).toISOString(),
              isFile: true
            });
          } else {
            console.log(`  📝 ${key}:`, {
              value: value,
              type: typeof value,
              length: value?.length || 0,
              isFile: false
            });
          }
        }

        // Environment debug
        console.log('🌐 REQUEST ENVIRONMENT:', {
          nodeEnv: process.env.NODE_ENV,
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          userAgent: navigator.userAgent,
          currentUrl: window.location.href
        });

        const response = await AxiosWithToken.post(ANNUAL_PLAN_BASE_URL, formData, {
          timeout: 120000, // 2 minutes timeout for file processing
          // Note: Don't set Content-Type - let browser handle FormData boundaries
        });

        console.log('🎉 REQUEST COMPLETED SUCCESSFULLY:', {
          status: response.status,
          statusText: response.statusText,
          responseSize: JSON.stringify(response.data || {}).length,
          responseHeaders: response.headers
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
        // === COMPREHENSIVE ERROR ANALYSIS ===
        console.error("❌ UPLOAD FAILED - COMPREHENSIVE ERROR ANALYSIS:");

        // Basic error info
        console.error("🔍 BASIC ERROR INFO:", {
          errorType: error.constructor.name,
          message: error.message,
          code: error.code,
          stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
        });

        // Response analysis
        if (error.response) {
          console.error("📡 HTTP RESPONSE DETAILS:", {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: {...error.response.headers},
            responseData: error.response.data,
            responseDataType: typeof error.response.data,
            responseDataString: JSON.stringify(error.response.data, null, 2)
          });

          // Special analysis for different status codes
          if (error.response.status === 500) {
            console.error("🚨 500 INTERNAL SERVER ERROR ANALYSIS:", {
              likelyCauses: [
                'Backend code error',
                'Database connection issue',
                'Serializer validation error',
                'File processing error',
                'Missing dependencies'
              ],
              responseBody: error.response.data,
              responseHeaders: error.response.headers
            });
          }

          if (error.response.status === 400) {
            console.error("📋 400 BAD REQUEST ANALYSIS:", {
              validationErrors: error.response.data?.errors || 'No validation errors in response',
              message: error.response.data?.message || 'No message in response',
              enhancedValidation: JSON.stringify(error.response.data).includes('[ENHANCED_VALIDATION]')
            });
          }
        } else if (error.request) {
          console.error("🌐 NETWORK/REQUEST ERROR:", {
            noResponse: true,
            requestInfo: {
              url: error.config?.url,
              method: error.config?.method,
              timeout: error.config?.timeout,
              baseURL: error.config?.baseURL
            },
            likelyCauses: [
              'Network connectivity issue',
              'CORS error',
              'Request timeout',
              'Server not responding'
            ]
          });
        } else {
          console.error("⚙️ CLIENT-SIDE ERROR:", {
            clientError: true,
            message: error.message,
            likelyCauses: [
              'JavaScript error in request setup',
              'FormData construction error',
              'File reading error'
            ]
          });
        }

        // Request data analysis
        if (error.config?.data instanceof FormData) {
          console.error("📋 REQUEST DATA ANALYSIS:");
          console.error("  🔍 FormData contents that were sent:");
          Array.from(error.config.data.entries()).forEach((entry: any) => {
            const [key, value] = entry;
            if (value instanceof File) {
              console.error(`    📁 ${key}:`, {
                fileName: value.name,
                fileSize: value.size,
                fileType: value.type,
                lastModified: new Date(value.lastModified).toISOString()
              });
            } else {
              console.error(`    📝 ${key}:`, {
                value: value,
                type: typeof value,
                length: String(value).length
              });
            }
          });
        }

        // Configuration analysis
        console.error("⚙️ REQUEST CONFIGURATION:", {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout,
          headers: error.config?.headers ? {...error.config.headers} : 'No headers'
        });

        // Environment context
        console.error("🌍 ENVIRONMENT CONTEXT:", {
          userAgent: navigator.userAgent,
          currentTime: new Date().toISOString(),
          currentUrl: window.location.href,
          nodeEnv: process.env.NODE_ENV,
          baseUrlEnv: process.env.NEXT_PUBLIC_BASE_URL
        });

        console.error("=".repeat(80));

        // Handle specific error types
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          throw new Error("Request timeout. The file processing is taking too long. Please try again or use a smaller file.");
        }

        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
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
              requires_evaluation: (
                typeof visit.requires_evaluation === "boolean"
                  ? visit.requires_evaluation
                  : visit.requires_evaluation === "YES" || visit.requires_evaluation === "yes"
              ), // Must be boolean

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
    mutationFn: async (): Promise<ITemplateDownloadResult> => {
      try {
        console.log('🔄 Starting template download...');
        console.log('📡 API URL:', `${ANNUAL_PLAN_BASE_URL}download-template/`);

        const response = await AxiosWithToken.get(
          `${ANNUAL_PLAN_BASE_URL}download-template/`,
          {
            responseType: 'blob',
            timeout: 30000, // 30 second timeout for downloads
          }
        );

        console.log('✅ Template downloaded successfully');
        console.log('📊 Response status:', response.status);
        console.log('📁 Response headers:', response.headers);
        console.log('📝 Blob size:', response.data?.size || 0);
        console.log('📝 Blob type:', response.data?.type || 'unknown');

        // Check if the response is actually a blob
        if (!response.data || response.data.size === 0) {
          console.warn('⚠️ Downloaded file is empty, using fallback template...');
          return createFallbackTemplate();
        }

        // Check if the response is actually JSON (error response disguised as blob)
        if (response.data.type === 'application/json' || response.data.size < 100) {
          console.warn('⚠️ Response appears to be JSON error, using fallback template...');
          return createFallbackTemplate();
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

        // Ensure we have a proper blob
        let blob = response.data;
        if (!(blob instanceof Blob)) {
          console.log('🔧 Converting response to blob...');
          blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
        }

        // Create download link with additional checks
        try {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          link.style.display = 'none';
          document.body.appendChild(link);

          // Force click and cleanup
          link.click();

          // Cleanup after a short delay to ensure download starts
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 1000);

          console.log('🎉 File download initiated successfully');
          return { success: true, filename };
        } catch (downloadError: any) {
          console.error('❌ Download link creation failed:', downloadError);
          console.log('⚠️ Falling back to CSV template...');
          return createFallbackTemplate();
        }

      } catch (error: any) {
        console.error("❌ Template download error:", error);
        console.error("📊 Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          code: error.code,
          stack: error.stack
        });

        // Handle specific error cases
        if (error.response?.status === 404) {
          console.log('⚠️ Backend template endpoint not found, creating fallback template...');
          return createFallbackTemplate();
        } else if (error.response?.status === 401) {
          throw new Error("Authentication required. Please log in again.");
        } else if (error.response?.status === 403) {
          throw new Error("Access denied. You don't have permission to download the template.");
        } else if (error.response?.status === 500) {
          throw new Error("Server error. Please try again later or contact support.");
        } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || !error.response) {
          console.log('⚠️ Network error, using fallback template...');
          return createFallbackTemplate();
        } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          console.log('⚠️ Request timeout, using fallback template...');
          return createFallbackTemplate();
        }

        // If all else fails, use fallback template
        console.log('⚠️ Unexpected error, using fallback template...');
        return createFallbackTemplate();
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
        console.error("Travel request linking error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to link travel request to planned visit"
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