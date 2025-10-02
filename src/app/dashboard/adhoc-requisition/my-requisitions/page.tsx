"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Input } from "components/ui/input";
import { Badge } from "components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import DataTable from "components/Table/DataTable";
import { Plus, Search, Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import { useGetMyAdhocRequisitions, useDeleteAdhocRequisition } from "@/controllers/adhocRequisitionController";
import { IAdhocRequisitionPaginatedData, RequisitionStatus } from "@/types/adhoc-requisition";
import { ProgramRoutes } from "@/constants/RouterConstants";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export default function MyAdhocRequisitionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<RequisitionStatus | undefined>(undefined);

  const { data, isLoading, refetch } = useGetMyAdhocRequisitions({
    page,
    size: 20,
    status,
  });

  const { mutate: deleteRequisition } = useDeleteAdhocRequisition();

  const getStatusBadge = (status: RequisitionStatus) => {
    const config = {
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      PENDING_APPROVAL: { label: "Pending", className: "bg-amber-100 text-amber-800" },
      APPROVED: { label: "Approved", className: "bg-green-100 text-green-800" },
      REJECTED: { label: "Rejected", className: "bg-red-100 text-red-800" },
      CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
      CONVERTED_TO_AD: { label: "Converted", className: "bg-blue-100 text-blue-800" },
    };
    const { label, className } = config[status];
    return <Badge className={className}>{label}</Badge>;
  };


  const columns: ColumnDef<IAdhocRequisitionPaginatedData>[] = [
    {
      accessorKey: "requisition_number",
      header: "Req. No.",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.requisition_number}</div>
      ),
    },
    {
      accessorKey: "position_title",
      header: "Position",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{row.original.position_title}</div>
          <div className="text-xs text-gray-500">
            {row.original.requesting_department?.name || row.original.requesting_department_name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "number_of_positions",
      header: "Positions",
      cell: ({ row }) => (
        <div className="text-center">{row.original.number_of_positions}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priorityConfig = {
          LOW: "bg-gray-100 text-gray-800",
          MEDIUM: "bg-blue-100 text-blue-800",
          HIGH: "bg-orange-100 text-orange-800",
          URGENT: "bg-red-100 text-red-800",
        };
        return (
          <Badge className={priorityConfig[row.original.priority]}>
            {row.original.priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => format(new Date(row.original.start_date), "MMM dd, yyyy"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "created_datetime",
      header: "Submitted",
      cell: ({ row }) => format(new Date(row.original.created_datetime), "MMM dd, yyyy"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/adhoc-requisition/${row.original.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status === "DRAFT" && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push(`/dashboard/adhoc-requisition/${row.original.id}/edit`)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this requisition?")) {
                    deleteRequisition(row.original.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Calculate status counts
  const statusCounts = {
    total: data?.data?.paginator?.count || 0,
    draft: data?.data?.results?.filter((r) => r.status === "DRAFT").length || 0,
    pending: data?.data?.results?.filter((r) => r.status === "PENDING_APPROVAL").length || 0,
    approved: data?.data?.results?.filter((r) => r.status === "APPROVED").length || 0,
    rejected: data?.data?.results?.filter((r) => r.status === "REJECTED").length || 0,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Requisitions</h1>
          <p className="text-gray-600">Track and manage your adhoc staff requisition requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push(ProgramRoutes.ADHOC_REQUISITION_CREATE)}>
            <Plus className="w-4 h-4 mr-2" />
            New Requisition
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold mt-1">{statusCounts.total}</div>
        </Card>
        <Card className="p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-600">Draft</div>
          <div className="text-2xl font-bold mt-1">{statusCounts.draft}</div>
        </Card>
        <Card className="p-4 border-l-4 border-amber-400">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold mt-1">{statusCounts.pending}</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-400">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-2xl font-bold mt-1">{statusCounts.approved}</div>
        </Card>
        <Card className="p-4 border-l-4 border-red-400">
          <div className="text-sm text-gray-600">Rejected</div>
          <div className="text-2xl font-bold mt-1">{statusCounts.rejected}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? undefined : value as RequisitionStatus)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="CONVERTED_TO_AD">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6">
        <DataTable
          columns={columns}
          data={data?.data?.results || []}
          isLoading={isLoading}
          pagination={{
            total: data?.data?.paginator?.count || 0,
            pageSize: 20,
            onChange: setPage,
          }}
        />
      </Card>
    </div>
  );
}