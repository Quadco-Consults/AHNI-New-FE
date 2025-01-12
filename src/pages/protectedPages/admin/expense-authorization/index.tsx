import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { expenseAuthorizationColumns } from "components/Table/columns/admin/expense-authorization";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllExpenseAuthorizationsQuery } from "services/admin/expense-authorization";

export default function ExpenseAuthorizationHomePage() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllExpenseAuthorizationsQuery({
        page,
        size: 10,
    });

    return (
        <div className="space-y-10">
            <div className="flex justify-end">
                <Link to={AdminRoutes.EXPENSE_AUTHORIZATION_CREATE}>
                    <Button>
                        <AddSquareIcon />
                        Add Expense Authorization
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={expenseAuthorizationColumns}
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
