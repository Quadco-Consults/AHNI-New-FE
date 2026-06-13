"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, Eye, Filter, CheckCircle, Clock, ClipboardList } from "lucide-react";
import { useGetConsultantReports } from "@/features/consultant-portal/controllers/consultantReportsController";
import { LoadingSpinner } from "@/components/Loading";

export default function ConsultantReportsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const pageSize = 20;

  // Convert "all" to empty string for API call
  const apiStatusFilter = statusFilter === "all" ? "" : statusFilter;

  // Backend already filters reports by logged-in consultant
  const { data: reportsData, isLoading, error } = useGetConsultantReports({
    page: currentPage,
    size: pageSize,
    status: apiStatusFilter,
  });

  const reports = reportsData?.data?.results || [];
  const totalCount = reportsData?.data?.paginator?.count || 0;

  // Calculate statistics from reports
  const statistics = useMemo(() => {
    return {
      total_reports: reports.length,
      pending: reports.filter((r: any) => r.status?.toUpperCase() === 'PENDING').length,
      approved: reports.filter((r: any) => r.status?.toUpperCase() === 'APPROVED').length,
      rejected: reports.filter((r: any) => r.status?.toUpperCase() === 'REJECTED').length,
    };
  }, [reports]);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load reports. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-gray-600 mt-1">Track and manage your consultancy reports</p>
        </div>
        <Button onClick={() => router.push('/consultant-portal/reports/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Submit New Report
        </Button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-8 w-8 text-blue-500" />
                <div className="text-2xl font-bold">{totalCount}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="text-2xl font-bold">{statistics.pending}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="text-2xl font-bold">{statistics.approved}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-red-500" />
                <div className="text-2xl font-bold">{statistics.rejected}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {statusFilter && statusFilter !== "all" && (
              <Button variant="outline" onClick={() => setStatusFilter("all")}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reports</h3>
              <p className="text-gray-600 mb-4">
                {statusFilter && statusFilter !== "all"
                  ? `No reports found with status "${statusFilter}"`
                  : "You haven't submitted any reports yet."}
              </p>
              <Button onClick={() => router.push('/consultant-portal/reports/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Report
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Consultancy Period</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {report.purpose}
                      </TableCell>
                      <TableCell>{formatDate(report.report_date)}</TableCell>
                      <TableCell>
                        {formatDateRange(report.consultancy_start_date, report.consultancy_end_date)}
                      </TableCell>
                      <TableCell>{report.consultancy_duration} days</TableCell>
                      <TableCell>
                        {report.document ? (
                          <FileText className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/consultant-portal/reports/${report.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination - only show if we have paginated API response */}
              {reportsData?.data?.paginator && reportsData.data.paginator.total_pages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {reportsData.data.paginator.page} of {reportsData.data.paginator.total_pages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === reportsData.data.paginator.total_pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
