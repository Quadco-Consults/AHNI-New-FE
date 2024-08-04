import BackNavigation from "atoms/BackNavigation";
import TabState from "components/ui/TabState";
import React, { useState } from "react";
import GrantDetailsCard from "./GrantDetailsCard";
import ExpenditureHistory from "./ExpenditureHistory";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { grantsApi } from "services/cAndGApi/grants";
import { useParams } from "react-router-dom";
import { Loading } from "components/shared/Loading";

const GrantDetails: React.FC = () => {
  const params = useParams();

  const getGrant = grantsApi.useGetGrantByIdQuery(params.id);
  // console.log(getGrant?.data);

  const dispatch = useAppDispatch();
  const tabDetails = [
    { id: 1, state: "details", name: "details", tabComponent: <GrantDetailsCard grantDetails={getGrant?.data} /> },
    { id: 2, state: "expenditure-history", name: "expenditure history", tabComponent: <ExpenditureHistory grantDetails={getGrant?.data} /> },
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
          {tabState === tabDetails[1].state && (
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
          )}
        </div>
      </section>
      {getGrant.isLoading ? (
        <Loading />
      ) : (
        <section className="w-full">
          {tabDetails.map((item, index) => {
            return tabState === item.state && <div key={index}>{item.tabComponent}</div>;
          })}
        </section>
      )}
    </main>
  );
};

export default GrantDetails;
