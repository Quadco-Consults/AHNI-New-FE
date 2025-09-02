"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import EyeIcon from "components/icons/EyeIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IAgreementPaginatedData } from "definations/c&g/contract-management/agreement";
import { useDeleteContractRequest } from "@/features/contracts-grants/controllers/contractController";
import { CG_ROUTES } from "constants/RouterConstants";
import WorkflowActions from "../../contract-management/WorkflowActions";
import { Separator } from "components/ui/separator";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { formatUserName } from "../../../utils/userLookup";

export const contractRequestColumns: ColumnDef<IAgreementPaginatedData>[] = [
  {
    header: "Request Title",
    id: "title",
    accessorKey: "title",
    size: 200,
  },

  {
    header: "Request Type",
    id: "request_type",
    accessorKey: "request_type",
    size: 200,
  },

  {
    header: "Requesting Department",
    id: "department",
    accessorKey: "department.name",
    size: 200,
  },

  {
    header: "Location",
    id: "location",
    accessorKey: "location_detail.name",
    size: 200,
  },

  {
    header: "Reviewer",
    id: "reviewer",
    accessorKey: "current_reviewer_detail.first_name",
    size: 150,
    cell: ({ row }) => {
      const data = row.original as IAgreementPaginatedData;
      return formatUserName(data.current_reviewer_detail, data.current_reviewer);
    },
  },

  {
    header: "Authorizer", 
    id: "authorizer",
    accessorKey: "authorizer_detail.first_name",
    size: 150,
    cell: ({ row }) => {
      const data = row.original as IAgreementPaginatedData;
      return formatUserName(data.authorizer_detail, data.authorizer);
    },
  },

  {
    header: "Approver",
    id: "approver", 
    accessorKey: "approver_detail.first_name",
    size: 150,
    cell: ({ row }) => {
      const data = row.original as IAgreementPaginatedData;
      return formatUserName(data.approver_detail, data.approver);
    },
  },

  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status as string;
      const statusConfig: Record<string, { label: string; className: string }> = {
        DRAFT: { label: "Draft", className: "bg-gray-200 text-gray-700" },
        SUBMITTED: { label: "Submitted", className: "bg-blue-200 text-blue-700" },
        UNDER_REVIEW: { label: "Under Review", className: "bg-yellow-200 text-yellow-700" },
        REVIEWED: { label: "Reviewed", className: "bg-purple-200 text-purple-700" },
        AUTHORIZED: { label: "Authorized", className: "bg-indigo-200 text-indigo-700" },
        APPROVED: { label: "Approved", className: "bg-green-200 text-green-700" },
        REJECTED: { label: "Rejected", className: "bg-red-200 text-red-700" }
      };
      const config = statusConfig[status] || { label: status, className: "bg-gray-200 text-gray-700" };
      return (
        <Badge className={`${config.className} hover:${config.className}`}>
          {config.label}
        </Badge>
      );
    },
  },

  {
    header: "",
    id: "action",
    size: 80,
    cell: ({ row }) => <TableMenu {...row.original} />,
  },
];

const TableMenu = (contractRequest: IAgreementPaginatedData) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const pathname = usePathname();
  
  // For now, using a mock current user - this should come from auth context
  const currentUser = { id: "current-user-id" };

  const { deleteContractRequest, isLoading } = useDeleteContractRequest(contractRequest.id);

  const handleDelete = async () => {
    try {
      await deleteContractRequest();
      toast.success("Contract Request Deleted");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const handleStatusUpdate = () => {
    setShouldRefresh(!shouldRefresh);
    // In a real app, this would trigger a refetch of the contract requests list
  };

  if (pathname === "/admin/agreements/") return null;

  return (
    <div className='flex items-center gap-2'>
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='flex gap-2 py-6'>
              <MoreOptionsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-fit'>
            {/* Workflow Actions */}
            <WorkflowActions
              contractRequest={contractRequest}
              currentUser={currentUser}
              onStatusUpdate={handleStatusUpdate}
            />

            <Separator className="my-2" />

            {/* Standard Actions */}
            <Link
              href={`/dashboard/c-and-g/contract-request/${contractRequest.id}`}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Details
              </Button>
            </Link>
            
            <Link
              href={{
                pathname: CG_ROUTES.CREATE_CONTRACT_REQUEST,
                search: `?id=${contractRequest.id}`,
              }}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this expenditure?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </div>
  );
};
