"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Edit2 } from "lucide-react";
import { formatNumberCurrency } from "@/utils/utls";
import ExpandableUnplannedCostSheets from "./ExpandableUnplannedCostSheets";
import { TMonth } from "@/features/programs/types/work-plan";

interface ExpandableUnplannedActivityTableProps {
  data: any[];
  onEditActivity: (activity: any) => void;
}

// Month array for fiscal year (Oct - Sep)
const months: TMonth[] = [
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep"
];

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

  // Calculate monthly totals for Gantt chart and Budget
  const monthlyTotals = months.reduce((acc, month) => {
    const frequencyTotal = data.reduce((sum, row) => {
      return sum + (row.gant_chart?.[month] || 0);
    }, 0);

    const costTotal = data.reduce((sum, row) => {
      return sum + (row.budget_chart?.[month] || 0);
    }, 0);

    acc[month] = { frequency: frequencyTotal, cost: costTotal };
    return acc;
  }, {} as Record<TMonth, { frequency: number; cost: number }>);

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
            {/* Gantt Chart Columns - Monthly Frequency */}
            <th colSpan={12} className="px-3 py-2 text-center bg-blue-50 border-l-2 border-blue-300">
              Gantt Chart / Frequency
            </th>
            <th className="px-3 py-3 text-left min-w-[150px]">Location of Activity</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Expected Result</th>
            <th className="px-3 py-3 text-left min-w-[150px]">Indicator</th>
            <th className="px-3 py-3 text-left min-w-[100px]">MoV</th>
            <th className="px-3 py-3 text-right min-w-[150px]">Unit Cost (NGN)</th>
            {/* Budget Columns - Monthly Costs */}
            <th colSpan={12} className="px-3 py-2 text-center bg-green-50 border-l-2 border-green-300">
              Monthly Budget (NGN)
            </th>
            <th className="px-3 py-3 text-right min-w-[150px] bg-blue-50">Total (NGN)</th>
            <th className="px-3 py-3 text-right min-w-[150px] bg-blue-50">Total (USD)</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Cost Category</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Cost Grouping</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Cost Input</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Intervention Area</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Module</th>
            <th className="px-3 py-3 text-left min-w-[200px]">Comments</th>
            <th className="px-3 py-3 text-left min-w-[100px]">Actions</th>
          </tr>
          {/* Second header row for month names */}
          <tr>
            <th colSpan={10}></th>
            {/* Gantt chart month headers */}
            {months.map((month) => (
              <th key={`gantt-${month}`} className="px-2 py-2 text-center text-xs font-semibold bg-blue-50 border-l border-blue-200">
                {month}
              </th>
            ))}
            <th colSpan={4}></th>
            <th></th>
            {/* Budget month headers */}
            {months.map((month) => (
              <th key={`budget-${month}`} className="px-2 py-2 text-center text-xs font-semibold bg-green-50 border-l border-green-200">
                {month}
              </th>
            ))}
            <th colSpan={9}></th>
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
                  {/* Gantt Chart - Monthly Frequency */}
                  {months.map((month) => {
                    const frequency = row.gant_chart?.[month] || 0;
                    return (
                      <td
                        key={`gantt-${row.id}-${month}`}
                        className={`px-2 py-3 text-center text-sm border-l border-blue-100 ${
                          frequency > 0 ? "bg-green-100 font-semibold" : "bg-blue-50"
                        }`}
                      >
                        {frequency > 0 ? frequency : "-"}
                      </td>
                    );
                  })}
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
                  {/* Budget - Monthly Costs */}
                  {months.map((month) => {
                    const cost = row.budget_chart?.[month] || 0;
                    return (
                      <td
                        key={`budget-${row.id}-${month}`}
                        className={`px-2 py-3 text-right text-xs border-l border-green-100 ${
                          cost > 0 ? "font-medium bg-green-50" : "text-gray-400"
                        }`}
                      >
                        {cost > 0 ? formatNumberCurrency(cost, "NGN") : "-"}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-right font-semibold bg-blue-50">
                    {formatNumberCurrency(parseFloat(row.total_amount_ngn || "0"), "NGN")}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold bg-blue-50">
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
            <td colSpan={10} className="px-3 py-3 text-right">
              Monthly Total:
            </td>
            {/* Gantt Chart Monthly Totals */}
            {months.map((month) => (
              <td key={`total-gantt-${month}`} className="px-2 py-3 text-center bg-blue-100 border-l border-blue-200">
                {monthlyTotals[month].frequency}
              </td>
            ))}
            <td colSpan={4}></td>
            <td></td>
            {/* Budget Monthly Totals */}
            {months.map((month) => (
              <td key={`total-budget-${month}`} className="px-2 py-3 text-right text-xs bg-green-100 border-l border-green-200">
                {formatNumberCurrency(monthlyTotals[month].cost, "NGN")}
              </td>
            ))}
            <td className="px-3 py-3 text-right bg-blue-100">
              {formatNumberCurrency(totalNGN, "NGN")}
            </td>
            <td className="px-3 py-3 text-right bg-blue-100">
              {formatNumberCurrency(totalUSD, "USD")}
            </td>
            <td colSpan={7}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
