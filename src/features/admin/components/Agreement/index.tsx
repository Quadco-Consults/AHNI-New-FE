import Card from "components/Card";
import { agreementColumns } from "@/features/contracts-grants/components/table-columns/contract-management/agreement";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllAgreements } from "@/features/contracts-grants/controllers/agreementController";

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
            <h1 className="text-xl font-bold">Agreements</h1>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={agreementColumns}
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
