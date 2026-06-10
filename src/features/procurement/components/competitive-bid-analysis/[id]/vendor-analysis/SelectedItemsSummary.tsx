import { ShoppingCart, CheckCircle2, Package, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SelectedItem } from "./types";

interface SelectedItemsSummaryProps {
  selectedItems: SelectedItem[];
  selectedTotal: number;
}

export const SelectedItemsSummary = ({
  selectedItems,
  selectedTotal
}: SelectedItemsSummaryProps) => {
  // Group items by vendor
  const itemsByVendor = selectedItems.reduce((acc, item) => {
    if (!acc[item.vendorName]) {
      acc[item.vendorName] = [];
    }
    acc[item.vendorName].push(item);
    return acc;
  }, {} as Record<string, SelectedItem[]>);

  const vendorCount = Object.keys(itemsByVendor).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Selected Items Summary</h3>
              <p className="text-sm text-slate-600">Review items selected for award</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-600">Total Items</p>
              <p className="text-2xl font-bold text-slate-900">{selectedItems.length}</p>
            </div>
            <div className="h-10 w-px bg-slate-300" />
            <div className="text-right">
              <p className="text-xs text-slate-600">Total Amount</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₦{selectedTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium mb-2">No Items Selected</p>
            <p className="text-slate-400 text-sm">
              Go to Item Comparison tab to select items from vendors
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Vendors</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{vendorCount}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Items</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">{selectedItems.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-purple-600 opacity-50" />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Total Value</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">
                      ₦{(selectedTotal / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-600 opacity-50" />
                </div>
              </div>
            </div>

            {/* Items by Vendor */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">Items Breakdown</h4>

              {Object.entries(itemsByVendor).map(([vendorName, items]) => {
                const vendorTotal = items.reduce((sum, item) => sum + item.total, 0);

                return (
                  <div key={vendorName} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <h5 className="font-semibold text-slate-900">{vendorName}</h5>
                          <Badge variant="outline" className="ml-2">
                            {items.length} items
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-emerald-700">
                          ₦{vendorTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-4">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                              Item
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-20">
                              Qty
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-32">
                              Brand
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-600 uppercase tracking-wider w-40">
                              Unit Price
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-600 uppercase tracking-wider w-40">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {items.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-3 py-2 text-sm text-slate-900">
                                {item.description}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {item.qty}
                                </Badge>
                              </td>
                              <td className="px-3 py-2 text-center text-sm text-slate-700">
                                {item.brand || "N/A"}
                              </td>
                              <td className="px-3 py-2 text-right text-sm font-medium text-slate-900 font-mono">
                                ₦{item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-right text-sm font-bold text-emerald-700 font-mono">
                                ₦{item.total.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
