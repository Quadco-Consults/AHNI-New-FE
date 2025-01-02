import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { vehicleRequestColumns } from "components/Table/columns/vehicleRequest";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";

export default function VehicleRequestHomePage() {
    return (
        <div className="flex flex-col gap-y-7">
            <div className="flex items-center justify-between">
                <BackNavigation extraText="Vehicle Request" />
                <div></div>
                <div>
                    <Link to={generatePath(AdminRoutes.NewVehicleRequest)}>
                        <Button>
                            <Plus size={20} />
                            New Vehicle Request
                        </Button>
                    </Link>
                </div>
            </div>
            <div>
                <TableFilters>
                    <DataTable
                        columns={vehicleRequestColumns}
                        data={[]}
                        isLoading={false}
                    />
                </TableFilters>
            </div>
        </div>
    );
}
