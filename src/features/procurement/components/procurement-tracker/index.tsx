"use client";

import { Button } from "@/components/ui/button";
import BreadcrumbCard from "@/components/Breadcrumb";
import {
  useGetAllProcurementTrackers,
  useUpdateProcurementTrackerRemarks
} from "@/features/procurement/controllers/procurementTrackerController";
import { useMemo, useState, useCallback } from "react";
import {
  FileDown,
  X,
  Pencil,
  Check,
  XCircle,
  Settings2,
  ChevronDown,
  ChevronUp,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Star,
  Loader2
} from "lucide-react";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import SearchIcon from "@/components/icons/SearchIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "./StatusBadge";

function ProcurementTracker() {
  const pathname = usePathname();
  const isAdminTracker = pathname?.includes("admin-tracker") || false;

  // Filter state
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemTypeFilter, setItemTypeFilter] = useState("");

  // UI State
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    sn: true,
    donor: true,
    activity: true,
    location: true,
    procurement_officer: true,
    pr_reference: true,
    request_date: true,
    item_category: true,
    date_goods_required: true,
    date_procurement_initiated: true,
    fco: true,
    item_name: true,
    uom: true,
    quantity: true,
    procurement_process: true,
    pr_value: true,
    po_reference: true,
    po_value: true,
    actual_payment: true,
    savings: true,
    currency: true,
    supplier: true,
    delivery_due: true,
    delivery_received: true,
    grn_no: true,
    vendor_rating: true,
    status: true,
    remarks: true,
  });

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

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const activeFilterCount = [searchQuery, statusFilter, itemTypeFilter].filter(Boolean).length;

  return (
    <section className='min-h-screen space-y-6'>
      <BreadcrumbCard list={breadcrumbs} />

      {/* Enhanced Header with Stats */}
      <div className='bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 rounded-xl shadow-2xl border border-indigo-800/50'>
        <div className='px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex-1'>
              <h1 className='text-2xl font-black text-white tracking-wide uppercase mb-2'>
                AHNi CONSOLIDATED PROCUREMENT TRACKER
              </h1>
              <p className='text-blue-100 text-sm'>
                Real-time procurement monitoring and performance analytics
              </p>
            </div>

            {/* Quick Stats */}
            {!isLoading && data?.pagination && (
              <div className='flex items-center gap-4'>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20'>
                  <div className='text-white/80 text-xs uppercase tracking-wide mb-1'>Total Items</div>
                  <div className='text-white text-2xl font-bold'>{data.pagination.count}</div>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20'>
                  <div className='text-white/80 text-xs uppercase tracking-wide mb-1'>Current Page</div>
                  <div className='text-white text-2xl font-bold'>{page}/{data.pagination.total_pages}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className='flex items-center gap-2'
          >
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className='ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                {activeFilterCount}
              </span>
            )}
            {isFilterPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsColumnSettingsOpen(!isColumnSettingsOpen)}
            className='flex items-center gap-2'
          >
            <Settings2 size={16} />
            Columns
          </Button>
        </div>

        <Button variant='default' className='flex gap-2'>
          <FileDown size={18} />
          Export to Excel
        </Button>
      </div>

      {/* Collapsible Filter Panel */}
      {isFilterPanelOpen && (
        <Card className='space-y-4 bg-gray-50/50 border-2 border-dashed'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-gray-700 flex items-center gap-2'>
              <Filter size={18} className='text-blue-600' />
              Filter & Search Options
            </h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <X size={16} />
                Clear All ({activeFilterCount})
              </Button>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Search Input */}
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>
                Search
              </label>
              <div className='flex items-center px-3 py-2 border-2 rounded-lg bg-white hover:border-blue-400 focus-within:border-blue-500 transition-colors'>
                <SearchIcon />
                <input
                  placeholder='Search by item, PR number...'
                  type='text'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='ml-2 h-full w-full border-none bg-none focus:outline-none outline-none'
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className='text-gray-400 hover:text-gray-600'>
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>
                Procurement Status
              </label>
              <Select value={statusFilter === "" ? "all" : statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full border-2 hover:border-blue-400">
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
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-medium text-gray-600 uppercase tracking-wide'>
                Item Category
              </label>
              <Select value={itemTypeFilter === "" ? "all" : itemTypeFilter} onValueChange={handleItemTypeChange}>
                <SelectTrigger className="w-full border-2 hover:border-blue-400">
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

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-xs font-medium text-gray-600">Active Filters:</span>
              {statusFilter && (
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  Status: {statusFilter}
                </span>
              )}
              {itemTypeFilter && (
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  Type: {itemTypeFilter}
                </span>
              )}
              {searchQuery && (
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Column Settings Panel */}
      {isColumnSettingsOpen && (
        <Card className='bg-amber-50/50 border-2 border-dashed border-amber-200'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-gray-700 flex items-center gap-2'>
              <Settings2 size={18} className='text-amber-600' />
              Column Visibility
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsColumnSettingsOpen(false)}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Close
            </Button>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {Object.entries(visibleColumns).map(([key, isVisible]) => (
              <div key={key} className='flex items-center gap-2 p-2 rounded hover:bg-white transition-colors'>
                <Checkbox
                  id={key}
                  checked={isVisible}
                  onCheckedChange={() => toggleColumn(key)}
                />
                <label
                  htmlFor={key}
                  className='text-sm cursor-pointer capitalize'
                >
                  {key.replace(/_/g, ' ')}
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className='space-y-5'>
        {/* Results Summary */}
        <div className="flex items-center justify-between py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <Package size={20} className='text-blue-600' />
            <div className="text-sm text-gray-700">
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 size={16} className='animate-spin text-blue-600' />
                  <span>Loading procurement data...</span>
                </div>
              ) : (
                <div>
                  Showing <span className='font-bold text-blue-600'>{data?.results?.length || 0}</span> of{" "}
                  <span className='font-bold text-gray-900'>{data?.pagination?.count || 0}</span> procurement items
                  {statusFilter && (
                    <span className="text-blue-600 font-medium"> • Status: {statusFilter}</span>
                  )}
                  {itemTypeFilter && (
                    <span className="text-green-600 font-medium"> • Type: {itemTypeFilter}</span>
                  )}
                  {searchQuery && (
                    <span className="text-purple-600 font-medium"> • Matching "{searchQuery}"</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Badge */}
          {!isLoading && data?.results && data.results.length > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-xs bg-white px-3 py-1 rounded-full border border-blue-200 font-medium text-gray-600'>
                Page {page} of {data.pagination.total_pages || 1}
              </span>
            </div>
          )}
        </div>

        {/* Skeleton Loading State */}
        {isLoading ? (
          <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse'>
                <div className='h-4 w-12 bg-gray-300 rounded'></div>
                <div className='h-4 w-32 bg-gray-300 rounded'></div>
                <div className='h-4 w-48 bg-gray-300 rounded'></div>
                <div className='h-4 flex-1 bg-gray-300 rounded'></div>
                <div className='h-4 w-24 bg-gray-300 rounded'></div>
              </div>
            ))}
          </div>
        ) : data?.results && data.results.length > 0 ? (
          <DataTable
            data={data.results}
            columns={columns}
            isLoading={false}
          />
        ) : (
          /* Empty State */
          <div className='flex flex-col items-center justify-center py-16 px-4'>
            <div className='bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-6 mb-6'>
              <Package size={64} className='text-blue-600' />
            </div>
            <h3 className='text-xl font-bold text-gray-700 mb-2'>
              No Procurement Items Found
            </h3>
            <p className='text-gray-500 text-center mb-6 max-w-md'>
              {activeFilterCount > 0
                ? "No items match your current filters. Try adjusting your search criteria."
                : "No procurement items have been created yet. Create your first purchase request to get started."}
            </p>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className='flex items-center gap-2'
              >
                <X size={16} />
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {data?.pagination && data.pagination.count > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Page {page} of {data.pagination.total_pages || 1}
              <span className="ml-2 text-gray-500">
                ({data.pagination.count} total items)
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
                disabled={page >= (data.pagination.total_pages || 1) || isLoading}
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

// Editable Remarks Cell Component
function EditableRemarksCell({ row }: { row: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(row.original?.remarks || row.original?.notes || "");
  const updateRemarksMutation = useUpdateProcurementTrackerRemarks();

  const itemId = row.original?.id;
  const sourceType = row.original?.source_type || "pr_item"; // Default to pr_item for backwards compatibility

  const handleSave = useCallback(async () => {
    if (!itemId) {
      console.error("No item ID found for this row");
      return;
    }

    try {
      await updateRemarksMutation.mutateAsync({
        itemId,
        sourceType,
        remarks: value,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save remarks:", error);
      // Reset value on error
      setValue(row.original?.remarks || row.original?.notes || "");
    }
  }, [itemId, sourceType, value, updateRemarksMutation, row.original]);

  const handleCancel = useCallback(() => {
    setValue(row.original?.remarks || row.original?.notes || "");
    setIsEditing(false);
  }, [row.original]);

  if (!isEditing) {
    return (
      <div className="group flex items-center gap-2 w-full">
        <span className="text-sm truncate flex-1" title={value || "-"}>
          {value || <span className="text-gray-400">-</span>}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
          title="Edit remarks"
        >
          <Pencil size={14} className="text-blue-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Add remarks..."
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") handleCancel();
        }}
      />
      <button
        onClick={handleSave}
        disabled={updateRemarksMutation.isPending}
        className="p-1 hover:bg-green-100 rounded disabled:opacity-50"
        title="Save"
      >
        <Check size={16} className="text-green-600" />
      </button>
      <button
        onClick={handleCancel}
        disabled={updateRemarksMutation.isPending}
        className="p-1 hover:bg-red-100 rounded disabled:opacity-50"
        title="Cancel"
      >
        <XCircle size={16} className="text-red-600" />
      </button>
    </div>
  );
}

const columns: ColumnDef<any>[] = [
  // ============================================================================
  // PROCUREMENT PROCESS STAGE (Group Header)
  // ============================================================================
  {
    id: 'procurement_process_group',
    header: () => (
      <div className="bg-gradient-to-r from-blue-100 to-blue-200 py-3 px-2 border-r-4 border-blue-600">
        <div className="text-sm font-bold text-blue-900 text-center uppercase tracking-wide">
          PROCUREMENT PROCESS STAGE
        </div>
        <div className="text-xs text-blue-800 text-center mt-1">
          (to be completed once supplier has been selected)
        </div>
      </div>
    ),
    columns: [
      // ============================================================================
      // PROCUREMENT PROCESS STAGE - 22 columns: S/N → Supplier
      // ============================================================================
      {
        header: "S/N",
        accessorKey: "id",
        size: 50,
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Donor Name",
        accessorKey: "donor",
        size: 120,
        cell: ({ row }) => row.original?.donor || "N/A",
      },
      {
        header: "Activity",
        accessorKey: "activity",
        size: 150,
        cell: ({ row }) => {
          // Activity from activity memo during PR creation
          const activity = row.original?.activity || row.original?.program_requesting;
          return activity || "N/A";
        },
      },
      {
        header: "Office Requesting",
        accessorKey: "location",
        size: 120,
        cell: ({ row }) => {
          // Location is the office requesting
          const location = row.original?.location;
          return location || "N/A";
        },
      },
      {
        header: "Procurement Officer",
        accessorKey: "procurement_officer",
        size: 130,
        cell: ({ row }) => row.original?.procurement_officer || "N/A",
      },
      {
        header: "PR No.",
        accessorKey: "pr_reference",
        size: 130,
        cell: ({ row }) => row.original?.pr_reference || "N/A",
      },
      {
        header: "Date PR Received",
        accessorKey: "request_date",
        size: 120,
        cell: ({ row }) => {
          const date = row.original?.request_date;
          return date ? new Date(date).toLocaleDateString() : "N/A";
        },
      },
      {
        header: "Item Category",
        accessorKey: "item_category",
        size: 120,
        cell: ({ row }) => row.original?.item_category || row.original?.item_type || "N/A",
      },
      {
        header: "Date Goods Required",
        accessorKey: "date_goods_required",
        size: 130,
        cell: ({ row }) => {
          const date = row.original?.date_goods_required || row.original?.required_date;
          return date ? new Date(date).toLocaleDateString() : "N/A";
        },
      },
      {
        header: "Date Procurement Initiated",
        accessorKey: "solicitation.date_procurement_initiated",
        size: 140,
        cell: ({ row }) => {
          const date = row.original?.solicitation?.date_procurement_initiated;
          if (!date) return <span className="text-gray-400 text-xs">-</span>;
          return new Date(date).toLocaleDateString();
        },
      },
      {
        header: "FCO",
        accessorKey: "purchase_order.fco_number",
        size: 120,
        cell: ({ row }) => {
          const fcoNumber = row.original?.purchase_order?.fco_number;
          const fco = row.original?.purchase_order?.fco;

          // Show fco_number if available, otherwise show fco if it's not a UUID
          if (fcoNumber) return fcoNumber;

          // Check if fco is a UUID (don't display UUIDs)
          if (fco && !fco.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            return fco;
          }

          return <span className="text-gray-400 text-xs">-</span>;
        },
      },
      {
        header: "Description of Goods/Services",
        accessorKey: "item_name",
        size: 350,
        cell: ({ row }) => {
          const itemName = row.original?.item_name;
          if (!itemName) return <span className="text-gray-400 text-xs">N/A</span>;

          // If it contains commas, it's multiple items - display as a list
          if (itemName.includes(',')) {
            const items = itemName.split(',').map(item => item.trim());
            return (
              <div className="space-y-1">
                {items.map((item, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-1">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="flex-1">{item}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Single item - display normally
          return <span className="text-sm" title={itemName}>{itemName}</span>;
        },
      },
      {
        header: "Unit",
        accessorKey: "uom",
        size: 120,
        cell: ({ row }) => {
          const uom = row.original?.uom;
          if (!uom) return <span className="text-gray-400 text-xs">N/A</span>;

          // If it contains commas, it's multiple UOMs - display as a list
          if (uom.includes(',')) {
            const uoms = uom.split(',').map(u => u.trim());
            return (
              <div className="space-y-1">
                {uoms.map((unit, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-1">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="flex-1">{unit}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Single UOM - display normally
          return <span className="text-sm" title={uom}>{uom}</span>;
        },
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        size: 100,
        cell: ({ row }) => {
          const quantity = row.original?.quantity;
          if (!quantity) return <span className="text-gray-400 text-xs">N/A</span>;

          // If it contains commas, it's multiple quantities - display as a list
          if (String(quantity).includes(',')) {
            const quantities = String(quantity).split(',').map(q => q.trim());
            return (
              <div className="space-y-1">
                {quantities.map((qty, idx) => (
                  <div key={idx} className="text-xs flex items-start gap-1">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="flex-1">{qty}</span>
                  </div>
                ))}
              </div>
            );
          }

          // Single quantity - display normally
          return <span className="text-sm" title={String(quantity)}>{quantity}</span>;
        },
      },
      {
        header: "Procurement Process",
        accessorKey: "solicitation.request_type",
        size: 140,
        cell: ({ row }) => {
          const type = row.original?.solicitation?.request_type || row.original?.solicitation?.tender_type;
          return type || <span className="text-gray-400 text-xs">-</span>;
        },
      },
      {
        header: "Estimated PR Value (NGN)",
        accessorKey: "purchase_request_value",
        size: 140,
        cell: ({ row }) => {
          const value = row.original?.purchase_request_value;
          if (!value) return <span className="text-gray-400 text-xs">-</span>;
          return `₦${Number(value).toLocaleString()}`;
        },
      },
      {
        header: "Purchase Order No",
        accessorKey: "purchase_order.po_reference",
        size: 140,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          if (!po) return <span className="text-gray-400 text-xs">Not Created</span>;
          return po.po_reference || "N/A";
        },
      },
      {
        header: "PO Value (NGN)",
        accessorKey: "purchase_order.sub_total_amount",
        size: 130,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          const poValue = po?.sub_total_amount || po?.total_price;
          if (!poValue) return <span className="text-gray-400 text-xs">-</span>;
          return `₦${Number(poValue).toLocaleString()}`;
        },
      },
      {
        header: "Actual Payment Value (NGN)",
        accessorKey: "actual_payment_amount",
        size: 150,
        cell: ({ row }) => {
          // Extract from nested payment_request or root level
          const amount = row.original?.actual_payment_amount ||
                        row.original?.purchase_order?.payment_request?.total_amount;
          if (!amount) return <span className="text-gray-400 text-xs">-</span>;
          return `₦${Number(amount).toLocaleString()}`;
        },
      },
      {
        header: "Savings (+/-)",
        accessorKey: "savings",
        size: 110,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          const poValue = po?.sub_total_amount || po?.total_price;
          const prValue = row.original?.purchase_request_value;

          if (!poValue || !prValue) {
            return <span className="text-gray-400 text-xs">-</span>;
          }

          const savings = Number(prValue) - Number(poValue);
          const colorClass = savings > 0 ? 'text-green-600' : savings < 0 ? 'text-red-600' : 'text-gray-600';

          return (
            <span className={`text-sm font-medium ${colorClass}`}>
              {savings > 0 ? '+' : ''}₦{Math.abs(savings).toLocaleString()}
            </span>
          );
        },
      },
      {
        header: "Currency",
        accessorKey: "currency",
        size: 80,
        cell: () => "NGN",
      },
      {
        header: "Supplier",
        accessorKey: "purchase_order.vendor_name",
        size: 150,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          // Get vendor name from PO
          const vendorName = po?.vendor_name || po?.vendor;
          if (!vendorName) return <span className="text-gray-400 text-xs">-</span>;
          return vendorName;
        },
      },
    ], // End of PROCUREMENT PROCESS STAGE columns
  },

  // ============================================================================
  // DELIVERY STAGE AND VENDOR PERFORMANCE MANAGEMENT (Group Header)
  // ============================================================================
  {
    id: 'delivery_stage_group',
    header: () => (
      <div className="bg-gradient-to-r from-green-100 to-green-200 py-3 px-2">
        <div className="text-sm font-bold text-green-900 text-center uppercase tracking-wide">
          DELIVERY STAGE AND VENDOR PERFORMANCE MANAGEMENT
        </div>
        <div className="text-xs text-green-800 text-center mt-1">
          (To be completed once goods or services is delivered)
        </div>
      </div>
    ),
    columns: [
      // ============================================================================
      // DELIVERY STAGE - 6 columns: Date Delivery Due → Remarks
      // ============================================================================
      {
        header: "Date Delivery Due",
        accessorKey: "purchase_order.delivery_due_date",
        size: 130,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          if (!po?.delivery_due_date) return <span className="text-gray-400 text-xs">-</span>;
          return new Date(po.delivery_due_date).toLocaleDateString();
        },
      },
      {
        header: "Date Delivery Received",
        accessorKey: "delivery_date",
        size: 140,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          const isService = row.original?.is_service;

          if (!po) return <span className="text-gray-400 text-xs">-</span>;

          // For goods: Use GRN creation date
          // For services: Use service delivery date
          const deliveryDate = isService
            ? po.date_of_service_delivery
            : (po.grn_details?.accepted_datetime || po.date_of_grn);

          if (!deliveryDate) return <span className="text-gray-400 text-xs">Pending</span>;
          return new Date(deliveryDate).toLocaleDateString();
        },
      },
      {
        header: "GRN No.",
        accessorKey: "purchase_order.grn_details.grn_number",
        size: 120,
        cell: ({ row }) => {
          const grnDetails = row.original?.purchase_order?.grn_details;
          const deliveryNote = row.original?.delivery_note;

          // Try multiple possible GRN number fields
          const grnNo = grnDetails?.grn_number ||
                        grnDetails?.grn_reference ||
                        grnDetails?.invoice_number ||
                        deliveryNote?.grn_number ||
                        deliveryNote?.grn_reference;

          if (!grnNo) return <span className="text-gray-400 text-xs">-</span>;
          return grnNo;
        },
      },
      {
        header: "Vendor Performance Rating",
        accessorKey: "vendor_performance_score",
        size: 150,
        cell: ({ row }) => {
          // Try multiple sources for performance rating
          const score = row.original?.vendor_performance_score;
          const vendorPerf = row.original?.vendor_performance;
          const serviceRating = row.original?.purchase_order?.service_quality_rating;

          const rating = score || vendorPerf?.total_score || serviceRating;

          if (!rating) return <span className="text-gray-400 text-xs">-</span>;

          const colorClass = rating >= 80 ? 'text-green-600' : rating >= 60 ? 'text-yellow-600' : 'text-red-600';
          return <span className={`text-sm font-medium ${colorClass}`}>{rating}%</span>;
        },
      },
      {
        header: "Procurement Status",
        accessorKey: "procurement_status",
        size: 130,
        cell: ({ row }) => {
          const po = row.original?.purchase_order;
          const isService = row.original?.is_service;

          // Determine overall procurement status
          let procurementStatus = 'IN PROGRESS';

          if (!po) {
            // No PO yet - still in progress
            procurementStatus = 'IN PROGRESS';
          } else {
            // Check if cancelled/suspended
            const poStatus = po.status?.toUpperCase();
            if (poStatus === 'CANCELLED' || poStatus === 'SUSPENDED') {
              procurementStatus = 'CANCELLED/SUSPENDED';
            } else {
              // Check delivery status
              const hasDelivery = isService
                ? !!po.date_of_service_delivery
                : !!(po.grn_details || po.date_of_grn);

              // Check payment status
              const hasPayment = !!row.original?.payment_date ||
                               !!po.payment_request?.payment_date;

              if (hasDelivery && hasPayment) {
                procurementStatus = 'COMPLETED';
              } else if (hasDelivery) {
                procurementStatus = 'IN PROGRESS'; // Delivered but not paid
              } else {
                procurementStatus = 'IN PROGRESS'; // PO created but not delivered
              }
            }
          }

          // Map to status badge
          const statusMap: Record<string, string> = {
            'COMPLETED': 'completed',
            'IN PROGRESS': 'in_progress',
            'CANCELLED/SUSPENDED': 'rejected',
          };

          return <StatusBadge status={statusMap[procurementStatus] || 'pending'} />;
        },
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        size: 250,
        cell: ({ row }) => <EditableRemarksCell row={row} />,
      },
    ], // End of DELIVERY STAGE columns
  },
];

export default ProcurementTracker;