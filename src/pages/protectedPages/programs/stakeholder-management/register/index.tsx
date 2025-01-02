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

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Managament", icon: true },
    { name: "Stakeholder Register", icon: false },
];

export default function StakeholderRegisterPage() {
    const [page, setPage] = useState(1);

    const { data: stakeholderRegister, isLoading } =
        useGetAllStakeholderRegisterQuery({
            page,
            size: 10,
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

            <Card className="space-y-5">
                <div className="flex items-center justify-start gap-2">
                    <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 w-[250px] h-6 border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    data={stakeholderRegister?.data.results || []}
                    columns={stakeholderRegisterColumnss}
                    isLoading={isLoading}
                />
            </Card>
        </div>
    );
}
