"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  Search,
  Calendar,
  Building2,
  FileText,
  Clock,
  AlertCircle,
  Filter,
  ArrowRight
} from "lucide-react";
import { useVendorAvailableRFQs } from "@/features/vendor-portal/controllers/vendorDashboardController";
import { LoadingSpinner } from "components/Loading";

export default function VendorRFQsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: availableRFQs, isLoading, error } = useVendorAvailableRFQs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading RFQs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load RFQs. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const filteredRFQs = availableRFQs?.filter((rfq: any) => {
    const matchesSearch = rfq.rfq_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.categories?.some((cat: string) => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || rfq.rfq_status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (closingDate: string) => {
    const now = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'CLOSING_SOON':
        return 'secondary';
      case 'CLOSED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getEligibilityBadgeVariant = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'default';
      case 'NOT_ELIGIBLE':
        return 'destructive';
      case 'PENDING_REVIEW':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available RFQs</h1>
        <p className="text-gray-600 mt-1">
          Browse and submit bids for procurement opportunities
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search RFQs by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="CLOSING_SOON">Closing Soon</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredRFQs.length} RFQ{filteredRFQs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* RFQ List */}
      <div className="space-y-4">
        {filteredRFQs.length > 0 ? (
          filteredRFQs.map((rfq: any) => {
            const daysRemaining = getDaysRemaining(rfq.closing_date);
            const isClosingSoon = daysRemaining <= 7 && daysRemaining > 0;
            const isClosed = daysRemaining <= 0;

            return (
              <Card key={rfq.rfq_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {rfq.rfq_title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Closes: {formatDate(rfq.closing_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {isClosed ? 'Closed' : isClosingSoon ? `${daysRemaining} days left` : `${daysRemaining} days left`}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {rfq.categories?.map((category: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge variant={getStatusBadgeVariant(rfq.rfq_status)}>
                              {rfq.rfq_status}
                            </Badge>
                            <Badge variant={getEligibilityBadgeVariant(rfq.eligibility_status)}>
                              {rfq.eligibility_status === 'ELIGIBLE' ? 'Eligible to Bid' :
                               rfq.eligibility_status === 'NOT_ELIGIBLE' ? 'Not Eligible' : 'Under Review'}
                            </Badge>
                            {rfq.submission_status && (
                              <Badge variant="secondary">
                                {rfq.submission_status === 'NOT_STARTED' ? 'Not Started' :
                                 rfq.submission_status === 'DRAFT' ? 'Draft Saved' :
                                 rfq.submission_status === 'SUBMITTED' ? 'Submitted' :
                                 rfq.submission_status === 'EVALUATED' ? 'Evaluated' : rfq.submission_status}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {isClosingSoon && !isClosed && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs">
                              <AlertCircle className="h-3 w-3" />
                              Closing Soon
                            </div>
                          )}

                          <Button
                            onClick={() => router.push(`/vendor-portal/rfqs/${rfq.rfq_id}`)}
                            variant={rfq.eligibility_status === 'ELIGIBLE' && !isClosed ? "default" : "outline"}
                            disabled={isClosed || rfq.eligibility_status === 'NOT_ELIGIBLE'}
                            className="whitespace-nowrap"
                          >
                            {rfq.submission_status === 'SUBMITTED' ? 'View Submission' :
                             rfq.submission_status === 'DRAFT' ? 'Continue Bid' :
                             isClosed ? 'View Details' :
                             rfq.eligibility_status === 'ELIGIBLE' ? 'Submit Bid' : 'View Details'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No RFQs Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "There are no RFQs available at the moment"}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}