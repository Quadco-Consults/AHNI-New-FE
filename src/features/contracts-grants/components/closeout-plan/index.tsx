import Card from "components/Card";
import { closeOutPlanColumns } from "components/Table/columns/c&g/closeout-plan/closeout-plan";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllCloseOutPlans } from "@/features/contracts-grants/controllers/closeout-planController";

export default function CloseOutPlan() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllCloseOutPlans({
        page,
        size: 10,
    });

    return (
        <section className="space-y-10">
            <div className="flex justify-end">
                <Link href={CG_ROUTES.NEW_CLOSE_OUT_PLAN}>
                    <Button size="lg">
                        <PlusIcon />
                        New Plan
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={closeOutPlanColumns}
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
