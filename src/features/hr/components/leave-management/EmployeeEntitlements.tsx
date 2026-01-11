"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GoBack from "@/components/GoBack";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useGetAllLeaveBalances } from "../../controllers/leaveBalanceController";
import { useGetWorkforces } from "../../controllers/workforceController";

const EmployeeEntitlements = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch all leave balances
  const { data: balancesData, isLoading, error } = useGetAllLeaveBalances({
    page,
    size: pageSize,
    search: searchTerm,
  });

  // Fetch all employees to map employee IDs to names
  const { data: employeesData, isLoading: loadingEmployees } = useGetWorkforces({ page: 1, size: 1000 });

  const employees = React.useMemo(() => {
    const rawData = Array.isArray(employeesData?.data)
      ? employeesData.data
      : Array.isArray(employeesData?.data?.results)
      ? employeesData.data.results
      : [];

    // Create a map of employee ID to employee data for quick lookup
    const employeeMap: Record<string, any> = {};
    rawData.forEach((emp: any) => {
      const fullName = emp.full_name || `${emp.legal_firstname || ''} ${emp.legal_lastname || ''}`.trim();
      employeeMap[emp.id] = {
        id: emp.id,
        fullName: fullName || 'N/A',
        employeeNumber: emp.serial_id_code || emp.employee_number || 'N/A',
        email: emp.email || emp.user?.email || 'N/A',
        department: typeof emp.department === 'object' ? emp.department?.name : emp.department || 'N/A',
      };
    });
    return employeeMap;
  }, [employeesData]);

  const entitlements = React.useMemo(() => {
    const rawBalances = Array.isArray(balancesData?.data)
      ? balancesData.data
      : Array.isArray(balancesData?.data?.results)
      ? balancesData.data.results
      : [];

    // Enrich entitlements with employee data
    return rawBalances.map((balance: any) => ({
      ...balance,
      employeeData: employees[balance.employee] || null,
    }));
  }, [balancesData, employees]);

  const columns: ColumnDef<any>[] = [
    {
      header: "Employee",
      cell: ({ row }) => {
        const employeeData = row.original.employeeData;
        return (
          <div>
            <div className="font-medium">
              {employeeData?.fullName || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">
              {employeeData?.employeeNumber || 'N/A'} • {employeeData?.email || 'N/A'}
            </div>
          </div>
        );
      },
    },
    {
      header: "Leave Type",
      cell: ({ row }) => (
        <span>{row.original.leave_type?.name || 'N/A'}</span>
      ),
    },
    {
      header: "Year",
      accessorKey: "year",
    },
    {
      header: "Entitled",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.entitled || 0} days</span>
      ),
    },
    {
      header: "Used",
      cell: ({ row }) => (
        <span className="text-red-600">{row.original.used || 0} days</span>
      ),
    },
    {
      header: "Pending",
      cell: ({ row }) => (
        <span className="text-amber-600">{row.original.pending || 0} days</span>
      ),
    },
    {
      header: "Available",
      cell: ({ row }) => (
        <span className="text-green-600 font-semibold">{row.original.available || 0} days</span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/hr/leave-management/entitlements/${row.original.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/hr/leave-management/entitlements/${row.original.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <GoBack />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Employee Entitlements
          </h1>
          <p className="text-gray-600 mt-1">
            Manage leave entitlements and balances for employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/dashboard/hr/leave-management/entitlements/assign">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Assign Entitlement
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold">150</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">With Entitlements</p>
          <p className="text-2xl font-bold text-green-600">145</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending Assignment</p>
          <p className="text-2xl font-bold text-amber-600">5</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Avg. Leave Balance</p>
          <p className="text-2xl font-bold text-blue-600">16 days</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by employee name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <p>Failed to load entitlements: {error instanceof Error ? error.message : String(error)}</p>
          </div>
        </Card>
      )}

      {/* Entitlements Table */}
      <Card>
        <DataTable
          data={entitlements}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default EmployeeEntitlements;
