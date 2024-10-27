import { ColumnDef } from "@tanstack/react-table";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { AdminRoutes } from "constants/RouterConstants";
import { generatePath, Link } from "react-router-dom";

const ItemRequisition = () => {
  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Link to={AdminRoutes.CREATE_ITEM_REQUISITION}>
          <Button>
            <AddSquareIcon />
            Add Item Requisition
          </Button>
        </Link>
      </div>

      <Card>
        <TableFilters>
          <DataTable data={[]} columns={columns} />
        </TableFilters>
      </Card>
    </div>
  );
};

export default ItemRequisition;

type TItemRequisition = {
  name: string;
};

const columns: ColumnDef<TItemRequisition>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Item Requested",
    accessorKey: "item",
  },
  {
    header: "Quantity Requested",
    accessorKey: "quantity",
    size: 250,
  },
  {
    header: "Department/Unit",
    accessorKey: "department",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Approved by",
    accessorKey: "approval",
  },
  {
    header: "Date Requested",
    accessorKey: "date",
  },
  {
    header: "",
    accessorKey: "actions",
    size: 80,
    cell: () => {
      return <ActionList />;
    },
  },
];

const ActionList = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex gap-2 py-6">
          <MoreOptionsHorizontalIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="flex flex-col items-start justify-between gap-1">
          <Link
            to={generatePath(AdminRoutes.ITEM_REQUISITION_DETAIL, {
              id: 1,
            })}
          >
            <Button
              className="w-full flex items-center justify-start gap-2"
              variant="ghost"
            >
              <EyeIcon />
              View
            </Button>
          </Link>
          <Button
            className="w-full flex items-center justify-start gap-2"
            variant="ghost"
          >
            <DeleteIcon />
            delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
