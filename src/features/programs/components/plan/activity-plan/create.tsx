"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import FormTextArea from "@/components/atoms/FormTextArea";
import LongArrowLeft from "@/components/icons/LongArrowLeft";
import Card from "@/components/Card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useQuery from "@/hooks/useQuery";
import {
    useCreateActivityPlan,
    useEditActivityPlan,
    useGetSingleActivityPlan,
    useCreateUnplannedActivity,
} from "@/features/programs/controllers/activityPlanController";
import { useEffect, useMemo } from "react";
import {
    ActivityPlanSchema,
    TActivityPlanFormValues,
} from "@/features/programs/types/activity-plan";
import { toast } from "sonner";
import { RouteEnum } from "@/constants/RouterConstants";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";

const booleanOptions = [
    { label: "YES", value: "true" },
    { label: "NO", value: "false" },
].map(({ label, value }) => ({
    label,
    value,
}));

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Activity Plans", icon: true },
    { name: "Create", icon: false },
];

export default function CreateActivityPlan() {
    const { data: project } = useGetAllProjects({
        page: 1,
        size: 2000000,
    });

    const projectOptions = project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
    }));

    const query = useQuery();
    const id = query.get("id");
    const planId = query.get("plan");
    const activityType = query.get("type"); // "unplanned" for unplanned activities

    const isUnplanned = activityType === "unplanned";

    const { data: activityPlan } = useGetSingleActivityPlan(
        id || "", { enabled: !!id }
    );

    // Get the work plan ID from either the URL parameter or the activity plan's work_plan field
    const workPlanId = planId || activityPlan?.data?.work_plan;

    const { data: workPlan } = useGetSingleWorkPlan(
        workPlanId || "", { enabled: !!workPlanId }
    );

    const { createActivityPlan, isLoading: isCreateLoading } =
        useCreateActivityPlan();

    const { createUnplannedActivity, isLoading: isCreateUnplannedLoading } =
        useCreateUnplannedActivity();

    const { editActivityPlan, isLoading: isUpdateLoading } =
        useEditActivityPlan(id || "");

    const router = useRouter();

    const isLoading = isCreateLoading || isCreateUnplannedLoading || isUpdateLoading;

    const form = useForm<TActivityPlanFormValues>({
        resolver: zodResolver(ActivityPlanSchema),
        defaultValues: {
            ir: "",
            activity_code: "",
            activity_description: "",
            start_date: "",
            end_date: "",
            responsible_person: "",
            is_resources_requied: "",
            is_memo_required: "",
            is_ea_required: "",
            is_results_achieved: "",
            follow_up_action: "",
            comments: "",
            project: "",
            // Additional fields for unplanned activities
            objectives_sub_objectives: "",
            budget_line: "",
            expected_results: "",
        },
    });

    // Get expected result from work plan activity
    const expectedResult = useMemo(() => {
        if (!workPlan?.data?.activities) return "";

        // If editing, find the activity by the activity plan's work_plan_activity
        if (activityPlan?.data?.work_plan_activity) {
            const activity = workPlan.data.activities.find(
                a => a.id === activityPlan.data.work_plan_activity
            );
            return activity?.expected_result || "";
        }

        return "";
    }, [workPlan, activityPlan]);

    const { handleSubmit, reset } = form;

    useEffect(() => {
        if (activityPlan && workPlan) {
            const prevFields = activityPlan.data;

            reset({
                project: workPlan.data.project?.id || prevFields.project || "",
                ir: prevFields.ir || "",
                activity_code: prevFields.activity_code || "",
                activity_description: prevFields.activity_description || "",
                start_date: prevFields.start_date || "",
                end_date: prevFields.end_date || "",
                responsible_person: prevFields.responsible_person || "",
                is_resources_requied: prevFields.resources_required ? "true" : "false",
                is_memo_required: String(prevFields.memo_approved),
                is_ea_required: String(prevFields.ea_required),
                is_results_achieved: prevFields.achieved_results || "",
                follow_up_action: prevFields.follow_up_actions || "",
                comments: prevFields.comments || "",
            });
        } else if (workPlan && !id) {
            // Pre-populate from work plan when creating new activity
            const workPlanData = workPlan.data;

            reset({
                project: workPlanData.project?.id || "",
                ir: "",
                activity_code: "",
                activity_description: "",
                start_date: "",
                end_date: "",
                responsible_person: "",
                is_resources_requied: "false",
                is_memo_required: "false",
                is_ea_required: "false",
                is_results_achieved: "false",
                follow_up_action: "",
                comments: "",
            });
        }
    }, [activityPlan, workPlan, id, reset]);

    const goBack = () => {
        router.back();
    };

    const onSubmit: SubmitHandler<TActivityPlanFormValues> = async (data) => {
        try {
            // Convert old field names to new API field names
            const submitData: any = {
                ...data,
                resources_required: data.is_resources_requied === "true" ? "YES" : data.is_resources_requied === "false" ? "NO" : data.resources_required,
                memo_approved: data.is_memo_required === "true" || data.memo_approved === true,
                ea_required: data.is_ea_required === "true" || data.ea_required === true,
                achieved_results: data.is_results_achieved || data.achieved_results,
                follow_up_actions: data.follow_up_action || data.follow_up_actions,
            };

            // Format dates to YYYY-MM-DD format
            if (submitData.start_date) {
                const startDate = new Date(submitData.start_date);
                submitData.start_date = startDate.toISOString().split('T')[0];
            }
            if (submitData.end_date) {
                const endDate = new Date(submitData.end_date);
                submitData.end_date = endDate.toISOString().split('T')[0];
            }

            // Handle unplanned activities
            if (isUnplanned) {
                // For unplanned activities, don't link to work_plan_activity
                submitData.work_plan = workPlanId;
                submitData.work_plan_activity = null; // Explicitly set to null for unplanned activities
                submitData.activity_type = "UNPLANNED";

                // Generate activity identifier for unplanned activities if not provided
                if (!submitData.activity_code) {
                    submitData.work_plan_activity_identifier = `UNPLANNED-${Date.now()}`;
                } else {
                    submitData.work_plan_activity_identifier = submitData.activity_code;
                }
            } else {
                // Add work plan ID and project if creating/editing from work plan
                if (workPlanId) {
                    submitData.work_plan = workPlanId;
                    submitData.activity_type = "PLANNED";
                }
            }

            // Ensure project is set from work plan if not in form data
            if (workPlanId && !submitData.project && workPlan?.data?.project?.id) {
                submitData.project = workPlan.data.project.id;
            }

            // Remove old field names before submitting
            delete submitData.is_resources_requied;
            delete submitData.is_memo_required;
            delete submitData.is_ea_required;
            delete submitData.is_results_achieved;
            delete submitData.follow_up_action;

            if (id) {
                await editActivityPlan(submitData);
                toast.success(`${isUnplanned ? 'Unplanned ' : ''}Activity Plan Updated`);
            } else {
                if (isUnplanned) {
                    await createUnplannedActivity(submitData);
                    toast.success('Unplanned Activity Created');
                } else {
                    await createActivityPlan(submitData);
                    toast.success('Activity Plan Created');
                }
            }

            // Navigate back to the work plan activities if came from there
            if (workPlanId) {
                router.push(`/dashboard/programs/plan/activity/${workPlanId}`);
            } else {
                router.push(RouteEnum.PROGRAM_ACTIVITY);
            }
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Something went wrong");
        }
    };

    return (
        <div className="space-y-6 min-h-screen">
            <BreadcrumbCard list={breadcrumbs} />

            <button
                onClick={goBack}
                className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="space-y-10 p-10">
                        {/* Activity Type Header */}
                        <div className={`py-5 px-2.5 rounded-md ${isUnplanned ? 'bg-orange-100' : 'bg-blue-100'}`}>
                            <h2 className={`text-lg font-bold ${isUnplanned ? 'text-orange-600' : 'text-blue-600'}`}>
                                {isUnplanned ? 'Create Unplanned Activity' : 'Create Planned Activity'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {isUnplanned
                                    ? 'This activity is not part of the original work plan and will be marked as unplanned.'
                                    : 'This activity is linked to the work plan.'
                                }
                            </p>
                        </div>

                        {!workPlanId && (
                            <FormSelect
                                label="Project"
                                name="project"
                                placeholder="Select Project"
                                required
                                options={projectOptions}
                            />
                        )}

                        {/* Additional fields for unplanned activities */}
                        {isUnplanned && (
                            <>
                                <FormInput
                                    label="Objectives/Sub-Objectives"
                                    name="objectives_sub_objectives"
                                    placeholder="Enter Objectives or Sub-Objectives"
                                    required
                                />

                                <FormInput
                                    label="Budget Line"
                                    name="budget_line"
                                    placeholder="Enter Budget Line"
                                    required
                                />
                            </>
                        )}

                        <FormInput
                            label="Activity Code"
                            name="activity_code"
                            placeholder={isUnplanned ? "Enter Activity Code (optional - auto-generated if empty)" : "Enter Activity Code"}
                            required={!isUnplanned}
                        />

                        <FormInput
                            label="Activity Description"
                            name="activity_description"
                            placeholder="Enter Activity Description"
                            required
                        />

                        <FormInput
                            label="IR"
                            name="ir"
                            placeholder="Enter IR"
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Start Date"
                                type="date"
                                name="start_date"
                                required
                            />

                            <FormInput
                                label="End Date"
                                type="date"
                                name="end_date"
                                required
                            />
                        </div>

                        <FormInput
                            label="Responsible Person"
                            name="responsible_person"
                            placeholder="Enter Responsible Person"
                            required
                        />

                        <FormSelect
                            label="Resources/Vehicle Required"
                            name="is_resources_requied"
                            placeholder="Select Option"
                            required
                            options={booleanOptions}
                        />

                        <FormSelect
                            label="Memo Required"
                            name="is_memo_required"
                            placeholder="Select Option"
                            required
                            options={booleanOptions}
                        />

                        <FormSelect
                            label="EA Required"
                            name="is_ea_required"
                            placeholder="Select Option"
                            required
                            options={booleanOptions}
                        />

                        <FormSelect
                            label="Results Achieved"
                            name="is_results_achieved"
                            placeholder="Select Option"
                            required
                            options={booleanOptions}
                        />

                        <FormInput
                            label="Follow Up Action"
                            name="follow_up_action"
                            placeholder="Enter Follow Up Action"
                            required
                        />

                        {isUnplanned ? (
                            <FormInput
                                label="Expected Results"
                                name="expected_results"
                                placeholder="Enter Expected Results"
                                required
                            />
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Expected Result (from Work Plan)
                                </label>
                                <div className="min-h-[100px] p-3 border rounded-md bg-gray-50 text-gray-700">
                                    {expectedResult || "No expected result defined in work plan"}
                                </div>
                            </div>
                        )}

                        <FormTextArea
                            label="Comments"
                            name="comments"
                            placeholder="Enter Comments"
                            required
                        />
                    </Card>

                    <div className="flex justify-end gap-5 pt-10">
                        <FormButton
                            onClick={goBack}
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Cancel
                        </FormButton>

                        <FormButton
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {id ? "Update" : "Create"}
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
