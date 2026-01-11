"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Plus, Search, Trash2, Edit, ArrowRight } from "lucide-react";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import GoBack from "@/components/GoBack";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";

interface Approver {
  id: string;
  approver: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  level: number;
}

interface Workflow {
  id: string;
  name: string;
  leave_type: string;
  leaveTypeName?: string;
  description?: string;
  approvers: Approver[];
  created_at: string;
}

const WorkflowsList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch workflows from backend
  const { data: workflowsData, isLoading } = useQuery({
    queryKey: ["approval-workflows"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("hr/approval-workflows/");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching workflows:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const workflows = Array.isArray(workflowsData?.data)
    ? workflowsData.data
    : Array.isArray(workflowsData?.data?.results)
    ? workflowsData.data.results
    : [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;

    try {
      await AxiosWithToken.delete(`hr/approval-workflows/${id}/`);
      await queryClient.invalidateQueries({ queryKey: ["approval-workflows"] });
      toast.success("Workflow deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting workflow:", error);
      toast.error("Failed to delete workflow. Please try again.");
    }
  };

  const columns: ColumnDef<Workflow>[] = [
    {
      header: "Workflow Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          {row.original.description && (
            <div className="text-sm text-gray-500 line-clamp-1">{row.original.description}</div>
          )}
        </div>
      ),
    },
    {
      header: "Leave Type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.leaveTypeName || 'N/A'}
        </Badge>
      ),
    },
    {
      header: "Approval Levels",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Badge variant="secondary">
            {row.original.approvers?.length || 0} {row.original.approvers?.length === 1 ? 'level' : 'levels'}
          </Badge>
        </div>
      ),
    },
    {
      header: "Approvers",
      cell: ({ row }) => {
        const approvers = row.original.approvers || [];
        const sortedApprovers = [...approvers].sort((a, b) => a.level - b.level);

        return (
          <div className="flex items-center gap-1 flex-wrap max-w-md">
            {sortedApprovers.map((approver, index) => (
              <React.Fragment key={approver.id}>
                <div className="text-xs bg-blue-50 px-2 py-1 rounded">
                  L{approver.level}: {approver.approver?.first_name} {approver.approver?.last_name}
                </div>
                {index < sortedApprovers.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/hr/leave-management/workflows/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredWorkflows = workflows.filter((workflow: Workflow) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      workflow.name?.toLowerCase().includes(search) ||
      workflow.description?.toLowerCase().includes(search) ||
      workflow.leaveTypeName?.toLowerCase().includes(search)
    );
  });

  // Calculate total approval levels across all workflows
  const totalApprovalLevels = workflows.reduce((sum: number, workflow: Workflow) => {
    return sum + (workflow.approvers?.length || 0);
  }, 0);

  const averageApprovalLevels = workflows.length > 0
    ? (totalApprovalLevels / workflows.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Approval Workflows
          </h1>
          <p className="text-gray-600 mt-1">
            Manage multi-level approval processes for leave requests
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/hr/leave-management/workflows/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Workflows</p>
              <p className="text-2xl font-bold">{workflows.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Approval Levels</p>
              <p className="text-2xl font-bold">{totalApprovalLevels}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Levels per Workflow</p>
              <p className="text-2xl font-bold">{averageApprovalLevels}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search workflows by name, leave type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Workflows Table */}
      <Card>
        <DataTable
          data={filteredWorkflows}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default WorkflowsList;
