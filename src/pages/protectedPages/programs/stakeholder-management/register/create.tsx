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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { nigerianStates } from "lib/index";
import {
    StakeholderRegisterSchema,
    TStakeholderRegisterFormValues,
} from "definations/program-validator";
import {
    useCreateStakeholderRegisterMutation,
    useEditStakeholderRegisterMutation,
    useGetSingleStakeholderRegisterQuery,
} from "services/programsApi/stakeholder";
import { useEffect } from "react";
import useQuery from "hooks/useQuery";
import { skipToken } from "@reduxjs/toolkit/query/react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";

const importanceOptions = ["1", "2", "3", "4", "5"].map((option) => ({
    label: option,
    value: option,
}));

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Stakeholder Register", icon: true },
    { name: "Create", icon: false },
];

const CreateRegister = () => {
    const navigate = useNavigate();

    const [createStakeholderRegister, { isLoading }] =
        useCreateStakeholderRegisterMutation();

    const query = useQuery();
    const id = query.get("id");

    const { data: prevStakeholder } = useGetSingleStakeholderRegisterQuery(
        id ?? skipToken
    );

    const [editStakeholderRegister, { isLoading: isUpdateLoading }] =
        useEditStakeholderRegisterMutation();

    const stateOptions = nigerianStates?.map((state) => ({
        label: state,
        value: state,
    }));

    const form = useForm<TStakeholderRegisterFormValues>({
        resolver: zodResolver(StakeholderRegisterSchema),
        defaultValues: {
            name: "",
            organization: "",
            office_address: "",
            state: "",
            designation: "",
            phone_number: "",
            email: "",
            project_role: "",
            score: "",
            major_concerns: "",
            relationship_owner: "",
        },
    });

    const { handleSubmit, watch, setValue, reset } = form;
    useEffect(() => {
        if (prevStakeholder) {
            const prevData = prevStakeholder?.data;

            reset({
                ...prevData,
            });
        }
    }, [prevStakeholder]);

    const goBack = () => {
        navigate(-1);
    };

    const importance = Number(watch("importance") || 0);
    const influence = Number(watch("influence") || 0);

    useEffect(() => {
        setValue("score", String(importance * influence));
    }, [importance, influence]);

    const onSubmit: SubmitHandler<TStakeholderRegisterFormValues> = async (
        data
    ) => {
        try {
            if (id) {
                await editStakeholderRegister({ id, body: data }).unwrap();
                toast.success("Stakeholder Register Created");
            } else {
                await createStakeholderRegister(data).unwrap();
                toast.success("Stakeholder Register Updated");
            }

            navigate(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER);
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    console.log(form.formState.errors);

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
                        <FormInput
                            label="Stakeholder Name"
                            name="name"
                            placeholder="Enter Stakeholder Name"
                            required
                        />

                        <FormInput
                            name="organization"
                            label="Institution/Organization"
                            placeholder="Enter Organization"
                            required
                        />

                        <FormTextArea
                            name="office_address"
                            placeholder="Enter Physical Office Address"
                            label="Physical Office Address"
                            required
                        />

                        <FormSelect
                            name="state"
                            label="State"
                            placeholder="Select State"
                            required
                            options={stateOptions}
                        />

                        <FormInput
                            label="Designation"
                            placeholder="Enter Designation"
                            name="designation"
                            required
                        />

                        <FormInput
                            name="phone_number"
                            label="Phone Number"
                            placeholder="Enter Phone Number"
                            required
                        />

                        <FormInput
                            label="E-Mail"
                            placeholder="Enter Email Address"
                            name="email"
                            required
                        />

                        <FormInput
                            name="project_role"
                            label="Project Role"
                            placeholder="Enter Project Role"
                            required
                        />

                        {id && (
                            <>
                                <FormSelect
                                    name="importance"
                                    label="Importance"
                                    placeholder="Select Importance"
                                    options={importanceOptions}
                                />

                                <FormSelect
                                    name="influence"
                                    label="Influence"
                                    placeholder="Select Influence"
                                    options={importanceOptions}
                                />

                                <FormInput
                                    label="Score"
                                    name="score"
                                    placeholder="Enter Score"
                                    required
                                />
                            </>
                        )}

                        <FormInput
                            name="major_concerns"
                            label="Major Concerns"
                            placeholder="Enter major concerns"
                            required
                        />

                        <FormInput
                            name="relationship_owner"
                            label="Relationship Owner"
                            placeholder="Enter relationship owner"
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
                            loading={isLoading || isUpdateLoading}
                            disabled={isLoading || isUpdateLoading}
                        >
                            {id ? "Update" : "Create"}
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateRegister;
