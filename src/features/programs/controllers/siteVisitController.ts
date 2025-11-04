import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ISiteVisitData,
  TSiteVisitPaginatedData,
  TSiteVisitApplicationFormValues,
  ISiteVisitReport,
} from "../types/site-visit";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

const BASE_URL = "programs/plans/site-visits/";

// ===== SITE VISIT HOOKS =====

// Get All Site Visits
export const useGetAllSiteVisits = ({
  page = 1,
  size = 20,
  search = "",
  status = "",
  site_visit_type = "",
  enabled = true,
}: TRequest & {
  status?: string;
  site_visit_type?: string;
  enabled?: boolean;
}) => {
  return useQuery<TPaginatedResponse<TSiteVisitPaginatedData>>({
    queryKey: ["site-visits", page, size, search, status, site_visit_type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(BASE_URL, {
          params: { page, size, search, status, site_visit_type },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

// Get Single Site Visit
export const useGetSingleSiteVisit = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<ISiteVisitData>>({
    queryKey: ["site-visit", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/`);
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

// Create Site Visit Application
export const useCreateSiteVisit = () => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISiteVisitData,
    Error,
    TSiteVisitApplicationFormValues
  >({
    endpoint: BASE_URL,
    queryKey: ["site-visits"],
    isAuth: true,
    method: "POST",
  });

  const createSiteVisit = async (details: TSiteVisitApplicationFormValues) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Site visit create error:", error);
    }
  };

  return { createSiteVisit, data, isLoading, isSuccess, error };
};

// Update Site Visit Application
export const useUpdateSiteVisit = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISiteVisitData,
    Error,
    Partial<TSiteVisitApplicationFormValues>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["site-visits", "site-visit"],
    isAuth: true,
    method: "PUT",
  });

  const updateSiteVisit = async (details: Partial<TSiteVisitApplicationFormValues>) => {
    try {
      await callApi(details);
    } catch (error) {
      console.error("Site visit update error:", error);
    }
  };

  return { updateSiteVisit, data, isLoading, isSuccess, error };
};

// Delete Site Visit
export const useDeleteSiteVisit = (id: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISiteVisitData,
    Error,
    Record<string, never>
  >({
    endpoint: `${BASE_URL}${id}/`,
    queryKey: ["site-visits"],
    isAuth: true,
    method: "DELETE",
  });

  const deleteSiteVisit = async () => {
    try {
      await callApi({} as Record<string, never>);
    } catch (error) {
      console.error("Site visit delete error:", error);
    }
  };

  return { deleteSiteVisit, data, isLoading, isSuccess, error };
};

// Submit Site Visit for Approval
export const useSubmitSiteVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${BASE_URL}${id}/submit/`);
        return response.data;
      } catch (error: any) {
        console.error("Site visit submit error:", error);

        if (error.response?.status === 404) {
          throw new Error("Site visit not found or you don't have permission to submit it.");
        }
        if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Cannot submit site visit. Please check all required fields are completed."
          );
        }
        throw new Error(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to submit site visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
    },
  });
};

// Approve/Reject Site Visit (3-Level Workflow: Reviewer → Authorizer → Approver)
export const useApproveSiteVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      comments,
    }: {
      action: "approve" | "reject";
      comments?: string;
    }) => {
      try {
        const endpoint = `${BASE_URL}${id}/approve/`;
        console.log('🔵 Site Visit Approval endpoint:', endpoint);
        console.log('🔵 Request payload:', { action, comments });

        const response = await AxiosWithToken.post(
          endpoint,
          {
            action,
            comments,
          }
        );

        console.log('✅ Site Visit Approval response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ Site Visit Approval error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });

        // Check if response is HTML (backend endpoint not deployed)
        const isHtmlResponse = typeof error.response?.data === 'string' &&
          error.response?.data.trim().startsWith('<!DOCTYPE');

        if (error.response?.status === 404) {
          if (isHtmlResponse) {
            throw new Error(
              "The site visit approval endpoint is not yet deployed to the server. Please contact the backend team to deploy the /approve/ endpoint."
            );
          }
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Site visit not found. It may have been deleted or you don't have permission to access it."
          );
        }
        if (error.response?.status === 403) {
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "You don't have permission to approve this site visit at this level."
          );
        }
        if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Cannot approve at this time. Check the approval workflow status."
          );
        }
        throw new Error(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to process approval"
        );
      }
    },
    onSuccess: () => {
      // Refresh site visit data
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
    },
  });
};

// Get Site Visit Approval Status
export const useGetSiteVisitApprovalStatus = (id: string) => {
  return useQuery({
    queryKey: ["site-visit-approval-status", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}${id}/approval-status/`
        );
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(
          "Sorry: " + (axiosError.response?.data as any)?.message
        );
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// Create EA from Approved Site Visit (Triggered automatically on final approval)
export const useCreateEAFromSiteVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${BASE_URL}${id}/create-ea/`);
        return response.data;
      } catch (error: any) {
        console.error("EA creation error:", error);

        if (error.response?.status === 404) {
          throw new Error("Site visit not found or not eligible for EA creation.");
        }
        if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Site visit is not yet approved or EA has already been created."
          );
        }
        throw new Error(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to create EA from site visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
    },
  });
};

// Get Site Visit Report
export const useGetSiteVisitReport = (id: string) => {
  return useQuery<TResponse<ISiteVisitReport>>({
    queryKey: ["site-visit-report", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${BASE_URL}${id}/report/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// Create/Update Site Visit Report
export const useCreateSiteVisitReport = (siteVisitId: string) => {
  const { callApi, isLoading, isSuccess, error, data } = useApiManager<
    ISiteVisitReport,
    Error,
    {
      report_title: string;
      executive_summary: string;
      objectives_met: string;
      challenges_encountered?: string;
      recommendations: string;
      next_steps?: string;
      attachments?: string[];
    }
  >({
    endpoint: `${BASE_URL}${siteVisitId}/report/`,
    queryKey: ["site-visit-report"],
    isAuth: true,
    method: "POST",
  });

  const createReport = async (reportData: {
    report_title: string;
    executive_summary: string;
    objectives_met: string;
    challenges_encountered?: string;
    recommendations: string;
    next_steps?: string;
    attachments?: string[];
  }) => {
    try {
      await callApi(reportData);
    } catch (error) {
      console.error("Site visit report create error:", error);
    }
  };

  return { createReport, data, isLoading, isSuccess, error };
};

// Legacy exports for backward compatibility
export const useGetAllSiteVisitsQuery = useGetAllSiteVisits;
export const useGetSingleSiteVisitQuery = useGetSingleSiteVisit;
export const useCreateSiteVisitMutation = useCreateSiteVisit;
export const useUpdateSiteVisitMutation = useUpdateSiteVisit;
export const useDeleteSiteVisitMutation = useDeleteSiteVisit;

// Named exports for consistency
export const useCreateSiteVisitController = useCreateSiteVisit;
export const useGetAllSiteVisitsManager = useGetAllSiteVisits;
export const useGetSingleSiteVisitManager = useGetSingleSiteVisit;
export const useUpdateSiteVisitManager = useUpdateSiteVisit;
export const useDeleteSiteVisitManager = useDeleteSiteVisit;