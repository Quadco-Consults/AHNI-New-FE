"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  FileText,
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle,
} from "lucide-react";

import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Input } from "components/ui/input";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import BackendStatusBanner from "./BackendStatusBanner";

import { LeavePackage } from "../../types/leave-package";
import { useGetLeavePackages } from "../../controllers/hrLeavePackageController";

const LeaveTypesList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch leave packages
  const { data: leavePackagesData, isLoading, error } = useGetLeavePackages({
    search: searchQuery,
    page,
    size: pageSize,
  });

  // Extract leave packages from response
  const leavePackages = React.useMemo(() => {
    if (!leavePackagesData?.data) return [];

    // Handle array response
    if (Array.isArray(leavePackagesData.data)) {
      return leavePackagesData.data;
    }

    // Handle paginated response with results
    if (leavePackagesData.data && typeof leavePackagesData.data === 'object' && 'results' in leavePackagesData.data) {
      const results = (leavePackagesData.data as any).results;
      return Array.isArray(results) ? results : [];
    }

    return [];
  }, [leavePackagesData]);

  // Table columns
  const columns: ColumnDef<LeavePackage>[] = [
    {
      header: "Leave Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      header: "Days Entitled",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{row.original.number_of_days} days/year</span>
        </div>
      ),
    },
    {
      header: "Max Consecutive",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.max_leave_days} days</span>
      ),
    },
    {
      header: "Value per Day",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span>{row.original.value_of_a_leave_day != null ? row.original.value_of_a_leave_day.toFixed(2) : '0.00'}</span>
        </div>
      ),
    },
    {
      header: "Carry Forward",
      cell: ({ row }) =>
        row.original.carry_forward ? (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Yes
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <XCircle className="w-3 h-3 mr-1" />
            No
          </Badge>
        ),
    },
    {
      header: "Convertible",
      cell: ({ row }) =>
        row.original.is_convertible ? (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Yes
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <XCircle className="w-3 h-3 mr-1" />
            No
          </Badge>
        ),
    },
    {
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {format(new Date(row.original.created_datetime), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(
              `/dashboard/hr/leave-management/leave-types/edit/${row.original.id}`
            )
          }
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <span className="ml-2">Loading leave types...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Failed to load leave types</p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Backend Status Banner */}
      <BackendStatusBanner />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Types Management</h1>
          <p className="text-gray-600">
            Configure and manage leave types for your organization
          </p>
        </div>
        <Link href="/dashboard/hr/leave-management/leave-types/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Leave Type
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Leave Types</p>
              <p className="text-2xl font-bold">{leavePackages.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Carry Forward</p>
              <p className="text-2xl font-bold">
                {leavePackages.filter((lt) => lt.carry_forward).length}
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
              <p className="text-sm text-gray-600 mb-1">Convertible</p>
              <p className="text-2xl font-bold">
                {leavePackages.filter((lt) => lt.is_convertible).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Days/Year</p>
              <p className="text-2xl font-bold">
                {leavePackages.length > 0
                  ? Math.round(
                      leavePackages.reduce(
                        (sum, lt) => sum + lt.number_of_days,
                        0
                      ) / leavePackages.length
                    )
                  : 0}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leave types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          data={leavePackages}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>

      {/* Empty State */}
      {!isLoading && leavePackages.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Leave Types Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "No leave types match your search criteria"
                : "Get started by creating your first leave type"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/hr/leave-management/leave-types/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Leave Type
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LeaveTypesList;
