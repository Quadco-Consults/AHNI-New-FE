"use client";

import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import React, { useState, useEffect } from "react";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import SearchBar from "components/SearchBar";
import { Checkbox } from "components/ui/checkbox";
import IconButton from "components/IconButton";
import { Trash2, Eye } from 'lucide-react';
import { Icon } from "@iconify/react";
import { useGetGoals, useGetEmployeeGoals } from "@/features/hr/controllers/goalsController";
import useDebounce from "utils/useDebounce";
import { Badge } from "components/ui/badge";

const GoalsManagement: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Get current user ID and role from localStorage
  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const userId = user?.id || "";
      const userRole = user?.role || user?.user_role || "";
      const userGroups = user?.groups || user?.user_groups || [];
      const email = user?.email || "";
      const isSuperuser = user?.is_superuser;

      setCurrentUserId(userId);

      // Check if user is admin/HR - Updated to include HR Manager group
      const isAdminUser = userRole === 'admin' ||
                          userRole === 'hr' ||
                          userRole === 'Admin' ||
                          userRole === 'HR' ||
                          userRole === 'HR Manager' ||
                          email?.includes('admin') ||
                          isSuperuser === true ||
                          (Array.isArray(userGroups) && (
                            userGroups.includes('HR') ||
                            userGroups.includes('HR Manager') ||
                            userGroups.includes('Admin') ||
                            userGroups.includes('Super Admin') ||
                            userGroups.includes('admin') ||
                            userGroups.includes('hr')
                          ));

      setIsAdmin(isAdminUser);
      console.log("🔍 Goals List - Admin Detection:", {
        userId,
        isAdminUser,
        email,
        userRole,
        userGroups,
        isSuperuser,
        matchedBy: {
          roleMatch: userRole === 'HR Manager' || userRole === 'admin',
          emailMatch: email === 'hrmanager@ahni.test' || email?.includes('admin'),
          groupMatch: Array.isArray(userGroups) && (
            userGroups.includes('HR Manager') ||
            userGroups.includes('Admin') ||
            userGroups.includes('Super Admin')
          ),
          superUserMatch: isSuperuser === true
        }
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // For admin: fetch all goals, For staff: fetch only their goals
  const { data: allGoalsData, isLoading: isLoadingAll, refetch: refetchAll } = useGetGoals({
    search: debouncedSearchTerm || "",
    page: 1,
    size: 20,
    enabled: isAdmin,
  });

  const { data: myGoalsData, isLoading: isLoadingMy, refetch: refetchMy } = useGetEmployeeGoals(
    currentUserId,
    !isAdmin && !!currentUserId
  );

  // Determine which data to use
  const goalsData = isAdmin ? allGoalsData : myGoalsData;
  const isLoading = isAdmin ? isLoadingAll : isLoadingMy;
  const refetch = isAdmin ? refetchAll : refetchMy;

  // Debug: Log the actual API response
  React.useEffect(() => {
    if (goalsData) {
      console.log("Goals API Response:", goalsData);
      console.log("Goals Data Array:", goalsData?.data);
      console.log("Goals Results:", goalsData?.data?.results);
      console.log("Goals Count:", goalsData?.data?.results?.length || 0);
    }
  }, [goalsData]);

  React.useEffect(() => {
    if (currentUserId) {
      refetch();
    }
  }, [refetch, currentUserId]);

  // Build columns dynamically based on user role
  const baseColumns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      header: "Title",
      accessorKey: "title",
      size: 300,
      cell: ({ row }) => <p className="font-medium">{row?.original?.title}</p>,
    },
  ];

  // Add Employee column only for admin users
  const employeeColumn: ColumnDef<any> = {
    header: "Employee",
    accessorKey: "employee_name",
    size: 200,
    cell: ({ row }) => <p>{row?.original?.employee_name || "N/A"}</p>,
  };

  const remainingColumns: ColumnDef<any>[] = [
    {
      header: "Total Weight",
      accessorKey: "total_weight",
      size: 150,
      cell: ({ row }) => {
        const totalWeight = row?.original?.total_weight ||
                           row?.original?.narratives?.reduce((sum: number, n: any) =>
                             sum + parseFloat(n.weight || 0), 0);
        return (
          <Badge variant="outline">
            {totalWeight ? parseFloat(totalWeight.toString()).toFixed(0) : 0}%
          </Badge>
        );
      },
    },
    {
      header: "Tasks Count",
      id: "narratives_count",
      size: 150,
      cell: ({ row }) => {
        const count = row?.original?.narratives?.length || 0;
        return <p>{count} task{count !== 1 ? 's' : ''}</p>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 150,
      cell: ({ row }) => {
        const status = row?.original?.status || 'not_started';
        const variant =
          status === 'completed' ? 'default' :
          status === 'in_progress' ? 'secondary' :
          'outline';
        return (
          <Badge variant={variant} className="capitalize">
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      header: "Created",
      accessorKey: "created_datetime",
      size: 150,
      cell: ({ row }) => {
        const date = row?.original?.created_datetime || row?.original?.created_at;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
    {
      header: "",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  // Combine columns: add Employee column only for admins
  const columns = isAdmin
    ? [...baseColumns, employeeColumn, ...remainingColumns]
    : [...baseColumns, ...remainingColumns];

  const ActionListAction = ({ data }: any) => {
    const goalId = data?.original?.id;

    return (
      <div className="flex gap-2">
        <Link href={`/dashboard/hr/goals-management/${goalId}`}>
          <IconButton className="bg-[#F9F9F9] hover:text-primary">
            <Eye size={16} />
          </IconButton>
        </Link>
        <IconButton
          className="bg-[#F9F9F9] hover:text-red-600"
          onClick={() => {
            // TODO: Implement delete functionality
            console.log('Delete goal:', goalId);
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-[1rem]">
      {/* Page Header */}
      <div className="w-full">
        <h2 className="text-2xl font-bold">
          {isAdmin ? 'Goals Management' : 'My Goals'}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {isAdmin
            ? 'Manage goals for all employees'
            : 'Set and track your personal performance goals'}
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <SearchBar onchange={(e: any) => setSearchTerm(e.target.value)} />
          <Button variant="ghost">
            <FilterIcon2 />
          </Button>
        </div>
        <div className="flex items-center">
          <FormButton
            onClick={() => router.push(HrRoutes.GOALS_MANAGEMENT_CREATE)}
          >
            <AddSquareIcon />
            <p>{isAdmin ? 'Create New Goal' : 'Create My Goal'}</p>
          </FormButton>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={columns}
          data={goalsData?.data?.results || goalsData?.data || []}
          isLoading={isLoading}
          pagination={{
            total: goalsData?.data?.pagination?.count || goalsData?.data?.length || 0,
            pageSize: 20,
            onChange: (page: number) => {
              console.log("Page changed to:", page);
            },
          }}
        />
      </div>
    </div>
  );
};

export default GoalsManagement;
