"use client";

import { useState } from "react";
import Card from "components/Card";
import { consultancyAcceptanceColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-acceptance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";

export default function ConsultancyAcceptance() {
    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllConsultantManagements({
        page,
        size: 10,
        type: "CONSULTANT", // Changed from "ADHOC" to "CONSULTANT" to match consultant acceptance
    });

    console.log("ConsultancyAcceptance List - Data:", data);
    console.log("ConsultancyAcceptance List - Error:", error);

    const results = data?.data?.results || [];
    const paginator = data?.data?.paginator;

    return (
        <section className="space-y-10">
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultancyAcceptanceColumns}
                        data={results}
                        isLoading={isFetching}
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
