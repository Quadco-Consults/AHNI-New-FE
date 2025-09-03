"use client";

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
import { usePathname } from "next/navigation";

function ProcurementTracker() {
  const pathname = usePathname();

  const isAdminTracker = pathname.includes("admin-tracker");

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

  const { data, isLoading } = useGetAllProcurementTrackers({
    item_category: "SERVICE",
  });

  const tabDetails = [
    {
      id: 1,
      state: "summary",
      name: "Summary",

      tabComponent: <SummaryCard />,
    },
    {
      id: 2,
      state: "procurement_process_stage",
      name: "Procurement Process Stage",
      tabComponent: <ProcurementProcessCard />,
    },

    {
      id: 1,
      state: "delivery_stage_and_vendor_performance_mangement",
      name: "Delivery Stage and Vendor Performance Mangement",
      tabComponent: <DeliveryStageCard />,
    },
  ];
  const [tabState, setTabState] = useState<string | number>(
    tabDetails[0].state
  );

  return (
    <main className='min-h-screen space-y-8'>
      <BreadcrumbCard list={breadcrumbs} />
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
      ) : !data?.data?.results || data.data.results.length === 0 ? (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-600 mb-2'>
              No Data Available
            </h3>
            <p className='text-gray-500'>
              There are no procurement tracker records to display.
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
    </main>
  );
}

export default ProcurementTracker;
