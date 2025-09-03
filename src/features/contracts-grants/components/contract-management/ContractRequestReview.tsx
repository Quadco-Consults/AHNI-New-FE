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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";

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
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [reviewChecklist, setReviewChecklist] = useState({
    budgetReviewed: false,
    scopeClarity: false,
    timelineRealistic: false,
    resourcesAvailable: false,
    complianceCheck: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Review criteria checklist
  const reviewCriteria = [
    { key: "budgetReviewed", label: "Budget allocation reviewed and approved" },
    { key: "scopeClarity", label: "Scope of work is clearly defined" },
    { key: "timelineRealistic", label: "Timeline is realistic and achievable" },
    { key: "resourcesAvailable", label: "Required resources are available" },
    { key: "complianceCheck", label: "Compliance and regulatory requirements met" },
  ];

  const canReview = contractRequest.status === "SUBMITTED" &&
    contractRequest.current_reviewer === currentUser?.id;

  const canAuthorize = contractRequest.status === "REVIEWED" &&
    contractRequest.authorizer === currentUser?.id;

  const canApprove = contractRequest.status === "AUTHORIZED" &&
    contractRequest.approver === currentUser?.id;

  const handleReviewSubmit = async () => {
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

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      
      // Determine the endpoint based on review decision
      let endpoint = '';
      if (reviewDecision === "approve") {
        endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/complete_review/`;
      } else if (reviewDecision === "reject") {
        endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/reject/`;
      } else {
        // For "request_changes" - this might need a specific endpoint or use reject with a flag
        endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/reject/`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          comment: reviewComments.trim(),
          checklist: reviewChecklist,
          decision: reviewDecision,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Review submission failed';
        
        // Check if response contains JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || 'Review submission failed';
          } catch {
            errorMessage = 'Failed to parse error response';
          }
        } else {
          // Handle non-JSON responses (like 404 HTML pages)
          if (response.status === 404) {
            errorMessage = 'API endpoint not found. The backend may not be fully implemented yet.';
          } else if (response.status === 403) {
            errorMessage = 'You are not authorized to perform this action.';
          } else {
            errorMessage = `Request failed with status ${response.status}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse response JSON safely
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          await response.json();
        } catch {
          console.warn('Failed to parse response JSON, but review may have succeeded');
        }
      }
      
      toast.success(`Review ${reviewDecision === "approve" ? "completed" : reviewDecision === "reject" ? "rejected" : "returned for changes"} successfully`);
      
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
      console.error("Review submission failed:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkflowAction = async (action: string, decision: string) => {
    const actionData = {
      contractRequestId: contractRequest.id,
      userId: currentUser.id,
      action,
      decision,
      timestamp: new Date().toISOString(),
    };

    console.log("Workflow Action:", actionData);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Request ${action} successfully`);
    onWorkflowUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Contract Request Details */}
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
                {contractRequest.current_reviewer_detail?.first_name} {contractRequest.current_reviewer_detail?.last_name}
              </div>
              <div>
                <strong>Authorizer:</strong><br />
                {contractRequest.authorizer_detail ? 
                  `${contractRequest.authorizer_detail.first_name} ${contractRequest.authorizer_detail.last_name}` : 
                  "Not assigned"}
              </div>
              <div>
                <strong>Approver:</strong><br />
                {contractRequest.approver_detail ? 
                  `${contractRequest.approver_detail.first_name} ${contractRequest.approver_detail.last_name}` : 
                  "Not assigned"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Actions */}
      {canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Review Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You are assigned to review this contract request. Please evaluate all criteria before making a decision.</p>
            <Button onClick={() => setIsReviewDialogOpen(true)}>
              Start Review Process
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Authorization Actions */}
      {canAuthorize && (
        <Card>
          <CardHeader>
            <CardTitle>Authorization Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This request has been reviewed and requires your authorization.</p>
            <div className="flex gap-2">
              <Button onClick={() => handleWorkflowAction("authorize", "approve")}>
                Authorize Request
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleWorkflowAction("authorize", "reject")}
              >
                Reject Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Actions */}
      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Final Approval Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This request has been authorized and requires final approval.</p>
            <div className="flex gap-2">
              <Button onClick={() => handleWorkflowAction("approve", "approve")}>
                Give Final Approval
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleWorkflowAction("approve", "reject")}
              >
                Reject Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Request Review</DialogTitle>
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
                      className="text-sm font-normal leading-tight"
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
              <Label className="text-base font-semibold">Review Decision</Label>
              <RadioGroup value={reviewDecision} onValueChange={setReviewDecision} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="text-green-700">
                    ✓ Approve and forward to next stage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request_changes" id="request_changes" />
                  <Label htmlFor="request_changes" className="text-yellow-700">
                    ↻ Request changes and return to submitter
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="text-red-700">
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
                onClick={handleReviewSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Submitting Review..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}