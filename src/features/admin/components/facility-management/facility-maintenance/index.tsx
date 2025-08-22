import { facilityMaintenanceColumns } from "@/features/admin/components/table-columns/facility-management/facility-maintenance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllFacilityMaintenance } from "@/features/admin/controllers/facilityMaintenanceController";

export default function FacilityMaintenanceHomePage() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetAllFacilityMaintenance({
        page,
        size: 10,
        search: "",
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button>
                    <Link href={AdminRoutes.CREATE_FACILITY_MAINTENANCE}>
                        Request Facility Maintenance
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable
                    columns={facilityMaintenanceColumns}
                    data={data?.data.results || []}
                    isLoading={isLoading}
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
