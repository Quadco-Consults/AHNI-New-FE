"use client";

import { Button } from "components/ui/button";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";
import TabState from "components/ui/TabState";
import { useMemo, useState } from "react";
import { FileDown, ChevronDown, ChevronRight } from "lucide-react";
import { Loading } from "components/Loading";
import SummaryCard from "./SummaryCard";
import DeliveryStageCard from "./DeliveryStageCard";
import ProcurementProcessCard from "./ProcurementProcessCard";
import FilterPanel from "./FilterPanel";
import StatusBadge, { TypeBadge } from "./StatusBadge";
import ExpandedRow from "./ExpandedRow";
import { usePathname } from "next/navigation";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

function ProcurementTracker() {
  const pathname = usePathname();
  const isAdminTracker = pathname.includes("admin-tracker");

  // Filter state
  const [filters, setFilters] = useState({
    page: 1,
    size: 20,
    status: "",
    item_type: "",
    service_status: "",
    services_only: "false",
    search: "",
    year: "",
  });

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
    ...filters,
    enabled: true,
  });

  // Debug logging
  console.log("Procurement Tracker Data:", { data, isLoading, error, filters });

  const toggleRowExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  // Enhanced table with expandable rows
  const EnhancedTable = () => {
    const items = data?.data?.results || [];

    if (items.length === 0) {
      return (
        <div className='text-center py-8 text-gray-500'>
          No procurement data matches the current filters.
        </div>
      );
    }

    return (
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Details
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                PR Reference
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Item
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Type
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Department
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Officer
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {items.map((item: any) => (
              <>
                <tr 
                  key={item.id} 
                  className='hover:bg-gray-50 cursor-pointer transition-colors'
                  onClick={() => toggleRowExpansion(item.id)}
                >
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      {expandedRows.has(item.id) ? (
                        <ChevronDown className='h-4 w-4 text-gray-400' />
                      ) : (
                        <ChevronRight className='h-4 w-4 text-gray-400' />
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {item.pr_reference || item.reference || 'N/A'}
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-900 max-w-xs truncate'>
                    {item.item_name || item.name || item.description || 'N/A'}
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <TypeBadge itemType={item.item_type} />
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-900 max-w-xs truncate'>
                    {item.deparment || item.department || item.office || 'N/A'}
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <StatusBadge item={item} />
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-900 max-w-xs truncate'>
                    {item.procurement_officer || item.officer_name || 'N/A'}
                  </td>
                </tr>
                {expandedRows.has(item.id) && <ExpandedRow item={item} />}
              </>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabDetails = [
    {
      id: 1,
      state: "enhanced_view",
      name: "Enhanced View",
      tabComponent: <EnhancedTable />,
    },
    {
      id: 2,
      state: "summary",
      name: "Summary",
      tabComponent: <SummaryCard data={data} />,
    },
    {
      id: 3,
      state: "procurement_process_stage",
      name: "Process Stage",
      tabComponent: <ProcurementProcessCard data={data} />,
    },
    {
      id: 4,
      state: "delivery_stage",
      name: "Delivery & Performance",
      tabComponent: <DeliveryStageCard data={data} />,
    },
  ];

  const [tabState, setTabState] = useState<string | number>(
    tabDetails[0].state
  );

  return (
    <main className='min-h-screen space-y-8'>
      <BreadcrumbCard list={breadcrumbs} />
      
      {/* Filter Panel */}
      <FilterPanel filters={filters} onFilterChange={setFilters} />

      <section className='w-full flex items-center justify-between'>
        <div className='w-auto flex gap-x-[1.25rem] items-center justify-start'>
          <TabState
            tabArray={tabDetails}
            setState={setTabState}
            tabState={tabState}
          />
        </div>
        <div className='flex items-center gap-x-3'>
          {/* Results Count */}
          {data?.data?.results && (
            <span className='text-sm text-gray-500'>
              {data.data.results.length} of {data.data.count || 0} items
            </span>
          )}
          <Button variant='default'>
            <span>
              <FileDown size={18} />
            </span>
            Download xlsx
          </Button>
        </div>
      </section>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-red-600 mb-2'>
              Backend Configuration Issue
            </h3>
            <p className='text-gray-500 mb-3'>
              {error instanceof Error ? error.message : 'Failed to load procurement tracker data.'}
            </p>
            {error instanceof Error && error.message.includes('department') && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-md mx-auto'>
                <h4 className='font-semibold text-yellow-800 mb-2'>Technical Details:</h4>
                <p className='text-yellow-700 text-sm'>
                  The backend API has a data serialization issue with the department field. 
                  Some purchase request items may have missing department information.
                </p>
                <p className='text-yellow-600 text-xs mt-2'>
                  <strong>Backend Fix Needed:</strong> The ProcurementTrackerSerializer needs to handle null department relationships properly.
                </p>
                <div className='mt-3 p-2 bg-blue-50 rounded text-xs'>
                  <strong>Quick Fix for Backend:</strong><br/>
                  <code className='text-blue-800'>department = serializers.CharField(source='department.name', allow_null=True, default='N/A')</code>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : !data?.data?.results || data.data.results.length === 0 ? (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-600 mb-2'>
              No Procurement Data Available
            </h3>
            <p className='text-gray-500 mb-2'>
              The procurement tracker will display purchase requests that have progressed through the procurement process.
            </p>
            <p className='text-gray-400 text-sm'>
              Data will appear here after creating purchase requests, RFQs, and purchase orders.
            </p>
          </div>
        </div>
      ) : (
        <section className='w-full'>
          {tabDetails.map((item, index) => {
            return (
              tabState === item.state && (
                <div key={index}>{item.tabComponent}</div>
              )
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {data?.data?.count > filters.size && (
        <div className='flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg'>
          <div className='flex flex-1 justify-between sm:hidden'>
            <Button
              onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={filters.page <= 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page * filters.size >= (data?.data?.count || 0)}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing{' '}
                <span className='font-medium'>
                  {(filters.page - 1) * filters.size + 1}
                </span>{' '}
                to{' '}
                <span className='font-medium'>
                  {Math.min(filters.page * filters.size, data?.data?.count || 0)}
                </span>{' '}
                of{' '}
                <span className='font-medium'>{data?.data?.count || 0}</span> results
              </p>
            </div>
            <div>
              <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
                <Button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={filters.page <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className='px-4 py-2 text-sm text-gray-700 bg-white border-t border-b border-gray-300'>
                  Page {filters.page} of {Math.ceil((data?.data?.count || 0) / filters.size)}
                </span>
                <Button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={filters.page * filters.size >= (data?.data?.count || 0)}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProcurementTracker;
