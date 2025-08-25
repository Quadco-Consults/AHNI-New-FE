"use client";
import Link from "next/link";
import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { RouteEnum } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { useGetAllStakeholderRegister } from "@/features/programs/controllers/stakeholderController";
import { useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { stakeholderRegisterColumnss } from "@/features/programs/components/table-columns/stakeholder-management/stakeholder-register";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Managament", icon: true },
    { name: "Stakeholder Register", icon: false },
];

export default function StakeholderRegisterPage() {
    const [page, setPage] = useState(1);
    const [searchController, setSearchController] = useState("");
    const debouncedSearchController = useDebounce(searchController, { wait: 1000 });
    const { data, isFetching, refetch } = useGetAllStakeholderRegister(
        {
            page,
            size: 10,
            search: debouncedSearchController,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );
    // Robust debug logging for API response and table data
    console.log('Full API Response:', data);
    // Use the actual API response shape for table data
    const tableData: any[] = Array.isArray(data?.results) ? data.results : [];
    console.log('Table Data:', tableData);

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Link
                    href="/dashboard/programs/stakeholder-management/stakeholder-register/create"
                >
                    <Button className="flex gap-2 py-6">
                        <AddSquareIcon />
                        New Stakeholder Register
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchController(e.target.value)}
                >
                    {isFetching ? (
                        <div className="py-10 text-center">Loading...</div>
                    ) : tableData.length === 0 ? (
                        <div className="py-10 text-center text-red-500">No stakeholder register data found. Please check API response and mapping.</div>
                    ) : (
                        <DataTable
                            data={tableData}
                            columns={stakeholderRegisterColumnss}
                            isLoading={isFetching}
                            pagination={{
                                total: data?.data?.pagination?.count ?? 0,
                                pageSize: data?.data?.pagination?.page_size ?? 0,
                                onChange: (page: number) => setPage(page),
                            }}
                        />
                    )}
                </TableFilters>
            </Card>
        </div>
    );
}
