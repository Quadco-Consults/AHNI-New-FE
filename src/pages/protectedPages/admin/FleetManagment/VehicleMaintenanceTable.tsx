import { assestMaintenanceColum } from "components/Table/columns/assetmentainance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

const VehicleMaintenanceTable = () => {
    return (
        <div>
            <div className="flex justify-end">
                <Button>
                    <Link to={AdminRoutes.VehicleMaitenanceCreate}>
                        Create New Record
                    </Link>
                </Button>
            </div>
            <div>
                <TableFilters>
                    <DataTable columns={assestMaintenanceColum} data={[]} />
                </TableFilters>
            </div>
        </div>
    );
};

export default VehicleMaintenanceTable;
