"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormTextArea from "components/atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useQuery from "hooks/useQuery";
import {
    useCreateActivityPlan,
    useEditActivityPlan,
    useGetSingleActivityPlan,
} from "@/features/programs/controllers/activityPlanController";
import { useEffect } from "react";
import {
    ActivityPlanSchema,
    TActivityPlanFormValues,
} from "features/programs/types/activity-plan";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";

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

    const { data: activityPlan } = useGetSingleActivityPlan(
        id || "", { enabled: !!id }
    );

    const { createActivityPlan, isLoading: isCreateLoading } =
        useCreateActivityPlan();

    const { editActivityPlan, isLoading: isUpdateLoading } =
        useEditActivityPlan(id || "");

    const router = useRouter();

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
        },
    });

    const { handleSubmit, reset } = form;

    useEffect(() => {
        if (activityPlan) {
            const prevFields = activityPlan.data;

            reset({
                ...prevFields,
                project: prevFields.project?.id || "",
                is_resources_requied: String(prevFields.is_resources_requied),
                is_memo_required: String(prevFields.is_memo_required),
                is_ea_required: String(prevFields.is_ea_required),
                is_results_achieved: String(prevFields.is_resources_requied),
            });
        }
    }, [activityPlan]);

    const goBack = () => {
        router.back();
    };

    const onSubmit: SubmitHandler<TActivityPlanFormValues> = async (data) => {
        try {
            if (id) {
                await editActivityPlan(data);
                toast.success("Activity Plan Updated");
            } else {
                await createActivityPlan(data);
                toast.success("Activity Plan Created");
            }

            router.push(RouteEnum.PROGRAM_ACTIVITY);
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
                        <FormSelect
                            label="Project"
                            name="project"
                            placeholder="Select Project"
                            required
                            options={projectOptions}
                        />

                        <FormInput
                            label="Activity Code"
                            name="activity_code"
                            placeholder="Enter Activity Code"
                            required
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

                        <FormTextArea
                            label="Expected Result"
                            name="_"
                            placeholder="Enter Expected Result"
                            required
                        />

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
                            loading={isCreateLoading || isUpdateLoading}
                            disabled={isCreateLoading || isUpdateLoading}
                        >
                            {id ? "Update" : "Create"}
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
