import Card from "components/shared/Card";
import { consultancyReportColumns } from "components/Table/columns/c&g/contract-management/consultancy-report";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AdhocDatabase() {
    const { pathname } = useLocation();

    const type = pathname.includes("adhoc") ? "ADHOC" : "CONSULTANT";

    return (
        <section className="space-y-10">
            <div className="flex items-center justify-end">
                <Link to="/">
                    <Button>
                        <Plus size={20} />
                        Add New
                    </Button>
                </Link>
            </div>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultancyReportColumns}
                        data={[]}
                        isLoading={false}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
