"use client";
import Card from "@/components/Card";
import { useState } from "react";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { workPlanTrackercolumns } from "@/features/programs/components/table-columns/plan/work-plan-tracker";
import { useDebounce } from "ahooks";
import { useGetAllWorkPlan } from "@/features/programs/controllers/workPlanController";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: false },
];

export default function ActivityTracker() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  const { data: workPlanTracker, isFetching } = useGetAllWorkPlan({
    page,
    size: 10,
    project_title: debouncedSearchQuery,
  });

  const hasActiveFilters = searchQuery;

  const clearAllFilters = () => {
    setSearchQuery("");
  };

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      {/* Header Section */}
      <Card className="p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Plan Activity Tracker</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and monitor activity implementation progress across all work plans. Select a work plan to view detailed activity tracking information.
          </p>
        </div>
      </Card>

      {/* Filters and Table Section */}
      <Card>
        {/* Unified Filters Section */}
        <div className="p-6 border-b bg-gray-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Filters
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="max-w-md">
              {/* Search Filter */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-xs font-medium text-gray-700">
                  Search Work Plans
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by project name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <DataTable
            data={workPlanTracker?.data.results || []}
            columns={workPlanTrackercolumns}
            isLoading={isFetching}
            pagination={{
              total: workPlanTracker?.data.pagination.count ?? 0,
              pageSize: workPlanTracker?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </div>
      </Card>
    </div>
  );
}
