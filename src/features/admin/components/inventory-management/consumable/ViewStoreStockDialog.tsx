"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetItemStocksByItem } from "@/features/admin/controllers/itemStoreStockController";
import { TItemStoreStockData, getStockAlertLevel } from "@/features/admin/types/inventory-management/item-store-stock";
import { Store, Package, AlertCircle, CheckCircle, XCircle, AlertTriangle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminRoutes } from "@/constants/RouterConstants";

interface ViewStoreStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemName: string;
}

export default function ViewStoreStockDialog({
  open,
  onOpenChange,
  itemId,
  itemName,
}: ViewStoreStockDialogProps) {
  const router = useRouter();

  // Fetch existing stock for this item
  const { data: stockData, isLoading } = useGetItemStocksByItem(
    itemId,
    !!itemId && open
  );

  const stocks = stockData?.data?.results || [];

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "OK":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "LOW":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "CRITICAL":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "OUT_OF_STOCK":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case "OK":
        return "bg-green-50 border-green-200 text-green-800";
      case "LOW":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "CRITICAL":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "OUT_OF_STOCK":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const handleAddToStore = () => {
    onOpenChange(false);
    router.push(`/dashboard/admin/inventory-management/good-receive-note/create?item=${itemId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            Store Stock - {itemName}
          </DialogTitle>
          <DialogDescription>
            View stock levels across all stores for this consumable
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : stocks.length > 0 ? (
            <>
              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">Total Stores</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stocks.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Total Quantity</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {stocks
                        .reduce((sum, s) => sum + (s.quantity || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Available</p>
                    <p className="text-2xl font-bold text-green-900">
                      {stocks
                        .reduce((sum, s) => sum + (s.available_quantity || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-600">Reserved</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {stocks
                        .reduce((sum, s) => sum + (s.reserved_quantity || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Store Stock Cards */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Stock by Store
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stocks.map((stock: TItemStoreStockData) => {
                    const alertLevel = getStockAlertLevel(
                      stock.available_quantity,
                      stock.re_order_level,
                      stock.buffer_stock
                    );

                    return (
                      <div
                        key={stock.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                      >
                        {/* Store Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Store className="h-4 w-4 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">
                                {stock.store_detail?.name || "Unknown Store"}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                              {stock.store_detail?.code}
                            </p>
                            {stock.store_detail?.location?.name && (
                              <p className="text-xs text-gray-500">
                                {stock.store_detail.location.name}
                              </p>
                            )}
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getAlertColor(
                              alertLevel
                            )}`}
                          >
                            {getAlertIcon(alertLevel)}
                            {alertLevel.replace("_", " ")}
                          </div>
                        </div>

                        {/* Stock Quantities */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-gray-600 text-xs">Total Qty</p>
                            <p className="font-semibold text-gray-900">
                              {stock.quantity?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded p-2">
                            <p className="text-green-600 text-xs">Available</p>
                            <p className="font-semibold text-green-900">
                              {stock.available_quantity?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="bg-orange-50 rounded p-2">
                            <p className="text-orange-600 text-xs">Reserved</p>
                            <p className="font-semibold text-orange-900">
                              {stock.reserved_quantity?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded p-2">
                            <p className="text-yellow-600 text-xs">Reorder</p>
                            <p className="font-semibold text-yellow-900">
                              {stock.re_order_level?.toLocaleString() || 0}
                            </p>
                          </div>
                        </div>

                        {/* Alert Messages */}
                        {alertLevel === "OUT_OF_STOCK" && (
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-xs text-red-800 font-medium">
                              ⚠️ Out of stock - Restock needed
                            </p>
                          </div>
                        )}
                        {alertLevel === "CRITICAL" && (
                          <div className="bg-orange-50 border border-orange-200 rounded p-2">
                            <p className="text-xs text-orange-800 font-medium">
                              ⚠️ Critical level - Reorder immediately
                            </p>
                          </div>
                        )}
                        {alertLevel === "LOW" && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <p className="text-xs text-yellow-800 font-medium">
                              ⚠️ Low stock - Consider reordering
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* No Stock Available */
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    No Stock Information
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This consumable has not been added to any store yet
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Help Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">
                  How to Add This Item to a Store
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  To add this consumable to a store, you need to create a Good
                  Receive Note (GRN). This is the proper workflow for receiving
                  inventory items into your stores.
                </p>
                <Button
                  onClick={handleAddToStore}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create GRN for This Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
