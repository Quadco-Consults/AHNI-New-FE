import Card from "components/shared/Card";
import { agreementColumns } from "components/Table/columns/c&g/contract-management/agreement";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllAgreementsQuery } from "services/c&g/contract-management/agreement";

export default function Agreement() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllAgreementsQuery({ page, size: 10 });

    return (
        <section className="space-y-5">
            <h1 className="text-xl font-bold">Agreements</h1>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={agreementColumns}
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
