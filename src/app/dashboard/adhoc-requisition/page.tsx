"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/Table/DataTable";
import { Plus, Search, Filter, Eye, Edit, Trash2, Send } from "lucide-react";
import { useGetAllAdhocRequisitions, useDeleteAdhocRequisition, useSubmitRequisition } from "@/controllers/adhocRequisitionController";
import { IAdhocRequisitionPaginatedData, RequisitionStatus } from "@/types/adhoc-requisition";
import { ProgramRoutes } from "@/constants/RouterConstants";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

// Submit Button Component
function SubmitButton({ requisitionId }: { requisitionId: string }) {
  const { mutate: submitRequisition, isPending } = useSubmitRequisition(requisitionId);

  const handleSubmit = () => {
    if (confirm("Submit this requisition for approval? You won't be able to edit it afterwards.")) {
      submitRequisition();
    }
  };

  return (
    <Button
      size="sm"
      variant="default"
      onClick={handleSubmit}
      disabled={isPending}
      className="bg-green-600 hover:bg-green-700"
    >
      <Send className="w-4 h-4 mr-1" />
      {isPending ? "Submitting..." : "Submit"}
    </Button>
  );
}

export default function AdhocRequisitionListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequisitionStatus | undefined>(undefined);

  const { data, isLoading } = useGetAllAdhocRequisitions({
    page,
    size: 20,
    search,
    status: status,
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
      header: "Created",
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
              <SubmitButton requisitionId={row.original.id} />
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Adhoc Staff Requisitions</h1>
          <p className="text-gray-600">Request adhoc staff for your department</p>
        </div>
        <Button onClick={() => router.push(ProgramRoutes.ADHOC_REQUISITION_CREATE)}>
          <Plus className="w-4 h-4 mr-2" />
          New Requisition
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requisitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? undefined : value as RequisitionStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
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