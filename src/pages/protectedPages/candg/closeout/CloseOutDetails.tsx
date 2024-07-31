import BackNavigation from "atoms/BackNavigation";
import TabState from "components/ui/TabState";
import React, { useState } from "react";

const CloseOutDetails: React.FC = () => {
  const tabDetails = [
    { id: 1, state: "files-data-records", name: "Files, Data and Records", tabComponent: <></> },
    { id: 2, state: "program-technical", name: "Program/Technical", tabComponent: <></> },
    { id: 2, state: "final-project-report", name: "Final Project Report", tabComponent: <></> },
    { id: 2, state: "admin-inventory", name: "Admin/Inventory", tabComponent: <></> },
    { id: 2, state: "human-resources", name: "Human Resources", tabComponent: <></> },
  ];

  const [tabState, setTabState] = useState<string | number>(tabDetails[0].state);
  return (
    <main className="w-full flex flex-col p-3 px-[4rem]">
      <section className="flex">
        <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
          <BackNavigation />
          <TabState tabArray={tabDetails} setState={setTabState} tabState={tabState} />
        </div>
      </section>
    </main>
  );
};

export default CloseOutDetails;
