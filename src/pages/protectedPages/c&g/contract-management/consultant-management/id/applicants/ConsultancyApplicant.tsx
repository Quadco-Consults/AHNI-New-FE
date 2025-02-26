import Card from "components/shared/Card";
import { consultantApplicantColumns } from "components/Table/columns/c&g/contract-management/consultant-management/consultant-applicant";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";

export default function ConsultancyApplicant() {
    const [page, setPage] = useState(1);

    return (
        <section className="space-y-5">
            <h1 className="text-xl font-bold">Submitted Applications</h1>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultantApplicantColumns}
                        data={[]}
                        isLoading={false}
                        // pagination={{
                        //     total: data?.data.pagination.count ?? 0,
                        //     pageSize: data?.data.pagination.page_size ?? 0,
                        //     onChange: (page: number) => setPage(page),
                        // }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
