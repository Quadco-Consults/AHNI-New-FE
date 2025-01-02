import BackNavigation from "atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";

const Agreement = () => {
    return (
        <div>
            <BackNavigation extraText="Agreements" />
            <div className="flex justify-end">
                <Button>
                    <Link to={AdminRoutes.AgrementsCreeate}>
                        Create Agreement
                    </Link>
                </Button>
            </div>
            <TableFilters>
                <DataTable columns={[]} data={[]} />
            </TableFilters>
        </div>
    );
};

export default Agreement;
