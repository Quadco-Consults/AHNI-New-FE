"use client";

import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Card from "@/components/Card";
import { useState } from "react";
import { assetColumn } from "@/features/admin/components/table-columns/inventory-management/asset";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";

export default function AssetHomePage() {
  const [page, setPage] = useState(1);

  const { data: asset, isLoading } = useGetAllItemsQuery({
    page,
    size: 20,
    search: "",
    category: "17ca9ee7-603a-43a9-91e8-979652a8231c",
  });

  return (
    <div className='space-y-5'>
      <div className='flex justify-end'>
        <Link href='/dashboard/admin/assets/create'>
          <Button>
            <Plus size={20} />
            Create Asset
          </Button>
        </Link>
      </div>

      <Card className='space-y-4'>
        <TableFilters>
          <DataTable
            data={asset?.data?.results || []}
            columns={assetColumn}
            isLoading={isLoading}
            pagination={{
              total: asset?.data.pagination.count ?? 0,
              pageSize: asset?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
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
