import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

export default function AssetMaintenanceHomePage() {
    return (
        <div className="flex flex-col gap-y-7">
            <div className="flex items-center justify-end">
                <Button>
                    <Link to={AdminRoutes.CREATE_ASSET_MAINTENANCE}>
                        Raise Asset Maintenance Ticket
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable columns={[]} data={[]} />
            </TableFilters>
        </div>
    );
}
