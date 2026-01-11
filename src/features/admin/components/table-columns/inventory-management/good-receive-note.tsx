import { ColumnDef } from "@tanstack/react-table";
import { IGoodReceiveNotePaginatedData } from "definations/admin/inventory-management/good-receive-note";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import { Button } from "@/components/ui/button";
import { AdminRoutes } from "@/constants/RouterConstants";
import { format } from "date-fns";
import PencilIcon from "@/components/icons/PencilIcon";
import { useDeleteGoodReceiveNoteMutation } from "@/features/admin/controllers/goodReceiveNoteController";
import { toast } from "sonner";
import { useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { CheckCircle, XCircle } from "lucide-react";
import GrnApprovalModal from "@/features/admin/components/good-receive-note/modals/GrnApprovalModal";

// Base columns used in both tabs
const baseColumns: ColumnDef<IGoodReceiveNotePaginatedData>[] = [
  {
    header: "Vendor  Name",
    id: "vendor",
    accessorKey: "vendor",
    size: 200,
  },
  {
    header: "PO Number",
    id: "purchase_order",
    accessorKey: "purchase_order",
    size: 150,
  },
  {
    header: "Invoice Number",
    id: "invoice_number",
    accessorKey: "invoice_number",
    size: 200,
  },
  {
    header: "Waybill Number",
    id: "waybill_number",
    accessorKey: "waybill_number",
    size: 200,
  },
  {
    header: "Date Created",
    id: "created_datetime",
    accessorFn: ({ created_datetime }) =>
      format(created_datetime, "dd-MMM-yyyy"),
  },
  {
    header: "Remark",
    id: "remark",
    accessorKey: "remark",
  },
];

// Status column
const statusColumn: ColumnDef<IGoodReceiveNotePaginatedData> = {
  header: "Status",
  id: "status",
  size: 120,
  cell: ({ row }) => {
    const { status, approved_datetime, rejected_datetime, received_datetime } = row.original;

    // Use explicit status field if available, otherwise fall back to datetime fields
    let displayStatus = status;
    let statusClass = "";

    if (!displayStatus) {
      if (approved_datetime) {
        displayStatus = "approved";
      } else if (rejected_datetime) {
        displayStatus = "rejected";
      } else if (received_datetime) {
        displayStatus = "received";
      } else {
        displayStatus = "pending";
      }
    }

    switch (displayStatus) {
      case "approved":
        statusClass = "bg-green-100 text-green-800";
        break;
      case "rejected":
        statusClass = "bg-red-100 text-red-800";
        break;
      case "received":
        statusClass = "bg-blue-100 text-blue-800";
        break;
      case "confirmed":
        statusClass = "bg-purple-100 text-purple-800";
        break;
      case "pending":
      default:
        statusClass = "bg-yellow-100 text-yellow-800";
        break;
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium ${statusClass} rounded-full capitalize`}>
        {displayStatus}
      </span>
    );
  },
};

// Actions column
const actionsColumn: ColumnDef<IGoodReceiveNotePaginatedData> = {
  header: "",
  accessorKey: "actions",
  size: 80,
  cell: ({ row }) => {
    return <TableMenu {...row.original} />;
  },
};

// Default columns (with status column)
export const goodReceiveNoteColumns: ColumnDef<IGoodReceiveNotePaginatedData>[] = [
  ...baseColumns,
  statusColumn,
  actionsColumn,
];

// Columns for pending GRNs tab (includes status column)
export const getPendingGRNColumns = (): ColumnDef<IGoodReceiveNotePaginatedData>[] => [
  ...baseColumns,
  statusColumn,
  {
    header: "Actions",
    accessorKey: "actions",
    size: 80,
    cell: ({ row }) => {
      return <TableMenu {...row.original} />;
    },
  },
];

// Columns for approved GRNs tab (with approved date and status)
export const getApprovedGRNColumns = (): ColumnDef<IGoodReceiveNotePaginatedData>[] => [
  ...baseColumns,
  statusColumn,
  {
    header: "Approved Date",
    id: "approved_datetime",
    size: 150,
    accessorFn: ({ approved_datetime }) =>
      approved_datetime ? format(approved_datetime, "dd-MMM-yyyy") : "N/A",
  },
  {
    header: "Actions",
    accessorKey: "actions",
    size: 80,
    cell: ({ row }) => {
      return <TableMenu {...row.original} />;
    },
  },
];

const TableMenu = ({ id, status, approved_datetime, rejected_datetime, received_datetime }: IGoodReceiveNotePaginatedData) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approvalModalState, setApprovalModalState] = useState<{
    isOpen: boolean;
    action: "received" | "accept" | "reject" | null;
  }>({
    isOpen: false,
    action: null,
  });

  const { deleteGoodReceiveNote, isLoading: isDeleting } =
    useDeleteGoodReceiveNoteMutation(id);

  const handleDelete = async () => {
    try {
      await deleteGoodReceiveNote();
      toast.success("Deleted Good Receive Note");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const openApprovalModal = (action: "received" | "accept" | "reject") => {
    setApprovalModalState({ isOpen: true, action });
  };

  const closeApprovalModal = () => {
    setApprovalModalState({ isOpen: false, action: null });
  };

  const handleApprovalSuccess = () => {
    // The modal will handle success state and refetch
    // We could add additional logic here if needed
  };

  // Check GRN status and determine available actions
  // Backend workflow: created → received → approved/rejected
  const isApproved = !!approved_datetime || status === "approved";
  const isRejected = !!rejected_datetime || status === "rejected";
  const isReceived = !!received_datetime || status === "received";
  const isCreated = status === "created" || status === "pending" || (!status && !isApproved && !isRejected);
  const isPending = status === "pending" || isCreated;
  const isConfirmed = status === "confirmed"; // Legacy status, not in backend workflow

  // Available actions based on actual backend implementation:
  // - created/pending: can use "mark-received" endpoint
  // - received: can use "approve" or "reject" endpoints
  // - approved/rejected: final states, no actions
  const canMarkReceived = isCreated && !isReceived && !isApproved && !isRejected;
  const canApproveOrReject = isReceived && !isApproved && !isRejected;

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
              href={AdminRoutes.GRN_DETAIL.replace(':id', id)}
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
                pathname: AdminRoutes.GRN_CREATE,
                search: `?id=${id}`,
              }}
              className='block w-full'
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
                disabled={isApproved || isRejected}
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>

            {/* GRN Actions - Show based on status */}
            {canMarkReceived && (
              <Button
                className='w-full flex items-center justify-start gap-2 text-blue-600 hover:text-blue-700'
                variant='ghost'
                onClick={() => openApprovalModal("received")}
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Received
              </Button>
            )}

            {canApproveOrReject && (
              <>
                <Button
                  className='w-full flex items-center justify-start gap-2 text-green-600 hover:text-green-700'
                  variant='ghost'
                  onClick={() => openApprovalModal("accept")}
                  title={isPending ? "Accept pending GRN directly" : "Accept received GRN"}
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </Button>
                <Button
                  className='w-full flex items-center justify-start gap-2 text-red-600 hover:text-red-700'
                  variant='ghost'
                  onClick={() => openApprovalModal("reject")}
                  title={isPending ? "Reject pending GRN directly" : "Reject received GRN"}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </>
            )}

            {/* Show message for GRNs with no available actions */}
            {isConfirmed && (
              <div className='w-full p-2 text-xs text-amber-600 bg-amber-50 rounded border border-amber-200'>
                ⚠️ Status "confirmed" is not supported. Expected workflow: created → received → approved/rejected
              </div>
            )}

            {!canMarkReceived && !canApproveOrReject && !isApproved && !isRejected && !isConfirmed && (
              <div className='w-full p-2 text-xs text-gray-600 bg-gray-50 rounded border border-gray-200'>
                ℹ️ No actions available for current status: {status || 'unknown'}
              </div>
            )}

            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDeleteDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title='Are you sure you want to delete this GRN?'
        loading={isDeleting}
        onCancel={() => setDeleteDialogOpen(false)}
        onOk={handleDelete}
      />

      {/* Approval Modal */}
      {approvalModalState.action && (
        <GrnApprovalModal
          isOpen={approvalModalState.isOpen}
          onClose={closeApprovalModal}
          grnId={id}
          action={approvalModalState.action}
          onSuccess={handleApprovalSuccess}
        />
      )}
    </>
  );
};
