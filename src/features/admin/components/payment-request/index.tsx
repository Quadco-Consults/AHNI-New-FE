"use client";

import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { paymentRequestColumns } from "@/features/admin/components/table-columns/payment-request";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllPaymentRequestsQuery } from "@/features/admin/controllers/paymentRequestController";

export default function PaymentRequestHome() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllPaymentRequestsQuery({
    page,
    size: 10,
    search: "",
  });

  return (
    <>
      <div className='flex justify-end'>
        <Link href='/dashboard/admin/payment-request/create/'>
          <Button>
            <Plus size={20} /> Raise Payment Request
          </Button>
        </Link>
      </div>

      <Card className='mt-10'>
        <TableFilters>
          <DataTable
            columns={paymentRequestColumns}
            data={data?.data.results || []}
            isLoading={isLoading}
            pagination={{
              total: data?.data.pagination.count ?? 0,
              pageSize: data?.data.pagination.page_size ?? 0,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </>
  );
}
