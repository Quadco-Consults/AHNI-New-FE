import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useGetAllVehicleMaintenanceQuery } from "services/admin/fleet-management/vehicle-maintenance";
import { vehicleMaintenanceColumns } from "components/Table/columns/admin/fleet-management/vehicle-maintenance";

export default function VehicleMaintenanceHomePage() {
    const [page, setPage] = useState(1);

    const { data: vehicleMaintenance, isFetching } =
        useGetAllVehicleMaintenanceQuery({
            page,
            size: 10,
        });

    return (
        <div>
            <div className="flex justify-end">
                <Link to={AdminRoutes.CREATE_VEHICLE_MAINTENANCE}>
                    <Button>
                        <Plus size={20} />
                        Create New Record
                    </Button>
                </Link>
            </div>
            <div>
                <TableFilters>
                    <DataTable
                        columns={vehicleMaintenanceColumns}
                        data={vehicleMaintenance?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total:
                                vehicleMaintenance?.data.pagination.count ?? 0,
                            pageSize:
                                vehicleMaintenance?.data.pagination.page_size ??
                                0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </div>
        </div>
    );
}
