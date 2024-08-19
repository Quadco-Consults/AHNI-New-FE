import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { fuelConsumption, IFuelVehicle } from "components/Table/columns/fuel";
import { useMemo } from "react";
import { useGetAssetsQuery } from "services/adminApi/assetsApi";

const FuelConsumption = () => {
  // const { data } = useGetVehicleFuelRecordQuery({});

  const { data } = useGetAssetsQuery({
    classification: "Vehicle",
  });

  const drivedData = useMemo(() => {
    return data?.results.map((item) => {
      return {
        condition: item.asset_condition.description,
        name: item.asset_type.name,
        manufacturer: item.asset_type.manufacturer,
        model: item.asset_type.model,
        implementer: item.implementer.name,
        id: item.id,
      };
    }) as IFuelVehicle[];
  }, [data?.results]);

  return (
    <div>
      <TableFilters>
        <DataTable columns={fuelConsumption} data={drivedData || []} />
      </TableFilters>
    </div>
  );
};

export default FuelConsumption;
