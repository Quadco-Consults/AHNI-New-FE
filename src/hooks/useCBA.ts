/**
 * CBA (Comparative Bid Analysis) Hooks
 * React Query hooks for CBA committee and approval management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/lib/axios";
import { toast } from "sonner";

// Types
export interface CBA {
  id: string;
  cba_type: "COMMITTEE" | "NON COMMITTEE";
  cba_date: string;
  cba_finalization_date?: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";
  solicitation: {
    id: string;
    title: string;
    rfq_id: string;
  };
  lot?: {
    id: string;
    name: string;
  };
  committee_members: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }>;
  assignee?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  reviewers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }>;
  authorisers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }>;
  approvers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }>;
  reviewed_by?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  authorised_by?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  approved_by_user?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  selected_bid_submission?: {
    id: string;
  };
  recommendation_note?: string;
  selected_total?: number;
  created_datetime: string;
  updated_datetime: string;
}

/**
 * Fetch all CBAs
 */
export const useCBAs = (params?: {
  status?: string;
  cba_type?: string;
  job_category?: string;
}) => {
  return useQuery<{ data: CBA[] }>({
    queryKey: ["cbas", params],
    queryFn: async () => {
      const response = await AxiosWithToken.get("/procurements/cbas/", {
        params,
      });
      if (response.data.results) {
        return { data: response.data.results };
      }
      return response.data;
    },
  });
};

/**
 * Fetch a single CBA by ID
 */
export const useCBA = (id: string) => {
  return useQuery<{ data: CBA }>({
    queryKey: ["cba", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/procurements/cbas/${id}/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get CBA workflow status
 */
export const useCBAWorkflowStatus = (id: string) => {
  return useQuery({
    queryKey: ["cba-workflow-status", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/procurements/cbas/${id}/workflow-status/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Get CBA signature status
 */
export const useCBASignatureStatus = (id: string) => {
  return useQuery({
    queryKey: ["cba-signature-status", id],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/procurements/cbas/${id}/signature-status/`);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Submit CBA for review
 */
export const useSubmitCBAForReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/submit-for-review/`, {});
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", id] });
      toast.success("CBA submitted for review successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit CBA");
    },
  });
};

/**
 * Review CBA (for reviewers)
 */
export const useReviewCBA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signature, comments }: { id: string; signature?: string; comments?: string }) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/review/`, {
        signature,
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-signature-status", variables.id] });
      toast.success("CBA reviewed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to review CBA");
    },
  });
};

/**
 * Reject CBA at review stage
 */
export const useRejectCBAAtReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/review-reject/`, {
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", variables.id] });
      toast.success("CBA rejected at review stage");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject CBA");
    },
  });
};

/**
 * Authorise CBA (for authorisers)
 */
export const useAuthoriseCBA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signature, comments }: { id: string; signature?: string; comments?: string }) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/authorise/`, {
        signature,
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-signature-status", variables.id] });
      toast.success("CBA authorised successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to authorise CBA");
    },
  });
};

/**
 * Reject CBA at authorisation stage
 */
export const useRejectCBAAtAuthorisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/authorise-reject/`, {
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", variables.id] });
      toast.success("CBA rejected at authorisation stage");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject CBA");
    },
  });
};

/**
 * Approve CBA (for approvers)
 */
export const useApproveCBA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signature, comments }: { id: string; signature?: string; comments?: string }) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/approve/`, {
        signature,
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-signature-status", variables.id] });
      toast.success("CBA approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve CBA");
    },
  });
};

/**
 * Reject CBA at approval stage
 */
export const useRejectCBAAtApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comments }: { id: string; comments: string }) => {
      const response = await AxiosWithToken.post(`/procurements/cbas/${id}/approve-reject/`, {
        comments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
      queryClient.invalidateQueries({ queryKey: ["cba", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", variables.id] });
      toast.success("CBA rejected at approval stage");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject CBA");
    },
  });
};
