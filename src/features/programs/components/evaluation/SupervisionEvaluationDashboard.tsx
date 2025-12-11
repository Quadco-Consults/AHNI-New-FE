"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  LineChart,
  Line,
} from "recharts";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BarChartIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import {
  useGetAllSupervisionEvaluations,
  useGetMyEvaluations,
  useGetEvaluationDashboard,
  useGenerateEvaluationReport,
} from "../../controllers/supervisionEvaluationController";
import {
  SupervisionEvaluationStatus,
  SupervisionEvaluationStatusLabels,
  ISupervisionEvaluationListParams,
} from "../../types/supervision-evaluation";
import { formatDate, formatDateTime } from "@/utils/date";
import { toast } from "sonner";

interface SupervisionEvaluationDashboardProps {
  viewType?: "all" | "my";
}

export default function SupervisionEvaluationDashboard({
  viewType = "all"
}: SupervisionEvaluationDashboardProps) {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<ISupervisionEvaluationListParams>({
    page: 1,
    page_size: 20,
    search: "",
    status: "",
  });

  // API hooks
  const { data: allEvaluationsData, isLoading: isLoadingAll } = useGetAllSupervisionEvaluations(
    viewType === "all" ? searchParams : undefined
  );
  const { data: myEvaluationsData, isLoading: isLoadingMy } = useGetMyEvaluations(
    viewType === "my" ? { page: searchParams.page, page_size: searchParams.page_size, status: searchParams.status } : undefined
  );
  const { data: dashboardData } = useGetEvaluationDashboard();
  const generateReportMutation = useGenerateEvaluationReport();

  const evaluationsData = viewType === "all" ? allEvaluationsData : myEvaluationsData;
  const isLoading = viewType === "all" ? isLoadingAll : isLoadingMy;

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Handle search and filters
  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    const actualStatus = status === "all" ? "" : status;
    setSearchParams(prev => ({ ...prev, status: actualStatus, page: 1 }));
  };

  const handleGenerateReport = async (format: 'PDF' | 'EXCEL') => {
    try {
      await generateReportMutation.mutateAsync({
        format,
        date_from: undefined,
        date_to: undefined,
      });
      toast.success(`${format} report generated successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate report");
    }
  };

  // Status distribution data for pie chart
  const statusDistribution = dashboardData?.data ? [
    { name: 'Completed', value: dashboardData.data.overview.completed_evaluations, color: COLORS[1] },
    { name: 'In Progress', value: dashboardData.data.overview.pending_evaluations, color: COLORS[2] },
    { name: 'Pending', value: dashboardData.data.overview.pending_evaluations, color: COLORS[3] },
  ].filter(item => item.value > 0) : [];

  // Category performance data for bar chart
  const categoryPerformanceData = dashboardData?.data?.category_performance?.map(cat => ({
    name: cat.category_name.length > 15 ? cat.category_name.substring(0, 15) + '...' : cat.category_name,
    score: Math.round(cat.average_score * 10) / 10,
    count: cat.evaluation_count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {viewType === "all" ? "All Supervision Evaluations" : "My Evaluations"}
          </h1>
          <p className="text-gray-600 mt-1">
            {viewType === "all"
              ? "Manage and analyze all supervision evaluations"
              : "View and manage your evaluation assignments"
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleGenerateReport('PDF')}
            loading={generateReportMutation.isPending}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleGenerateReport('EXCEL')}
            loading={generateReportMutation.isPending}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => router.push("/dashboard/programs/plan/supervision-evaluation/create")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Evaluation
          </Button>
        </div>
      </div>

      {/* Dashboard Overview */}
      {dashboardData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Evaluations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.data.overview.total_evaluations}
                  </p>
                </div>
                <BarChartIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData.data.overview.completed_evaluations}
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {dashboardData.data.overview.pending_evaluations}
                  </p>
                </div>
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(dashboardData.data.overview.average_score * 10) / 10}/5
                  </p>
                </div>
                <TrendingUpIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {dashboardData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 5]} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value}/5`,
                        name === "score" ? "Average Score" : name
                      ]}
                    />
                    <Bar dataKey="score" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search evaluations..."
                  value={searchParams.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={searchParams.status || "all"} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-48">
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(SupervisionEvaluationStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Evaluations List */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : evaluationsData?.results && evaluationsData.results.length > 0 ? (
            <div className="space-y-4">
              {evaluationsData.results.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluation.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{evaluation.title}</h3>
                        <Badge
                          variant={
                            evaluation.status === SupervisionEvaluationStatus.COMPLETED
                              ? "default"
                              : evaluation.status === SupervisionEvaluationStatus.IN_PROGRESS
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {SupervisionEvaluationStatusLabels[evaluation.status]}
                        </Badge>
                        {evaluation.overall_score && (
                          <Badge variant="outline">
                            Score: {Math.round(evaluation.overall_score * 10) / 10}/5
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{evaluation.location_name}</span>
                          {evaluation.facility_name && (
                            <span className="text-gray-400">• {evaluation.facility_name}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <UsersIcon className="h-4 w-4" />
                          <span>{evaluation.evaluator_name}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Evaluation Date: {formatDate(evaluation.evaluation_date)}
                        {evaluation.completed_date && (
                          <span className="ml-4">
                            Completed: {formatDate(evaluation.completed_date)}
                          </span>
                        )}
                      </div>

                      {evaluation.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {evaluation.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(evaluation.created_datetime)}
                      </div>
                      {evaluation.follow_up_required && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-orange-600">
                            <AlertCircleIcon className="h-3 w-3 mr-1" />
                            Follow-up Required
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  {evaluation.selected_categories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {evaluation.selected_categories.slice(0, 3).map((categoryId, index) => (
                          <Badge key={categoryId} variant="secondary" className="text-xs">
                            Category {index + 1}
                          </Badge>
                        ))}
                        {evaluation.selected_categories.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{evaluation.selected_categories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {evaluationsData.count > searchParams.page_size! && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={searchParams.page === 1}
                      onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page! - 1 }))}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">
                      Page {searchParams.page} of {Math.ceil(evaluationsData.count / searchParams.page_size!)}
                    </span>
                    <Button
                      variant="outline"
                      disabled={searchParams.page! * searchParams.page_size! >= evaluationsData.count}
                      onClick={() => setSearchParams(prev => ({ ...prev, page: prev.page! + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No evaluations found</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard/programs/plan/supervision-evaluation/create")}
              >
                Create First Evaluation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}