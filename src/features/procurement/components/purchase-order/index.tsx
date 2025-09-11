"use client";

import Card from "components/Card";
import { Button } from "components/ui/button";
import { EyeIcon, PlusIcon, EditIcon } from "lucide-react";
import { Checkbox } from "components/ui/checkbox";

import { Input } from "components/ui/input";
import Link from "next/link";
import { RouteEnum } from "constants/RouterConstants";
import IconButton from "components/IconButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Order", icon: false },
  ];

  const { data } = useGetAllPurchaseOrders({ 
    page: currentPage, 
    size: 20, 
    search: searchTerm,
    status: statusFilter === "ALL" ? "" : statusFilter 
  });

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
        <div className='flex gap-4 items-center'>
          <Input 
            type='search' 
            placeholder='Search by PO number, vendor name...' 
            className='w-[40%]' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="AUTHORIZED">Authorized</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="AGREED">Agreed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
          {(searchTerm || statusFilter !== "ALL") && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
            >
              Clear Filters
            </Button>
          )}
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
    header: "Status",
    accessorKey: "status_level",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status_level;
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'AUTHORIZED': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
          case 'AGREED': return 'bg-purple-100 text-purple-800 border-purple-200';
          case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
      };
      
      return (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium border",
          getStatusColor(status)
        )}>
          {status || 'Unknown'}
        </span>
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
            <DropdownMenuItem key='view' className='flex gap-2'>
              <EyeIcon /> View
            </DropdownMenuItem>
          </Link>
          <Link href={`/dashboard/procurement/purchase-order/${data.id}/edit`}>
            <DropdownMenuItem key='edit' className='flex gap-2'>
              <EditIcon /> Edit
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
