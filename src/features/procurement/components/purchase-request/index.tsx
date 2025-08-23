"use client";

import BreadcrumbCard from "components/Breadcrumb";
import PurchaseRequest from "./PurchaseRequest";
import TabState from "components/ui/TabState";
import { useState } from "react";

function PurchaseRequestTabs() {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Request", icon: false },
  ];
  const tabDetails = [
    {
      id: 1,
      state: "request",
      name: "Purchase Request",

      tabComponent: <PurchaseRequest status='pending' />,
    },
    {
      id: 2,
      state: "approved_request",
      name: "Approved Purchase Request",
      tabComponent: <PurchaseRequest status='approved' />,
    },
  ];
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
