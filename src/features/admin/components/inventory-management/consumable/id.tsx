"use client";

import BackNavigation from "@/components/atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConsumableDetails from "@/features/admin/components/inventory-management/ConsumableDetails";
import ConsumableStockCard from "@/features/admin/components/inventory-management/ConsumableStockCard";
import ConsumableRequisitions from "@/features/admin/components/inventory-management/ConsumableRequisitions";
import { useParams, useSearchParams } from "next/navigation";
import { useGetAllConsumableStockCardsQuery } from "@/features/admin/controllers/consumableController";

export default function ViewConsumable() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') || 'details';

  const { data: stockCard, isLoading: stockCardLoading, error: stockCardError } = useGetAllConsumableStockCardsQuery(
    id || "", !!id
  );

  // Debug the stock card data fetching
  console.log("🔍 CONSUMABLE STOCK CARD FETCH DEBUG:", {
    id,
    stockCard,
    stockCardLoading,
    stockCardError,
    dataStructure: stockCard ? Object.keys(stockCard) : null,
  });

  return (
    <div>
      <BackNavigation />
      <Tabs defaultValue={tab} value={tab}>
        <TabsList className='flex justify-between mx-4 '>
          <div className='flex items-center'>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='stock'>Stock Card</TabsTrigger>
            <TabsTrigger value='requisitions'>Requisitions</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent className='mt-8' value='details'>
          <ConsumableDetails />
        </TabsContent>
        <TabsContent value='stock'>
          <ConsumableStockCard
            stockCard={stockCard}
            loading={stockCardLoading}
            error={stockCardError}
          />
        </TabsContent>
        <TabsContent value='requisitions'>
          <ConsumableRequisitions consumableId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
