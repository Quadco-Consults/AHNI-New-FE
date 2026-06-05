"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  AlertCircleIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  CircleIcon,
} from "lucide-react";
import { useGetAllSiteVisits } from "../../controllers/siteVisitController";
import { useGetAllSupervisionEvaluations } from "../../controllers/supervisionEvaluationController";
import { ISiteVisitListParams, SiteVisitStatus, SiteVisitType, SiteVisitTypeLabels, TSiteVisitPaginatedData } from "../../types/site-visit";
import { formatDate } from "@/utils/date";
import { toast } from "sonner";

interface SiteVisitsNeedingEvaluationProps {
  onCreateEvaluation: (siteVisitId: string) => void;
  onEvaluationSuccess?: () => void;
}

interface SiteVisitForEvaluation extends TSiteVisitPaginatedData {
  hasEvaluation: boolean;
}

export default function SiteVisitsNeedingEvaluation({
  onCreateEvaluation,
  onEvaluationSuccess,
}: SiteVisitsNeedingEvaluationProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<ISiteVisitListParams>({
    page: 1,
    page_size: 20,
    search: "",
    status: "", // Remove status filter initially to see all data
    visit_type: "",
    location: "",
  });

  // Add URL debugging
  useEffect(() => {
    console.log("🌐 API Configuration Check:", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      searchParams,
      apiPath: "programs/site-visits/",
      fullUrl: `${process.env.NEXT_PUBLIC_API_URL}/programs/site-visits/`
    });
  }, [searchParams]);

  // Test with no filters first to see if we get any data at all
  const { data: allSiteVisitsData } = useGetAllSiteVisits({
    page: 1,
    page_size: 10
  });

  // Log test data
  useEffect(() => {
    if (allSiteVisitsData) {
      console.log("🧪 Test - All travel requests (no filters):", allSiteVisitsData);
      console.log("🧪 Data structure exploration:", {
        topLevel: Object.keys(allSiteVisitsData),
        dataProperty: allSiteVisitsData.data,
        resultsProperty: allSiteVisitsData.results,
        dataResults: (allSiteVisitsData as any)?.data?.results,
        dataData: (allSiteVisitsData as any)?.data?.data
      });

      // Try different paths to find the actual travel requests array
      const actualResults = (allSiteVisitsData as any)?.data?.results ||
                           (allSiteVisitsData as any)?.data?.data ||
                           allSiteVisitsData.results ||
                           (allSiteVisitsData as any).data;

      if (actualResults && Array.isArray(actualResults)) {
        console.log("🧪 Found travel requests array:", actualResults);
        console.log("🧪 Available statuses in your system:",
          actualResults.reduce((acc: Record<string, number>, sv: any) => {
            acc[sv.status] = (acc[sv.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        );
        console.log("🧪 Available visit types in your system:",
          actualResults.reduce((acc: Record<string, number>, sv: any) => {
            acc[sv.visit_type] = (acc[sv.visit_type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        );
        console.log("🧪 Sample travel request data structure:", actualResults[0]);
      } else {
        console.log("🧪 Could not find travel requests array. Full data:", allSiteVisitsData);
      }
    }
  }, [allSiteVisitsData]);

  // Fetch completed travel requests
  const { data: siteVisitsData, isLoading: isLoadingSiteVisits, error: siteVisitsError } = useGetAllSiteVisits(searchParams);

  // Fetch all evaluations to check which travel requests already have evaluations (optional - don't fail if this doesn't work)
  const { data: evaluationsData, isLoading: isLoadingEvaluations, error: evaluationsError, refetch: refetchEvaluations } = useGetAllSupervisionEvaluations({
    page: 1,
    page_size: 1000, // Get all evaluations to check against
  });

  // Function to manually refresh evaluations data
  const refreshEvaluations = async () => {
    console.log("🔄 Manually refreshing evaluations data...");

    // Method 1: Invalidate and refetch using query client
    await queryClient.invalidateQueries({
      queryKey: ["supervision-evaluations"],
      exact: false  // This will invalidate all queries that start with "supervision-evaluations"
    });

    // Method 2: Direct refetch
    await refetchEvaluations();

    console.log("✅ Evaluations refresh completed");
  };

  // Expose refresh function to parent via callback
  React.useEffect(() => {
    if (onEvaluationSuccess) {
      // Replace the callback with our refresh function
      (window as any).refreshEvaluationsList = refreshEvaluations;
    }
  }, [onEvaluationSuccess]);

  // Log API responses for debugging
  useEffect(() => {
    console.log("🔍 Travel requests query state:", {
      isLoading: isLoadingSiteVisits,
      hasData: !!siteVisitsData,
      hasError: !!siteVisitsError,
      searchParams
    });

    if (siteVisitsData) {
      const supervisionTypes = [
        SiteVisitType.SUPPORTIVE_SUPERVISION,
        SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION,
        SiteVisitType.EMERGENCY_SUPPORTIVE_SUPERVISION,
      ];

      console.log("✅ Travel requests loaded:", {
        total: siteVisitsData.results?.length || 0,
        approved: siteVisitsData.results?.filter(sv => sv.status === "APPROVED").length || 0,
        supervisionTypes: siteVisitsData.results?.filter(sv =>
          sv.status === "APPROVED" && supervisionTypes.includes(sv.visit_type)
        ).length || 0,
        byStatus: siteVisitsData.results?.reduce((acc, sv) => {
          acc[sv.status] = (acc[sv.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byType: siteVisitsData.results?.reduce((acc, sv) => {
          acc[sv.visit_type] = (acc[sv.visit_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        rawData: siteVisitsData
      });
    }

    if (siteVisitsError) {
      console.error("❌ Travel requests error details:", {
        error: siteVisitsError,
        message: siteVisitsError?.message,
        name: siteVisitsError?.name,
        stack: siteVisitsError?.stack,
        cause: siteVisitsError?.cause
      });
      const errorMessage = siteVisitsError?.message || "Unknown error occurred while loading travel requests";
      toast.error("Failed to load travel requests: " + errorMessage);
    }
  }, [siteVisitsData, siteVisitsError, isLoadingSiteVisits, searchParams]);

  useEffect(() => {
    console.log("🔍 Evaluations query state:", {
      isLoading: isLoadingEvaluations,
      hasData: !!evaluationsData,
      hasError: !!evaluationsError
    });

    if (evaluationsData) {
      console.log("✅ Evaluations loaded:", {
        total: evaluationsData.results?.length || 0,
        rawData: evaluationsData
      });

      // Debug evaluation structure and travel request mapping
      if (evaluationsData.results && evaluationsData.results.length > 0) {
        console.log("🔍 First evaluation structure:", evaluationsData.results[0]);
        console.log("🔍 All evaluation travel request IDs:", evaluationsData.results.map(e => ({
          id: e.id,
          site_visit_id: e.site_visit_id,
          site_visit: e.site_visit,
          title: e.title
        })));
      }
    }

    if (evaluationsError) {
      console.error("❌ Evaluations error details:", {
        error: evaluationsError,
        message: evaluationsError?.message,
        name: evaluationsError?.name,
        stack: evaluationsError?.stack,
        cause: evaluationsError?.cause
      });
      const errorMessage = evaluationsError?.message || "Unknown error occurred while loading evaluations";
      // Use warning toast instead of error since travel requests still work
      toast("⚠️ Warning: Failed to load evaluations data. Travel requests are shown, but duplicates may appear.", {
        description: errorMessage
      });
    }
  }, [evaluationsData, evaluationsError, isLoadingEvaluations]);

  // Process travel requests to determine which need evaluation
  const siteVisitsForEvaluation = useMemo(() => {
    // Access the correct data structure: data.results
    const actualResults = (siteVisitsData as any)?.data?.results || siteVisitsData?.results;

    if (!actualResults || !Array.isArray(actualResults)) {
      console.log("🔍 No travel requests found. Data structure:", siteVisitsData);
      return [];
    }

    const existingEvaluationSiteVisitIds = new Set(
      evaluationsData?.results?.map(evaluation => evaluation.site_visit_id) || []
    );

    // Define supervision visit types based on actual data
    const supervisionTypes = [
      "Supportive Supervision",
      "Integrated Supportive Supervision",
      "Emergency Supportive Supervision",
    ];

    // Define approved statuses based on actual data
    const approvedStatuses = [
      "Authorized", // This is the "approved" status in your system
      "EA Generated", // This might also be considered ready for evaluation
    ];

    const filtered = actualResults
      .filter((siteVisit: any) => {
        const hasApprovedStatus = approvedStatuses.includes(siteVisit.status_display);
        const isSupervisionType = supervisionTypes.includes(siteVisit.visit_type_display);

        console.log(`🔍 Filtering travel request "${siteVisit.title}":`, {
          status: siteVisit.status_display,
          type: siteVisit.visit_type_display,
          hasApprovedStatus,
          isSupervisionType,
          included: hasApprovedStatus && isSupervisionType
        });

        return hasApprovedStatus && isSupervisionType;
      })
      .map((siteVisit: any, index: number) => {
        const hasEvaluation = existingEvaluationSiteVisitIds.has(siteVisit.id);
        const evaluation = evaluationsData?.results?.find(evaluation => evaluation.site_visit_id === siteVisit.id);

        return {
          ...siteVisit,
          hasEvaluation: hasEvaluation,
          evaluationStatus: evaluation?.status || 'PENDING',
          evaluationId: evaluation?.id || null,
        };
      });
      // Show all sites - both with and without evaluations

    console.log("🎯 Final filtered travel requests for evaluation:", filtered);
    return filtered;
  }, [siteVisitsData, evaluationsData]);

  // Only consider travel requests loading as critical - evaluations are optional
  const isLoading = isLoadingSiteVisits;

  // Handle search and filters
  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleVisitTypeFilter = (visitType: string) => {
    const actualType = visitType === "all" ? "" : visitType;
    setSearchParams(prev => ({ ...prev, visit_type: actualType, page: 1 }));
  };

  const handleLocationFilter = (location: string) => {
    const actualLocation = location === "all" ? "" : location;
    setSearchParams(prev => ({ ...prev, location: actualLocation, page: 1 }));
  };

  const handleCreateEvaluation = (siteVisitId: string) => {
    onCreateEvaluation(siteVisitId);
  };

  const handleViewEvaluation = (siteVisitId: string) => {
    // Find the evaluation for this travel request
    const evaluation = evaluationsData?.results?.find(evaluation => evaluation.site_visit_id === siteVisitId);
    if (evaluation) {
      // Navigate to the evaluation conducting interface
      router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluation.id}`);
    } else {
      toast.error("Evaluation not found for this travel request");
    }
  };

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    const actualResults = (siteVisitsData as any)?.data?.results || siteVisitsData?.results || [];
    const locations = [...new Set(actualResults.map((sv: any) => sv.location_name).filter(Boolean))];
    return locations;
  }, [siteVisitsData]);

  const renderSiteVisitCard = (siteVisit: any) => (
    <Card key={siteVisit.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{siteVisit.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{siteVisit.location_name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(siteVisit.start_date)} - {formatDate(siteVisit.end_date)}</span>
              </div>
              {siteVisit.team_members_count && (
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{siteVisit.team_members_count} members</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {siteVisit.visit_type_display}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              {siteVisit.status_display}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClockIcon className="h-4 w-4" />
            <span>Status: {siteVisit.status_display}</span>
          </div>
          <div className="flex gap-2 items-center">
            {siteVisit.hasEvaluation ? (
              <>
                {/* Evaluation Status Badge with Icons */}
                <Badge
                  variant={
                    siteVisit.evaluationStatus === 'COMPLETED' ? 'default' :
                    siteVisit.evaluationStatus === 'IN_PROGRESS' ? 'secondary' :
                    'outline'
                  }
                  className={
                    siteVisit.evaluationStatus === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                    siteVisit.evaluationStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }
                >
                  {siteVisit.evaluationStatus === 'COMPLETED' ? (
                    <><CheckCircleIcon className="h-3 w-3 mr-1" />Completed</>
                  ) : siteVisit.evaluationStatus === 'IN_PROGRESS' ? (
                    <><PlayCircleIcon className="h-3 w-3 mr-1" />In Progress</>
                  ) : (
                    <><CircleIcon className="h-3 w-3 mr-1" />Pending</>
                  )}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewEvaluation(siteVisit.id)}
                  className="flex items-center gap-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  {siteVisit.evaluationStatus === 'COMPLETED' ? 'View Results' : 'Continue Evaluation'}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => handleCreateEvaluation(siteVisit.id)}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Create Evaluation
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sites</p>
                <p className="text-2xl font-bold">{siteVisitsForEvaluation.length}</p>
              </div>
              <CircleIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Evaluation</p>
                <p className="text-2xl font-bold text-orange-600">
                  {siteVisitsForEvaluation.filter(sv => !sv.hasEvaluation).length}
                </p>
              </div>
              <AlertCircleIcon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {siteVisitsForEvaluation.filter(sv => sv.evaluationStatus === 'IN_PROGRESS').length}
                </p>
              </div>
              <PlayCircleIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {siteVisitsForEvaluation.filter(sv => sv.evaluationStatus === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supervision Evaluations Dashboard</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search travel requests..."
                  className="pl-10"
                  value={searchParams.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <Select value={searchParams.visit_type || "all"} onValueChange={handleVisitTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Visit Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visit Types</SelectItem>
                {Object.values(SiteVisitType).map(type => (
                  <SelectItem key={type} value={type}>
                    {SiteVisitTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={searchParams.location || "all"} onValueChange={handleLocationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading travel requests...</span>
            </div>
          ) : siteVisitsError ? (
            <div className="text-center py-8">
              <AlertCircleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Failed to load travel requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                {siteVisitsError?.message || "Please check your network connection and try again."}
              </p>
              {evaluationsError && (
                <p className="mt-2 text-xs text-orange-500">
                  Note: Evaluations data failed to load, but travel requests are shown.
                </p>
              )}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : siteVisitsForEvaluation.length === 0 && siteVisitsData?.results?.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No approved supervision visits found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No approved supervision visits are available for evaluation at this time.
              </p>
            </div>
          ) : siteVisitsForEvaluation.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircleIcon className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">All supervision visits evaluated</h3>
              <p className="mt-1 text-sm text-gray-500">
                All approved supervision visits have been evaluated. Great work!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {siteVisitsForEvaluation.map(renderSiteVisitCard)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}