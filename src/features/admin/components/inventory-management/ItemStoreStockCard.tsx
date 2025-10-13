"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TItemStoreStockData,
  getStockAlertLevel,
  StockAlertLevel
} from "@/features/admin/types/inventory-management/item-store-stock";
import { Package, AlertTriangle, CheckCircle, XCircle, TrendingDown } from "lucide-react";

interface ItemStoreStockCardProps {
  stocks: TItemStoreStockData[];
  isLoading?: boolean;
  showItemName?: boolean;
}

const getAlertIcon = (level: StockAlertLevel) => {
  switch (level) {
    case "OK":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "LOW":
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case "CRITICAL":
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    case "OUT_OF_STOCK":
      return <XCircle className="w-4 h-4 text-red-600" />;
  }
};

const getAlertBadge = (level: StockAlertLevel) => {
  const configs = {
    OK: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", label: "In Stock" },
    LOW: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200", label: "Low Stock" },
    CRITICAL: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", label: "Critical" },
    OUT_OF_STOCK: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", label: "Out of Stock" },
  };

  const config = configs[level];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        config.bg,
        config.text,
        config.border
      )}
    >
      {getAlertIcon(level)}
      <span className="ml-1">{config.label}</span>
    </Badge>
  );
};

export default function ItemStoreStockCard({
  stocks,
  isLoading,
  showItemName = false,
}: ItemStoreStockCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-32 text-gray-500">
          <Package className="w-12 h-12 mb-2 text-gray-400" />
          <p>No stock information available</p>
          <p className="text-sm text-gray-400 mt-1">
            This item has not been stocked in any store yet
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalQuantity = stocks.reduce((sum, stock) => sum + (stock.quantity || 0), 0);
  const totalAvailable = stocks.reduce((sum, stock) => sum + (stock.available_quantity || 0), 0);
  const totalReserved = stocks.reduce((sum, stock) => sum + (stock.reserved_quantity || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Package className="w-5 h-5" />
            Stock Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-blue-600">Total Stores</p>
              <p className="text-2xl font-bold text-blue-900">{stocks.length}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Quantity</p>
              <p className="text-2xl font-bold text-blue-900">{totalQuantity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-900">{totalAvailable.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-orange-600">Reserved</p>
              <p className="text-2xl font-bold text-orange-900">{totalReserved.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-Store Stock Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Stock by Store</CardTitle>
          <p className="text-sm text-gray-500">
            View inventory levels across all stores
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => {
              const alertLevel = getStockAlertLevel(
                stock.available_quantity,
                stock.re_order_level,
                stock.buffer_stock
              );

              return (
                <Card key={stock.id} className="border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    {/* Store Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {stock.store_detail?.name || "Unknown Store"}
                        </h4>
                        <p className="text-xs text-gray-500 font-mono">
                          {stock.store_detail?.code}
                        </p>
                        <p className="text-xs text-gray-500">
                          {stock.store_detail?.location?.name}
                        </p>
                      </div>
                      {getAlertBadge(alertLevel)}
                    </div>

                    {showItemName && stock.item_detail && (
                      <div className="border-t pt-2">
                        <p className="text-sm font-medium text-gray-700">
                          {stock.item_detail.name}
                        </p>
                      </div>
                    )}

                    {/* Stock Quantities */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
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
                        <p className="text-yellow-600 text-xs flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          Reorder
                        </p>
                        <p className="font-semibold text-yellow-900">
                          {stock.re_order_level?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>

                    {/* Alert Messages */}
                    {alertLevel === "OUT_OF_STOCK" && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-xs text-red-800 font-medium">
                          Out of stock - Restock needed
                        </p>
                      </div>
                    )}
                    {alertLevel === "CRITICAL" && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-2">
                        <p className="text-xs text-orange-800 font-medium">
                          Critical level - Reorder immediately
                        </p>
                      </div>
                    )}
                    {alertLevel === "LOW" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs text-yellow-800 font-medium">
                          Low stock - Consider reordering
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
