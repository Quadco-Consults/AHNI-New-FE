"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackNavigation from "@/components/BackNavigation";
import FormButton from "@/components/FormButton";
import FormTextArea from "@/components/FormTextArea";
import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import ApprovalHistory from "./ApprovalHistory";

// Import hooks and utilities
import {
  useGetSingleContractRequest,
  useSubmitContractRequest,
  useReviewContractRequest,
  useCompleteReviewContractRequest,
  useAuthorizeContractRequest,
  useApproveContractRequest,
  useRejectContractRequest,
} from "@/features/contracts-grants/controllers/contractController";

import {
  canSubmitContractRequest,
  canReviewContractRequest,
  canCompleteReviewContractRequest,
  canAuthorizeContractRequest,
  canApproveContractRequest,
  canRejectContractRequest,
  getStatusBadgeColor,
} from "@/features/contracts-grants/utils/approvalPermissions";

// Get current user from localStorage
const useCurrentUser = () => {
  try {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user?.id || null;
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
};

// Rejection form schema
const rejectSchema = z.object({
  comment: z.string().min(1, "Comment is required for rejection"),
});

type RejectFormData = z.infer<typeof rejectSchema>;

export default function ContractRequestDetails() {
  const params = useParams();
  const contractRequestId = params?.id as string;
  const currentUserId = useCurrentUser();

  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch contract request data
  const { data: contractData, isLoading, refetch } = useGetSingleContractRequest(
    contractRequestId,
    !!contractRequestId
  );

  const contractRequest = contractData?.data;

  // Initialize approval action hooks
  const { submitContractRequest, isLoading: isSubmitting } = useSubmitContractRequest(contractRequestId);
  const { reviewContractRequest, isLoading: isReviewing } = useReviewContractRequest(contractRequestId);
  const { completeReviewContractRequest, isLoading: isCompletingReview } = useCompleteReviewContractRequest(contractRequestId);
  const { authorizeContractRequest, isLoading: isAuthorizing } = useAuthorizeContractRequest(contractRequestId);
  const { approveContractRequest, isLoading: isApproving } = useApproveContractRequest(contractRequestId);
  const { rejectContractRequest, isLoading: isRejecting } = useRejectContractRequest(contractRequestId);

  // Form for rejection
  const rejectForm = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      comment: "",
    },
  });

  // Permission checks
  const permissions = contractRequest
    ? {
        canSubmit: canSubmitContractRequest(contractRequest, currentUserId || undefined),
        canReview: canReviewContractRequest(contractRequest, currentUserId || undefined),
        canCompleteReview: canCompleteReviewContractRequest(contractRequest, currentUserId || undefined),
        canAuthorize: canAuthorizeContractRequest(contractRequest, currentUserId || undefined),
        canApprove: canApproveContractRequest(contractRequest, currentUserId || undefined),
        canReject: canRejectContractRequest(contractRequest, currentUserId || undefined),
      }
    : null;

  // Helper function to handle API errors
  const handleApiError = (error: any, actionName: string) => {
    // Handle specific HTTP error codes
    if (error?.response?.status === 400) {
      toast.error(`Cannot ${actionName}: Invalid status. Please refresh the page.`);
    } else if (error?.response?.status === 403) {
      toast.error(`Cannot ${actionName}: You don't have permission for this action.`);
    } else if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(`Failed to ${actionName}`);
    }
  };

  // Action handlers
  const handleSubmit = async () => {
    try {
      await submitContractRequest();
      toast.success("Contract request submitted successfully");
      refetch();
    } catch (error: any) {
      handleApiError(error, "submit contract request");
    }
  };

  const handleReview = async () => {
    try {
      await reviewContractRequest();
      toast.success("Review started successfully");
      refetch();
    } catch (error: any) {
      handleApiError(error, "start review");
    }
  };

  const handleCompleteReview = async () => {
    try {
      await completeReviewContractRequest();
      toast.success("Review completed successfully");
      refetch();
    } catch (error: any) {
      handleApiError(error, "complete review");
    }
  };

  const handleAuthorize = async () => {
    try {
      await authorizeContractRequest();
      toast.success("Contract request authorized successfully");
      refetch();
    } catch (error: any) {
      handleApiError(error, "authorize contract request");
    }
  };

  const handleApprove = async () => {
    try {
      await approveContractRequest();
      toast.success("Contract request approved successfully");
      refetch();
    } catch (error: any) {
      handleApiError(error, "approve contract request");
    }
  };

  const handleReject = async (data: RejectFormData) => {
    try {
      await rejectContractRequest(data.comment);
      toast.success("Contract request rejected");
      setShowRejectModal(false);
      rejectForm.reset();
      refetch();
    } catch (error: any) {
      handleApiError(error, "reject contract request");
    }
  };

  if (isLoading) {
    return (
      <section>
        <BackNavigation />
        <Card>
          <p className="text-center py-10">Loading contract request details...</p>
        </Card>
      </section>
    );
  }

  if (!contractRequest) {
    return (
      <section>
        <BackNavigation />
        <Card>
          <p className="text-center py-10 text-red-500">Contract request not found</p>
        </Card>
      </section>
    );
  }

  const isActionInProgress =
    isSubmitting || isReviewing || isCompletingReview || isAuthorizing || isApproving || isRejecting;

  return (
    <section>
      <BackNavigation />

      <Card className="space-y-10">
        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Contract Request Details</h2>
          <div
            className={`px-4 py-2 rounded-full text-white font-semibold bg-${getStatusBadgeColor(
              contractRequest.status
            )}-500`}
          >
            {contractRequest.status_display || contractRequest.status}
          </div>
        </div>

        {/* Contract Request Information */}
        <div className="grid grid-cols-3 gap-10">
          <DescriptionCard
            label="Request Title"
            description={contractRequest.title || "N/A"}
          />

          <DescriptionCard
            label="Request Type"
            description={contractRequest.request_type_display || contractRequest.request_type || "N/A"}
          />

          <DescriptionCard
            label="Requesting Department"
            description={contractRequest.department?.name || "N/A"}
          />

          <DescriptionCard
            label="No of Consultants"
            description={contractRequest.consultants_count?.toString() || "N/A"}
          />

          <DescriptionCard
            label="Location"
            description={contractRequest.location_detail?.name || "N/A"}
          />

          <DescriptionCard label="FCO" description={contractRequest.fco || "N/A"} />

          <DescriptionCard
            label="Technical Monitor"
            description={contractRequest.technical_monitor || "N/A"}
          />

          <DescriptionCard label="Email" description={contractRequest.email || "N/A"} />

          <DescriptionCard
            label="Phone Number"
            description={contractRequest.phone_number || "N/A"}
          />

          <DescriptionCard
            label="Reviewer"
            description={
              contractRequest.current_reviewer_detail
                ? `${contractRequest.current_reviewer_detail.first_name} ${contractRequest.current_reviewer_detail.last_name}`
                : "N/A"
            }
          />

          <DescriptionCard
            label="Authorizer"
            description={
              contractRequest.authorizer_detail
                ? `${contractRequest.authorizer_detail.first_name} ${contractRequest.authorizer_detail.last_name}`
                : "N/A"
            }
          />

          <DescriptionCard
            label="Approver"
            description={
              contractRequest.approver_detail
                ? `${contractRequest.approver_detail.first_name} ${contractRequest.approver_detail.last_name}`
                : "N/A"
            }
          />

          <DescriptionCard
            label="Created By"
            description={
              contractRequest.created_by && typeof contractRequest.created_by === 'object'
                ? contractRequest.created_by.full_name
                : "N/A"
            }
          />

          <DescriptionCard
            label="Created Date"
            description={
              contractRequest.created_datetime
                ? new Date(contractRequest.created_datetime).toLocaleDateString()
                : "N/A"
            }
          />

          <DescriptionCard
            label="Last Updated"
            description={
              contractRequest.updated_datetime
                ? new Date(contractRequest.updated_datetime).toLocaleDateString()
                : "N/A"
            }
          />
        </div>

        {/* Action Buttons */}
        {permissions && (
          <div className="space-y-5">
            <h3 className="text-xl font-semibold">Actions</h3>

            <div className="flex items-center gap-5 flex-wrap">
              {permissions.canSubmit && (
                <FormButton
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isActionInProgress}
                  className="bg-blue-500"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </FormButton>
              )}

              {permissions.canReview && (
                <FormButton
                  size="lg"
                  onClick={handleReview}
                  disabled={isActionInProgress}
                  className="bg-yellow-500"
                >
                  {isReviewing ? "Starting Review..." : "Start Review"}
                </FormButton>
              )}

              {permissions.canCompleteReview && (
                <FormButton
                  size="lg"
                  onClick={handleCompleteReview}
                  disabled={isActionInProgress}
                  className="bg-purple-500"
                >
                  {isCompletingReview ? "Completing..." : "Complete Review"}
                </FormButton>
              )}

              {permissions.canAuthorize && (
                <FormButton
                  size="lg"
                  onClick={handleAuthorize}
                  disabled={isActionInProgress}
                  className="bg-indigo-500"
                >
                  {isAuthorizing ? "Authorizing..." : "Authorize"}
                </FormButton>
              )}

              {permissions.canApprove && (
                <FormButton
                  size="lg"
                  onClick={handleApprove}
                  disabled={isActionInProgress}
                  className="bg-green-500"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </FormButton>
              )}

              {permissions.canReject && (
                <FormButton
                  size="lg"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isActionInProgress}
                  className="bg-red-500"
                >
                  Reject
                </FormButton>
              )}
            </div>

            {!permissions.canSubmit &&
              !permissions.canReview &&
              !permissions.canCompleteReview &&
              !permissions.canAuthorize &&
              !permissions.canApprove &&
              !permissions.canReject && (
                <p className="text-gray-500 italic">
                  No actions available for your role at this stage.
                </p>
              )}
          </div>
        )}
      </Card>

      {/* Approval History */}
      <Card className="mt-5">
        <ApprovalHistory comments={contractRequest.comments} />
      </Card>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Reject Contract Request</h3>
            <Form {...rejectForm}>
              <form
                onSubmit={rejectForm.handleSubmit(handleReject)}
                className="space-y-5"
              >
                <FormTextArea
                  label="Rejection Comment"
                  name="comment"
                  placeholder="Please provide a reason for rejection"
                  required
                />

                <div className="flex items-center gap-5">
                  <FormButton
                    type="button"
                    size="lg"
                    onClick={() => {
                      setShowRejectModal(false);
                      rejectForm.reset();
                    }}
                    disabled={isRejecting}
                    className="bg-gray-500"
                  >
                    Cancel
                  </FormButton>

                  <FormButton
                    type="submit"
                    size="lg"
                    disabled={isRejecting}
                    className="bg-red-500"
                  >
                    {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                  </FormButton>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </section>
  );
}
