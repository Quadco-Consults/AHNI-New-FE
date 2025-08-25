"use client";

import Card from "components/Card";
import { useState } from "react";
import DataTable from "components/Table/DataTable";
import {
  // useGetAllActivityTracker,
  useGetSingleActivityTracker,
} from "@/features/programs/controllers/activityTrackerController";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { useDebounce } from "ahooks";
import TableFilters from "components/Table/TableFilters";
import { getWorkPlanTrackerDetailsColumns } from "@/features/programs/components/table-columns/plan/work-plan-tracker-details";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "next/navigation";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { LoadingSpinner } from "components/Loading";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: true },
  { name: "Work Plan Tracker Details", icon: false },
];

export default function ActivityTracker() {
  const [page, setPage] = useState(1);
  const [searchController, setSearchController] = useState("");
  const { id } = useParams();

  const { data, isLoading } = useGetSingleWorkPlan(id ?? skipToken);
  if (isLoading) return <LoadingSpinner />;

  if (!data) return null;

  const { activities } = data.data;

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <Card>
        <TableFilters
          onSearchChange={(e) => setSearchController(e.target.value)}
        >
          <DataTable
            data={activities || []}
            columns={getWorkPlanTrackerDetailsColumns(id as string)}
            isLoading={isLoading}
            pagination={{
              // total: workPlanTracker?.data.pagination.count ?? 0,
              // pageSize: workPlanTracker?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}
