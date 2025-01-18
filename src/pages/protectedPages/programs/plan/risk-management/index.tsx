import { Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { RouteEnum } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { useGetAllRiskManagementPlansQuery } from "services/programsApi/risk-plans";
import { useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { riskManagementPlanColumns } from "components/Table/columns/program/plan/risk-management-plan";
import TableFilters from "components/Table/TableFilters";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Risk Management Plan", icon: false },
];

export default function RiskManagementPage() {
    const [page, setPage] = useState(1);

    const { data: riskManagementPlan, isFetching } =
        useGetAllRiskManagementPlansQuery({
            page,
            size: 10,
        });

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Link to={RouteEnum.PROGRAM_RISK_MANAGEMENT_CREATE}>
                    <Button className="flex gap-2 py-6">
                        <AddSquareIcon />
                        New Risk Management
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        data={riskManagementPlan?.data.results || []}
                        columns={riskManagementPlanColumns}
                        isLoading={isFetching}
                        pagination={{
                            total:
                                riskManagementPlan?.data.pagination.count ?? 0,
                            pageSize:
                                riskManagementPlan?.data.pagination.page_size ??
                                0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
