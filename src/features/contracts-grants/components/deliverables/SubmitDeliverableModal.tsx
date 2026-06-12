"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormButton from "@/components/FormButton";
import FormTextArea from "@/components/FormTextArea";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSubmitDeliverable } from "../../controllers/deliverableController";
import { useState, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import { IDeliverable } from "../../types/contract-management/deliverable";

const SubmissionSchema = z.object({
  submission_notes: z.string().optional(),
});

type TSubmissionFormData = z.infer<typeof SubmissionSchema>;

interface SubmitDeliverableModalProps {
  deliverable: IDeliverable | null;
  open: boolean;
  onClose: () => void;
}

export default function SubmitDeliverableModal({
  deliverable,
  open,
  onClose,
}: SubmitDeliverableModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<TSubmissionFormData>({
    resolver: zodResolver(SubmissionSchema),
    defaultValues: {
      submission_notes: "",
    },
  });

  const { submitDeliverable, isLoading } = useSubmitDeliverable(
    deliverable?.id || ""
  );

  const onSubmit: SubmitHandler<TSubmissionFormData> = async (data) => {
    if (!deliverable) return;

    try {
      const formData = new FormData();
      formData.append("submission_notes", data.submission_notes || "");
      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      await submitDeliverable(formData);
      toast.success("Deliverable submitted successfully");
      form.reset();
      setSelectedFile(null);
      onClose();
    } catch (error) {
      toast.error("Failed to submit deliverable");
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedFile(null);
    }
  }, [open, form]);

  if (!deliverable) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Deliverable</DialogTitle>
          <DialogDescription>
            Submit your work for review by your supervisor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deliverable Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-semibold">{deliverable.title}</h4>
            <p className="text-sm text-muted-foreground">
              {deliverable.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Deadline: </span>
                <span className="font-medium">
                  {new Date(deliverable.deadline).toLocaleDateString()}
                </span>
              </div>
              {deliverable.days_until_due !== null && (
                <div>
                  <span
                    className={
                      deliverable.is_overdue
                        ? "text-red-600"
                        : deliverable.days_until_due <= 7
                        ? "text-orange-600"
                        : "text-muted-foreground"
                    }
                  >
                    {deliverable.is_overdue
                      ? `${Math.abs(deliverable.days_until_due)} days overdue`
                      : deliverable.days_until_due === 0
                      ? "Due today"
                      : `${deliverable.days_until_due} days left`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Submission Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Attach File (Optional)
                </label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG
                          (Max 10MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-accent/50">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-destructive/10 rounded"
                    >
                      <X className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload your completed work, report, or supporting documents
                </p>
              </div>

              {/* Submission Notes */}
              <FormTextArea
                form={form}
                name="submission_notes"
                label="Submission Notes (Optional)"
                placeholder="Add any notes or comments about your submission..."
                rows={4}
              />

              {/* Submission History */}
              {deliverable.submission_count > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> You have previously submitted this
                    deliverable {deliverable.submission_count} time(s).
                    {deliverable.latest_submission?.review_status ===
                      "changes_requested" &&
                      " Your supervisor requested changes. This will be a resubmission."}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <FormButton
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </FormButton>
                <FormButton type="submit" loading={isLoading}>
                  Submit Deliverable
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
