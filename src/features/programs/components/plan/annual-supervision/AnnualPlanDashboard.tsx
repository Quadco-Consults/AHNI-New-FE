"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";
import {
  CalendarDays,
  Target,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  Eye,
  Download,
  Upload,
  BarChart,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";

import {
  AnnualPlanStatus,
  AnnualPlanStatusLabels,
  PlannedVisitStatus,
  PlannedVisitStatusLabels,
  Quarter,
  QuarterLabels,
} from "@/features/programs/types/annual-supervision-plan";

import {
  useGetAnnualPlanDashboard,
  useGetCurrentAnnualPlan,
  useGetAllAnnualPlans,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useGetAllFinancialYears } from "@/features/modules/controllers";

import {
  validateWorkflowAssignments,
  checkWorkflowPermission,
  getNextWorkflowStatus,
  getWorkflowActionMessage,
} from "@/features/programs/utils/workflowValidation";

interface AnnualPlanDashboardProps {
  onCreateNew?: () => void;
  onViewDetails?: (planId: string) => void;
  onUpload?: () => void;
  onExport?: () => void;
}

const AnnualPlanDashboard = ({ onCreateNew, onViewDetails, onUpload, onExport }: AnnualPlanDashboardProps) => {
  const router = useRouter();
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>("");

  // Fetch data
  const { data: financialYearsData } = useGetAllFinancialYears({ page: 1, size: 100 });
  const { data: currentPlanData, isLoading: isLoadingCurrentPlan } = useGetCurrentAnnualPlan(selectedFinancialYear);
  const { data: dashboardData, isLoading: isLoadingDashboard } = useGetAnnualPlanDashboard(selectedFinancialYear);
  const { data: allPlansData, isLoading: isLoadingAllPlans, error: allPlansError } = useGetAllAnnualPlans({ page: 1, page_size: 20 });

  // Mutations - we'll create this dynamically when needed

  const financialYears = financialYearsData?.data?.results || [];
  const currentPlan = currentPlanData?.data;
  const dashboard = dashboardData?.data;
  const allPlans = allPlansData?.data?.results || [];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return "Invalid Date";
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

  const getVisitStatusColor = (status: PlannedVisitStatus) => {
    switch (status) {
      case PlannedVisitStatus.COMPLETED:
        return "text-green-600";
      case PlannedVisitStatus.IN_PROGRESS:
        return "text-blue-600";
      case PlannedVisitStatus.SCHEDULED:
        return "text-orange-600";
      case PlannedVisitStatus.CANCELLED:
        return "text-red-600";
      case PlannedVisitStatus.PLANNED:
      default:
        return "text-gray-600";
    }
  };

  const handleActivatePlan = async (planId: string, planTitle: string) => {
    const confirmed = confirm(`Activate the annual plan "${planTitle}"? This will make it available for site visit creation.`);
    if (!confirmed) return;

    try {
      // Use AxiosWithToken for consistent API calls
      const response = await AxiosWithToken.post(`programs/plans/annual-supervision-plans/${planId}/activate/`);

      toast.success("Annual plan activated successfully");
      window.location.reload(); // Refresh to show updated status
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
  const handleSubmitForReview = async (planId: string, plan: any) => {
    // Validate workflow assignments
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_REVIEW);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('submit_review', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_review');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${planId}/`, { status: newStatus });
      toast.success("Plan submitted for review successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for review error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for review";
      toast.error(errorMessage);
    }
  };

  const handleReviewPlan = async (planId: string, plan: any, decision: 'APPROVE' | 'REJECT') => {
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
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${planId}/`, { status: newStatus });
      toast.success(`Plan review ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Review plan error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to review plan";
      toast.error(errorMessage);
    }
  };

  const handleSubmitForAuthorization = async (planId: string, plan: any) => {
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_AUTHORIZATION);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('submit_authorization', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_authorization');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${planId}/`, { status: newStatus });
      toast.success("Plan submitted for authorization successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for authorization error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for authorization";
      toast.error(errorMessage);
    }
  };

  const handleAuthorizePlan = async (planId: string, plan: any, decision: 'APPROVE' | 'REJECT') => {
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
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${planId}/`, { status: newStatus });
      toast.success(`Plan authorization ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Authorize plan error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to authorize plan";
      toast.error(errorMessage);
    }
  };

  const handleSubmitForApproval = async (planId: string, plan: any) => {
    const validation = validateWorkflowAssignments(plan, AnnualPlanStatus.UNDER_APPROVAL);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    const message = getWorkflowActionMessage('submit_approval', plan.title);
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      const newStatus = getNextWorkflowStatus(plan.status, 'submit_approval');
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${planId}/`, { status: newStatus });
      toast.success("Plan submitted for approval successfully");
      window.location.reload();
    } catch (error: any) {
      console.error("Submit for approval error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to submit for approval";
      toast.error(errorMessage);
    }
  };

  const handleApprovePlan = async (planId: string, plan: any, decision: 'APPROVE' | 'REJECT') => {
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
      await AxiosWithToken.put(`programs/plans/annual-supervision-plans/${planId}/`, { status: newStatus });
      toast.success(`Plan ${decision === 'APPROVE' ? 'approved' : 'rejected'} successfully`);
      window.location.reload();
    } catch (error: any) {
      console.error("Plan approval error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to approve plan";
      toast.error(errorMessage);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push("/dashboard/programs/plan/annual-supervision/create");
    }
  };

  const handleViewDetails = (planId: string) => {
    if (onViewDetails) {
      onViewDetails(planId);
    } else {
      router.push(`/dashboard/programs/plan/annual-supervision/${planId}`);
    }
  };

  if (isLoadingCurrentPlan || isLoadingDashboard) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle API errors gracefully
  if (isLoadingAllPlans) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Annual Supervision Planning</h1>
            <p className="text-gray-600 mt-1">
              Loading annual supervision plans...
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Handle API errors
  if (allPlansError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Annual Supervision Planning</h1>
            <p className="text-gray-600 mt-1">
              Manage and track annual supervision plans and progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={onUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Plan
            </Button>
            <Button onClick={handleCreateNew} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Backend Configuration Error
            </h3>
            <p className="text-gray-600 mb-4">
              There's an issue with the backend API. Please check that the Location model is properly imported in the Django backend.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {allPlansError.message}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              You can still create new plans using the buttons above while this issue is resolved.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Annual Supervision Planning</h1>
          <p className="text-gray-600 mt-1">
            Manage and track annual supervision plans and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={onUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Plan
          </Button>
          <Button onClick={handleCreateNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Financial Year Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <label className="text-sm font-medium">Financial Year</label>
              <select
                value={selectedFinancialYear}
                onChange={(e) => setSelectedFinancialYear(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Current Financial Year</option>
                {financialYears.map((year: any) => (
                  <option key={year.id} value={year.id}>
                    {year.year} ({formatDate(year.start_date)} - {formatDate(year.end_date)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Annual Plans List - Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Plans List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Annual Supervision Plans
                  {allPlans.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({allPlans.length} total)
                    </span>
                  )}
                </CardTitle>
                {isLoadingAllPlans && <LoadingSpinner />}
              </div>

              {/* Quick Status Filter */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
                  All Plans ({allPlans.length})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50 text-blue-700 border-blue-300">
                  Active ({allPlans.filter(p => p.status === AnnualPlanStatus.ACTIVE).length})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50 text-orange-700 border-orange-300">
                  Pending Approval ({allPlans.filter(p => [AnnualPlanStatus.UPLOADED, AnnualPlanStatus.UNDER_REVIEW, AnnualPlanStatus.REVIEWED, AnnualPlanStatus.UNDER_AUTHORIZATION, AnnualPlanStatus.AUTHORIZED, AnnualPlanStatus.UNDER_APPROVAL].includes(p.status)).length})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-50 text-green-700 border-green-300">
                  Completed ({allPlans.filter(p => p.status === AnnualPlanStatus.COMPLETED).length})
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {allPlans.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Annual Plans Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first annual supervision plan or uploading an existing one.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button onClick={handleCreateNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Plan
                    </Button>
                    <Button variant="outline" onClick={onUpload}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Plan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {allPlans.map((plan: any) => (
                    <div
                      key={plan.id}
                      className="border rounded-lg p-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
                            <Badge variant={getStatusBadgeVariant(plan.status || AnnualPlanStatus.DRAFT)}>
                              {AnnualPlanStatusLabels[plan.status || AnnualPlanStatus.DRAFT] || 'Unknown Status'}
                            </Badge>
                          </div>
                          {plan.description && (
                            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            Financial Year: {plan.financial_year_display || 'N/A'} •
                            Created: {formatDate(plan.created_datetime)} •
                            Uploaded by: {plan.uploaded_by_name || 'System'}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-600">
                            {plan.visits_completed || 0} of {plan.total_planned_visits || 0} visits completed
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${plan.completion_percentage || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Statistics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-lg font-semibold text-blue-700">{plan.total_planned_visits || 0}</div>
                          <div className="text-xs text-blue-600">Total Visits</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-semibold text-green-700">{plan.locations_covered || 0}</div>
                          <div className="text-xs text-green-600">Locations</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-semibold text-purple-700">{plan.facilities_covered || 0}</div>
                          <div className="text-xs text-purple-600">Facilities</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-semibold text-orange-700">{(plan.completion_percentage || 0).toFixed(1)}%</div>
                          <div className="text-xs text-orange-600">Complete</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(plan.id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>

                        {/* Workflow buttons based on status */}
                        {plan.status === AnnualPlanStatus.UPLOADED && (
                          <Button
                            size="sm"
                            onClick={() => handleSubmitForReview(plan.id, plan)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Submit for Review
                          </Button>
                        )}

                        {plan.status === AnnualPlanStatus.UNDER_REVIEW && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReviewPlan(plan.id, plan, 'APPROVE')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Approve Review
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReviewPlan(plan.id, plan, 'REJECT')}
                            >
                              Reject Review
                            </Button>
                          </div>
                        )}

                        {plan.status === AnnualPlanStatus.REVIEWED && (
                          <Button
                            size="sm"
                            onClick={() => handleSubmitForAuthorization(plan.id, plan)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Submit for Authorization
                          </Button>
                        )}

                        {plan.status === AnnualPlanStatus.UNDER_AUTHORIZATION && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAuthorizePlan(plan.id, plan, 'APPROVE')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Authorize
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAuthorizePlan(plan.id, plan, 'REJECT')}
                            >
                              Reject Authorization
                            </Button>
                          </div>
                        )}

                        {plan.status === AnnualPlanStatus.AUTHORIZED && (
                          <Button
                            size="sm"
                            onClick={() => handleSubmitForApproval(plan.id, plan)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Submit for Approval
                          </Button>
                        )}

                        {plan.status === AnnualPlanStatus.UNDER_APPROVAL && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprovePlan(plan.id, plan, 'APPROVE')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Final Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApprovePlan(plan.id, plan, 'REJECT')}
                            >
                              Reject Approval
                            </Button>
                          </div>
                        )}

                        {plan.status === AnnualPlanStatus.APPROVED && (
                          <Button
                            size="sm"
                            onClick={() => handleActivatePlan(plan.id, plan.title)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Activate Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Summary Stats */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{allPlans.length}</div>
                  <div className="text-sm text-blue-600">Total Plans</div>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {allPlans.filter(p => p.status === AnnualPlanStatus.ACTIVE).length}
                  </div>
                  <div className="text-sm text-green-600">Active Plans</div>
                </div>

                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">
                    {allPlans.filter(p => [AnnualPlanStatus.UPLOADED, AnnualPlanStatus.UNDER_REVIEW, AnnualPlanStatus.REVIEWED, AnnualPlanStatus.UNDER_AUTHORIZATION, AnnualPlanStatus.AUTHORIZED, AnnualPlanStatus.UNDER_APPROVAL].includes(p.status)).length}
                  </div>
                  <div className="text-sm text-orange-600">Pending Approval</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">
                    {allPlans.reduce((sum, plan) => sum + (plan.total_planned_visits || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Visits</div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">
                    {allPlans.reduce((sum, plan) => sum + (plan.visits_completed || 0), 0)}
                  </div>
                  <div className="text-sm text-purple-600">Completed Visits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Current Plan Overview (if exists) */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Current Active Plan: {currentPlan.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(currentPlan.status || AnnualPlanStatus.DRAFT)}>
                  {AnnualPlanStatusLabels[currentPlan.status || AnnualPlanStatus.DRAFT]}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(currentPlan.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
            {currentPlan.description && (
              <p className="text-gray-600 mt-2">{currentPlan.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Target className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {currentPlan.total_planned_visits}
                </div>
                <div className="text-sm text-blue-600">Total Planned</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <MapPin className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {currentPlan.locations_covered}
                </div>
                <div className="text-sm text-green-600">Locations</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {currentPlan.facilities_covered}
                </div>
                <div className="text-sm text-purple-600">Facilities</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {currentPlan.completion_percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-orange-600">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">
                  {currentPlan.visits_completed} of {currentPlan.total_planned_visits} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${currentPlan.completion_percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Statistics */}
      {dashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quarterly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Quarterly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.quarterly_progress.map((quarter) => (
                  <div key={quarter.quarter} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {QuarterLabels[quarter.quarter]}
                      </span>
                      <span className="text-sm text-gray-600">
                        {quarter.completed} / {quarter.planned}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: quarter.planned > 0 ? `${(quarter.completed / quarter.planned) * 100}%` : '0%'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Completed: {quarter.completed}</span>
                      <span>In Progress: {quarter.in_progress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recent_completions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Completions</h4>
                    <div className="space-y-2">
                      {dashboard.recent_completions.slice(0, 3).map((visit) => (
                        <div key={visit.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">{visit.location_name}</span>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Completed
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dashboard.upcoming_visits.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Upcoming Visits</h4>
                    <div className="space-y-2">
                      {dashboard.upcoming_visits.slice(0, 3).map((visit) => (
                        <div key={visit.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm">{visit.location_name}</span>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            {PlannedVisitStatusLabels[visit.status]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dashboard.recent_completions.length === 0 && dashboard.upcoming_visits.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnnualPlanDashboard;