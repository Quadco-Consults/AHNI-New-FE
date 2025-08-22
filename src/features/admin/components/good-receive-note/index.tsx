import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import { goodReceiveNoteColumns } from "components/Table/columns/admin/inventory-management/good-receive-note";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import Link from "next/link";
import { useGetAllGoodReceiveNoteQuery } from "@/features/admin/controllers/goodReceiveNoteController";

export default function GoodReceiveNoteHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllGoodReceiveNoteQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-10">
            <div className="flex justify-end">
                <Link href={AdminRoutes.GRN_CREATE_SUMMARY}>
                    <Button>
                        <AddSquareIcon />
                        Add GRN
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={goodReceiveNoteColumns}
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
