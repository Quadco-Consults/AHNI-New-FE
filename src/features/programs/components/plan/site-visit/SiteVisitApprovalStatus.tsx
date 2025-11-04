"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
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
  useCreateEAFromSiteVisit
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

  // API hooks
  const approveMutation = useApproveSiteVisit(siteVisit.id);
  const createEAMutation = useCreateEAFromSiteVisit(siteVisit.id);

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

  const handleAction = (type: "approve" | "reject") => {
    setActionType(type);
    setShowCommentForm(true);
  };

  const handleSubmitAction = async () => {
    try {
      if (onApprovalAction) {
        onApprovalAction(actionType, comments);
      } else {
        // Call API to approve/reject
        await approveMutation.mutateAsync({
          action: actionType,
          comments: comments,
        });

        toast.success(`Site visit ${actionType}d successfully`);

        // If this is the final approval and it's approved, automatically create EA
        if (actionType === "approve" &&
            siteVisit.current_approval_level === 3) { // Final approval level
          try {
            await createEAMutation.mutateAsync();
            toast.success("EA has been automatically created for this site visit!");
          } catch (eaError: any) {
            console.warn("EA creation failed:", eaError);
            toast.warning(
              "Site visit approved successfully, but EA creation failed. " +
              "Please create the EA manually or contact support."
            );
          }
        }
      }
      setShowCommentForm(false);
      setComments("");
    } catch (error: any) {
      console.error("Approval action failed:", error);
      toast.error(
        error.message || `Failed to ${actionType} site visit`
      );
    }
  };

  const getCurrentUserCanApprove = () => {
    // TODO: Implement logic to check if current user can approve at current level
    return false;
  };

  // Create approval workflow display
  const approvalWorkflow = [
    {
      level: 1,
      role: "Reviewer",
      user: siteVisit.reviewer,
      approval: siteVisit.approvals?.find(a => a.level === 1),
    },
    {
      level: 2,
      role: "Authorizer",
      user: siteVisit.authorizer,
      approval: siteVisit.approvals?.find(a => a.level === 2),
    },
    {
      level: 3,
      role: "Approver",
      user: siteVisit.approver,
      approval: siteVisit.approvals?.find(a => a.level === 3),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Approval Status</h3>
          <Badge className={getStatusColor(siteVisit.status)}>
            {siteVisit.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="text-sm text-gray-600">
          {siteVisit.status === SiteVisitStatus.DRAFT && (
            <p>This site visit is still in draft mode. Submit it to begin the approval process.</p>
          )}
          {siteVisit.status === SiteVisitStatus.SUBMITTED && (
            <p>Site visit has been submitted and is awaiting review.</p>
          )}
          {siteVisit.status === SiteVisitStatus.APPROVED && (
            <p>Site visit has been fully approved and is ready for execution.</p>
          )}
          {siteVisit.status === SiteVisitStatus.REJECTED && (
            <p>Site visit has been rejected. Please review the comments and resubmit if needed.</p>
          )}
          {siteVisit.status === SiteVisitStatus.EA_CREATED && (
            <p>Site visit has been approved and an EA has been automatically created.</p>
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
          {approvalWorkflow.map((step, index) => {
            const isActive = siteVisit.current_approval_level === step.level;
            const isCompleted = step.approval && step.approval.status === "APPROVED";
            const isRejected = step.approval && step.approval.status === "REJECTED";

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
                        <span>
                          {step.user.first_name} {step.user.last_name}
                        </span>
                        <span className="text-gray-400">({step.user.email})</span>
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
                  {isActive && getCurrentUserCanApprove() && !showCommentForm && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAction("approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction("reject")}
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
      {showCommentForm && (
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
                  createEAMutation.isPending
                }
              >
                {approveMutation.isPending
                  ? `${actionType === "approve" ? "Approving" : "Rejecting"}...`
                  : createEAMutation.isPending
                  ? "Creating EA..."
                  : `Confirm ${actionType === "approve" ? "Approval" : "Rejection"}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentForm(false);
                  setComments("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* EA Creation Status */}
      {siteVisit.status === SiteVisitStatus.EA_CREATED && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-green-800">EA Automatically Created</h3>
              <p className="text-sm text-green-700 mt-1">
                An Expense Authorization (EA) has been automatically created for this approved site visit.
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