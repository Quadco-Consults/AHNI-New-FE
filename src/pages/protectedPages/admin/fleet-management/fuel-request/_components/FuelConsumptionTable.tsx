import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { FC } from "react";

type FuelTableProps = {
    vehicle?: string;
};
const FuelTable: FC<FuelTableProps> = ({ vehicle }) => {
    return (
        <div>
            <TableFilters>
                <DataTable columns={[]} data={[]} />
            </TableFilters>
        </div>
    );
};

export default FuelTable;
