"use client";
import Card from "components/Card";
import { useState } from "react";
import DataTable from "components/Table/DataTable";
import { useGetAllActivityTracker } from "@/features/programs/controllers/activity-tracker";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { workPlanTrackercolumns } from "@/features/programs/components/table-columns/plan/work-plan-tracker";
import { useDebounce } from "ahooks";
import TableFilters from "components/Table/TableFilters";
import { useGetAllWorkPlan } from "@/features/programs/controllers/workPlanController";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: false },
];

export default function ActivityTracker() {
  const [page, setPage] = useState(1);
  const [searchController, setSearchController] = useState("");

  const debouncedSearchController = useDebounce(searchController, {
    wait: 1000,
  });

  // const { data: workPlanTracker } = useGetAllActivityTracker({
  //   page,
  //   size: 10,
  //   search: debouncedSearchController,
  // });

  const { data: workPlanTracker, isFetching } = useGetAllWorkPlan({
    page,
    size: 10,
    project_title: debouncedSearchController,
  });

  console.log({ workPlanTracker });
  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <Card>
        <TableFilters
          onSearchChange={(e) => setSearchController(e.target.value)}
        >
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
        </TableFilters>
      </Card>
    </div>
  );
}
