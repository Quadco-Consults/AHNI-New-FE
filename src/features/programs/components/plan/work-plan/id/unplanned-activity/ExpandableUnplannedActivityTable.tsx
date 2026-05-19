"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Edit2 } from "lucide-react";
import { formatNumberCurrency } from "@/utils/utls";
import ExpandableUnplannedCostSheets from "./ExpandableUnplannedCostSheets";

interface ExpandableUnplannedActivityTableProps {
  data: any[];
  onEditActivity: (activity: any) => void;
}

export default function ExpandableUnplannedActivityTable({
  data,
  onEditActivity,
}: ExpandableUnplannedActivityTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (activityId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedRows(newExpanded);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No unplanned activities found
      </div>
    );
  }

  // Calculate totals
  const totalNGN = data.reduce((sum, row) => {
    const val = parseFloat(row.total_amount_ngn || "0");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalUSD = data.reduce((sum, row) => {
    const val = parseFloat(row.total_amount_usd || "0");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b sticky top-0">
          <tr>
            <th className="px-2 py-3 text-left w-10"></th>
            <th className="px-3 py-3 text-left min-w-[100px]">Activity Type</th>
            <th className="px-3 py-3 text-left min-w-[150px]">ACT. No.</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Budget Line</th>
            <th className="px-3 py-3 text-left min-w-[250px]">Objectives/IR/Sub Objectives</th>
            <th className="px-3 py-3 text-left min-w-[250px]">Activity</th>
            <th className="px-3 py-3 text-left min-w-[250px]">Activity Justification</th>
            <th className="px-3 py-3 text-left min-w-[250px]">Description of Output</th>
            <th className="px-3 py-3 text-left min-w-[150px]">Lead Department</th>
            <th className="px-3 py-3 text-left min-w-[150px]">Lead Person</th>
            <th className="px-3 py-3 text-left min-w-[150px]">Location of Activity</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Expected Result</th>
            <th className="px-3 py-3 text-left min-w-[150px]">Indicator</th>
            <th className="px-3 py-3 text-left min-w-[100px]">MoV</th>
            <th className="px-3 py-3 text-right min-w-[150px] cursor-pointer hover:bg-gray-200">
              Unit Cost
            </th>
            <th className="px-3 py-3 text-right min-w-[150px]">Total (NGN)</th>
            <th className="px-3 py-3 text-right min-w-[150px]">Total (USD)</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Cost Category</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Cost Grouping</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Cost Input</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Intervention Area</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Module</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Comments</th>
            <th className="px-3 py-3 text-left min-w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isExpanded = expandedRows.has(row.id);

            return (
              <React.Fragment key={row.id}>
                {/* Main Activity Row */}
                <tr className={`border-b hover:bg-gray-50 ${isExpanded ? "bg-blue-50" : ""}`}>
                  <td className="px-2 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleRow(row.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </td>
                  <td className="px-3 py-3">
                    <Badge className="bg-orange-500 text-white">
                      UNPLANNED
                    </Badge>
                  </td>
                  <td className="px-3 py-3 font-medium">{row.activity_number || "N/A"}</td>
                  <td className="px-3 py-3">{row.budget_line?.name || row.budget_line || "N/A"}</td>
                  <td className="px-3 py-3">{row.objectives_sub_objectives || "-"}</td>
                  <td className="px-3 py-3">{row.activity || "-"}</td>
                  <td className="px-3 py-3">{row.activity_justification || "-"}</td>
                  <td className="px-3 py-3">{row.description_of_output || "-"}</td>
                  <td className="px-3 py-3">{row.lead_dept || "-"}</td>
                  <td className="px-3 py-3">{row.lead_person || "-"}</td>
                  <td className="px-3 py-3">{row.location || "-"}</td>
                  <td className="px-3 py-3">{row.expected_result || "-"}</td>
                  <td className="px-3 py-3">{row.indicator || "-"}</td>
                  <td className="px-3 py-3">{row.mov || "-"}</td>
                  <td
                    className="px-3 py-3 text-right font-medium cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => toggleRow(row.id)}
                  >
                    {row.unit_cost_ngn !== null
                      ? formatNumberCurrency(row.unit_cost_ngn, "NGN")
                      : "-"}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">
                    {formatNumberCurrency(parseFloat(row.total_amount_ngn || "0"), "NGN")}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">
                    {formatNumberCurrency(parseFloat(row.total_amount_usd || "0"), "USD")}
                  </td>
                  <td className="px-3 py-3">{row.cost_category?.name || "-"}</td>
                  <td className="px-3 py-3">{row.cost_grouping?.name || "-"}</td>
                  <td className="px-3 py-3">{row.cost_input?.name || "-"}</td>
                  <td className="px-3 py-3">{row.intervention_area?.name || "-"}</td>
                  <td className="px-3 py-3">{row.module?.name || "-"}</td>
                  <td className="px-3 py-3">{row.comments || "-"}</td>
                  <td className="px-3 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditActivity(row)}
                      className="h-8 w-8 p-0"
                      title="Edit unplanned activity details"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>

                {/* Expandable Cost Sheet Details */}
                <ExpandableUnplannedCostSheets
                  activityPlanId={row.id}
                  activityNumber={row.activity_number || ""}
                  isExpanded={isExpanded}
                />
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold border-t-2">
          <tr>
            <td colSpan={15} className="px-3 py-3 text-right">
              Total:
            </td>
            <td className="px-3 py-3 text-right">
              {formatNumberCurrency(totalNGN, "NGN")}
            </td>
            <td className="px-3 py-3 text-right">
              {formatNumberCurrency(totalUSD, "USD")}
            </td>
            <td colSpan={7}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
