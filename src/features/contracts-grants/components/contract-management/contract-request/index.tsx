"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import DataTable from "components/Table/DataTable";
import { Plus, Search, Filter } from "lucide-react";
import { contractRequestColumns } from "@/features/contracts-grants/components/table-columns/contract-management/contract-request";
import { useGetAllContractRequests } from "@/features/contracts-grants/controllers/contractController";
import { CG_ROUTES } from "constants/RouterConstants";
import { usePermissions } from "@/hooks/usePermissions";

export default function ContractRequest() {
  const router = useRouter();
  const { user } = usePermissions();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [clientUser, setClientUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);

    // Get current user from localStorage as fallback (client-side only)
    const getCurrentUser = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          return JSON.parse(userData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }

      // Return null if no user data found
      return null;
    };

    setClientUser(getCurrentUser());

    // Clear any cached contract request data to force fresh fetch with user filter
    queryClient.invalidateQueries({
      queryKey: ["contractRequests"],
      exact: false
    });
  }, [queryClient]);

  // Use user from permissions hook, fallback to localStorage, but only on client
  const currentUser = isClient ? (user || clientUser) : null;

  console.log('🔍 CONTRACT REQUEST USER FILTERING:', {
    isClient,
    permissionsUser: user?.id,
    clientUser: clientUser?.id,
    currentUserId: currentUser?.id,
    userEmail: currentUser?.email,
    willFilterByUser: !!currentUser?.id,
    filterParameter: currentUser?.id,
    context: 'contract_request_listing'
  });

  const { data, isFetching, isStale } = useGetAllContractRequests({
    page,
    size: 20,
    search,
    status,
    created_by: currentUser?.id, // Filter by current user
    enabled: isClient && !!currentUser?.id, // Only fetch when we have user data
  });

  // Debug cache vs fresh data
  console.log('🔍 API CALL STATUS:', {
    isClient,
    hasUser: !!currentUser?.id,
    enabledCondition: isClient && !!currentUser?.id,
    isFetching,
    isStale,
    hasData: !!data,
    dataSource: data ? 'cache_or_fresh' : 'no_data'
  });

  // Enhanced debug logging for the API response
  console.log('🔍 CONTRACT REQUEST API RESPONSE DETAILS:', {
    hasData: !!data,
    resultsCount: data?.data?.results?.length || 0,
    totalCount: data?.data?.paginator?.count || 0,
    isFiltered: !!currentUser?.id,
    expectedUserId: currentUser?.id,
    actualCreatorIds: data?.data?.results?.map(item => ({
      id: item.id,
      title: item.title,
      createdById: item.created_by,
      createdByName: item.created_by_detail?.full_name || item.created_by_detail?.first_name + ' ' + item.created_by_detail?.last_name
    })) || [],
    context: 'contract_request_table_data'
  });

  // Debug the API response to see what user detail fields are returned
  console.log('🔍 CONTRACT REQUEST API RESPONSE:', {
    hasData: !!data,
    resultsCount: data?.data?.results?.length || 0,
    sampleRecord: data?.data?.results?.[0] || null,
    userDetailFields: data?.data?.results?.[0] ? {
      current_reviewer_detail: data.data.results[0].current_reviewer_detail,
      authorizer_detail: data.data.results[0].authorizer_detail,
      approver_detail: data.data.results[0].approver_detail,
      current_reviewer: data.data.results[0].current_reviewer,
      authorizer: data.data.results[0].authorizer,
      approver: data.data.results[0].approver,
    } : null,
    context: 'contract_request_table_data'
  });

  // Show loading state while waiting for user data
  if (!isClient || !currentUser) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Contract Requests</h1>
            <p className="text-gray-600">Loading your contract requests...</p>
          </div>
        </div>
        <Card className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading user data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Contract Requests</h1>
          <p className="text-gray-600">View and manage your contract requests</p>
        </div>
        <Button onClick={() => router.push(CG_ROUTES.CREATE_CONTRACT_REQUEST)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Contract Request
        </Button>
      </div>

      {/* User Context and Filters */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Showing requests created by:</span> {currentUser.first_name} {currentUser.last_name} ({currentUser.email})
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contract requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="AUTHORIZED">Authorized</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        <DataTable
          columns={contractRequestColumns}
          data={data?.data?.results || []}
          isLoading={isFetching}
          pagination={{
            total: data?.data?.paginator?.count || 0,
            pageSize: 20,
            onChange: setPage,
          }}
        />
      </Card>
    </div>
  );
}
