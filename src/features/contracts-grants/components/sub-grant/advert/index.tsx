"use client";

import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import Card from "components/Card";
import { subGrantAwardColumns } from "@/features/contracts-grants/components/table-columns/sub-grant/awards";
import { useGetAllSubGrants } from "@/features/contracts-grants/controllers/subGrantController";

export default function SubGrantAward() {
    const [page, setPage] = useState(1);

    const [searchQuery, setSearchQuery] = useState("");

    const { data, isFetching, error } = useGetAllSubGrants({
        page,
        size: 10,
    });

    // Debug logging
    console.log("SubGrant API Response:", data);
    console.log("SubGrant Error:", error);
    console.log("SubGrant Loading:", isFetching);
    console.log("SubGrant Results:", data?.data?.results);
    console.log("SubGrant Results Length:", data?.data?.results?.length || 0);

    return (
        <section className="space-y-5">
            <Card>
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">Error loading sub-grant data:</p>
                        <p className="text-red-600 text-sm mt-1">{error.message}</p>
                        {error.message.includes("Backend calculation error") && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-yellow-800 text-xs font-medium">Technical Note:</p>
                                <p className="text-yellow-700 text-xs">This is a backend server issue. Please contact the development team.</p>
                            </div>
                        )}
                    </div>
                )}
                <TableFilters
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                >
                    <DataTable
                        columns={subGrantAwardColumns}
                        data={data?.data?.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data?.paginator?.count ?? 0,
                            pageSize: data?.data?.paginator?.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
