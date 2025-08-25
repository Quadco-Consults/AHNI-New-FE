"use client";

import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useGetAllVehicleMaintenanceQuery } from "@/features/admin/controllers/vehicleMaintenanceController";
import { vehicleMaintenanceColumns } from "@/features/admin/components/table-columns/fleet-management/vehicle-maintenance";
import Card from "@/components/Card";

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
                <Link href="/dashboard/admin/fleet-management/vehicle-maintenance/create">
                    <Button>
                        <Plus size={20} />
                        Create New Record
                    </Button>
                </Link>
            </div>
            <Card className="mt-10">
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
            </Card>
        </div>
    );
}
