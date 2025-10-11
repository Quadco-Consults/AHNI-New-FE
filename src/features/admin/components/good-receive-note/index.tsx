"use client";

import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import { getPendingGRNColumns } from "@/features/admin/components/table-columns/inventory-management/good-receive-note";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useGetAllGoodReceiveNoteQuery } from "@/features/admin/controllers/goodReceiveNoteController";

export default function GoodReceiveNoteHomePage() {
    const [page, setPage] = useState(1);

    // Fetch all GRNs without status filtering
    const { data: grnData, isFetching: isLoading } = useGetAllGoodReceiveNoteQuery({
        page,
        size: 20,
        status: "", // No status filter - fetch all GRNs
    });

    // Extract results safely
    const allGRNs = grnData?.data?.results || [];

    // Debug logging to verify pagination is working
    console.log('📄 GRN Pagination Working:', {
        currentPage: page,
        totalCount: grnData?.data?.pagination?.count,
        pageSize: grnData?.data?.pagination?.page_size,
        totalPages: grnData?.data?.pagination?.total_pages,
        resultsCount: allGRNs.length,
        showPagination: (grnData?.data?.pagination?.count ?? 0) > 20,
    });

    return (
        <div className="space-y-10">
            <div className="flex justify-end">
                <Link href="/dashboard/admin/good-receive-note/create">
                    <Button>
                        <AddSquareIcon />
                        Add GRN
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={getPendingGRNColumns()}
                        data={allGRNs}
                        isLoading={isLoading}
                        pagination={{
                            total: grnData?.data?.pagination?.count ?? 0,
                            pageSize: 20,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </div>
    );
}
