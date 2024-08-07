import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { fuelConsumptionColumns } from "components/Table/columns/fuel";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetVehicleFuelRecordQuery } from "services/adminApi/VehicleRequestApi";

const FuelConsumption = () => {
  const { data } = useGetVehicleFuelRecordQuery({});

  const drivedData = useMemo(() => {
    return data?.results || [];
  }, [data?.results]);

  return (
    <div>
      <div className="flex justify-end ">
        <Button>
          <Link to={AdminRoutes.FuelCreate}>Create New Record</Link>
        </Button>
      </div>
      <TableFilters>
        <DataTable columns={fuelConsumptionColumns} data={drivedData} />
      </TableFilters>
    </div>
  );
};

export default FuelConsumption;
