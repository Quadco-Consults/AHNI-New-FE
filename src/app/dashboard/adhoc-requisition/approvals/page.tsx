"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/tabs";
import DataTable from "components/Table/DataTable";
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useGetPendingApprovals } from "@/controllers/adhocRequisitionController";
import { IAdhocRequisitionPaginatedData, RequisitionStatus } from "@/types/adhoc-requisition";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

export default function AdhocRequisitionApprovalsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [approvalType, setApprovalType] = useState<"pending" | "completed">("pending");

  const { data, isLoading } = useGetPendingApprovals({
    page,
    size: 20,
  });

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


  const getApprovalStageBadge = (requisition: IAdhocRequisitionPaginatedData) => {
    // Determine current approval stage
    if (!requisition.reviewed_at) {
      return <Badge className="bg-blue-100 text-blue-800">Review Pending</Badge>;
    }
    if (!requisition.authorized_at) {
      return <Badge className="bg-purple-100 text-purple-800">Authorization Pending</Badge>;
    }
    if (!requisition.approved_at && requisition.status === "PENDING_APPROVAL") {
      return <Badge className="bg-orange-100 text-orange-800">Approval Pending</Badge>;
    }
    if (requisition.status === "APPROVED") {
      return <Badge className="bg-green-100 text-green-800">Fully Approved</Badge>;
    }
    if (requisition.status === "REJECTED") {
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
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
      accessorKey: "requested_by",
      header: "Requested By",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-sm">
            {row.original.requested_by?.first_name} {row.original.requested_by?.last_name}
          </div>
          <div className="text-xs text-gray-500">{row.original.requested_by?.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priorityConfig = {
          LOW: { label: "Low", className: "bg-gray-100 text-gray-800", icon: null },
          MEDIUM: { label: "Medium", className: "bg-blue-100 text-blue-800", icon: null },
          HIGH: { label: "High", className: "bg-orange-100 text-orange-800", icon: AlertCircle },
          URGENT: { label: "Urgent", className: "bg-red-100 text-red-800", icon: AlertCircle },
        };
        const config = priorityConfig[row.original.priority];
        return (
          <Badge className={config.className}>
            {config.icon && <config.icon className="w-3 h-3 mr-1" />}
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "approval_stage",
      header: "Stage",
      cell: ({ row }) => getApprovalStageBadge(row.original),
    },
    {
      accessorKey: "created_datetime",
      header: "Submitted",
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.original.created_datetime), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          onClick={() => router.push(`/dashboard/adhoc-requisition/${row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Review
        </Button>
      ),
    },
  ];

  // Filter data based on approval type
  const filteredData = data?.data?.results?.filter((req) => {
    if (approvalType === "pending") {
      return req.status === "PENDING_APPROVAL";
    } else {
      return req.status === "APPROVED" || req.status === "REJECTED";
    }
  }) || [];

  // Calculate stats
  const stats = {
    pending: data?.data?.results?.filter((r) => r.status === "PENDING_APPROVAL").length || 0,
    reviewPending: data?.data?.results?.filter((r) => !r.reviewed_at && r.status === "PENDING_APPROVAL").length || 0,
    authorizationPending: data?.data?.results?.filter((r) => r.reviewed_at && !r.authorized_at && r.status === "PENDING_APPROVAL").length || 0,
    approvalPending: data?.data?.results?.filter((r) => r.reviewed_at && r.authorized_at && !r.approved_at && r.status === "PENDING_APPROVAL").length || 0,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Requisition Approvals</h1>
        <p className="text-gray-600">Review and approve adhoc staff requisition requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Pending Total</div>
              <div className="text-2xl font-bold mt-1">{stats.pending}</div>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Review Stage</div>
              <div className="text-2xl font-bold mt-1">{stats.reviewPending}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-purple-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Authorization Stage</div>
              <div className="text-2xl font-bold mt-1">{stats.authorizationPending}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-orange-400">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Final Approval Stage</div>
              <div className="text-2xl font-bold mt-1">{stats.approvalPending}</div>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>


      {/* Tabs */}
      <Card className="p-6">
        <Tabs value={approvalType} onValueChange={(value) => setApprovalType(value as "pending" | "completed")}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              <Clock className="w-4 h-4 mr-2" />
              Pending Approvals ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <DataTable
              columns={columns}
              data={filteredData}
              isLoading={isLoading}
              pagination={{
                total: filteredData.length,
                pageSize: 20,
                onChange: setPage,
              }}
            />
          </TabsContent>

          <TabsContent value="completed">
            <DataTable
              columns={columns}
              data={filteredData}
              isLoading={isLoading}
              pagination={{
                total: filteredData.length,
                pageSize: 20,
                onChange: setPage,
              }}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}