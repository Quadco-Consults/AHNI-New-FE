"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Shield, Plus, Search, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import GoBack from "components/GoBack";
import { Badge } from "components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "sonner";

interface Policy {
  id: string;
  name: string;
  leave_type: {
    id: string;
    name: string;
  };
  description?: string;
  min_notice_days: number;
  max_consecutive_days: number;
  requires_approval: boolean;
  requires_document: boolean;
  allow_carry_forward: boolean;
  max_carry_forward_days: number;
  pro_rate_entitlement: boolean;
  created_at: string;
}

const PoliciesList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch policies from backend
  const { data: policiesData, isLoading } = useQuery({
    queryKey: ["leave-policies"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get("hr/leave-policies/");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching policies:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const policies = Array.isArray(policiesData?.data)
    ? policiesData.data
    : Array.isArray(policiesData?.data?.results)
    ? policiesData.data.results
    : [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    try {
      await AxiosWithToken.delete(`hr/leave-policies/${id}/`);
      await queryClient.invalidateQueries({ queryKey: ["leave-policies"] });
      toast.success("Policy deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting policy:", error);
      toast.error("Failed to delete policy. Please try again.");
    }
  };

  const columns: ColumnDef<Policy>[] = [
    {
      header: "Policy Name",
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
          {row.original.leave_type?.name || 'N/A'}
        </Badge>
      ),
    },
    {
      header: "Notice Required",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.min_notice_days} {row.original.min_notice_days === 1 ? 'day' : 'days'}
        </div>
      ),
    },
    {
      header: "Max Consecutive",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.max_consecutive_days} {row.original.max_consecutive_days === 1 ? 'day' : 'days'}
        </div>
      ),
    },
    {
      header: "Approval",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.requires_approval ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
        </div>
      ),
    },
    {
      header: "Carry Forward",
      cell: ({ row }) => (
        <div>
          {row.original.allow_carry_forward ? (
            <div className="text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 inline mr-1" />
              {row.original.max_carry_forward_days} days
            </div>
          ) : (
            <XCircle className="w-4 h-4 text-gray-400" />
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/hr/leave-management/policies/${row.original.id}/edit`)}
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

  const filteredPolicies = policies.filter((policy: Policy) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      policy.name?.toLowerCase().includes(search) ||
      policy.description?.toLowerCase().includes(search) ||
      policy.leave_type?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Leave Policies
          </h1>
          <p className="text-gray-600 mt-1">
            Manage leave rules, approval workflows, and restrictions
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/hr/leave-management/policies/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Policy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Policies</p>
              <p className="text-2xl font-bold">{policies.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Require Approval</p>
              <p className="text-2xl font-bold">
                {policies.filter((p: Policy) => p.requires_approval).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Allow Carry Forward</p>
              <p className="text-2xl font-bold">
                {policies.filter((p: Policy) => p.allow_carry_forward).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Require Documents</p>
              <p className="text-2xl font-bold">
                {policies.filter((p: Policy) => p.requires_document).length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search policies by name, leave type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Policies Table */}
      <Card>
        <DataTable
          data={filteredPolicies}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default PoliciesList;
