"use client";

import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlusIcon, EditIcon, CircleEllipsisIcon, GitBranch } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard from "@/components/Breadcrumb";
import { convertDateFormat } from "@/utils/date";
import { useGetAllServiceOrders, useGetSingleServiceOrder } from "@/features/procurement/controllers";
import { IServiceOrderPaginatedData } from "@/features/procurement/types/service-order";
import { useRouter } from "next/navigation";
import ServiceOrderWorkflowStatus from "./components/ServiceOrderWorkflowStatus";

// Type alias for easier use in component
type ServiceOrder = IServiceOrderPaginatedData;

const ServiceOrderComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Service Orders", icon: false },
  ];

  const { data, refetch, isLoading, error } = useGetAllServiceOrders({
    page,
    size,
    search: searchTerm,
    status: statusFilter === "ALL" ? "" : statusFilter,
  });

  // Debug: Log the data structure
  console.log("Service Orders API Response:", data);
  console.log("Service Orders results:", data?.results);
  console.log("Is results an array?", Array.isArray(data?.results));

  // Ensure we have an array to work with (backend handles filtering)
  const serviceOrdersArray = Array.isArray(data?.results) ? data.results : [];

  const columns: ColumnDef<ServiceOrder>[] = [
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
      header: "Service Order No",
      accessorKey: "service_order_number",
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
        const rfqTitle = row?.original?.solicitation_detail?.title ||
                        row?.original?.solicitation_detail?.rfq_id ||
                        row?.original?.rfq_id ||
                        "N/A";
        return <div>{rfqTitle}</div>;
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
      accessorKey: "status",
      size: 120,
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'AUTHORIZED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'APPROVED': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'AGREED': return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'IN_PROGRESS': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
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
      cell: ({ row }) => <ActionListAction data={row.original} onRefresh={refetch} />,
    },
  ];

  if (isLoading) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <Card className='p-10 text-center'>
          <p>Loading service orders...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <Card className='p-10 text-center text-red-600'>
          <p>Error loading service orders: {error?.message || 'Unknown error'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex justify-end'>
        <Link href='/dashboard/procurement/service-orders/create'>
          <Button className='flex py-6 items-center gap-x-3'>
            <p className='flex h-[20.5px] w-[20.5px] items-center justify-center rounded bg-white/30'>
              <PlusIcon size={14} />
            </p>
            New Service Order
          </Button>
        </Link>
      </div>
      <Card className='space-y-5'>
        <div className='flex gap-4 items-center'>
          <Input
            type='search'
            placeholder='Search by SO number, vendor name...'
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
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="AUTHORIZED">Authorized</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="AGREED">Agreed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
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

        <DataTable data={serviceOrdersArray} columns={columns} />
      </Card>
    </div>
  );
};

// ActionListAction component
const ActionListAction = ({ data, onRefresh }: { data: ServiceOrder; onRefresh: () => void }) => {
  const router = useRouter();
  const [showWorkflow, setShowWorkflow] = useState(false);

  // Fetch fresh data when dialog opens
  const { data: freshSOData, refetch: refetchSO } = useGetSingleServiceOrder(
    data.id,
    showWorkflow // Only fetch when dialog is open
  );

  const handleWorkflowSuccess = () => {
    refetchSO();
    onRefresh();
    setShowWorkflow(false);
  };

  // Use the latest data from API or fallback to row data
  const latestSOData = freshSOData?.data || data;
  const currentStatus = latestSOData.status || 'PENDING';

  // Extract permissions from freshSOData if available
  const permissions = {
    canReview: freshSOData?.data?.permissions?.can_review || false,
    canAuthorize: freshSOData?.data?.permissions?.can_authorize || false,
    canApprove: freshSOData?.data?.permissions?.can_approve || false,
    canAgree: freshSOData?.data?.permissions?.can_agree || false,
    canReject: freshSOData?.data?.permissions?.can_reject || false,
  };

  return (
    <>
      <div className='flex gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg px-2 py-2 bg-alternate-light dark:text-black hover:text-primary dark:hover:text-primary">
              <CircleEllipsisIcon />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/dashboard/procurement/service-orders/${data.id}`}>
              <DropdownMenuItem key='view' className='flex gap-2'>
                <EyeIcon size={16} /> View
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/procurement/service-orders/${data.id}/edit`}>
              <DropdownMenuItem key='edit' className='flex gap-2'>
                <EditIcon size={16} /> Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              key='workflow'
              className='flex gap-2'
              onClick={() => setShowWorkflow(true)}
            >
              <GitBranch size={16} /> Approval Workflow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workflow Dialog */}
      <Dialog open={showWorkflow} onOpenChange={setShowWorkflow}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Order Approval Workflow - {data.service_order_number}</DialogTitle>
          </DialogHeader>
          <ServiceOrderWorkflowStatus
            serviceOrderId={latestSOData.id}
            currentStatus={currentStatus}
            canReview={permissions.canReview}
            canAuthorize={permissions.canAuthorize}
            canApprove={permissions.canApprove}
            canAgree={permissions.canAgree}
            canReject={permissions.canReject}
            reviewedBy={latestSOData.reviewed_by}
            authorizedBy={latestSOData.authorized_by}
            approvedBy={latestSOData.approved_by}
            agreedBy={latestSOData.agreed_by}
            onSuccess={handleWorkflowSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceOrderComponent;
