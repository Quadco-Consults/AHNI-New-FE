import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { grantColumns } from "components/Table/columns/c&g/grant/grant";
import TableFilters from "components/Table/TableFilters";
import { CG_GROUTES } from "constants/RouterConstants";
import { useGetAllGrantsQuery } from "services/c&g/grant";
import { useState } from "react";
import Card from "components/shared/Card";

export default function GrantHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllGrantsQuery({ page, size: 10 });

    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={CG_GROUTES.GRANT_CREATE}>
                    <Button>
                        <Plus size={20} /> New Grant
                    </Button>
                </Link>
            </div>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={grantColumns}
                        data={data?.data.results || []}
                        isLoading={isFetching}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
