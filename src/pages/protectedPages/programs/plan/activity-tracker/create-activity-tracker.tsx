import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import {
    ActivityTrackerSchema,
    TActivityTrackerFormValues,
} from "definations/program-types/activity-tracker";
import { useDepartmentsQuery, useLocationsQuery } from "services/moduleConfig";
import { usePartnersQuery } from "services/moduleProjects";
import { useCreateActivityTrackerMutation } from "services/programsApi/activity-tracker";

const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
].map((month) => ({
    label: month,
    value: month,
}));

const statusOptions = ["PENDING", "APPROVED"].map((status) => ({
    label: status,
    value: status,
}));

export default function CreateActivityTracker() {
    const { data: location } = useLocationsQuery({ no_paginate: false });
    const { data: department } = useDepartmentsQuery({ no_paginate: false });
    const { data: partner } = usePartnersQuery({ no_paginate: false });

    const locationOptions = location?.data.results.map((loc) => ({
        label: loc.name,
        value: loc.id,
    }));

    const departmentOptions = department?.data.results.map((dept) => ({
        label: dept.name,
        value: dept.id,
    }));

    const partnerOptions = partner?.data.results.map((partner) => ({
        label: partner.name,
        value: partner.id,
    }));

    const [createActivityTracker, { isLoading: isCreateLoading }] =
        useCreateActivityTrackerMutation();

    const navigate = useNavigate();

    const form = useForm<TActivityTrackerFormValues>({
        resolver: zodResolver(ActivityTrackerSchema),
        defaultValues: {
            activity_name: "",
            activity_reference_number: "",
            month: "",
            activity_plans: "",
            objectives: "",
            location: "",
            ir: "",
            activity_frequency: "",
            planned_output: "",
            output_description: "",
            achievement_percentage: "",
            total_amount_ngn: "",
            total_amount_usd: "",
            expended_amount_ngn: "",
            implementation_usd_rate: "",
        },
    });

    const { handleSubmit } = form;

    const goBack = () => {
        navigate(-1);
    };

    const onSubmit: SubmitHandler<TActivityTrackerFormValues> = async (
        data
    ) => {
        try {
            await createActivityTracker(data).unwrap();
            toast.success("Activity Tracker Created");
            navigate(RouteEnum.PROGRAM_ACTIVITY_TRACKER);
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
                        <BreadcrumbPage>Activity Tracker</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
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
                        <FormInput
                            label="Activity Name"
                            name="activity_name"
                            placeholder="Enter activity name"
                            required
                        />

                        <FormInput
                            label="Activity Reference Number (As in WP)"
                            name="activity_reference_number"
                            placeholder="Enter activity Ref. Number"
                            required
                        />

                        <FormSelect
                            label="Month"
                            name="month"
                            placeholder="Select Month"
                            required
                            options={monthOptions}
                        />

                        <FormTextArea
                            label="Activities Plan for the Month"
                            name="activity_plans"
                            placeholder="Enter Plan For Month"
                            required
                        />

                        <FormTextArea
                            label="Objectives"
                            name="objectives"
                            placeholder="Enter Objectives"
                            required
                        />

                        <FormSelect
                            label="Location"
                            name="location"
                            placeholder="Select Location"
                            required
                            options={locationOptions}
                        />

                        <FormInput
                            label="IR"
                            name="ir"
                            placeholder="Enter IR"
                            required
                        />

                        <FormSelect
                            label="Lead Dept"
                            name="lead_dept"
                            placeholder="Select Lead Dept"
                            required
                            options={departmentOptions}
                        />

                        <FormSelect
                            label="Lead Partner"
                            name="lead_partner"
                            placeholder="Select Lead Partner"
                            required
                            options={partnerOptions}
                        />

                        <div className="bg-red-100 py-5 px-2.5 rounded-md">
                            <h2 className="text-lg font-bold text-red-500">
                                Activity Tracker
                            </h2>
                        </div>

                        <FormInput
                            label="Frq. of Activity"
                            name="activity_frequency"
                            placeholder="Enter Frq. of Activity"
                            required
                        />

                        <FormInput
                            label="Planned Output"
                            name="planned_output"
                            placeholder="Enter Planned Output"
                            required
                        />

                        <FormTextArea
                            label="Description of Output"
                            name="output_description"
                            placeholder="Enter Output Description"
                            required
                        />

                        <FormInput
                            label="Percentage of Achievement"
                            name="achievement_percentage"
                            required
                            placeholder="Enter Percentage of Achievement"
                        />

                        <FormSelect
                            label="Status"
                            name="status"
                            placeholder="Select Status"
                            required
                            options={statusOptions}
                        />

                        <div className="bg-red-100 py-5 px-2.5 rounded-md">
                            <h2 className="text-lg font-bold text-red-500">
                                Variance Analysis
                            </h2>
                        </div>

                        <FormInput
                            label="Total NGN"
                            name="total_amount_ngn"
                            required
                            placeholder="Enter Total NGN"
                        />

                        <FormInput
                            label="Total USD"
                            name="total_amount_usd"
                            placeholder="Enter Total USD"
                            required
                        />

                        <FormInput
                            label="Amount Expended NGN"
                            name="expended_amount_ngn"
                            placeholder="Enter Amount Expended NGN "
                        />

                        <FormInput
                            label="Implementation USD Rate"
                            name="implementation_usd_rate"
                            placeholder="Enter Implementation USD Rate"
                            required
                        />

                        <FormInput
                            label="Amount Expended USD"
                            name="amount_expended_usd"
                            placeholder="Enter Amount Expended USD"
                            required
                        />

                        <FormInput
                            label="Expenditure Rate NGN"
                            name="expenditure_rate_ngn"
                            placeholder="Enter Amount Expenditure Rate NGN"
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
                            loading={isCreateLoading}
                            disabled={isCreateLoading}
                        >
                            Create
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
