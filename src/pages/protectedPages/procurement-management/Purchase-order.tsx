import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { PlusIcon } from "lucide-react";
import { Checkbox } from "components/ui/checkbox";

import { Input } from "components/ui/input";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import IconButton from "components/shared/IconButton";

import { cn } from "lib/utils";
import { CircleEllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  name: string;
  number: number;
  email: string;
  products: string;
  date: string;
  isSelected: boolean;
};

const data: Data[] = [
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    date: "10/04/2023",
    isSelected: false,
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    date: "10/04/2023",
    isSelected: false,
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    date: "10/04/2023",
    isSelected: false,
  },
  {
    name: "AHNI-010-002-ABJ-2023.",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    date: "10/04/2023",
    isSelected: false,
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    date: "10/04/2023",
    isSelected: false,
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    date: "10/04/2023",
    isSelected: false,
  },
];

const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    size: 50,
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
  },
  {
    header: "Order ID",
    accessorKey: "name",
    size: 250,
  },
  {
    header: "Vendor Name",
    accessorKey: "email",
    size: 250,
  },
  {
    header: "RFQ",
    accessorKey: "number",
    size: 200,
  },
  {
    header: "Date Generated",
    accessorKey: "date",
    cell: ({ getValue }) => {
      return (
        <div className={cn("px-3 py-2 rounded-lg")}>{getValue() as string}</div>
      );
    },
  },
  {
    // header: (
    //   <IconButton>
    //     <CircleEllipsisIcon />
    //   </IconButton>
    // ),
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];
const ActionListAction = ({ data }: any) => {
  console.log(data);
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconButton>
            <CircleEllipsisIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const PurchaseOrder = () => {
  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Link to={generatePath(RouteEnum.PURCHASE_ORDER_NEW)}>
          <Button className="flex items-center gap-x-3">
            <p className="flex h-[20.5px] w-[20.5px] items-center justify-center rounded  bg-white/30">
              <PlusIcon size={14} />
            </p>
            New Purchase Order
          </Button>
        </Link>
      </div>
      <Card className="space-y-5">
        <div>
          <Input type="Search" placeholder="search" className="w-[30%]" />
        </div>

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default PurchaseOrder;
