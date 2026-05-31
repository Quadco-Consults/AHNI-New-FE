import useApiManager from "@/constants/mainController";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import {
  ISiteVisit,
  ISiteVisitTeamMember,
  ISiteVisitApproval,
  TSiteVisitPaginatedData,
  TSiteVisitApplicationFormValues,
  ISiteVisitReport,
  ICreateSiteVisitRequest,
  IUpdateStatusRequest,
  IApprovalActionRequest,
  IDashboardResponse,
  ISiteVisitListParams,
  IErrorResponse,
} from "../types/site-visit";
import { TPaginatedResponse, TRequest, TResponse } from "definations/index";

// Updated Base URLs for Backend Alignment
const SITE_VISIT_BASE_URL = "programs/site-visits/";
const TEAM_MEMBER_BASE_URL = "programs/site-visit-team-members/";
const APPROVAL_BASE_URL = "programs/site-visit-approvals/";

// ===== MAIN SITE VISIT ENDPOINTS =====

// Get All Site Visits (Updated for backend alignment)
export const useGetAllSiteVisits = (params: ISiteVisitListParams = {}) => {
  const {
    page = 1,
    page_size = 20,
    search = "",
    status = "",
    visit_type = "",
    location = "",
    project = "",
    start_date = "",
    ordering = "-created_datetime",
  } = params;

  return useQuery<TPaginatedResponse<TSiteVisitPaginatedData>>({
    queryKey: ["site-visits", page, page_size, search, status, visit_type, location, project, start_date, ordering],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(SITE_VISIT_BASE_URL, {
          params: { page, page_size, search, status, visit_type, location, project, start_date, ordering },
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

// Get Single Site Visit (Updated for backend alignment)
export const useGetSingleSiteVisit = (id: string, enabled: boolean = true) => {
  return useQuery<TResponse<ISiteVisit>>({
    queryKey: ["site-visit", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}${id}/`);
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

// Create Site Visit (Updated for backend alignment)
export const useCreateSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateSiteVisitRequest) => {
      try {
        const response = await AxiosWithToken.post(SITE_VISIT_BASE_URL, data);
        return response.data;
      } catch (error: any) {
        console.error("Site visit create error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create site visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
    },
  });
};

// Update Site Visit (Updated for backend alignment)
export const useUpdateSiteVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ICreateSiteVisitRequest>) => {
      try {
        const response = await AxiosWithToken.put(`${SITE_VISIT_BASE_URL}${id}/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Site visit update error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update site visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
    },
  });
};

// Delete Site Visit
export const useDeleteSiteVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.delete(`${SITE_VISIT_BASE_URL}${id}/`);
        return response.data;
      } catch (error: any) {
        console.error("Site visit delete error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete site visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
    },
  });
};

// Update Site Visit Status (New backend endpoint)
export const useUpdateSiteVisitStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IUpdateStatusRequest) => {
      try {
        const response = await AxiosWithToken.post(`${SITE_VISIT_BASE_URL}${id}/update_status/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Site visit status update error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update site visit status"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
    },
  });
};

// Generate EAs from Approved Site Visit (New backend endpoint)
export const useGenerateEAsFromSiteVisit = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${SITE_VISIT_BASE_URL}${id}/generate_eas/`);
        return response.data;
      } catch (error: any) {
        console.error("EA generation error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to generate EAs from site visit"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
      queryClient.invalidateQueries({ queryKey: ["site-visit-team-members"] });
    },
  });
};

// Get Site Visit Approval Status (Updated for backend alignment)
export const useGetSiteVisitApprovalStatus = (id: string) => {
  return useQuery({
    queryKey: ["site-visit-approval-status", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}${id}/approval_status/`);
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

// Get My Pending Approvals (New backend endpoint)
export const useGetMyPendingApprovals = () => {
  return useQuery({
    queryKey: ["my-pending-approvals"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}my_approvals/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Site Visit Dashboard Statistics (New backend endpoint)
export const useGetSiteVisitDashboard = () => {
  return useQuery<IDashboardResponse>({
    queryKey: ["site-visit-dashboard"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}dashboard/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// ===== TEAM MEMBER ENDPOINTS =====

// Get All Team Members for a Site Visit
export const useGetSiteVisitTeamMembers = (siteVisitId: string) => {
  return useQuery<TPaginatedResponse<ISiteVisitTeamMember>>({
    queryKey: ["site-visit-team-members", siteVisitId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(TEAM_MEMBER_BASE_URL, {
          params: { site_visit: siteVisitId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!siteVisitId,
    refetchOnWindowFocus: false,
  });
};

// Add Team Member to Site Visit (New backend endpoint)
export const useAddTeamMember = (siteVisitId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      user: string;
      role: string;
      per_day_allowance?: number;
      transport_cost?: number;
      accommodation_cost?: number;
      comments?: string;
    }) => {
      try {
        const response = await AxiosWithToken.post(`${SITE_VISIT_BASE_URL}${siteVisitId}/add_team_member/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Add team member error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add team member"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-team-members", siteVisitId] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", siteVisitId] });
    },
  });
};

// Remove Team Member from Site Visit (New backend endpoint)
export const useRemoveTeamMember = (siteVisitId: string, memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.delete(`${SITE_VISIT_BASE_URL}${siteVisitId}/team-members/${memberId}/`);
        return response.data;
      } catch (error: any) {
        console.error("Remove team member error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to remove team member"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-team-members", siteVisitId] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", siteVisitId] });
    },
  });
};

