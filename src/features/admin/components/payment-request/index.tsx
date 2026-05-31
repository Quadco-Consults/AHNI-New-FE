"use client";

import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { paymentRequestColumns } from "@/features/admin/components/table-columns/payment-request";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { AdminRoutes } from "@/constants/RouterConstants";
import { Plus, FileSpreadsheet, Settings } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAllPaymentRequestsQuery } from "@/features/admin/controllers/paymentRequestController";

export default function PaymentRequestHome() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isError } = useGetAllPaymentRequestsQuery({
    page,
    size: 10,
    search: "",
  });

  // Handle API errors gracefully
  if (isError) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-end'>
          <Link href='/dashboard/admin/payment-request/create/'>
            <Button>
              <Plus size={20} /> Raise Payment Request
            </Button>
          </Link>
        </div>

        <Card className='mt-10'>
          <div className='p-8 text-center'>
            <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-red-800 mb-2'>
                Unable to Load Payment Requests
              </h3>
              <p className='text-red-600 mb-4'>
                There&apos;s a server issue preventing payment requests from loading.
              </p>
              <div className='text-sm text-red-500 bg-red-100 p-3 rounded mb-4 text-left'>
                <strong>Technical Details:</strong><br/>
                {error?.message || 'Server returned 500 Internal Server Error'}
              </div>
              <div className='text-sm text-gray-600'>
                <p className='mb-2'><strong>What you can do:</strong></p>
                <ul className='text-left space-y-1'>
                  <li>• You can still create new payment requests using the button above</li>
                  <li>• Contact the system administrator about this database issue</li>
                  <li>• Try refreshing the page in a few minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex gap-3'>
          <Link href='/dashboard/admin/payment-request/bulk'>
            <Button variant='outline'>
              <FileSpreadsheet size={20} className='mr-2' /> Bulk Payment
            </Button>
          </Link>
          <Link href='/dashboard/admin/deduction-settings'>
            <Button variant='outline'>
              <Settings size={20} className='mr-2' /> Deduction Settings
            </Button>
          </Link>
        </div>
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
              total: data?.data?.paginator?.count ?? 0,
              pageSize: data?.data?.paginator?.page_size ?? 10,
              onChange: (page: number) => setPage(page),
            }}
          />
        </TableFilters>
      </Card>
    </>
  );
}
