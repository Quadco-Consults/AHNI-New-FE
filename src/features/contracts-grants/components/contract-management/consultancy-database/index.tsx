import Card from "components/Card";
import { consultancyReportColumns } from "components/Table/columns/c&g/contract-management/consultancy-report";
import { consultantDatabaseColumns } from "components/Table/columns/c&g/contract-management/consultant-database";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Link, useLocation } 

export default function AdhocDatabase() {
    const { pathname } = useLocation();

    const type = pathname.includes("adhoc") ? "ADHOC" : "CONSULTANT";

    return (
        <section className="space-y-10">
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultantDatabaseColumns}
                        data={[]}
                        isLoading={false}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
