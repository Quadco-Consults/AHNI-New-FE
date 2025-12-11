"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChartIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  MapPinIcon,
  LinkIcon,
  FileTextIcon,
  ArrowRightIcon,
  TargetIcon,
} from "lucide-react";

import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  SiteVisitType,
  SiteVisitTypeLabels,
} from "@/features/programs/types/site-visit";

import {
  PlannedVisitStatus,
  PlannedVisitStatusLabels,
  Quarter,
  QuarterLabels,
} from "@/features/programs/types/annual-supervision-plan";

import {
  useGetSiteVisitDashboard,
  useGetMyPendingApprovals,
} from "@/features/programs/controllers/siteVisitController";

import {
  useGetCurrentAnnualPlan,
  useGetAnnualPlanDashboard,
  useGetMyPlannedVisits,
} from "@/features/programs/controllers/annualSupervisionPlanController";

import { formatDate } from "@/utils/date";

export default function EnhancedSiteVisitDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // API hooks
  const { data: siteVisitDashboard, isLoading: isSiteVisitLoading } = useGetSiteVisitDashboard();
  const { data: myPendingApprovals } = useGetMyPendingApprovals();
  const { data: currentAnnualPlan } = useGetCurrentAnnualPlan();
  const { data: annualPlanDashboard } = useGetAnnualPlanDashboard();
  const { data: myPlannedVisits } = useGetMyPlannedVisits();

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Navigation handlers
  const handleCreateSiteVisit = () => {
    router.push("/programs/site-visit/create");
  };

  const handleViewAllSiteVisits = () => {
    router.push("/programs/site-visit");
  };

  const handleViewAnnualPlan = () => {
    if (currentAnnualPlan?.data?.id) {
      router.push(`/programs/annual-plan/${currentAnnualPlan.data.id}`);
    } else {
      router.push("/programs/annual-plan");
    }
  };

  const handleViewSiteVisit = (id: string) => {
    router.push(`/programs/site-visit/${id}`);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: SiteVisitStatus) => {
    const colorMap = {
      [SiteVisitStatus.DRAFT]: "secondary",
      [SiteVisitStatus.SUBMITTED]: "default",
      [SiteVisitStatus.REVIEWED]: "secondary",
      [SiteVisitStatus.AUTHORIZED]: "secondary",
      [SiteVisitStatus.APPROVED]: "default",
      [SiteVisitStatus.EA_GENERATED]: "secondary",
      [SiteVisitStatus.IN_PROGRESS]: "default",
      [SiteVisitStatus.COMPLETED]: "secondary",
      [SiteVisitStatus.CANCELLED]: "destructive",
    } as const;
    return colorMap[status] || "secondary";
  };

  const siteVisitStats = siteVisitDashboard?.data;
  const annualPlanStats = annualPlanDashboard?.data;

  // Prepare chart data
  const siteVisitStatusData = siteVisitStats ? Object.entries(siteVisitStats.byStatus).map(([status, count]) => ({
    name: SiteVisitStatusLabels[status as SiteVisitStatus] || status,
    value: count as number,
    status,
  })) : [];

  const plannedVisitProgressData = annualPlanStats?.quarterly_progress?.map(q => ({
    quarter: QuarterLabels[q.quarter],
    planned: q.planned,
    completed: q.completed,
    inProgress: q.in_progress,
    completionRate: q.planned > 0 ? Math.round((q.completed / q.planned) * 100) : 0,
  })) || [];

  if (isSiteVisitLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Visit Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive view of site visits and annual supervision planning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewAnnualPlan}>
            <TargetIcon className="h-4 w-4 mr-2" />
            Annual Plan
          </Button>
          <Button onClick={handleCreateSiteVisit}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Site Visit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="site-visits">Site Visits</TabsTrigger>
          <TabsTrigger value="annual-plan">Annual Plan</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Site Visits */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Site Visits</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {siteVisitStats?.totalVisits || 0}
                    </p>
                  </div>
                  <BarChartIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {siteVisitStats?.pendingApprovals || 0}
                    </p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            {/* Planned Visits */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Planned Visits</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {annualPlanStats?.statistics?.total_planned || 0}
                    </p>
                  </div>
                  <TargetIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {/* Plan Completion */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Plan Completion</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(annualPlanStats?.statistics?.completion_rate || 0)}%
                    </p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Site Visit Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Site Visit Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={siteVisitStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {siteVisitStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quarterly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Quarterly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={plannedVisitProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="planned" fill={COLORS[0]} name="Planned" />
                      <Bar dataKey="completed" fill={COLORS[1]} name="Completed" />
                      <Bar dataKey="inProgress" fill={COLORS[2]} name="In Progress" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Annual Plan Progress */}
          {currentAnnualPlan?.data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Annual Plan Progress</span>
                  <Button variant="outline" size="sm" onClick={handleViewAnnualPlan}>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Plan
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{currentAnnualPlan.data.title}</span>
                    <Badge variant="secondary">
                      {currentAnnualPlan.data.financial_year_display}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{Math.round(currentAnnualPlan.data.completion_percentage)}%</span>
                    </div>
                    <Progress value={currentAnnualPlan.data.completion_percentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {currentAnnualPlan.data.total_planned_visits}
                      </div>
                      <div className="text-xs text-gray-600">Total Planned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {currentAnnualPlan.data.visits_completed}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {currentAnnualPlan.data.visits_in_progress}
                      </div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Site Visits Tab */}
        <TabsContent value="site-visits" className="space-y-6">
          {/* Recent Site Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Site Visits</span>
                <Button variant="outline" onClick={handleViewAllSiteVisits}>
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteVisitStats?.recentVisits?.slice(0, 8).map((visit: any) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleViewSiteVisit(visit.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{visit.title}</h4>
                        {visit.planned_visit_id && (
                          <Badge variant="outline" className="text-xs">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            Linked to Plan
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{visit.location_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{formatDate(visit.start_date)} - {formatDate(visit.end_date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeColor(visit.status)}>
                        {SiteVisitStatusLabels[visit.status]}
                      </Badge>
                      {visit.full_visit_number && (
                        <span className="text-xs text-blue-600 font-mono">
                          #{visit.full_visit_number}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {(!siteVisitStats?.recentVisits || siteVisitStats.recentVisits.length === 0) && (
                  <div className="text-center py-6 text-gray-500">
                    <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No recent site visits found</p>
                    <Button className="mt-2" onClick={handleCreateSiteVisit}>
                      Create Your First Site Visit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annual Plan Tab */}
        <TabsContent value="annual-plan" className="space-y-6">
          {/* My Planned Visits */}
          <Card>
            <CardHeader>
              <CardTitle>My Planned Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myPlannedVisits?.results?.slice(0, 6).map((plannedVisit: any) => (
                  <div
                    key={plannedVisit.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{plannedVisit.location_name}</h4>
                          {plannedVisit.facility_name && (
                            <span className="text-sm text-gray-500">• {plannedVisit.facility_name}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {plannedVisit.visit_type === "SUPPORTIVE_SUPERVISION"
                              ? "Supportive Supervision"
                              : "Integrated Supportive Supervision"
                            }
                          </Badge>
                          {plannedVisit.planned_quarter && (
                            <span>{QuarterLabels[plannedVisit.planned_quarter as Quarter]}</span>
                          )}
                          {plannedVisit.estimated_duration_days && (
                            <span>{plannedVisit.estimated_duration_days} days</span>
                          )}
                        </div>

                        {plannedVisit.special_focus_areas && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Focus: </span>
                            {plannedVisit.special_focus_areas}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            plannedVisit.status === PlannedVisitStatus.COMPLETED
                              ? "default"
                              : plannedVisit.status === PlannedVisitStatus.IN_PROGRESS
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {PlannedVisitStatusLabels[plannedVisit.status]}
                        </Badge>

                        {plannedVisit.site_visit_id ? (
                          <Badge variant="outline" className="text-xs">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            Site Visit Created
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/programs/site-visit/create?planned_visit_id=${plannedVisit.id}`
                              )
                            }
                          >
                            Create Site Visit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!myPlannedVisits?.results || myPlannedVisits.results.length === 0) && (
                  <div className="text-center py-6 text-gray-500">
                    <TargetIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No planned visits assigned to you</p>
                    <Button className="mt-2" variant="outline" onClick={handleViewAnnualPlan}>
                      View Annual Plan
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Coverage */}
          {annualPlanStats?.location_coverage && (
            <Card>
              <CardHeader>
                <CardTitle>Location Coverage Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {annualPlanStats.location_coverage.slice(0, 5).map((location: any) => (
                    <div key={location.location_id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{location.location_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {location.completed}/{location.total_planned}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(location.completion_rate)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={location.completion_rate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}