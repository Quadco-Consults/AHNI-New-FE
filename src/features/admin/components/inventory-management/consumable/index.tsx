"use client";
import { useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/Table/DataTable";
import { consumableColums } from "@/features/admin/components/table-columns/inventory-management/consumables";
import TableFilters from "@/components/Table/TableFilters";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";

export default function ConsumablesHomePage() {
  const [page, setPage] = useState(1);

  const { data: item, isFetching } = useGetAllItemsQuery({
    page,
    size: 20,
    category: "fadb6228-23de-4b04-9eac-b75940cf622f",
  });

  return (
    <div className="space-y-10">
      <Card className="space-y-10">
        <div className="space-y-5">
          <div className="flex justify-end">
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
    </div>
  );
}
