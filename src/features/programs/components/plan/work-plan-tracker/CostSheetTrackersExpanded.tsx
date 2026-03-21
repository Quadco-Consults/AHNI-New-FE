"use client";

import { useCostSheetTrackersByActivity } from "@/features/programs/controllers/costSheetTrackerController";
import { LoadingSpinner } from "@/components/Loading";
import { AlertCircle, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import CostSheetTrackerRow from "./CostSheetTrackerRow";
import { useBulkCreateTrackers } from "@/features/programs/controllers/costSheetTrackerController";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CostSheetTrackersExpandedProps {
  activityId?: string;  // For planned activities (work_plan_activity)
  activityPlanId?: string;  // For unplanned activities (activity_plan)
  activityNumber: string;
  isEditable?: boolean;
}

export default function CostSheetTrackersExpanded({
  activityId,
  activityPlanId,
  activityNumber,
  isEditable = true,
}: CostSheetTrackersExpandedProps) {
  const router = useRouter();

  // Use activityId if provided (planned), otherwise use activityPlanId (unplanned)
  const identifier = activityId || activityPlanId || "";
  const isUnplanned = !!activityPlanId && !activityId;

  const { data: trackersResponse, isLoading, error } = useCostSheetTrackersByActivity(identifier, !!identifier, isUnplanned);
  const bulkCreate = useBulkCreateTrackers();

  const trackers = trackersResponse?.data || [];

  const handleBulkCreate = async () => {
    try {
      await bulkCreate.mutateAsync(identifier, isUnplanned);
      toast.success("Trackers created for all cost sheets");
    } catch (error) {
      toast.error("Failed to create trackers");
      console.error(error);
    }
  };

  const handleNavigateToCostSheets = () => {
    if (isUnplanned) {
      // For unplanned activities, navigate to unplanned cost sheets page
      router.push(`/dashboard/programs/plan/cost-sheets/unplanned/${activityPlanId}`);
    } else {
      // For planned activities, use the existing route (need workPlanId)
      toast.info("Please use the Cost Sheets menu to manage cost sheets for this activity");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 bg-red-50">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <div className="text-sm text-red-800 text-center">
          <p className="font-medium">Failed to load cost sheet trackers</p>
          <p className="text-xs mt-1">
            {isUnplanned
              ? "You can still manage cost sheets for this activity."
              : "Please check your connection or try again later."}
          </p>
        </div>
        {isEditable && isUnplanned && (
          <Button
            variant="default"
            size="sm"
            onClick={handleNavigateToCostSheets}
            className="flex gap-2 mt-2"
          >
            <ExternalLink className="w-4 h-4" />
            Manage Cost Sheets
          </Button>
        )}
      </div>
    );
  }

  if (trackers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 bg-yellow-50">
        <AlertCircle className="w-8 h-8 text-yellow-600" />
        <div className="text-sm text-yellow-800 text-center">
          <p className="font-medium">No cost sheet trackers found for this activity</p>
          <p className="text-xs mt-1">
            {isUnplanned
              ? "Create cost sheets for this unplanned activity to start tracking."
              : "Create cost sheets first in the Cost Sheets section, then create trackers here."}
          </p>
        </div>
        {isEditable && (
          <div className="flex gap-2 mt-2">
            {isUnplanned && (
              <Button
                variant="default"
                size="sm"
                onClick={handleNavigateToCostSheets}
                className="flex gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Manage Cost Sheets
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkCreate}
              disabled={bulkCreate.isPending}
              className="flex gap-2"
            >
              <Plus className="w-4 h-4" />
              {bulkCreate.isPending ? "Creating..." : "Create Trackers for Existing Sheets"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-700">
          Cost Sheet Breakdown for Activity {activityNumber}
        </h4>
        <span className="text-xs text-gray-500">
          {trackers.length} {trackers.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-4">
        {trackers.map((tracker) => (
          <CostSheetTrackerRow
            key={tracker.id}
            tracker={tracker}
            isEditable={isEditable}
          />
        ))}
      </div>
    </div>
  );
}
