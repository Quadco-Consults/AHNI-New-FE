import { Building2, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VendorData } from "./types";

interface VendorComparisonTableProps {
  vendorData: VendorData[];
  onItemSelection: (vendorId: string, itemId: string, checked: boolean) => void;
  onSelectAllVendorItems: (vendorId: string) => void;
}

export const VendorComparisonTable = ({
  vendorData,
  onItemSelection,
  onSelectAllVendorItems
}: VendorComparisonTableProps) => {
  const maxItems = Math.max(...vendorData.map(v => v.items.length));

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
              <h3 className="text-xl font-bold text-slate-900">Item Comparison</h3>
              <p className="text-sm text-slate-600">Compare vendor submissions side by side</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 px-4 py-2">
            {vendorData.length} Vendors • {maxItems} Items
          </Badge>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="p-6 space-y-6">
        {vendorData.map((vendor) => (
          <div
            key={vendor.id}
            className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Vendor Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{vendor.name}</h4>
                    <p className="text-xs text-slate-600">TIN: {vendor.tin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-600">Grand Total</p>
                    <p className="text-lg font-bold text-emerald-700">
                      ₦{vendor.grandTotal.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => onSelectAllVendorItems(vendor.id)}
                    size="sm"
                    variant={vendor.items.every(item => item.selected) ? "default" : "outline"}
                    className={cn(
                      "ml-2",
                      vendor.items.every(item => item.selected) && "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    {vendor.items.every(item => item.selected) ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Item Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-20">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-32">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider w-40">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider w-40">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {vendor.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "hover:bg-slate-50 transition-colors",
                        item.selected && "bg-blue-50"
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={item.selected || false}
                          onCheckedChange={(checked) =>
                            onItemSelection(vendor.id, item.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{item.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.specification}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="font-mono">
                          {item.qty}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-slate-700">{item.brand || "N/A"}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-slate-900 font-mono">
                          ₦{item.unitPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-emerald-700 font-mono">
                          ₦{item.total.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vendor Footer - Quick Info */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-600">Delivery Time:</span>
                  <span className="ml-2 font-medium text-slate-900">{vendor.deliveryTime}</span>
                </div>
                <div>
                  <span className="text-slate-600">Payment Terms:</span>
                  <span className="ml-2 font-medium text-slate-900">{vendor.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-slate-600">Warranty:</span>
                  <span className="ml-2 font-medium text-slate-900">{vendor.warranty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
