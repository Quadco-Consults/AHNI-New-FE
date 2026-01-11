"use client";

import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, BarChart } from "lucide-react";
import { formatNumberCurrency } from "@/utils/utls";

interface DashboardTablesProps {
  projectsData: any;
  fundRequestsData: any;
  realFundRequestAnalytics: {
    totalRequests: number;
    totalRequestedAmount: number;
    statusGroups: Record<string, number>;
    projectGroups: Record<string, number>;
    approvalRate: number;
    rejectionRate: number;
  } | null;
  realProjectsAnalytics: {
    totalProjects: number;
    totalBudget: number;
    statusGroups: Record<string, number>;
    locationGroups: Record<string, number>;
    interventionGroups: Record<string, number>;
    fundingGroups: Record<string, number>;
    thisYear: number;
    thisMonth: number;
    averageBudget: number;
  } | null;
  realFinancialAnalytics: any;
  isLoadingFundRequests: boolean;
  fundRequestsError: any;
  canAccessProgramsFeatures: boolean;
}

export default function DashboardTables({
  projectsData,
  fundRequestsData,
  realFundRequestAnalytics,
  realProjectsAnalytics,
  realFinancialAnalytics,
  isLoadingFundRequests,
  fundRequestsError,
  canAccessProgramsFeatures,
}: DashboardTablesProps) {
  return (
    <>
      {/* Real Projects Data Table */}
      {projectsData?.data?.results && projectsData.data.results.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">Active Projects</h3>
              <p className="text-sm text-gray-600">Real project data from your ERP system</p>
            </div>
            <Button size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View All Projects
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Project</th>
                  <th className="text-left p-3 font-medium">Budget</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Start Date</th>
                </tr>
              </thead>
              <tbody>
                {projectsData.data.results.slice(0, 10).map((project: any, index: number) => (
                  <tr key={project.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{project.title || project.name || `Project ${index + 1}`}</div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">
                          {project.goal || project.description || 'No description available'}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {project.currency === "USD" ? "$" : "₦"}
                        {parseFloat(project.budget || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={project.status === "ACTIVE" ? "default" : "secondary"}>
                        {project.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {project.location && Array.isArray(project.location)
                        ? project.location.slice(0, 2).map((loc: any) => loc.name).join(', ')
                        : 'Not specified'
                      }
                      {project.location && project.location.length > 2 &&
                        <span className="text-xs text-gray-500"> +{project.location.length - 2} more</span>
                      }
                    </td>
                    <td className="p-3 text-gray-600">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {projectsData.data.results.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing 10 of {projectsData.data.results.length} total projects
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Load More Projects
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Fund Requests Data Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Recent Fund Requests</h3>
            <p className="text-sm text-gray-600">
              {isLoadingFundRequests ? "Loading fund request data..." :
               fundRequestsError ? "Error loading fund requests" :
               !canAccessProgramsFeatures ? "Requires Programs access" :
               "Fund request data from your system"}
            </p>
          </div>
          {fundRequestsData?.data?.results?.length > 0 && (
            <Button size="sm" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              View All Requests
            </Button>
          )}
        </div>

        {isLoadingFundRequests ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading fund requests...</span>
          </div>
        ) : fundRequestsError ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-12 h-12 mb-3 text-red-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-red-600 mb-1">Failed to load fund requests</p>
            <p className="text-xs text-gray-500 text-center max-w-64">
              {fundRequestsError?.message || "Please check your connection and try refreshing the page"}
            </p>
          </div>
        ) : !canAccessProgramsFeatures ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-12 h-12 mb-3 text-amber-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-amber-600 mb-1">Access Required</p>
            <p className="text-xs text-gray-500 text-center max-w-64">
              You need Programs department access to view fund requests
            </p>
          </div>
        ) : !fundRequestsData?.data?.results || fundRequestsData.data.results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-12 h-12 mb-3 text-gray-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No fund requests found</p>
            <p className="text-xs text-gray-500 text-center max-w-48">
              Recent fund requests will appear here once they are created
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Request</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Project</th>
                  <th className="text-left p-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {fundRequestsData.data.results.slice(0, 8).map((request: any, index: number) => {
                  return (
                  <tr key={request.id || index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">
                          {request.uuid_code || request.location_code || `REQ-${request.id?.slice(-6) || String(index + 1).padStart(3, '0')}`}
                        </div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">
                          {request.location_display || request.location_name ||
                           (typeof request.location === 'object' && request.location?.name) ||
                           request.title || request.name || 'No location specified'}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {formatNumberCurrency(
                          request.total_amount || request.amount || request.available_balance || request.budget || 0,
                          request.currency || "NGN"
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        request.status?.toLowerCase().includes('approved') ? "default" :
                        request.status?.toLowerCase().includes('pending') ? "secondary" :
                        request.status?.toLowerCase().includes('rejected') ? "destructive" :
                        "outline"
                      }>
                        {request.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-600">
                      {request.project?.name || request.project_name || 'Unassigned'}
                    </td>
                    <td className="p-3 text-gray-600">
                      {request.created_datetime || request.created_at ?
                        new Date(request.created_datetime || request.created_at).toLocaleDateString() :
                        'Unknown'}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Data Sources Information */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-200 rounded-xl flex items-center justify-center">
            <BarChart className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Real Data Dashboard</h3>
            <p className="text-sm text-gray-600 mb-2">
              This dashboard displays live data from your AHNI ERP system endpoints
            </p>
            <div className="flex flex-wrap gap-2">
              {realProjectsAnalytics && (
                <Badge variant="outline" className="bg-white">
                  ✓ Projects API ({realProjectsAnalytics.totalProjects} records)
                </Badge>
              )}
              {realFundRequestAnalytics && (
                <Badge variant="outline" className="bg-white">
                  ✓ Fund Requests API ({realFundRequestAnalytics.totalRequests} records)
                </Badge>
              )}
              {realFinancialAnalytics && (
                <Badge variant="outline" className="bg-white">
                  ✓ Financial Reports API
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        AHNI Real Data Dashboard • Live ERP Analytics • Last refreshed: {new Date().toLocaleString()}
      </div>
    </>
  );
}
