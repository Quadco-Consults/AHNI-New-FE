"use client";

import { useState } from "react";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";

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
  const [isLoading, setIsLoading] = useState(false);

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
    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  const executeAction = async () => {
    if (!comment.trim() && selectedAction === "reject") {
      toast.error("Comment is required when rejecting a request");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      
      let endpoint = '';
      switch (selectedAction) {
        case 'submit':
          endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/submit/`;
          break;
        case 'start_review':
        case 'review':
          endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/review/`;
          break;
        case 'complete_review':
          endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/complete_review/`;
          break;
        case 'authorize':
          endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/authorize/`;
          break;
        case 'approve':
          endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/approve/`;
          break;
        case 'reject':
          endpoint = `${baseUrl}/contract-grants/contract-requests/${contractRequest.id}/reject/`;
          break;
        default:
          throw new Error(`Unknown action: ${selectedAction}`);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          comment: comment.trim() || undefined
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Action failed';
        
        // Check if response contains JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || 'Action failed';
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
          console.warn('Failed to parse response JSON, but action may have succeeded');
        }
      }
      
      toast.success(`Request ${selectedAction.replace('_', ' ')} completed successfully`);
      
      onStatusUpdate();
      setIsDialogOpen(false);
      setComment("");
      
    } catch (error: any) {
      console.error('Workflow action failed:', error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
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
          >
            Reject
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === "reject" ? "Reject Request" : `${selectedAction.replace("_", " ").toUpperCase()} Request`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">
                Comment {selectedAction === "reject" ? "(Required)" : "(Optional)"}
              </Label>
              <Textarea
                id="comment"
                placeholder={`Provide a comment for this ${selectedAction}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={executeAction}
                disabled={isLoading}
                variant={selectedAction === "reject" ? "destructive" : "default"}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}