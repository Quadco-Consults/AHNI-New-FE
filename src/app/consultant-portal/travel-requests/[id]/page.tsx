"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Plane,
  Loader2,
  CalendarIcon,
  MapPinIcon,
  FileTextIcon,
  UserIcon,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetConsultantTravelRequest,
  useGetConsultantTravelRequestApprovalStatus,
} from "@/features/consultant-portal/controllers/consultantTravelRequestController";
import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  SiteVisitTypeLabels,
  ApprovalStatus,
  ApprovalStatusLabels,
} from "@/features/programs/types/site-visit";
import FileUploadManager from "@/components/FileUploadManager";

export default function ConsultantTravelRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: travelRequestData,
    isLoading,
    error,
  } = useGetConsultantTravelRequest(id);

  const {
    data: approvalStatusData,
    isLoading: isLoadingApprovals,
  } = useGetConsultantTravelRequestApprovalStatus(id);

  const travelRequest = travelRequestData?.data;
  const approvals = approvalStatusData?.data?.approvals || [];

  const handleBack = () => {
    router.push("/consultant-portal/travel-requests");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case SiteVisitStatus.APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case SiteVisitStatus.SUBMITTED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case SiteVisitStatus.DRAFT:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case SiteVisitStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case SiteVisitStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case SiteVisitStatus.COMPLETED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case ApprovalStatus.PENDING:
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case ApprovalStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading travel request...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !travelRequest) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Failed to load travel request</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Travel Requests
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="h-8 w-8 text-green-600" />
              Travel Request Details
            </h1>
          </div>
          <Badge
            variant="outline"
            className={`text-sm ${getStatusBadgeColor(travelRequest.status)}`}
          >
            {SiteVisitStatusLabels[travelRequest.status as keyof typeof SiteVisitStatusLabels] || travelRequest.status}
          </Badge>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-green-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{travelRequest.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Visit Type</label>
                <p className="text-gray-900 mt-1">
                  {SiteVisitTypeLabels[travelRequest.visit_type as keyof typeof SiteVisitTypeLabels] || travelRequest.visit_type}
                </p>
              </div>
              {travelRequest.other_visit_type && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Other Visit Type</label>
                  <p className="text-gray-900 mt-1">{travelRequest.other_visit_type}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Purpose</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{travelRequest.purpose}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Dates */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-green-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">State</label>
                <p className="text-gray-900 mt-1">{travelRequest.state || "N/A"}</p>
              </div>
              {travelRequest.lga && (
                <div>
                  <label className="text-sm font-medium text-gray-600">LGA</label>
                  <p className="text-gray-900 mt-1">{travelRequest.lga}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Specific Address</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {travelRequest.specific_address || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                Travel Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <p className="text-gray-900 mt-1">
                  {travelRequest.start_date
                    ? format(new Date(travelRequest.start_date), "MMMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <p className="text-gray-900 mt-1">
                  {travelRequest.end_date
                    ? format(new Date(travelRequest.end_date), "MMMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
              {travelRequest.estimated_budget && travelRequest.estimated_budget > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Budget</label>
                  <p className="text-gray-900 mt-1">₦{travelRequest.estimated_budget.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Approval Status */}
        {approvals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-green-600" />
                Approval Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingApprovals ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">Loading approval status...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvals.map((approval: any, index: number) => (
                    <div key={approval.id || index}>
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getApprovalIcon(approval.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {approval.approval_type === "REVIEW" && "Reviewer"}
                                {approval.approval_type === "AUTHORIZATION" && "Authorizer"}
                                {approval.approval_type === "APPROVAL" && "Final Approver"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {approval.approver_name || "Pending assignment"}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                approval.status === ApprovalStatus.APPROVED
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : approval.status === ApprovalStatus.REJECTED
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }
                            >
                              {ApprovalStatusLabels[approval.status as keyof typeof ApprovalStatusLabels] || approval.status}
                            </Badge>
                          </div>
                          {approval.comments && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded border">
                              {approval.comments}
                            </p>
                          )}
                          {approval.approved_date && (
                            <p className="text-xs text-gray-500 mt-2">
                              {approval.status === ApprovalStatus.APPROVED ? "Approved" : "Actioned"} on{" "}
                              {format(new Date(approval.approved_date), "MMMM dd, yyyy 'at' HH:mm")}
                            </p>
                          )}
                        </div>
                      </div>
                      {index < approvals.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        {(travelRequest.special_requirements || travelRequest.expected_outcomes) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {travelRequest.special_requirements && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Special Requirements</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                    {travelRequest.special_requirements}
                  </p>
                </div>
              )}
              {travelRequest.expected_outcomes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Expected Outcomes</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                    {travelRequest.expected_outcomes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Travel Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-green-600" />
              Travel Documents
            </CardTitle>
            <CardDescription>
              Upload itineraries, receipts, approval documents, and other travel-related files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadManager
              contentType="programs.sitevisit"
              objectId={id}
              maxFiles={10}
              maxFileSize={50}
              allowedFileTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
              showCategorySelect={true}
              defaultCategory="ITINERARY"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
