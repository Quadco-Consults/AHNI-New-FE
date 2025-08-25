"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ConsumableDetails from "features/admin/components/inventory-management/ConsumableDetails";
import ConsumableStockCard from "features/admin/components/inventory-management/ConsumableStockCard";
import { useParams } from "next/navigation";
import { useGetAllConsumableStockCardsQuery } from "@/features/admin/controllers/consumableController";

export default function ViewConsumable() {
  const { id } = useParams();
  const { data: stockCard } = useGetAllConsumableStockCardsQuery(
    id || "", !!id
  );

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
