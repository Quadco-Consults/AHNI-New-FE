"use client";

export const dynamic = "force-dynamic";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import BreadcrumbCard from "components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import {

Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  Settings,
  FileText,
  Target,
  AlertTriangle,
  Edit3,
  Save,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import {
  AnnualPlanStatus,
  AnnualPlanStatusLabels,
  PlannedVisitStatus,
  PlannedVisitStatusLabels,
  Quarter,
  QuarterLabels,
} from "@/features/programs/types/annual-supervision-plan";

import {
  useGetSingleAnnualPlan,
  useActivateAnnualPlan,
  useUpdateAnnualPlan,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import { useGetAllUsers } from "@/features/auth/controllers/userController";

import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import {
  validateWorkflowAssignments,
  checkWorkflowPermission,
  getNextWorkflowStatus,
  isValidStatusTransition,
  getWorkflowActionMessage,
} from "@/features/programs/utils/workflowValidation";

import { getCurrentUser } from "@/utils/auth";

const AnnualSupervisionPlanDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempAssignments, setTempAssignments] = useState({
    reviewer_id: "none",
    authorizer_id: "none",
    approver_id: "none",
  });

  const { data: planData, isLoading, error } = useGetSingleAnnualPlan(planId);
  const plan = planData?.data;

  // Fetch users for assignment editing
  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsers({
    page: 1,
    size: 1000,
  });
  const users = usersData?.data?.results || [];

  // Update plan mutation
  const updatePlanMutation = useUpdateAnnualPlan(planId);

  // Initialize temp assignments when plan data changes
  React.useEffect(() => {
    if (plan) {
      console.log("🔄 DEBUG: Plan data changed, current assignments:", {
        reviewer_id: plan.reviewer_id,
        authorizer_id: plan.authorizer_id,
        approver_id: plan.approver_id,
        reviewer_name: plan.reviewer_name,
        authorizer_name: plan.authorizer_name,
        approver_name: plan.approver_name,
      });

      setTempAssignments({
        reviewer_id: plan.reviewer_id || "none",
        authorizer_id: plan.authorizer_id || "none",
        approver_id: plan.approver_id || "none",
      });
    }
  }, [plan]);

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Annual Supervision Plan", icon: true },
    { name: plan?.title || "Plan Details", icon: false },
  ];

  const handleGoBack = () => {
    router.push("/dashboard/programs/plan/annual-supervision");
  };

  const handleActivatePlan = async () => {
    if (!plan) return;

    // Validate that plan can be activated
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.ACTIVE);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('activate', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'activate');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Annual plan activated successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Plan activation error:", error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          "Failed to activate plan";
      toast.error(errorMessage);
    }
  };

  // Workflow handlers with validation
  const handleSubmitForReview = async () => {
    if (!plan) return;

    // Validate workflow assignments
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_REVIEW);
    if (!validation.isValid) {
      toast.error(validation.message);
      if (validation.requiresAssignment) {
        // Show the assignment dialog to fix missing assignments
        setEditDialogOpen(true);
      }
      return;
    }

    const message = getWorkflowActionMessage('submit_review', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_review');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Plan submitted for review successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for review error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for review";
      toast.error(errorMessage);
    }
  };

  const handleReviewPlan = async (decision: 'APPROVE' | 'REJECT') => {
    if (!plan) return;

    // Check user permission to perform this action
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
      const newStatus = getNextWorkflowStatus(plan.status, actionType);
      console.log(`🔄 Attempting to update status to: ${newStatus} (review ${actionType})`);

      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success(`Plan review ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Review plan error:", error);
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to review plan";
      toast.error(`Review failed: ${errorMessage}`);
    }
  };

  const handleSubmitForAuthorization = async () => {
    if (!plan) return;

    // Validate workflow assignments
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_AUTHORIZATION);
    if (!validation.isValid) {
      toast.error(validation.message);
      if (validation.requiresAssignment) {
        setEditDialogOpen(true);
      }
      return;
    }

    const message = getWorkflowActionMessage('submit_authorization', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_authorization');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Plan submitted for authorization successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for authorization error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for authorization";
      toast.error(errorMessage);
    }
  };

  const handleAuthorizePlan = async (decision: 'APPROVE' | 'REJECT') => {
    if (!plan) return;

    // Check user permission to perform this action
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
      const newStatus = getNextWorkflowStatus(plan.status, actionType);
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success(`Plan authorization ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Authorize plan error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to authorize plan";
      toast.error(errorMessage);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!plan) return;

    // Validate workflow assignments
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_APPROVAL);
    if (!validation.isValid) {
      toast.error(validation.message);
      if (validation.requiresAssignment) {
        setEditDialogOpen(true);
      }
      return;
    }

    const message = getWorkflowActionMessage('submit_approval', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_approval');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success("Plan submitted for approval successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for approval error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for approval";
      toast.error(errorMessage);
    }
  };

  const handleFinalApprovePlan = async (decision: 'APPROVE' | 'REJECT') => {
    if (!plan) return;

    // Check user permission to perform this action
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
      const newStatus = getNextWorkflowStatus(plan.status, actionType);
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${plan.id}/`, { status: newStatus });
      toast.success(`Plan ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Plan approval error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to approve plan";
      toast.error(errorMessage);
    }
  };

  // Workflow assignments handlers
  const handleUpdateAssignments = async () => {
    console.log("🚀 handleUpdateAssignments called!");
    console.log("📋 Current temp assignments:", tempAssignments);
    try {
      const updateData: any = {};

      // Always include workflow assignment fields
      updateData.reviewer_id = tempAssignments.reviewer_id === "none" ? null : tempAssignments.reviewer_id;
      updateData.authorizer_id = tempAssignments.authorizer_id === "none" ? null : tempAssignments.authorizer_id;
      updateData.approver_id = tempAssignments.approver_id === "none" ? null : tempAssignments.approver_id;

      console.log("🔄 DEBUG: Temp assignments:", tempAssignments);
      console.log("🔄 DEBUG: Update data being sent:", updateData);
      console.log("🔄 DEBUG: Plan before update:", {
        reviewer_id: plan?.reviewer_id,
        authorizer_id: plan?.authorizer_id,
        approver_id: plan?.approver_id
      });

      const result = await updatePlanMutation.mutateAsync(updateData);
      console.log("🔄 DEBUG: API response:", result);
      console.log("🔄 DEBUG: API response data:", result?.data);
      console.log("🔄 DEBUG: Assignments in response:", {
        reviewer_id: result?.data?.reviewer_id,
        authorizer_id: result?.data?.authorizer_id,
        approver_id: result?.data?.approver_id,
      });

      // Check if backend is properly returning assignment fields
      // If all assignments are undefined (not null), the backend serializer needs fixing
      const hasAssignmentFields =
        result?.data?.reviewer_id !== undefined &&
        result?.data?.authorizer_id !== undefined &&
        result?.data?.approver_id !== undefined;

      console.log("✅ Assignment fields check:", { hasAssignmentFields });
      console.log("🎯 SUCCESS! Update completed successfully");

      toast.success("Workflow assignments updated successfully!");
      setEditDialogOpen(false);

      if (!hasAssignmentFields) {
        console.log("⚠️ Backend not returning assignment fields, will refresh in 3 seconds...");
        console.log("📝 You have 3 seconds to copy the logs above!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return;
      }

      console.log("🎉 Update completed without refresh needed!");
    } catch (error: any) {
      console.error("Assignment update error:", error);
      toast.error(error.message || "Failed to update assignments");
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setTempAssignments({
      reviewer_id: plan?.reviewer_id || "none",
      authorizer_id: plan?.authorizer_id || "none",
      approver_id: plan?.approver_id || "none",
    });
    setEditDialogOpen(false);
  };

  const getUserDisplayName = (userId: string) => {
    // Check if the plan object has workflow assignment fields at all
    const hasWorkflowFields = plan && (
      'reviewer_id' in plan || 'authorizer_id' in plan || 'approver_id' in plan ||
      'reviewer_name' in plan || 'authorizer_name' in plan || 'approver_name' in plan
    );

    if (!hasWorkflowFields) {
      return "Backend pending update";
    }

    if (!userId) return "Not assigned";
    const user = users.find(u => u.id === userId);
    if (!user) {
      return "Unknown user";
    }
    return user.full_name || `${user.first_name} ${user.last_name}`;
  };

  // Helper function to determine which workflow actions are available and valid
  const getWorkflowActions = () => {
    if (!plan) return { actions: [], warnings: [] };

    const currentUser = getCurrentUser();
    const actions: Array<{ type: string; label: string; variant: string; enabled: boolean; permission?: any; validation?: any }> = [];
    const warnings: string[] = [];

    switch (plan.status) {
      case AnnualPlanStatus.DRAFT:
        const reviewValidation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_REVIEW);
        actions.push({
          type: 'submit_review',
          label: !plan.uploaded_file_name ? "Submit for Review" : "Mark as Uploaded",
          variant: 'success',
          enabled: reviewValidation.isValid,
          validation: reviewValidation
        });
        if (!reviewValidation.isValid && reviewValidation.requiresAssignment) {
          warnings.push("Missing workflow assignments: " + (reviewValidation.missingAssignments?.join(", ") || ""));
        }
        break;

      case AnnualPlanStatus.UPLOADED:
        const uploadedReviewValidation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_REVIEW);
        actions.push({
          type: 'submit_review',
          label: "Submit for Review",
          variant: 'default',
          enabled: uploadedReviewValidation.isValid,
          validation: uploadedReviewValidation
        });
        break;

      case AnnualPlanStatus.UNDER_REVIEW:
        const reviewPermission = checkWorkflowPermission(plan, 'review');
        actions.push(
          {
            type: 'approve_review',
            label: "Approve Review",
            variant: 'success',
            enabled: reviewPermission.canPerformAction,
            permission: reviewPermission
          },
          {
            type: 'reject_review',
            label: "Reject Review",
            variant: 'destructive',
            enabled: reviewPermission.canPerformAction,
            permission: reviewPermission
          }
        );
        if (!reviewPermission.canPerformAction) {
          warnings.push(reviewPermission.message || "Cannot perform review action");
        }
        break;

      case AnnualPlanStatus.REVIEWED:
        const authValidation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_AUTHORIZATION);
        actions.push({
          type: 'submit_authorization',
          label: "Submit for Authorization",
          variant: 'outline',
          enabled: authValidation.isValid,
          validation: authValidation
        });
        if (!authValidation.isValid && authValidation.requiresAssignment) {
          warnings.push("Missing workflow assignments: " + (authValidation.missingAssignments?.join(", ") || ""));
        }
        break;

      case AnnualPlanStatus.UNDER_AUTHORIZATION:
        const authPermission = checkWorkflowPermission(plan, 'authorize');
        actions.push(
          {
            type: 'approve_authorization',
            label: "Authorize",
            variant: 'success',
            enabled: authPermission.canPerformAction,
            permission: authPermission
          },
          {
            type: 'reject_authorization',
            label: "Reject Authorization",
            variant: 'destructive',
            enabled: authPermission.canPerformAction,
            permission: authPermission
          }
        );
        if (!authPermission.canPerformAction) {
          warnings.push(authPermission.message || "Cannot perform authorization action");
        }
        break;

      case AnnualPlanStatus.AUTHORIZED:
        const approvalValidation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_APPROVAL);
        actions.push({
          type: 'submit_approval',
          label: "Submit for Approval",
          variant: 'outline',
          enabled: approvalValidation.isValid,
          validation: approvalValidation
        });
        if (!approvalValidation.isValid && approvalValidation.requiresAssignment) {
          warnings.push("Missing workflow assignments: " + (approvalValidation.missingAssignments?.join(", ") || ""));
        }
        break;

      case AnnualPlanStatus.UNDER_APPROVAL:
        const approvePermission = checkWorkflowPermission(plan, 'approve');
        actions.push(
          {
            type: 'approve_approval',
            label: "Final Approve",
            variant: 'success',
            enabled: approvePermission.canPerformAction,
            permission: approvePermission
          },
          {
            type: 'reject_approval',
            label: "Reject Approval",
            variant: 'destructive',
            enabled: approvePermission.canPerformAction,
            permission: approvePermission
          }
        );
        if (!approvePermission.canPerformAction) {
          warnings.push(approvePermission.message || "Cannot perform approval action");
        }
        break;

      case AnnualPlanStatus.APPROVED:
        const activationValidation = validateWorkflowAssignments(plan, AnnualPlanStatus.ACTIVE);
        actions.push({
          type: 'activate',
          label: "Activate Plan",
          variant: 'success',
          enabled: activationValidation.isValid,
          validation: activationValidation
        });
        break;

      default:
        break;
    }

    return { actions, warnings };
  };

  // Helper function to handle workflow action clicks
  const handleWorkflowAction = (actionType: string) => {
    switch (actionType) {
      case 'submit_review':
        return handleSubmitForReview();
      case 'approve_review':
        return handleReviewPlan('APPROVE');
      case 'reject_review':
        return handleReviewPlan('REJECT');
      case 'submit_authorization':
        return handleSubmitForAuthorization();
      case 'approve_authorization':
        return handleAuthorizePlan('APPROVE');
      case 'reject_authorization':
        return handleAuthorizePlan('REJECT');
      case 'submit_approval':
        return handleSubmitForApproval();
      case 'approve_approval':
        return handleFinalApprovePlan('APPROVE');
      case 'reject_approval':
        return handleFinalApprovePlan('REJECT');
      case 'activate':
        return handleActivatePlan();
      default:
        console.warn('Unknown action type:', actionType);
    }
  };

  const getStatusBadgeVariant = (status: AnnualPlanStatus) => {
    switch (status) {
      case AnnualPlanStatus.DRAFT:
        return "secondary";
      case AnnualPlanStatus.UPLOADED:
        return "outline";
      case AnnualPlanStatus.UNDER_REVIEW:
        return "warning";
      case AnnualPlanStatus.REVIEWED:
        return "default";
      case AnnualPlanStatus.UNDER_AUTHORIZATION:
        return "warning";
      case AnnualPlanStatus.AUTHORIZED:
        return "default";
      case AnnualPlanStatus.UNDER_APPROVAL:
        return "warning";
      case AnnualPlanStatus.APPROVED:
        return "success";
      case AnnualPlanStatus.ACTIVE:
        return "default";
      case AnnualPlanStatus.COMPLETED:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getVisitStatusBadgeVariant = (status: PlannedVisitStatus) => {
    switch (status) {
      case PlannedVisitStatus.PLANNED:
        return "secondary";
      case PlannedVisitStatus.SCHEDULED:
        return "default";
      case PlannedVisitStatus.IN_PROGRESS:
        return "warning";
      case PlannedVisitStatus.COMPLETED:
        return "success";
      case PlannedVisitStatus.CANCELLED:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return 'Not specified';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Not specified';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Not specified';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <BreadcrumbCard list={breadcrumbs} />
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="p-6">
        <BreadcrumbCard list={breadcrumbs} />
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Plan Not Found</h2>
          <p className="text-gray-600 mb-4">The annual supervision plan you're looking for doesn't exist or couldn't be loaded.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{plan.title}</h1>
              <p className="text-gray-600 mt-1">
                Financial Year: {plan.financial_year_display}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={getStatusBadgeVariant(plan.status || AnnualPlanStatus.DRAFT)}>
              {AnnualPlanStatusLabels[plan.status || AnnualPlanStatus.DRAFT]}
            </Badge>

            {/* Dynamic Workflow Action Buttons */}
            {(() => {
              const { actions, warnings } = getWorkflowActions();

              return (
                <>
                  {/* Show warning messages if any */}
                  {warnings.length > 0 && (
                    <div className="text-sm text-amber-600 mb-2">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      {warnings[0]}
                    </div>
                  )}

                  {/* Render action buttons */}
                  {actions.map((action, index) => (
                    <Button
                      key={`${action.type}-${index}`}
                      size="sm"
                      variant={action.variant as any}
                      disabled={!action.enabled}
                      onClick={() => {
                        if (action.enabled) {
                          if (!action.validation?.isValid && action.validation?.requiresAssignment) {
                            toast.error(action.validation.message);
                            setEditDialogOpen(true);
                            return;
                          }
                          if (!action.permission?.canPerformAction && action.permission?.message) {
                            toast.error(action.permission.message);
                            return;
                          }
                          handleWorkflowAction(action.type);
                        }
                      }}
                      title={!action.enabled ?
                        (action.validation?.message || action.permission?.message || "Action not available") :
                        undefined
                      }
                      className={
                        action.type.includes('approve') && action.enabled ? "bg-green-600 hover:bg-green-700" :
                        action.type.includes('reject') ? undefined :
                        action.type === 'submit_review' && action.enabled ? "bg-blue-600 hover:bg-blue-700" :
                        action.type === 'submit_authorization' && action.enabled ? "bg-purple-600 hover:bg-purple-700" :
                        action.type === 'submit_approval' && action.enabled ? "bg-orange-600 hover:bg-orange-700" :
                        action.type === 'activate' && action.enabled ? "bg-green-600 hover:bg-green-700" :
                        undefined
                      }
                    >
                      {action.type.includes('reject') ? (
                        <X className="w-4 h-4 mr-2" />
                      ) : action.type === 'activate' ? (
                        <Settings className="w-4 h-4 mr-2" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {action.label}
                    </Button>
                  ))}
                </>
              );
            })()}

            {/* Edit Assignments Button */}
            {plan && !('reviewer_id' in plan || 'authorizer_id' in plan || 'approver_id' in plan) ? (
              <Button
                size="sm"
                variant="outline"
                disabled
                title="Backend API needs to be updated to support workflow assignments"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Assignments (Pending Backend)
              </Button>
            ) : (
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Assignments
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Workflow Assignments</DialogTitle>
                  <DialogDescription>
                    Assign users who will review, authorize, and approve this plan.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Reviewer */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reviewer</label>
                    <Select
                      value={tempAssignments.reviewer_id}
                      onValueChange={(value) => setTempAssignments(prev => ({...prev, reviewer_id: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No reviewer assigned</SelectItem>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>Loading users...</SelectItem>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                              {user.designation && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({user.designation})
                                </span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>No users available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Authorizer */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Authorizer</label>
                    <Select
                      value={tempAssignments.authorizer_id}
                      onValueChange={(value) => setTempAssignments(prev => ({...prev, authorizer_id: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select authorizer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No authorizer assigned</SelectItem>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>Loading users...</SelectItem>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                              {user.designation && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({user.designation})
                                </span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>No users available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Approver */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Approver</label>
                    <Select
                      value={tempAssignments.approver_id}
                      onValueChange={(value) => setTempAssignments(prev => ({...prev, approver_id: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No approver assigned</SelectItem>
                        {isLoadingUsers ? (
                          <SelectItem value="loading" disabled>Loading users...</SelectItem>
                        ) : users.length > 0 ? (
                          users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name || `${user.first_name} ${user.last_name}`}
                              {user.designation && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({user.designation})
                                </span>
                              )}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>No users available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("🔘 Save button clicked!");
                      handleUpdateAssignments();
                    }}
                    disabled={updatePlanMutation.isPending}
                  >
                    {updatePlanMutation.isPending ? (
                      <>
                        <LoadingSpinner />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Plan Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Summary */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Plan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.description && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Plan Period</h4>
                    <p className="text-gray-600">
                      {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Created By</h4>
                    <p className="text-gray-600">{plan.uploaded_by_name || 'System'}</p>
                  </div>
                </div>

                {plan.uploaded_file_name && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Uploaded File</h4>
                    <p className="text-gray-600">{plan.uploaded_file_name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Planned Visits</span>
                  <span className="font-semibold">{plan.total_planned_visits}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Locations Covered</span>
                  <span className="font-semibold">{plan.locations_covered}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Facilities Covered</span>
                  <span className="font-semibold">{plan.facilities_covered}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Visits</span>
                  <span className="font-semibold text-green-600">{plan.visits_completed}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">{plan.visits_in_progress}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">{plan.completion_percentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planned Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Planned Visits ({plan.planned_visits?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {plan.planned_visits && plan.planned_visits.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Visit Type</TableHead>
                      <TableHead>Quarter</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Evaluation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Focus Areas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.planned_visits.map((visit, index) => (
                      <TableRow key={visit.id || index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{visit.location_name}</div>
                            {visit.location_code && (
                              <div className="text-sm text-gray-600">{visit.location_code}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {visit.facility_name ? (
                            <div className="text-sm">{visit.facility_name}</div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {visit.visit_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        </TableCell>
                        <TableCell>
                          {visit.planned_quarter ? (
                            <div className="text-sm">{QuarterLabels[visit.planned_quarter]}</div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {visit.estimated_duration_days ? (
                            <div className="text-sm">{visit.estimated_duration_days} days</div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {visit.requires_evaluation ? 'Yes' : 'No'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getVisitStatusBadgeVariant(visit.status)}>
                            {PlannedVisitStatusLabels[visit.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {visit.special_focus_areas ? (
                            <div className="text-sm max-w-48 truncate" title={visit.special_focus_areas}>
                              {visit.special_focus_areas}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No planned visits found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workflow Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Workflow Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Check if workflow fields are available in the backend */}
            {plan && !('reviewer_id' in plan || 'authorizer_id' in plan || 'approver_id' in plan) ? (
              <div className="text-center py-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-amber-800 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Workflow Assignments Not Available</span>
                  </div>
                  <p className="text-amber-700 text-sm">
                    The backend API needs to be updated to support workflow assignments.
                    The edit functionality has been implemented and will work once the backend includes these fields.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-700 text-sm">Reviewer</h4>
                  <p className="text-gray-600">{getUserDisplayName(plan?.reviewer_id || "")}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium text-gray-700 text-sm">Authorizer</h4>
                  <p className="text-gray-600">{getUserDisplayName(plan?.authorizer_id || "")}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-medium text-gray-700 text-sm">Approver</h4>
                  <p className="text-gray-600">{getUserDisplayName(plan?.approver_id || "")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnualSupervisionPlanDetailPage;