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

export default function DeliverableDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: deliverableData, isLoading } = useDeliverableDetail(id);
  const submitMutation = useSubmitDeliverable(id);

  const deliverable = deliverableData?.data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        submission_notes: submissionNotes,
        attachment: selectedFile || undefined,
      });
      toast.success("Deliverable submitted successfully!");
      setSubmissionNotes("");
      setSelectedFile(null);
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
          <CardTitle>{deliverable.title}</CardTitle>
          <CardDescription>{deliverable.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Submission Notes</Label>
            <Textarea
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label>Attach File</Label>
            <Input type="file" onChange={handleFileChange} />
          </div>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
