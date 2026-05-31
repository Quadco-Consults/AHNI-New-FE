"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Calendar,
  FileText,
  Clock,
  Eye,
  Filter,
  AlertCircle,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { useGetVendorSolicitations } from "@/features/vendor-portal/controllers/vendorSolicitationController";
import { LoadingSpinner } from "@/components/Loading";
import { format, isValid } from "date-fns";

export default function VendorSolicitationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [closingSoonFilter, setClosingSoonFilter] = useState(false);

  const { data, isLoading, error } = useGetVendorSolicitations({
    search: searchTerm,
    request_type: requestTypeFilter !== "all" ? requestTypeFilter : undefined,
    closing_soon: closingSoonFilter,
  });

  const solicitations = data?.data?.results || [];
  const summary = data?.data?.summary || {};

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      urgent: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline"
    };
    return variants[urgency as keyof typeof variants] || "outline";
  };

  const getStatusBadge = (status: string) => {
    return status === 'OPEN' ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading available RFQs and RFPs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load solicitations. Please try refreshing the page.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Available RFQs & RFPs</h1>
        <p className="text-muted-foreground mt-2">
          View and respond to Requests for Quote and Proposals in your approved categories
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Available</p>
                <p className="text-2xl font-bold">{summary.total_count || solicitations.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closing Soon</p>
                <p className="text-2xl font-bold text-orange-600">{summary.closing_soon_count || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New RFQs</p>
                <p className="text-2xl font-bold text-green-600">{summary.new_rfqs_count || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold text-purple-600">{summary.submitted_count || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search RFQs/RFPs by title, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={requestTypeFilter} onValueChange={setRequestTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="RFQ">RFQ Only</SelectItem>
                <SelectItem value="RFP">RFP Only</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={closingSoonFilter ? "default" : "outline"}
              onClick={() => setClosingSoonFilter(!closingSoonFilter)}
              className="w-full md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Closing Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Solicitations List */}
      <div className="space-y-4">
        {solicitations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Solicitations Found</h3>
              <p className="text-muted-foreground">
                There are currently no RFQs or RFPs available in your approved categories.
              </p>
            </CardContent>
          </Card>
        ) : (
          solicitations.map((solicitation) => (
            <Card key={solicitation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusBadge(solicitation.status)}>
                        {solicitation.status}
                      </Badge>
                      <Badge variant="outline" className={
                        solicitation.request_type === 'RFQ' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }>
                        {solicitation.request_type}
                      </Badge>
                      {solicitation.urgency && (
                        <Badge variant={getUrgencyBadge(solicitation.urgency)}>
                          {solicitation.urgency.toUpperCase()}
                        </Badge>
                      )}
                      {solicitation.is_new && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          NEW
                        </Badge>
                      )}
                      {solicitation.has_submitted && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          SUBMITTED
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {solicitation.title}
                    </h3>

                    {solicitation.rfq_id && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Reference: {solicitation.rfq_id}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {solicitation.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Closes: {formatDate(solicitation.closing_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{solicitation.days_remaining} days remaining</span>
                      </div>
                      {solicitation.items_count > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{solicitation.items_count} items</span>
                        </div>
                      )}
                    </div>

                    {solicitation.categories && solicitation.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {solicitation.categories.slice(0, 3).map((category) => (
                          <Badge key={category.id} variant="outline" className="text-xs">
                            {category.name}
                          </Badge>
                        ))}
                        {solicitation.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{solicitation.categories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => router.push(`/vendor-portal/solicitations/${solicitation.id}`)}
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {solicitation.has_submitted && (
                      <Button
                        variant="outline"
                        onClick={() => router.push('/vendor-portal/bids')}
                        className="w-full md:w-auto"
                      >
                        View My Bid
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
