"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { useVendorProfile } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "@/components/Loading";

export default function VendorEOISubmissionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: vendorProfile, isLoading, error } = useVendorProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading EOI submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load EOI submissions. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Mock EOI submission data - replace with real API data
  const mockSubmissions = [
    {
      id: 'eoi_sub_1',
      eoi_number: 'EOI-2024-001',
      eoi_name: 'Healthcare Equipment Suppliers',
      categories_applied: ['Medical Equipment', 'Healthcare Supplies'],
      submission_date: '2024-11-15T10:00:00Z',
      status: 'UNDER_REVIEW',
      documents_submitted: 5,
      feedback: null,
      estimated_completion: '2024-12-15T23:59:59Z'
    },
    {
      id: 'eoi_sub_2',
      eoi_number: 'EOI-2024-002',
      eoi_name: 'IT Services and Solutions Providers',
      categories_applied: ['Information Technology', 'Software Development'],
      submission_date: '2024-11-01T14:30:00Z',
      status: 'APPROVED',
      documents_submitted: 6,
      approval_date: '2024-11-20T09:15:00Z',
      feedback: 'Application approved. Welcome to our vendor network!'
    },
    {
      id: 'eoi_sub_3',
      eoi_number: 'EOI-2024-003',
      eoi_name: 'Construction and Infrastructure',
      categories_applied: ['Civil Engineering', 'Construction Materials'],
      submission_date: '2024-10-20T16:45:00Z',
      status: 'REQUIRES_CLARIFICATION',
      documents_submitted: 4,
      feedback: 'Please provide additional certifications for civil engineering category.'
    },
    {
      id: 'eoi_sub_4',
      eoi_number: 'EOI-2024-004',
      eoi_name: 'Office Supplies and Equipment',
      categories_applied: ['Office Supplies', 'Furniture'],
      submission_date: '2024-09-10T11:20:00Z',
      status: 'REJECTED',
      documents_submitted: 3,
      rejection_date: '2024-09-25T14:00:00Z',
      feedback: 'Insufficient documentation. Please ensure all required certificates are provided.'
    }
  ];

  // Filter submissions
  const filteredSubmissions = mockSubmissions.filter((submission) => {
    const matchesSearch = searchTerm === "" ||
      submission.eoi_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.eoi_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.categories_applied.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'REQUIRES_CLARIFICATION':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'UNDER_REVIEW':
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default';
      case 'REJECTED':
        return 'destructive';
      case 'REQUIRES_CLARIFICATION':
        return 'secondary';
      case 'UNDER_REVIEW':
      default:
        return 'outline';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'REQUIRES_CLARIFICATION':
        return 'Needs Clarification';
      case 'UNDER_REVIEW':
        return 'Under Review';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalSubmissions = mockSubmissions.length;
  const approvedSubmissions = mockSubmissions.filter(s => s.status === 'APPROVED').length;
  const pendingSubmissions = mockSubmissions.filter(s => ['UNDER_REVIEW', 'REQUIRES_CLARIFICATION'].includes(s.status)).length;
  const successRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My EOI Submissions</h1>
          <p className="text-gray-600 mt-1">
            Track the status of your Expression of Interest applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/vendor-portal/eoi')}>
            Browse EOIs
          </Button>
          <Button onClick={() => window.open('/eoi', '_blank')}>
            Submit New EOI
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">All time applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedSubmissions}</div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
            <p className="text-xs text-muted-foreground">Approval rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by EOI name, number, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="REQUIRES_CLARIFICATION">Needs Clarification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.eoi_number}
                      </h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(submission.status)}
                        <Badge variant={getStatusBadgeVariant(submission.status) as any}>
                          {getStatusDisplayName(submission.status)}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="font-medium text-gray-700 mb-3">{submission.eoi_name}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Submitted: {formatDate(submission.submission_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{submission.documents_submitted} documents</span>
                      </div>
                      {submission.approval_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>Approved: {formatDate(submission.approval_date)}</span>
                        </div>
                      )}
                      {submission.estimated_completion && submission.status === 'UNDER_REVIEW' && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Est. completion: {formatDate(submission.estimated_completion)}</span>
                        </div>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Applied Categories:</div>
                      <div className="flex flex-wrap gap-2">
                        {submission.categories_applied.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    {submission.feedback && (
                      <div className={`p-3 rounded-lg ${
                        submission.status === 'APPROVED' ? 'bg-green-50 border border-green-200' :
                        submission.status === 'REJECTED' ? 'bg-red-50 border border-red-200' :
                        'bg-orange-50 border border-orange-200'
                      }`}>
                        <div className="text-sm font-medium text-gray-900 mb-1">Feedback:</div>
                        <div className="text-sm text-gray-700">{submission.feedback}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </Button>

                    {submission.status === 'REQUIRES_CLARIFICATION' && (
                      <Button
                        size="sm"
                        onClick={() => window.open('/eoi', '_blank')}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Resubmit
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't submitted any EOI applications yet"
                }
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => router.push('/vendor-portal/eoi')}>
                  Browse Available EOIs
                </Button>
                <Button variant="outline" onClick={() => window.open('/eoi', '_blank')}>
                  Submit New EOI
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help with Your Application?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Application Status Guide</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Under Review:</strong> Your application is being evaluated</li>
                <li>• <strong>Needs Clarification:</strong> Additional information required</li>
                <li>• <strong>Approved:</strong> You're qualified for the categories</li>
                <li>• <strong>Rejected:</strong> Application did not meet requirements</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check for feedback on pending applications</li>
                <li>• Resubmit applications that need clarification</li>
                <li>• Browse RFQs for your approved categories</li>
                <li>• Contact support if you have questions</li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push('/vendor-portal/support/contact')}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}