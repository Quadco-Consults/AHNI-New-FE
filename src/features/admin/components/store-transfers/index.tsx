"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  useGetAllStoreTransfers,
  useDeleteStoreTransfer,
  useApproveStoreTransfer,
  useRejectStoreTransfer,
  useMarkStoreTransferAsShipped,
  useMarkStoreTransferAsReceived,
} from "@/features/admin/controllers/storeTransferController";
import { useGetAllStores } from "@/features/admin/controllers/storeController";
import { getStoreTransferColumns } from "@/features/admin/components/table-columns/inventory-management/store-transfer";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StoreTransfersList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceStoreFilter, setSourceStoreFilter] = useState("");
  const [destinationStoreFilter, setDestinationStoreFilter] = useState("");

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    transferNumber: string;
  }>({ open: false, id: "", transferNumber: "" });

  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    id: string;
    transferNumber: string;
  }>({ open: false, id: "", transferNumber: "" });

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    id: string;
    transferNumber: string;
  }>({ open: false, id: "", transferNumber: "" });

  const [shippedDialog, setShippedDialog] = useState<{
    open: boolean;
    id: string;
    transferNumber: string;
  }>({ open: false, id: "", transferNumber: "" });

  const [receivedDialog, setReceivedDialog] = useState<{
    open: boolean;
    id: string;
    transferNumber: string;
  }>({ open: false, id: "", transferNumber: "" });

  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch data
  const { data, isLoading, refetch } = useGetAllStoreTransfers({
    page,
    size: pageSize,
    search: searchTerm,
    status: statusFilter,
    source_store: sourceStoreFilter,
    destination_store: destinationStoreFilter,
  });

  // Fetch stores for filters
  const { data: storesData } = useGetAllStores({
    page: 1,
    size: 1000,
    is_active: true,
  });

  // Mutations
  const { deleteStoreTransfer, isLoading: isDeleting } = useDeleteStoreTransfer(
    deleteDialog.id
  );
  const { approveStoreTransfer, isLoading: isApproving } =
    useApproveStoreTransfer(approveDialog.id);
  const { rejectStoreTransfer, isLoading: isRejecting } =
    useRejectStoreTransfer(rejectDialog.id);
  const { markAsShipped, isLoading: isMarkingShipped } =
    useMarkStoreTransferAsShipped(shippedDialog.id);
  const { markAsReceived, isLoading: isMarkingReceived } =
    useMarkStoreTransferAsReceived(receivedDialog.id);

  // Store options
  const storeOptions = useMemo(() => {
    if (!storesData?.data?.results) return [];
    return storesData.data.results.map((store: any) => ({
      label: `${store.name} (${store.code})`,
      value: store.id,
    }));
  }, [storesData]);

  // Handlers
  const handleDelete = (id: string, transferNumber: string) => {
    setDeleteDialog({ open: true, id, transferNumber });
  };

  const confirmDelete = async () => {
    try {
      await deleteStoreTransfer();
      toast.success("Store transfer deleted successfully");
      setDeleteDialog({ open: false, id: "", transferNumber: "" });
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete store transfer");
    }
  };

  const handleApprove = (id: string, transferNumber: string) => {
    setApproveDialog({ open: true, id, transferNumber });
  };

  const confirmApprove = async () => {
    try {
      await approveStoreTransfer(comment);
      toast.success("Store transfer approved successfully");
      setApproveDialog({ open: false, id: "", transferNumber: "" });
      setComment("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to approve store transfer");
    }
  };

  const handleReject = (id: string, transferNumber: string) => {
    setRejectDialog({ open: true, id, transferNumber });
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    try {
      await rejectStoreTransfer(rejectionReason);
      toast.success("Store transfer rejected");
      setRejectDialog({ open: false, id: "", transferNumber: "" });
      setRejectionReason("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to reject store transfer");
    }
  };

  const handleMarkShipped = (id: string, transferNumber: string) => {
    setShippedDialog({ open: true, id, transferNumber });
  };

  const confirmMarkShipped = async () => {
    try {
      await markAsShipped(comment);
      toast.success("Store transfer marked as shipped");
      setShippedDialog({ open: false, id: "", transferNumber: "" });
      setComment("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark as shipped");
    }
  };

  const handleMarkReceived = (id: string, transferNumber: string) => {
    setReceivedDialog({ open: true, id, transferNumber });
  };

  const confirmMarkReceived = async () => {
    try {
      await markAsReceived(comment);
      toast.success("Store transfer marked as received");
      setReceivedDialog({ open: false, id: "", transferNumber: "" });
      setComment("");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark as received");
    }
  };

  const columns = getStoreTransferColumns({
    onDelete: handleDelete,
    onApprove: handleApprove,
    onReject: handleReject,
    onMarkShipped: handleMarkShipped,
    onMarkReceived: handleMarkReceived,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Transfers</h1>
          <p className="text-gray-600 mt-1">
            Transfer inventory between stores
          </p>
        </div>
        <Button
          onClick={() => router.push(AdminRoutes.STORE_TRANSFERS_CREATE)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Create Transfer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <input
                id="search"
                type="text"
                placeholder="Search by transfer number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source-store">From Store</Label>
              <Select
                value={sourceStoreFilter}
                onValueChange={setSourceStoreFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stores</SelectItem>
                  {storeOptions.map((store) => (
                    <SelectItem key={store.value} value={store.value}>
                      {store.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destination-store">To Store</Label>
              <Select
                value={destinationStoreFilter}
                onValueChange={setDestinationStoreFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stores</SelectItem>
                  {storeOptions.map((store) => (
                    <SelectItem key={store.value} value={store.value}>
                      {store.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={data?.data?.results || []}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          totalPages={data?.data?.paginator?.total_pages || 1}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !isDeleting && setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Store Transfer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete transfer{" "}
              <strong>{deleteDialog.transferNumber}</strong>? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: "", transferNumber: "" })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onOpenChange={(open) => !isApproving && setApproveDialog({ ...approveDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Store Transfer</DialogTitle>
            <DialogDescription>
              Approve transfer <strong>{approveDialog.transferNumber}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-comment">Comment (Optional)</Label>
              <Textarea
                id="approve-comment"
                placeholder="Enter approval comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveDialog({ open: false, id: "", transferNumber: "" });
                setComment("");
              }}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button onClick={confirmApprove} disabled={isApproving}>
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => !isRejecting && setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Store Transfer</DialogTitle>
            <DialogDescription>
              Reject transfer <strong>{rejectDialog.transferNumber}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialog({ open: false, id: "", transferNumber: "" });
                setRejectionReason("");
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Shipped Dialog */}
      <Dialog open={shippedDialog.open} onOpenChange={(open) => !isMarkingShipped && setShippedDialog({ ...shippedDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Shipped</DialogTitle>
            <DialogDescription>
              Mark transfer <strong>{shippedDialog.transferNumber}</strong> as
              shipped
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="shipped-comment">Comment (Optional)</Label>
              <Textarea
                id="shipped-comment"
                placeholder="Enter shipping comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShippedDialog({ open: false, id: "", transferNumber: "" });
                setComment("");
              }}
              disabled={isMarkingShipped}
            >
              Cancel
            </Button>
            <Button onClick={confirmMarkShipped} disabled={isMarkingShipped}>
              {isMarkingShipped ? "Processing..." : "Mark as Shipped"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Received Dialog */}
      <Dialog open={receivedDialog.open} onOpenChange={(open) => !isMarkingReceived && setReceivedDialog({ ...receivedDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Received</DialogTitle>
            <DialogDescription>
              Mark transfer <strong>{receivedDialog.transferNumber}</strong> as
              received
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="received-comment">Comment (Optional)</Label>
              <Textarea
                id="received-comment"
                placeholder="Enter receiving comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReceivedDialog({ open: false, id: "", transferNumber: "" });
                setComment("");
              }}
              disabled={isMarkingReceived}
            >
              Cancel
            </Button>
            <Button onClick={confirmMarkReceived} disabled={isMarkingReceived}>
              {isMarkingReceived ? "Processing..." : "Mark as Received"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
