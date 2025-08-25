"use client";

import Card from "components/Card";
import { consultancyReportColumns } from "@/features/contracts-grants/components/table-columns/contract-management/consultancy-report";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllConsultancyReports } from "@/features/contracts-grants/controllers/consultancyReportController";

export default function ConsultancyReport() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllConsultancyReports({
        page,
        size: 10,
    });

    return (
        <section className="space-y-10">
            <div className="flex items-center justify-end">
                <Link href={CG_ROUTES.CREATE_CONSULTANCY_REPORT}>
                    <Button>
                        <Plus size={20} />
                        Add New
                    </Button>
                </Link>
            </div>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={consultancyReportColumns}
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
