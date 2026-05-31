"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { useGetVendorBids } from "@/features/vendor-portal/controllers/vendorSolicitationController";
import { LoadingSpinner } from "@/components/Loading";
import { format, isValid } from "date-fns";

export default function VendorBidsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useGetVendorBids({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const bids = data?.data?.results || [];
  const summary = data?.data?.summary || {};

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PASSED':
        return 'default';
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading your bid submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load bid submissions. Please try refreshing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Bid Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your submitted quotes and proposals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{summary.total_submissions || bids.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-blue-600">{summary.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-green-600">{summary.passed || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{summary.failed || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PASSED">Passed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bids List */}
      <div className="space-y-4">
        {bids.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any bids yet. Browse available RFQs to get started.
              </p>
              <Button onClick={() => router.push('/vendor-portal/solicitations')}>
                Browse Solicitations
              </Button>
            </CardContent>
          </Card>
        ) : (
          bids.map((bid) => (
            <Card key={bid.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusBadgeVariant(bid.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(bid.status)}
                          {bid.status}
                        </span>
                      </Badge>
                      {bid.can_edit && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          DRAFT
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                      {bid.solicitation.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-2">
                      Reference: {bid.solicitation.rfq_id}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{bid.currency} {bid.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted: {formatDate(bid.submitted_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{bid.items_count} items</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Delivery: {bid.delivery_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => router.push(`/vendor-portal/bids/${bid.id}`)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {bid.can_edit && (
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/vendor-portal/bids/${bid.id}/edit`)}
                        className="w-full md:w-auto"
                      >
                        Edit Draft
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
