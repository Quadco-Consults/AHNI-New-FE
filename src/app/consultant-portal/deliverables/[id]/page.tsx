"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle,
} from "lucide-react";
import {
  useDeliverableDetail,
  useSubmitDeliverable,
} from "@/features/consultant-portal/controllers/deliverablesController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import FileUploadManager from "@/components/FileUploadManager";

export default function DeliverableDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [submissionNotes, setSubmissionNotes] = useState("");

  const { data: deliverableData, isLoading } = useDeliverableDetail(id);
  const submitMutation = useSubmitDeliverable(id);

  const deliverable = deliverableData?.data;

  const handleSubmit = async () => {
    if (!submissionNotes.trim()) {
      toast.error("Please provide submission notes");
      return;
    }

    try {
      await submitMutation.mutateAsync({
        submission_notes: submissionNotes,
        attachment: undefined, // Files are managed by FileUploadManager separately
      });
      toast.success("Deliverable submitted successfully!");
      setSubmissionNotes("");
    } catch (error) {
      toast.error("Failed to submit deliverable");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  }

  if (!deliverable) return null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {deliverable.title}
          </CardTitle>
          <CardDescription>{deliverable.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submission Notes */}
          <div>
            <Label className="text-base font-semibold">Submission Notes</Label>
            <p className="text-sm text-gray-600 mb-2">Provide details about your deliverable submission</p>
            <Textarea
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              rows={4}
              placeholder="Enter notes about this submission..."
            />
          </div>

          {/* File Attachments */}
          <div className="border-t pt-6">
            <Label className="text-base font-semibold mb-2 block">Deliverable Files</Label>
            <p className="text-sm text-gray-600 mb-4">Upload all files related to this deliverable (reports, presentations, data files, etc.)</p>

            <FileUploadManager
              contentType="contract_grants.deliverable"
              objectId={id}
              maxFiles={20}
              maxFileSize={100}
              showCategorySelect={true}
              defaultCategory="SUPPORTING_DOC"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              size="lg"
            >
              {submitMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Deliverable
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
