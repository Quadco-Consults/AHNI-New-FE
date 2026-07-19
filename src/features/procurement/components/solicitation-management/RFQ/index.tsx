"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import Card from "@/components/Card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { RouteEnum } from "@/constants/RouterConstants";
import { Loading } from "@/components/Loading";
import { useGetAllSolicitations } from "@/features/procurement/controllers/solicitationController";
import { useState, useMemo } from "react";
import DataTable from "@/components/Table/DataTable";
import { createRFQColumns } from "./rfq-columns";
import { parseISO, differenceInDays } from "date-fns";

const RFQ = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isFetching, error } = useGetAllSolicitations({
    page,
    size: 10,
    request_type: "REQUEST FOR QUOTATION", // Filter for RFQ solicitations only
    job_category: "GOODS", // Always filter for goods only in procurement
  });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!data?.data?.results) return [];

    if (!searchTerm) return data.data.results;

    return data.data.results.filter((rfq: any) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        rfq.rfq_id?.toLowerCase().includes(searchLower) ||
        rfq.title?.toLowerCase().includes(searchLower) ||
        rfq.tender_type?.toLowerCase().includes(searchLower)
      );
    });
  }, [data?.data?.results, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data?.data?.results) {
      return { total: 0, open: 0, closingSoon: 0, closed: 0 };
    }

    const total = data.data.results.length;
    const open = data.data.results.filter((rfq: any) => rfq.status === "OPEN").length;
    const closed = data.data.results.filter((rfq: any) => rfq.status === "CLOSED").length;

    // Count RFQs closing soon (within 7 days)
    const closingSoon = data.data.results.filter((rfq: any) => {
      if (rfq.status !== "OPEN" || !rfq.closing_date) return false;
      try {
        const closingDate = parseISO(rfq.closing_date);
        const daysRemaining = differenceInDays(closingDate, new Date());
        return daysRemaining > 0 && daysRemaining <= 7;
      } catch {
        return false;
      }
    }).length;

    return { total, open, closingSoon, closed };
  }, [data?.data?.results]);

  const columns = createRFQColumns({
    onView: (id) => {
      window.location.href = RouteEnum.RFQ_DETAILS.replace(":id", id);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  // Show error state if there's an API error
  if (error) {
    return (
      <div className='space-y-10'>
        <div>
          <h4 className='text-lg font-bold'>Request For Quotations</h4>
          <h6>
            Procurement -{" "}
            <span className='font-medium text-black dark:text-grey-dark'>
              Request For Quotations (Goods)
            </span>
          </h6>
        </div>
        <div className='p-10 bg-red-50 rounded-2xl'>
          <h3 className='text-red-600 font-semibold'>Error Loading RFQs</h3>
          <p className='text-red-500'>{error?.message || 'Failed to load RFQ data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h4 className='text-lg font-bold'>Request For Quotations</h4>
        <h6>
          Procurement -{" "}
          <span className='font-medium text-black dark:text-grey-dark'>
            Request For Quotations (Goods)
          </span>
        </h6>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Total RFQs</p>
            <p className='text-2xl font-bold'>{stats.total}</p>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Open</p>
            <p className='text-2xl font-bold text-green-600'>{stats.open}</p>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Closing Soon</p>
            <p className='text-2xl font-bold text-orange-600'>{stats.closingSoon}</p>
          </div>
        </Card>
        <Card className='p-5'>
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>Closed</p>
            <p className='text-2xl font-bold text-red-600'>{stats.closed}</p>
          </div>
        </Card>
      </div>

      {/* Table Card */}
      <Card className='space-y-6'>
        <div className='flex items-center justify-between gap-4'>
          {/* Search */}
          <div className='border w-1/3 py-2 px-2 flex items-center rounded-lg'>
            <Icon icon='iconamoon:search-light' fontSize={25} />
            <Input
              placeholder='Search RFQs by number, title, or type...'
              type='search'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-6 border-none bg-none'
            />
          </div>

          {/* Create Button */}
          <Link href={RouteEnum.RFQ_CREATE_QUOTATION}>
            <Button>
              <Plus size={15} className="mr-1" />
              Create New RFQ
            </Button>
          </Link>
        </div>

        {/* Data Table */}
        {isFetching ? (
          <div className='flex justify-center items-center py-20'>
            <Loading />
          </div>
        ) : filteredData.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isFetching}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon icon="ph:file-text-duotone" fontSize={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm ? "No RFQs Found" : "No RFQs Yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              {searchTerm
                ? `No RFQs match your search "${searchTerm}". Try different keywords.`
                : "Get started by creating your first Request for Quotation."}
            </p>
            {!searchTerm && (
              <Link href={RouteEnum.RFQ_CREATE_QUOTATION}>
                <Button variant="outline">
                  <Plus size={16} className="mr-2" />
                  Create First RFQ
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Pagination Info */}
        {data?.data?.pagination && (
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
            <div>
              Showing {filteredData.length} of {data.data.pagination.count} RFQs
            </div>
            <div className="flex items-center gap-2">
              <span>Page {page} of {Math.ceil(data.data.pagination.count / (data.data.pagination.page_size || 10))}</span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(data.data.pagination.count / (data.data.pagination.page_size || 10))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RFQ;
