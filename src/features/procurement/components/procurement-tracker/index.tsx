"use client";

import { Button } from "components/ui/button";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";
import TabState from "components/ui/TabState";
import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { Loading } from "components/Loading";
import SummaryCard from "./SummaryCard";
import DeliveryStageCard from "./DeliveryStageCard";
import ProcurementProcessCard from "./ProcurementProcessCard";
import EnhancedViewCard from "./EnhancedViewCard";
import FilterPanel from "./FilterPanel";
import { usePathname } from "next/navigation";

function ProcurementTracker() {
  const pathname = usePathname();
  const isAdminTracker = pathname?.includes("admin-tracker") || false;

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
  console.log("🔍 Procurement Tracker Debug:", {
    filters,
    data,
    isLoading,
    error,
    results: data?.results,
    resultsLength: data?.results?.length,
    apiEndpoint: "/procurements/procurement-tracker/"
  });

  const tabDetails = [
    {
      id: 1,
      state: "summary",
      name: "Summary",
      tabComponent: <SummaryCard data={data} />,
    },
    {
      id: 2,
      state: "procurement_process_stage",
      name: "Process Stage",
      tabComponent: <ProcurementProcessCard data={data} />,
    },
    {
      id: 3,
      state: "delivery_stage",
      name: "Delivery & Performance",
      tabComponent: <DeliveryStageCard data={data} />,
    },
    {
      id: 4,
      state: "enhanced_view",
      name: "Enhanced View",
      tabComponent: <EnhancedViewCard data={data} />,
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
              Error Loading Data
            </h3>
            <p className='text-gray-500'>
              {error instanceof Error ? error.message : 'Failed to load procurement data.'}
            </p>
          </div>
        </div>
      ) : !data?.results?.length ? (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-600 mb-2'>
              No Procurement Data Found
            </h3>
            <p className='text-gray-500 mb-4'>
              There are no procurement tracker records available.
            </p>
            <div className='text-xs text-gray-400 space-y-1'>
              <p>API Endpoint: /procurements/procurement-tracker/</p>
              <p>Check browser console for detailed debugging information.</p>
            </div>
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
    </main>
  );
}

export default ProcurementTracker;