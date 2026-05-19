"use client";

import { LoadingSpinner } from "@/components/Loading";
import { useGetActivityCostSheets } from "@/features/programs/controllers/activityCostSheetController";
import { formatNumberCurrency } from "@/utils/utls";

interface ExpandableCostSheetsProps {
  activityId: string;
  activityNumber: string;
  isExpanded: boolean;
}

export default function ExpandableCostSheets({
  activityId,
  activityNumber,
  isExpanded,
}: ExpandableCostSheetsProps) {
  const { data, isLoading, error } = useGetActivityCostSheets(
    activityId,
    undefined,
    isExpanded // Only fetch when expanded
  );

  const costSheets = data?.data?.results || [];

  if (!isExpanded) return null;

  return (
    <tr>
      <td colSpan={100} className="px-4 py-4 bg-gray-50 border-t border-blue-200">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Failed to load cost sheets
          </div>
        ) : costSheets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No cost sheet details available for this activity
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-900">
                Cost Sheet Details / Sub-Activities
              </span>
              <span className="text-xs text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                {costSheets.length} {costSheets.length === 1 ? "item" : "items"}
              </span>
            </div>
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left">Item/Description</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-right">Quantity</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-right">Unit Cost (NGN)</th>
                  <th className="px-3 py-2 text-right">Total Cost (NGN)</th>
                  <th className="px-3 py-2 text-right">Total Cost (USD)</th>
                  <th className="px-3 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {costSheets.map((sheet, index) => (
                  <tr
                    key={sheet.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2">{sheet.description || "N/A"}</td>
                    <td className="px-3 py-2">
                      {typeof sheet.cost_category === "object" && sheet.cost_category?.name
                        ? sheet.cost_category.name
                        : sheet.cost_category || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-right">{sheet.quantity || 0}</td>
                    <td className="px-3 py-2">{sheet.unit || "N/A"}</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatNumberCurrency(sheet.unit_cost_ngn || 0, "NGN")}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {formatNumberCurrency(sheet.total_cost_ngn || 0, "NGN")}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">
                      {formatNumberCurrency(sheet.total_cost_usd || 0, "USD")}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      {sheet.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  <td colSpan={5} className="px-3 py-2 text-right">
                    Total:
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatNumberCurrency(
                      costSheets.reduce((sum, sheet) => sum + (sheet.total_cost_ngn || 0), 0),
                      "NGN"
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatNumberCurrency(
                      costSheets.reduce((sum, sheet) => sum + (sheet.total_cost_usd || 0), 0),
                      "USD"
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </td>
    </tr>
  );
}
