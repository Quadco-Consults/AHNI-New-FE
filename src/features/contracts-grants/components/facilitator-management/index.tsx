"use client";

import Card from "components/Card";
import { facilitatorManagementColumns } from "@/features/contracts-grants/components/table-columns/facilitator-management/facilitator-management";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllFacilitators } from "@/features/contracts-grants/controllers/facilitatorManagementController";

export default function FacilitatorManagement() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllFacilitators({
        page,
        size: 10,
    });

    return (
        <section className="space-y-10">
            <div className="flex justify-end">
                <Link href="/dashboard/c-and-g/facilitator-management/create/application-details">
                    <Button size="lg">
                        <PlusIcon />
                        New Facilitator
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={facilitatorManagementColumns}
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
        </section>
    );
}