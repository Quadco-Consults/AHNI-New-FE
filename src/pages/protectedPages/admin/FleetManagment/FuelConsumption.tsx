import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";

const FuelConsumption = () => {
    return (
        <div>
            <TableFilters>
                <DataTable columns={[]} data={[]} />
            </TableFilters>
        </div>
    );
};

export default FuelConsumption;
