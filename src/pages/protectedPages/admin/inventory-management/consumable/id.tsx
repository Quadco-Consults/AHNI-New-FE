import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ConsumableDetails from "components/modules/admin/inventory-management/ConsumableDetails";
import ConsumableStockCard from "components/modules/admin/inventory-management/ConsumableStockCard";
import { useParams } from "react-router-dom";
import { useGetAllConsumableStockCardsQuery } from "services/admin/inventory-management/consumable";
import { skipToken } from "@reduxjs/toolkit/query";

export default function ViewConsumable() {
  const { id } = useParams();
  const { data: stockCard } = useGetAllConsumableStockCardsQuery(
    id ? id : skipToken
  );
  console.log({ clapper: id, stockCard });
  return (
    <div>
      <BackNavigation />
      <Tabs defaultValue='details'>
        <TabsList className='flex justify-between mx-4 '>
          <div className='flex items-center'>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='stock'>Stock Card</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent className='mt-8' value='details'>
          <ConsumableDetails />
        </TabsContent>
        <TabsContent value='stock'>
          <ConsumableStockCard stockCard={stockCard} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
