import useApiManager from "@/constants/mainController";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

// Types for the workflow
export interface FundRequestApprovalData {
  status: "ADMIN_APPROVED" | "MANAGER_APPROVED" | "REJECTED";
  comments: string;
}

export interface FundRequestReviewData {
  comments?: string;
}

// Review fund request at project office level (PENDING → REVIEWED)
export const useReviewFundRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fundRequestId: string) => {
      try {
        const response = await AxiosWithToken.post(
          `/programs/fund-requests/${fundRequestId}/review/`
          // No request body needed - automatically sets status to REVIEWED
        );
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error("Fund request not found. It may have been deleted or you don't have permission to access it.");
        }
        if (error.response?.status === 400) {
          throw new Error("Fund request cannot be reviewed. Check if it's still in PENDING status.");
        }
        throw new Error(error.response?.data?.message || "Failed to review fund request");
      }
    },
    onSuccess: (data) => {
      // Refresh fund request data after successful review
      queryClient.invalidateQueries({ queryKey: ["fund-requests"] });
      queryClient.invalidateQueries({ queryKey: ["fund-request"] });
      return data;
    },
  });
};

// Approve/Reject fund request (used for both admin and manager approval)
export const useApproveFundRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      fundRequestId, 
      approvalData 
    }: { 
      fundRequestId: string; 
      approvalData: FundRequestApprovalData 
    }) => {
      try {
        const response = await AxiosWithToken.post(
          `/programs/fund-requests/${fundRequestId}/approve/`,
          approvalData
        );
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error("Fund request not found. It may have been deleted or you don't have permission to access it.");
        }
        if (error.response?.status === 403) {
          throw new Error("You don't have permission to perform this action on this fund request.");
        }
        throw new Error(error.response?.data?.message || "Failed to process fund request");
      }
    },
    onSuccess: () => {
      // Refresh fund request data
      queryClient.invalidateQueries({ queryKey: ["fund-requests"] });
      queryClient.invalidateQueries({ queryKey: ["fund-request"] });
    },
  });
};

// Convenience hooks for specific approval stages
export const useAdminApproveFundRequest = () => {
  const approveFundRequest = useApproveFundRequest();
  
  return {
    ...approveFundRequest,
    adminApprove: (fundRequestId: string, comments: string) =>
      approveFundRequest.mutateAsync({
        fundRequestId,
        approvalData: {
          status: "ADMIN_APPROVED",
          comments: comments || "Project head office authorized"
        }
      })
  };
};

export const useManagerApproveFundRequest = () => {
  const approveFundRequest = useApproveFundRequest();
  
  return {
    ...approveFundRequest,
    managerApprove: (fundRequestId: string, comments: string) =>
      approveFundRequest.mutateAsync({
        fundRequestId,
        approvalData: {
          status: "MANAGER_APPROVED",
          comments: comments || "AHNI head office reviewed"
        }
      })
  };
};

export const useRejectFundRequest = () => {
  const approveFundRequest = useApproveFundRequest();
  
  return {
    ...approveFundRequest,
    reject: (fundRequestId: string, comments: string) =>
      approveFundRequest.mutateAsync({
        fundRequestId,
        approvalData: {
          status: "REJECTED",
          comments: comments
        }
      })
  };
};

// Get fund request workflow status
export const useFundRequestWorkflowStatus = (fundRequestId: string) => {
  return useApiManager({
    endpoint: `/programs/fund-requests/${fundRequestId}/status/`,
    queryKey: ["fund-request-status", fundRequestId],
    isAuth: true,
  });
};