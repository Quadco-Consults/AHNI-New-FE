"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, CheckCircle, XCircle, Truck, Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  useGetSingleStoreTransfer,
  useApproveStoreTransfer,
  useRejectStoreTransfer,
  useMarkStoreTransferAsShipped,
  useMarkStoreTransferAsReceived,
} from "@/features/admin/controllers/storeTransferController";
import {
  getStoreTransferStatusColor,
  getStoreTransferStatusLabel,
  IStoreTransferItem,
} from "@/features/admin/types/inventory-management/store-transfer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const itemColumns: ColumnDef<IStoreTransferItem>[] = [
  {
    header: "Item Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {row.original.item_detail?.name || "N/A"}
          </span>
          {row.original.item_detail?.category?.name && (
            <span className="text-xs text-gray-500">
              {row.original.item_detail.category.name}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "UOM",
    cell: ({ row }) => row.original.item_detail?.uom || "N/A",
  },
  {
    header: "Qty Requested",
    cell: ({ row }) => row.original.quantity_requested || 0,
  },
  {
    header: "Qty Approved",
    cell: ({ row }) => row.original.quantity_approved || "-",
  },
  {
    header: "Qty Sent",
    cell: ({ row }) => row.original.quantity_sent || "-",
  },
  {
    header: "Qty Received",
    cell: ({ row }) => row.original.quantity_received || "-",
  },
  {
    header: "Remark",
    cell: ({ row }) => row.original.remark || "-",
  },
];

export default function StoreTransferDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [shippedDialog, setShippedDialog] = useState(false);
  const [receivedDialog, setReceivedDialog] = useState(false);

  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch data
  const { data, isLoading, refetch } = useGetSingleStoreTransfer(
    id as string || "",
    !!id
  );

  // Mutations
  const { approveStoreTransfer, isLoading: isApproving } =
    useApproveStoreTransfer(id as string || "");
  const { rejectStoreTransfer, isLoading: isRejecting } =
    useRejectStoreTransfer(id as string || "");
  const { markAsShipped, isLoading: isMarkingShipped } =
    useMarkStoreTransferAsShipped(id as string || "");
  const { markAsReceived, isLoading: isMarkingReceived } =
    useMarkStoreTransferAsReceived(id as string || "");

  const transfer = data?.data;

  const details = useMemo(() => {
    if (!transfer) return {};

    return {
      transfer_number: transfer.transfer_number,
      status: transfer.status,
      transfer_reason: transfer.transfer_reason,
      expected_delivery_date: transfer.expected_delivery_date,
      actual_delivery_date: transfer.actual_delivery_date,
      created_datetime: transfer.created_datetime,

      // Source Store
      source_store_name: transfer.source_store_detail?.name,
      source_store_code: transfer.source_store_detail?.code,
      source_store_type: transfer.source_store_detail?.store_type,
      source_store_location: transfer.source_store_detail?.location?.name,
      source_store_keeper: transfer.source_store_detail?.store_keeper
        ? `${transfer.source_store_detail.store_keeper.first_name} ${transfer.source_store_detail.store_keeper.last_name}`.trim()
        : null,

      // Destination Store
      destination_store_name: transfer.destination_store_detail?.name,
      destination_store_code: transfer.destination_store_detail?.code,
      destination_store_type: transfer.destination_store_detail?.store_type,
      destination_store_location: transfer.destination_store_detail?.location?.name,
      destination_store_keeper: transfer.destination_store_detail?.store_keeper
        ? `${transfer.destination_store_detail.store_keeper.first_name} ${transfer.destination_store_detail.store_keeper.last_name}`.trim()
        : null,

      // Workflow details
      created_by: transfer.created_by_detail?.name,
      created_by_email: transfer.created_by_detail?.email,
      approved_by: transfer.approved_by_detail?.name,
      approved_datetime: transfer.approved_datetime,
      approval_comment: transfer.approval_comment,
      rejected_by: transfer.rejected_by_detail?.name,
      rejected_datetime: transfer.rejected_datetime,
      rejection_reason: transfer.rejection_reason,
      shipped_by: transfer.shipped_by_detail?.name,
      shipped_datetime: transfer.shipped_datetime,
      shipping_comment: transfer.shipping_comment,
      received_by: transfer.received_by_detail?.name,
      received_datetime: transfer.received_datetime,
      receiving_comment: transfer.receiving_comment,

      // Items
      items: transfer.items || [],
    };
  }, [transfer]);

  // Action handlers
  const handleApprove = async () => {
    try {
      await approveStoreTransfer(comment);
      toast.success("Transfer approved successfully");
      setApproveDialog(false);
      setComment("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve transfer");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    try {
      await rejectStoreTransfer(rejectionReason);
      toast.success("Transfer rejected");
      setRejectDialog(false);
      setRejectionReason("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject transfer");
    }
  };

  const handleMarkShipped = async () => {
    try {
      await markAsShipped(comment);
      toast.success("Transfer marked as shipped");
      setShippedDialog(false);
      setComment("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark as shipped");
    }
  };

  const handleMarkReceived = async () => {
    try {
      await markAsReceived(comment);
      toast.success("Transfer marked as received");
      setReceivedDialog(false);
      setComment("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark as received");
    }
  };

  // Permission checks
  const canApprove = details.status === "pending";
  const canShip = details.status === "approved";
  const canReceive = details.status === "in_transit";
  const canEdit = details.status === "pending";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading transfer details...</p>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Transfer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(AdminRoutes.STORE_TRANSFERS)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transfer #{details.transfer_number}
          </h1>
          <p className="text-gray-600 mt-1">View store transfer details</p>
        </div>

        <div className="flex gap-2">
          {canEdit && (
            <Button
              variant="outline"
              onClick={() =>
                router.push(`${AdminRoutes.STORE_TRANSFERS_CREATE}?id=${id}`)
              }
            >
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          )}

          {canApprove && (
            <>
              <Button onClick={() => setApproveDialog(true)}>
                <CheckCircle size={16} className="mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => setRejectDialog(true)}
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </Button>
            </>
          )}

          {canShip && (
            <Button onClick={() => setShippedDialog(true)}>
              <Truck size={16} className="mr-2" />
              Mark Shipped
            </Button>
          )}

          {canReceive && (
            <Button onClick={() => setReceivedDialog(true)}>
              <Package size={16} className="mr-2" />
              Mark Received
            </Button>
          )}
        </div>
      </div>

      {/* Transfer Information */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Transfer Information</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Transfer Number</label>
              <p className="font-medium text-gray-900">
                {details.transfer_number}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStoreTransferStatusColor(
                    details.status as any
                  )}`}
                >
                  {getStoreTransferStatusLabel(details.status as any)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Created Date</label>
              <p className="font-medium text-gray-900">
                {details.created_datetime
                  ? new Date(details.created_datetime).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Created By</label>
              <p className="font-medium text-gray-900">
                {details.created_by_name || details.created_by?.full_name || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Transfer Reason</label>
            <p className="font-medium text-gray-900">
              {details.transfer_reason || "N/A"}
            </p>
          </div>

          {details.expected_delivery_date && (
            <div>
              <label className="text-sm text-gray-600">
                Expected Delivery Date
              </label>
              <p className="font-medium text-gray-900">
                {new Date(details.expected_delivery_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Source Store */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="p-4 border-b border-blue-300">
          <h3 className="font-semibold text-blue-900">📦 Source Store (From)</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-blue-700">Store Name</label>
              <p className="font-semibold text-blue-900">
                {details.source_store_name}
              </p>
            </div>
            <div>
              <label className="text-sm text-blue-700">Store Code</label>
              <p className="font-semibold text-blue-900">
                {details.source_store_code}
              </p>
            </div>
            <div>
              <label className="text-sm text-blue-700">Store Type</label>
              <p className="font-semibold text-blue-900">
                {details.source_store_type === "CENTRAL"
                  ? "Central Store"
                  : "Location Store"}
              </p>
            </div>
            <div>
              <label className="text-sm text-blue-700">Location</label>
              <p className="font-semibold text-blue-900">
                {details.source_store_location || "N/A"}
              </p>
            </div>
            {details.source_store_keeper && (
              <div>
                <label className="text-sm text-blue-700">Store Keeper</label>
                <p className="font-semibold text-blue-900">
                  {details.source_store_keeper}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Destination Store */}
      <Card className="bg-green-50 border-green-200">
        <div className="p-4 border-b border-green-300">
          <h3 className="font-semibold text-green-900">📦 Destination Store (To)</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-green-700">Store Name</label>
              <p className="font-semibold text-green-900">
                {details.destination_store_name}
              </p>
            </div>
            <div>
              <label className="text-sm text-green-700">Store Code</label>
              <p className="font-semibold text-green-900">
                {details.destination_store_code}
              </p>
            </div>
            <div>
              <label className="text-sm text-green-700">Store Type</label>
              <p className="font-semibold text-green-900">
                {details.destination_store_type === "CENTRAL"
                  ? "Central Store"
                  : "Location Store"}
              </p>
            </div>
            <div>
              <label className="text-sm text-green-700">Location</label>
              <p className="font-semibold text-green-900">
                {details.destination_store_location || "N/A"}
              </p>
            </div>
            {details.destination_store_keeper && (
              <div>
                <label className="text-sm text-green-700">Store Keeper</label>
                <p className="font-semibold text-green-900">
                  {details.destination_store_keeper}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Items Table */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Transfer Items</h3>
        </div>
        <DataTable
          columns={itemColumns}
          data={details.items}
          headClass="bg-gray-50 font-medium text-sm"
        />
      </Card>

      {/* Workflow History */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Workflow History</h3>
        </div>
        <div className="p-4 space-y-4">
          {/* Approved */}
          {details.approved_by && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-green-900">✓ Approved</p>
                  <p className="text-sm text-green-700">
                    By {details.approved_by} on{" "}
                    {details.approved_datetime &&
                      new Date(details.approved_datetime).toLocaleString()}
                  </p>
                  {details.approval_comment && (
                    <p className="text-sm text-green-600 mt-1">
                      Comment: {details.approval_comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rejected */}
          {details.rejected_by && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-red-900">✗ Rejected</p>
                  <p className="text-sm text-red-700">
                    By {details.rejected_by} on{" "}
                    {details.rejected_datetime &&
                      new Date(details.rejected_datetime).toLocaleString()}
                  </p>
                  {details.rejection_reason && (
                    <p className="text-sm text-red-600 mt-1">
                      Reason: {details.rejection_reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shipped */}
          {details.shipped_by && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-blue-900">🚚 Shipped</p>
                  <p className="text-sm text-blue-700">
                    By {details.shipped_by} on{" "}
                    {details.shipped_datetime &&
                      new Date(details.shipped_datetime).toLocaleString()}
                  </p>
                  {details.shipping_comment && (
                    <p className="text-sm text-blue-600 mt-1">
                      Comment: {details.shipping_comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Received */}
          {details.received_by && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-green-900">📦 Received</p>
                  <p className="text-sm text-green-700">
                    By {details.received_by} on{" "}
                    {details.received_datetime &&
                      new Date(details.received_datetime).toLocaleString()}
                  </p>
                  {details.receiving_comment && (
                    <p className="text-sm text-green-600 mt-1">
                      Comment: {details.receiving_comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Dialogs */}
      <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Transfer</DialogTitle>
            <DialogDescription>
              Approve transfer #{details.transfer_number}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="approve-comment">Comment (Optional)</Label>
            <Textarea
              id="approve-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter approval comment..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
            <DialogDescription>
              Reject transfer #{details.transfer_number}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="reject-reason">Rejection Reason *</Label>
            <Textarea
              id="reject-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shippedDialog} onOpenChange={setShippedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Shipped</DialogTitle>
            <DialogDescription>
              Mark transfer #{details.transfer_number} as shipped
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="shipped-comment">Comment (Optional)</Label>
            <Textarea
              id="shipped-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter shipping comment..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippedDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkShipped} disabled={isMarkingShipped}>
              {isMarkingShipped ? "Processing..." : "Mark as Shipped"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receivedDialog} onOpenChange={setReceivedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Received</DialogTitle>
            <DialogDescription>
              Mark transfer #{details.transfer_number} as received
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="received-comment">Comment (Optional)</Label>
            <Textarea
              id="received-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter receiving comment..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceivedDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkReceived} disabled={isMarkingReceived}>
              {isMarkingReceived ? "Processing..." : "Mark as Received"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
