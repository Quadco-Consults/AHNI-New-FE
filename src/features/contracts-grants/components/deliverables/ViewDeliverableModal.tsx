"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetSingleDeliverable } from "../../controllers/deliverableController";
import { Loader2, Calendar, User, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewDeliverableModalProps {
  deliverableId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDeliverableModal({
  deliverableId,
  open,
  onClose,
}: ViewDeliverableModalProps) {
  const { data, isLoading } = useGetSingleDeliverable(deliverableId || "", open && !!deliverableId);

  const deliverable = data?.data;

  if (!deliverableId) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deliverable Details</DialogTitle>
          <DialogDescription>
            View deliverable information and submission history
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : deliverable ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{deliverable.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {deliverable.description}
                </p>
              </div>
              <Badge
                variant="default"
                className={cn(
                  "px-3 py-1",
                  deliverable.status === "pending" && "bg-orange-200 text-orange-700",
                  deliverable.status === "completed" && "bg-green-200 text-green-700"
                )}
              >
                <div className="flex items-center gap-1">
                  {deliverable.status === "pending" ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span className="capitalize">{deliverable.status}</span>
                </div>
              </Badge>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Staff Type</span>
                </div>
                <p className="font-medium">{deliverable.staff_type_display}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Assigned To</span>
                </div>
                <p className="font-medium">{deliverable.assigned_to_name}</p>
                <p className="text-sm text-muted-foreground">{deliverable.assigned_to_email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline</span>
                </div>
                <p className="font-medium">
                  {new Date(deliverable.deadline).toLocaleDateString()}
                </p>
                {deliverable.days_until_due !== null && (
                  <p
                    className={cn(
                      "text-sm",
                      deliverable.is_overdue
                        ? "text-red-600"
                        : deliverable.days_until_due <= 7
                        ? "text-orange-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {deliverable.is_overdue
                      ? `${Math.abs(deliverable.days_until_due)} days overdue`
                      : deliverable.days_until_due === 0
                      ? "Due today"
                      : `${deliverable.days_until_due} days left`}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Submissions</span>
                </div>
                <p className="font-medium">{deliverable.submission_count} submission(s)</p>
              </div>
            </div>

            {/* Overdue Alert */}
            {deliverable.is_overdue && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">This deliverable is overdue</p>
                  <p className="text-sm text-red-700">
                    The deadline was {Math.abs(deliverable.days_until_due)} days ago
                  </p>
                </div>
              </div>
            )}

            {/* Additional Comments */}
            {deliverable.comments && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Comments
                </h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  {deliverable.comments}
                </p>
              </div>
            )}

            {/* Submissions Section */}
            {deliverable.submissions && deliverable.submissions.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium">Submission History</h4>
                <div className="space-y-2">
                  {deliverable.submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              submission.review_status === "pending_review" &&
                                "bg-blue-100 text-blue-700",
                              submission.review_status === "approved" &&
                                "bg-green-100 text-green-700",
                              submission.review_status === "changes_requested" &&
                                "bg-orange-100 text-orange-700"
                            )}
                          >
                            {submission.review_status === "pending_review"
                              ? "Awaiting Review"
                              : submission.review_status === "approved"
                              ? "Approved"
                              : "Changes Requested"}
                          </Badge>
                        </div>
                        {submission.attachment && (
                          <Badge variant="outline" className="text-xs">
                            Has Attachment
                          </Badge>
                        )}
                      </div>
                      {submission.submission_notes && (
                        <p className="text-sm text-muted-foreground">
                          {submission.submission_notes}
                        </p>
                      )}
                      {submission.review_feedback && (
                        <div className="mt-2 p-2 bg-muted/50 rounded">
                          <p className="text-xs font-medium">Review Feedback:</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.review_feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
              <p>Created: {new Date(deliverable.created_datetime).toLocaleString()}</p>
              <p>Last updated: {new Date(deliverable.updated_datetime).toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Deliverable not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
