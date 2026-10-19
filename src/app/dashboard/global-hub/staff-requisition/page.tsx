"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2, Eye, Edit, Trash2, Search, X } from "lucide-react";
import { useMyRequisitions, useDeleteStaffingRequisition, useSubmitForReview, useCancelRequisition } from "@/hooks/useStaffingRequisitions";
import { format } from "date-fns";

const STATUS_COLORS = {
  DRAFT: "bg-gray-100 text-gray-800",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
  PENDING_APPROVAL: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export default function GlobalHubStaffRequisitionPage() {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [requisitionToDelete, setRequisitionToDelete] = useState<{
    id: string;
    code: string;
  } | null>(null);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: requisitionsData, isLoading } = useMyRequisitions();
  const { mutate: deleteRequisition, isPending: isDeleting } = useDeleteStaffingRequisition();
  const { mutate: submitForReview, isPending: isSubmitting } = useSubmitForReview();
  const { mutate: cancelRequisition, isPending: isCancelling } = useCancelRequisition();

  const requisitions = requisitionsData?.data || [];

  // Filter and search logic
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((req: any) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        req.requisition_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requisitions, searchTerm, statusFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  // Handle delete confirmation
  const handleDeleteClick = (id: string, code: string) => {
    setRequisitionToDelete({ id, code });
    setDeleteDialog(true);
  };

  // Handle delete action
  const handleDelete = () => {
    if (!requisitionToDelete) return;

    deleteRequisition(requisitionToDelete.id);
    setDeleteDialog(false);
    setRequisitionToDelete(null);
  };

  // Handle submit for review
  const handleSubmitForReview = (id: string) => {
    if (confirm("Submit this requisition for review? You won't be able to edit it after submission.")) {
      submitForReview(id);
    }
  };

  // Handle cancel
  const handleCancel = (id: string) => {
    if (confirm("Cancel this requisition? This action cannot be undone.")) {
      cancelRequisition(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            My Staff Requisitions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your staffing requests
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/global-hub/staff-requisition/create")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Requisition
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by code, position, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count and Clear Filters */}
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Showing {filteredRequisitions.length} of {requisitions.length} requisitions
              {hasActiveFilters && (
                <span className="text-blue-600 ml-2">(filtered)</span>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredRequisitions && filteredRequisitions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisitions.map((req: any) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.requisition_code}</TableCell>
                  <TableCell>{format(new Date(req.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{req.position.title}</TableCell>
                  <TableCell>{req.department.name}</TableCell>
                  <TableCell>{req.number_of_staff}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        STATUS_COLORS[req.status as keyof typeof STATUS_COLORS] ||
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS] || req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${req.approval_progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{req.approval_progress || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/global-hub/staff-requisition/${req.id}`)
                        }
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Edit button - only for DRAFT status */}
                      {req.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/global-hub/staff-requisition/${req.id}/edit`)
                          }
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}

                      {/* Submit for Review button - only for DRAFT status */}
                      {req.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSubmitForReview(req.id)}
                          disabled={isSubmitting}
                          title="Submit for Review"
                          className="text-green-600 hover:text-green-700"
                        >
                          Submit
                        </Button>
                      )}

                      {/* Delete button - only for DRAFT status */}
                      {req.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(req.id, req.requisition_code)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}

                      {/* Cancel button - for non-DRAFT, non-APPROVED, non-REJECTED statuses */}
                      {req.status !== "DRAFT" &&
                       req.status !== "APPROVED" &&
                       req.status !== "REJECTED" &&
                       req.status !== "CANCELLED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(req.id)}
                          disabled={isCancelling}
                          title="Cancel Requisition"
                          className="text-orange-600 hover:text-orange-700"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {hasActiveFilters
                ? "No requisitions match your search criteria. Try adjusting your filters."
                : "You haven't created any staff requisitions yet. Click 'New Requisition' to create one."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="link"
                onClick={clearFilters}
                className="mt-2"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Staffing Requisition</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete requisition{" "}
              <span className="font-semibold">{requisitionToDelete?.code}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialog(false);
                setRequisitionToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
