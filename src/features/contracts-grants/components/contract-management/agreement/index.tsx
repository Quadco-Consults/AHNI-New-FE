"use client";

import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { agreementColumns } from "@/features/contracts-grants/components/table-columns/contract-management/agreement";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllAgreements } from "@/features/contracts-grants/controllers/agreementController";

export default function Agreement() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllAgreements({ page, size: 10 });

    return (
        <section>
            <div className="flex items-center justify-between">
                <BackNavigation extraText="Agreements" />
                <Link href={CG_ROUTES.CREATE_AGREEMENT}>
                    <Button>
                        <Plus size={20} />
                        Create Agreement
                    </Button>
                </Link>
            </div>
            <Card>
                <TableFilters>
                    <DataTable
                        columns={agreementColumns}
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
