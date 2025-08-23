"use client";

import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { assestRequestColum } from "@/features/admin/components/table-columns/inventory-management/asset-request";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useGetAllAssetRequestsQuery } from "@/features/admin/controllers/assetRequestController";

export default function AssestRequestTable() {
    const [page, setPage] = useState(1);

    const { data: assetRequest, isFetching } = useGetAllAssetRequestsQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link href="/dashboard/admin/asset-request/create">
                    <Button>
                        <AddSquareIcon /> Asset Request
                    </Button>
                </Link>
            </div>
            <Card className="space-y-6">
                <TableFilters>
                    <DataTable
                        columns={assestRequestColum}
                        data={assetRequest?.data.results || []}
                        isLoading={isFetching}
                        pagination={{
                            total: assetRequest?.data.pagination.count ?? 0,
                            pageSize:
                                assetRequest?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
