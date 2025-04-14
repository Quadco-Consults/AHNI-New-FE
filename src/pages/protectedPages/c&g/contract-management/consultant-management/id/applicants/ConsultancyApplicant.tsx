import Card from "components/shared/Card";
import { consultantApplicantColumns } from "components/Table/columns/c&g/contract-management/consultant-management/consultant-applicant";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useState } from "react";
import { useGetAllExistingConsultantsQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";

export default function ConsultancyApplicant() {
    const [currentPage, setCurrentPage] = useState(1);

    // const { data, isFetching } = useGetAllExistingConsultantsQuery({
    //     page: currentPage,
    //     size: 10,
    // });

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
