"use client";

import { fuelRequestAssetColumns } from "@/features/admin/components/table-columns/fleet-management/fuel-request-asset";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { useState } from "react";
import { useGetAllAssetsQuery } from "@/features/admin/controllers/assetController";

export default function VehicleFuelRequest() {
    const [page, setPage] = useState(1);

    const { data: asset, isFetching } = useGetAllAssetsQuery({
        page,
        size: 10,
    });

    return (
        <TableFilters>
            <DataTable
                columns={fuelRequestAssetColumns}
                data={asset?.data.results || []}
                isLoading={isFetching}
                pagination={{
                    total: asset?.data.pagination.count ?? 0,
                    pageSize: asset?.data.pagination.page_size ?? 0,
                    onChange: (page: number) => setPage(page),
                }}
            />
        </TableFilters>
    );
}
