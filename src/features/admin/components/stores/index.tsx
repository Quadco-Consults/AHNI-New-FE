"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { getStoreColumns } from "@/features/admin/components/table-columns/inventory-management/store";
import {
  useGetAllStores,
  useDeleteStore,
  useActivateStore,
  useDeactivateStore,
} from "@/features/admin/controllers/storeController";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminRoutes } from "@/constants/RouterConstants";

export default function StoresHomePage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleStatusId, setToggleStatusId] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<boolean>(false);

  // Fetch stores
  const { data: storesData, isFetching: isLoading } = useGetAllStores({
    page,
    size: 20,
  });

  const stores = storesData?.data?.results || [];
  const pagination = storesData?.data?.paginator;

  // Delete mutation
  const { deleteStore, isLoading: isDeleting } = useDeleteStore(deleteId || "");

  // Activate/Deactivate mutations
  const { activateStore, isLoading: isActivating } = useActivateStore(
    toggleStatusId || ""
  );
  const { deactivateStore, isLoading: isDeactivating } = useDeactivateStore(
    toggleStatusId || ""
  );

  // Handlers
  const handleView = (id: string) => {
    router.push(`${AdminRoutes.STORES}/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`${AdminRoutes.STORES}/create?id=${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      await deleteStore();
      toast.success("Store deleted successfully");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete store");
    }
  };

  const handleToggleStatusClick = (id: string, isActive: boolean) => {
    setToggleStatusId(id);
    setCurrentStatus(isActive);
  };

  const handleToggleStatusConfirm = async () => {
    if (!toggleStatusId) return;

    try {
      if (currentStatus) {
        await deactivateStore();
        toast.success("Store deactivated successfully");
      } else {
        await activateStore();
        toast.success("Store activated successfully");
      }
      setToggleStatusId(null);
    } catch (error: any) {
      toast.error(
        error?.message ||
          `Failed to ${currentStatus ? "deactivate" : "activate"} store`
      );
    }
  };

  const columns = getStoreColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
    onToggleStatus: handleToggleStatusClick,
  });

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage central and location stores for inventory management
          </p>
        </div>
        <Link href={`${AdminRoutes.STORES}/create`}>
          <Button>
            <AddSquareIcon />
            Add Store
          </Button>
        </Link>
      </div>

      {/* Stores Table */}
      <Card>
        <TableFilters>
          <DataTable
            columns={columns}
            data={stores}
            isLoading={isLoading}
            pagination={
              pagination
                ? {
                    total: pagination.count,
                    pageSize: pagination.page_size,
                    onChange: (page: number) => setPage(page),
                  }
                : undefined
            }
          />
        </TableFilters>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              store and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog
        open={!!toggleStatusId}
        onOpenChange={() => setToggleStatusId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentStatus ? "Deactivate" : "Activate"} Store?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentStatus
                ? "Deactivating this store will prevent it from being used for new transactions. Existing data will be preserved."
                : "Activating this store will make it available for transactions again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActivating || isDeactivating}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatusConfirm}
              disabled={isActivating || isDeactivating}
            >
              {isActivating || isDeactivating
                ? "Processing..."
                : currentStatus
                ? "Deactivate"
                : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
