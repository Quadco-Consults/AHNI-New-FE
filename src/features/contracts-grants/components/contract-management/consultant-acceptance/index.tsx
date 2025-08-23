"use client";

import Card from "components/Card";
import { consultancyAcceptanceColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-acceptance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";

export default function ConsultancyAcceptance() {
    const { data, isFetching } = useGetAllConsultantManagements({
        page: 1,
        size: 1,
        type: "ADHOC",
    });

    return (
        <section className="space-y-10">
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultancyAcceptanceColumns}
                        data={data?.data.results || []}
                        isLoading={isFetching}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
