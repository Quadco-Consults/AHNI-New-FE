import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import {
  fuelConsumptionColumns,
  fuelConsumptionData,
} from "components/Table/columns/fuel";

const FuelTable = () => {
  return (
    <div>
      <TableFilters>
        <DataTable
          columns={fuelConsumptionColumns}
          data={fuelConsumptionData}
        />
      </TableFilters>
    </div>
  );
};

export default FuelTable;
