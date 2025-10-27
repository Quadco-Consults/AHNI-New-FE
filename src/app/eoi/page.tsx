"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  Clock,
  FileText,
  Search,
  Filter,
  ArrowRight,
  Building2,
  Users,
  Eye
} from "lucide-react";
import { useGetPublicEois } from "@/features/procurement/controllers/eoiController";
import { EOIResultsData } from "@/features/procurement/types/eoi";

export default function PublicOpportunitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch real opportunity data from public API (EOI, RFQ, RFP)
  const { data: eoiData, isLoading, error } = useGetPublicEois({
    page,
    size: 20,
    search,
    status: statusFilter === "all" ? "" : statusFilter,
    opportunity_type: typeFilter === "all" ? "" : typeFilter,
    enabled: true
  });

  const opportunities = eoiData?.data?.results || [];
  const totalPages = eoiData?.data?.number_of_pages || 1;

  // Helper function to determine opportunity type and route using new backend field
  const getDetailRoute = (opportunity: any) => {
    // Use the new opportunity_type field from backend
    switch (opportunity.opportunity_type) {
      case 'RFQ':
        return `/rfq/${opportunity.id}`;
      case 'RFP':
        return `/rfp/${opportunity.id}`;
      case 'EOI':
      default:
        return `/eoi/${opportunity.id}`;
    }
  };

  const getOpportunityType = (opportunity: any) => {
    // Use the new opportunity_type field, with fallback logic for compatibility
    if (opportunity.opportunity_type) {
      return opportunity.opportunity_type;
    }

    // Fallback logic for older data
    if (opportunity.request_type === 'REQUEST FOR QUOTATION' ||
        opportunity.rfq_id ||
        opportunity.solicitation_items) {
      return 'RFQ';
    }
    return 'EOI';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'NEW_VENDOR':
        return 'New Vendor Registration';
      case 'OPEN_TENDER':
        return 'Open Tender';
      case 'PROCUREMENT_WITH_REGISTRATION':
        return 'Procurement with Registration';
      default:
        return 'Expression of Interest';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (closingDate: string) => {
    return new Date(closingDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">
              Procurement Opportunities
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Explore current procurement opportunities including Expressions of Interest (EOI),
              Requests for Quotation (RFQ), and tender announcements from the Achieving Health Initiatives Nigeria (AHNI).
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search opportunities..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="EOI">EOI Only</SelectItem>
                    <SelectItem value="RFQ">RFQ Only</SelectItem>
                    <SelectItem value="RFP">RFP Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading opportunities...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 mb-2">Error loading opportunities</div>
              <p className="text-muted-foreground text-sm">{error.message}</p>
            </CardContent>
          </Card>
        )}

        {/* Opportunities Grid */}
        {!isLoading && !error && (
          <>
            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
                  <p className="text-muted-foreground">
                    {search || (statusFilter && statusFilter !== "all") || (typeFilter && typeFilter !== "all")
                      ? "Try adjusting your search criteria or filters."
                      : "There are currently no active procurement opportunities."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {opportunities.map((opportunity: EOIResultsData) => (
                  <Card
                    key={opportunity.id}
                    className={`hover:shadow-lg transition-all ${
                      isExpired(opportunity.closing_date) ? 'opacity-75' : ''
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(opportunity.status)}
                            >
                              {opportunity.status}
                            </Badge>
                            {isExpired(opportunity.closing_date) && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                Expired
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl font-semibold mb-2">
                            {opportunity.name || opportunity.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>{opportunity.reference_number || opportunity.eoi_number || opportunity.rfq_id || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{getOpportunityType(opportunity)} - {getTypeDisplay(opportunity.type || opportunity.request_type || '')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => router.push(getDetailRoute(opportunity))}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {opportunity.description || opportunity.background || 'No description available'}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Opens:</span>
                          <span>{formatDate(opportunity.opening_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="font-medium">Closes:</span>
                          <span className={isExpired(opportunity.closing_date) ? 'text-red-600' : ''}>
                            {formatDate(opportunity.closing_date)}
                          </span>
                        </div>
                      </div>

                      {opportunity.categories && opportunity.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {opportunity.categories.slice(0, 3).map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {typeof category === 'string' ? category : category.name}
                            </Badge>
                          ))}
                          {opportunity.categories.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{opportunity.categories.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Back to Home */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}