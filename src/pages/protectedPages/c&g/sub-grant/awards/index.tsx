import AddSquareIcon from "components/icons/AddSquareIcon";
import { subGrantAwardColumns } from "components/Table/columns/c&g/sub-grant/awards";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import { Link } from "react-router-dom";

export default function SubGrant() {
    return (
        <section>
            <div className="flex justify-end">
                <Link to={CG_GROUTES.CREATE_SUBGRANT_AWARD}>
                    <Button>
                        <AddSquareIcon />
                        New Sub Grant
                    </Button>
                </Link>
            </div>
            <TableFilters>
                <DataTable
                    columns={subGrantAwardColumns}
                    data={[]}
                    isLoading={false}
                />
            </TableFilters>
        </section>
    );
}
