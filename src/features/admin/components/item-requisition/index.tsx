"use client";

import AddSquareIcon from "@/components/icons/AddSquareIcon";
import Card from "@/components/Card";
import { itemRequisitionColumns } from "@/features/admin/components/table-columns/inventory-management/item-requisition";
import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useGetAllItemRequisitionsQuery } from "@/features/admin/controllers/itemRequisitionController";
import { AdminRoutes } from "@/constants/RouterConstants";

export default function ItemRequisitionHomePage() {
  const [page, setPage] = useState(1);

  const { data: itemRequisition, isFetching } = useGetAllItemRequisitionsQuery({
    page,
    size: 10,
  });

  return (
    <div className='space-y-10'>
      <div className='flex justify-end'>
        <Link href={AdminRoutes.CREATE_ITEM_REQUISITION}>
          <Button>
            <AddSquareIcon />
            Add Item Requisition
          </Button>
        </Link>
      </div>

      <Card>
        <TableFilters>
          <DataTable
            data={itemRequisition?.data.results || []}
            columns={itemRequisitionColumns}
            isLoading={isFetching}
            pagination={{
              total: itemRequisition?.data.pagination.count ?? 0,
              pageSize: itemRequisition?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </div>
  );
}
