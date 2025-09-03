import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TItemRequisitionPaginatedData } from "definations/admin/inventory-management/item-requisition";
import ApproveIcon from "components/icons/ApproveIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import Link from "next/link";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import ConfirmationDialog from "components/ConfirmationDialog";
import { useState } from "react";
import {
  useDeleteItemRequisition,
  useApproveItemRequisition,
  useRejectItemRequisition,
  useIssueItemRequisition,
} from "@/features/admin/controllers/itemRequisitionController";
import { toast } from "sonner";
import PencilIcon from "components/icons/PencilIcon";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

export const itemRequisitionColumns: ColumnDef<TItemRequisitionPaginatedData>[] =
  [
    {
      header: "Employee ID Number",
      id: "_",
      accessorKey: "created_by.employee_id",
      size: 250,
    },

    {
      header: "Employee Full Name",
      id: "created_by.full_name",
      accessorKey: "created_by.full_name",

      size: 250,
    },

    {
      header: "Items Requested",
      cell: ({ row }) => {
        const consummables = row.original.consummables;
        return (
          <div className='space-y-1'>
            {consummables.map((item, index: number) => (
              <div key={index} className='text-sm'>
                {`${index + 1}) ${item.item?.name}` ?? "N/A"}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Quantity Requested",
      cell: ({ row }) => {
        const consummables = row.original.consummables;
        return (
          <div className='space-y-1'>
            {consummables.map((item, index: number) => (
              <div key={index} className='text-sm'>
                {`${index + 1}) ${item.quantity}` ?? "N/A"}
              </div>
            ))}
          </div>
        );
      },
      size: 250,
    },
    {
      header: "Department/Unit",
      accessorKey: "department.name",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        return (
          <Badge
            className={cn(
              "p-1 rounded-lg",
              getValue() === "APPROVED" && "bg-green-200 text-green-600",
              getValue() === "REJECTED" && "bg-red-200 text-red-600",
              getValue() === "PENDING" && "bg-yellow-200 text-yellow-600",
              getValue() === "ISSUED" && "bg-blue-200 text-blue-600",
              getValue() === "In Progress" && "bg-purple-200 text-purple-600"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },
    {
      header: "Approved by",
      id: "approved_by",
      accessorFn: ({ approved_by }) => `${approved_by?.full_name ?? "N/A"}`,
    },
    {
      header: "Date Requested",
      id: "created_datetime",
      accessorFn: ({ created_datetime }) =>
        format(created_datetime, "yyyy-dd-MM"),
    },
    {
      header: "",
      accessorKey: "actions",
      size: 80,
      cell: ({ row }) => {
        return <TableAction {...row.original} />;
      },
    },
  ];
const TableAction = ({ id, status }: TItemRequisitionPaginatedData) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const { deleteItemRequisition, isLoading } = useDeleteItemRequisition(id);
  const { approveItemRequisition, isLoading: isApproving } =
    useApproveItemRequisition(id);
  const { rejectItemRequisition, isLoading: isRejecting } =
    useRejectItemRequisition(id);
  const { issueItemRequisition, isLoading: isIssuing } =
    useIssueItemRequisition(id);

  const handleDelete = async () => {
    try {
      deleteItemRequisition();
      toast.success("Item Requisition Deleted");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleApprove = async () => {
    try {
      approveItemRequisition();
      setApproveDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleReject = async () => {
    try {
      rejectItemRequisition();
      toast.success("Item Requisition Rejected");
      setRejectDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleIssue = async () => {
    try {
      issueItemRequisition();
      toast.success("Item Requisition Issued");
      setIssueDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={`/dashboard/admin/item-requisition/${id}`}
              className='block w-full'
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View
              </Button>
            </Link>
            <Link
              href={{
                pathname: AdminRoutes.CREATE_ITEM_REQUISITION,
                search: `?id=${id}`,
              }}
              className='block w-full'
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>
            {status === "PENDING" && (
              <>
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => setApproveDialogOpen(true)}
                >
                  <ApproveIcon />
                  Approve
                </Button>
                <Button
                  className='w-full flex items-center justify-start gap-2'
                  variant='ghost'
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <DeleteIcon />
                  Reject
                </Button>
              </>
            )}
            {status === "APPROVED" && (
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                onClick={() => setIssueDialogOpen(true)}
              >
                <ApproveIcon />
                Issue
              </Button>
            )}
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this item requisition?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />

      <ConfirmationDialog
        open={approveDialogOpen}
        title='Are you sure you want to approve this item requisition?'
        loading={isApproving}
        onCancel={() => setApproveDialogOpen(false)}
        onOk={handleApprove}
      />

      <ConfirmationDialog
        open={rejectDialogOpen}
        title='Are you sure you want to reject this item requisition?'
        loading={isRejecting}
        onCancel={() => setRejectDialogOpen(false)}
        onOk={handleReject}
      />

      <ConfirmationDialog
        open={issueDialogOpen}
        title='Are you sure you want to issue this item requisition?'
        loading={isIssuing}
        onCancel={() => setIssueDialogOpen(false)}
        onOk={handleIssue}
      />
    </>
  );
};
