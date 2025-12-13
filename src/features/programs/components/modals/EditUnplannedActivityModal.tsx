import FormButton from "@/components/FormButton";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllCostCategories } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetAllCostGroupingsQuery } from "@/features/modules/controllers/finance/costGroupingController";
import { useGetAllCostInputs } from "@/features/modules/controllers/finance/costInputController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";
import { useEditActivityPlan } from "@/features/programs/controllers/activityPlanController";

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export default function EditUnplannedActivityModal() {
    const { dailog } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();

    const activityData = dailog?.dialogProps?.activityData || {};
    const onSuccess = dailog?.dialogProps?.onSuccess;

    // Use the real API hook for updating
    const { editActivityPlan, isLoading: isUpdating, isSuccess } = useEditActivityPlan(activityData.id);

    // Fetch dropdown data
    const { data: departments } = useGetAllDepartments({ size: 100 });
    const { data: locations } = useGetAllLocations({ size: 100 });
    const { data: users } = useGetAllUsers({ size: 100 });
    const { data: costCategories } = useGetAllCostCategories({ size: 100 });
    const { data: costGroupings } = useGetAllCostGroupingsQuery({ size: 100 });
    const { data: costInputs } = useGetAllCostInputs({ size: 100 });
    const { data: interventionAreas } = useGetAllInterventionAreas({ size: 100 });

    // Debug logging - check response structures
    console.log('Detailed API responses:', {
        departments: { raw: departments, hasResults: !!departments?.data?.results },
        costCategories: { raw: costCategories, hasResults: !!costCategories?.data?.results },
        costGroupings: { raw: costGroupings, hasResults: !!costGroupings?.data?.results },
        costInputs: { raw: costInputs, hasResults: !!costInputs?.data?.results },
        interventionAreas: { raw: interventionAreas, hasResults: !!interventionAreas?.data?.results }
    });

    // Fallback data - use if API returns empty or fails
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

    // Form state matching API schema
    const [formData, setFormData] = useState({
        // Required fields
        activity_description: activityData.activity_description || activityData.activity || "",

        // Optional fields for unplanned activities
        responsible_person: activityData.responsible_person || "",
        location: activityData.location || "",
        expected_results: activityData.expected_results || "",
        comments: activityData.comments || "",
        objectives_sub_objectives: activityData.objectives_sub_objectives || "",
        budget_line: activityData.budget_line || "",

        // Custom fields (might need to be stored in comments or separate fields)
        lead_dept: activityData.lead_dept || "",
        unit_cost_ngn: activityData.unit_cost_ngn || "",
        cost_category: activityData.cost_category?.name || "",
        cost_grouping: activityData.cost_grouping?.name || "",
        cost_input: activityData.cost_input?.name || "",
        intervention_area: activityData.intervention_area?.name || "",
        indicator: activityData.indicator || "",
        mov: activityData.mov || "",

        // Monthly frequencies (gantt chart) - might need special handling
        gantt_chart: {
            Oct: activityData.gant_chart?.Oct || 0,
            Nov: activityData.gant_chart?.Nov || 0,
            Dec: activityData.gant_chart?.Dec || 0,
            Jan: activityData.gant_chart?.Jan || 0,
            Feb: activityData.gant_chart?.Feb || 0,
            Mar: activityData.gant_chart?.Mar || 0,
            Apr: activityData.gant_chart?.Apr || 0,
            May: activityData.gant_chart?.May || 0,
            Jun: activityData.gant_chart?.Jun || 0,
            Jul: activityData.gant_chart?.Jul || 0,
            Aug: activityData.gant_chart?.Aug || 0,
            Sep: activityData.gant_chart?.Sep || 0,
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
            // Prepare data according to API schema
            const updateData = {
                activity_description: formData.activity_description,
                responsible_person: formData.responsible_person,
                expected_results: formData.expected_results,
                comments: formData.comments,
                objectives_sub_objectives: formData.objectives_sub_objectives,
                budget_line: formData.budget_line,
                // Keep the activity as unplanned
                activity_type: "UNPLANNED" as const,
            };

            await editActivityPlan(updateData);
            toast.success("Unplanned activity updated successfully");
            dispatch(closeDialog());
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update activity");
        }
    };

    // Handle successful update
    useEffect(() => {
        if (isSuccess) {
            toast.success("Activity updated successfully");
            dispatch(closeDialog());
            if (onSuccess) {
                onSuccess();
            }
        }
    }, [isSuccess, dispatch, onSuccess]);

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

                {/* Form Fields in 2 columns */}
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
                                    <SelectItem key={user.id} value={`${user.first_name} ${user.last_name}`}>
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