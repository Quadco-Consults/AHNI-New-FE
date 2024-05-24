import { FC } from "react";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Link, generatePath } from "react-router-dom";
import { AdminRoutes } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import {
  consumableColums,
  consumablesData,
} from "components/Table/columns/consumables";
import TableFilters from "components/Table/TableFilters";

const Consumables: FC = () => {
  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          <div className="flex justify-end">
            <Link to={generatePath(AdminRoutes.CREateConsumables)}>
              <Button>
                <span>
                  <Plus size={20} />
                </span>
                Add Item
              </Button>
            </Link>
          </div>
        </div>
        <TableFilters>
          <DataTable data={consumablesData} columns={consumableColums} />
        </TableFilters>
      </Card>
    </div>
  );
};

export default Consumables;
