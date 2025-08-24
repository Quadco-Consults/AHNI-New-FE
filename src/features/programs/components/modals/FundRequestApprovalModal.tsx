"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog } from "store/ui";
import { toast } from "sonner";
import {
  useReviewFundRequest,
  useAdminApproveFundRequest,
  useManagerApproveFundRequest,
  useRejectFundRequest
} from "../../controllers/fundRequestWorkflowController";

const ApprovalSchema = z.object({
  comments: z.string().optional()
});

type TApprovalFormValues = z.infer<typeof ApprovalSchema>;

interface FundRequestApprovalModalProps {
  fundRequestId?: string;
  actionType?: "review" | "admin_approve" | "manager_approve" | "reject";
}

const FundRequestApprovalModal: React.FC<FundRequestApprovalModalProps> = ({
  fundRequestId,
  actionType
}) => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.ui.dailog);
  
  const form = useForm<TApprovalFormValues>({
    resolver: zodResolver(ApprovalSchema),
    defaultValues: {
      comments: ""
    }
  });

  const reviewMutation = useReviewFundRequest();
  const adminApproveMutation = useAdminApproveFundRequest();
  const managerApproveMutation = useManagerApproveFundRequest();
  const rejectMutation = useRejectFundRequest();

  const getActionConfig = () => {
    switch (actionType) {
      case "review":
        return {
          title: "Review Fund Request",
          description: "Confirm project office review - this will change status from PENDING to REVIEWED",
          buttonText: "Complete Review",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          defaultComment: "Project office review completed"
        };
      case "admin_approve":
        return {
          title: "Authorize Fund Request",
          description: "Project head office authorization",
          buttonText: "Authorize",
          buttonColor: "bg-green-600 hover:bg-green-700",
          defaultComment: "Project head office authorized"
        };
      case "manager_approve":
        return {
          title: "Approve Fund Request",
          description: "AHNI head office final approval",
          buttonText: "Approve",
          buttonColor: "bg-green-600 hover:bg-green-700",
          defaultComment: "AHNI head office reviewed and approved"
        };
      case "reject":
        return {
          title: "Reject Fund Request",
          description: "Please provide reason for rejection",
          buttonText: "Reject",
          buttonColor: "bg-red-600 hover:bg-red-700",
          defaultComment: ""
        };
      default:
        return {
          title: "Fund Request Action",
          description: "Please provide your comments",
          buttonText: "Submit",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          defaultComment: ""
        };
    }
  };

  const config = getActionConfig();

  const handleSubmit = async (data: TApprovalFormValues) => {
    if (!fundRequestId) {
      toast.error("Fund request ID is required");
      return;
    }

    try {
      const comments = data.comments || config.defaultComment;

      switch (actionType) {
        case "review":
          // Review endpoint doesn't need comments - automatically changes PENDING → REVIEWED
          await reviewMutation.mutateAsync(fundRequestId);
          toast.success("Fund request reviewed successfully - status changed to REVIEWED");
          break;
        case "admin_approve":
          await adminApproveMutation.adminApprove(fundRequestId, comments);
          toast.success("Fund request authorized successfully");
          break;
        case "manager_approve":
          await managerApproveMutation.managerApprove(fundRequestId, comments);
          toast.success("Fund request approved successfully");
          break;
        case "reject":
          await rejectMutation.reject(fundRequestId, comments);
          toast.success("Fund request rejected");
          break;
        default:
          toast.error("Invalid action type");
          return;
      }

      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      console.error("Approval error:", error);
      
      if (error.message?.includes("not found")) {
        toast.error("Fund request not found. It may have been deleted or moved.");
      } else if (error.message?.includes("permission")) {
        toast.error("You don't have permission to perform this action.");
      } else if (error.message?.includes("models")) {
        toast.error("Server configuration error. Please contact support.");
      } else {
        toast.error(error.message || error.data?.message || "Action failed. Please try again.");
      }
    }
  };

  const handleClose = () => {
    dispatch(closeDialog());
    form.reset();
  };

  const isLoading = 
    reviewMutation.isPending ||
    adminApproveMutation.isPending ||
    managerApproveMutation.isPending ||
    rejectMutation.isPending;

  if (!isOpen || !fundRequestId) return null;

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{config.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <div>
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            placeholder={config.defaultComment || "Enter your comments..."}
            {...form.register("comments")}
            className="mt-1"
            rows={4}
          />
          {form.formState.errors.comments && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.comments.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={config.buttonColor}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : config.buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FundRequestApprovalModal;