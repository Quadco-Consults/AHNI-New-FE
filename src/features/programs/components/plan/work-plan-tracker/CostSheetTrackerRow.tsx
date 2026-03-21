"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, Edit2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  CostSheetTracker,
  useQuickUpdateTracker,
  useUpdateCostSheetTracker,
} from "@/features/programs/controllers/costSheetTrackerController";

interface CostSheetTrackerRowProps {
  tracker: CostSheetTracker;
  isEditable?: boolean;
}

export default function CostSheetTrackerRow({ tracker, isEditable = true }: CostSheetTrackerRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: tracker.status,
    percentage_achievement: tracker.percentage_achievement,
    amount_expended_ngn: tracker.amount_expended_ngn,
    achieved_results: tracker.achieved_results || "",
    comments: tracker.comments || "",
  });

  const quickUpdate = useQuickUpdateTracker();
  const fullUpdate = useUpdateCostSheetTracker();

  const handleSave = async () => {
    try {
      await fullUpdate.mutateAsync({
        id: tracker.id,
        data: editData,
      });
      toast.success("Cost sheet tracker updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update tracker");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditData({
      status: tracker.status,
      percentage_achievement: tracker.percentage_achievement,
      amount_expended_ngn: tracker.amount_expended_ngn,
      achieved_results: tracker.achieved_results || "",
      comments: tracker.comments || "",
    });
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NOT_DONE: { label: "Not Done", className: "bg-gray-100 text-gray-700" },
      IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
      DONE: { label: "Done", className: "bg-green-100 text-green-700" },
      ON_HOLD: { label: "On Hold", className: "bg-yellow-100 text-yellow-700" },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NOT_DONE;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "ON_HOLD":
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const budgetVarianceColor = tracker.budget_variance >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
      {/* Cost Sheet Header */}
      <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(tracker.status)}
            <h4 className="font-semibold text-gray-800">
              {tracker.cost_sheet_data?.description || "Sub-Activity"}
            </h4>
            {getStatusBadge(tracker.status)}
            {tracker.is_on_track && (
              <Badge className="bg-green-50 text-green-700">On Track</Badge>
            )}
            {tracker.is_over_budget && (
              <Badge className="bg-red-50 text-red-700">Over Budget</Badge>
            )}
          </div>

          {/* Cost Sheet Details */}
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
            <div>
              <span className="font-medium">Units:</span> {tracker.cost_sheet_data?.units || 0}
            </div>
            <div>
              <span className="font-medium">Days:</span> {tracker.cost_sheet_data?.days || 0}
            </div>
            <div>
              <span className="font-medium">Frequency:</span> {tracker.cost_sheet_data?.frequency || 0}
            </div>
            <div>
              <span className="font-medium">Rate:</span> {formatCurrency(tracker.cost_sheet_data?.rate_ngn || 0)}
            </div>
          </div>
        </div>

        {isEditable && !isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Progress
          </Button>
        )}
      </div>

      {/* Tracking Form */}
      <div className="grid grid-cols-12 gap-4">
        {/* Budget & Expenditure */}
        <div className="col-span-3 space-y-2">
          <label className="text-xs font-medium text-gray-700">Budget (NGN)</label>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(tracker.cost_sheet_data?.total_cost_ngn || 0)}
          </div>
        </div>

        <div className="col-span-3 space-y-2">
          <label className="text-xs font-medium text-gray-700">Amount Expended (NGN)</label>
          {isEditing ? (
            <Input
              type="number"
              value={editData.amount_expended_ngn}
              onChange={(e) =>
                setEditData({ ...editData, amount_expended_ngn: parseFloat(e.target.value) || 0 })
              }
              className="h-9"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(tracker.amount_expended_ngn)}
            </div>
          )}
        </div>

        <div className="col-span-3 space-y-2">
          <label className="text-xs font-medium text-gray-700">Variance</label>
          <div className={`text-lg font-semibold ${budgetVarianceColor}`}>
            {formatCurrency(tracker.budget_variance)}
            <span className="text-xs ml-2">
              ({tracker.budget_variance_percentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="col-span-3 space-y-2">
          <label className="text-xs font-medium text-gray-700">Achievement (%)</label>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              max="100"
              value={editData.percentage_achievement}
              onChange={(e) =>
                setEditData({ ...editData, percentage_achievement: parseFloat(e.target.value) || 0 })
              }
              className="h-9"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {tracker.percentage_achievement}%
            </div>
          )}
        </div>

        {/* Status */}
        <div className="col-span-4 space-y-2">
          <label className="text-xs font-medium text-gray-700">Status</label>
          {isEditing ? (
            <Select value={editData.status} onValueChange={(value) => setEditData({ ...editData, status: value as any })}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_DONE">Not Done</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div>{getStatusBadge(tracker.status)}</div>
          )}
        </div>

        {/* Achieved Results */}
        <div className="col-span-8 space-y-2">
          <label className="text-xs font-medium text-gray-700">Achieved Results</label>
          {isEditing ? (
            <Textarea
              value={editData.achieved_results}
              onChange={(e) => setEditData({ ...editData, achieved_results: e.target.value })}
              placeholder="Describe what has been achieved..."
              rows={2}
              className="text-sm"
            />
          ) : (
            <div className="text-sm text-gray-600">
              {tracker.achieved_results || "No results recorded yet"}
            </div>
          )}
        </div>

        {/* Comments */}
        {isEditing && (
          <div className="col-span-12 space-y-2">
            <label className="text-xs font-medium text-gray-700">Comments / Notes</label>
            <Textarea
              value={editData.comments}
              onChange={(e) => setEditData({ ...editData, comments: e.target.value })}
              placeholder="Additional notes, challenges, or observations..."
              rows={2}
              className="text-sm"
            />
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="col-span-12 flex gap-2 justify-end pt-2 border-t">
            <Button variant="outline" size="sm" onClick={handleCancel} className="flex gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={quickUpdate.isPending || fullUpdate.isPending}
              className="flex gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              {fullUpdate.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