// Generate EA for Team Member (New backend endpoint)
export const useGenerateTeamMemberEA = (memberId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${TEAM_MEMBER_BASE_URL}${memberId}/generate_ea/`);
        return response.data;
      } catch (error: any) {
        console.error("Generate team member EA error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to generate EA for team member"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-team-members"] });
    },
  });
};

// Get My Site Visits as Team Member (New backend endpoint)
export const useGetMyVisitsAsTeamMember = () => {
  return useQuery({
    queryKey: ["my-visits-as-team-member"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${TEAM_MEMBER_BASE_URL}my_visits/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Eligible Team Members (AHNI + Consultants + Facilitators + Adhoc Staff)
export const useGetEligibleTeamMembers = (search?: string) => {
  return useQuery({
    queryKey: ["eligible-team-members", search],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}eligible_team_members/`, {
          params: search ? { search } : {},
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

// ===== APPROVAL ENDPOINTS =====

// Get All Approvals for a Site Visit
export const useGetSiteVisitApprovals = (siteVisitId: string) => {
  return useQuery<TPaginatedResponse<ISiteVisitApproval>>({
    queryKey: ["site-visit-approvals", siteVisitId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(APPROVAL_BASE_URL, {
          params: { site_visit: siteVisitId },
        });
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!siteVisitId,
    refetchOnWindowFocus: false,
  });
};

// Perform Approval Action (New backend endpoint)
export const useApprovalAction = (approvalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: IApprovalActionRequest) => {
      try {
        const response = await AxiosWithToken.post(`${APPROVAL_BASE_URL}${approvalId}/approve_action/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Approval action error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to process approval action"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-approvals"] });
    },
  });
};

// Quick Approve (New backend endpoint)
export const useQuickApprove = (approvalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comments?: string) => {
      try {
        const response = await AxiosWithToken.post(`${APPROVAL_BASE_URL}${approvalId}/approve/`, { comments });
        return response.data;
      } catch (error: any) {
        console.error("Quick approve error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to approve"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-approvals"] });
    },
  });
};

// Quick Reject (New backend endpoint)
export const useQuickReject = (approvalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { comments?: string; rejection_reason?: string }) => {
      try {
        const response = await AxiosWithToken.post(`${APPROVAL_BASE_URL}${approvalId}/reject/`, data);
        return response.data;
      } catch (error: any) {
        console.error("Quick reject error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to reject"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["my-pending-approvals"] });
    },
  });
};

// Get Pending Approvals for Current User (New backend endpoint)
export const useGetPendingApprovals = () => {
  return useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${APPROVAL_BASE_URL}pending/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Get Approval History for Site Visit (New backend endpoint)
export const useGetApprovalHistory = (siteVisitId: string) => {
  return useQuery({
    queryKey: ["approval-history", siteVisitId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${APPROVAL_BASE_URL}site-visit/${siteVisitId}/history/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!siteVisitId,
    refetchOnWindowFocus: false,
  });
};

// Get Approval Dashboard (New backend endpoint)
export const useGetApprovalDashboard = () => {
  return useQuery({
    queryKey: ["approval-dashboard"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${APPROVAL_BASE_URL}dashboard/`);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Sorry: " + (axiosError.response?.data as any)?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

// Send Reminder for Approval (New backend endpoint)
export const useSendApprovalReminder = (approvalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await AxiosWithToken.post(`${APPROVAL_BASE_URL}${approvalId}/send_reminder/`);
        return response.data;
      } catch (error: any) {
        console.error("Send reminder error:", error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send reminder"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visit-approvals"] });
    },
  });
};

// ===== LEGACY HOOKS FOR BACKWARD COMPATIBILITY =====

// Submit Site Visit for Approval (Legacy - now uses update status)
export const useSubmitSiteVisit = (id: string) => {
  return useUpdateSiteVisitStatus(id);
};

// Approve/Reject Site Visit (Legacy - now uses approval action)
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
        // Find the approval for current user by getting approval status first
        const approvalStatusResponse = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}${id}/approval_status/`);
        const approvals = approvalStatusResponse.data?.data?.approvals || [];

        // Find pending approval for current user
        const currentUserApproval = approvals.find((approval: any) =>
          approval.status === 'PENDING' && approval.is_current_user_approval
        );

        if (!currentUserApproval) {
          throw new Error("No pending approval found for current user");
        }

        const response = await AxiosWithToken.post(
          `${APPROVAL_BASE_URL}${currentUserApproval.id}/approve_action/`,
          {
            action: action.toUpperCase(),
            comments,
          }
        );

        return response.data;
      } catch (error: any) {
        console.error('Site Visit Approval error:', error);
        throw new Error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to process approval"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["site-visit", id] });
    },
  });
};

// Create EA from Approved Site Visit (Legacy - now uses generate EAs)
export const useCreateEAFromSiteVisit = (id: string) => {
  return useGenerateEAsFromSiteVisit(id);
};

// ===== SITE VISIT REPORTS (Keeping existing implementation) =====

// Get Site Visit Report
export const useGetSiteVisitReport = (id: string) => {
  return useQuery<TResponse<ISiteVisitReport>>({
    queryKey: ["site-visit-report", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`${SITE_VISIT_BASE_URL}${id}/report/`);
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
    endpoint: `${SITE_VISIT_BASE_URL}${siteVisitId}/report/`,
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

// ===== EXPORTS FOR BACKWARD COMPATIBILITY =====

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

