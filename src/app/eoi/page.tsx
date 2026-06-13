"use client";

import { useState, useMemo, useEffect } from "react";
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
  ArrowLeft,
  Building2,
  Users,
  Eye,
  Briefcase,
  User,
  Presentation
} from "lucide-react";
import { useGetPublicEois } from "@/features/procurement/controllers/eoiController";
import { EOIResultsData } from "@/features/procurement/types/eoi";
import { useGetAllOpportunities } from "@/features/opportunities/controllers/opportunitiesController";
import { OPPORTUNITY_TYPE_CONFIGS, OPPORTUNITY_STATUS_CONFIGS } from "@/features/opportunities/types";
import { debugTokenStatus, testTokenRefresh, clearAllTokens } from "@/utils/token-debug";

export default function PublicOpportunitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    console.log("🔍 EOI Page Component Loading");
    console.log("🔍 Current URL:", window.location.href);
  }, []);

  // Backend is ready for all 7 opportunity types!
  const getOpportunityTypeParam = () => {
    if (typeFilter === "all") return "";
    if (typeFilter === "procurement") return ""; // Will be filtered client-side
    return typeFilter;
  };

  // Fetch real opportunity data from unified API (supports all 7 types)
  const { data: unifiedData, isLoading, error } = useGetAllOpportunities({
    page,
    size: 20,
    search,
    status: statusFilter === "all" ? [] : [statusFilter],
    type: typeFilter === "all" ? [] : [typeFilter],
  });

  // Also fetch procurement opportunities for backward compatibility (test if working now)
  const { data: eoiData, error: eoiError } = useGetPublicEois({
    page,
    size: 20,
    search,
    status: statusFilter === "all" ? "" : statusFilter,
    opportunity_type: getOpportunityTypeParam(),
    enabled: true // Re-enabled to test if 500 error is resolved
  });

  // Prioritize public procurement opportunities (these should work for everyone)
  const procurementOpportunities = eoiData?.data?.results || [];

  // Get unified opportunities (these might only work for authenticated users)
  const jobOpportunities = unifiedData?.opportunities || [];

  // Fallback mock data if APIs are not returning data (for debugging)
  const mockData = [
    {
      id: "mock-1",
      title: "Mock EOI - Healthcare Equipment Supply",
      description: "Expression of Interest for medical equipment supply to health facilities",
      status: "active",
      opportunity_type: "EOI",
      type: "EOI",
      publication_date: new Date().toISOString(),
      closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "mock-2",
      title: "Mock RFQ - Office Supplies Procurement",
      description: "Request for Quotation for office supplies and equipment",
      status: "active",
      opportunity_type: "RFQ",
      type: "RFQ",
      publication_date: new Date().toISOString(),
      closing_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // Check if we have real data - prioritize public procurement opportunities
  const hasRealData = procurementOpportunities.length > 0 || jobOpportunities.length > 0;
  const displayProcurementOpportunities = procurementOpportunities;
  const displayJobOpportunities = hasRealData ? jobOpportunities : [];

  // Real procurement opportunities will come from API

  // Check authentication status (only on client)
  const isAuthenticated = isClient ? !!localStorage.getItem("token") : false;

  // Debug logging
  console.log("🔍 EOI Page Debug:");
  console.log("Authentication Status:", isAuthenticated ? "Authenticated" : "Not Authenticated");
  console.log("Unified data:", unifiedData);
  console.log("Job opportunities:", jobOpportunities.length);
  console.log("Procurement opportunities:", procurementOpportunities.length);
  console.log("EOI Error:", eoiError);
  console.log("Unified Error:", error);
  console.log("EOI Data raw:", eoiData);
  console.log("Unified Data raw:", unifiedData);

  // Helper function to determine opportunity type
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

  // Combine all opportunities, prioritizing public data
  const allOpportunities = [...displayProcurementOpportunities, ...displayJobOpportunities];

  // If no real data is available, use mock data
  const finalOpportunities = allOpportunities.length > 0 ? allOpportunities : mockData;

  const opportunities = useMemo(() => {
    if (typeFilter === "procurement") {
      return finalOpportunities.filter((op: any) =>
        ["EOI", "RFQ", "RFP"].includes(getOpportunityType(op))
      );
    }
    return finalOpportunities;
  }, [finalOpportunities, typeFilter]);
  const totalPages = eoiData?.data?.number_of_pages || 1;

  // Debug final data
  console.log("All opportunities (real):", allOpportunities.length);
  console.log("Final opportunities (with fallback):", finalOpportunities.length);
  console.log("Final filtered opportunities:", opportunities.length);
  console.log("Type filter:", typeFilter);
  console.log("Final opportunities sample:", opportunities.slice(0, 3));
  console.log("Using mock data?", finalOpportunities === mockData);

  // Helper function to determine opportunity type and route using new backend field
  const getDetailRoute = (opportunity: any) => {
    // Use the new opportunity_type field from backend
    switch (opportunity.opportunity_type) {
      case 'RFQ':
        return `/rfq/${opportunity.id}`;
      case 'RFP':
        return `/rfp/${opportunity.id}`;
      case 'JOB':
        return `/jobs/${opportunity.id}`;
      case 'ADHOC':
        return `/adhoc-jobs/${opportunity.id}`;
      case 'CONSULTANT':
        return `/consultant-jobs/${opportunity.id}`;
      case 'FACILITATOR':
        return `/facilitator-jobs/${opportunity.id}`;
      case 'EOI':
      default:
        return `/eoi/${opportunity.id}`;
    }
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
      // Procurement types
      case 'EOI':
        return 'Expression of Interest';
      case 'RFQ':
        return 'Request for Quotation';
      case 'RFP':
        return 'Request for Proposal';
      // Job types
      case 'JOB':
        return 'Job Advertisement';
      case 'ADHOC':
        return 'Adhoc Position';
      case 'CONSULTANT':
        return 'Consultant Opportunity';
      case 'FACILITATOR':
        return 'Facilitator Position';
      // Legacy types
      case 'NEW_VENDOR':
        return 'New Vendor Registration';
      case 'OPEN_TENDER':
        return 'Open Tender';
      case 'PROCUREMENT_WITH_REGISTRATION':
        return 'Procurement with Registration';
      default:
        return type || 'Opportunity';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      // Procurement types
      case 'EOI':
      case 'RFQ':
      case 'RFP':
        return <FileText className="h-4 w-4" />;
      // Job types
      case 'JOB':
        return <Briefcase className="h-4 w-4" />;
      case 'ADHOC':
        return <Clock className="h-4 w-4" />;
      case 'CONSULTANT':
        return <User className="h-4 w-4" />;
      case 'FACILITATOR':
        return <Presentation className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      // Procurement types
      case 'EOI':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RFQ':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RFP':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      // Job types
      case 'JOB':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ADHOC':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CONSULTANT':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'FACILITATOR':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
              All Opportunities
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Explore current opportunities including procurement (EOI, RFQ, RFP) and employment opportunities
              (Jobs, Adhoc positions, Consultant roles, Facilitator positions) from the Achieving Health Initiatives Nigeria (AHNI).
            </p>
            {!isAuthenticated && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-blue-700">
                  📝 <strong>Note:</strong> You're viewing sample opportunities.
                  <a href="/auth/login" className="text-blue-600 hover:text-blue-800 underline ml-1">
                    Login
                  </a> to see all real job advertisements and apply.
                </p>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-green-700">
                  ✅ <strong>Authenticated:</strong> You're seeing real opportunities from our database.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
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
                    <SelectItem value="procurement">Procurement Only</SelectItem>
                    <SelectItem value="EOI">EOI - Expression of Interest</SelectItem>
                    <SelectItem value="RFQ">RFQ - Request for Quotation</SelectItem>
                    <SelectItem value="RFP">RFP - Request for Proposal</SelectItem>
                    <SelectItem value="JOB">Job Advertisements</SelectItem>
                    <SelectItem value="ADHOC">Adhoc Positions</SelectItem>
                    <SelectItem value="CONSULTANT">Consultant Opportunities</SelectItem>
                    <SelectItem value="FACILITATOR">Facilitator Positions</SelectItem>
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
                      : "There are currently no active opportunities available."}
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
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={getTypeColor(getOpportunityType(opportunity))}
                            >
                              <span className="flex items-center gap-1">
                                {getTypeIcon(getOpportunityType(opportunity))}
                                {getTypeDisplay(getOpportunityType(opportunity))}
                              </span>
                            </Badge>
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
                              <span>Ref: {opportunity.reference_number || opportunity.eoi_number || opportunity.rfq_id || 'N/A'}</span>
                            </div>
                            {(opportunity.department || opportunity.project || opportunity.location) && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                <span>
                                  {opportunity.department ||
                                   (typeof opportunity.project === 'string' ? opportunity.project : opportunity.project?.title) ||
                                   (Array.isArray(opportunity.location) ? opportunity.location.join(', ') : opportunity.location) ||
                                   'AHNI'}
                                </span>
                              </div>
                            )}
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

      {/* Development Debug Tools - Remove in production */}
      {process.env.NODE_ENV === 'development' && isClient && (
        <div className="container mx-auto px-4 py-4 border-t border-yellow-200 bg-yellow-50">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Tools (Dev Only)</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={debugTokenStatus}
                className="text-xs"
              >
                Debug Tokens
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={testTokenRefresh}
                className="text-xs"
              >
                Test Refresh
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={clearAllTokens}
                className="text-xs"
              >
                Clear Tokens
              </Button>
            </div>
          </div>
        </div>
      )}

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