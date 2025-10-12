"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  IStoreTransferPaginatedData,
  getStoreTransferStatusColor,
  getStoreTransferStatusLabel,
} from "@/features/admin/types/inventory-management/store-transfer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, Truck, Package } from "lucide-react";
import Link from "next/link";
import { AdminRoutes } from "@/constants/RouterConstants";

interface StoreTransferColumnsProps {
  onDelete?: (id: string, transferNumber: string) => void;
  onApprove?: (id: string, transferNumber: string) => void;
  onReject?: (id: string, transferNumber: string) => void;
  onMarkShipped?: (id: string, transferNumber: string) => void;
  onMarkReceived?: (id: string, transferNumber: string) => void;
}

export const getStoreTransferColumns = ({
  onDelete,
  onApprove,
  onReject,
  onMarkShipped,
  onMarkReceived,
}: StoreTransferColumnsProps = {}): ColumnDef<IStoreTransferPaginatedData>[] => [
  {
    accessorKey: "transfer_number",
    header: "Transfer Number",
    cell: ({ row }) => {
      const transferNumber = row.original.transfer_number;
      return (
        <Link
          href={`${AdminRoutes.STORE_TRANSFERS}/${row.original.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          {transferNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "source_store",
    header: "From Store",
    cell: ({ row }) => {
      const storeName = row.original.source_store_name || "N/A";
      const storeCode = row.original.source_store_code;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{storeName}</span>
          {storeCode && (
            <span className="text-xs text-gray-500">{storeCode}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "destination_store",
    header: "To Store",
    cell: ({ row }) => {
      const storeName = row.original.destination_store_name || "N/A";
      const storeCode = row.original.destination_store_code;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{storeName}</span>
          {storeCode && (
            <span className="text-xs text-gray-500">{storeCode}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "transfer_reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.original.transfer_reason;
      return (
        <div className="max-w-[200px] truncate" title={reason}>
          {reason}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStoreTransferStatusColor(status)}`}>
          {getStoreTransferStatusLabel(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "created_datetime",
    header: "Created Date",
    cell: ({ row }) => {
      const date = row.original.created_datetime;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "expected_delivery_date",
    header: "Expected Delivery",
    cell: ({ row }) => {
      const date = row.original.expected_delivery_date;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Not set";
    },
  },
  {
    accessorKey: "created_by_name",
    header: "Created By",
    cell: ({ row }) => {
      return row.original.created_by_name || "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transfer = row.original;
      const canApprove = transfer.status === "pending";
      const canShip = transfer.status === "approved";
      const canReceive = transfer.status === "in_transit";
      const canEdit = transfer.status === "pending";
      const canDelete = transfer.status === "pending" || transfer.status === "rejected";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link href={`${AdminRoutes.STORE_TRANSFERS}/${transfer.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>

            {canEdit && (
              <DropdownMenuItem asChild>
                <Link href={`${AdminRoutes.STORE_TRANSFERS_CREATE}?id=${transfer.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Transfer
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {canApprove && onApprove && (
              <DropdownMenuItem
                onClick={() => onApprove(transfer.id, transfer.transfer_number)}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Transfer
              </DropdownMenuItem>
            )}

            {canApprove && onReject && (
              <DropdownMenuItem
                onClick={() => onReject(transfer.id, transfer.transfer_number)}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Transfer
              </DropdownMenuItem>
            )}

            {canShip && onMarkShipped && (
              <DropdownMenuItem
                onClick={() => onMarkShipped(transfer.id, transfer.transfer_number)}
                className="text-blue-600"
              >
                <Truck className="mr-2 h-4 w-4" />
                Mark as Shipped
              </DropdownMenuItem>
            )}

            {canReceive && onMarkReceived && (
              <DropdownMenuItem
                onClick={() => onMarkReceived(transfer.id, transfer.transfer_number)}
                className="text-green-600"
              >
                <Package className="mr-2 h-4 w-4" />
                Mark as Received
              </DropdownMenuItem>
            )}

            {canDelete && onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(transfer.id, transfer.transfer_number)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Transfer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
