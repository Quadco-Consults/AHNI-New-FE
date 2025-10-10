"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetSingleItemQuery } from "@/features/modules/controllers/config/itemController";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface StockAvailabilityCheckProps {
  items: Array<{
    id: string;
    item?: { id: string; name: string };
    consummable?: any; // Can be full object or just ID
    quantity: number;
  }>;
}

interface ItemStockDisplayProps {
  itemId: string;
  itemName: string;
  requestedQuantity: number;
}

const ItemStockDisplay = ({ itemId, itemName, requestedQuantity }: ItemStockDisplayProps) => {
  const { data: itemData, isLoading, error } = useGetSingleItemQuery(itemId, !!itemId);

  console.log('🔍 Item Stock Data:', { itemId, itemName, itemData, error });

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
        <div>
          <p className="font-medium">{String(itemName)}</p>
          <p className="text-sm text-gray-600">Loading stock info...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-md bg-red-50">
        <div>
          <p className="font-medium text-red-800">{String(itemName)}</p>
          <p className="text-sm text-red-600">Error loading stock data</p>
        </div>
      </div>
    );
  }

  // Ensure we extract primitive values, not objects
  const currentStock = typeof itemData?.data?.quantity === 'number' ? itemData.data.quantity : 0;
  const availableStock = typeof itemData?.data?.available_quantity === 'number' ? itemData.data.available_quantity : 0;
  const hasEnoughStock = currentStock >= requestedQuantity;
  const hasAvailableStock = availableStock >= requestedQuantity;

  return (
    <div className={`flex items-start justify-between p-4 border rounded-md ${
      hasEnoughStock ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <p className="font-semibold text-gray-900">{String(itemName)}</p>
          {hasEnoughStock ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Requested Quantity:</p>
            <p className="font-bold text-blue-700">{requestedQuantity}</p>
          </div>

          <div>
            <p className="text-gray-600">Current Stock (quantity):</p>
            <p className={`font-bold ${hasEnoughStock ? 'text-green-700' : 'text-red-700'}`}>
              {currentStock}
            </p>
          </div>

          <div>
            <p className="text-gray-600">Available Stock:</p>
            <p className="font-medium text-gray-700">{availableStock}</p>
          </div>

          <div>
            <p className="text-gray-600">After Issue:</p>
            <p className={`font-medium ${hasEnoughStock ? 'text-gray-700' : 'text-red-700'}`}>
              {currentStock - requestedQuantity}
            </p>
          </div>
        </div>

        {!hasEnoughStock && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold">Insufficient Stock!</p>
                <p>Need {requestedQuantity - currentStock} more units to fulfill this requisition.</p>
                <p className="mt-1 text-xs">
                  💡 Create a GRN (Good Receive Note) to add stock before issuing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        <details className="mt-2">
          <summary className="text-xs text-gray-500 cursor-pointer">Debug Info (Item ID)</summary>
          <p className="text-xs text-gray-600 mt-1 font-mono">{itemId}</p>
        </details>
      </div>
    </div>
  );
};

export default function StockAvailabilityCheck({ items }: StockAvailabilityCheckProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const allItemsOk = items.every((item) => {
    // We'll need to fetch each item's data to check
    return true; // Placeholder
  });

  return (
    <Card className="p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Stock Availability Check
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Review current stock levels before issuing this requisition
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          console.log('🔍 Stock Check - Raw Item Data:', item);

          // Handle both paginated and single data structures
          // Paginated: item.item.id, Single: item.consummable (full object with nested properties)
          let itemId = '';
          let itemName = '';

          // Try to get from item field first (paginated data)
          if (item.item?.id) {
            itemId = item.item.id;
            itemName = item.item.name || '';
          }
          // Then try consummable field (single data - full object)
          else if (item.consummable) {
            const consumable = item.consummable;
            itemId = consumable.id || '';
            itemName = consumable.name || '';
          }

          console.log('🔍 Stock Check - Extracted:', { itemId, itemName });

          if (!itemId) {
            console.warn('⚠️ No item ID found for item at index:', index, item);
            return null;
          }

          return (
            <ItemStockDisplay
              key={itemId || index}
              itemId={itemId}
              itemName={itemName || `Item ${index + 1}`}
              requestedQuantity={item.quantity}
            />
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The backend checks the <code className="bg-blue-100 px-1 rounded">quantity</code> field when issuing items.
          Make sure items have been received via GRN (Good Receive Note) to update stock levels.
        </p>
      </div>
    </Card>
  );
}
