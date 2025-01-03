import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { goodReceiveNoteColumns } from "components/Table/columns/admin/inventory-management/good-receive-note";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

export default function GoodReceiveNoteHomePage() {
    return (
        <div className="space-y-10">
            <div className="flex justify-end">
                <Link to={AdminRoutes.GRN_CREATE}>
                    <Button>
                        <AddSquareIcon />
                        Add GRN
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable data={[]} columns={goodReceiveNoteColumns} />
                </TableFilters>
            </Card>
        </div>
    );
}
