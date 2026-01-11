"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Calendar,
  FileText,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Target,
  Plus,
  TrendingUp
} from "lucide-react";
import { usePublicEOIs, EOIUtils } from "@/features/vendor-portal/controllers/publicEOIController";
import { LoadingSpinner } from "@/components/Loading";

export default function VendorEOIPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: eoisData, isLoading, error } = usePublicEOIs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading EOI opportunities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load EOI opportunities. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const eois = eoisData?.results || [];

  // Filter EOIs based on search
  const filteredEOIs = eois.filter((eoi: any) =>
    searchTerm === "" ||
    eoi.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eoi.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eoi.categories?.some((cat: any) =>
      (typeof cat === 'string' ? cat : cat.name)?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Separate by status
  const openEOIs = filteredEOIs.filter((eoi: any) => eoi.status === 'OPEN');
  const closingSoonEOIs = openEOIs.filter((eoi: any) => EOIUtils.isClosingSoon(eoi.closing_date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expression of Interest (EOI)</h1>
          <p className="text-gray-600 mt-1">
            Apply for new categories and expand your vendor qualifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/vendor-portal/eoi/submissions')}>
            View My Applications
          </Button>
          <Button onClick={() => window.open('/eoi', '_blank')}>
            <Plus className="h-4 w-4 mr-2" />
            Apply for EOI
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available EOIs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openEOIs.length}</div>
            <p className="text-xs text-muted-foreground">Open for applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closing Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{closingSoonEOIs.length}</div>
            <p className="text-xs text-muted-foreground">Within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(
                eois.flatMap((eoi: any) =>
                  eoi.categories?.map((cat: any) => typeof cat === 'string' ? cat : cat.name) || []
                )
              )).length}
            </div>
            <p className="text-xs text-muted-foreground">Available categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by EOI name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Closing Soon Alert */}
      {closingSoonEOIs.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>{closingSoonEOIs.length} EOI{closingSoonEOIs.length > 1 ? 's' : ''} closing soon!</strong>
            {" "}Don't miss out on these opportunities - applications close within the next 7 days.
          </AlertDescription>
        </Alert>
      )}

      {/* EOI Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Opportunities</h2>
          <span className="text-sm text-gray-600">
            Showing {filteredEOIs.length} of {eois.length} EOIs
          </span>
        </div>

        {filteredEOIs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredEOIs.map((eoi: any) => {
              const urgencyLevel = EOIUtils.getUrgencyLevel(eoi.days_remaining || 0);
              const urgencyColor = EOIUtils.getUrgencyColor(urgencyLevel);

              return (
                <Card key={eoi.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{eoi.name}</h3>
                          <Badge variant={EOIUtils.getStatusBadgeVariant(eoi.status)}>
                            {eoi.status}
                          </Badge>
                          {eoi.days_remaining <= 7 && (
                            <Badge className={urgencyColor}>
                              {urgencyLevel === 'urgent' ? 'Closing Soon' :
                               urgencyLevel === 'high' ? 'High Priority' : 'Normal'}
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{eoi.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Closes: {EOIUtils.formatDate(eoi.closing_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{eoi.days_remaining} days remaining</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{eoi.registered_vendors_count || 0} vendors applied</span>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Categories:</div>
                          <div className="flex flex-wrap gap-2">
                            {eoi.categories?.map((category: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {typeof category === 'string' ? category : category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Progress indicator */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Application Period</span>
                            <span>
                              {Math.max(0, Math.round(((new Date().getTime() - new Date(eoi.opening_date).getTime()) /
                                (new Date(eoi.closing_date).getTime() - new Date(eoi.opening_date).getTime())) * 100))}% elapsed
                            </span>
                          </div>
                          <Progress
                            value={Math.max(0, Math.round(((new Date().getTime() - new Date(eoi.opening_date).getTime()) /
                              (new Date(eoi.closing_date).getTime() - new Date(eoi.opening_date).getTime())) * 100))}
                            className="h-2"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => window.open(`/eoi/${eoi.id}`, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Apply Now
                        </Button>

                        {eoi.document && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(eoi.document, '_blank')}
                          >
                            View Requirements
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No EOIs Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "There are no EOI opportunities available at the moment"
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            About Expression of Interest (EOI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What is an EOI?</h4>
              <p className="text-sm text-gray-600">
                An Expression of Interest allows vendors to apply for prequalification in specific
                categories. Successful applicants become eligible to bid on RFQs in those categories.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">How to Apply</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review the EOI requirements carefully</li>
                <li>• Prepare required documents and certifications</li>
                <li>• Submit your application before the deadline</li>
                <li>• Track your application status in the vendor portal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}