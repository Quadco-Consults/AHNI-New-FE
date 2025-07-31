import Card from "components/shared/Card";
import { useState } from "react";
import DataTable from "components/Table/DataTable";
import {
  useGetAllActivityTrackerQuery,
  useGetSingleActivityTrackerQuery,
} from "services/programsApi/activity-tracker";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { useDebounce } from "ahooks";
import TableFilters from "components/Table/TableFilters";
import { workPlanTrackerDetailscolumns } from "components/Table/columns/program/plan/work-plan-tracker-details";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Programs", icon: true },
  { name: "Plans", icon: true },
  { name: "Work Plan Tracker", icon: true },
  { name: "Work Plan Tracker Details", icon: false },
];

export default function ActivityTracker() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  const debouncedSearchQuery = useDebounce(searchQuery, {
    wait: 1000,
  });

  const { data: workPlanTracker, isFetching } = useGetAllActivityTrackerQuery({
    page,
    size: 10,
    search: debouncedSearchQuery,
  });
  const { data: workPlanTrackerw } = useGetSingleActivityTrackerQuery(
    id ?? skipToken
  );

  console.log({ workPlanTrackerw });

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />
      <Card>
        <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
          <DataTable
            data={workPlanTracker?.data.results || []}
            columns={workPlanTrackerDetailscolumns}
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
