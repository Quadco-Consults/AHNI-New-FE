import BackNavigation from "atoms/BackNavigation";
import { agreementColumns } from "components/Table/columns/admin/agreement";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";

const Lease = () => {
    return (
        <div>
            <BackNavigation extraText="Agreements" />

            <TableFilters>
                <DataTable columns={agreementColumns} data={[]} />
            </TableFilters>
        </div>
    );
};

export default Lease;
