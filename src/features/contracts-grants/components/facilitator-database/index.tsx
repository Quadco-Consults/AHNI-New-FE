"use client";

import Card from "components/Card";
import { consultantDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-database";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllFacilitators } from "@/features/contracts-grants/controllers/facilitatorManagementController";

export default function FacilitatorDatabase() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetAllFacilitators({
        page,
        size: 10,
    });

    const results = data?.data?.results || [];
    const paginator = data?.data?.paginator;

    return (
        <section className="space-y-10">
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultantDatabaseColumns}
                        data={results}
                        isLoading={isLoading}
                        pagination={{
                            total: paginator?.count || 0,
                            pageSize: paginator?.page_size || 10,
                            onChange: setPage,
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}