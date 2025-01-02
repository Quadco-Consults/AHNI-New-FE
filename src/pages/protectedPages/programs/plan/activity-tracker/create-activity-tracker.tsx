import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    useGetSingleActivityTrackerQuery,
    useUpdateActivityTrackerMutation,
} from "services/programsApi/activity-tracker";
import useQuery from "hooks/useQuery";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import {
    TWorkPlanTrackerFormValues,
    WorkPlanTrackerSchema,
} from "definations/program-types/activity-tracker";

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Plans", icon: true },
    { name: "Work Plan Tracker", icon: true },
    { name: "Edit", icon: false },
];

export default function CreateActivityTracker() {
    const [updateActivityTracker, { isLoading }] =
        useUpdateActivityTrackerMutation();

    const navigate = useNavigate();

    const query = useQuery();
    const id = query.get("id");

    const { data: workPlanTracker } = useGetSingleActivityTrackerQuery(
        id ?? skipToken
    );

    useEffect(() => {
        if (workPlanTracker) {
            const {
                output_description,
                achieved_output,
                achievement_percentage,
                amount_expended_ngn,
                amount_expended_usd,
                implementation_usd_rate,
                expenditure_usd_rate,
                variance_ngn,
                variance_usd,
                percentage_variance_ngn,
                percentage_variance_usd,
                efficiency_output_expenditure_ratio,
                efficiency_output_expenditure_level,
                comments,
            } = workPlanTracker.data;

            form.reset({
                output_description,
                achieved_output,
                achievement_percentage,
                amount_expended_ngn,
                amount_expended_usd,
                implementation_usd_rate,
                expenditure_usd_rate,
                variance_ngn,
                variance_usd,
                percentage_variance_ngn,
                percentage_variance_usd,
                efficiency_output_expenditure_ratio,
                efficiency_output_expenditure_level: String(
                    efficiency_output_expenditure_level
                ),
                comments,
            });
        }
    }, [workPlanTracker]);

    const form = useForm<TWorkPlanTrackerFormValues>({
        resolver: zodResolver(WorkPlanTrackerSchema),
        defaultValues: {
            output_description: "",
            achieved_output: "",
            achievement_percentage: "",
            amount_expended_ngn: "",
            amount_expended_usd: "",
            implementation_usd_rate: "",
            expenditure_usd_rate: "",
            variance_ngn: "",
            variance_usd: "",
            percentage_variance_ngn: "",
            percentage_variance_usd: "",
            efficiency_output_expenditure_ratio: "",
            efficiency_output_expenditure_level: "",
            comments: "",
        },
    });

    const { handleSubmit } = form;

    const goBack = () => {
        navigate(-1);
    };

    const onSubmit: SubmitHandler<TWorkPlanTrackerFormValues> = async (
        data
    ) => {
        try {
            await updateActivityTracker({
                id: id as string,
                body: data,
            }).unwrap();
            toast.success("Activity Tracker Updated");
            navigate(RouteEnum.PROGRAM_ACTIVITY_TRACKER);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
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
                        <div className="bg-red-100 py-5 px-2.5 rounded-md">
                            <h2 className="text-lg font-bold text-red-500">
                                Work Plan Tracker
                            </h2>
                        </div>

                        <FormTextArea
                            label="Description of Output"
                            name="output_description"
                            placeholder="Enter Output Description"
                            required
                        />

                        <FormTextArea
                            label="Achieved Output"
                            name="achieved_output"
                            placeholder="Enter Achieved Output"
                            required
                        />

                        <FormInput
                            label="Percentage of Achievement"
                            name="achievement_percentage"
                            required
                            placeholder="Enter Percentage of Achievement"
                        />

                        <div className="bg-red-100 py-5 px-2.5 rounded-md">
                            <h2 className="text-lg font-bold text-red-500">
                                Variance Analysis
                            </h2>
                        </div>

                        <FormInput
                            label="Amount Expended (NGN)"
                            name="amount_expended_ngn"
                            placeholder="Enter Amount Expended NGN "
                        />

                        <FormInput
                            label="Amount Expended USD"
                            name="amount_expended_usd"
                            placeholder="Enter Amount Expended USD"
                            required
                        />

                        <FormInput
                            label="Implementation USD Rate"
                            name="implementation_usd_rate"
                            placeholder="Enter Implementation USD Rate"
                            required
                        />

                        <FormInput
                            label="Expenditure Rate NGN"
                            name="expenditure_ngn_rate"
                            placeholder="Enter Amount Expenditure Rate NGN"
                            required
                        />

                        <FormInput
                            label="Expenditure Rate USD"
                            name="expenditure_usd_rate"
                            placeholder="Enter Amount Expenditure Rate USD"
                            required
                        />

                        <FormInput
                            label="Variance NGN"
                            name="variance_ngn"
                            placeholder="Enter Variance NGN "
                        />

                        <FormInput
                            label="Variance USD"
                            name="variance_usd"
                            placeholder="Enter Variance USD "
                        />

                        <FormInput
                            label="Percentage Variance NGN"
                            name="percentage_variance_ngn"
                            placeholder="Enter Percentage Variance NGN"
                            required
                        />

                        <FormInput
                            label="Percentage Variance USD"
                            name="percentage_variance_usd"
                            placeholder="Enter Percentage Variance USD"
                            required
                        />

                        <FormInput
                            label="Efficiency Output vs Efficiency Ratio"
                            name="efficiency_output_expenditure_ratio"
                            placeholder="Enter Efficiency Output vs Efficiency Ratio"
                            required
                        />

                        <FormInput
                            label="Efficiency Output vs Efficiency Level"
                            name="efficiency_output_expenditure_level"
                            placeholder="Enter Efficiency Output vs Efficiency Level"
                            required
                        />

                        <FormInput
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

                        <FormButton loading={isLoading} disabled={isLoading}>
                            Update
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
