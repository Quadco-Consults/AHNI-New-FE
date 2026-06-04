"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormButton from "@/components/FormButton";
import FormTextArea from "@/components/FormTextArea";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetAllSubmissions,
  useReviewSubmission,
} from "../../controllers/deliverableController";
import { useState, useEffect } from "react";
import { CheckCircle, X, Download, FileText } from "lucide-react";

const ReviewSchema = z.object({
  feedback: z.string().optional(),
});

type TReviewFormData = z.infer<typeof ReviewSchema>;

interface ReviewSubmissionModalProps {
  submissionId: string;
  open: boolean;
  onClose: () => void;
}

export default function ReviewSubmissionModal({
  submissionId,
  open,
  onClose,
}: ReviewSubmissionModalProps) {
  const [actionType, setActionType] = useState<"approve" | "request_changes" | null>(null);

  const form = useForm<TReviewFormData>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      feedback: "",
    },
  });

  // Fetch submission details
  const { data: submissionsData } = useGetAllSubmissions({
    page: 1,
    size: 100,
    enabled: open,
  });

  const submission = submissionsData?.data?.find(
    (sub) => sub.id === submissionId
  );

  const { reviewSubmission, isLoading } = useReviewSubmission(submissionId);

  const handleApprove = async () => {
    setActionType("approve");
    try {
      await reviewSubmission({
        action: "approve",
        feedback: form.getValues("feedback"),
      });
      toast.success("Deliverable approved successfully");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to approve deliverable");
      console.error(error);
    } finally {
      setActionType(null);
    }
  };

  const handleRequestChanges: SubmitHandler<TReviewFormData> = async (data) => {
    if (!data.feedback) {
      toast.error("Feedback is required when requesting changes");
      return;
    }

    setActionType("request_changes");
    try {
      await reviewSubmission({
        action: "request_changes",
        feedback: data.feedback,
      });
      toast.success("Changes requested successfully");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Failed to request changes");
      console.error(error);
    } finally {
      setActionType(null);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setActionType(null);
    }
  }, [open, form]);

  if (!submission) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Deliverable Submission</DialogTitle>
          <DialogDescription>
            Review the submission and provide feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Submission Details */}
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <h4 className="font-semibold text-lg">
                {submission.deliverable_data?.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {submission.deliverable_data?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Submitted by:</span>
                <p className="font-medium">{submission.submitted_by_name}</p>
                <p className="text-muted-foreground text-xs">
                  {submission.submitted_by_email}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted on:</span>
                <p className="font-medium">
                  {new Date(submission.submitted_at).toLocaleString()}
                </p>
              </div>
            </div>

            {submission.submission_notes && (
              <div>
                <span className="text-sm text-muted-foreground">
                  Submission Notes:
                </span>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {submission.submission_notes}
                </p>
              </div>
            )}

            {submission.attachment_url && (
              <div className="flex items-center gap-3 p-3 border rounded-md bg-accent/50">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {submission.attachment_name || "Attachment"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Attached file
                  </p>
                </div>
                <a
                  href={submission.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <FormButton variant="outline" size="sm" type="button">
                    <Download className="h-4 w-4" />
                    Download
                  </FormButton>
                </a>
              </div>
            )}

            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <div className="mt-1">
                <Badge
                  className={
                    submission.review_status === "pending_review"
                      ? "bg-blue-100 text-blue-700"
                      : submission.review_status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }
                >
                  {submission.review_status === "pending_review"
                    ? "Pending Review"
                    : submission.review_status === "approved"
                    ? "Approved"
                    : "Changes Requested"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {submission.review_status === "pending_review" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRequestChanges)}
                className="space-y-4"
              >
                <FormTextArea
                  form={form}
                  name="feedback"
                  label="Feedback (Optional for approval, required for changes)"
                  placeholder="Provide feedback on the submission..."
                  rows={4}
                />

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <FormButton
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </FormButton>
                  <FormButton
                    type="submit"
                    variant="outline"
                    isLoading={isLoading && actionType === "request_changes"}
                    disabled={isLoading}
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <X className="h-4 w-4" />
                    Request Changes
                  </FormButton>
                  <FormButton
                    type="button"
                    isLoading={isLoading && actionType === "approve"}
                    disabled={isLoading}
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </FormButton>
                </div>
              </form>
            </Form>
          )}

          {/* Previous Review Details */}
          {submission.reviewed_by_name && (
            <div className="border-t pt-4">
              <h5 className="font-semibold mb-2">Review Details</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Reviewed by:</span>
                  <p className="font-medium">{submission.reviewed_by_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reviewed on:</span>
                  <p className="font-medium">
                    {submission.reviewed_at &&
                      new Date(submission.reviewed_at).toLocaleString()}
                  </p>
                </div>
                {submission.review_feedback && (
                  <div>
                    <span className="text-muted-foreground">Feedback:</span>
                    <p className="mt-1 p-3 bg-muted rounded-md">
                      {submission.review_feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
