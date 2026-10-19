/**
 * Staffing Requisition Hooks
 * React Query hooks for Staffing Requisition management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";
import { toast } from "sonner";

// Types
export interface StaffingRequisition {
  id: string;
  requisition_code: string;
  date: string;
  position: {
    id: string;
    title: string;
  };
  nature_of_hire: "EXTERNAL_ADVERT" | "INTERNAL_ADVERT";
  position_type: "FIXED_TERM" | "PERMANENT" | "TEMPORARY" | "CONSULTANCY";
  department: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
  supervisor?: string;
  fco_number?: string;
  number_of_staff: number;
  expected_date_of_resumption: string;
  working_tools_available: boolean;
  employment_status: "FULL_TIME" | "REDUCED_SCHEDULE" | "TEMPORARY" | "INTERN";
  major_duties_responsibilities: string;
  language_requirements: string;
  justification?: string;
  grade_level: string;
  office_type: "HQ" | "STATE";
  position_nature: "NEW" | "REPLACEMENT";
  hiring_manager: string;
  dof?: string;
  hr_reviewer: string;
  spm_stl?: string;
  director_of_operations: string;
  managing_director: string;
  status: "DRAFT" | "PENDING_REVIEW" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CANCELLED";
  approval_progress: number;
  required_approvals: string[];
  completed_approvals: string[];
  current_approver?: string;
  created_by: {
    id: string;
    email: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface StaffingRequisitionCreate {
  position: string;
  nature_of_hire: "EXTERNAL_ADVERT" | "INTERNAL_ADVERT";
  position_type: "FIXED_TERM" | "PERMANENT" | "TEMPORARY" | "CONSULTANCY";
  department: string;
  location?: string;
  supervisor?: string;
  fco_number?: string;
  number_of_staff?: number;
  expected_date_of_resumption: string;
  working_tools_available?: boolean;
  employment_status: "FULL_TIME" | "REDUCED_SCHEDULE" | "TEMPORARY" | "INTERN";
  major_duties_responsibilities: string;
  language_requirements?: string;
  justification?: string;
  grade_level: string;
  office_type: "HQ" | "STATE";
  position_nature: "NEW" | "REPLACEMENT";
  hiring_manager: string;
  dof?: string;
  hr_reviewer: string;
  spm_stl?: string;
  director_of_operations: string;
  managing_director: string;
}

/**
 * Fetch all staffing requisitions with optional filters
 */
export const useStaffingRequisitions = (params?: {
  status?: string;
  department?: string;
  position?: string;
  office_type?: string;
  position_nature?: string;
}) => {
  return useQuery<{ data: StaffingRequisition[] }>({
    queryKey: ["staffing-requisitions", params],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/hr/staffing-requisitions/", {
        params,
      });
      // Handle paginated response from Django REST Framework
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch a single staffing requisition by ID
 */
export const useStaffingRequisition = (id: string) => {
  return useQuery<{ data: StaffingRequisition }>({
    queryKey: ["staffing-requisition", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/hr/staffing-requisitions/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch the current user's requisitions
 */
export const useMyRequisitions = () => {
  return useQuery<{ data: StaffingRequisition[] }>({
    queryKey: ["my-requisitions"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/hr/staffing-requisitions/my-requisitions/");
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch requisitions pending the current user's approval
 */
export const usePendingApprovals = () => {
  return useQuery<{ data: StaffingRequisition[] }>({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/hr/staffing-requisitions/pending-approvals/");
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Create a new staffing requisition
 */
export const useCreateStaffingRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StaffingRequisitionCreate) => {
      const response = await AxiosWithToken.post("/hr/staffing-requisitions/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["my-requisitions"] });
      toast.success("Staff requisition created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create requisition");
    },
  });
};

/**
 * Update a staffing requisition
 */
export const useUpdateStaffingRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaffingRequisitionCreate> }) => {
      const response = await AxiosWithToken.patch(`/hr/staffing-requisitions/${id}/`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-requisition", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["my-requisitions"] });
      toast.success("Staff requisition updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update requisition");
    },
  });
};

/**
 * Delete a staffing requisition
 */
export const useDeleteStaffingRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.delete(`/hr/staffing-requisitions/${id}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["my-requisitions"] });
      toast.success("Staff requisition deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete requisition");
    },
  });
};

/**
 * Submit a requisition for review
 */
export const useSubmitForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/hr/staffing-requisitions/${id}/submit-for-review/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-requisition", id] });
      queryClient.invalidateQueries({ queryKey: ["my-requisitions"] });
      toast.success("Requisition submitted for review");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit requisition");
    },
  });
};

/**
 * Approve a staffing requisition
 */
export const useApproveRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments?: string }) => {
      const response = await AxiosWithToken.post(`/hr/staffing-requisitions/${id}/approve/`, {
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-requisition", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      toast.success("Requisition approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve requisition");
    },
  });
};

/**
 * Reject a staffing requisition
 */
export const useRejectRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const response = await AxiosWithToken.post(`/hr/staffing-requisitions/${id}/reject/`, {
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-requisition", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      toast.success("Requisition rejected");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject requisition");
    },
  });
};

/**
 * Cancel a staffing requisition
 */
export const useCancelRequisition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/hr/staffing-requisitions/${id}/cancel/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["staffing-requisitions"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-requisition", id] });
      queryClient.invalidateQueries({ queryKey: ["my-requisitions"] });
      toast.success("Requisition cancelled");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel requisition");
    },
  });
};
