"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, TrendingDown, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LineItem {
  id: string;
  description: string;
  specification: string;
  quantity: number;
  uom: string;
}

export interface VendorBid {
  vendorId: string;
  vendorName: string;
  brand?: string;
  unitPrice: number;
  total: number;
}

export interface LineItemWithBids extends LineItem {
  vendorBids: Record<string, VendorBid>; // vendorId → VendorBid
}

export interface ItemSelection {
  itemId: string;
  vendorId: string;
  vendorName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  brand?: string;
}

interface LineItemComparisonProps {
  items: LineItemWithBids[];
  vendors: Array<{ id: string; name: string }>;
  onSelectionChange: (selections: ItemSelection[]) => void;
  initialSelections?: ItemSelection[];
}

/**
 * Multi-Vendor Line Item Comparison Table
 * Allows selecting items from different vendors with price highlighting
 */
export const LineItemComparison = ({
  items,
  vendors,
  onSelectionChange,
  initialSelections = []
}: LineItemComparisonProps) => {
  // State: Map of itemId → vendorId (which vendor is selected for each item)
  const [selections, setSelections] = useState<Map<string, string>>(() => {
    const map = new Map<string, string>();
    initialSelections.forEach(sel => map.set(sel.itemId, sel.vendorId));
    return map;
  });

  // Find lowest price for each item (for highlighting)
  const lowestPrices = useMemo(() => {
    const prices = new Map<string, { vendorId: string; price: number }>();

    items.forEach(item => {
      let lowestPrice = Infinity;
      let lowestVendor = "";

      Object.entries(item.vendorBids).forEach(([vendorId, bid]) => {
        if (bid.unitPrice < lowestPrice && bid.unitPrice > 0) {
          lowestPrice = bid.unitPrice;
          lowestVendor = vendorId;
        }
      });

      if (lowestVendor) {
        prices.set(item.id, { vendorId: lowestVendor, price: lowestPrice });
      }
    });

    return prices;
  }, [items]);

  // Calculate totals per vendor
  const vendorTotals = useMemo(() => {
    const totals = new Map<string, number>();

    selections.forEach((vendorId, itemId) => {
      const item = items.find(i => i.id === itemId);
      if (item && item.vendorBids[vendorId]) {
        const current = totals.get(vendorId) || 0;
        totals.set(vendorId, current + item.vendorBids[vendorId].total);
      }
    });

    return totals;
  }, [selections, items]);

  // Grand total across all selected items
  const grandTotal = useMemo(() => {
    return Array.from(vendorTotals.values()).reduce((sum, total) => sum + total, 0);
  }, [vendorTotals]);

  // Handle item selection toggle
  const handleSelectionToggle = (itemId: string, vendorId: string) => {
    const newSelections = new Map(selections);

    if (selections.get(itemId) === vendorId) {
      // Deselect
      newSelections.delete(itemId);
    } else {
      // Select this vendor for this item
      newSelections.set(itemId, vendorId);
    }

    setSelections(newSelections);

    // Convert to ItemSelection[] format
    const itemSelections: ItemSelection[] = [];
    newSelections.forEach((vendorId, itemId) => {
      const item = items.find(i => i.id === itemId);
      if (item && item.vendorBids[vendorId]) {
        const bid = item.vendorBids[vendorId];
        itemSelections.push({
          itemId,
          vendorId,
          vendorName: bid.vendorName,
          description: item.description,
          quantity: item.quantity,
          unitPrice: bid.unitPrice,
          total: bid.total,
          brand: bid.brand
        });
      }
    });

    onSelectionChange(itemSelections);
  };

  // Select all items from one vendor
  const handleSelectAllVendor = (vendorId: string) => {
    const newSelections = new Map(selections);
    let anyDeselected = false;

    items.forEach(item => {
      if (item.vendorBids[vendorId]) {
        if (selections.get(item.id) !== vendorId) {
          anyDeselected = true;
        }
      }
    });

    if (anyDeselected) {
      // Select all from this vendor
      items.forEach(item => {
        if (item.vendorBids[vendorId]) {
          newSelections.set(item.id, vendorId);
        }
      });
    } else {
      // Deselect all from this vendor
      items.forEach(item => {
        if (selections.get(item.id) === vendorId) {
          newSelections.delete(item.id);
        }
      });
    }

    setSelections(newSelections);

    // Trigger callback
    const itemSelections: ItemSelection[] = [];
    newSelections.forEach((vendorId, itemId) => {
      const item = items.find(i => i.id === itemId);
      if (item && item.vendorBids[vendorId]) {
        const bid = item.vendorBids[vendorId];
        itemSelections.push({
          itemId,
          vendorId,
          vendorName: bid.vendorName,
          description: item.description,
          quantity: item.quantity,
          unitPrice: bid.unitPrice,
          total: bid.total,
          brand: bid.brand
        });
      }
    });

    onSelectionChange(itemSelections);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Line Item Comparison</h3>
              <p className="text-sm text-slate-600">
                Select items from different vendors • {selections.size}/{items.length} items selected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-600">Total Selected</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₦{grandTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-100">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-100 border-r border-slate-300 px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-12">
                #
              </th>
              <th className="sticky left-12 z-10 bg-slate-100 border-r border-slate-300 px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[300px]">
                Item Description
              </th>
              <th className="border-r border-slate-300 px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">
                Qty
              </th>
              {vendors.map(vendor => (
                <th
                  key={vendor.id}
                  className="border-r border-slate-300 px-4 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider min-w-[200px]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{vendor.name}</span>
                    </div>
                    <Button
                      onClick={() => handleSelectAllVendor(vendor.id)}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs h-7"
                    >
                      Select All
                    </Button>
                    {vendorTotals.get(vendor.id) ? (
                      <div className="text-emerald-700 font-bold text-sm">
                        ₦{vendorTotals.get(vendor.id)?.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs">No items</div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-slate-100">
            {items.map((item, index) => {
              const lowestPrice = lowestPrices.get(item.id);

              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="sticky left-0 z-10 bg-white border-r border-slate-200 px-4 py-3 text-center font-medium text-slate-900">
                    {index + 1}
                  </td>
                  <td className="sticky left-12 z-10 bg-white border-r border-slate-200 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{item.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.specification}</p>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-4 py-3 text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.quantity}
                    </Badge>
                  </td>
                  {vendors.map(vendor => {
                    const bid = item.vendorBids[vendor.id];
                    const isSelected = selections.get(item.id) === vendor.id;
                    const isLowestPrice = lowestPrice?.vendorId === vendor.id;

                    if (!bid) {
                      return (
                        <td
                          key={vendor.id}
                          className="border-r border-slate-200 px-4 py-3 text-center bg-slate-50"
                        >
                          <span className="text-slate-400 text-xs">No bid</span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={vendor.id}
                        className={cn(
                          "border-r border-slate-200 px-4 py-3",
                          isSelected && "bg-emerald-50",
                          isLowestPrice && !isSelected && "bg-green-50"
                        )}
                      >
                        <div className="space-y-2">
                          {/* Checkbox */}
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleSelectionToggle(item.id, vendor.id)}
                            />
                          </div>

                          {/* Brand */}
                          {bid.brand && (
                            <div className="text-xs text-slate-600 text-center">
                              {bid.brand}
                            </div>
                          )}

                          {/* Unit Price */}
                          <div className={cn(
                            "text-sm font-medium text-center",
                            isLowestPrice && "text-emerald-700 font-bold"
                          )}>
                            ₦{bid.unitPrice.toLocaleString()}
                            {isLowestPrice && (
                              <TrendingDown className="inline w-3 h-3 ml-1" />
                            )}
                          </div>

                          {/* Total */}
                          <div className="text-xs text-slate-600 text-center font-mono">
                            Total: ₦{bid.total.toLocaleString()}
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="flex items-center justify-center gap-1 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="text-xs font-semibold">Selected</span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Table Footer - Totals */}
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td colSpan={3} className="px-4 py-4 text-right font-bold text-slate-900">
                Selected Totals:
              </td>
              {vendors.map(vendor => {
                const total = vendorTotals.get(vendor.id) || 0;
                return (
                  <td
                    key={vendor.id}
                    className="border-r border-slate-200 px-4 py-4 text-center"
                  >
                    {total > 0 ? (
                      <div className="text-lg font-bold text-emerald-700">
                        ₦{total.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-slate-400">—</div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
