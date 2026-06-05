"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import {
  ISiteVisitData,
  ISiteVisitApprovalLevel,
  SiteVisitStatus,
} from "@/features/programs/types/site-visit";

import {
  useApproveSiteVisit,
  useApprovalAction,
  useUpdateSiteVisitStatus
} from "@/features/programs/controllers/siteVisitController";

interface SiteVisitApprovalStatusProps {
  siteVisit: ISiteVisitData;
  onApprovalAction?: (action: "approve" | "reject", comments?: string) => void;
}

const SiteVisitApprovalStatus = ({
  siteVisit,
  onApprovalAction
}: SiteVisitApprovalStatusProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // Force reset the form state to show buttons
  const resetFormState = () => {
    setShowCommentForm(false);
    setComments("");
    setActiveStepId(null);
    setActionType("approve");
  };

  // Fix status inconsistency - if all approvals are done but status isn't "APPROVED"
  const handleFixStatus = async () => {
    try {
      await statusUpdateMutation.mutateAsync({
        status: SiteVisitStatus.APPROVED,
        comments: "Status updated to match completed approvals"
      });
      toast.success("Travel request status updated to APPROVED");
      window.location.reload();
    } catch (error: any) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status");
    }
  };

  // Force reset state on component mount to clear any stuck states
  useEffect(() => {
    resetFormState();
  }, [siteVisit.id]);

  // API hooks
  const approveMutation = useApproveSiteVisit(siteVisit.id);

  // Use direct approval action for specific approval IDs
  const directApprovalMutation = useApprovalAction(activeStepId || "");

  // Status update mutation for fixing status inconsistencies
  const statusUpdateMutation = useUpdateSiteVisitStatus(siteVisit.id);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "PENDING":
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleAction = (type: "approve" | "reject", stepId: string) => {
    setActionType(type);
    setActiveStepId(stepId);
    setShowCommentForm(true);
  };

  const handleSubmitAction = async () => {
    try {
      console.log("🔍 Submitting approval action:", {
        actionType,
        comments,
        activeStepId,
        siteVisitId: siteVisit.id
      });

      if (onApprovalAction) {
        onApprovalAction(actionType, comments);
      } else if (activeStepId && directApprovalMutation) {
        // Use the specific approval ID to make the direct approval call
        const payload = {
          action: actionType.toUpperCase() as 'APPROVE' | 'REJECT',
          comments: comments || undefined,
          rejection_reason: actionType === 'reject' ? comments : undefined,
        };
        console.log("🔍 Direct API payload:", payload);

        const result = await directApprovalMutation.mutateAsync(payload);
        console.log("🔍 API success result:", result);

        // Check if EA was automatically created by backend
        if (actionType === "approve" && result?.data?.ea_created) {
          toast.success(`Travel request ${actionType}d successfully! EA has been automatically created.`);
        } else if (actionType === "approve" && result?.data?.is_final_approval) {
          toast.success(`Travel request ${actionType}d successfully! EA creation is in progress.`);
        } else {
          toast.success(`Travel request ${actionType}d successfully`);
        }

        // Force refresh the travel request data to show updated approval status
        window.location.reload();
      }
      setShowCommentForm(false);
      setComments("");
      setActiveStepId(null);
    } catch (error: any) {
      console.error("Approval action failed:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      toast.error(
        error.message || `Failed to ${actionType} travel request`
      );
      // Reset state even on error so user can try again
      setShowCommentForm(false);
      setComments("");
      setActiveStepId(null);
    }
  };

  const getCurrentUserCanApprove = (step: any) => {
    // For now, we'll check if there's a pending approval for this step
    // In a real implementation, you'd also check if the current user ID matches the approver
    return step.approval?.status === 'PENDING';
  };

  // Debug travel request data
  console.log("🔍 Site Visit Approval Data:", {
    reviewer: siteVisit.reviewer,
    authorizer: siteVisit.authorizer,
    approver: siteVisit.approver,
    reviewer_id: siteVisit.reviewer_id,
    authorizer_id: siteVisit.authorizer_id,
    approver_id: siteVisit.approver_id,
    approvals: siteVisit.approvals,
    approvalsDetails: siteVisit.approvals?.map((a: any) => ({
      id: a.id,
      approval_type: a.approval_type,
      approver: a.approver,
      approver_name: a.approver_name,
      status: a.status,
      status_display: a.status_display,
      approval_date: a.approval_date,
      comments: a.comments,
      is_approved: a.is_approved,
      is_pending: a.is_pending
    })),
    reviewer_name: siteVisit.reviewer_name,
    authorizer_name: siteVisit.authorizer_name,
    approver_name: siteVisit.approver_name,
    created_by: siteVisit.created_by,
    siteVisitKeys: Object.keys(siteVisit)
  });

  // Check if all approvals are completed but status is inconsistent
  const allApprovalsCompleted = siteVisit.approvals?.every((approval: any) => approval.status === 'APPROVED') || false;
  const statusInconsistent = allApprovalsCompleted && siteVisit.status !== SiteVisitStatus.APPROVED;

  // Create approval workflow display based on actual approval records
  const approvalWorkflow = [
    {
      level: 1,
      role: "Reviewer",
      approval: siteVisit.approvals?.find((a: any) => a.approval_type === 'REVIEW'),
    },
    {
      level: 2,
      role: "Authorizer",
      approval: siteVisit.approvals?.find((a: any) => a.approval_type === 'AUTHORIZATION'),
    },
    {
      level: 3,
      role: "Final Approver",
      approval: siteVisit.approvals?.find((a: any) => a.approval_type === 'APPROVAL'),
    },
  ].map(step => ({
    ...step,
    user: step.approval ? {
      first_name: step.approval.approver_name?.split(' ')[0] || step.approval.approver_name,
      last_name: step.approval.approver_name?.split(' ')[1] || '',
      email: step.approval.approver || '', // This is the user ID
      name: step.approval.approver_name || step.approval.approver
    } : null
  }));

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Approval Status</h3>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(siteVisit.status)}>
              {siteVisit.status.replace("_", " ")}
            </Badge>
            {showCommentForm && (
              <Button
                size="sm"
                variant="outline"
                onClick={resetFormState}
                className="text-xs"
              >
                Reset Form
              </Button>
            )}
            {statusInconsistent && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleFixStatus}
                className="text-xs bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
                disabled={statusUpdateMutation.isPending}
              >
                {statusUpdateMutation.isPending ? "Fixing..." : "Fix Status"}
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {siteVisit.status === SiteVisitStatus.DRAFT && (
            <p>This travel request is still in draft mode. Submit it to begin the approval process.</p>
          )}
          {siteVisit.status === SiteVisitStatus.SUBMITTED && (
            <p>Travel request has been submitted and is awaiting review.</p>
          )}
          {siteVisit.status === SiteVisitStatus.APPROVED && (
            <p>Travel request has been fully approved and is ready for execution.</p>
          )}
          {siteVisit.status === SiteVisitStatus.REJECTED && (
            <p>Travel request has been rejected. Please review the comments and resubmit if needed.</p>
          )}
          {siteVisit.status === SiteVisitStatus.EA_GENERATED && (
            <p>Travel request has been approved and an EA has been automatically created.</p>
          )}
        </div>

        {siteVisit.submitted_date && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} />
            <span>Submitted: {formatDate(siteVisit.submitted_date)}</span>
          </div>
        )}

        {siteVisit.final_approval_date && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle size={14} />
            <span>Final Approval: {formatDate(siteVisit.final_approval_date)}</span>
          </div>
        )}
      </Card>

      {/* Approval Workflow */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>

        <div className="space-y-4">
          {approvalWorkflow.map((step) => {
            const isActive = siteVisit.current_approval_level === step.level;
            const isCompleted = step.approval && step.approval.status === "APPROVED";
            const isRejected = step.approval && step.approval.status === "REJECTED";
            const canApprove = getCurrentUserCanApprove(step);

            console.log(`🔍 Step ${step.role}:`, {
              step: step,
              canApprove: canApprove,
              approvalStatus: step.approval?.status,
              showCommentForm: showCommentForm,
              activeStepId: activeStepId,
              stepApprovalId: step.approval?.id,
              willShowButtons: canApprove && (!showCommentForm || activeStepId !== step.approval?.id)
            });

            return (
              <div
                key={step.level}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  isActive ? "border-blue-200 bg-blue-50" :
                  isCompleted ? "border-green-200 bg-green-50" :
                  isRejected ? "border-red-200 bg-red-50" :
                  "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {step.approval ?
                    getStatusIcon(step.approval.status) :
                    <Clock className="h-5 w-5 text-gray-400" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{step.role}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} />
                        {step.approval?.approver_name ? (
                          <span>{step.approval.approver_name}</span>
                        ) : step.user ? (
                          <>
                            <span>
                              {step.user.first_name || step.user.name || 'Unknown'} {step.user.last_name || ''}
                            </span>
                            {step.user.email && step.user.email !== step.approval?.approver && (
                              <span className="text-gray-400">({step.user.email})</span>
                            )}
                          </>
                        ) : (
                          <span className="text-orange-500">
                            Not assigned yet
                          </span>
                        )}
                      </div>
                    </div>

                    {step.approval && (
                      <Badge className={getStatusColor(step.approval.status)}>
                        {step.approval.status}
                      </Badge>
                    )}
                  </div>

                  {step.approval && step.approval.approval_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar size={14} />
                      <span>{formatDate(step.approval.approval_date)}</span>
                    </div>
                  )}

                  {step.approval && step.approval.comments && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <MessageSquare size={14} />
                        <span>Comments:</span>
                      </div>
                      <p className="text-sm bg-white p-2 rounded border">
                        {step.approval.comments}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons for Current User */}
                  {getCurrentUserCanApprove(step) && (!showCommentForm || activeStepId !== step.approval?.id) && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAction("approve", step.approval?.id || "")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {step.role === "Reviewer" ? "Review & Approve" :
                         step.role === "Authorizer" ? "Authorize" :
                         "Final Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction("reject", step.approval?.id || "")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Comment Form */}
      {showCommentForm && activeStepId && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {actionType === "approve" ? "Approve" : "Reject"} Site Visit
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">Comments {actionType === "reject" ? "(Required)" : "(Optional)"}</Label>
              <Textarea
                id="comments"
                placeholder={`Add your ${actionType === "approve" ? "approval" : "rejection"} comments...`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitAction}
                className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                variant={actionType === "reject" ? "destructive" : "default"}
                disabled={
                  (actionType === "reject" && !comments.trim()) ||
                  approveMutation.isPending ||
                  directApprovalMutation.isPending
                }
              >
                {approveMutation.isPending || directApprovalMutation.isPending
                  ? `${actionType === "approve" ? "Approving" : "Rejecting"}...`
                  : `Confirm ${actionType === "approve" ? "Approval" : "Rejection"}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentForm(false);
                  setComments("");
                  setActiveStepId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* EA Creation Status */}
      {siteVisit.status === SiteVisitStatus.EA_GENERATED && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-green-800">EA Automatically Created</h3>
              <p className="text-sm text-green-700 mt-1">
                An Expense Authorization (EA) has been automatically created for this approved travel request.
              </p>
              {siteVisit.ea_reference && (
                <p className="text-sm font-medium text-green-800 mt-2">
                  EA Reference: {siteVisit.ea_reference}
                </p>
              )}
              {siteVisit.ea_created_date && (
                <p className="text-xs text-green-600 mt-1">
                  Created: {formatDate(siteVisit.ea_created_date)}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SiteVisitApprovalStatus;