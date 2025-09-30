"use client";

import { useDebounce } from "ahooks";
import Card from "components/Card";
import { subGrantAwardColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/awards";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";
import { Plus } from "lucide-react";

export default function SubGrantAwards() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isFetching } = useGetAllSubGrants({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    return (
        <section className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Sub-Grant Awards Management</h1>
                <p className="text-gray-600 mt-1">
                    Manage and track awarded sub-grants and sub-grantees
                </p>
            </div>

            <Card>
                <TableFilters onSearchChange={(e) => setSearchQuery(e.target.value)}>
                    <DataTable
                        columns={subGrantAwardColumns}
                        data={data?.data?.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data?.pagination?.count ?? 0,
                            pageSize: data?.data?.pagination?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
