import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

import Details from "./ConsumablesComponents/Details";
import StockCard from "./ConsumablesComponents/StockCard";
import { Button } from "components/ui/button";
import { useState } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

const ViewConsumables = () => {
  const [currentTab, setCurrentTab] = useState("");

  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(
      openDialog({
        type: DialogType.AddStock,
        dialogProps: {},
      })
    );
  };
  return (
    <div>
      <Tabs onValueChange={(tab) => setCurrentTab(tab)} defaultValue="details">
        <TabsList className="flex justify-between mx-4 ">
          <div className="flex items-center">
            <BackNavigation />
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="stock">Stock Card</TabsTrigger>
          </div>
          {currentTab === "stock" && (
            <Button onClick={() => onClick()} size={"sm"}>
              Stock Action
            </Button>
          )}
        </TabsList>
        <TabsContent className="mt-8" value="details">
          <Details />
        </TabsContent>
        <TabsContent value="stock">
          <StockCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewConsumables;
