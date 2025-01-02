import { assestMaintenanceColum } from "components/Table/columns/assetmentainance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

const AssetMaintenance = () => {
    return (
        <div className="flex flex-col gap-y-7">
            <div className="flex items-center justify-end">
                <Button>
                    <Link to={AdminRoutes.FacilitiesTicket}>
                        Create Asset Maintenance Request
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable columns={assestMaintenanceColum} data={[]} />
            </TableFilters>
        </div>
    );
};

export default AssetMaintenance;
