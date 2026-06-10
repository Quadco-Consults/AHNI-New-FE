import FormButton from "@/components/FormButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { closeDialog } from "@/store/ui";
import {
    useCreateActivityCostSheet,
    useEditActivityCostSheet,
} from "@/features/programs/controllers/activityCostSheetController";
import { useQueryClient } from "@tanstack/react-query";
import { calculateTotalCost } from "@/features/programs/types/activity-cost-sheet";

export default function ActivityCostSheetModal() {
    const { dailog } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const costSheet = dailog?.dialogProps?.costSheet || null;
    const mode = dailog?.dialogProps?.mode || "create";

    // Get activityId with proper fallback
    const activityId = dailog?.dialogProps?.activityId ||
                       dailog?.dialogProps?.activityPlanId ||
                       costSheet?.activity ||
                       "";

    // Debug logging on mount
    console.log("ActivityCostSheetModal opened:", {
        mode,
        activityId,
        costSheet,
        dialogProps: dailog?.dialogProps
    });

    // API hooks
    const { createCostSheet, isLoading: isCreating, isSuccess: createSuccess } = useCreateActivityCostSheet();
    const { editCostSheet, isLoading: isEditing, isSuccess: editSuccess } = useEditActivityCostSheet(costSheet?.id || "");

    // Form state
    const [description, setDescription] = useState(costSheet?.description || "");
    const [units, setUnits] = useState<number>(costSheet?.units || 1);
    const [days, setDays] = useState<number>(costSheet?.days || 1);
    const [frequency, setFrequency] = useState<number>(costSheet?.frequency || 1);
    const [rateNgn, setRateNgn] = useState<number>(costSheet?.rate_ngn || 0);
    const [comments, setComments] = useState(costSheet?.comments || "");

    // Update form state when costSheet changes (for edit mode)
    useEffect(() => {
        if (costSheet && mode === "edit") {
            setDescription(costSheet.description || "");
            setUnits(costSheet.units || 1);
            setDays(costSheet.days || 1);
            setFrequency(costSheet.frequency || 1);
            setRateNgn(costSheet.rate_ngn || 0);
            setComments(costSheet.comments || "");
        }
    }, [costSheet, mode]);

    // Calculated total
    const totalCost = calculateTotalCost(units, days, frequency, rateNgn);

    // Handle success
    useEffect(() => {
        if (createSuccess || editSuccess) {
            toast.success(`Sub-activity ${mode === "create" ? "created" : "updated"} successfully`);
            // Invalidate all related queries to ensure data refresh
            queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets"] });
            queryClient.invalidateQueries({ queryKey: ["activity-cost-sheets", "activity", activityId] });
            queryClient.invalidateQueries({ queryKey: ["activity-cost-sheet-stats"] });
            dispatch(closeDialog());
        }
    }, [createSuccess, editSuccess, mode, dispatch, queryClient, activityId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!description.trim()) {
            toast.error("Please enter a description");
            return;
        }

        if (units <= 0 || days <= 0 || frequency <= 0) {
            toast.error("Units, Days, and Frequency must be greater than 0");
            return;
        }

        if (rateNgn <= 0) {
            toast.error("Rate must be greater than 0");
            return;
        }

        // Validate activityId for create mode
        if (mode === "create" && !activityId) {
            toast.error("Activity ID is missing. Please try again.");
            console.error("Missing activityId in create mode");
            return;
        }

        // Validate costSheet ID for edit mode
        if (mode === "edit" && !costSheet?.id) {
            toast.error("Cost sheet ID is missing. Please try again.");
            console.error("Missing cost sheet ID in edit mode");
            return;
        }

        try {
            if (mode === "create") {
                const createPayload = {
                    activity: activityId,  // Create uses 'activity'
                    description: description.trim(),
                    units,
                    days,
                    frequency,
                    rate_ngn: rateNgn,
                    comments: comments.trim(),
                };

                console.log("Creating cost sheet:", createPayload);
                await createCostSheet(createPayload);
            } else {
                const updatePayload = {
                    activity_id: activityId,  // Update uses 'activity_id'
                    description: description.trim(),
                    units,
                    days,
                    frequency,
                    rate_ngn: rateNgn,
                    comments: comments.trim(),
                };

                console.log("Updating cost sheet:", updatePayload);
                await editCostSheet(updatePayload);
            }
        } catch (error: any) {
            console.error(`Cost sheet ${mode} error:`, error);
            toast.error(error?.message || `Failed to ${mode} sub-activity`);
        }
    };

    const isLoading = isCreating || isEditing;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description" className="required">
                    Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed description of the sub-activity..."
                    rows={3}
                    required
                />
                <p className="text-xs text-gray-500">
                    Provide a clear description of what this cost covers
                </p>
            </div>

            {/* Calculation Fields Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Units */}
                <div className="space-y-2">
                    <Label htmlFor="units" className="required">
                        Units <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="units"
                        type="number"
                        min="1"
                        step="1"
                        value={units}
                        onChange={(e) => setUnits(Number(e.target.value))}
                        required
                    />
                    <p className="text-xs text-gray-500">Number of units</p>
                </div>

                {/* Days */}
                <div className="space-y-2">
                    <Label htmlFor="days" className="required">
                        Days <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="days"
                        type="number"
                        min="1"
                        step="1"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        required
                    />
                    <p className="text-xs text-gray-500">Duration in days</p>
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                    <Label htmlFor="frequency" className="required">
                        Frequency <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="frequency"
                        type="number"
                        min="1"
                        step="1"
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        required
                    />
                    <p className="text-xs text-gray-500">How many times</p>
                </div>

                {/* Rate */}
                <div className="space-y-2">
                    <Label htmlFor="rate_ngn" className="required">
                        Rate (₦) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="rate_ngn"
                        type="number"
                        min="0"
                        step="0.01"
                        value={rateNgn}
                        onChange={(e) => setRateNgn(Number(e.target.value))}
                        required
                    />
                    <p className="text-xs text-gray-500">Rate in Naira</p>
                </div>
            </div>

            {/* Total Cost Display */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Calculated Total Cost</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Formula: Units × Days × Frequency × Rate
                        </p>
                        <p className="text-xs text-gray-500">
                            = {units} × {days} × {frequency} × ₦{rateNgn.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-700">
                            ₦{totalCost.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add any additional notes or comments..."
                    rows={2}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => dispatch(closeDialog())}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <FormButton
                    type="submit"
                    loading={isLoading}
                    className="px-6"
                >
                    {mode === "create" ? "Create Sub-Activity" : "Update Sub-Activity"}
                </FormButton>
            </div>
        </form>
    );
}
