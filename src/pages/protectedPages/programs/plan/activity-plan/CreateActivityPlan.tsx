import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import useQuery from "hooks/useQuery";
import {
    useCreateActivityPlanMutation,
    useEditActivityPlanMutation,
    useGetSingleActivityPlanQuery,
} from "services/programsApi/activity-plan";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import {
    ActivityPlanSchema,
    BooleanEnum,
    TActivityPlanFormValues,
} from "definations/program-types/activity-plan";
import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import { useGetAllProjectsQuery } from "services/project";

const booleanOptions = ["TRUE", "FALSE"].map((value) => ({
    label: value,
    value: value.toLowerCase(),
}));

export default function CreateActivityPlan() {
    const { data: project } = useGetAllProjectsQuery({
        page: 1,
        size: 2000000,
    });

    const projectOptions = project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
    }));

    const query = useQuery();
    const id = query.get("id");

    const { data: activityPlan } = useGetSingleActivityPlanQuery(
        id ?? skipToken
    );

    const [createActivityPlan, { isLoading: isCreateLoading }] =
        useCreateActivityPlanMutation();

    const [editActivityPlan, { isLoading: isUpdateLoading }] =
        useEditActivityPlanMutation();

    const navigate = useNavigate();

    const form = useForm<TActivityPlanFormValues>({
        resolver: zodResolver(ActivityPlanSchema),
        defaultValues: {
            ir: "",
            activity_code: "",
            activity_description: "",
            start_date: "",
            end_date: "",
            responsible_person: "",
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
                project: prevFields.project.id,
                is_resources_requied: BooleanEnum.parse(
                    String(prevFields.is_resources_requied)
                ),
                is_memo_required: BooleanEnum.parse(
                    String(prevFields.is_memo_required)
                ),
                is_ea_required: BooleanEnum.parse(
                    String(prevFields.is_ea_required)
                ),
                is_results_achieved: BooleanEnum.parse(
                    String(prevFields.is_results_achieved)
                ),
            });
        }
    }, [activityPlan]);

    const goBack = () => {
        navigate(-1);
    };

    const onSubmit: SubmitHandler<TActivityPlanFormValues> = async (data) => {
        console.log("Hello");

        try {
            if (id) {
                await editActivityPlan({ id, body: data }).unwrap();
                toast.success("Activity Plan Updated");
            } else {
                await createActivityPlan(data).unwrap();
                toast.success("Acitivity Plan Created");
            }

            navigate(RouteEnum.PROGRAM_ACTIVITY);
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <div className="space-y-6 min-h-screen">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Programs</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Plans</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Activity Plan</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {id ? "Edit" : "Create"}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
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
                            {id ? "Edit" : "Create"}
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
