"use client";

import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import Card from "@/components/Card";
import { useState } from "react";
import { assetColumn } from "@/features/admin/components/table-columns/inventory-management/asset";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import AssetBulkUploadDialog from "./BulkUploadDialog";

export default function AssetHomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const { data: asset, isLoading } = useGetAllItemsQuery({
    page,
    size: 20,
    search,
    // Remove hardcoded category filter to show all assets
    // category: "b0983944-f926-4141-8e28-093960d75246",
    // Expand all related fields to get full nested objects
    expand: "category,assignee,asset_type,project,donor,asset_condition,location,classification,implementer",
  });

  // Debug logging
  console.log('🔍 Assets Page Debug:', {
    page,
    search,
    totalCount: asset?.data?.pagination?.count,
    resultsCount: asset?.data?.results?.length,
    firstItem: asset?.data?.results?.[0]?.name,
  });

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-center gap-3'>
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search assets (Honda, Range Rover, etc.)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to page 1 when searching
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className='flex gap-3'>
          <Button
            variant="outline"
            onClick={() => setBulkUploadOpen(true)}
          >
            <Upload size={20} />
            Bulk Upload
          </Button>
          <Link href='/dashboard/admin/assets/create'>
            <Button>
              <Plus size={20} />
              Create Asset
            </Button>
          </Link>
        </div>
      </div>

      <Card className='space-y-4'>
        <TableFilters>
          <DataTable
            data={asset?.data?.results || []}
            columns={assetColumn}
            isLoading={isLoading}
            pagination={{
              total: asset?.data?.pagination?.count ?? 0,
              pageSize: asset?.data?.pagination?.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>

      <AssetBulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        categoryId="17ca9ee7-603a-43a9-91e8-979652a8231c" // Assets category is correct for bulk upload
      />
    </div>
  );
}

{
  /* <div className="flex gap-x-4 justify-end">
                <Button variant="outline">
                    <span>
                        <UploadFileSvg />
                    </span>
                    Upload
                </Button>
                <Button variant="custom">
                    <span>
                        <FileDown size={18} />
                    </span>
                    Download
                </Button>
            </div> */
}

/*   <TableFilters
                    // filterAction={<FilterAction />}
                    // leftAction={asset.length > 0 ? <AssetAction /> : ""}
                >
                    <DataTable columns={assestColum} data={drivedData} />
                </TableFilters> */
