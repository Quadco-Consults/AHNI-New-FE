import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { paymentRequestColumns } from "components/Table/columns/admin/payment-request";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { useGetAllPaymentRequestsQuery } from "services/admin/payment-request";

export default function PaymentRequestHome() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllPaymentRequestsQuery({
        page,
        size: 10,
    });

    return (
        <>
            <div className="flex justify-end">
                <Link
                    to={generatePath(
                        AdminRoutes.CREATE_PAYMENT_REQUEST_SUMMARY
                    )}
                >
                    <Button>
                        <Plus size={20} /> Raise Payment Request
                    </Button>
                </Link>
            </div>

            <Card className="mt-10">
                <TableFilters>
                    <DataTable
                        columns={paymentRequestColumns}
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
        </>
    );
}
