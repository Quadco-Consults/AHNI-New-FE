import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import FormTextArea from "atoms/FormTextArea";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import { RouteEnum } from "constants/RouterConstants";
import { StakeholderManagementSchema } from "definations/program-validator";
import { PartnerResultsData } from "definations/project-types/partners";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import StateAPI from "services/configs/state";
import StakeholderManagementAPI from "services/programsApi/stakeholder-management";
import partnersAPi from "services/projectsApi/partnersApi";
import { toast } from "sonner";
import { z } from "zod";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";

export default function CreateActivityTracker() {
    const navigate = useNavigate();

    const stateResultQuery = StateAPI.useGetStatesQuery();
    const states = stateResultQuery?.data;
    const partnerResultQuery = partnersAPi.useGetPartnersQuery({});
    const partners = partnerResultQuery?.data?.results;
    const [createStakeholderManagementMutation, { isLoading }] =
        StakeholderManagementAPI.useCreateStakeholderManagementMutation();

    const form = useForm<z.infer<typeof StakeholderManagementSchema>>({
        resolver: zodResolver(StakeholderManagementSchema),
        defaultValues: {
            stakeholder_name: "",
            institution_organization: "",
            physical_office_address: "",
            state: "",
            gender: "",
            designation: "",
            phone_number: "",
            email: "",
            project_role: "",
            importance: "",
            influence: "",
            score: "",
            major_concerns: "",
            relationship_owner: "",
        },
    });

    const { handleSubmit } = form;

    const goBack = () => {
        navigate(-1);
    };

    const onSubmit = async (
        data: z.infer<typeof StakeholderManagementSchema>
    ) => {
        console.log(data);

        try {
            await createStakeholderManagementMutation(data).unwrap();
            toast.success("Stakeholder successfully created.");
            navigate(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER);
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
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
                            name=""
                            placeholder="Enter activity Ref. Number"
                            required
                        />

                        <FormSelect
                            label="Month"
                            name="month"
                            placeholder="Select Month"
                            required
                        >
                            <SelectContent>
                                {partnerResultQuery?.isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    ["January", "Februray"]?.map(
                                        (month: string) => (
                                            <SelectItem
                                                value={month}
                                                key={month}
                                            >
                                                {month}
                                            </SelectItem>
                                        )
                                    )
                                )}
                            </SelectContent>
                        </FormSelect>

                        <FormTextArea
                            label="Activities Plan for the Month"
                            name=""
                        />

                        <FormTextArea label="Objectives" name="" />

                        <FormSelect
                            label="Location"
                            name="location"
                            placeholder="Select Location"
                            required
                        >
                            <SelectContent>
                                {partnerResultQuery?.isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    ["Lagos", "Abuja"]?.map((month: string) => (
                                        <SelectItem value={month} key={month}>
                                            {month}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </FormSelect>

                        <FormInput label="IR" name="" />
                        <FormInput label="Lead Dept" name="" required />
                        <FormInput label="Lead Partner" name="" required />

                        <div className="bg-red-100 py-5 px-2.5 rounded-md">
                            <h2 className="text-lg font-bold text-red-500">
                                Activity Tracker
                            </h2>
                        </div>

                        <FormInput label="Frq. of Activity" name="" />
                        <FormInput label="Planned Output" name="" />
                        <FormTextArea label="Description of Output" name="" />
                        <FormInput label="Percentage of Achievement" name="" />
                        <FormSelect
                            label="Status"
                            name="status"
                            placeholder="Select Status"
                            required
                        >
                            <SelectContent>
                                {partnerResultQuery?.isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    ["Pending", "Approved"]?.map(
                                        (month: string) => (
                                            <SelectItem
                                                value={month}
                                                key={month}
                                            >
                                                {month}
                                            </SelectItem>
                                        )
                                    )
                                )}
                            </SelectContent>
                        </FormSelect>

                        <div className="bg-red-100 py-5 px-2.5 rounded-md">
                            <h2 className="text-lg font-bold text-red-500">
                                Variance Analysis
                            </h2>
                        </div>

                        <FormInput label="Total NGN" name="" />
                        <FormInput label="Total USD" name="" />
                        <FormInput label="Amount Expended" name="" />
                        <FormInput label="Implementation USD Rate" name="" />
                        <FormInput label="Amount Expended USD" name="" />
                        <FormInput label="Expenditure Rate NGN" name="" />
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
                            Create
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
