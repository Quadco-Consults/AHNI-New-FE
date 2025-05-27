import Card from "components/shared/Card";
import { contractRequestColumns } from "components/Table/columns/c&g/contract-management/contract-request";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContractRequest() {
    return (
        <section className="space-y-10">
            <div className="flex justify-end">
                <Link to={CG_ROUTES.CREATE_CONTRACT_REQUEST}>
                    <Button>
                        <Plus size={20} />
                        Create Contract Request
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={contractRequestColumns}
                        data={[]}
                        isLoading={false}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
