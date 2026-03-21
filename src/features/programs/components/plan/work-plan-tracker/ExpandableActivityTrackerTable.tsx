"use client";

import React, { useState } from "react";
import { TWorkPlanTrackerData } from "@/features/programs/types/activity-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { formatNumberCurrency } from "@/utils/utls";
import ExpandableCostSheetTrackers from "./ExpandableCostSheetTrackers";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import PencilIcon from "@/components/icons/PencilIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "@/constants/RouterConstants";

interface ExpandableActivityTrackerTableProps {
  data: TWorkPlanTrackerData[];
  workPlanId: string;
  isLoading?: boolean;
}

export default function ExpandableActivityTrackerTable({
  data,
  workPlanId,
  isLoading = false,
}: ExpandableActivityTrackerTableProps) {
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      NOT_DONE: { label: "Not Done", className: "bg-gray-100 text-gray-700" },
      IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
      DONE: { label: "Done", className: "bg-green-100 text-green-700" },
      ON_HOLD: { label: "On Hold", className: "bg-yellow-100 text-yellow-700" },
    };
    const config = statusConfig[status] || statusConfig.NOT_DONE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No activity trackers found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left w-10"></th>
            <th className="px-4 py-3 text-left">Activity Type</th>
            <th className="px-4 py-3 text-left">Activity Number</th>
            <th className="px-4 py-3 text-left">Budget Line</th>
            <th className="px-4 py-3 text-left">Activity</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Achievement (%)</th>
            <th className="px-4 py-3 text-left">Budget (NGN)</th>
            <th className="px-4 py-3 text-left">Expended (NGN)</th>
            <th className="px-4 py-3 text-left w-10">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isExpanded = expandedRows.has(row.work_plan_activity || row.id);
            const activityType = row.activity_type || "PLANNED";
            const hasCostSheets = activityType === "PLANNED" && row.work_plan_activity; // Only planned activities can have cost sheets

            return (
              <React.Fragment key={row.id}>
                {/* Main Activity Row */}
                <tr className={`border-b hover:bg-gray-50 ${isExpanded ? "bg-blue-50" : ""}`}>
                  <td className="px-4 py-3">
                    {hasCostSheets && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleRow(row.work_plan_activity!)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`${
                        activityType === "UNPLANNED" ? "bg-orange-500" : "bg-blue-500"
                      }`}
                    >
                      {activityType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{row.activity_number || "N/A"}</td>
                  <td className="px-4 py-3">{row.budget_line || "N/A"}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={row.activity}>
                    {row.activity || "N/A"}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(row.status || "NOT_DONE")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(row.percentage_achievement || 0, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{row.percentage_achievement || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatNumberCurrency(row.total_amount_ngn || 0)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatNumberCurrency(row.amount_expended_ngn || 0)}
                  </td>
                  <td className="px-4 py-3">
                    <Popover>
                      <PopoverTrigger>
                        <MoreOptionsHorizontalIcon />
                      </PopoverTrigger>
                      <PopoverContent className="w-fit">
                        <div className="flex flex-col gap-2">
                          {!row.isDefaultTracker && (
                            <Link
                              href={`${RouteEnum.ACTIVITY_TRACKER}/${workPlanId}/edit/${row.id}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
                            >
                              <PencilIcon />
                              Edit
                            </Link>
                          )}
                          <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600">
                            <DeleteIcon />
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>

                {/* Expandable Cost Sheet Trackers */}
                {hasCostSheets && isExpanded && (
                  <ExpandableCostSheetTrackers
                    activityId={row.work_plan_activity!}
                    activityNumber={row.activity_number || ""}
                    isEditable={true}
                  />
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
