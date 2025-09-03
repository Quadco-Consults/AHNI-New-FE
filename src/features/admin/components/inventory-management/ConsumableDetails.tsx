"use client";

import { LoadingSpinner } from "components/Loading";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { useParams } from "next/navigation";
import { useGetSingleItemQuery } from "@/features/modules/controllers/config/itemController";

export default function ConsumableDetails() {
  const { id: consumableId } = useParams();

  const { data: consumable, isLoading } = useGetSingleItemQuery(
    consumableId || "",
    !!consumableId
  );

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
              <CardContent className='space-y-5'>
                <div className='border-b py-2'>
                  {consumable?.data.description}
                </div>
                <div className='grid grid-cols-3 gap-8 mt-6'>
                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Quantity</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.quantity || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      Stock Control Method
                    </h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.stock_control_method || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Category</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data?.category?.name || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Expiry Date</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.expiry_date || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      Previous Quantity
                    </h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.previous_quantity || "0"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Re-order Level</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.re_order_level || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Buffer Stock</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.buffer_stock || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Max Stock</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.max_stock || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Entry Date</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.entry_date || "N/A"}
                    </p>
                  </div>
                  {/* 
                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      Available Quantity
                    </h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.available_quantity || "N/A"}
                    </p>
                  </div> */}

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Cost of Item</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {`${consumable?.data.item_cost || "N/A"}`}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>
                      GRN Tracking Number
                    </h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.grn_tracking_number || "N/A"}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h4 className='text-base font-semibold '>Vendor</h4>
                    <p className='text-[#4D4545] text-sm'>
                      {consumable?.data.most_recent_vendor || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </>
          )
        )}
      </Card>
    </div>
  );
}
