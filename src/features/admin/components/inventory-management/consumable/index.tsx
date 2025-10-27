"use client";
import { useState } from "react";
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

  // Fetch all items without category filter for now to debug the issue
  const { data: item, isFetching } = useGetAllItemsQuery({
    page,
    size: 20,
    // Temporarily removed category filter to show all created items
    // category: CONSUMABLES_CATEGORY_ID,
  });

  // Debug logging to understand what items are being returned
  console.log("🔍 Consumables page - All items:", item?.data?.results || []);
  console.log("🔍 Consumables page - Total items count:", item?.data?.pagination?.count || 0);

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          {/* Debug notice - will be removed after proper category filtering is implemented */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Debug Mode:</strong> Showing all items (category filter temporarily disabled).
                Total items: {item?.data?.pagination?.count || 0}
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
          <DataTable
            data={item?.data.results || []}
            isLoading={isFetching}
            // @ts-ignore
            columns={consumableColums}
            pagination={{
              total: item?.data.pagination.count ?? 0,
              pageSize: item?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        categoryId={undefined}
      />

      <BulkAssignToStoreDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
      />
    </div>
  );
}
