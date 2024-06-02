import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import {
  vehicleRequestColumns,
  vehicleRequestData,
} from "components/Table/columns/vehicleRequest";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, generatePath, useNavigate } from "react-router-dom";

const VehicleRequest = () => {
  const navigate = useNavigate();

  const onRowClick = () => {
    navigate(AdminRoutes.ViewVehicleRequest);
  };
  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex items-center justify-between">
        <BackNavigation extraText="Vehicle Request" />
        <div></div>
        <div>
          <Link to={generatePath(AdminRoutes.NewVehicleRequest)}>
            <Button>
              <span>
                <Plus size={20} />
              </span>
              Vehicle Request
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <TableFilters>
          <DataTable
            onRowClick={onRowClick}
            columns={vehicleRequestColumns}
            data={vehicleRequestData}
          />
        </TableFilters>
      </div>
    </div>
  );
};

export default VehicleRequest;
