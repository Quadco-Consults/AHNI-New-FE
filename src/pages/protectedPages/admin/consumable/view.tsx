import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import Details from "../../../../components/modules/admin/inventory-management/Details";
import StockCard from "../../../../components/modules/admin/inventory-management/StockCard";
import { Button } from "components/ui/button";
import { useState } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import AddSquareIcon from "components/icons/AddSquareIcon";

const ViewConsumables = () => {
    const [currentTab, setCurrentTab] = useState("");

    const dispatch = useAppDispatch();

    return (
        <div>
            <BackNavigation />
            <Tabs
                onValueChange={(tab) => setCurrentTab(tab)}
                defaultValue="details"
            >
                <TabsList className="flex justify-between mx-4 ">
                    <div className="flex items-center">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="stock">Stock Card</TabsTrigger>
                    </div>
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
