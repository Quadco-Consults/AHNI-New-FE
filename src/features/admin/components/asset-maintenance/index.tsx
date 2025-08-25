"use client";

import { assetMaintenanceColumn } from "@/features/admin/components/table-columns/asset-maintenance";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllAssetMaintenanceQuery } from "@/features/admin/controllers/assetMaintenanceController";

export default function AssetMaintenanceHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllAssetMaintenanceQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button>
                    <Link href={AdminRoutes.CREATE_ASSET_MAINTENANCE}>
                        Request Asset Maintenance
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable
                    columns={assetMaintenanceColumn}
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
