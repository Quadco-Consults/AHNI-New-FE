"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { EyeIcon, PlusIcon } from "lucide-react";
import { Checkbox } from "components/ui/checkbox";

import { Input } from "components/ui/input";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import IconButton from "components/IconButton";

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
import BreadcrumbCard from "components/Breadcrumb";
import { IPurchaseOrderPaginatedData } from "features/procurement/types/purchase-order";
import { useGetAllPurchaseOrders } from "@/features/procurement/controllers/purchaseOrderController";
import { convertDateFormat, formatDate } from "utils/date";

const PurchaseOrder = () => {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Order", icon: false },
  ];

  const { data } = useGetAllPurchaseOrders({ page: 1, size: 20 });

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex justify-end'>
        <Link href='/dashboard/procurement/purchase-order/create'>
          <Button className='flex py-6 items-center gap-x-3'>
            <p className='flex h-[20.5px] w-[20.5px] items-center justify-center rounded  bg-white/30'>
              <PlusIcon size={14} />
            </p>
            New Purchase Order
          </Button>
        </Link>
      </div>
      <Card className='space-y-5'>
        <div>
          <Input type='Search' placeholder='search' className='w-[30%]' />
        </div>

        <DataTable data={data?.data?.results || []} columns={columns} />
      </Card>
    </div>
  );
};

export default PurchaseOrder;

const columns: ColumnDef<IPurchaseOrderPaginatedData>[] = [
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
    header: "Purchase Order No",
    accessorKey: "purchase_order_number",
    size: 250,
  },

  {
    header: "Vendor Name",
    accessorKey: "vendor_name",
    size: 250,
    cell: ({ row }) => {
      // @ts-ignore
      return <div>{row?.original?.vendor_detail?.company_name}</div>;
    },
  },
  {
    header: "RFQ",
    accessorKey: "rfq",
    size: 200,
    cell: ({ row }) => {
      // @ts-ignore
      return <div>{row?.original?.solicitation_detail?.title}</div>;
    },
  },
  {
    header: "Date Generated",
    accessorKey: "created_datetime",
    accessorFn: (data) => convertDateFormat(data.created_datetime),
    cell: ({ getValue }) => {
      return (
        <div className={cn("px-3 py-2 rounded-lg")}>{getValue() as string}</div>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];
const ActionListAction = ({ data }: any) => {
  return (
    <div className='flex gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconButton>
            <CircleEllipsisIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={`/dashboard/procurement/purchase-order/${data.id}`}>
            <DropdownMenuItem key='print' className='flex gap-2'>
              <EyeIcon /> View
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
