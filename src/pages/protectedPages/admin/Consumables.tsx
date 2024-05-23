import { FC } from "react";
import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { Badge } from "components/ui/badge";
import { Checkbox } from "components/ui/checkbox";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "components/ui/input";
import { Link, generatePath } from "react-router-dom";
import { AdminRoutes, RouteEnum } from "constants/RouterConstants";
import { ColumnDef } from "@tanstack/react-table";
import MoreIcon from "assets/MoreIcon";

interface Vendor {
  name: string;
  number: number;
  email: string;
  products: string;
  status: "Pass" | "Fail" | "Unreviewed";
}

const Consumables: FC = () => {
  const columns: ColumnDef<Vendor>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      ),
    },
    {
      header: "Products",
      accessorKey: "name",
      size: 250,
    },
    {
      header: "Quantity",
      accessorKey: "qty",
      size: 250,
    },
    {
      header: "Expiring Date",
      accessorKey: "date",
      size: 200,
    },
    {
      header: "Avalability",
      accessorKey: "availability",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return (
          <Badge
            className={cn(
              "px-3 py-2 rounded-lg",
              status === "Available" &&
                "bg-green-100 text-green-500 text-green-dark",
              status === "low stock" && "bg-red-100 text-red-400"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      size: 200,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction: FC<{ data: Vendor }> = ({ data }) => {
    return (
      <div className="flex gap-2">
        <MoreIcon />
      </div>
    );
  };

  const data: Vendor[] = [
    {
      name: "Paper",
      qty: "10 Rims",
      date: "N/A",
      availability: "Available",
      category: "Stationary",
      action: "available",
    },
    {
      name: "Paper",
      qty: "10 Rims",
      date: "N/A",
      availability: "low stock",
      category: "Stationary",
      action: "available",
    },

    {
      name: "Paper",
      qty: "10 Rims",
      date: "N/A",
      availability: "Available",
      category: "Stationary",
      action: "available",
    },
    {
      name: "Paper",
      qty: "10 Rims",
      date: "N/A",
      availability: "Available",
      category: "Stationary",
      action: "available",
    },
    {
      name: "Paper",
      qty: "10 Rims",
      date: "N/A",
      availability: "Available",
      category: "Stationary",
      action: "available",
    },
    {
      name: "Paper",
      qty: "10 Rims",
      date: "N/A",
      availability: "Available",
      category: "Stationary",
      action: "available",
    },
  ];

  const tableInstance = useTable<Vendor>({
    data,
    columns,
    getRowId: (row) => row.name,
  });

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
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
              <Icon icon="iconamoon:search-light" fontSize={25} />
              <Input
                placeholder="Search Category"
                type="search"
                className="h-6 border-none bg-none ring-0 active:bg-transparent"
              />
            </div>
          </div>
        </div>
        <Table instance={tableInstance} />
      </Card>
    </div>
  );
};

export default Consumables;
