import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { fuelConsumptionColumnsOne } from "components/Table/columns/fuel";
import { FC, useMemo } from "react";

import { useGetVehicleFuelRecordQuery } from "services/admin/VehicleRequestApi";

type FuelTableProps = {
    vehicle?: string;
};
const FuelTable: FC<FuelTableProps> = ({ vehicle }) => {
    const { data } = useGetVehicleFuelRecordQuery({
        vehicle,
    });

    const drivedData = useMemo(() => {
        return (
            data?.results.map((item) => {
                return {
                    ...item,
                    // @ts-ignore
                    driver: `${item?.assigned_driver?.first_name}  ${item?.assigned_driver?.last_name}`,
                };
            }) || []
        );
    }, [data?.results]);
    return (
        <div>
            <TableFilters>
                <DataTable
                    columns={fuelConsumptionColumnsOne}
                    data={drivedData}
                />
            </TableFilters>
        </div>
    );
};

export default FuelTable;
