"use client";
import { useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/Table/DataTable";
import { consumableColums } from "@/features/admin/components/table-columns/inventory-management/consumables";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import BulkUploadDialog from "./BulkUploadDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch categories
  const { data: categories } = useGetAllCategories({
    page: 1,
    size: 1000,
    search: "",
  });

  const { data: item, isFetching } = useGetAllItemsQuery({
    page,
    size: 20,
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value);
                setPage(1); // Reset to first page when category changes
              }}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.data.results.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
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
        categoryId={selectedCategory}
      />
    </div>
  );
}
