"use client";

import Card from "components/Card";
import { consultancyReportColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-report";
import { consultantDatabaseColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultant-database";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { usePathname } from "next/navigation";

export default function AdhocDatabase() {
    const pathname = usePathname();

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
