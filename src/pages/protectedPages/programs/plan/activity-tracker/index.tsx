import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { useState } from "react";
import DataTable from "components/Table/DataTable";
import { useGetAllActivityTrackerQuery } from "services/programsApi/activity-tracker";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { workPlanTrackercolumns } from "components/Table/columns/program/plan/work-plan-tracker";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Work Plan Tracker", icon: false },
];

export default function ActivityTracker() {
    const [page, setPage] = useState(1);

    const { data: workPlanTracker, isFetching } = useGetAllActivityTrackerQuery(
        {
            page,
            size: 10,
        }
    );

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <Card className="space-y-5">
                <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={workPlanTracker?.data.results || []}
                    columns={workPlanTrackercolumns}
                    isLoading={isFetching}
                    pagination={{
                        total: workPlanTracker?.data.pagination.count ?? 0,
                        pageSize:
                            workPlanTracker?.data.pagination.page_size ?? 0,
                        onChange: (page: number) => setPage(page),
                    }}
                />
            </Card>
        </div>
    );
}
