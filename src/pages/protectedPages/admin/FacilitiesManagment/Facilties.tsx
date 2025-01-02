import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { maintenanceColumns } from "components/Table/columns/facilities";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const Facilties = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button>
                    <Link to={AdminRoutes.FacilitiesTicket}>
                        Request Maintenance Ticket
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable data={[]} columns={[]} />
            </TableFilters>
        </div>
    );
};

export default Facilties;
