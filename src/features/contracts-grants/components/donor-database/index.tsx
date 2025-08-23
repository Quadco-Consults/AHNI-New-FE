"use client";

import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import Card from "components/Card";
import { useDebounce } from "ahooks";
import { useGetAllFundingSourcesManager } from "@/features/modules/controllers/project/fundingSourceController";
import { fundingSourceColumns } from "@/features/contracts-grants/components/table-columns/donor-database/funding-source";

export default function DonorDatabase() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data, isLoading: isFetching } = useGetAllFundingSourcesManager({
        page,
        size: 10,
        search: debouncedSearchQuery,
    });

    return (
        <section className="space-y-5">
            <Card>
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={fundingSourceColumns}
                        data={data?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data.pagination.count ?? 0,
                            pageSize: data?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
