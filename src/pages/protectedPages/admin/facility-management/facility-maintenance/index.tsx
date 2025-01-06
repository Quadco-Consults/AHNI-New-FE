import { facilityMaintenanceColumns } from "components/Table/columns/admin/facility-management/facility-maintenance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllFacilityMaintenanceQuery } from "services/admin/facility-management/facility-maintenance";

export default function FacilityMaintenanceHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllFacilityMaintenanceQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button>
                    <Link to={AdminRoutes.CREATE_FACILITY_MAINTENANCE}>
                        Request Facility Maintenance
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable
                    columns={facilityMaintenanceColumns}
                    data={data?.data.results || []}
                    isLoading={isFetching}
                    pagination={{
                        total: data?.data.pagination.count ?? 0,
                        pageSize: data?.data.pagination.page_size ?? 0,
                        onChange: (page: number) => setPage(page),
                    }}
                />
            </TableFilters>
        </div>
    );
}
