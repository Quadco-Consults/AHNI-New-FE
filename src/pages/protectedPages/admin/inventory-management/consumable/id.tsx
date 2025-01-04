import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ConsumableDetails from "components/modules/admin/inventory-management/ConsumableDetails";
import ConsumableStockCard from "components/modules/admin/inventory-management/ConsumableStockCard";

export default function ViewConsumable() {
    return (
        <div>
            <BackNavigation />
            <Tabs defaultValue="details">
                <TabsList className="flex justify-between mx-4 ">
                    <div className="flex items-center">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="stock">Stock Card</TabsTrigger>
                    </div>
                </TabsList>
                <TabsContent className="mt-8" value="details">
                    <ConsumableDetails />
                </TabsContent>
                <TabsContent value="stock">
                    <ConsumableStockCard />
                </TabsContent>
            </Tabs>
        </div>
    );
}
