import FormButton from "@/components/FormButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { closeDialog } from "@/store/ui";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllCostCategories } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetAllCostGroupingsQuery } from "@/features/modules/controllers/finance/costGroupingController";
import { useGetAllCostInputs } from "@/features/modules/controllers/finance/costInputController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";
// Note: Budget lines API is returning 404, we'll need to use the working dropdown endpoint or fallback data
import { useEditActivityPlan } from "@/features/programs/controllers/activityPlanController";
import {
    useGetAllActivityTrackers,
    usePatchActivityTracker
} from "@/features/programs/controllers/activityTrackerController";
import { useQueryClient } from "@tanstack/react-query";

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export default function EditUnplannedActivityModal() {
    const { dailog } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const activityData = dailog?.dialogProps?.activityData || {};
    const onSuccess = dailog?.dialogProps?.onSuccess;

    // Debug the actual data structure being passed to the modal
    console.log('=== EDIT MODAL DEBUG ===');
    console.log('Raw activityData:', activityData);
    console.log('Available keys:', Object.keys(activityData));
    console.log('Sample values:', {
        cost_category: activityData.cost_category,
        cost_grouping: activityData.cost_grouping,
        responsible_person: activityData.responsible_person,
        location: activityData.location,
        expected_results: activityData.expected_results,
        monthly_costs: activityData.monthly_costs,
        unit_cost_ngn: activityData.unit_cost_ngn,
    });
    console.log('======================');

    // Use the real API hook for updating
    const { editActivityPlan, isLoading: isUpdating, isSuccess } = useEditActivityPlan(activityData.id);

    // Get all activity trackers to find the tracker for this activity
    const { data: trackersData } = useGetAllActivityTrackers({
        page: 1,
        size: 1000, // Get all trackers to search for the right one
        search: "",
        status: "",
        work_plan__id: "",
        enabled: true,
    });

    // Find tracker for this activity - track by activity name and unplanned status
    const activityTracker = trackersData?.data?.results?.find(tracker =>
        tracker.activity_name === activityData.activity_description &&
        tracker.is_unplanned === true
    );

    // Initialize patch tracker hook - only if we find a tracker
    const { patchActivityTracker, isLoading: isTrackerLoading } = usePatchActivityTracker(
        activityTracker?.id || ""
    );

    // Fetch dropdown data
    const { data: departments } = useGetAllDepartments({ size: 100 });
    const { data: locations } = useGetAllLocations({ size: 100 });
    const { data: users } = useGetAllUsers({ size: 100 });
    // Budget lines API returns 404, so we'll use the working dropdown endpoint or fallback data
    const budgetLines = null; // Will use fallback data until dropdown endpoint is implemented
    const { data: costCategories } = useGetAllCostCategories({ size: 100 });
    const { data: costGroupings } = useGetAllCostGroupingsQuery({ size: 100 });
    const { data: costInputs } = useGetAllCostInputs({ size: 100 });
    const { data: interventionAreas } = useGetAllInterventionAreas({ size: 100 });

    // Debug logging - check response structures
    console.log('Detailed API responses:', {
        departments: { raw: departments, hasResults: !!departments?.data?.results },
        budgetLines: { raw: budgetLines, hasResults: !!budgetLines?.data?.results },
        costCategories: { raw: costCategories, hasResults: !!costCategories?.data?.results },
        costGroupings: { raw: costGroupings, hasResults: !!costGroupings?.data?.results },
        costInputs: { raw: costInputs, hasResults: !!costInputs?.data?.results },
        interventionAreas: { raw: interventionAreas, hasResults: !!interventionAreas?.data?.results }
    });

    // Fallback data - use if API returns empty or fails
    const fallbackBudgetLines = [
        { id: 'bl1', name: 'New BL' },
        { id: 'bl2', name: 'BL003' },
        { id: 'bl3', name: 'bl1' },
        { id: 'bl4', name: 'N/A' }
    ];

    const fallbackCostCategories = [
        { id: 'cat1', name: 'TEST CATEGORY' },
        { id: 'cat2', name: 'Operations' },
        { id: 'cat3', name: 'Program Activities' },
        { id: 'cat4', name: 'Administrative' }
    ];

    const fallbackCostGroupings = [
        { id: 'group1', name: 'GROIP 1' },
        { id: 'group2', name: 'Personnel' },
        { id: 'group3', name: 'Equipment' },
        { id: 'group4', name: 'Travel' }
    ];

    const fallbackCostInputs = [
        { id: 'input1', name: 'INPUT 1' },
        { id: 'input2', name: 'Salaries' },
        { id: 'input3', name: 'Consultancy' },
        { id: 'input4', name: 'Supplies' }
    ];

    const fallbackInterventionAreas = [
        { id: 'area1', name: '000088.999./kkks' },
        { id: 'area2', name: 'Health' },
        { id: 'area3', name: 'Education' },
        { id: 'area4', name: 'Agriculture' }
    ];

    // Helper function to find user ID from name
    const findUserIdByName = (userName: string) => {
        if (!userName || !users?.data?.results) return "";

        // First try to find exact UUID match (if it's already an ID)
        const directMatch = users.data.results.find((user: any) => user.id === userName);
        if (directMatch) return userName;

        // Otherwise try to match by name
        const nameMatch = users.data.results.find((user: any) =>
            `${user.first_name} ${user.last_name}` === userName ||
            user.first_name === userName ||
            user.last_name === userName
        );
        return nameMatch?.id || "";
    };

    // Form state matching actual API field names from debug logs
    const [formData, setFormData] = useState({
        // Core activity fields
        activity_number: activityData.work_plan_activity_identifier || activityData.activity_identifier || activityData.activity_code || "UNPLANNED",
        budget_line: activityData.budget_line || (typeof activityData.budget_line === 'object' ? activityData.budget_line?.name : "") || "",
        objectives_sub_objectives: activityData.objectives_sub_objectives || activityData.objective || "",
        activity_description: activityData.activity_description || activityData.activity || activityData.activity_name || "",
        activity_justification: activityData.justification || activityData.activity_justification || "",

        // Optional fields - using actual API field names
        responsible_person: findUserIdByName(activityData.responsible_person || ""),
        location: activityData.location || "",
        expected_results: activityData.expected_results || activityData.expected_output || "",
        comments: activityData.comments || "",

        // Lead department - using actual API field names
        lead_dept: activityData.lead_dept || activityData.lead_department || "",

        // Unit cost from API
        unit_cost_ngn: activityData.unit_cost_ngn?.toString() || activityData.unit_cost?.toString() || "",

        // Cost fields - using actual API field names (they're strings in the API)
        cost_category: activityData.cost_category || "",
        cost_grouping: activityData.cost_grouping || "",
        cost_input: activityData.cost_input || "",
        intervention_area: activityData.intervention_area || "",

        // Performance fields - using actual API field names
        indicator: activityData.indicator || activityData.performance_indicator || "",
        mov: activityData.mov || activityData.means_of_verification || "",

        // Monthly frequencies from API
        gantt_chart: {
            Oct: activityData.monthly_costs?.Oct || 0,
            Nov: activityData.monthly_costs?.Nov || 0,
            Dec: activityData.monthly_costs?.Dec || 0,
            Jan: activityData.monthly_costs?.Jan || 0,
            Feb: activityData.monthly_costs?.Feb || 0,
            Mar: activityData.monthly_costs?.Mar || 0,
            Apr: activityData.monthly_costs?.Apr || 0,
            May: activityData.monthly_costs?.May || 0,
            Jun: activityData.monthly_costs?.Jun || 0,
            Jul: activityData.monthly_costs?.Jul || 0,
            Aug: activityData.monthly_costs?.Aug || 0,
            Sep: activityData.monthly_costs?.Sep || 0,
        }
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMonthChange = (month: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            gantt_chart: {
                ...prev.gantt_chart,
                [month]: parseInt(value) || 0
            }
        }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log('=== DUAL API UPDATE START ===');
            console.log('Activity ID:', activityData.id);
            console.log('Activity Tracker Found:', activityTracker);
            console.log('Activity Tracker ID:', activityTracker?.id);
            console.log('Form Data Before Submit:', formData);
            console.log('Original Activity Data:', activityData);

            // Step 1: Update ActivityPlan (basic fields)
            const activityUpdateData = {
                // Core activity fields
                work_plan_activity_identifier: formData.activity_number,
                activity_identifier: formData.activity_number, // Send to both fields
                activity_code: formData.activity_number, // Send to both fields
                budget_line: formData.budget_line,
                objectives_sub_objectives: formData.objectives_sub_objectives,
                objective: formData.objectives_sub_objectives, // Send to both fields
                activity_description: formData.activity_description,
                activity_name: formData.activity_description, // Send to both fields
                activity: formData.activity_description, // Send to both fields
                justification: formData.activity_justification,
                activity_justification: formData.activity_justification, // Send to both fields

                // Results and comments
                expected_results: formData.expected_results,
                expected_output: formData.expected_results, // Send to both fields
                comments: formData.comments,

                // Financial information
                unit_cost_ngn: parseFloat(formData.unit_cost_ngn) || 0,
                unit_cost: parseFloat(formData.unit_cost_ngn) || 0, // Send to both fields

                // Cost categorization (as strings based on API response)
                cost_category: formData.cost_category,
                cost_grouping: formData.cost_grouping,
                cost_input: formData.cost_input,
                intervention_area: formData.intervention_area,

                // Performance indicators - send to both possible field names
                indicator: formData.indicator,
                performance_indicator: formData.indicator,
                mov: formData.mov,
                means_of_verification: formData.mov,

                // Monthly frequency data
                monthly_costs: formData.gantt_chart,

                // Keep the activity as unplanned
                activity_type: "UNPLANNED" as const,
                is_unplanned: true,
            };

            console.log('=== STEP 1: UPDATING ACTIVITY PLAN ===');
            console.log('Activity update data:', activityUpdateData);

            try {
                const result = await editActivityPlan(activityUpdateData);
                console.log('✅ Activity Plan updated successfully');
                console.log('Activity Plan Update Result:', result);
            } catch (activityError) {
                console.error('❌ Activity Plan Update Failed:', activityError);
                throw activityError;
            }

            // Step 2: Update WorkPlanTracker (lead person fields) - only if tracker exists
            if (activityTracker) {
                // Get user details for debugging
                const selectedUser = users?.data?.results?.find((user: any) => user.id === formData.responsible_person);

                const trackerUpdateData = {
                    // Lead person fields are stored in WorkPlanTracker
                    lead_person: formData.responsible_person, // This should now be a UUID
                    lead_dept: formData.lead_dept,
                    location: formData.location,
                    comments: formData.comments, // Also update comments in tracker
                };

                console.log('=== STEP 2: UPDATING WORK PLAN TRACKER ===');
                console.log('Tracker ID:', activityTracker.id);
                console.log('Selected User:', selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.id})` : 'Not found');
                console.log('Tracker update data:', trackerUpdateData);

                try {
                    const trackerResult = await patchActivityTracker(trackerUpdateData);
                    console.log('✅ Work Plan Tracker updated successfully');
                    console.log('Tracker Update Result:', trackerResult);
                } catch (trackerError) {
                    console.error('❌ Tracker Update Failed:', trackerError);
                    // Don't throw - continue even if tracker update fails
                }
            } else {
                console.log('⚠️ No Activity Tracker found for this activity - skipping tracker update');
            }

            console.log('=== DUAL API UPDATE COMPLETE ===');
            toast.success("Unplanned activity updated successfully");
            dispatch(closeDialog());
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            console.error('❌ Update failed:', error);
            toast.error(error?.response?.data?.message || "Failed to update activity");
        }
    };

    // Handle successful update
    useEffect(() => {
        if (isSuccess) {
            toast.success("Activity updated successfully");

            // Invalidate React Query cache to force refetch
            console.log('🔄 Invalidating query cache after successful update...');
            queryClient.invalidateQueries({ queryKey: ["activity-plans"] });
            queryClient.invalidateQueries({ queryKey: ["activity-trackers"] });
            queryClient.invalidateQueries({ queryKey: ["work-plan-activities"] });

            dispatch(closeDialog());
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [isSuccess, dispatch, onSuccess, queryClient]);

    return (
        <div className="space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Activity Info Header */}
                <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-900">
                        {activityData.activity || activityData.activity_description || "Unplanned Activity"}
                    </h4>
                    <p className="text-sm text-gray-600">
                        Activity ID: {activityData.work_plan_activity_identifier || "UNPLANNED"}
                    </p>
                </div>

                {/* Core Activity Fields */}
                <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 border-b pb-2">Core Activity Information</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Activity Number */}
                        <div className="space-y-2">
                            <Label htmlFor="activity_number">ACT. No.</Label>
                            <Input
                                id="activity_number"
                                value={formData.activity_number}
                                onChange={(e) => handleInputChange("activity_number", e.target.value)}
                                placeholder="e.g., AUN.1.1.1 or UNPLANNED"
                            />
                        </div>

                        {/* Budget Line */}
                        <div className="space-y-2">
                            <Label htmlFor="budget_line">Budget Line</Label>
                            <Select value={formData.budget_line} onValueChange={(value) => handleInputChange("budget_line", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget line" />
                                </SelectTrigger>
                                <SelectContent>
                                    {((budgetLines?.data?.results || budgetLines?.results || budgetLines?.data || [])?.length > 0
                                        ? (budgetLines?.data?.results || budgetLines?.results || budgetLines?.data)
                                        : fallbackBudgetLines
                                    )?.map((budgetLine: any) => (
                                        <SelectItem key={budgetLine.id} value={budgetLine.name}>
                                            {budgetLine.name}
                                        </SelectItem>
                                    )) || []}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Objectives/IR/Sub Objectives */}
                    <div className="space-y-2">
                        <Label htmlFor="objectives_sub_objectives">Objectives/IR/Sub Objectives</Label>
                        <textarea
                            id="objectives_sub_objectives"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={2}
                            value={formData.objectives_sub_objectives}
                            onChange={(e) => handleInputChange("objectives_sub_objectives", e.target.value)}
                            placeholder="Enter objectives, IR, or sub-objectives"
                        />
                    </div>

                    {/* Activity Description */}
                    <div className="space-y-2">
                        <Label htmlFor="activity_description">Activity</Label>
                        <textarea
                            id="activity_description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={2}
                            value={formData.activity_description}
                            onChange={(e) => handleInputChange("activity_description", e.target.value)}
                            placeholder="Describe the activity"
                        />
                    </div>

                    {/* Activity Justification */}
                    <div className="space-y-2">
                        <Label htmlFor="activity_justification">Activity Justification</Label>
                        <textarea
                            id="activity_justification"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={2}
                            value={formData.activity_justification}
                            onChange={(e) => handleInputChange("activity_justification", e.target.value)}
                            placeholder="Provide justification for this activity"
                        />
                    </div>
                </div>

                {/* Other Fields */}
                <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 border-b pb-2">Assignment & Location</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Lead Department */}
                    <div className="space-y-2">
                        <Label htmlFor="lead_dept">Lead Department</Label>
                        <Select value={formData.lead_dept} onValueChange={(value) => handleInputChange("lead_dept", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select lead department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments?.data?.results?.map((dept: any) => (
                                    <SelectItem key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lead Person */}
                    <div className="space-y-2">
                        <Label htmlFor="responsible_person">Lead Person (AHNI Staff)</Label>
                        <Select value={formData.responsible_person} onValueChange={(value) => handleInputChange("responsible_person", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select AHNI staff member" />
                            </SelectTrigger>
                            <SelectContent>
                                {users?.data?.results?.map((user: any) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name} ({user.email})
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations?.data?.results?.map((location: any) => (
                                    <SelectItem key={location.id} value={location.name}>
                                        {location.name}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Unit Cost */}
                    <div className="space-y-2">
                        <Label htmlFor="unit_cost_ngn">Unit Cost (NGN)</Label>
                        <Input
                            id="unit_cost_ngn"
                            type="number"
                            value={formData.unit_cost_ngn}
                            onChange={(e) => handleInputChange("unit_cost_ngn", e.target.value)}
                            placeholder="Enter unit cost"
                        />
                    </div>

                    {/* Cost Category */}
                    <div className="space-y-2">
                        <Label htmlFor="cost_category">Cost Category</Label>
                        <Select value={formData.cost_category} onValueChange={(value) => handleInputChange("cost_category", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select cost category" />
                            </SelectTrigger>
                            <SelectContent>
                                {((costCategories?.data?.results || costCategories?.results || costCategories?.data || [])?.length > 0
                                    ? (costCategories?.data?.results || costCategories?.results || costCategories?.data)
                                    : fallbackCostCategories
                                )?.map((category: any) => (
                                    <SelectItem key={category.id} value={category.name}>
                                        {category.name}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Cost Grouping */}
                    <div className="space-y-2">
                        <Label htmlFor="cost_grouping">Cost Grouping</Label>
                        <Select value={formData.cost_grouping} onValueChange={(value) => handleInputChange("cost_grouping", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select cost grouping" />
                            </SelectTrigger>
                            <SelectContent>
                                {((costGroupings?.data?.results || costGroupings?.results || costGroupings?.data || [])?.length > 0
                                    ? (costGroupings?.data?.results || costGroupings?.results || costGroupings?.data)
                                    : fallbackCostGroupings
                                )?.map((grouping: any) => (
                                    <SelectItem key={grouping.id} value={grouping.name}>
                                        {grouping.name}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Cost Input */}
                    <div className="space-y-2">
                        <Label htmlFor="cost_input">Cost Input</Label>
                        <Select value={formData.cost_input} onValueChange={(value) => handleInputChange("cost_input", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select cost input" />
                            </SelectTrigger>
                            <SelectContent>
                                {((costInputs?.data?.results || costInputs?.results || costInputs?.data || [])?.length > 0
                                    ? (costInputs?.data?.results || costInputs?.results || costInputs?.data)
                                    : fallbackCostInputs
                                )?.map((input: any) => (
                                    <SelectItem key={input.id} value={input.name}>
                                        {input.name}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Intervention Area */}
                    <div className="space-y-2">
                        <Label htmlFor="intervention_area">Intervention Area</Label>
                        <Select value={formData.intervention_area} onValueChange={(value) => handleInputChange("intervention_area", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select intervention area" />
                            </SelectTrigger>
                            <SelectContent>
                                {((interventionAreas?.data?.results || interventionAreas?.results || interventionAreas?.data || [])?.length > 0
                                    ? (interventionAreas?.data?.results || interventionAreas?.results || interventionAreas?.data)
                                    : fallbackInterventionAreas
                                )?.map((area: any) => (
                                    <SelectItem key={area.id} value={area.name}>
                                        {area.name}
                                    </SelectItem>
                                )) || []}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                </div>

                {/* Full width fields */}
                <div className="space-y-4">
                    {/* Expected Result */}
                    <div className="space-y-2">
                        <Label htmlFor="expected_results">Expected Result</Label>
                        <Textarea
                            id="expected_results"
                            value={formData.expected_results}
                            onChange={(e) => handleInputChange("expected_results", e.target.value)}
                            placeholder="Enter expected result"
                            rows={2}
                        />
                    </div>

                    {/* Indicator */}
                    <div className="space-y-2">
                        <Label htmlFor="indicator">Indicator</Label>
                        <Input
                            id="indicator"
                            value={formData.indicator}
                            onChange={(e) => handleInputChange("indicator", e.target.value)}
                            placeholder="Enter indicator"
                        />
                    </div>

                    {/* Means of Verification (MoV) */}
                    <div className="space-y-2">
                        <Label htmlFor="mov">Means of Verification (MoV)</Label>
                        <Input
                            id="mov"
                            value={formData.mov}
                            onChange={(e) => handleInputChange("mov", e.target.value)}
                            placeholder="Enter means of verification"
                        />
                    </div>

                    {/* Comments */}
                    <div className="space-y-2">
                        <Label htmlFor="comments">Comments</Label>
                        <Textarea
                            id="comments"
                            value={formData.comments}
                            onChange={(e) => handleInputChange("comments", e.target.value)}
                            placeholder="Enter additional comments"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Monthly Frequency Section */}
                <div className="space-y-4">
                    <div className="border-t pt-4">
                        <Label className="text-base font-semibold">Frequency by Month</Label>
                        <p className="text-sm text-gray-600 mb-4">
                            Enter the number of times this activity will be performed in each month
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {months.map((month) => (
                                <div key={month} className="space-y-1">
                                    <Label className="text-sm font-medium">{month}</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.gantt_chart[month as keyof typeof formData.gantt_chart]}
                                        onChange={(e) => handleMonthChange(month, e.target.value)}
                                        placeholder="0"
                                        className="text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <FormButton
                        type="button"
                        variant="outline"
                        onClick={() => dispatch(closeDialog())}
                    >
                        Cancel
                    </FormButton>
                    <FormButton
                        type="submit"
                        loading={isUpdating}
                    >
                        Update Activity
                    </FormButton>
                </div>
            </form>
        </div>
    );
}