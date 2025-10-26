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
import { EOIResultsData } from "@/features/procurement/types/eoi";

export default function PublicOpportunitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Mock opportunities data for public display
  // TODO: Replace with real API data when public endpoint is available
  const mockOpportunities: EOIResultsData[] = [
    {
      id: "1",
      created_at: "2024-10-01T00:00:00Z",
      updated_at: "2024-10-01T00:00:00Z",
      name: "Medical Equipment Procurement - Phase 2",
      description: "Procurement of essential medical equipment including diagnostic machines, patient monitoring systems, and surgical instruments for healthcare facilities across Nigeria.",
      status: "active",
      opening_date: "2024-11-01T00:00:00Z",
      closing_date: "2024-11-30T23:59:59Z",
      document: "",
      eoi_number: "EOI-2024-001",
      type: "OPEN_TENDER",
      financial_year: "2024",
      categories: [
        { id: "1", name: "Medical Equipment", parent_category: null },
        { id: "2", name: "Healthcare Technology", parent_category: null }
      ]
    },
    {
      id: "2",
      created_at: "2024-09-15T00:00:00Z",
      updated_at: "2024-09-15T00:00:00Z",
      name: "IT Infrastructure Services",
      description: "Comprehensive IT infrastructure upgrade including network equipment, servers, cybersecurity solutions, and technical support services for AHNI facilities.",
      status: "active",
      opening_date: "2024-10-15T00:00:00Z",
      closing_date: "2024-11-15T23:59:59Z",
      document: "",
      eoi_number: "EOI-2024-002",
      type: "LIMITED_SOLICITATION",
      financial_year: "2024",
      categories: [
        { id: "3", name: "Information Technology", parent_category: null },
        { id: "4", name: "Network Infrastructure", parent_category: null }
      ]
    },
    {
      id: "3",
      created_at: "2024-08-20T00:00:00Z",
      updated_at: "2024-08-20T00:00:00Z",
      name: "Healthcare Facility Maintenance Services",
      description: "Ongoing maintenance and repair services for healthcare facilities including HVAC systems, electrical installations, plumbing, and general facility management.",
      status: "closed",
      opening_date: "2024-09-01T00:00:00Z",
      closing_date: "2024-10-15T23:59:59Z",
      document: "",
      eoi_number: "EOI-2024-003",
      type: "PROCUREMENT_WITH_REGISTRATION",
      financial_year: "2024",
      categories: [
        { id: "5", name: "Facility Management", parent_category: null },
        { id: "6", name: "Maintenance Services", parent_category: null }
      ]
    },
    {
      id: "4",
      created_at: "2024-10-10T00:00:00Z",
      updated_at: "2024-10-10T00:00:00Z",
      name: "Pharmaceutical Supplies and Medical Consumables",
      description: "Procurement of essential pharmaceuticals, medical consumables, personal protective equipment, and laboratory supplies for healthcare service delivery.",
      status: "active",
      opening_date: "2024-11-05T00:00:00Z",
      closing_date: "2024-12-05T23:59:59Z",
      document: "",
      eoi_number: "EOI-2024-004",
      type: "OPEN_TENDER",
      financial_year: "2024",
      categories: [
        { id: "7", name: "Pharmaceuticals", parent_category: null },
        { id: "8", name: "Medical Consumables", parent_category: null }
      ]
    },
    {
      id: "5",
      created_at: "2024-09-25T00:00:00Z",
      updated_at: "2024-09-25T00:00:00Z",
      name: "Training and Capacity Building Services",
      description: "Professional training services for healthcare workers, administrative staff, and technical personnel to enhance service delivery and operational efficiency.",
      status: "pending",
      opening_date: "2024-11-20T00:00:00Z",
      closing_date: "2024-12-20T23:59:59Z",
      document: "",
      eoi_number: "EOI-2024-005",
      type: "NEW_VENDOR",
      financial_year: "2024",
      categories: [
        { id: "9", name: "Training Services", parent_category: null },
        { id: "10", name: "Capacity Building", parent_category: null }
      ]
    }
  ];

  // Filter opportunities based on search and status
  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = search === "" ||
      opportunity.name.toLowerCase().includes(search.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(search.toLowerCase()) ||
      opportunity.eoi_number.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || opportunity.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Simulate pagination
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredOpportunities.length / pageSize);

  const opportunities = paginatedOpportunities;
  const isLoading = false;
  const error = null;

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
              Explore current procurement opportunities, expressions of interest, and tender announcements
              from the Achieving Health Initiatives Nigeria (AHNI).
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
                    {search || (statusFilter && statusFilter !== "all")
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
                            {opportunity.name}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>{opportunity.eoi_number}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{getTypeDisplay(opportunity.type || '')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => router.push(`/eoi/${opportunity.id}`)}
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
                        {opportunity.description}
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