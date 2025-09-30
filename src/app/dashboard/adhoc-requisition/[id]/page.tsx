"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  FileText,
  AlertCircle,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import {
  useGetSingleAdhocRequisition,
  useReviewRequisition,
  useAuthorizeRequisition,
  useApproveRequisition,
  useRejectRequisition,
  useDeleteAdhocRequisition,
  useConvertToAdvertisement,
} from "@/controllers/adhocRequisitionController";
import { RequisitionStatus } from "@/types/adhoc-requisition";
import { ProgramRoutes } from "@/constants/RouterConstants";
import { format } from "date-fns";
import { cn } from "lib/utils";

export default function AdhocRequisitionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [comments, setComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = useGetSingleAdhocRequisition(id);
  const { mutate: reviewRequisition, isPending: isReviewing } = useReviewRequisition(id);
  const { mutate: authorizeRequisition, isPending: isAuthorizing } = useAuthorizeRequisition(id);
  const { mutate: approveRequisition, isPending: isApproving } = useApproveRequisition(id);
  const { mutate: rejectRequisition, isPending: isRejecting } = useRejectRequisition(id);
  const { mutate: deleteRequisition } = useDeleteAdhocRequisition();
  const { mutate: convertToAd, isPending: isConverting } = useConvertToAdvertisement(id);

  const requisition = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!requisition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Requisition Not Found</h2>
        <Button onClick={() => router.push(ProgramRoutes.ADHOC_REQUISITION)} className="mt-4">
          Back to Requisitions
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: RequisitionStatus) => {
    const config = {
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800", icon: FileText },
      PENDING_APPROVAL: { label: "Pending", className: "bg-amber-100 text-amber-800", icon: Clock },
      APPROVED: { label: "Approved", className: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { label: "Rejected", className: "bg-red-100 text-red-800", icon: XCircle },
      CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-600", icon: XCircle },
      CONVERTED_TO_AD: { label: "Converted to Ad", className: "bg-blue-100 text-blue-800", icon: CheckCircle },
    };
    const { label, className, icon: Icon } = config[status];
    return (
      <Badge className={cn("flex items-center gap-1", className)}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-blue-100 text-blue-800",
      HIGH: "bg-orange-100 text-orange-800",
      URGENT: "bg-red-100 text-red-800",
    };
    return <Badge className={config[priority as keyof typeof config]}>{priority}</Badge>;
  };

  const handleApprovalAction = (action: "review" | "authorize" | "approve" | "reject") => {
    const payload = {
      action,
      comments: action === "reject" ? rejectionReason : comments,
    };

    switch (action) {
      case "review":
        reviewRequisition(payload, { onSuccess: () => setShowApprovalForm(false) });
        break;
      case "authorize":
        authorizeRequisition(payload, { onSuccess: () => setShowApprovalForm(false) });
        break;
      case "approve":
        approveRequisition(payload, { onSuccess: () => setShowApprovalForm(false) });
        break;
      case "reject":
        if (!rejectionReason.trim()) {
          alert("Please provide a reason for rejection");
          return;
        }
        rejectRequisition(payload, { onSuccess: () => setShowApprovalForm(false) });
        break;
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this requisition?")) {
      deleteRequisition(id, {
        onSuccess: () => router.push(ProgramRoutes.ADHOC_REQUISITION),
      });
    }
  };

  const handleConvertToAd = () => {
    if (confirm("Convert this requisition to a job advertisement?")) {
      convertToAd(undefined, {
        onSuccess: (response) => {
          // Redirect to the created adhoc management advertisement
          const advertisementId = response?.data?.advertisement_id;
          if (advertisementId) {
            router.push(ProgramRoutes.ADHOC_DETAILS.replace(':id', advertisementId));
          }
        }
      });
    }
  };

  // Check if current user can perform actions (mock - replace with actual user permissions)
  const canReview = requisition.status === "PENDING_APPROVAL";
  const canEdit = requisition.status === "DRAFT";
  const canDelete = requisition.status === "DRAFT";
  const canConvert = requisition.status === "APPROVED" && !requisition.converted_to_advertisement;

  // Determine the next approval action based on current state
  const getNextAction = (): "review" | "authorize" | "approve" | null => {
    if (requisition.status !== "PENDING_APPROVAL") return null;
    if (!requisition.reviewed_at) return "review";
    if (!requisition.authorized_at) return "authorize";
    if (!requisition.approved_at) return "approve";
    return null;
  };

  const nextAction = getNextAction();
  const canTakeAction = nextAction !== null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push(ProgramRoutes.ADHOC_REQUISITION)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requisitions
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{requisition.position_title}</h1>
              {getStatusBadge(requisition.status)}
              {getPriorityBadge(requisition.priority)}
            </div>
            <p className="text-gray-600 mt-1">
              Requisition #{requisition.requisition_number} • Created{" "}
              {format(new Date(requisition.created_datetime), "MMM dd, yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/adhoc-requisition/${id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {canDelete && (
              <Button variant="outline" onClick={handleDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            {canConvert && (
              <Button onClick={handleConvertToAd} disabled={isConverting}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isConverting ? "Converting..." : "Convert to Advertisement"}
              </Button>
            )}
            {requisition.converted_to_advertisement && requisition.advertisement_id && (
              <Button
                onClick={() => router.push(ProgramRoutes.ADHOC_DETAILS.replace(':id', requisition.advertisement_id!))}
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                View Advertisement
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Proposed Salary</div>
                <div className="font-semibold">
                  {requisition.currency} {Number(requisition.proposed_salary).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Positions</div>
                <div className="font-semibold">{requisition.number_of_positions}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">
                  {format(new Date(requisition.start_date), "MMM yyyy")} -{" "}
                  {format(new Date(requisition.end_date), "MMM yyyy")}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conversion Notice */}
        {requisition.converted_to_advertisement && requisition.advertisement_id && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Converted to Job Advertisement</p>
                <p className="text-sm text-blue-700">
                  This requisition has been successfully converted to a job advertisement.
                </p>
              </div>
              <Button
                onClick={() => router.push(ProgramRoutes.ADHOC_DETAILS.replace(':id', requisition.advertisement_id!))}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                View Advertisement
              </Button>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-600">Position Title</Label>
                  <p className="font-medium mt-1">{requisition.position_title}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Requesting Department</Label>
                  <p className="font-medium mt-1">{requisition.requesting_department.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Number of Positions</Label>
                  <p className="font-medium mt-1">{requisition.number_of_positions}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(requisition.priority)}</div>
                </div>
                <div>
                  <Label className="text-gray-600">Project</Label>
                  <p className="font-medium mt-1">{requisition.project.name}</p>
                  {requisition.project.code && (
                    <p className="text-sm text-gray-500">Code: {requisition.project.code}</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-600">FCO (Funding/Cost Object)</Label>
                  <p className="font-medium mt-1">{requisition.fco.name}</p>
                  {requisition.fco.code && (
                    <p className="text-sm text-gray-500">Code: {requisition.fco.code}</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-600">Budget Line</Label>
                  <p className="font-medium mt-1">{requisition.budget_line}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Work Location</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{requisition.location.name}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{requisition.job_description}</p>
            </Card>

            {/* Key Responsibilities */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Key Responsibilities</h3>
              <p className="text-gray-700 whitespace-pre-line">{requisition.key_responsibilities}</p>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Requirements & Qualifications</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Required Qualifications</Label>
                  <p className="text-gray-700 mt-1 whitespace-pre-line">{requisition.qualifications}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Required Skills</Label>
                  <p className="text-gray-700 mt-1 whitespace-pre-line">{requisition.skills_required}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Years of Experience</Label>
                    <p className="font-medium mt-1">{requisition.experience_years} years</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Education Level</Label>
                    <p className="font-medium mt-1">{requisition.education_level}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Justification */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Business Justification</h3>
              <p className="text-gray-700 whitespace-pre-line">{requisition.business_justification}</p>
              {requisition.urgency_reason && (
                <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <Label className="text-orange-800 font-semibold">Urgency Reason</Label>
                  <p className="text-orange-700 mt-1">{requisition.urgency_reason}</p>
                </div>
              )}
            </Card>

            {/* Reporting Structure */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reporting Structure</h3>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <Label className="text-gray-600">Reports To</Label>
                  <p className="font-medium">
                    {requisition.reporting_to.first_name} {requisition.reporting_to.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{requisition.reporting_to.designation}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Approval Workflow Tab */}
          <TabsContent value="approval" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Approval Workflow</h3>

              {/* Approval Steps */}
              <div className="space-y-4">
                {/* Review Step */}
                <div
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    requisition.reviewed_at
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {requisition.reviewed_at ? (
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Review</h4>
                          {requisition.reviewed_at && (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          )}
                        </div>
                        {requisition.reviewer_detail && (
                          <p className="text-sm text-gray-600 mt-1">
                            {requisition.reviewer_detail.first_name} {requisition.reviewer_detail.last_name}
                          </p>
                        )}
                        {requisition.reviewed_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed on {format(new Date(requisition.reviewed_at), "MMM dd, yyyy 'at' HH:mm")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Authorize Step */}
                <div
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    requisition.authorized_at
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {requisition.authorized_at ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Authorize</h4>
                        {requisition.authorized_at && (
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        )}
                      </div>
                      {requisition.authorizer_detail && (
                        <p className="text-sm text-gray-600 mt-1">
                          {requisition.authorizer_detail.first_name} {requisition.authorizer_detail.last_name}
                        </p>
                      )}
                      {requisition.authorized_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Authorized on {format(new Date(requisition.authorized_at), "MMM dd, yyyy 'at' HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Approve Step */}
                <div
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    requisition.approved_at
                      ? "bg-green-50 border-green-500"
                      : "bg-gray-50 border-gray-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {requisition.approved_at ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Final Approval</h4>
                        {requisition.approved_at && (
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        )}
                      </div>
                      {requisition.approver_detail && (
                        <p className="text-sm text-gray-600 mt-1">
                          {requisition.approver_detail.first_name} {requisition.approver_detail.last_name}
                        </p>
                      )}
                      {requisition.approved_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Approved on {format(new Date(requisition.approved_at), "MMM dd, yyyy 'at' HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Actions */}
              {canTakeAction && !showApprovalForm && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setShowApprovalForm(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              )}

              {/* Approval Form */}
              {showApprovalForm && nextAction && (
                <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold mb-4">
                    {nextAction === "review" && "Review Requisition"}
                    {nextAction === "authorize" && "Authorize Requisition"}
                    {nextAction === "approve" && "Final Approval"}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Comments (Optional)</Label>
                      <Textarea
                        placeholder="Add any comments..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Rejection Reason (if rejecting)</Label>
                      <Textarea
                        placeholder="Required if rejecting..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowApprovalForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleApprovalAction("reject")}
                        disabled={isRejecting}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprovalAction(nextAction)}
                        disabled={isReviewing || isAuthorizing || isApproving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {(isReviewing || isAuthorizing || isApproving) ? "Processing..." :
                          nextAction === "review" ? "Review" :
                          nextAction === "authorize" ? "Authorize" :
                          "Approve"}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Approval History</h3>
              {requisition.approval_history && requisition.approval_history.length > 0 ? (
                <div className="space-y-4">
                  {requisition.approval_history.map((history) => (
                    <div key={history.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {history.performed_by.first_name} {history.performed_by.last_name}
                          </p>
                          <Badge variant="outline">{history.action}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(history.performed_at), "MMM dd, yyyy 'at' HH:mm")}
                        </p>
                        {history.comments && (
                          <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded">
                            {history.comments}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No approval actions yet</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}