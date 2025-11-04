"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { LoadingSpinner } from "components/Loading";
import BreadcrumbCard from "components/Breadcrumb";
import DataTable from "components/Table/DataTable";
import Pagination from "components/Pagination";
import { Input } from "components/ui/input";
import { Search, Plus, FileDown, Upload } from "lucide-react";
import { RouteEnum } from "constants/RouterConstants";

import {
  SiteVisitStatus,
  SiteVisitStatusLabels,
  SiteVisitType,
  SiteVisitTypeLabels,
  TSiteVisitPaginatedData,
} from "@/features/programs/types/site-visit";

import { useGetAllSiteVisits } from "@/features/programs/controllers/siteVisitController";

const SiteVisitList = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch site visits data
  const { data: siteVisits, isFetching, error } = useGetAllSiteVisits({
    page,
    size: 20,
    search,
    enabled: true,
  });

  const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Site Visit", icon: false },
  ];

  const getStatusBadge = (status: SiteVisitStatus) => {
    const statusConfig = {
      [SiteVisitStatus.DRAFT]: "bg-gray-100 text-gray-800",
      [SiteVisitStatus.SUBMITTED]: "bg-blue-100 text-blue-800",
      [SiteVisitStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
      [SiteVisitStatus.REVIEWED]: "bg-purple-100 text-purple-800",
      [SiteVisitStatus.AUTHORIZED]: "bg-indigo-100 text-indigo-800",
      [SiteVisitStatus.APPROVED]: "bg-green-100 text-green-800",
      [SiteVisitStatus.REJECTED]: "bg-red-100 text-red-800",
      [SiteVisitStatus.EA_CREATED]: "bg-emerald-100 text-emerald-800",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[status]}`}>
        {SiteVisitStatusLabels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: SiteVisitType) => {
    const typeConfig = {
      [SiteVisitType.SUPPORTIVE_SUPERVISION]: "bg-blue-100 text-blue-800",
      [SiteVisitType.INTEGRATED_SUPPORTIVE_SUPERVISION]: "bg-purple-100 text-purple-800",
      [SiteVisitType.EMERGENCY_SUPERVISION]: "bg-red-100 text-red-800",
      [SiteVisitType.STAKEHOLDER_ENGAGEMENT]: "bg-green-100 text-green-800",
      [SiteVisitType.OTHERS]: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${typeConfig[type]}`}>
        {SiteVisitTypeLabels[type]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (item: TSiteVisitPaginatedData) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-gray-500">{item.location}</div>
        </div>
      ),
    },
    {
      key: "site_visit_type",
      label: "Type",
      render: (item: TSiteVisitPaginatedData) => getTypeBadge(item.site_visit_type),
    },
    {
      key: "proposed_dates",
      label: "Proposed Dates",
      render: (item: TSiteVisitPaginatedData) => (
        <div className="text-sm">
          <div>{formatDate(item.proposed_start_date)}</div>
          <div className="text-gray-500">to {formatDate(item.proposed_end_date)}</div>
        </div>
      ),
    },
    {
      key: "team_members",
      label: "Team Size",
      render: (item: TSiteVisitPaginatedData) => (
        <span className="text-sm">{item.team_members_count} members</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: TSiteVisitPaginatedData) => getStatusBadge(item.status),
    },
    {
      key: "created_by",
      label: "Created By",
      render: (item: TSiteVisitPaginatedData) => (
        <div className="text-sm">
          <div>{item.created_by}</div>
          <div className="text-xs text-gray-500">{formatDate(item.created_datetime)}</div>
        </div>
      ),
    },
  ];

  const handleCreateNew = () => {
    router.push(`${RouteEnum.PROGRAM_SITE_VISIT}/create` || "/dashboard/programs/plan/site-visit/create");
  };

  const handleRowClick = (item: TSiteVisitPaginatedData) => {
    router.push(`${RouteEnum.PROGRAM_SITE_VISIT}/${item.id}` || `/dashboard/programs/plan/site-visit/${item.id}`);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export site visits");
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log("Import site visits");
  };

  return (
    <div className="p-6">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Site Visit Applications</h1>
            <p className="text-gray-600 mt-1">
              Manage site visit applications and approvals
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <FileDown size={16} />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Import
            </Button>
            <Button
              onClick={handleCreateNew}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              New Application
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search site visits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* TODO: Add filter dropdowns for status, type, date range */}
          </div>
        </div>

        {/* Data Table */}
        {isFetching ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>Error loading site visits</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={siteVisits?.data?.results || []}
              onRowClick={handleRowClick}
              emptyState={{
                title: "No site visits found",
                description: "No site visit applications have been created yet.",
                action: (
                  <Button onClick={handleCreateNew} className="mt-4">
                    Create First Application
                  </Button>
                ),
              }}
            />

            {/* Pagination */}
            {siteVisits?.data?.results && siteVisits.data.results.length > 0 && (
              <div className="mt-6">
                <Pagination
                  total={siteVisits?.data?.pagination?.count ?? 0}
                  itemsPerPage={siteVisits?.data?.pagination?.page_size ?? 20}
                  onChange={(newPage: number) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SiteVisitList;