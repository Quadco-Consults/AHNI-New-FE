import BackNavigation from "atoms/BackNavigation";
import TabState from "components/ui/TabState";
import { useState } from "react";
import ConsultancyJobDetails from "./ConsultancyJobDetails";
import ConsultancyScopeOfWorkDetails from "./ConsultancyScopeOfWorkDetails";

const ConsultancyDetails = () => {
  const tabDetails = [
    {
      id: 1,
      state: "job-details",
      name: "Job Details",
      tabComponent: (
        <>
          <ConsultancyJobDetails />
        </>
      ),
    },
    {
      id: 2,
      state: "scope-of-work",
      name: "Scope of Work",
      tabComponent: (
        <>
          <ConsultancyScopeOfWorkDetails />
        </>
      ),
    },
    { id: 2, state: "submitted-applications", name: "Submitted Applications", tabComponent: <></> },
    { id: 2, state: "short-list", name: "Shortlist", tabComponent: <></> },
    { id: 2, state: "contract-request-form", name: "Contract Request Form", tabComponent: <></> },
  ];
  const [tabState, setTabState] = useState<string | number>(tabDetails[0].state);
  return (
    <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem]">
      <section className="w-full flex items-center justify-between">
        <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
          <BackNavigation />
          <TabState tabArray={tabDetails} setState={setTabState} tabState={tabState} />
        </div>
        <div>
          {/* {tabState === tabDetails[1].state && (
            <Button
              className="flex gap-2 py-6"
              type="button"
              onClick={() => {
                dispatch(
                  openDialog({
                    type: DialogType.ExpenditureModal,
                    dialogProps: {
                      header: "Add Expenditure",
                      width: "max-w-lg",
                    },
                  })
                );
              }}
            >
              <AddSquareIcon />
              <p>Add Expenditure</p>
            </Button>
          )} */}
        </div>
      </section>
      {/* {getGrant.isLoading ? (
        <Loading />
      ) : ( */}
      <section className="w-full">
        {tabDetails.map((item, index) => {
          return tabState === item.state && <div key={index}>{item.tabComponent}</div>;
        })}
      </section>
      {/* )} */}
    </main>
  );
};

export default ConsultancyDetails;
