"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { toast } from "sonner";
import { cn } from "lib/utils";
import Link from "next/link";
import {
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Settings,
  MoreHorizontal
} from "lucide-react";
import ConfirmationDialog from "components/ConfirmationDialog";
import {
  AnnualPlanStatus,
  AnnualPlanStatusLabels,
  IAnnualSupervisionPlan,
} from "@/features/programs/types/annual-supervision-plan";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  validateWorkflowAssignments,
  checkWorkflowPermission,
  getNextWorkflowStatus,
  getWorkflowActionMessage,
} from "@/features/programs/utils/workflowValidation";

const getStatusBadgeVariant = (status: AnnualPlanStatus) => {
  switch (status) {
    case AnnualPlanStatus.DRAFT:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case AnnualPlanStatus.UPLOADED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case AnnualPlanStatus.UNDER_REVIEW:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case AnnualPlanStatus.REVIEWED:
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case AnnualPlanStatus.UNDER_AUTHORIZATION:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case AnnualPlanStatus.AUTHORIZED:
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case AnnualPlanStatus.UNDER_APPROVAL:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case AnnualPlanStatus.APPROVED:
      return "bg-green-100 text-green-800 border-green-200";
    case AnnualPlanStatus.ACTIVE:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case AnnualPlanStatus.COMPLETED:
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const TableAction = ({ plan }: { plan: IAnnualSupervisionPlan }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleActivatePlan = async () => {
    const confirmed = confirm(`Activate the annual plan "${plan.title}"? This will make it available for site visit creation.`);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await AxiosWithToken.post(`programs/plans/annual-supervision-plans/${plan.id}/activate/`);
      toast.success("Annual plan activated successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Plan activation error:", error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          "Failed to activate plan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_REVIEW);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('submit_review', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_review');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Plan submitted for review successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for review error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for review";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewPlan = async (decision: 'APPROVE' | 'REJECT') => {
    const permission = checkWorkflowPermission(plan, 'review');
    if (!permission.canPerformAction) {
      toast.error(permission.message);
      return;
    }

    const actionType = decision === 'APPROVE' ? 'approve_review' : 'reject_review';
    const message = getWorkflowActionMessage(actionType, plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const newStatus = getNextWorkflowStatus(plan.status, actionType);
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success(`Plan review ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Review plan error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to review plan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForAuthorization = async () => {
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_AUTHORIZATION);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('submit_authorization', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_authorization');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Plan submitted for authorization successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for authorization error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for authorization";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthorizePlan = async (decision: 'APPROVE' | 'REJECT') => {
    const permission = checkWorkflowPermission(plan, 'authorize');
    if (!permission.canPerformAction) {
      toast.error(permission.message);
      return;
    }

    const actionType = decision === 'APPROVE' ? 'approve_authorization' : 'reject_authorization';
    const message = getWorkflowActionMessage(actionType, plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const newStatus = getNextWorkflowStatus(plan.status, actionType);
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success(`Plan authorization ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Authorize plan error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to authorize plan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_APPROVAL);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('submit_approval', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_approval');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Plan submitted for approval successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for approval error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for approval";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePlan = async (decision: 'APPROVE' | 'REJECT') => {
    const permission = checkWorkflowPermission(plan, 'approve');
    if (!permission.canPerformAction) {
      toast.error(permission.message);
      return;
    }

    const actionType = decision === 'APPROVE' ? 'approve_approval' : 'reject_approval';
    const message = getWorkflowActionMessage(actionType, plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      const newStatus = getNextWorkflowStatus(plan.status, actionType);
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success(`Plan ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Plan approval error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to approve plan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await AxiosWithToken.delete(`programs/plans/annual-supervision-plans/${plan.id}/`);
      toast.success("Annual plan deleted successfully");
      setDeleteDialogOpen(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Delete plan error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to delete plan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0' disabled={isLoading}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit' align="end">
          <div className='flex flex-col items-start gap-1'>
            {/* View Details */}
            <Link href={`/dashboard/programs/plan/annual-supervision/${plan.id}`} className='w-full'>
              <Button variant='ghost' className='w-full justify-start gap-2'>
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </Link>

            {/* Edit - Available for editable statuses */}
            {[AnnualPlanStatus.DRAFT, AnnualPlanStatus.UPLOADED, AnnualPlanStatus.REVIEWED].includes(plan.status) && (
              <Link href={`/dashboard/programs/plan/annual-supervision/create?id=${plan.id}`} className='w-full'>
                <Button variant='ghost' className='w-full justify-start gap-2'>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}

            {/* Workflow Actions based on status */}
            {plan.status === AnnualPlanStatus.UPLOADED && (
              <Button
                variant='ghost'
                className='w-full justify-start gap-2'
                onClick={handleSubmitForReview}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit for Review
              </Button>
            )}

            {plan.status === AnnualPlanStatus.UNDER_REVIEW && (
              <>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2 text-green-700 hover:text-green-800'
                  onClick={() => handleReviewPlan('APPROVE')}
                  disabled={isLoading}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Review
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2 text-red-700 hover:text-red-800'
                  onClick={() => handleReviewPlan('REJECT')}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Review
                </Button>
              </>
            )}

            {plan.status === AnnualPlanStatus.REVIEWED && (
              <Button
                variant='ghost'
                className='w-full justify-start gap-2'
                onClick={handleSubmitForAuthorization}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit for Authorization
              </Button>
            )}

            {plan.status === AnnualPlanStatus.UNDER_AUTHORIZATION && (
              <>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2 text-green-700 hover:text-green-800'
                  onClick={() => handleAuthorizePlan('APPROVE')}
                  disabled={isLoading}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Authorize
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2 text-red-700 hover:text-red-800'
                  onClick={() => handleAuthorizePlan('REJECT')}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Authorization
                </Button>
              </>
            )}

            {plan.status === AnnualPlanStatus.AUTHORIZED && (
              <Button
                variant='ghost'
                className='w-full justify-start gap-2'
                onClick={handleSubmitForApproval}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit for Approval
              </Button>
            )}

            {plan.status === AnnualPlanStatus.UNDER_APPROVAL && (
              <>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2 text-green-700 hover:text-green-800'
                  onClick={() => handleApprovePlan('APPROVE')}
                  disabled={isLoading}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Final Approve
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-2 text-red-700 hover:text-red-800'
                  onClick={() => handleApprovePlan('REJECT')}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Approval
                </Button>
              </>
            )}

            {plan.status === AnnualPlanStatus.APPROVED && (
              <Button
                variant='ghost'
                className='w-full justify-start gap-2 text-green-700 hover:text-green-800'
                onClick={handleActivatePlan}
                disabled={isLoading}
              >
                <Settings className="h-4 w-4" />
                Activate Plan
              </Button>
            )}

            {/* Delete - Only for DRAFT status */}
            {plan.status === AnnualPlanStatus.DRAFT && (
              <Button
                variant='ghost'
                className='w-full justify-start gap-2 text-red-700 hover:text-red-800'
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title={`Delete "${plan.title}"?`}
        description="This action cannot be undone. This will permanently delete the annual supervision plan."
        loading={isLoading}
        onCancel={() => setDeleteDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};

export const annualSupervisionColumns: ColumnDef<IAnnualSupervisionPlan>[] = [
  {
    header: "Title",
    id: "title",
    accessorKey: "title",
    size: 250,
  },
  {
    header: "Financial Year",
    id: "financial_year",
    size: 150,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="text-sm">
          {plan.financial_year_display || 'Not Set'}
        </div>
      );
    },
  },
  {
    header: "Total Visits",
    id: "total_visits",
    size: 120,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="text-center text-sm font-medium">
          {plan.total_planned_visits || 0}
        </div>
      );
    },
  },
  {
    header: "Completed",
    id: "completed_visits",
    size: 120,
    cell: ({ row }) => {
      const plan = row.original;
      return (
        <div className="text-center text-sm font-medium">
          {plan.visits_completed || 0}
        </div>
      );
    },
  },
  {
    header: "Progress",
    id: "progress",
    size: 150,
    cell: ({ row }) => {
      const plan = row.original;
      const percentage = plan.completion_percentage || 0;

      return (
        <div className="space-y-1">
          <div className="text-center">
            <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                percentage === 0 ? 'bg-gray-400' :
                percentage < 50 ? 'bg-orange-500' :
                percentage < 100 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 150,
    cell: ({ getValue }) => {
      const status = getValue() as AnnualPlanStatus;
      return (
        <Badge
          variant='default'
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-md",
            getStatusBadgeVariant(status)
          )}
        >
          {AnnualPlanStatusLabels[status] || 'Unknown'}
        </Badge>
      );
    },
  },
  {
    header: "",
    id: "actions",
    size: 80,
    cell: ({ row }) => <TableAction plan={row.original} />,
  },
];