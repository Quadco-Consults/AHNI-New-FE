"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Checkbox } from "components/ui/checkbox";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "components/ui/dialog";

// Import all approval workflow hooks
import {
  useReviewContractRequest,
  useCompleteReviewContractRequest,
  useAuthorizeContractRequest,
  useApproveContractRequest,
  useRejectContractRequest,
} from "@/features/contracts-grants/controllers/contractController";

interface ContractRequestReviewProps {
  contractRequest: any;
  currentUser: any;
  onWorkflowUpdate: () => void;
}

export default function ContractRequestReview({
  contractRequest,
  currentUser,
  onWorkflowUpdate,
}: ContractRequestReviewProps) {
  // Dialog states
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isAuthorizeDialogOpen, setIsAuthorizeDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  // Form states
  const [reviewDecision, setReviewDecision] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [authorizeComments, setAuthorizeComments] = useState("");
  const [approveComments, setApproveComments] = useState("");
  const [rejectComments, setRejectComments] = useState("");

  const [reviewChecklist, setReviewChecklist] = useState({
    budgetReviewed: false,
    scopeClarity: false,
    timelineRealistic: false,
    resourcesAvailable: false,
    complianceCheck: false,
  });

  // Initialize all approval workflow hooks
  const { reviewContractRequest, isLoading: isStartingReview } = useReviewContractRequest(contractRequest.id);
  const { completeReviewContractRequest, isLoading: isCompletingReview } = useCompleteReviewContractRequest(contractRequest.id);
  const { authorizeContractRequest, isLoading: isAuthorizing } = useAuthorizeContractRequest(contractRequest.id);
  const { approveContractRequest, isLoading: isApproving } = useApproveContractRequest(contractRequest.id);
  const { rejectContractRequest, isLoading: isRejecting } = useRejectContractRequest(contractRequest.id);

  const isLoading = isStartingReview || isCompletingReview || isAuthorizing || isApproving || isRejecting;

  // Review criteria checklist
  const reviewCriteria = [
    { key: "budgetReviewed", label: "Budget allocation reviewed and approved" },
    { key: "scopeClarity", label: "Scope of work is clearly defined" },
    { key: "timelineRealistic", label: "Timeline is realistic and achievable" },
    { key: "resourcesAvailable", label: "Required resources are available" },
    { key: "complianceCheck", label: "Compliance and regulatory requirements met" },
  ];

  // Permission checks
  const canStartReview = contractRequest.status === "SUBMITTED" &&
    (!contractRequest.current_reviewer || contractRequest.current_reviewer?.id === currentUser?.id);

  const canCompleteReview = contractRequest.status === "UNDER_REVIEW" &&
    (contractRequest.current_reviewer?.id === currentUser?.id || contractRequest.reviewer === currentUser?.id);

  const canAuthorize = contractRequest.status === "REVIEWED" &&
    (contractRequest.authorizer_detail?.id === currentUser?.id || contractRequest.authorizer === currentUser?.id);

  const canApprove = contractRequest.status === "AUTHORIZED" &&
    (contractRequest.approver_detail?.id === currentUser?.id || contractRequest.approver === currentUser?.id);

  const canReject = ["SUBMITTED", "UNDER_REVIEW", "REVIEWED", "AUTHORIZED"].includes(contractRequest.status);

  // Handler for starting review (SUBMITTED → UNDER_REVIEW)
  const handleStartReview = async () => {
    try {
      await reviewContractRequest();
      toast.success("Review started successfully");
      onWorkflowUpdate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to start review");
    }
  };

  // Handler for completing review (UNDER_REVIEW → REVIEWED)
  const handleCompleteReview = async () => {
    if (!reviewDecision) {
      toast.error("Please select a review decision");
      return;
    }

    if (!reviewComments.trim()) {
      toast.error("Please provide review comments");
      return;
    }

    // Check if all required criteria are met for approval
    const criteriaMet = Object.values(reviewChecklist).every(Boolean);
    if (reviewDecision === "approve" && !criteriaMet) {
      toast.error("All review criteria must be satisfied before approval");
      return;
    }

    try {
      if (reviewDecision === "approve") {
        await completeReviewContractRequest(reviewComments.trim());
        toast.success("Review completed successfully");
      } else {
        await rejectContractRequest(reviewComments.trim());
        toast.success(reviewDecision === "reject" ? "Request rejected" : "Returned for changes");
      }

      setIsReviewDialogOpen(false);
      setReviewComments("");
      setReviewDecision("");
      setReviewChecklist({
        budgetReviewed: false,
        scopeClarity: false,
        timelineRealistic: false,
        resourcesAvailable: false,
        complianceCheck: false,
      });
      onWorkflowUpdate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit review");
    }
  };

  // Handler for authorization (REVIEWED → AUTHORIZED)
  const handleAuthorize = async () => {
    try {
      await authorizeContractRequest(authorizeComments.trim() || undefined);
      toast.success("Request authorized successfully");
      setIsAuthorizeDialogOpen(false);
      setAuthorizeComments("");
      onWorkflowUpdate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to authorize request");
    }
  };

  // Handler for approval (AUTHORIZED → APPROVED)
  const handleApprove = async () => {
    try {
      await approveContractRequest(approveComments.trim() || undefined);
      toast.success("Request approved successfully");
      setIsApproveDialogOpen(false);
      setApproveComments("");
      onWorkflowUpdate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve request");
    }
  };

  // Handler for rejection (ANY → REJECTED)
  const handleReject = async () => {
    if (!rejectComments.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectContractRequest(rejectComments.trim());
      toast.success("Request rejected");
      setIsRejectDialogOpen(false);
      setRejectComments("");
      onWorkflowUpdate();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject request");
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Request Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{contractRequest.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Request ID: {contractRequest.id}
              </p>
            </div>
            <Badge className="ml-4">
              {contractRequest.status_display || contractRequest.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Type:</strong> {contractRequest.request_type}
            </div>
            <div>
              <strong>Department:</strong> {contractRequest.department?.name}
            </div>
            <div>
              <strong>Location:</strong> {contractRequest.location_detail?.name}
            </div>
            <div>
              <strong>Consultants:</strong> {contractRequest.consultants_count}
            </div>
          </div>

          <Separator />

          {/* Workflow Assignments */}
          <div className="space-y-2">
            <h3 className="font-semibold">Workflow Assignments</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Reviewer:</strong><br />
                {contractRequest.current_reviewer ?
                  (contractRequest.current_reviewer.full_name ||
                   [contractRequest.current_reviewer.first_name, contractRequest.current_reviewer.last_name]
                     .filter(name => name && name.trim())
                     .join(" ") || contractRequest.current_reviewer.email || "Reviewer") :
                  "Not assigned"}
              </div>
              <div>
                <strong>Authorizer:</strong><br />
                {contractRequest.authorizer_detail ?
                  (contractRequest.authorizer_detail.full_name ||
                   [contractRequest.authorizer_detail.first_name, contractRequest.authorizer_detail.last_name]
                     .filter(name => name && name.trim())
                     .join(" ") || contractRequest.authorizer_detail.email || "Authorizer") :
                  "Not assigned"}
              </div>
              <div>
                <strong>Approver:</strong><br />
                {contractRequest.approver_detail ?
                  (contractRequest.approver_detail.full_name ||
                   [contractRequest.approver_detail.first_name, contractRequest.approver_detail.last_name]
                     .filter(name => name && name.trim())
                     .join(" ") || contractRequest.approver_detail.email || "Approver") :
                  "Not assigned"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Review Action (SUBMITTED → UNDER_REVIEW) */}
      {canStartReview && (
        <Card>
          <CardHeader>
            <CardTitle>Start Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This contract request is ready for review. Click the button below to start the review process.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleStartReview} disabled={isLoading}>
                {isStartingReview ? "Starting Review..." : "Start Review Process"}
              </Button>
              {canReject && (
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isLoading}
                >
                  Reject Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Review Action (UNDER_REVIEW → REVIEWED) */}
      {canCompleteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              You are assigned to review this contract request. Please evaluate all criteria before making a decision.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setIsReviewDialogOpen(true)} disabled={isLoading}>
                Complete Review Process
              </Button>
              {canReject && (
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isLoading}
                >
                  Reject Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authorization Action (REVIEWED → AUTHORIZED) */}
      {canAuthorize && (
        <Card>
          <CardHeader>
            <CardTitle>Authorization Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This request has been reviewed and requires your authorization to proceed.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setIsAuthorizeDialogOpen(true)} disabled={isLoading}>
                Authorize Request
              </Button>
              {canReject && (
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isLoading}
                >
                  Reject Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Approval Action (AUTHORIZED → APPROVED) */}
      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Final Approval Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This request has been authorized and requires final approval.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setIsApproveDialogOpen(true)} disabled={isLoading}>
                Give Final Approval
              </Button>
              {canReject && (
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isLoading}
                >
                  Reject Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Actions Available */}
      {!canStartReview && !canCompleteReview && !canAuthorize && !canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              No workflow actions are available for you at this stage. The request is currently at the{" "}
              <strong>{contractRequest.status_display || contractRequest.status}</strong> stage.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog (Complete Review) */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Contract Request Review</DialogTitle>
            <DialogDescription>
              Evaluate the request against all criteria and provide your decision
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Review Checklist */}
            <div>
              <Label className="text-base font-semibold">Review Criteria</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Please verify each criterion before making your decision.
              </p>
              <div className="space-y-3">
                {reviewCriteria.map((criterion) => (
                  <div key={criterion.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={criterion.key}
                      checked={reviewChecklist[criterion.key as keyof typeof reviewChecklist]}
                      onCheckedChange={(checked) =>
                        setReviewChecklist(prev => ({
                          ...prev,
                          [criterion.key]: checked as boolean
                        }))
                      }
                    />
                    <Label
                      htmlFor={criterion.key}
                      className="text-sm font-normal leading-tight cursor-pointer"
                    >
                      {criterion.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Review Decision */}
            <div>
              <Label className="text-base font-semibold">Review Decision *</Label>
              <RadioGroup value={reviewDecision} onValueChange={setReviewDecision} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="text-green-700 cursor-pointer">
                    ✓ Approve and forward to authorization
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request_changes" id="request_changes" />
                  <Label htmlFor="request_changes" className="text-yellow-700 cursor-pointer">
                    ↻ Request changes and return to submitter
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="text-red-700 cursor-pointer">
                    ✗ Reject request
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Review Comments */}
            <div>
              <Label htmlFor="review-comments" className="text-base font-semibold">
                Review Comments *
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Provide detailed feedback and any specific recommendations.
              </p>
              <Textarea
                id="review-comments"
                placeholder="Enter your review comments, feedback, and recommendations..."
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCompleteReview}
                disabled={isLoading}
              >
                {isCompletingReview ? "Submitting Review..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Authorize Dialog */}
      <Dialog open={isAuthorizeDialogOpen} onOpenChange={setIsAuthorizeDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Authorize Contract Request</DialogTitle>
            <DialogDescription>
              Confirm that you want to authorize this contract request to proceed to final approval.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="authorize-comments">
                Comments (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add any comments or notes about your authorization decision.
              </p>
              <Textarea
                id="authorize-comments"
                placeholder="Add comments (optional)..."
                value={authorizeComments}
                onChange={(e) => setAuthorizeComments(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAuthorizeDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAuthorize}
                disabled={isLoading}
              >
                {isAuthorizing ? "Authorizing..." : "Authorize Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Final Approval</DialogTitle>
            <DialogDescription>
              Confirm that you want to give final approval to this contract request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-comments">
                Comments (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add any comments or notes about your approval decision.
              </p>
              <Textarea
                id="approve-comments"
                placeholder="Add comments (optional)..."
                value={approveComments}
                onChange={(e) => setApproveComments(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsApproveDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isApproving ? "Approving..." : "Give Final Approval"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Contract Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this contract request. This comment will be visible in the approval history.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-comments">
                Rejection Reason *
              </Label>
              <Textarea
                id="reject-comments"
                placeholder="Explain why you are rejecting this request..."
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectComments("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={isLoading || !rejectComments.trim()}
                variant="destructive"
              >
                {isRejecting ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
