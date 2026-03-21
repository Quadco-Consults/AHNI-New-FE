"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/Loading";
import { AlertCircle, ChevronDown, ChevronRight, Plus } from "lucide-react";
import {
  useCostSheetTrackersByActivity,
  useBulkCreateTrackers,
} from "@/features/programs/controllers/costSheetTrackerController";
import CostSheetTrackerRow from "./CostSheetTrackerRow";
import { toast } from "sonner";

interface ExpandableCostSheetTrackersProps {
  activityId: string;
  activityNumber: string;
  isEditable?: boolean;
}

export default function ExpandableCostSheetTrackers({
  activityId,
  activityNumber,
  isEditable = true,
}: ExpandableCostSheetTrackersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: trackers, isLoading, error } = useCostSheetTrackersByActivity(
    activityId,
    isExpanded // Only fetch when expanded
  );

  const bulkCreate = useBulkCreateTrackers();

  const handleBulkCreate = async () => {
    try {
      await bulkCreate.mutateAsync(activityId);
      toast.success("Trackers created for all cost sheets");
    } catch (error) {
      toast.error("Failed to create trackers");
      console.error(error);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Expand/Collapse Button Row */}
      <tr className="bg-blue-50 hover:bg-blue-100 cursor-pointer border-t border-blue-200">
        <td colSpan={12} className="px-4 py-2" onClick={toggleExpand}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                )}
              </Button>
              <span className="text-sm font-medium text-blue-900">
                {isExpanded ? "Hide" : "Show"} Sub-Activities / Cost Breakdown
              </span>
              {trackers && trackers.length > 0 && (
                <span className="text-xs text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                  {trackers.length} {trackers.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {isExpanded && isEditable && trackers && trackers.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBulkCreate();
                }}
                disabled={bulkCreate.isPending}
                className="flex gap-2 text-xs"
              >
                <Plus className="w-3 h-3" />
                {bulkCreate.isPending ? "Creating..." : "Create Trackers"}
              </Button>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {isLoading ? (
            <tr>
              <td colSpan={12} className="text-center py-8 bg-gray-50">
                <LoadingSpinner />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={12} className="text-center py-8 bg-red-50">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>Failed to load cost sheet trackers</span>
                </div>
              </td>
            </tr>
          ) : trackers && trackers.length > 0 ? (
            <>
              {trackers.map((tracker) => (
                <CostSheetTrackerRow
                  key={tracker.id}
                  tracker={tracker}
                  isEditable={isEditable}
                />
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={12} className="text-center py-8 bg-yellow-50">
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">No cost sheet trackers found for this activity</p>
                    <p className="text-xs mt-1">
                      Create cost sheets first in the Cost Sheets section, then create trackers here.
                    </p>
                  </div>
                  {isEditable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkCreate}
                      disabled={bulkCreate.isPending}
                      className="flex gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      {bulkCreate.isPending ? "Creating..." : "Create Trackers Now"}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
}
