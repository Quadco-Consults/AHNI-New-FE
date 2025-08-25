"use client";

import BackNavigation from "@/components/BackNavigation";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { vehicleRequestColumns } from "@/features/admin/components/table-columns/fleet-management/vehicle-request";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllVehicleRequestQuery } from "@/features/admin/controllers/vehicleRequestController";

export default function VehicleRequestHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllVehicleRequestQuery({
        page,
        size: 10,
    });

    return (
        <div className="flex flex-col gap-y-7">
            <div className="flex items-center justify-between">
                <BackNavigation extraText="Vehicle Request" />
                <div>
                    <Link href="/dashboard/admin/fleet-management/vehicle-request/create">
                        <Button>
                            <Plus size={20} />
                            New Vehicle Request
                        </Button>
                    </Link>
                </div>
            </div>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={vehicleRequestColumns}
                        data={data?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: data?.data.pagination.count ?? 0,
                            pageSize: data?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
