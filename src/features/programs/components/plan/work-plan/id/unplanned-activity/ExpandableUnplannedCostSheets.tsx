"use client";

import { LoadingSpinner } from "@/components/Loading";
import { useGetActivityCostSheets } from "@/features/programs/controllers/activityCostSheetController";
import { formatNumberCurrency } from "@/utils/utls";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";

interface ExpandableUnplannedCostSheetsProps {
  activityPlanId: string;
  activityNumber: string;
  isExpanded: boolean;
}

export default function ExpandableUnplannedCostSheets({
  activityPlanId,
  activityNumber,
  isExpanded,
}: ExpandableUnplannedCostSheetsProps) {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useGetActivityCostSheets(
    undefined,
    activityPlanId, // Use activity plan ID for unplanned activities
    isExpanded // Only fetch when expanded
  );

  const costSheets = data?.data?.results || [];

  const handleAddCostSheet = () => {
    dispatch(
      openDialog({
        type: DialogType.ACTIVITY_COST_SHEET_MODAL,
        dialogProps: {
          header: "Add Sub-Activity",
          width: "max-w-2xl",
          activityPlanId,
          isUnplanned: true,
        },
      })
    );
  };

  const handleUploadCostSheet = () => {
    dispatch(
      openDialog({
        type: DialogType.COST_SHEET_UPLOAD_MODAL,
        dialogProps: {
          header: "Bulk Upload Sub-Activities",
          width: "max-w-4xl",
          activityPlanId,
          activityNumber,
          isUnplanned: true,
        },
      })
    );
  };

  if (!isExpanded) return null;

  return (
    <tr>
      <td colSpan={100} className="px-4 py-4 bg-gray-50 border-t border-orange-200">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            Failed to load cost sheets
          </div>
        ) : costSheets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No cost sheet details available for this unplanned activity</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleUploadCostSheet}
                variant="outline"
                size="sm"
                className="flex gap-2"
              >
                <Upload className="w-4 h-4" />
                Bulk Upload
              </Button>
              <Button
                onClick={handleAddCostSheet}
                size="sm"
                className="flex gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Sub-Activity
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-orange-900">
                  Cost Sheet Details / Sub-Activities
                </span>
                <span className="text-xs text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                  {costSheets.length} {costSheets.length === 1 ? "item" : "items"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUploadCostSheet}
                  variant="outline"
                  size="sm"
                  className="flex gap-2 text-xs"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                </Button>
                <Button
                  onClick={handleAddCostSheet}
                  size="sm"
                  className="flex gap-2 text-xs"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>
            </div>
            <div className="max-w-5xl">
              <table className="w-full text-xs border rounded-lg">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-2 py-2 text-left w-[35%]">Description</th>
                    <th className="px-2 py-2 text-center w-[8%]">Units</th>
                    <th className="px-2 py-2 text-center w-[8%]">Days</th>
                    <th className="px-2 py-2 text-center w-[10%]">Frequency</th>
                    <th className="px-2 py-2 text-right w-[14%]">Rate (₦)</th>
                    <th className="px-2 py-2 text-right w-[15%] bg-green-50">Total (₦)</th>
                    <th className="px-2 py-2 text-left w-[10%]">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {costSheets.map((sheet, index) => (
                    <tr
                      key={sheet.id}
                      className={`border-b hover:bg-orange-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-2 py-1.5 text-xs">{sheet.description || "-"}</td>
                      <td className="px-2 py-1.5 text-center font-medium">{sheet.units || 0}</td>
                      <td className="px-2 py-1.5 text-center font-medium">{sheet.days || 0}</td>
                      <td className="px-2 py-1.5 text-center font-medium">{sheet.frequency || 0}</td>
                      <td className="px-2 py-1.5 text-right font-medium">
                        {formatNumberCurrency(sheet.rate_ngn || 0, "NGN")}
                      </td>
                      <td className="px-2 py-1.5 text-right font-bold text-green-700 bg-green-50">
                        {formatNumberCurrency(Number(sheet.total_cost_ngn) || 0, "NGN")}
                      </td>
                      <td className="px-2 py-1.5 text-xs text-gray-600 truncate">
                        {sheet.comments || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-200 font-bold border-t-2">
                  <tr>
                    <td colSpan={5} className="px-2 py-2 text-right text-sm">
                      Grand Total:
                    </td>
                    <td className="px-2 py-2 text-right text-sm text-green-800 bg-green-100">
                      {formatNumberCurrency(
                        costSheets.reduce((sum, sheet) => sum + Number(sheet.total_cost_ngn || 0), 0),
                        "NGN"
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
