import Card from "components/Card";
import { consultancyAcceptanceColumns } from "components/Table/columns/c&g/contract-management/consultancy-acceptance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/contract-management/consultancy-management/consultant-management";

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
