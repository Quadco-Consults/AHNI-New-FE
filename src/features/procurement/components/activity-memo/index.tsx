"use client";

import BreadcrumbCard from "components/Breadcrumb";
import TabState from "components/ui/TabState";
import { useState } from "react";
import ActivityMemoList from "./ActivityMemoList";

function ActivityMemoTabs() {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Activity Memo", icon: false },
  ];

  const tabDetails = [
    {
      id: 1,
      state: "created",
      name: "Created Activity Memos",
      tabComponent: <ActivityMemoList status="pending" />,
    },
    {
      id: 2,
      state: "approved",
      name: "Approved Activity Memos",
      tabComponent: <ActivityMemoList status="approved" />,
    },
  ];

  const [tabState, setTabState] = useState<string | number>(
    tabDetails[0].state
  );

  return (
    <main className="min-h-screen space-y-8">
      <BreadcrumbCard list={breadcrumbs} />
      <div className="flex w-full items-center gap-4">
        <TabState
          tabArray={tabDetails}
          setState={setTabState}
          tabState={tabState}
        />
      </div>
      <section className="w-full">
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

export default ActivityMemoTabs;