import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { PlusIcon } from "lucide-react";
import useTable from "hooks/useTable";
import { Checkbox } from "components/ui/checkbox";

import { Input } from "components/ui/input";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import IconButton from "components/shared/IconButton";

import { cn } from "lib/utils";
import Table from "lib/react-table/Table";
import { CircleEllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";

const data = [
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    date: "10/04/2023",
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    date: "10/04/2023",
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    date: "10/04/2023",
  },
  {
    name: "AHNI-010-002-ABJ-2023.",
    number: +2348071234567,
    email: "contact@medsupplies.com.ng",
    products: "MEDICAL EQUIPMENT, SURGICAL TOOLS",
    date: "10/04/2023",
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348092345678,
    email: "info@naijalabs.com.ng",
    products: "Diagnostic kits, laboratory equipment",
    date: "10/04/2023",
  },
  {
    name: "AHNI-010-002-ABJ-2023",
    number: +2348063456789,
    email: "support@healthtechnigeria.com.ng",
    products: "Healthcare software, patient management systems",
    date: "10/04/2023",
  },
];

const ActionListAction = () => {
  return (
    <div className="flex gap-2">
      {/* <Link to={generatePath(RouteEnum.VENDOR_MANAGEMENT_DETAILS, { id: "1" })}>
        <IconButton className="bg-[#F9F9F9] hover:text-primary">
          <Icon icon="ph:eye-duotone" fontSize={15} />
        </IconButton>
      </Link>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton> */}
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

const columns = [
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
      return <div className={cn("px-3 py-2 rounded-lg")}>{getValue()}</div>;
    },
  },

  {
    header: (
      <IconButton>
        <CircleEllipsisIcon />
      </IconButton>
    ),
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const PurchaseOrder = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });
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
        <div>
          <Table
            instance={tableInstance}
            // loading={customersQueryResult.isFetching}
            // error={customersQueryResult.isError}
            // onReload={customersQueryResult.refetch}
          />
        </div>
      </Card>
    </div>
  );
};

export default PurchaseOrder;
