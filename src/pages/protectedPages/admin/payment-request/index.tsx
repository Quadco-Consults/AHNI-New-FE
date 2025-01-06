import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";

export default function PaymentRequestHome() {
    return (
        <>
            <div className="flex justify-end">
                <Link to={generatePath(AdminRoutes.CREATE_PAYMENT_REQUEST)}>
                    <Button>
                        <Plus size={20} /> Raise Payment Request
                    </Button>
                </Link>
            </div>

            <Card className="mt-10">
                <TableFilters>
                    <DataTable columns={[]} data={[]} isLoading={false} />
                </TableFilters>
            </Card>
        </>
    );
}
