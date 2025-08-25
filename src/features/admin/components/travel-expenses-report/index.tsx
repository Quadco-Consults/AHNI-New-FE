"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/Breadcrumb";
import Link from "next/link";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import { travelExpenseColumn } from "@/features/admin/components/table-columns/travel-expense-report";
import { useGetAllTravelExpensesQuery } from "@/features/admin/controllers/travelExpenseController";

const breadcrumbs = [
    { name: "Admin", icon: true },
    { name: "Travel Expenses Report", icon: false },
];

export default function TravelExpensesReportHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllTravelExpensesQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex justify-end">
                <Link href={AdminRoutes.TRAVEL_EXPENSE_REPORT_CREATE}>
                    <Button className="flex gap-2 py-6 w-40">
                        <AddSquareIcon />
                        Add TER
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
                            className="ml-2 h-6 w-[350px] border-none bg-none focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <DataTable
                    columns={travelExpenseColumn}
                    data={data?.data.results || []}
                    isLoading={isFetching}
                    pagination={{
                        total: data?.data.pagination.count ?? 0,
                        pageSize: data?.data.pagination.page_size ?? 0,
                        onChange: (page: number) => setPage(page),
                    }}
                />
            </Card>
        </div>
    );
}
