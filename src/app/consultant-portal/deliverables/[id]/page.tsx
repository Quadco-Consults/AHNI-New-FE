"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  CheckSquare,
  AlertTriangle,
  Upload,
  Info
} from "lucide-react";
import { useDeliverableDetail } from "@/features/consultant-portal/controllers/deliverablesController";
import { LoadingSpinner } from "@/components/Loading";

export default function DeliverableDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deliverableId = params.id as string;

  const { data: deliverableData, isLoading, error } = useDeliverableDetail(deliverableId);
  const deliverable = deliverableData?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilDueText = (dueDate: string) => {
    const days = calculateDaysUntilDue(dueDate);
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days remaining`;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-lg px-4 py-1">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500 text-lg px-4 py-1">Pending</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500 text-lg px-4 py-1">Submitted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-lg px-4 py-1">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="text-lg px-4 py-1">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading deliverable...</span>
      </div>
    );
  }

  if (error || !deliverable) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load deliverable. It may not exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const daysUntilDue = calculateDaysUntilDue(deliverable.due_date);
  const isOverdue = daysUntilDue < 0;
  const isUrgent = daysUntilDue >= 0 && daysUntilDue <= 7;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{deliverable.title}</h1>
          <p className="text-gray-600 mt-1">{deliverable.frequency} Deliverable</p>
        </div>
        {getStatusBadge(deliverable.status)}
      </div>

      {/* Due Date Alert */}
      {(isOverdue || isUrgent) && (
        <Alert variant={isOverdue ? "destructive" : "default"} className={isOverdue ? "" : "border-orange-200 bg-orange-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className={isOverdue ? "" : "text-orange-900"}>
            <div className="font-semibold">
              {isOverdue ? 'This deliverable is overdue!' : 'This deliverable is due soon!'}
            </div>
            <div className="text-sm mt-1">
              {getDaysUntilDueText(deliverable.due_date)} - Please submit as soon as possible
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Deliverable Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Deliverable Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-gray-600">Description</div>
            <div className="mt-1">{deliverable.description}</div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </div>
              <div className="font-semibold mt-1">{formatDate(deliverable.due_date)}</div>
              <div className={`text-sm mt-1 ${
                isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {getDaysUntilDueText(deliverable.due_date)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Frequency</div>
              <div className="font-semibold mt-1">{deliverable.frequency}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Format</div>
              <div className="font-semibold mt-1">{deliverable.format}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Submissions</div>
              <div className="font-semibold mt-1">{deliverable.submission_count}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {deliverable.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckSquare className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Approver Information */}
      {deliverable.approver && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Approver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-semibold mt-1">{deliverable.approver.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Role</div>
                <div className="font-semibold mt-1">{deliverable.approver.role}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Section */}
      {deliverable.status === 'pending' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Upload className="h-5 w-5" />
              Submit Deliverable
            </CardTitle>
            <CardDescription className="text-blue-700">
              Ready to submit? Upload your deliverable document below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-blue-300 bg-blue-100">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-blue-900">
                  <div className="font-semibold mb-2">Before Submitting:</div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Ensure all requirements listed above are met</li>
                    <li>Check that your document is in the correct format ({deliverable.format})</li>
                    <li>Review your work for accuracy and completeness</li>
                    <li>Once submitted, your deliverable will be sent for approval</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-white">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Submission feature will be available soon.
                </p>
                <p className="text-sm text-gray-500">
                  For now, please email your deliverable to your approver: {deliverable.approver?.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions History */}
      {deliverable.submissions && deliverable.submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliverable.submissions.map((submission, index) => (
                <div key={submission.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Submission #{index + 1}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Submitted on {formatDate(submission.submitted_date)}
                      </div>
                      {submission.comments && (
                        <div className="text-sm mt-2">
                          <span className="font-medium">Comments:</span> {submission.comments}
                        </div>
                      )}
                      {submission.reviewer_comments && (
                        <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
                          <span className="font-medium">Reviewer Feedback:</span> {submission.reviewer_comments}
                        </div>
                      )}
                    </div>
                    <div>
                      {getStatusBadge(submission.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-2">Need Help?</div>
          <p className="text-sm">
            If you have questions about this deliverable or need clarification on the requirements,
            please contact your approver: <span className="font-semibold">{deliverable.approver?.name}</span> ({deliverable.approver?.role})
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
