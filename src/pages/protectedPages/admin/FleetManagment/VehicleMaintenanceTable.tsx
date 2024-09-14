import { assestMaintenanceColum } from "components/Table/columns/assetmentainance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetAssetMaintenanceRequestsQuery } from "services/adminApi/assetMaintenance";

const VehicleMaintenanceTable = () => {
  const { data } = useGetAssetMaintenanceRequestsQuery({
    page: 1,
    page_size: 10,
    classification: "Vehicle",
  });

  const drivedData = useMemo(() => {
    return (
      data?.results.map((item) => ({
        ...item,
        //   @ts-ignore
        asset: item.asset.asset_type,
      })) || []
    );
  }, [data?.results]);
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
          <DataTable columns={assestMaintenanceColum} data={drivedData} />
        </TableFilters>
      </div>
    </div>
  );
};

export default VehicleMaintenanceTable;
