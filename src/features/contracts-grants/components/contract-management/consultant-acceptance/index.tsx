"use client";

import { useState } from "react";
import Card from "components/Card";
import { consultancyAcceptanceColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-acceptance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

export default function ConsultancyAcceptance() {
    const [page, setPage] = useState(1);

    const { data, isFetching, error } = useGetAllConsultancyApplicants({
        page,
        size: 10,
        // Remove status filter to see all applicants first
    });

    console.log("ConsultancyAcceptance List - Data:", data);
    console.log("ConsultancyAcceptance List - Error:", error);

    const results = data?.data?.results || [];
    const paginator = data?.data?.pagination;

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
