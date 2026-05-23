"use client";

import { Button } from "@/components/ui/button";
import BreadcrumbCard from "@/components/Breadcrumb";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";
import { useMemo, useState } from "react";
import { FileDown, X } from "lucide-react";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import SearchIcon from "@/components/icons/SearchIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "./StatusBadge";

function ProcurementTracker() {
  const pathname = usePathname();
  const isAdminTracker = pathname?.includes("admin-tracker") || false;

  // Filter state
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("");

  const breadcrumbs = useMemo(
    () =>
      isAdminTracker
        ? [
            { name: "Admin", icon: true },
            { name: "Admin Tracker", icon: false },
          ]
        : [
            { name: "Procurement", icon: true },
            { name: "Procurement Tracker", icon: false },
          ],
    [isAdminTracker]
  );

  const { data, isLoading, error } = useGetAllProcurementTrackers({
    page,
    size: 20,
    status: statusFilter,
    item_type: itemTypeFilter,
    search: searchQuery,
    enabled: true,
  });

  // Debug logging
  console.log("🔍 Procurement Tracker Debug:", {
    data,
    isLoading,
    error,
    results: data?.results,
    resultsLength: data?.results?.length,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
    setPage(1);
  };

  const handleItemTypeChange = (value: string) => {
    setItemTypeFilter(value === "all" ? "" : value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setItemTypeFilter("");
    setPage(1);
  };

  return (
    <section className='min-h-screen space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className='flex items-center justify-end gap-4'>
        <Button variant='default' className='flex gap-2'>
          <FileDown size={18} />
          Download Excel
        </Button>
      </div>

      <Card className='space-y-5'>
        {/* Search and Filter Controls */}
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {/* Search Input */}
            <div className='flex items-center w-80 px-2 py-2 border rounded-lg'>
              <SearchIcon />
              <input
                placeholder='Search by item, PR number...'
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                className='ml-2 h-full w-full border-none bg-none focus:outline-none outline-none'
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <Select value={statusFilter === "" ? "all" : statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Item Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <Select value={itemTypeFilter === "" ? "all" : itemTypeFilter} onValueChange={handleItemTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="goods">Goods</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="works">Works</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || statusFilter || itemTypeFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Showing {data?.results?.length || 0} of{" "}
                {data?.pagination?.total || 0} procurement items
                {statusFilter && (
                  <span className="text-blue-600 font-medium"> with status: {statusFilter}</span>
                )}
                {itemTypeFilter && (
                  <span className="text-green-600 font-medium"> type: {itemTypeFilter}</span>
                )}
                {searchQuery && (
                  <span className="text-purple-600 font-medium"> matching "{searchQuery}"</span>
                )}
              </>
            )}
          </div>

          {/* Active Filters Indicator */}
          {(searchQuery || statusFilter || itemTypeFilter) && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {statusFilter && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Status: {statusFilter}
                </span>
              )}
              {itemTypeFilter && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Type: {itemTypeFilter}
                </span>
              )}
              {searchQuery && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Search: {searchQuery}
                </span>
              )}
            </div>
          )}
        </div>

        <DataTable
          data={data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />

        {/* Pagination Controls */}
        {data?.pagination && data.pagination.total > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Page {page} of {data.pagination.pages || 1}
              <span className="ml-2 text-gray-500">
                ({data.pagination.total} total items)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= (data.pagination.pages || 1) || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

const columns: ColumnDef<any>[] = [
  {
    header: "S/N",
    accessorKey: "id",
    size: 50,
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "PR Number",
    accessorKey: "purchase_request_number",
    size: 120,
    cell: ({ row }) => {
      const prNumber = row.original?.purchase_request_number ||
                       row.original?.pr_number ||
                       row.original?.request_number;
      return prNumber || "N/A";
    },
  },
  {
    header: "Item Description",
    accessorKey: "item_description",
    size: 250,
    cell: ({ row }) => {
      const description = row.original?.item_description ||
                          row.original?.description ||
                          row.original?.item_name;
      return description || "N/A";
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    size: 80,
    cell: ({ row }) => {
      const quantity = row.original?.quantity;
      return quantity || "N/A";
    },
  },
  {
    header: "Unit Price",
    accessorKey: "unit_price",
    size: 120,
    cell: ({ row }) => {
      const price = row.original?.unit_price || row.original?.unit_cost;
      return price ? `₦${Number(price).toLocaleString()}` : "N/A";
    },
  },
  {
    header: "Total Cost",
    accessorKey: "total_cost",
    size: 120,
    cell: ({ row }) => {
      const total = row.original?.total_cost || row.original?.total_price;
      return total ? `₦${Number(total).toLocaleString()}` : "N/A";
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 120,
    cell: ({ row }) => {
      const status = row.original?.status;
      return <StatusBadge status={status} />;
    },
  },
  {
    header: "RFQ Status",
    accessorKey: "rfq_status",
    size: 120,
    cell: ({ row }) => {
      const hasRfq = row.original?.has_rfq;
      const rfqStatus = row.original?.rfq_status;
      if (hasRfq) {
        return <StatusBadge status={rfqStatus || "completed"} />;
      }
      return <span className="text-gray-400 text-sm">No RFQ</span>;
    },
  },
  {
    header: "PO Status",
    accessorKey: "po_status",
    size: 120,
    cell: ({ row }) => {
      const hasPo = row.original?.has_po;
      const poStatus = row.original?.po_status;
      if (hasPo) {
        return <StatusBadge status={poStatus || "completed"} />;
      }
      return <span className="text-gray-400 text-sm">No PO</span>;
    },
  },
  {
    header: "GRN Status",
    accessorKey: "grn_status",
    size: 120,
    cell: ({ row }) => {
      const hasGrn = row.original?.has_grn;
      const grnStatus = row.original?.grn_status;
      if (hasGrn) {
        return <StatusBadge status={grnStatus || "completed"} />;
      }
      return <span className="text-gray-400 text-sm">No GRN</span>;
    },
  },
];

export default ProcurementTracker;