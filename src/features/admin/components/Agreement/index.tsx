import Card from "@/components/Card";
import { adminAgreementColumns } from "./columns";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useGetAllAgreements } from "@/features/contracts-grants/controllers/agreementController";

/**
 * Admin Agreements Page
 * Shows view-only access to all agreements
 * Admin users can only VIEW agreements, not create/edit/delete
 */
export default function Agreement() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetAllAgreements({
        page,
        size: 10,
        search: "",
        status: ""
    });

    console.log("Agreement data:", data);

    return (
        <section className="space-y-5">
            <h1 className="text-xl font-bold">Service Level Agreements (View Only)</h1>
            <p className="text-sm text-gray-600">
                You have view-only access to agreements. To create or edit agreements, go to the Contracts & Grants module.
            </p>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={adminAgreementColumns}
                        data={data?.data.results || []}
                        isLoading={isLoading}
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
