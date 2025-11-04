"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { LoadingSpinner } from "components/Loading";
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
  BarChart3,
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
  useActivateAnnualPlan,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import { useGetAllFinancialYears } from "@/features/modules/controllers";

interface AnnualPlanDashboardProps {
  onCreateNew?: () => void;
  onViewDetails?: (planId: string) => void;
}

const AnnualPlanDashboard = ({ onCreateNew, onViewDetails }: AnnualPlanDashboardProps) => {
  const router = useRouter();
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>("");

  // Fetch data
  const { data: financialYearsData } = useGetAllFinancialYears({ page: 1, size: 100 });
  const { data: currentPlanData, isLoading: isLoadingCurrentPlan } = useGetCurrentAnnualPlan(selectedFinancialYear);
  const { data: dashboardData, isLoading: isLoadingDashboard } = useGetAnnualPlanDashboard(selectedFinancialYear);

  // Mutations
  const activatePlanMutation = useActivateAnnualPlan(currentPlanData?.data?.id || "");

  const financialYears = financialYearsData?.data?.results || [];
  const currentPlan = currentPlanData?.data;
  const dashboard = dashboardData?.data;

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
      case AnnualPlanStatus.ACTIVE:
        return "default";
      case AnnualPlanStatus.COMPLETED:
        return "secondary";
      case AnnualPlanStatus.UPLOADED:
        return "outline";
      case AnnualPlanStatus.DRAFT:
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

  const handleActivatePlan = async () => {
    if (!currentPlan) return;

    const confirmed = confirm(`Activate the annual plan "${currentPlan.title}"? This will make it available for site visit creation.`);
    if (!confirmed) return;

    try {
      await activatePlanMutation.mutateAsync();
      toast.success("Annual plan activated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to activate plan");
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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleCreateNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
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

      {/* Current Plan Overview */}
      {currentPlan ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                {currentPlan.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(currentPlan.status)}>
                  {AnnualPlanStatusLabels[currentPlan.status]}
                </Badge>
                {currentPlan.status === AnnualPlanStatus.UPLOADED && (
                  <Button
                    size="sm"
                    onClick={handleActivatePlan}
                    disabled={activatePlanMutation.isPending}
                  >
                    {activatePlanMutation.isPending ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        Activate Plan
                      </>
                    )}
                  </Button>
                )}
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

            {/* Status Breakdown */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {currentPlan.visits_completed}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {currentPlan.visits_in_progress}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-600">
                  {currentPlan.total_planned_visits - currentPlan.visits_completed - currentPlan.visits_in_progress - currentPlan.visits_cancelled}
                </div>
                <div className="text-xs text-gray-600">Planned</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {currentPlan.visits_cancelled}
                </div>
                <div className="text-xs text-gray-600">Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Annual Plan Found
            </h3>
            <p className="text-gray-600 mb-4">
              Create an annual supervision plan to get started with planning your supervision visits.
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create Annual Plan
            </Button>
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
                <BarChart3 className="h-5 w-5" />
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

          {/* Location Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {dashboard.location_coverage.map((location) => (
                  <div key={location.location_id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">
                        {location.location_name}
                      </span>
                      <span className="text-xs text-gray-600">
                        {location.completion_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${location.completion_rate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{location.completed} / {location.total_planned} visits</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      {dashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Completions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Recent Completions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.recent_completions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No recent completions
                </p>
              ) : (
                <div className="space-y-3">
                  {dashboard.recent_completions.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">
                          {visit.location_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {visit.visit_type.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {PlannedVisitStatusLabels[visit.status]}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {visit.actual_end_date && formatDate(visit.actual_end_date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.upcoming_visits.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No upcoming visits scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {dashboard.upcoming_visits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">
                          {visit.location_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {visit.visit_type.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {PlannedVisitStatusLabels[visit.status]}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {visit.actual_start_date && formatDate(visit.actual_start_date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnnualPlanDashboard;