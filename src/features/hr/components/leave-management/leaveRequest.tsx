/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import FormButton from "@/components/FormButton";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import DataTable from "@/components/Table/DataTable";
import React, { useState } from "react";

import FilterIcon2 from "assets/svgs/FilterIcon2";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HrRoutes, RouteEnum } from "@/constants/RouterConstants";
import SearchBar from "@/components/SearchBar";
import { Checkbox } from "@/components/ui/checkbox";
import IconButton from "@/components/IconButton";
import { Trash2 } from 'lucide-react';
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetLeaveRequests, useDeleteLeaveRequest } from "@/features/hr/controllers/leaveRequestController";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LeaveManagement: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch leave requests from API
  const { data: leaveData, isLoading, refetch } = useGetLeaveRequests({
    page: currentPage,
    size: 20,
    status: statusFilter,
    search: searchQuery,
    enabled: true,
  });

  // Delete leave request hook
  const { deleteLeaveRequest, isLoading: isDeleting } = useDeleteLeaveRequest(itemToDelete);

  // Extract leave requests from API response
  const leaveRequests = leaveData?.data || [];

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLeaveRequest();
      toast.success("Leave request deleted successfully");
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete leave request");
    }
  };

  const columns: ColumnDef<any>[] = [
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
      header: "Employee",
      accessorKey: "employee",
      size: 200,
      cell: ({ row }) => {
        const employee = row?.original?.employee;
        return <p>{employee?.legal_firstname} {employee?.legal_lastname}</p>;
      },
    },
    {
      header: "Reason",
      accessorKey: "reason",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.reason}</p>,
    },
    {
      header: "Leave Type",
      accessorKey: "leave_type",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.leaveType?.name || "N/A"}</p>,
    },
    {
      header: "From",
      accessorKey: "fromDate",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.fromDate}</p>,
    },
    {
      header: "To",
      accessorKey: "toDate",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.toDate}</p>,
    },
    {
      header: "No of Days",
      accessorKey: "numberOfDays",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.numberOfDays}</p>,
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        return (
          <Badge
            variant='default'
            className={cn(
              "p-1 rounded-lg",
              getValue() === "Approved" && "bg-green-200 text-green-500",
              getValue() === "Rejected" && "bg-red-200 text-red-500",
              getValue() === "Pending" && "bg-yellow-200 text-yellow-500",
              getValue() === "On Hold" && "text-grey-200 bg-grey-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },

    {
      header: "Actions",
      id: "actions",
      size: 150,
      cell: ({ row }) => <ActionListAction data={row} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    return (
      <div className='flex gap-2'>
        <Link
          href={HrRoutes.LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL.replace(":id", data.original.id)}
        >
          <IconButton className='bg-[#F9F9F9] hover:text-primary'>
            <Icon icon='ph:eye-duotone' fontSize={15} />
          </IconButton>
        </Link>
        <IconButton
          className='bg-[#F9F9F9] hover:text-primary'
          onClick={() => handleDelete(data.original.id)}
        >
          <Icon icon='ant-design:delete-twotone' fontSize={15} />
        </IconButton>
      </div>
    );
  };

  return (
    <div className='flex flex-col justify-center items-center gap-y-[1rem]'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center justify-center gap-2'>
          <SearchBar
            onchange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='w-full'>
        <DataTable
          columns={columns}
          data={leaveRequests}
          isLoading={isLoading}
          pagination={{
            total: leaveRequests.length,
            pageSize: 20,
            onChange: (page: number) => setCurrentPage(page),
          }}
        />
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title='Are you sure you want to delete this leave request?'
        loading={isDeleting}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onOk={confirmDelete}
      />
    </div>
  );
};

export default LeaveManagement;
