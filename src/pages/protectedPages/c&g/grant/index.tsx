import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { grantColumns } from "components/Table/columns/c&g/grant";
import TableFilters from "components/Table/TableFilters";
import { CG_GROUTES } from "constants/RouterConstants";

export default function GrantHomePage() {
    return (
        <section>
            <div className="flex justify-end">
                <Link to={CG_GROUTES.GRANT_CREATE}>
                    <Button>
                        <Plus size={20} /> New Grant
                    </Button>
                </Link>
            </div>
            <TableFilters>
                <DataTable columns={grantColumns} data={[]} isLoading={false} />
            </TableFilters>
        </section>
    );
}
