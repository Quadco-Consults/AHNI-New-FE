"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/Loading";
import {
  BarChart,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  FileText,
  ArrowRight,
} from "lucide-react";
import { RouteEnum } from "@/constants/RouterConstants";

import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  SiteVisitType,
  SiteVisitTypeLabels,
} from "@/features/programs/types/site-visit";

import {
  useGetSiteVisitDashboard,
  useGetMyPendingApprovals,
  useGetPendingApprovals,
} from "@/features/programs/controllers/siteVisitController";

const SiteVisitDashboard = () => {
  const router = useRouter();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useGetSiteVisitDashboard();
  const { data: myPendingApprovals, isLoading: isPendingLoading } = useGetMyPendingApprovals();
  const { data: pendingApprovalsList } = useGetPendingApprovals();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

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

  const handleCreateNew = () => {
    router.push(`${RouteEnum.PROGRAM_SITE_VISIT}/create`);
  };

  const handleViewAll = () => {
    router.push(RouteEnum.PROGRAM_SITE_VISIT);
  };

  const handleViewSiteVisit = (id: string) => {
    router.push(`${RouteEnum.PROGRAM_SITE_VISIT}/${id}`);
  };

  if (isDashboardLoading || isPendingLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="text-center py-8 text-red-600">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Error loading dashboard</p>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  const dashboard = dashboardData?.data;
  const stats = {
    total: dashboard?.total_visits || 0,
    byStatus: dashboard?.by_status || {},
    byType: dashboard?.by_type || {},
    recentVisits: dashboard?.recent_visits || [],
    pendingApprovals: dashboard?.pending_approvals || 0,
    myPendingVisits: dashboard?.my_pending_visits || [],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Site Visit Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of site visit applications and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewAll}>
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Site Visits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Site Visits</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time applications
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>

        {/* Completed Visits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.byStatus[SiteVisitStatus.COMPLETED] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.byStatus[SiteVisitStatus.IN_PROGRESS] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status and Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeColor(status as SiteVisitStatus)}>
                      {SiteVisitStatusLabels[status as SiteVisitStatus] || status}
                    </Badge>
                  </div>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
            {Object.keys(stats.byStatus).length === 0 && (
              <p className="text-center text-gray-500 py-4">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Visit Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Visit Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {SiteVisitTypeLabels[type as SiteVisitType] || type}
                    </span>
                  </div>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
            {Object.keys(stats.byType).length === 0 && (
              <p className="text-center text-gray-500 py-4">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Site Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Site Visits
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewAll}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentVisits.slice(0, 5).map((visit: any) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleViewSiteVisit(visit.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{visit.title}</div>
                    <div className="text-sm text-gray-500">
                      {visit.location_name || visit.location}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(visit.start_date)} - {formatDate(visit.end_date)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
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
              {stats.recentVisits.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No recent site visits</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleCreateNew}>
                    Create First Visit
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Approvals
              {stats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.myPendingVisits.slice(0, 5).map((visit: any) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors"
                  onClick={() => handleViewSiteVisit(visit.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{visit.title}</div>
                    <div className="text-sm text-gray-600">
                      {visit.location_name || visit.location}
                    </div>
                    <div className="text-xs text-orange-600 font-medium">
                      Awaiting your approval
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {SiteVisitStatusLabels[visit.status]}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {formatDate(visit.created_datetime)}
                    </div>
                  </div>
                </div>
              ))}
              {stats.myPendingVisits.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle2 className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No pending approvals</p>
                  <p className="text-xs">You're all caught up!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-20"
              onClick={handleCreateNew}
            >
              <Plus className="h-6 w-6" />
              <div>
                <div className="font-medium">New Application</div>
                <div className="text-xs text-gray-500">Create site visit</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-20"
              onClick={handleViewAll}
            >
              <Eye className="h-6 w-6" />
              <div>
                <div className="font-medium">View All Visits</div>
                <div className="text-xs text-gray-500">Browse applications</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 h-20"
              onClick={() => router.push(`${RouteEnum.PROGRAM_SITE_VISIT}?status=pending_approval`)}
            >
              <FileText className="h-6 w-6" />
              <div>
                <div className="font-medium">Review Pending</div>
                <div className="text-xs text-gray-500">Approval workflow</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteVisitDashboard;