import { Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { RouteEnum } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { useGetAllStakeholderRegisterQuery } from "services/programsApi/stakeholder";
import { useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { stakeholderRegisterColumnss } from "components/Table/columns/program/stakeholder-management/stakeholder-register";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Managament", icon: true },
    { name: "Stakeholder Register", icon: false },
];

export default function StakeholderRegisterPage() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 1000,
    });

    const { data, isFetching } = useGetAllStakeholderRegisterQuery({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Link
                    to={
                        RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER_CREATE
                    }
                >
                    <Button className="flex gap-2 py-6">
                        <AddSquareIcon />
                        New Stakeholder Register
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        data={data?.data.results || []}
                        columns={stakeholderRegisterColumnss}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data.pagination.count ?? 0,
                            pageSize: data?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
