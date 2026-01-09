"use client";
import { useState, useMemo, useEffect } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Store } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/Table/DataTable";
import { consumableColums } from "@/features/admin/components/table-columns/inventory-management/consumables";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import BulkUploadDialog from "./BulkUploadDialog";
import BulkAssignToStoreDialog from "./BulkAssignToStoreDialog";

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);

  // Pagination settings
  const ITEMS_PER_PAGE = 15;

  // Use items endpoint with parent_category filter for consumables
  const { data: consumablesData, isFetching } = useGetAllItemsQuery({
    page: page,
    size: ITEMS_PER_PAGE,
    search: "",
    expand: "store_stocks,store_stocks.store_detail,store_stocks.store_detail.location,category",
    parent_category: "Consumables", // Filter by parent category
    enabled: true,
  });

  // Check if API returned valid data with results
  const hasResults = consumablesData?.data?.results && consumablesData.data.results.length > 0;

  // Use the consumables data directly
  const item = consumablesData;

  const isLoading = isFetching;

  // Debug API response
  console.log("🔍 CONSUMABLES API DEBUG", {
    data: consumablesData,
    isFetching,
    hasData: !!consumablesData?.data,
    hasResults,
    dataLength: consumablesData?.data?.results?.length || 0
  });

  // Process consumables for display
  const filteredConsumables = useMemo(() => {
    if (!item?.data?.results) {
      return [];
    }

    // Process items with store stocks data
    return item.data.results.map((consumableItem: any) => {
      const storeStocks = consumableItem.store_stocks || [];
      const totalQuantity = storeStocks.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0);
      const totalAvailable = storeStocks.reduce((sum: number, stock: any) => sum + (stock.available_quantity || 0), 0);

      return {
        ...consumableItem,
        store_stocks: storeStocks,
        total_quantity: totalQuantity,
        total_available: totalAvailable,
        stores_count: storeStocks.length,
        quantity: totalQuantity,
        available_quantity: totalAvailable,
      };
    });
  }, [item?.data?.results]);

  // Server-side pagination - no client-side slicing needed
  const displayedConsumables = filteredConsumables;

  // Calculate total pages from API response
  const totalPages = Math.ceil((item?.data?.pagination?.count || item?.data?.paginator?.count || 0) / ITEMS_PER_PAGE);
  const totalItems = item?.data?.pagination?.count || item?.data?.paginator?.count || 0;

  console.log("🔍 SERVER-SIDE PAGINATION DEBUG", {
    currentPage: page,
    itemsPerPage: ITEMS_PER_PAGE,
    displayedItems: displayedConsumables.length,
    totalItems: totalItems,
    totalPages: totalPages,
    apiPaginationData: item?.data?.pagination || item?.data?.paginator,
    sampleDisplayedItems: displayedConsumables.slice(0, 2).map(item => ({
      name: item.name,
      id: item.id,
      stores_count: item.stores_count,
      total_quantity: item.total_quantity
    }))
  });

  // Reset to page 1 when API data changes (e.g., when user access changes)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalItems, page, totalPages]);

  // Debug logging
  console.log("🔍 CONSUMABLES DEBUG", {
    totalItems,
    displayedCount: displayedConsumables.length,
    isLoading,
    page,
    totalPages
  });

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          {/* Debug notice */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>API Status:</strong> {hasResults ? '✅ Items API (Active)' : '⚠️ No Results'} |
                Total items: {totalItems} |
                Consumables shown: {displayedConsumables.length} |
                Page: {page}/{totalPages} ({ITEMS_PER_PAGE} per page)
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setBulkAssignOpen(true)}
            >
              <Store size={20} />
              Assign to Store
            </Button>
            <Button
              variant="outline"
              onClick={() => setBulkUploadOpen(true)}
            >
              <Upload size={20} />
              Bulk Upload
            </Button>
            <Link href="/dashboard/admin/inventory-management/consumable/create">
              <Button>
                <Plus size={20} />
                Add Consumable
              </Button>
            </Link>
          </div>
        </div>
        <TableFilters>
          {/* Additional debugging for table data */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <strong>TABLE DEBUG:</strong>
              Passing {displayedConsumables.length} items to DataTable |
              isLoading: {isLoading ? 'true' : 'false'} |
              Columns: {consumableColums.length} |
              Total from API: {totalItems} |
              Sample item keys: {displayedConsumables[0] ? Object.keys(displayedConsumables[0]).join(', ') : 'No items'}
            </div>
          )}
          <DataTable
            data={displayedConsumables}
            isLoading={isLoading}
            // @ts-ignore
            columns={consumableColums}
            pagination={{
              total: totalItems,
              pageSize: ITEMS_PER_PAGE,
              current: page,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        categoryId={undefined} // Uses smart category detection now
      />

      <BulkAssignToStoreDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
      />
    </div>
  );
}
