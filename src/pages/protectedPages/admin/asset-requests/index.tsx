import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { assestRequestColum } from "components/Table/columns/admin/inventory-management/asset-request";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

export default function AssestRequestTable() {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link to={AdminRoutes.ASSETS_REQUEST_CREATE}>
                    <Button>
                        <AddSquareIcon /> Asset Request
                    </Button>
                </Link>
            </div>
            <Card className="space-y-6">
                <TableFilters>
                    <DataTable columns={assestRequestColum} data={[]} />
                </TableFilters>
            </Card>
        </div>
    );
}
