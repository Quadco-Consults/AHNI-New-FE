"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Import the approval workflow hooks
import {
  useSubmitContractRequest,
  useReviewContractRequest,
  useCompleteReviewContractRequest,
  useAuthorizeContractRequest,
  useApproveContractRequest,
  useRejectContractRequest,
} from "@/features/contracts-grants/controllers/contractController";

interface WorkflowActionsProps {
  contractRequest: any;
  currentUser: any;
  onStatusUpdate: () => void;
}

export default function WorkflowActions({
  contractRequest,
  currentUser,
  onStatusUpdate,
}: WorkflowActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [comment, setComment] = useState("");

  // Initialize all approval hooks
  const { submitContractRequest, isLoading: isSubmitting } = useSubmitContractRequest(contractRequest.id);
  const { reviewContractRequest, isLoading: isReviewing } = useReviewContractRequest(contractRequest.id);
  const { completeReviewContractRequest, isLoading: isCompletingReview } = useCompleteReviewContractRequest(contractRequest.id);
  const { authorizeContractRequest, isLoading: isAuthorizing } = useAuthorizeContractRequest(contractRequest.id);
  const { approveContractRequest, isLoading: isApproving } = useApproveContractRequest(contractRequest.id);
  const { rejectContractRequest, isLoading: isRejecting } = useRejectContractRequest(contractRequest.id);

  const isLoading = isSubmitting || isReviewing || isCompletingReview || isAuthorizing || isApproving || isRejecting;

  const canStartReview = contractRequest.status === "SUBMITTED" &&
    (!contractRequest.current_reviewer || contractRequest.current_reviewer === currentUser?.id);

  const canCompleteReview = contractRequest.status === "UNDER_REVIEW" &&
    (contractRequest.current_reviewer === currentUser?.id ||
     contractRequest.reviewer === currentUser?.id);

  const canAuthorize = contractRequest.status === "REVIEWED" &&
    (!contractRequest.authorizer || contractRequest.authorizer === currentUser?.id);

  const canApprove = contractRequest.status === "AUTHORIZED" &&
    (!contractRequest.approver || contractRequest.approver === currentUser?.id);

  const canReject = ["SUBMITTED", "UNDER_REVIEW", "REVIEWED", "AUTHORIZED"].includes(contractRequest.status);

  const handleAction = async (action: string) => {
    // Only show dialog for reject action (requires comment)
    if (action === 'reject') {
      setSelectedAction(action);
      setIsDialogOpen(true);
      return;
    }

    // Execute other actions immediately without dialog
    await executeAction(action);
  };

  const executeAction = async (action?: string) => {
    const actionToExecute = action || selectedAction;

    // Validate comment for reject action
    if (!comment.trim() && actionToExecute === "reject") {
      toast.error("Comment is required when rejecting a request");
      return;
    }

    try {
      switch (actionToExecute) {
        case 'submit':
          await submitContractRequest();
          toast.success("Request submitted successfully");
          break;
        case 'start_review':
        case 'review':
          await reviewContractRequest();
          toast.success("Review started successfully");
          break;
        case 'complete_review':
          await completeReviewContractRequest();
          toast.success("Review completed successfully");
          break;
        case 'authorize':
          await authorizeContractRequest();
          toast.success("Request authorized successfully");
          break;
        case 'approve':
          await approveContractRequest();
          toast.success("Request approved successfully");
          break;
        case 'reject':
          await rejectContractRequest(comment.trim());
          toast.success("Request rejected");
          break;
        default:
          throw new Error(`Unknown action: ${actionToExecute}`);
      }

      onStatusUpdate();
      setIsDialogOpen(false);
      setComment("");

    } catch (error: any) {
      console.error('Workflow action failed:', error);

      // Handle specific error types
      if (error?.response?.status === 404) {
        toast.error('API endpoint not found. Please contact support.');
      } else if (error?.response?.status === 403) {
        toast.error('You are not authorized to perform this action.');
      } else if (error?.response?.status === 400) {
        toast.error('Invalid request. Please refresh and try again.');
      } else {
        toast.error(error?.message || "Something went wrong");
      }
    }
  };

  const actionButtons = [
    {
      show: contractRequest.status === "DRAFT",
      action: "submit",
      label: "Submit for Review",
      variant: "default" as const,
    },
    {
      show: canStartReview,
      action: "start_review",
      label: "Start Review",
      variant: "default" as const,
    },
    {
      show: canCompleteReview,
      action: "complete_review",
      label: "Complete Review",
      variant: "default" as const,
    },
    {
      show: canAuthorize,
      action: "authorize",
      label: "Authorize",
      variant: "default" as const,
    },
    {
      show: canApprove,
      action: "approve",
      label: "Give Final Approval",
      variant: "default" as const,
    },
  ];

  const visibleActions = actionButtons.filter(button => button.show);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {visibleActions.map((button) => (
          <Button
            key={button.action}
            variant={button.variant}
            className="w-full flex items-center justify-start gap-2"
            onClick={() => handleAction(button.action)}
            disabled={isLoading}
          >
            {button.label}
          </Button>
        ))}

        {/* Reject button - available to assigned users at their stage */}
        {canReject && (canStartReview || canCompleteReview || canAuthorize || canApprove) && (
          <Button
            variant="destructive"
            className="w-full flex items-center justify-start gap-2"
            onClick={() => handleAction("reject")}
            disabled={isLoading}
          >
            Reject
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Contract Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Please provide a reason for rejecting this contract request. This comment will be visible in the approval history.
            </p>
            <div>
              <Label htmlFor="comment">
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                placeholder="Explain why you are rejecting this request..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setComment("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => executeAction()}
                disabled={isLoading || !comment.trim()}
                variant="destructive"
              >
                {isLoading ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
