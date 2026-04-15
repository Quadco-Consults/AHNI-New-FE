"use client";

import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "next/navigation";
import { useGetSingleItemQuery } from "@/features/modules/controllers/config/itemController";
import { useGetAllConsumableStockCardsQuery } from "@/features/admin/controllers/consumableController";
import { useGetItemStocksByItem } from "@/features/admin/controllers/itemStoreStockController";
import ConsumableStockCard from "./ConsumableStockCard";
import ItemStoreStockCard from "./ItemStoreStockCard";
import ConsumableRequisitions from "./ConsumableRequisitions";
import { Package, FileText, ShoppingCart } from "lucide-react";

export default function ConsumableDetails() {
  const { id: consumableId } = useParams();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Default to "overview" if no tab param, otherwise use the param
  const [activeTab, setActiveTab] = useState(tabParam || "overview");

  // Update active tab when URL param changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const { data: consumable, isLoading } = useGetSingleItemQuery(
    consumableId || "",
    !!consumableId
  );

  // Fetch stock movement data for Stock Card tab
  const { data: stockCardData, isLoading: stockCardLoading, error: stockCardError } = useGetAllConsumableStockCardsQuery(
    consumableId || "",
    activeTab === "stock"
  );

  // Fetch item stock across stores
  const { data: itemStocksData, isLoading: itemStocksLoading } = useGetItemStocksByItem(
    consumableId || "",
    !!consumableId
  );

  const itemStocks = itemStocksData?.data?.results || [];

  return (
    <div>
      <Card className='px-3'>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          consumable && (
            <>
              <CardHeader className='border-b font-bold'>
                {consumable?.data?.name}
              </CardHeader>
              <CardContent className='space-y-5 pt-6'>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="stock"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Stock Card
                    </TabsTrigger>
                    <TabsTrigger
                      value="requisitions"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Requisitions
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-0 space-y-6">
                    {/* Item Details */}
                    <div className='border-b py-2'>
                      {consumable?.data.description}
                    </div>

                    {/* Store Stock Cards */}
                    {itemStocks.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Stock Across Stores</h3>
                        <ItemStoreStockCard stocks={itemStocks} isLoading={itemStocksLoading} />
                      </div>
                    )}

                    <div className='grid grid-cols-3 gap-8 mt-6'>
                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Quantity</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.quantity || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      Stock Control Method
                    </h4>
                    <p className='text-gray-dark text-body-base'>
                      {typeof consumable?.data.stock_control_method === 'object' && consumable?.data.stock_control_method !== null
                        ? consumable.data.stock_control_method.name || "N/A"
                        : consumable?.data.stock_control_method || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Category</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data?.category?.name || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Expiry Date</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.expiry_date || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      Previous Quantity
                    </h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.previous_quantity || "0"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Re-order Level</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.re_order_level || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Buffer Stock</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.buffer_stock || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Max Stock</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.max_stock || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Entry Date</h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.entry_date || "N/A"}
                    </p>
                  </div>
                  {/* 
                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      Available Quantity
                    </h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.available_quantity || "N/A"}
                    </p>
                  </div> */}

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Cost of Item</h4>
                    <p className='text-gray-dark text-body-base'>
                      {`${consumable?.data.item_cost || "N/A"}`}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      GRN Tracking Number
                    </h4>
                    <p className='text-gray-dark text-body-base'>
                      {consumable?.data.grn_tracking_number || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Vendor</h4>
                    <p className='text-gray-dark text-body-base'>
                      {typeof consumable?.data.most_recent_vendor === 'object' && consumable?.data.most_recent_vendor !== null
                        ? consumable.data.most_recent_vendor.name || "N/A"
                        : consumable?.data.most_recent_vendor || "N/A"}
                    </p>
                  </div>
                </div>
                  </TabsContent>

                  {/* Stock Card Tab */}
                  <TabsContent value="stock" className="mt-0">
                    <ConsumableStockCard
                      stockCard={stockCardData}
                      loading={stockCardLoading}
                      error={stockCardError}
                      itemStocks={itemStocks}
                      itemName={consumable?.data?.name || "Unknown Item"}
                    />
                  </TabsContent>

                  {/* Requisitions Tab */}
                  <TabsContent value="requisitions" className="mt-0">
                    <ConsumableRequisitions consumableId={consumableId as string || ""} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          )
        )}
      </Card>
    </div>
  );
}
