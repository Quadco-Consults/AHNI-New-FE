"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  useGetSingleAssetMaintenanceQuery,
  useReviewAssetMaintenance,
  useAuthorizeAssetMaintenance,
  useApproveAssetMaintenance,
} from "@/features/admin/controllers/assetMaintenanceController";
import { LoadingSpinner } from "components/Loading";
import { Textarea } from "components/ui/textarea";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  MapPinIcon,
  WrenchIcon,
  DollarSignIcon,
  FileTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FileDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssetMaintenanceDetailsPage() {
  const { id } = useParams() as { id: string };

  const [comments, setComments] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<
    "review" | "authorize" | "approve" | null
  >(null);

  const {
    data: assetMaintenance,
    isLoading,
    refetch,
  } = useGetSingleAssetMaintenanceQuery(id as string, !!id);

  const {
    reviewAssetMaintenance,
    isLoading: isReviewing,
    isSuccess: reviewSuccess,
  } = useReviewAssetMaintenance(id as string);

  const {
    authorizeAssetMaintenance,
    isLoading: isAuthorizing,
    isSuccess: authorizeSuccess,
  } = useAuthorizeAssetMaintenance(id as string);

  const {
    approveAssetMaintenance,
    isLoading: isApproving,
    isSuccess: approveSuccess,
  } = useApproveAssetMaintenance(id as string);

  const currentStatus = assetMaintenance?.data?.status;

  const handleApproval = async () => {
    if (!comments.trim()) {
      toast.error("Please enter approval comments");
      return;
    }

    try {
      const payload = { comments: comments.trim() };

      switch (approvalAction) {
        case "review":
          await reviewAssetMaintenance(payload);
          break;
        case "authorize":
          await authorizeAssetMaintenance(payload);
          break;
        case "approve":
          await approveAssetMaintenance(payload);
          break;
      }
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to process approval. Please try again.");
    }
  };

  const openApprovalForm = (action: "review" | "authorize" | "approve") => {
    setApprovalAction(action);
    setShowApprovalForm(true);
    setComments("");
  };

  const closeApprovalForm = () => {
    setShowApprovalForm(false);
    setApprovalAction(null);
    setComments("");
  };

  // Handle success for all approval actions
  useEffect(() => {
    if (reviewSuccess || authorizeSuccess || approveSuccess) {
      closeApprovalForm();
      refetch(); // Refresh data to show updated status
    }
  }, [reviewSuccess, authorizeSuccess, approveSuccess, refetch]);

  // Get status badge with icon
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      Pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: ClockIcon },
      Reviewed: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircleIcon },
      Authorized: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: CheckCircleIcon },
      Approved: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircleIcon },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: ClockIcon };
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    if (!amount) return "₦0.00";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  };

  const getNextAction = () => {
    switch (currentStatus) {
      case "Pending":
        return {
          action: "review",
          label: "Review",
          color: "bg-blue-500 hover:bg-blue-600",
        };
      case "Reviewed":
        return {
          action: "authorize",
          label: "Authorize",
          color: "bg-purple-500 hover:bg-purple-600",
        };
      case "Authorized":
        return {
          action: "approve",
          label: "Approve",
          color: "bg-green-500 hover:bg-green-600",
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className='space-y-6'>
      <BackNavigation extraText='View Asset Maintenance Ticket' />

      {isLoading ? (
        <Card>
          <CardContent className="py-20">
            <LoadingSpinner />
          </CardContent>
        </Card>
      ) : (
        assetMaintenance && (
          <>
            {/* Header Card with Summary */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Asset Maintenance Ticket
                      </h1>
                      {getStatusBadge(currentStatus || "")}
                    </div>
                    <p className="text-sm text-gray-600">
                      Ticket ID: <span className="font-mono font-medium">{assetMaintenance.data.id?.substring(0, 8).toUpperCase()}</span>
                    </p>
                  </div>
                  <div className="text-right space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(assetMaintenance.data.total_cost_estimate)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Total Cost Estimate</p>
                    </div>
                    {/* Generate Maintenance Ticket Button - Only show when APPROVED */}
                    {currentStatus === "Approved" && (
                      <Link href={`/dashboard/admin/asset-maintenance/${id}/maintenance-ticket`}>
                        <Button className="bg-orange-600 hover:bg-orange-700 w-full">
                          <FileDownIcon className="w-4 h-4 mr-2" />
                          Generate Maintenance Ticket
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created Date</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(assetMaintenance.data.created_datetime), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Staff Name</p>
                      <p className="font-medium text-gray-900">
                        {assetMaintenance.data.staff_name ||
                         (assetMaintenance.data.created_by as any)?.full_name ||
                         ((assetMaintenance.data.created_by as any)?.first_name && (assetMaintenance.data.created_by as any)?.last_name
                           ? `${(assetMaintenance.data.created_by as any).first_name} ${(assetMaintenance.data.created_by as any).last_name}`
                           : "N/A")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BuildingIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">
                        {assetMaintenance.data.department?.name ||
                         (assetMaintenance.data.created_by as any)?.department?.name ||
                         (assetMaintenance.data.created_by as any)?.department ||
                         "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MapPinIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">
                        {assetMaintenance.data.location?.name ||
                         (assetMaintenance.data.created_by as any)?.location?.name ||
                         (assetMaintenance.data.created_by as any)?.location ||
                         "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset & Maintenance Details */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  Maintenance Details
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <WrenchIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Asset Name</p>
                      <p className="font-medium text-gray-900">{assetMaintenance.data.asset?.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileTextIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Maintenance Type</p>
                      <p className="font-medium text-gray-900">{assetMaintenance.data.maintenance_type || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileTextIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Description Type</p>
                      <p className="font-medium text-gray-900">{assetMaintenance.data.description_type || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSignIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Rate</p>
                      <p className="font-medium text-gray-900">{assetMaintenance.data.rate || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSignIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Cost Estimate</p>
                      <p className="font-medium text-gray-900">{formatCurrency(assetMaintenance.data.cost_estimate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSignIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Total Cost Estimate</p>
                      <p className="font-medium text-gray-900 text-lg font-semibold">
                        {formatCurrency(assetMaintenance.data.total_cost_estimate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description of Problem */}
                {assetMaintenance.data.description && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Description of Problem</p>
                    <p className="text-gray-900 leading-relaxed">{assetMaintenance.data.description}</p>
                  </div>
                )}

                {/* Justification for Disposal */}
                {assetMaintenance.data.disposal_justification && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Justification for Disposal</p>
                    <p className="text-gray-900 leading-relaxed">{assetMaintenance.data.disposal_justification}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approval History - Only show when there are actual approvals */}
            {assetMaintenance?.data.approvals?.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Approval History
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Track the approval workflow for this maintenance ticket
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-4">
                  {assetMaintenance.data.approvals
                    .sort(
                      (a, b) =>
                        new Date(a.created_datetime).getTime() -
                        new Date(b.created_datetime).getTime()
                    )
                    .map((approval, index) => (
                      <div key={approval.id} className="flex gap-4">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          {index < assetMaintenance.data.approvals.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 my-2" />
                          )}
                        </div>

                        {/* Content */}
                        <Card className="flex-1 border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <Badge variant="outline" className="mb-2">
                                  {approval.approval_level}
                                </Badge>
                                <p className="font-semibold text-gray-900">
                                  {approval.user?.full_name || "N/A"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {approval.user?.email || ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  {format(new Date(approval.created_datetime), "dd MMM yyyy")}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(approval.created_datetime), "HH:mm")}
                                </p>
                              </div>
                            </div>
                            {approval.comments && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700 italic">
                                  "{approval.comments}"
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Approval Actions */}
            {nextAction && (
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="bg-amber-50">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Approval Action Required
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This maintenance ticket requires your {nextAction.label.toLowerCase()}
                  </p>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <Button
                    onClick={() => openApprovalForm(nextAction.action as any)}
                    className={`${nextAction.color} text-white`}
                    size="lg"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    {nextAction.label} Ticket
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStatus === "Approved" && (
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium">
                      This maintenance ticket has been fully approved and can proceed to execution.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Approval Form Modal */}
            {showApprovalForm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                <Card className='p-6 w-96 max-w-md'>
                  <h3 className='text-lg font-semibold mb-4'>
                    {approvalAction === "review" && "Review Ticket"}
                    {approvalAction === "authorize" && "Authorize Ticket"}
                    {approvalAction === "approve" && "Approve Ticket"}
                  </h3>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Comments *
                      </label>
                      <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder='Enter your approval comments...'
                        rows={4}
                        className='w-full'
                      />
                    </div>

                    <div className='flex gap-3 justify-end'>
                      <Button
                        variant='outline'
                        onClick={closeApprovalForm}
                        disabled={isReviewing || isAuthorizing || isApproving}
                      >
                        Cancel
                      </Button>
                      <FormButton
                        onClick={handleApproval}
                        loading={isReviewing || isAuthorizing || isApproving}
                        disabled={!comments.trim()}
                        className={nextAction?.color}
                      >
                        Confirm {nextAction?.label}
                      </FormButton>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
