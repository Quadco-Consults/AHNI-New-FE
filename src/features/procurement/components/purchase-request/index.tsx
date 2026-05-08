"use client";

import BreadcrumbCard from "@/components/Breadcrumb";
import PurchaseRequest from "./PurchaseRequest";
import TabState from "@/components/ui/TabState";
import { useState, useMemo } from "react";
import { useDepartmentFeatures } from "@/hooks/useDepartmentFeatures";

function PurchaseRequestTabs() {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: false },
  ];

  // Check if user is from Procurement department
  const { isProcurementDepartment } = useDepartmentFeatures();

  // Define all tabs
  const allTabs = [
    {
      id: 1,
      state: "created",
      name: "Created Purchase Requests",
      tabComponent: <PurchaseRequest status='pending' />,
    },
    {
      id: 2,
      state: "approved",
      name: "Approved Purchase Requests",
      tabComponent: <PurchaseRequest status='approved' />,
    },
  ];

  // Filter tabs based on department
  // Procurement users only see "Approved Purchase Requests"
  // All other users (Global Hub, other departments) see both tabs
  const tabDetails = useMemo(() => {
    if (isProcurementDepartment) {
      // Procurement users only see approved requests
      return allTabs.filter(tab => tab.state === "approved");
    }
    // All other users see all tabs
    return allTabs;
  }, [isProcurementDepartment]);

  const [tabState, setTabState] = useState<string | number>(
    tabDetails[0].state
  );

  return (
    <main className='min-h-screen space-y-8'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='flex w-full items-center gap-4'>
        <TabState
          tabArray={tabDetails}
          setState={setTabState}
          tabState={tabState}
        />
      </div>
      <section className='w-full'>
        {tabDetails.map((item, index) => {
          return (
            tabState === item.state && (
              <div key={index}>{item.tabComponent}</div>
            )
          );
        })}
      </section>
    </main>
  );
}

export default PurchaseRequestTabs;
