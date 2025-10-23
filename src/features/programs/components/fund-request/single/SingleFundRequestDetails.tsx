"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { LoadingSpinner } from "components/Loading";
import { useGetSingleFundRequest, useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import FundRequestWorkflowStatus from "../components/FundRequestWorkflowStatus";
import { useGetUserProfile } from "@/features/auth/controllers";
import { useMemo, useEffect } from "react";
import { Badge } from "components/ui/badge";
import { ArrowLeft, Eye, Printer } from "lucide-react";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import { FundRequestPaginatedData } from "@/features/programs/types/fund-request";

export default function SingleFundRequestDetails() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Get fund request ID from params or search params
  const fundRequestId = (params?.id as string) || searchParams?.get("fundRequestId") || "";

  const { data: profile } = useGetUserProfile();
  const { data: fundRequestData, isLoading: isFundRequestLoading, refetch } = useGetSingleFundRequest(
    fundRequestId || ""
  );

  const fundRequest = fundRequestData?.data;
  const projectId = typeof fundRequest?.project === 'object'
    ? fundRequest.project.id
    : fundRequest?.project;

  const { data: projectData } = useGetSingleProject(projectId || "");
  const project = projectData?.data;

  // Fetch all fund requests for this project
  const { data: allFundRequestsData } = useGetAllFundRequests({
    project: projectId || "",
    size: 1000,
    enabled: !!projectId,
  });

  const allFundRequests = allFundRequestsData?.data?.results || [];

  // Group fund requests by location
  const locationGroups = useMemo(() => {
    const grouped: Record<string, {
      locationName: string;
      requests: FundRequestPaginatedData[];
      totalAmount: number;
      uniqueIds: string[];
    }> = {};

    allFundRequests.forEach((request: FundRequestPaginatedData) => {
      const locationName = typeof request.location === 'object'
        ? request.location.name
        : request.location || 'Unknown Location';

      if (!grouped[locationName]) {
        grouped[locationName] = {
          locationName,
          requests: [],
          totalAmount: 0,
          uniqueIds: [],
        };
      }

      grouped[locationName].requests.push(request);
      grouped[locationName].totalAmount += Number(request.total_amount || 0);
      if (request.uuid_code) {
        grouped[locationName].uniqueIds.push(request.uuid_code);
      }
    });

    return Object.values(grouped);
  }, [allFundRequests]);

  // Refetch on mount
  useEffect(() => {
    if (fundRequestId) {
      refetch();
    }
  }, [fundRequestId, refetch]);

  // Calculate permissions based on current user and fund request status
  const permissions = useMemo(() => {
    if (!fundRequest || !profile?.data?.id) return {
      canLocationReview: false,
      canLocationAuthorize: false,
      canStateReview: false,
      canStateAuthorize: false,
      canReject: false,
    };

    const userId = profile.data.id;
    const request = fundRequest;

    return {
      canLocationReview:
        userId === request.location_reviewer && request.status === "PENDING",
      canLocationAuthorize:
        userId === request.location_authorizer &&
        request.status === "LOCATION_REVIEWED",
      canStateReview:
        userId === request.state_reviewer && request.status === "LOCATION_AUTHORIZED",
      canStateAuthorize:
        userId === request.state_authorizer && request.status === "STATE_REVIEWED",
      canReject:
        request.status !== "REJECTED" &&
        request.status !== "HQ_APPROVED" &&
        (userId === request.location_reviewer ||
          userId === request.location_authorizer ||
          userId === request.state_reviewer ||
          userId === request.state_authorizer) &&
        ["PENDING", "LOCATION_REVIEWED", "LOCATION_AUTHORIZED", "STATE_REVIEWED"].includes(request.status || ""),
    };
  }, [fundRequest, profile?.data?.id]);

  if (isFundRequestLoading) {
    return <LoadingSpinner />;
  }

  if (!fundRequest) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">Fund request not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </Card>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "LOCATION_REVIEWED": return "bg-blue-100 text-blue-800";
      case "LOCATION_AUTHORIZED": return "bg-blue-200 text-blue-900";
      case "STATE_REVIEWED": return "bg-purple-100 text-purple-800";
      case "STATE_AUTHORIZED": return "bg-purple-200 text-purple-900";
      case "HQ_REVIEWED": return "bg-indigo-100 text-indigo-800";
      case "HQ_AUTHORIZED": return "bg-indigo-200 text-indigo-900";
      case "HQ_APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Fund Request Details</h1>
            <p className="text-sm text-gray-600">{fundRequest.uuid_code || fundRequestId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={{
              pathname: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(
                ":id",
                projectId || ""
              ),
              search: `?fundRequestId=${fundRequestId}`,
            }}
          >
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Preview Summary
            </Button>
          </Link>
          <Badge className={getStatusColor(fundRequest.status)}>
            {fundRequest.status?.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='details' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='details'>Fund Request Details</TabsTrigger>
          <TabsTrigger value='summary'>Fund Request Summary</TabsTrigger>
          <TabsTrigger value='approval'>Approval Status</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value='details'>
          <Card className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Project</p>
                    <p className="font-medium">
                      {typeof fundRequest.project === 'object'
                        ? fundRequest.project.title
                        : project?.title || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">
                      {typeof fundRequest.location === 'object'
                        ? fundRequest.location.name
                        : fundRequest.location || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Month/Year</p>
                    <p className="font-medium">{fundRequest.month}/{fundRequest.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Currency</p>
                    <p className="font-medium">{fundRequest.currency || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="font-medium">
                      {fundRequest.currency === 'NGN' ? '₦' : '$'}
                      {Number(fundRequest.available_balance || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-blue-600">
                      {fundRequest.currency === 'NGN' ? '₦' : '$'}
                      {Number(fundRequest.total_amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Financial Year</p>
                    <p className="font-medium">
                      {typeof fundRequest.financial_year === 'object'
                        ? fundRequest.financial_year.year
                        : fundRequest.financial_year || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{fundRequest.type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {fundRequest.created_datetime
                        ? new Date(fundRequest.created_datetime).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Link
                  href={{
                    pathname: RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ACTIVITY.replace(
                      ":id",
                      typeof fundRequest.project === 'object'
                        ? fundRequest.project.id
                        : fundRequest.project || ""
                    ),
                    search: `?fundRequestId=${fundRequestId}`,
                  }}
                >
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Activity Report
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Fund Request Summary Tab - Grouped by Location */}
        <TabsContent value='summary'>
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Fund Requests by Location</h3>
                <p className="text-sm text-gray-600">
                  All fund requests for project: {project?.title || 'N/A'}
                </p>
              </div>

              {/* Location Summary Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-gray-800">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border-2 border-gray-800 p-3 text-left font-bold">S/N</th>
                      <th className="border-2 border-gray-800 p-3 text-left font-bold">Location</th>
                      <th className="border-2 border-gray-800 p-3 text-right font-bold">Total Amount</th>
                      <th className="border-2 border-gray-800 p-3 text-left font-bold">Unique Identifier Code</th>
                      <th className="border-2 border-gray-800 p-3 text-center font-bold">Status</th>
                      <th className="border-2 border-gray-800 p-3 text-center font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationGroups.length > 0 ? (
                      locationGroups.map((location, index) => {
                        const currency = location.requests[0]?.currency || 'NGN';
                        const currencySymbol = currency === 'NGN' ? '₦' : '$';
                        const firstRequest = location.requests[0];

                        return (
                          <tr key={index}>
                            <td className="border-2 border-gray-800 p-3 font-semibold">
                              {index + 1}.0
                            </td>
                            <td className="border-2 border-gray-800 p-3 font-bold">
                              {location.locationName}
                            </td>
                            <td className="border-2 border-gray-800 p-3 text-right">
                              {currencySymbol}{location.totalAmount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </td>
                            <td className="border-2 border-gray-800 p-3 font-bold">
                              {location.uniqueIds.join(', ') || 'N/A'}
                            </td>
                            <td className="border-2 border-gray-800 p-3 text-center">
                              <Badge className={getStatusColor(firstRequest?.status)}>
                                {firstRequest?.status?.replace(/_/g, ' ') || 'N/A'}
                              </Badge>
                            </td>
                            <td className="border-2 border-gray-800 p-3 text-center">
                              {firstRequest && (
                                <Link
                                  href={RouteEnum.PROGRAM_FUND_REQUEST_SINGLE_VIEW.replace(
                                    ":id",
                                    firstRequest.id
                                  )}
                                >
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View & Approve
                                  </Button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="border-2 border-gray-800 p-8 text-center text-gray-500">
                          No fund requests found for this project
                        </td>
                      </tr>
                    )}
                    {/* Grand Total Row */}
                    {locationGroups.length > 0 && (
                      <tr className="bg-gray-100 font-bold">
                        <td colSpan={2} className="border-2 border-gray-800 p-3 text-center text-lg">
                          GRAND TOTAL
                        </td>
                        <td className="border-2 border-gray-800 p-3 text-right text-lg">
                          {(locationGroups[0]?.requests[0]?.currency === 'NGN' ? '₦' : '$')}
                          {locationGroups.reduce((sum, loc) => sum + loc.totalAmount, 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td colSpan={3} className="border-2 border-gray-800 p-3"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Approval Tab */}
        <TabsContent value='approval'>
          <FundRequestWorkflowStatus
            fundRequestId={fundRequestId}
            currentStatus={fundRequest.status || "PENDING"}
            canReview={false}
            canLocationReview={permissions.canLocationReview}
            canLocationAuthorize={permissions.canLocationAuthorize}
            canStateReview={permissions.canStateReview}
            canStateAuthorize={permissions.canStateAuthorize}
            canReject={permissions.canReject}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
