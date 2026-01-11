"use client";

import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { EyeIcon, PlusIcon, EditIcon, GitBranch, RefreshCw } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { CircleEllipsisIcon } from 'lucide-react';
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard from "@/components/Breadcrumb";
import { IPurchaseOrderPaginatedData } from "@/features/procurement/types/purchase-order";
import { useGetAllPurchaseOrders, useGetSinglePurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";
import { convertDateFormat, formatDate } from "@/utils/date";
import PurchaseOrderWorkflowStatus from "./components/PurchaseOrderWorkflowStatus";

const PurchaseOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Order", icon: false },
  ];

  const { data, refetch, isLoading, error } = useGetAllPurchaseOrders({
    page: currentPage,
    size: 20,
    search: searchTerm,
    status: statusFilter === "ALL" ? "" : statusFilter
  });

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
      cell: ({ row }) => <ActionListAction data={row.original} onRefresh={refetch} />,
    },
  ];

  if (isLoading) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <Card className='p-10 text-center'>
          <p>Loading purchase orders...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <Card className='p-10 text-center text-red-600'>
          <p>Error loading purchase orders: {error?.message || 'Unknown error'}</p>
        </Card>
      </div>
    );
  }

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

        <DataTable data={data?.results || []} columns={columns} />
      </Card>
    </div>
  );
};

// ActionListAction component moved outside to avoid closure issues
const ActionListAction = ({ data, onRefresh, isRefreshing }: any) => {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [isLoadingLatestStatus, setIsLoadingLatestStatus] = useState(false);
  const [latestPOData, setLatestPOData] = useState(data);

  // Fetch single PO to get absolute latest status
  const { data: freshPOData, refetch: refetchPO, error: fetchError } = useGetSinglePurchaseOrder(
    data.id,
    showWorkflow // Only fetch when dialog is open
  );

  // Log any fetch errors
  useEffect(() => {
    if (fetchError) {
      console.error("❌ Error fetching fresh PO data:", fetchError);
    }
  }, [fetchError]);

  // Update local state with fresh data
  useEffect(() => {
    if (freshPOData?.data) {
      console.log("🔄 Fresh PO data received:", freshPOData.data);
      console.log("🔄 Fresh PO status_level:", freshPOData.data.status_level);
      console.log("🔄 Setting latestPOData with fresh data");
      setLatestPOData(freshPOData.data);
      setIsLoadingLatestStatus(false);
    } else if (freshPOData && !freshPOData.data) {
      console.log("⚠️ Fresh PO data fetched but no data property found, using original data");
      setLatestPOData(data);
      setIsLoadingLatestStatus(false);
    }
  }, [freshPOData, data]);

  // Debug: Log when latestPOData changes
  useEffect(() => {
    console.log("🔍 latestPOData updated:", {
      id: latestPOData?.id,
      status_level: latestPOData?.status_level,
      purchase_order_number: latestPOData?.purchase_order_number
    });
  }, [latestPOData]);

  // Force refetch when opening workflow dialog to get latest status
  useEffect(() => {
    if (showWorkflow) {
      console.log("🔄 Workflow dialog opened - refreshing data to get latest status");
      setIsLoadingLatestStatus(true);
      // Refetch both list and single PO data
      if (onRefresh) {
        onRefresh();
      }
      refetchPO();
    }
  }, [showWorkflow, onRefresh, refetchPO]);

  const handleWorkflowSuccess = () => {
    // Don't close the dialog - just refresh data so user can see updated status
    setIsLoadingLatestStatus(true);
    // Trigger data refresh
    if (onRefresh) {
      onRefresh();
    }
    refetchPO();
  };

  const handleManualRefresh = () => {
    setIsLoadingLatestStatus(true);
    if (onRefresh) {
      onRefresh();
    }
    refetchPO();
  };

  return (
    <>
      <div className='flex gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg px-2 py-2 bg-[#F9F9F9] dark:text-black hover:text-primary dark:hover:text-primary">
              <CircleEllipsisIcon />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/dashboard/procurement/purchase-order/${data.id}`}>
              <DropdownMenuItem key='view' className='flex gap-2'>
                <EyeIcon size={16} /> View
              </DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/procurement/purchase-order/${data.id}/edit`}>
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

      <Dialog open={showWorkflow} onOpenChange={setShowWorkflow}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Purchase Order Approval Workflow</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isLoadingLatestStatus}
                className="ml-4"
              >
                {isLoadingLatestStatus ? (
                  <>
                    <RefreshCw size={16} />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Refresh Status
                  </>
                )}
              </Button>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <div>PO Number: {data.purchase_order_number}</div>
                {isLoadingLatestStatus && (
                  <div className="text-blue-600 text-sm font-semibold">
                    🔄 Loading latest status from backend...
                  </div>
                )}
                {!isLoadingLatestStatus && latestPOData && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                    <div className="text-sm">
                      <span className="font-semibold">Current Backend Status:</span>{' '}
                      <span className="text-blue-700 font-bold text-base">
                        {latestPOData.status_level || 'PENDING'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {latestPOData.status_level === 'PENDING' && '✓ Ready for Review'}
                      {latestPOData.status_level === 'REVIEWED' && '✓ Ready for Authorization'}
                      {latestPOData.status_level === 'AUTHORIZED' && '✓ Ready for Approval'}
                      {latestPOData.status_level === 'APPROVED' && '✓ Fully Approved'}
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          {isLoadingLatestStatus ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading latest workflow status...</p>
              </div>
            </div>
          ) : (
            (() => {
              const currentStatusLevel = latestPOData?.status_level || 'PENDING';
              const permissions = {
                canReview: currentStatusLevel === 'PENDING',
                canAuthorize: currentStatusLevel === 'REVIEWED',
                canApprove: currentStatusLevel === 'AUTHORIZED',
                canReject: currentStatusLevel !== 'APPROVED' && currentStatusLevel !== 'REJECTED'
              };

              console.log("🔍 Rendering PurchaseOrderWorkflowStatus with:", {
                purchaseOrderId: latestPOData?.id,
                currentStatus: currentStatusLevel,
                ...permissions
              });

              return (
                <PurchaseOrderWorkflowStatus
                  purchaseOrderId={latestPOData.id}
                  currentStatus={currentStatusLevel}
                  canReview={permissions.canReview}
                  canAuthorize={permissions.canAuthorize}
                  canApprove={permissions.canApprove}
                  canReject={permissions.canReject}
                  reviewedBy={latestPOData.reviewed_by_detail?.name || undefined}
                  authorizedBy={latestPOData.authorized_by_detail?.name || undefined}
                  approvedBy={latestPOData.approved_by_detail?.name || undefined}
                  onSuccess={handleWorkflowSuccess}
                />
              );
            })()
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchaseOrder;
