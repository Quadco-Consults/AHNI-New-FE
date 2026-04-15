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

  const rawStores = storesData?.data?.results || [];
  // Fix: API returns "pagination" but old code expected "paginator"
  const pagination = storesData?.data?.pagination || storesData?.data?.paginator;

  // TEMPORARY: Deduplication disabled to debug missing AHNI HQ store
  // TODO: Re-enable after finding the issue
  const stores = rawStores;

  /* DEDUPLICATION DISABLED - UNCOMMENT TO RE-ENABLE
  // IMPORTANT: This deduplication only works for the CURRENT PAGE
  // If duplicate stores exist across different pages, they won't be caught
  // TODO: Fix backend to return unique stores instead of deduplicating on frontend

  // Deduplicate stores by ID (keep the first occurrence of each unique ID)
  const uniqueStoresMap = new Map();
  rawStores.forEach((store: any) => {
    if (!uniqueStoresMap.has(store.id)) {
      uniqueStoresMap.set(store.id, store);
    }
  });

  // If we have duplicate names but different IDs, prioritize store with inventory items
  const storesByName = new Map();
  Array.from(uniqueStoresMap.values()).forEach((store: any) => {
    const existingStore = storesByName.get(store.name);
    if (!existingStore) {
      // First store with this name
      storesByName.set(store.name, store);
    } else {
      // Choose store with inventory over empty store
      const currentHasItems = store.available_items_count > 0 || store.total_stock_value > 0;
      const existingHasItems = existingStore.available_items_count > 0 || existingStore.total_stock_value > 0;

      if (currentHasItems && !existingHasItems) {
        // Current store has items, existing doesn't - use current
        console.log(`🔄 DEDUPLICATION: Replacing empty store "${existingStore.name}" (ID: ${existingStore.id}) with inventory store (ID: ${store.id})`);
        storesByName.set(store.name, store);
      } else if (!currentHasItems && existingHasItems) {
        // Existing store has items, current doesn't - keep existing
        console.log(`🔄 DEDUPLICATION: Keeping inventory store "${existingStore.name}" (ID: ${existingStore.id}) over empty store (ID: ${store.id})`);
        // Do nothing - keep existing
      } else if (currentHasItems && existingHasItems) {
        // Both have items - use the one with more items
        if (store.available_items_count > existingStore.available_items_count) {
          console.log(`🔄 DEDUPLICATION: Using store with more items "${store.name}" (ID: ${store.id}, ${store.available_items_count} items) over (ID: ${existingStore.id}, ${existingStore.available_items_count} items)`);
          storesByName.set(store.name, store);
        }
      } else {
        // Neither has items - use the more recent one (original logic)
        if (new Date(store.created_datetime) > new Date(existingStore.created_datetime)) {
          console.log(`🔄 DEDUPLICATION: Using newer empty store "${store.name}" (ID: ${store.id}) over older empty store (ID: ${existingStore.id})`);
          storesByName.set(store.name, store);
        }
      }
    }
  });

  const stores = Array.from(storesByName.values());
  */

  // Keep the original pagination count from API (total across all pages)
  // Don't adjust count based on deduplicated stores - that breaks pagination
  const adjustedPagination = pagination;

  // Debug logging for stores
  console.log("🔍 STORES DEBUG - Raw API response:", storesData);
  console.log("🔍 STORES DEBUG - Pagination info:", pagination);
  console.log("🔍 STORES DEBUG - Total count from API:", pagination?.count);
  console.log("🔍 STORES DEBUG - Current page:", page);
  console.log("🔍 STORES DEBUG - Raw stores count:", rawStores.length);
  console.log("🔍 STORES DEBUG - Final stores count:", stores.length);
  console.log("🔍 STORES DEBUG - Store details:", stores.map((store: any) => ({
    id: store.id,
    name: store.name,
    code: store.code,
    store_type: store.store_type,
    is_active: store.is_active,
    locationName: store.locationName,
    parentStoreName: store.parentStoreName
  })));

  // Check for duplicates in raw data
  const rawStoreNames = rawStores.map((store: any) => store.name);
  const rawDuplicateNames = rawStoreNames.filter((name: string, index: number) => rawStoreNames.indexOf(name) !== index);
  if (rawDuplicateNames.length > 0) {
    console.log("⚠️ RAW DUPLICATE STORE NAMES DETECTED:", rawDuplicateNames);

    // Show all duplicate stores with their details
    rawDuplicateNames.forEach((duplicateName: string) => {
      const duplicateStores = rawStores.filter((store: any) => store.name === duplicateName);
      console.log(`🔍 Raw stores with name "${duplicateName}":`, duplicateStores.map((store: any) => ({
        id: store.id,
        name: store.name,
        code: store.code,
        store_type: store.store_type,
        is_active: store.is_active,
        created_datetime: store.created_datetime
      })));
    });
  }

  // Check if deduplication worked
  const finalStoreNames = stores.map((store: any) => store.name);
  const finalDuplicateNames = finalStoreNames.filter((name: string, index: number) => finalStoreNames.indexOf(name) !== index);
  if (finalDuplicateNames.length === 0) {
    console.log("✅ DEDUPLICATION SUCCESSFUL - No duplicate names in final array");
  } else {
    console.log("❌ DEDUPLICATION FAILED - Still have duplicates:", finalDuplicateNames);
  }

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
              adjustedPagination
                ? {
                    page: page,
                    total: adjustedPagination.count,
                    pageSize: adjustedPagination.page_size,
                    onChange: (newPage: number) => setPage(newPage),
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
